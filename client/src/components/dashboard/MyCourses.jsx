import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchInstructorCourses, deleteCourse } from "../../services/operations/courseAPI";
import Spinner from "../../components/common/Spinner";
import { plural } from "../../utils/plural";

const MyCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      const result = await fetchInstructorCourses();
      setCourses(result);
      setLoading(false);
    };
    loadCourses();
  }, []);

  const handleDelete = async (courseId) => {
    if (!window.confirm("Delete this course?")) return;
    const ok = await deleteCourse(courseId);
    if (ok) {
      setCourses((prev) => prev.filter((c) => c._id !== courseId));
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Courses</h1>
        <Link
          to="/dashboard/add-course"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Course
        </Link>
      </div>

      {courses.length === 0 ? (
        <p className="text-gray-500">You haven't created any courses yet</p>
      ) : (
        courses.map((course) => (
          <div key={course._id} className="flex items-center gap-4 border-b py-4">
            <img
              src={course.thumbnail}
              alt={course.courseName}
              className="w-32 h-20 object-cover rounded"
            />

            <div className="flex-1">
              <p className="font-semibold">{course.courseName}</p>
              <p className="text-sm text-gray-600 line-clamp-2">{course.courseDescription}</p>
            </div>

            <span
              className={
                course.status === "Draft"
                  ? "text-xs px-2 py-1 rounded bg-gray-200 text-gray-700"
                  : "text-xs px-2 py-1 rounded bg-green-100 text-green-700"
              }
            >
              {course.status}
            </span>

            <p className="w-20">₹{course.price}</p>
            <p className="w-24 text-sm text-gray-600">{plural(course.courseContent.length, "section")}</p>

            <button
              onClick={() => navigate(`/dashboard/edit-course/${course._id}`)}
              className="px-3 py-1 border rounded hover:bg-gray-100"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(course._id)}
              className="px-3 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default MyCourses;