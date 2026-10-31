import { useState } from "react";

const COLORS = [
  "from-indigo-500 to-violet-500",
  "from-sky-500 to-indigo-500",
  "from-pink-500 to-rose-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
];

// Profile image with a graceful fallback: initials on a coloured tile
// (used when there is no image or it fails to load)
const Avatar = ({ src, firstName = "", lastName = "", className = "size-10", alt }) => {
  const [failed, setFailed] = useState(false);
  const initials = `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase() || "?";
  const name = `${firstName} ${lastName}`.trim();
  const color = COLORS[(initials.charCodeAt(0) + (initials.charCodeAt(1) || 0)) % COLORS.length];

  if (!src || failed) {
    return (
      <span
        role="img"
        aria-label={alt || name || "User"}
        className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${color} font-semibold text-white ${className}`}
      >
        {initials}
      </span>
    );
  }
  return (
    <img
      src={src}
      alt={alt || name || "User"}
      onError={() => setFailed(true)}
      className={`shrink-0 rounded-full object-cover ${className}`}
    />
  );
};

export default Avatar;
