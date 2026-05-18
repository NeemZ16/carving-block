# DApp - The Carving `Block`

**Deployed Contract:** `0xeFA9e9468D8339a63d6f73b5850DBBE8da56B47B`  
**Deployed Frontend:** https://neemz16.github.io/carving-block/

The Carving `Block` is a decentralized marketplace dApp where a single seller can list woodcarving projects for sale for some amount of Yoda tokens. The project is running on the Sepolia testnet.

## Local Deployment Instructions
Ensure you have npm and node installed. Clone the repository and make sure all dependencies are installed for both the frontend and hardhat:
```
cd carving-block
npm i
cd ../contracts
npm i
cd ..
```

Navigate to [contracts](./contracts/) and start a local hardhat node:
```
npx hardhat node
```  

Deploy contracts using [deployAll.js](./contracts/scripts/deployAll.js):
```
npx hardhat run scripts/deployAll.js --network localhost
```

This should output addresses for Yoda and CarvingBlock. Copy these addresses and paste them into their respective fields at the top of [walletContext.jsx](./carving-block/src/hooks/walletContext.tsx)  

Navigate to [carving-block](./carving-block/) and start the frontend:
```
npm run dev
```
