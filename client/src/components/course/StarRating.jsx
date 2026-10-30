const StarRating = ({ rating = 0, size = "text-lg" }) => {
  const safe = Math.min(5, Math.max(0, Number(rating) || 0));
  const percent = (safe / 5) * 100;

  return (
    <span
      className={`relative inline-block leading-none ${size}`}
      aria-label={`${safe} out of 5 stars`}
    >
      <span className="text-gray-300">★★★★★</span>
      <span
        className="absolute left-0 top-0 overflow-hidden whitespace-nowrap text-yellow-400"
        style={{ width: `${percent}%` }}
      >
        ★★★★★
      </span>
    </span>
  );
};

export default StarRating;