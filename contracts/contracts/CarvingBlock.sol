// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

// CONNECT YODA
interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount)
        external
        returns (bool);
    function allowance(address owner, address spender)
        external
        view
        returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount)
        external
        returns (bool);
}

contract CarvingBlock {
    // DATA + DEFS
    IERC20 public yoda;

    enum ProjectPhase {
        NewlyListed,
        Booked,
        Started,
        HalfCompleted,
        AllCompleted
    }

    struct Project {
        uint id;
        uint price;
        bool booked;
        address buyer;
        ProjectPhase phase;
    }

    address public seller; // whoever deploys this contract
    mapping(uint => Project) allProjects; // mapping storing project ID -> project
    uint nextProjectID; // id for next project to be added
    uint[] all;
    uint[] completed;
    mapping(address => uint[]) buyerProjects; // mapping storing address buyer -> list of project IDs
    mapping(address => mapping(uint => uint)) projectIndex; // helper
    mapping(address => mapping(uint => bool)) inArray; // helper

    // EVENTS - DONE
    event ProjectListed(uint id);
    event ProjectBooked(uint id);
    event ProjectCanceled(uint id);
    event ProjectStarted(uint id);
    event ProjectCompleted(uint id, bool fullyCompleted);
    event DebugPhase(ProjectPhase phase);
    event DebugBuyer(address buyer);


    // MODIFIERS - DONE
    modifier isSeller() {
        require(msg.sender == seller, "only seller");
        _;
    }
    
    modifier canBook(uint id) { // check project is not booked + msg sender is not seller + project phase == 0
        require(msg.sender != seller, "seller cannot book");
        require(allProjects[id].booked == false, "project taken");
        require(allProjects[id].phase == ProjectPhase.NewlyListed, "project taken");
        _;
    }
    
    modifier canCancel(uint id) { // check project booked + msg.sender owns bookings or is seller
        // require(allProjects[id].booked && (msg.sender == allProjects[id].buyer || msg.sender == seller), "cancel unauthorized");
        require(allProjects[id].booked, "book project first");
        require((msg.sender == allProjects[id].buyer || msg.sender == seller), "cancel unauthorized");
        require(allProjects[id].phase == ProjectPhase.Booked || allProjects[id].phase == ProjectPhase.Started, "cannot cancel after marking complete");
        _;
    }
    
    modifier canStart(uint id) { // check msg sender is not seller, msg sender owns booking, project booked, project phase \geq 1
        require(msg.sender != seller, "seller cannot start project");
        require(allProjects[id].booked == true && allProjects[id].phase == ProjectPhase.Booked, "book project first");
        _;
    }

    modifier canComplete(uint id) { // check msg sender is seller or owns booking + project phase \geq 3
        require(allProjects[id].booked && (msg.sender == allProjects[id].buyer || msg.sender == seller), "completion unauthorized");
        require(allProjects[id].phase == ProjectPhase.HalfCompleted || allProjects[id].phase == ProjectPhase.Started, "start project first");
        _;
    }

    // CONSTRUCTOR - bind to yoda, initialize first project ID to 1, set seller
    constructor(address _yodaAddress) {
        yoda = IERC20(_yodaAddress);
        seller = msg.sender;
        nextProjectID = 1;
    }

    // INTERNAL HELPER FUNCTIONS - DONE
    function addProject(address buyer, uint projectId) internal {
        buyerProjects[buyer].push(projectId);
        projectIndex[buyer][projectId] = buyerProjects[buyer].length - 1;
        inArray[buyer][projectId] = true;
    }

    function removeProject(address buyer, uint projectId) internal {
        require(inArray[buyer][projectId], "not found");
        uint[] storage arr = buyerProjects[buyer];
        uint idx = projectIndex[buyer][projectId];
        uint last = arr[arr.length - 1];
        arr[idx] = last;
        projectIndex[buyer][last] = idx;
        arr.pop();
        inArray[buyer][projectId] = false;
        delete projectIndex[buyer][projectId];
    }

    // BOOKING FUNCTIONS - DONE
    function list(uint price) external isSeller {
        // action: create a project with given values + update allProjects + add id to all + increment nextProjectID
        allProjects[nextProjectID] = Project({
            id: nextProjectID,
            price: price,
            booked: false,
            buyer: address(0),
            phase: ProjectPhase.NewlyListed
        });

        all.push(nextProjectID);
        emit ProjectListed(nextProjectID);
        
        nextProjectID++;
    }
    
    function book(uint id) external canBook(id) {
        // action: set project booked bool to true + set project phase to booked + set project buyer + update buyerProjects
        allProjects[id].booked = true;
        allProjects[id].phase = ProjectPhase.Booked;
        allProjects[id].buyer = msg.sender;
        addProject(msg.sender, id);
        emit ProjectBooked(id);
    }
    
    function cancel(uint id) external canCancel(id) {
        emit DebugPhase(allProjects[id].phase);
        emit DebugBuyer(allProjects[id].buyer);
        // if project started, send back the money
        if (allProjects[id].phase == ProjectPhase.Started) {
            yoda.transfer(allProjects[id].buyer, allProjects[id].price*10**2);
        } 
        
        // action: set project.booked to false + set project phase to 0 + unset project buyer + update buyerProjects
        allProjects[id].booked = false;
        allProjects[id].phase = ProjectPhase.NewlyListed;
        allProjects[id].buyer = address(0);
        

        removeProject(msg.sender, id);
        emit ProjectCanceled(id);
    }
    
    // VIEW FUNCTIONS - DONE
    function viewAll() external view returns (uint[] memory) {
        return all;
    }

    function viewOwn() external view returns (uint[] memory) {
        // NOTE: includes completed projects AND bookings
        return buyerProjects[msg.sender];
    }
    
    function viewCompleted() external view returns (uint[] memory) {
        return completed;
    }

    // YODA FUNCTIONS
    function start(uint id) external payable canStart(id) {
        // action: transfer yoda tokens FOR ASSOCIATED PROJECT from sender to THIS SC to be held + update project phase
        yoda.transferFrom(msg.sender, address(this), allProjects[id].price*10**2);
        allProjects[id].phase = ProjectPhase.Started;
        emit ProjectStarted(id);
    }
    
    function complete(uint id) external payable canComplete(id) {
        // action: transfer yoda tokens FOR ASSOCIATED PROJECT from smart contract to SELLER + update project phase
        
        bool fullyCompleted = false;
        if (allProjects[id].phase == ProjectPhase.Started) {
            allProjects[id].phase = ProjectPhase.HalfCompleted;
        } else {
            // yoda.approve(address(this), allProjects[id].price*10**2);
            yoda.transfer(seller, allProjects[id].price*10**2);
            allProjects[id].phase = ProjectPhase.AllCompleted;
            completed.push(id);
            fullyCompleted = true;
        }

        emit ProjectCompleted(id, fullyCompleted);
    }

    function getYodaBalance() external view returns (uint256) {
        return yoda.balanceOf(msg.sender);
    }
}