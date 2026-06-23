export default function StatsCard({ label, value }) {
  return (
    <div className="stats-card reveal-card">
      <p className="stats-card__value">{value}</p>
      <p className="stats-card__label">{label}</p>
    </div>
  );
}
