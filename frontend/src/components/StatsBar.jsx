import StatsCard from "./StatsCard";

// Renamed conceptually from "Dashboard stats" to "StatsBar" since it now lives
// inline at the top of the Job Board instead of on its own page.
export default function StatsBar({ jobs }) {
  const stats = {
    total: jobs.length,
    applied: jobs.filter((j) => j.status === "Applied").length,
    interviews: jobs.filter((j) => j.status === "Interview").length,
    offers: jobs.filter((j) => j.status === "Offer").length,
  };

  return (
    <div className="flex gap-4 mb-6">
      <StatsCard label="Total" value={stats.total} />
      <StatsCard label="Applied" value={stats.applied} />
      <StatsCard label="Interviews" value={stats.interviews} />
      <StatsCard label="Offers" value={stats.offers} />
    </div>
  );
}
