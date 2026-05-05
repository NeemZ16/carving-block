import { useState, useEffect } from "react";
import { useCarvingBlock } from "../hooks/walletContext";
import Page from "./pageTemplate";
import ProjectGrid from "../components/projectGrid";
import { getProjectsByIDList } from "../utils/db";
import type { ProjectListingProps } from "../components/projListing";

export default function Home() {
    const [listings, setListings] = useState<ProjectListingProps[]>([])
    const contract = useCarvingBlock();

    // idList = contract.viewAll()
    // listings = getProjectsByIDList() --> filter by state==0 to get available only
    useEffect(() => {
        if (!contract) return;

        contract.viewAll()
            .then((idList: bigint[]) => {
                const ids = idList.map((id) => id.toString());
                return getProjectsByIDList(ids);
            })
            .then((projects: ProjectListingProps[]) => {
                const available = projects.filter((p) => p.state === 0);
                setListings(available);
            })
            .catch((err: any) => {
                console.error("failed to load listings:", err);
            });

    }, [contract]);

    return (
        <Page ptitle="Available Projects" children={<ProjectGrid listings={listings} />} />
    )
}