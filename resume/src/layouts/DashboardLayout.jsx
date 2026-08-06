import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-[#090d16] grid-pattern-neo">
      <Navbar isDashboard={true} />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
