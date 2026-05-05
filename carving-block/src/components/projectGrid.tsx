import ProjectListing from "../components/projListing";
import type { ProjectListingProps } from "../components/projListing";

type ListProjectProps = {
    listings: ProjectListingProps[]
}

export default function ProjectGrid({ listings }: ListProjectProps) {
    // listings is listing data objects to be passed in to ProjectListing component
    return (
        <div className="item-grid">
            {/* for i in listings pass params to new ProjectListing */}
            {listings.map((item, i) => (
                <ProjectListing key={i} {...item}/>
            ))}
        </div>
    )
}