import { useState } from "react";
import toast from "react-hot-toast";
import { createRating } from "../../services/operations/ratingAPI";

const ReviewModal = ({ courseId, onClose, onSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (review.trim() === "") {
      toast.error("Please write a review");
      return;
    }

    setLoading(true);
    const ok = await createRating({ courseId, rating, review: review.trim() });
    setLoading(false);

    if (ok) {
      onSubmitted();
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded p-6 w-full max-w-md flex flex-col gap-4"
      >
        <h2 className="text-xl font-semibold">Add Review</h2>

        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className={`text-3xl ${
                star <= (hover || rating) ? "text-yellow-400" : "text-gray-300"
              }`}
              aria-label={`${star} star${star > 1 ? "s" : ""}`}
            >
              ★
            </button>
          ))}
        </div>

        <div>
          <textarea
            rows={4}
            maxLength={500}
            placeholder="Share your experience"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="border rounded p-2 w-full"
          />
          <p className="text-xs text-gray-500 text-right">{review.length}/500</p>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewModal;