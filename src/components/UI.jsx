import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
export function PageHeader({ section, title, description, children }) {
  return (
    <header className="page-header">
      <div>
        <p className="kicker">{section}</p>
        <h1>{title}</h1>
        {description && <p className="page-description">{description}</p>}
      </div>
      <div className="header-actions">{children}</div>
    </header>
  );
}
export function DataNote({ live }) {
  return (
    <span className={`status ${live ? "status-live" : ""}`}>
      <span className="status-dot" />
      {live ? "Device data" : "Sample data"}
    </span>
  );
}
export function PanelHeading({ title, description, children }) {
  return (
    <div className="panel-heading">
      <div>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {children}
    </div>
  );
}
export function TextLink({ to, children }) {
  return (
    <Link className="text-link" to={to}>
      {children}
      <ArrowUpRight size={16} />
    </Link>
  );
}
export function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <strong>{label}</strong>
      {payload.map((item) => (
        <p key={item.dataKey}>
          <span style={{ color: item.color }}>{item.name}</span>
          <b>{Number(item.value).toLocaleString()}</b>
        </p>
      ))}
    </div>
  );
}
