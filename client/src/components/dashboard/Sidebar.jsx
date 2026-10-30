import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const linkClass = ({ isActive }) =>
  `whitespace-nowrap p-2 rounded ${
    isActive ? "bg-indigo-100 text-indigo-700" : "hover:bg-gray-100"
  }`;

const Sidebar = () => {
  const user = useSelector((state) => state.profile.user);
  const isInstructor = user?.accountType === "Instructor";
  const isStudent = user?.accountType === "Student";

  return (
    <aside className="w-full md:w-56 shrink-0 border-b md:border-b-0 md:border-r p-2 md:p-4 flex flex-row md:flex-col gap-2 overflow-x-auto">
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

      <NavLink className={linkClass} to="/dashboard/settings">Settings</NavLink>
    </aside>
  );
};

export default Sidebar;
