// view/manage page
// uses components ProjDetailsMain along with props for manageProjBtns
// uses component BookTimefor calendar and conditional rendering

import { useState, useEffect } from "react";
import { useParams } from "react-router";
import type { ProjectListingProps } from "../components/projListing";
import Page from "./pageTemplate";
// import Button from "../components/interaction/button";
import ProjectDetailsMain from "../components/projDetailsMain";
import { getProjectDetails } from "../utils/db";
// import { useCarvingBlock } from "../hooks/walletContext";
// import { dateInputToDB } from "../utils/convdatetime";
// import { dateInputToDB, dateDBToRender } from "../utils/convdatetime";

export default function ViewManageBooking() {
//     const scheduling = true;
//     const id = useParams().projectID;
//     const [projectDetails, setProjectDetails] = useState<ProjectListingProps>()
//     const [pageTitle, setPageTitle] = useState("View Project")

//     // TODO: get actual project details on load from src/utils/db.tsx: getProjectDetails(id)
//     // TODO: after getting details, set title based on booked value
//     // let title = projectDetails?.booked ? "Manage Booking" : "View Project"

//     return (
//         <Page ptitle={pageTitle}>
//             <ProjectDetailsMain {...projectDetails} />
//             {projectDetails?.booked && scheduling && (
//                 <>
//                     <h2>Select Date & Time</h2>
//                     <input type="datetime-local" name="" id="" style={{ marginRight: "var(--xs)" }} />
//                     <Button title="set time" />
//                 </>
//             )}
//         </Page>
//     )
// }



    // const [scheduling, setScheduling] = useState(false);
    const { projectID } = useParams();
    const id = projectID;

    const [projectDetails, setProjectDetails] = useState<ProjectListingProps | null>(null);
    const [pageTitle, setPageTitle] = useState("View Project");
    // const [selectedTime, setSelectedTime] = useState<string|any>("");
    // const contract = useCarvingBlock()

    useEffect(() => {
        if (!id) return;
        getProjectDetails(id)
            .then((data) => {
                if (!data) return;
                setProjectDetails(data);
                if (data.booked) {
                    setPageTitle("Manage Booking");
                } else {
                    setPageTitle("View Project");
                }
            })
            .catch((err) => {
                console.error("Failed to load project:", err);
            });
    }, [id]);

    if (!projectDetails) {
        return <Page ptitle="Loading...">Loading...</Page>;
    }

    // function handleSetTime() {
    //     console.log("SET TIME TRIGGERED")
    //     // if project details phase is 0 then useCarvingBlock and call function book(id)
    //     if (projectDetails?.state == 0) {
    //         contract?.book(id)
    //     }

    //     // update associated session time in firebase
    //     console.log("TIME:", dateInputToDB(selectedTime))
    //     setBookingTime(id, dateInputToDB(selectedTime))
    // }

    return (
        <Page ptitle={pageTitle}>
            {/* <ProjectDetailsMain pdetails={projectDetails} scheduling={scheduling} setScheduling={setScheduling}/> */}
            <ProjectDetailsMain pdetails={projectDetails} setProject={setProjectDetails}/>
            {/* {scheduling && (
                <>
                    <h2>Select Date & Time</h2>
                    <input
                        type="datetime-local"
                        style={{ marginRight: "var(--xs)" }}
                    />
                    <Button title="set time" action={() => handleSetTime()}/>
                </>
            )} */}
        </Page>
    );
}