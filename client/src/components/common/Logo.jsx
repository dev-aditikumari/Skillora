export const LogoMark = ({ className = "size-8" }) => (
  <svg viewBox="0 0 48 48" className={className} role="img" aria-label="Skillora logo">
    <rect width="48" height="48" rx="10" fill="#2563eb" />
    <path
      d="M32 17.5C29.5 14 15 13.5 15 21.5c0 7.5 18 3.5 18 11 0 7.5-14.5 7-18 2.5"
      fill="none"
      stroke="#fff"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Logo = ({ className = "" }) => (
  <span className={`inline-flex items-center gap-2 ${className}`}>
    <LogoMark />
    <span className="text-xl font-bold text-gray-900">Skillora</span>
  </span>
);

export default Logo;
