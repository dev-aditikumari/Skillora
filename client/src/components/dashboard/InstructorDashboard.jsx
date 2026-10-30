import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchInstructorStats } from "../../services/operations/courseAPI";

const formatMoney = (amount) => `₹${Number(amount).toLocaleString("en-IN")}`;

const StatCard = ({ label, value }) => (
  <div className="border rounded p-4">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-2xl font-bold mt-1">{value}</p>
  </div>
);

const BarChart = ({ courses, metric }) => {
  const max = Math.max(...courses.map((c) => c[metric]), 0);

  return (
    <div className="flex flex-col gap-3">
      {courses.map((course) => {
        const value = course[metric];
        const width = max === 0 ? 0 : Math.round((value / max) * 100);

        return (
          <div key={course._id}>
            <div className="flex justify-between text-sm mb-1">
              <span className="truncate pr-4">{course.courseName}</span>
              <span className="text-gray-600">
                {metric === "revenue" ? formatMoney(value) : value}
              </span>
            </div>
            <div className="h-3 bg-gray-100 rounded">
              <div
                className="h-3 bg-indigo-600 rounded"
                style={{ width: `${width}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const InstructorDashboard = () => {
  const { user } = useSelector((state) => state.profile);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [metric, setMetric] = useState("students"); // "students" | "revenue"

  useEffect(() => {
    const load = async () => {
      const data = await fetchInstructorStats();
      setStats(data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!stats) return <p className="text-gray-500">Could not load your dashboard</p>;

  const { totals, courses } = stats;

  return (
    <div className="max-w-5xl flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold">Hi {user?.firstName} 👋</h1>
        <p className="text-gray-500">Here is how your courses are doing</p>
      </div>

      {courses.length === 0 ? (
        <div className="flex flex-col gap-4 items-start">
          <p className="text-gray-500">You haven't created any courses yet</p>
          <Link
            to="/dashboard/add-course"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Create your first course
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total courses" value={totals.totalCourses} />
            <StatCard label="Published" value={totals.publishedCourses} />
            <StatCard label="Students" value={totals.totalStudents} />
            <StatCard label="Revenue" value={formatMoney(totals.totalRevenue)} />
          </div>

          <div className="border rounded p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">By course</h2>
              <div className="flex gap-2">
                {["students", "revenue"].map((key) => (
                  <button
                    key={key}
                    onClick={() => setMetric(key)}
                    className={`px-3 py-1 rounded text-sm ${
                      metric === key
                        ? "bg-indigo-600 text-white"
                        : "border hover:bg-gray-100"
                    }`}
                  >
                    {key === "students" ? "Students" : "Revenue"}
                  </button>
                ))}
              </div>
            </div>
            <BarChart courses={courses} metric={metric} />
          </div>
        </>
      )}
    </div>
  );
};

export default InstructorDashboard;