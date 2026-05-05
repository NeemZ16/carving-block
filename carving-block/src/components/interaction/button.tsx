import './button.css'

type ButtonProps = {
    title: string;
    tooltip?: string;
    action?: () => void;
    className?: string;
    disabled?: boolean
}

export default function Button({title, action, className, tooltip, disabled=false}: ButtonProps) {
    return (
        <button disabled={disabled} className={className} onClick={action} title={tooltip}>{title}</button>
    )
}