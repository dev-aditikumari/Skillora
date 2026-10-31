import { Link } from "react-router-dom";

const CourseCard = ({ course }) => (
  <Link
    to={`/courses/${course._id}`}
    className="group card flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-lg"
  >
    <div className="overflow-hidden bg-slate-100">
      <img
        src={course.thumbnail}
        alt={course.courseName}
        loading="lazy"
        className="h-44 w-full object-cover transition duration-300 group-hover:scale-105"
      />
    </div>
    <div className="flex flex-1 flex-col gap-1.5 p-4">
      <h2 className="font-semibold leading-snug text-slate-900 line-clamp-2">{course.courseName}</h2>
      <p className="text-sm text-slate-600 line-clamp-2">{course.courseDescription}</p>
      {course.instructor && (
        <p className="text-xs text-slate-500">
          by {course.instructor.firstName} {course.instructor.lastName}
        </p>
      )}
      <p className="mt-auto pt-3 text-lg font-bold text-slate-900">
        {course.price === 0 ? (
          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-sm font-semibold text-emerald-700">Free</span>
        ) : (
          `₹${course.price}`
        )}
      </p>
    </div>
  </Link>
);

export default CourseCard;
