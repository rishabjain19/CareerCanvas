import { useEffect, useState } from "react";
import { useJobs } from "../context/JobContext";
import Navbar from "../components/Navbar";
import KanbanBoard from "../components/KanbanBoard";
import JobModal from "../components/JobModal";
import StatsBar from "../components/StatsBar";

// BoardPage is now the single main screen of the app — it absorbs what used to be
// the separate Dashboard page (stats) since there's no longer a multi-page sidebar nav.
export default function BoardPage() {
  const { jobs, fetchJobs, loading } = useJobs();
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const openNewJobModal = () => {
    setSelectedJob(null);
    setShowModal(true);
  };

  const openEditModal = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedJob(null);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] page-reveal">
      <Navbar />
      <main className="p-6 max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between mb-6 page-reveal page-reveal--soft">
          <div className="board-hero">
            <h2 className="large-title">Job Board</h2>
            <p className="board-hero__copy">Move each application from applied to offer, and keep your profile close when a recruiter asks for more context.</p>
          </div>
          <div>
            <button
              onClick={openNewJobModal}
              className="btn-primary"
            >
              + Add Application
            </button>
          </div>
        </div>

        {loading ? (
          <p className="small-muted">Loading...</p>
        ) : (
          <>
            <div className="mb-6 page-reveal page-reveal--soft">
              <StatsBar jobs={jobs} />
            </div>
            <div className="flex gap-4 page-reveal page-reveal--soft">
              <KanbanBoard onCardClick={openEditModal} />
            </div>
          </>
        )}
      </main>

      {showModal && <JobModal job={selectedJob} onClose={closeModal} />}
    </div>
  );
}
