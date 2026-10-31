import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const linkClass = ({ isActive }) =>
  `whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium ${
    isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100"
  }`;

const Sidebar = () => {
  const user = useSelector((state) => state.profile.user);
  const isInstructor = user?.accountType === "Instructor";
  const isAdmin = user?.accountType === "Admin";
  const isStudent = user?.accountType === "Student";

  return (
    <aside className="w-full md:w-60 shrink-0 border-b bg-white md:border-b-0 md:border-r p-2 md:p-4 flex flex-row md:flex-col gap-1 overflow-x-auto">
      <NavLink className={linkClass} to="/dashboard/my-profile">My Profile</NavLink>

      {isStudent && (
        <NavLink className={linkClass} to="/dashboard/enrolled-courses">Enrolled Courses</NavLink>
      )}

      {isInstructor && (
        <>
          <NavLink className={linkClass} to="/dashboard/instructor">Dashboard</NavLink>
          <NavLink className={linkClass} to="/dashboard/my-courses">My Courses</NavLink>
          <NavLink className={linkClass} to="/dashboard/add-course">Add Course</NavLink>
        </>
      )}

      {isAdmin && (
        <NavLink className={linkClass} to="/dashboard/admin">Admin Panel</NavLink>
      )}

      <NavLink className={linkClass} to="/dashboard/settings">Settings</NavLink>
    </aside>
  );
};

export default Sidebar;
