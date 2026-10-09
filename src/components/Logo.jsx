export default function Logo({
  size = 30,
  showWordmark = false,
  className = "",
}) {
  return (
    <span className={`brand ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
      >
        <path d="M3 6h7l6 17L22 6h7L18 29h-4L3 6Z" fill="currentColor" />
        <path d="M14 3h4v8h-4z" fill="currentColor" />
      </svg>
      {showWordmark && (
        <span>
          vyntra<span className="brand-period">.</span>
        </span>
      )}
    </span>
  );
}
