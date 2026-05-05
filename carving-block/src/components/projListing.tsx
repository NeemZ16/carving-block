import { Link } from "react-router";
import ProjectDetails from "./projDetailsTile";
import { dateDBToRender } from "../utils/convdatetime";
import './proj.css';

export type ProjectListingProps = {
    id: string;
    title: string;
    price: number;
    duration: number;
    image: string;
    booked: boolean;
    state: 0 | 1 | 2 | 3 | 4; // not completed, unbooked | booked | started | 1 marked complete | all marked complete
    time?: number;
    description?: string;
    completedBuyerSeller?: any; // any for TS purposes, but actually 0 all 1 buyer only 2 seller only
}

export default function ProjectListing({ id, title, price, duration, image, booked = false, time, description }: ProjectListingProps) {
    return (
        <Link to={`/view-proj/${id}`} className="listing-link">
            <div className={`listing ${booked ? "horizontal" : ""}`}>
                <img src={image} alt="" />
                <div className="session-details">
                    <ProjectDetails title={title} price={price} duration={duration} description={description} />
                    {booked && time && <p className="highlight">{dateDBToRender(time)}</p>}
                </div>
            </div>
        </Link>
    )
}