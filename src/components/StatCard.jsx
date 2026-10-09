import { Footprints, Heart, Flame, Moon } from "lucide-react";
const icons = { activity: Footprints, heart: Heart, fire: Flame, moon: Moon };
export default function StatCard({
  title,
  value,
  goal,
  status,
  icon = "activity",
  detail,
}) {
  const Icon = icons[icon] || Footprints;
  const numeric = Number(String(value).replace(/,/g, ""));
  const percent = goal ? Math.max(0, Math.min((numeric / goal) * 100, 100)) : 0;
  return (
    <article className="stat-card">
      <div className="stat-label">
        <span>{title}</span>
        <Icon size={18} strokeWidth={1.6} />
      </div>
      <div className="stat-number">
        {value}
        <span>{status}</span>
      </div>
      {goal ? (
        <>
          <div
            className="metric-track"
            role="progressbar"
            aria-label={`${title} goal`}
            aria-valuenow={Math.round(percent)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <span style={{ width: `${percent}%` }} />
          </div>
          <p>
            {Math.round(percent)}% of {goal.toLocaleString()} daily target
          </p>
        </>
      ) : (
        <p>{detail || "Today's reading"}</p>
      )}
    </article>
  );
}
