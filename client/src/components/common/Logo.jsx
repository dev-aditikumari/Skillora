import { useId } from "react";

// Skillora mark: an "S" with a spark, on an indigo-to-violet tile
export const LogoMark = ({ className = "size-8" }) => {
  const id = useId();
  return (
    <svg viewBox="0 0 48 48" className={className} role="img" aria-label="Skillora logo">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4f46e5" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill={`url(#${id})`} />
      <path
        d="M32 17.5C29.5 14 15 13.5 15 21.5c0 7.5 18 3.5 18 11 0 7.5-14.5 7-18 2.5"
        fill="none"
        stroke="#fff"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="35.5" cy="12.5" r="3.5" fill="#fbbf24" />
    </svg>
  );
};

const Logo = ({ className = "" }) => (
  <span className={`inline-flex items-center gap-2 ${className}`}>
    <LogoMark />
    <span className="text-xl font-extrabold tracking-tight text-slate-900">Skillora</span>
  </span>
);

export default Logo;
