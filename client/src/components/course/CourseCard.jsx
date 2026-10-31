import { Link } from "react-router-dom";
import StarRating from "./StarRating";
import { plural } from "../../utils/plural";

const CourseCard = ({ course }) => (
  <Link
    to={`/courses/${course._id}`}
    className="group card flex flex-col overflow-hidden transition duration-200 hover:-translate-y-1 hover:shadow-xl"
  >
    <div className="relative overflow-hidden bg-slate-100">
      <img
        src={course.thumbnail}
        alt={course.courseName}
        loading="lazy"
        className="aspect-video w-full object-cover transition duration-500 group-hover:scale-105"
      />
      {course.category?.name && (
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-indigo-700 shadow-sm backdrop-blur">
          {course.category.name}
        </span>
      )}
    </div>

    <div className="flex flex-1 flex-col gap-2 p-4">
      <h2 className="font-semibold leading-snug text-slate-900 line-clamp-2 group-hover:text-indigo-700">
        {course.courseName}
      </h2>
      <p className="text-sm text-slate-600 line-clamp-2">{course.courseDescription}</p>
      {course.instructor && (
        <p className="text-xs text-slate-500">
          by {course.instructor.firstName} {course.instructor.lastName}
        </p>
      )}

      <div className="flex items-center gap-2 text-xs text-slate-500">
        {course.ratingCount > 0 ? (
          <>
            <span className="font-semibold text-amber-600">{course.averageRating}</span>
            <StarRating rating={course.averageRating} size="text-sm" />
            <span>({course.ratingCount})</span>
          </>
        ) : (
          <span>New</span>
        )}
        {course.students > 0 && <span className="ml-auto">{plural(course.students, "student")}</span>}
      </div>

      <div className="mt-auto flex items-center justify-between border-t pt-3">
        {course.price === 0 ? (
          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-sm font-semibold text-emerald-700">Free</span>
        ) : (
          <span className="text-lg font-bold text-slate-900">₹{course.price}</span>
        )}
        <span className="text-sm font-medium text-indigo-600 opacity-0 transition group-hover:opacity-100">View course →</span>
      </div>
    </div>
  </Link>
);

export default CourseCard;
