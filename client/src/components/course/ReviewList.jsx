import StarRating from "./StarRating";

const ReviewList = ({ reviews }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Student Reviews</h2>

      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet</p>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map((item) => {
            const firstName = item.user?.firstName || "";
            const lastName = item.user?.lastName || "";
            const fullName = `${firstName} ${lastName}`.trim() || "Former student";

            return (
              <div key={item._id} className="border rounded p-4 flex gap-3">
                {item.user?.image ? (
                  <img
                    src={item.user.image}
                    alt={fullName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold">
                    {(firstName[0] || "?").toUpperCase()}
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium">{fullName}</p>
                    <StarRating rating={item.rating} size="text-sm" />
                    <p className="text-xs text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{item.review}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReviewList;