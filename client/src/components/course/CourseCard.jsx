import { Link } from "react-router-dom";

const CourseCard = ({ course }) => (
  <Link
    to={`/courses/${course._id}`}
    className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow flex flex-col bg-white"
  >
    <img
      src={course.thumbnail}
      alt={course.courseName}
      className="w-full h-40 object-cover"
    />
    <div className="p-4 flex flex-col gap-1 flex-1">
      <h2 className="font-semibold">{course.courseName}</h2>
      <p className="text-sm text-gray-600 line-clamp-2">{course.courseDescription}</p>
      {course.instructor && (
        <p className="text-xs text-gray-500">
          by {course.instructor.firstName} {course.instructor.lastName}
        </p>
      )}
      <p className="font-bold mt-auto pt-2">₹{course.price}</p>
    </div>
  </Link>
);

export default CourseCard;