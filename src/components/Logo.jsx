import { vyntraMarkPaths } from "../assets/vyntraMark";

export default function Logo({
  size = 30,
  showWordmark = false,
  className = "",
}) {
  return (
    <span className={`brand ${className}`} role="img" aria-label="Vyntra">
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
      >
        {vyntraMarkPaths.map((path) => (
          <path key={path} d={path} fill="currentColor" />
        ))}
      </svg>
      {showWordmark && <span aria-hidden="true">vyntra</span>}
    </span>
  );
}
