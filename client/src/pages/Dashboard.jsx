import { Outlet } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";

const Dashboard = () => {
  return (
    <div className="flex flex-1 flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 min-w-0 p-4 md:p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;