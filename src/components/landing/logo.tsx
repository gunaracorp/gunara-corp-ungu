export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <g
        className="animate-[spin360_16s_linear_infinite]"
        style={{ transformOrigin: "24px 24px" }}
      >
        <circle
          cx="24"
          cy="24"
          r="21"
          stroke="url(#logo-gold)"
          strokeWidth="2.2"
          strokeDasharray="6 5"
        />
        <circle cx="24" cy="3" r="3" fill="#7c3aed" />
      </g>
      {/* Gateway arch — the Gunara gate */}
      <path
        d="M13 33 L13 22 A11 11 0 0 1 35 22 L35 33"
        stroke="url(#logo-gold)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="24" cy="27.5" r="4.5" fill="url(#logo-gold)" />
      <defs>
        <linearGradient id="logo-gold" x1="0" y1="0" x2="48" y2="48">
          <stop stopColor="#7c3aed" />
          <stop offset="1" stopColor="#2563eb" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Wordmark() {
  return (
    <span className="leading-none">
      <span className="block font-display text-sm font-bold tracking-[0.3em] text-slate-900">
        GUNARA CONSULTAN
      </span>
      <span className="mt-1 block text-[9px] font-semibold tracking-[0.5em] text-violet-600">
        CORPORATION
      </span>
    </span>
  );
}
