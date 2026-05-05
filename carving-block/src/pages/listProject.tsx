import { useState } from "react";
import Page from "./pageTemplate";
import { storeProjectDetails, uploadImage } from "../utils/db";
import { useCarvingBlock } from "../hooks/walletContext";
import type { ProjectListingProps } from "../components/projListing";

type ProjectForm = {
    title: string;
    price: number;
    duration: number;
    image: string;
    description?: string;
};

export default function ListProject() {
    const contract = useCarvingBlock()
    const [form, setForm] = useState<ProjectForm>({
        title: "",
        price: 0,
        duration: 0,
        image: "",
        description: "",
    });

    function handleListProject() {
        contract?.list(form.price)
            .then((tx) => tx.wait())
            // get ID from adding in SC and filtering event logs
            .then((receipt) => {
                const event = receipt.logs
                    .map((log: any) => contract.interface.parseLog(log))
                    .find((e: any) => e?.name === "ProjectListed");

                const id = Number(event?.args?.id);
                console.log("New project ID:", id);

                if (!id) return;

                if (!id || !form.image) return;

                // return uploadImage(form.image).then((imageUrl) => {
                //     const projectDetails: ProjectListingProps = {
                //         id: String(id),
                //         title: form.title,
                //         price: form.price,
                //         duration: form.duration,
                //         image: imageUrl,
                //         booked: false,
                //         state: 0,
                //         description: form.description,
                //     };

                //     return storeProjectDetails(projectDetails);
                // });
                const projectDetails: ProjectListingProps = {
                    id: String(id),
                    title: form.title,
                    price: form.price,
                    duration: form.duration,
                    image: form.image,
                    booked: false,
                    state: 0,
                    description: form.description,
                };
                return storeProjectDetails(projectDetails);
            });
    }

    return (
        <Page ptitle="List Project">
            {/* create a form with the fields above */}
            <form onSubmit={(e) => {
                e.preventDefault();
                handleListProject();
            }}>
                <input
                    placeholder="Title"
                    value={form.title}
                    onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                    }
                />

                <input
                    type="number"
                    placeholder="Price"
                    value={form.price}
                    onChange={(e) =>
                        setForm({ ...form, price: Number(e.target.value) })
                    }
                />

                <input
                    type="number"
                    placeholder="Duration"
                    value={form.duration}
                    onChange={(e) =>
                        setForm({ ...form, duration: Number(e.target.value) })
                    }
                />

                {/* <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setForm({ ...form, image: file as any });
                    }}
                /> */}
                <input
                    placeholder="Image URL"
                    value={form.image}
                    onChange={(e) =>
                        setForm({ ...form, image: e.target.value })
                    }
                />

                <textarea
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                    }
                />

                <button type="submit">Submit</button>
            </form>
        </Page >
    )
}