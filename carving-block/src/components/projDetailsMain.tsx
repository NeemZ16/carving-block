// holds project info and goes into manage booking page
import type { ProjectListingProps } from "../components/projListing";
import { formatDuration } from "./projDetailsTile";
// import { dateDBToRender } from "../utils/convdatetime";
import './proj.css';
import SessionActions from "./manageProjBtns";

type ProjectDetailsMainProps = {
    pdetails: ProjectListingProps | null;
    setProject: (p: ProjectListingProps) => void;
    // scheduling: boolean;
    // setScheduling: (v: boolean) => void;
};

// export default function ProjectDetailsMain({ pdetails, scheduling, setScheduling }: ProjectDetailsMainProps) {
export default function ProjectDetailsMain({ pdetails, setProject }: ProjectDetailsMainProps) {
    if (pdetails) return (
        <div className="main-listing">
            <img src={pdetails.image} alt="" />
            <div className="proj-details">
                <div className="session-details">
                    <div className="sb">
                        <span className="title main">{pdetails.title}</span>
                        <span className="title main highlight" style={{ minWidth: "fit-content" }}>{pdetails.price} Y</span>
                    </div>
                    <div className="sb">
                        <span className="title info">Session Duration:</span>
                        <span className="info" style={{ minWidth: "fit-content" }}>{formatDuration(pdetails.duration)}</span>
                    </div>
                    {/* {pdetails.booked && pdetails.time && (
                        <div className="sb">
                            <span className="title info">Date & Time:</span>
                            <span className="info">{dateDBToRender(pdetails.time)}</span>
                        </div>
                    )} */}
                    {pdetails.description && (<p className="info"><span className="title">Description: </span>{pdetails.description}</p>)}
                </div>
                {/* <SessionActions state={pdetails.state} scheduling={scheduling} setScheduling={setScheduling}/> */}
                <SessionActions project={pdetails} setProject={setProject}/>
            </div>
        </div>
    ) 
    else return null;
}