import {
  DndContext,
  closestCorners,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import Column from "./Column";
import { useJobs } from "../context/JobContext";

const STAGES = [
  { id: "ToApply", title: "To Apply" },
  { id: "Applied", title: "Applied" },
  { id: "Interview", title: "Interview" },
  { id: "Offer", title: "Offer" },
  { id: "Rejected", title: "Rejected" },
];

export default function KanbanBoard({ onCardClick }) {
  const { jobs, moveJob } = useJobs();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const jobId = active.id;
    const newStatus = over.id;

    const job = jobs.find((j) => j._id === jobId);
    if (!job || job.status === newStatus) return;

    moveJob(jobId, newStatus);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
        {STAGES.map((stage) => (
          <Column
            key={stage.id}
            id={stage.id}
            title={stage.title}
            jobs={jobs.filter((job) => job.status === stage.id)}
            onCardClick={onCardClick}
          />
        ))}
      </div>
    </DndContext>
  );
}
