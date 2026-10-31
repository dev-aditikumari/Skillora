import { useEffect, useState } from "react";
import {
  fetchAdminStats, fetchUsers, setUserActive, fetchAdminCourses, createCategory, fetchCategories,
} from "../../services/operations/adminAPI";
import Spinner from "../../components/common/Spinner";

const StatCard = ({ label, value }) => (
  <div className="border rounded-lg p-4">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [roleFilter, setRoleFilter] = useState("");
  const [category, setCategory] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(true);

  const loadStats = async () => setStats(await fetchAdminStats());
  const loadCategories = async () => setCategories(await fetchCategories());

  useEffect(() => {
    (async () => {
      await Promise.all([
        loadStats(),
        loadCategories(),
        fetchAdminCourses().then(setCourses),
      ]);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    fetchUsers(roleFilter).then(setUsers);
  }, [roleFilter]);

  const toggleUser = async (user) => {
    if (await setUserActive(user._id, !user.active)) {
      setUsers((prev) => prev.map((u) => (u._id === user._id ? { ...u, active: !u.active } : u)));
    }
  };

  const addCategory = async (e) => {
    e.preventDefault();
    if (await createCategory(category.name.trim(), category.description.trim())) {
      setCategory({ name: "", description: "" });
      loadCategories();
      loadStats();
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-5xl flex flex-col gap-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Students" value={stats.students} />
          <StatCard label="Instructors" value={stats.instructors} />
          <StatCard label="Courses (published)" value={`${stats.courses} (${stats.published})`} />
          <StatCard label="Revenue" value={`₹${stats.revenue}`} />
        </div>
      )}

      <section>
        <h2 className="text-xl font-semibold mb-3">Categories</h2>
        <div className="flex flex-wrap gap-2 mb-3">
          {categories.map((c) => (
            <span key={c._id} className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm">{c.name}</span>
          ))}
        </div>
        <form onSubmit={addCategory} className="flex flex-col sm:flex-row gap-2">
          <input className="border rounded px-3 py-2 flex-1" placeholder="Category name" required
            value={category.name} onChange={(e) => setCategory({ ...category, name: e.target.value })} />
          <input className="border rounded px-3 py-2 flex-1" placeholder="Description (optional)"
            value={category.description} onChange={(e) => setCategory({ ...category, description: e.target.value })} />
          <button className="bg-indigo-600 text-white px-4 py-2 rounded">Add</button>
        </form>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Users</h2>
          <select className="border rounded px-2 py-1" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="">All</option>
            <option>Student</option>
            <option>Instructor</option>
            <option>Admin</option>
          </select>
        </div>
        <div className="overflow-x-auto border rounded">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50"><tr><th className="p-2">Name</th><th className="p-2">Email</th><th className="p-2">Role</th><th className="p-2">Status</th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t">
                  <td className="p-2">{u.firstName} {u.lastName}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">{u.accountType}</td>
                  <td className="p-2">
                    {u.accountType === "Admin" ? "Admin" : (
                      <button onClick={() => toggleUser(u)} className={u.active ? "text-red-600 hover:underline" : "text-green-600 hover:underline"}>
                        {u.active ? "Deactivate" : "Activate"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">All courses</h2>
        <div className="overflow-x-auto border rounded">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50"><tr><th className="p-2">Course</th><th className="p-2">Instructor</th><th className="p-2">Price</th><th className="p-2">Students</th><th className="p-2">Status</th></tr></thead>
            <tbody>
              {courses.length === 0 && <tr><td className="p-2 text-gray-500" colSpan={5}>No courses yet</td></tr>}
              {courses.map((c) => (
                <tr key={c._id} className="border-t">
                  <td className="p-2">{c.courseName}</td>
                  <td className="p-2">{c.instructor ? `${c.instructor.firstName} ${c.instructor.lastName}` : "Removed"}</td>
                  <td className="p-2">{c.price === 0 ? "Free" : `₹${c.price}`}</td>
                  <td className="p-2">{c.students}</td>
                  <td className="p-2">{c.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
