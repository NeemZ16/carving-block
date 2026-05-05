// NOTE: this button has 2 states:
// 1. user has not marked complete - clickable, button text says "mark complete"
// 2. user has marked complete - disabled, button text says "marked complete!"
//      - <Button title="mark complete" className="green" tooltip="waiting for other party to mark complete. funds yet to transfer."/>

import Button from "./button";

type CompleteButtonProps = {
    disabled?: boolean;
    action?: () => void;
}

export default function CompleteButton({disabled=false, action}: CompleteButtonProps) {
    if (disabled) {
        return (
            <Button title="marked complete! waiting for other..." className="green" tooltip="waiting for other party to mark complete. funds yet to transfer." disabled={true}/>
        )
    }
    return (
        <Button title="mark complete" className="green" tooltip="transfer from SC to seller wallet" action={action} />
    )
}