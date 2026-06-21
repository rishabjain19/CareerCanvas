import { useDraggable } from '@dnd-kit/core';

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
      className={`card-surface card-hover cursor-grab active:cursor-grabbing mb-2 ${isDragging ? 'opacity-50' : ''}`}
    >
      <div>
        <p className="font-semibold text-sm text-white">{job.companyName}</p>
        <p className="text-xs small-muted mt-0.5">{job.role}</p>
        {job.salary && <p className="text-xs small-muted mt-1">{job.salary}</p>}
      </div>
    </div>
  );
}
