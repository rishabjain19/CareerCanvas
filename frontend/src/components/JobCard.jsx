import { useDraggable } from "@dnd-kit/core";

export default function JobCard({ job, onClick }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: job._id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 50,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={() => onClick(job)}
      className={`job-card ${isDragging ? "opacity-50 scale-105 shadow-xl" : ""}`}
    >
      <p className="job-card__company">{job.companyName}</p>
      <p className="job-card__role">{job.role}</p>
      {job.salary && <p className="job-card__salary">{job.salary}</p>}
    </div>
  );
}
