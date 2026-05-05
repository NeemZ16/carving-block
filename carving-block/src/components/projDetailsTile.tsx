type ProjectDetailsProps = {
    title: string;
    price: number;
    duration: number;
    description?: string
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) {
    return `${mins}m`;
  }

  return `${hours}h ${mins.toString().padStart(2, "0")}m`;
}

export default function ProjectDetails({title, price, duration, description}: ProjectDetailsProps) {
    return (
        <div className="proj-details">
            <div className="sb">
                <span className="title">{title}</span>
                <span className="title highlight" style={{minWidth: "fit-content"}}>{price} Y</span>
            </div>
            <div className="sb">
                <span className="title info">Session Duration:</span>
                <span className="info" style={{minWidth: "fit-content"}}>{formatDuration(duration)}</span>
            </div>
            {description && (<p className="info preview"><span className="title">Description: </span>{description}</p>)}
        </div>
    )
}