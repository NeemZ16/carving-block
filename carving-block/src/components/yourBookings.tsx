import { useState, useEffect } from "react";
import ProjectListing from "../components/projListing";
import { getProjectsByIDList } from "../utils/db";
import type { ProjectListingProps } from "../components/projListing";
import { useCarvingBlock } from "../hooks/walletContext";

// type BookedProjectsProps = {
//     bookings: ProjectListingProps[]
// }

export default function YourBookings() {
    const [bookings, setBookings] = useState<ProjectListingProps[]>([])
    const contract = useCarvingBlock();

    useEffect(() => {
            if (!contract) return;
            console.log(contract);
    
            contract.viewOwn()
                .then((idList: bigint[]) => {
                    const ids = idList.map((id) => id.toString());
                    return getProjectsByIDList(ids);
                })
                .then((projects: ProjectListingProps[]) => {
                    setBookings(projects);
                })
                .catch((err: any) => {
                    console.error("failed to load listings:", err);
                });
    
        }, [contract]);

    return (
        <section style={{maxHeight: "calc(100% - 5*var(--l))"}}>
            <h2>Your Bookings</h2>
            <div className="item-list">
                {/* for i in listings pass params to new ProjectListing */}
                {bookings.map((item, i) => (
                    <ProjectListing key={i} {...item} />
                ))}
            </div>
        </section>
    )
}