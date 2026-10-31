import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchEnrolledCourses } from "../../services/operations/profileAPI";
import Spinner from "../../components/common/Spinner";

const EnrolledCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      const result = await fetchEnrolledCourses();
      setCourses(result);
      setLoading(false);
    };
    loadCourses();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold mb-6">Enrolled Courses</h1>

      {courses.length === 0 ? (
        <div className="flex flex-col gap-4 items-start">
          <p className="text-gray-500">You haven't enrolled in any courses yet</p>
          <Link
            to="/"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Browse courses
          </Link>
        </div>
      ) : (
        courses.map((course) => {
         const {totalLectures, completedLectures , progressPercentage} = course;
         let buttonLabel = "Continue";
         if(progressPercentage === 0)buttonLabel ="Start";
         if(progressPercentage === 100)buttonLabel="Review";

          return (
            <div key={course._id} className="flex items-center gap-4 border-b py-4">
              <img
                src={course.thumbnail}
                alt={course.courseName}
                className="w-32 h-20 object-cover rounded"
              />

              <div className="flex-1">
                <p className="font-semibold">{course.courseName}</p>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {course.courseDescription}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  by {course.instructor.firstName} {course.instructor.lastName}
                  {" · "}
                  {totalLectures} lectures
                </p>
                {totalLectures === 0 ? (
  <p className="text-xs text-gray-400 mt-2">No lectures yet</p>
) : (
  <div className="mt-2">
    <div className="h-2 bg-gray-200 rounded w-64">
      <div
        className="h-2 bg-indigo-600 rounded"
        style={{ width: `${progressPercentage}%` }}
      />
    </div>
    <p className="text-xs text-gray-500 mt-1">
      {completedLectures} of {totalLectures} lectures · {progressPercentage}%
    </p>
  </div>
)}

              </div>

              <button
                onClick={() => navigate(`/view-course/${course._id}`)}
                className="bg-indigo-600 text-white px-4 py-2 rounded"
              >
               {buttonLabel}
              </button>
            </div>
          );
        })
      )}
    </div>
  );
};

export default EnrolledCourses;