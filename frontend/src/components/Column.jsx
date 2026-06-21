import { useDroppable } from '@dnd-kit/core';
import JobCard from './JobCard';

export default function Column({ id, title, jobs, onCardClick }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  const colMap = {
    ToApply: 'col-toapply',
    Applied: 'col-applied',
    Interview: 'col-interview',
    Offer: 'col-offer',
    Rejected: 'col-rejected',
  };
  const colClass = colMap[id] || '';

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-w-[220px] column-surface ${colClass} ${isOver ? 'ring-2 ring-[rgba(86,124,141,0.18)]' : ''}`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <span className="text-xs bg-[rgba(255,255,255,0.03)] text-white rounded-full px-2 py-0.5">
          {jobs.length}
        </span>
      </div>
      <div className="min-h-[100px]">
        {jobs.map((job) => (
          <JobCard key={job._id} job={job} onClick={onCardClick} />
        ))}
      </div>
    </div>
  );
}
