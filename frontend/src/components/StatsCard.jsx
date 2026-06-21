export default function StatsCard({ label, value }) {
  return (
    <div className="card-surface flex-1 text-center">
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm small-muted mt-1">{label}</p>
    </div>
  );
}
