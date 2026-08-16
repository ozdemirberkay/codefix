export function Logo() {
  return (
    <div className="logo">
      <svg
        className="logo-mark"
        viewBox="0 0 32 32"
        role="img"
        aria-label="CodeFix"
      >
        <rect width="32" height="32" rx="8" fill="var(--accent)" />
        <g
          fill="none"
          stroke="#ffffff"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11.2 11.6 7.4 16l3.8 4.4" strokeWidth="2.2" opacity="0.72" />
          <path d="m14.8 17.8 3 3 6.8-8.4" strokeWidth="3.2" />
        </g>
      </svg>
      <span className="logo-text">CodeFix</span>
    </div>
  );
}
