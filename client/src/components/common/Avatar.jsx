import { useState } from "react";

const COLORS = ["bg-blue-600", "bg-green-600", "bg-rose-500", "bg-amber-600", "bg-purple-600"];

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
        className={`flex shrink-0 items-center justify-center rounded-full ${color} font-semibold text-white ${className}`}
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
