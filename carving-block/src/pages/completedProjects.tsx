import Page from "./pageTemplate";
import ProjectGrid from "../components/projectGrid";
import type { ProjectListingProps } from "../components/projListing";
import { useState, useEffect } from "react";
import { useCarvingBlock } from "../hooks/walletContext";
import { getProjectsByIDList } from "../utils/db";

export default function CompletedProjects() {
    const [listings, setListings] = useState<ProjectListingProps[]>([])
    const contract = useCarvingBlock();

    useEffect(() => {
            if (!contract) return;
    
            contract.viewCompleted()
                .then((idList: bigint[]) => {
                    const ids = idList.map((id) => id.toString());
                    return getProjectsByIDList(ids);
                })
                .then((projects: ProjectListingProps[]) => {
                    const available = projects.filter((p) => p.state === 4);
                    setListings(available);
                })
                .catch((err: any) => {
                    console.error("failed to load listings:", err);
                });
    
        }, [contract]);

    return (
        <Page ptitle="Completed Projects" >
            {/* <div className="completed-container"> */}
                {/* <h2>By You</h2>
                <ProjectGrid listings={dummyListings} /> */}
                {/* <hr className="dashed"/> */}
                {/* <h2>All</h2> */}
                <ProjectGrid listings={listings} />
            {/* </div> */}
        </Page>
    )
}