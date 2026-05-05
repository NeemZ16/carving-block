import Button from "./interaction/button";
import CompleteButton from "./interaction/btnComplete";
import { useCarvingBlock, useWallet } from "../hooks/walletContext";
import { storeProjectDetails } from "../utils/db";
import type { ProjectListingProps } from "./projListing";

type SessionActionsProps = {
    project: ProjectListingProps;
    setProject: (p: ProjectListingProps) => void;
};

export default function SessionActions({ project, setProject }: SessionActionsProps) {
    const contract = useCarvingBlock();
    const { isSeller } = useWallet();
    const numericId = Number(project.id);
    const state = project.state;
    const cState: any = project.completedBuyerSeller

    function handleBook() {
        if (!contract) return;

        contract.book(numericId)
            .then((tx: any) => tx.wait())
            .then(() => {
                const updated: ProjectListingProps = {
                    ...project,
                    booked: true,
                    state: 1,
                };

                return storeProjectDetails(updated)
                    .then(() => setProject(updated));
            })
            .catch(console.error);
    }

    function handleCancel() {
        if (!contract) return;

        contract.cancel(numericId)
            .then((tx: any) => tx.wait())
            .then(() => {
                const updated: ProjectListingProps = {
                    ...project,
                    booked: false,
                    state: 0,
                    time: 0,
                };

                return storeProjectDetails(updated)
                    .then(() => setProject(updated));
            })
            .catch(console.error);
    }

    function handleStart() {
        if (!contract) return;

        contract.start(numericId)
            .then((tx: any) => tx.wait())
            .then(() => {
                const updated: ProjectListingProps = {
                    ...project,
                    state: 2,
                };

                return storeProjectDetails(updated)
                    .then(() => setProject(updated));
            })
            .catch(console.error);
    }

    function handleComplete() {
        console.log("COMPLETING BEFORE TX WAIT")
        if (!contract) return;

        contract.complete(numericId)
            .then((tx: any) => {
                console.log("COMPLETE TX:", tx)
                tx.wait();
            })
            .then(() => {
                console.log("COMPLETING AFTER TX WAIT")
                let nextState = project.state;

                if (project.state === 2) nextState = 3;
                else if (project.state === 3) nextState = 4;

                const updated: ProjectListingProps = {
                    ...project,
                    state: nextState,
                    // if exists then set 0 (all completed)
                    // else check if seller and set accordingly
                    completedBuyerSeller:
                        project.completedBuyerSeller !== undefined
                            ? 0
                            : (isSeller ? 2 : 1)

                };

                return storeProjectDetails(updated)
                    .then(() => setProject(updated));
            })
            .catch(console.error);
    }

    // -------------------- RENDER --------------------

    if (state === 4) {
        return (
            <div className="session-actions">
                <p className="highlight">This project has been completed!</p>
            </div>
        );
    }

    if (state === 3) {
        const isEnabled =
            (isSeller && cState === 1) ||
            (!isSeller && cState === 2);

        return (
            <div className="session-actions">
                <CompleteButton
                    disabled={!isEnabled}
                    {...(isEnabled && { action: handleComplete })}
                />
            </div>
        );
    }

    if (state === 2) {
        return (
            <div className="session-actions">
                <div className="horz">
                    <Button
                        title="cancel booking"
                        className="red"
                        action={handleCancel}
                    />
                    <CompleteButton action={handleComplete} />
                </div>
            </div>
        );
    }

    if (state === 1) {
        return (
            <div className="session-actions">
                <div className="horz">
                    <Button
                        title="cancel booking"
                        className="red"
                        action={handleCancel}
                    />
                    <Button
                        title="start project!"
                        className="green"
                        tooltip="transfer payment to smart contract"
                        action={handleStart}
                    />
                </div>
            </div>
        );
    }

    // state === 0
    return (
        <div className="session-actions">
            <Button
                title="book session!"
                className="yellow"
                action={handleBook}
            />
        </div>
    );
}