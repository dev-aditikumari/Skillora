import { Link } from "react-router-dom";
import StarRating from "./StarRating";
import { plural } from "../../utils/plural";

const CourseCard = ({ course }) => (
  <Link
    to={`/courses/${course._id}`}
    className="card flex flex-col overflow-hidden hover:shadow-md"
  >
    <img
      src={course.thumbnail}
      alt={course.courseName}
      loading="lazy"
      className="aspect-video w-full object-cover"
    />

    <div className="flex flex-1 flex-col gap-1.5 p-4">
      {course.category?.name && <p className="text-xs text-blue-600">{course.category.name}</p>}
      <h2 className="font-semibold leading-snug line-clamp-2">{course.courseName}</h2>
      <p className="text-sm text-gray-600 line-clamp-2">{course.courseDescription}</p>
      {course.instructor && (
        <p className="text-xs text-gray-500">
          {course.instructor.firstName} {course.instructor.lastName}
        </p>
      )}

      <div className="flex items-center gap-2 text-xs text-gray-500">
        {course.ratingCount > 0 ? (
          <>
            <span>{course.averageRating}</span>
            <StarRating rating={course.averageRating} size="text-sm" />
            <span>({course.ratingCount})</span>
          </>
        ) : (
          <span>No ratings yet</span>
        )}
        {course.students > 0 && <span className="ml-auto">{plural(course.students, "student")}</span>}
      </div>

      <p className="mt-auto pt-2 text-lg font-bold">{course.price === 0 ? "Free" : `₹${course.price}`}</p>
    </div>
  </Link>
);

export default CourseCard;
