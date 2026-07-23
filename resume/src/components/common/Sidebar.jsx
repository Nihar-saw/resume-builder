import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  IoGridOutline,
  IoDocumentTextOutline,
  IoShieldCheckmarkOutline,
  IoHardwareChipOutline,
  IoColorPaletteOutline,
  IoFolderOpenOutline,
  IoSettingsOutline,
  IoLogOutOutline,
} from "react-icons/io5";

const Sidebar = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    {
      label: "Dashboard",
      icon: IoGridOutline,
      path: "/dashboard",
    },
    {
      label: "Resumes",
      icon: IoDocumentTextOutline,
      path: "/resumes",
    },
    {
      label: "ATS Checker",
      icon: IoShieldCheckmarkOutline,
      path: "/ats",
    },
    {
      label: "AI Assistant",
      icon: IoHardwareChipOutline,
      path: "/ai-assistant",
    },
    {
      label: "Templates",
      icon: IoColorPaletteOutline,
      path: "/templates",
    },
    {
      label: "Portfolio",
      icon: IoFolderOpenOutline,
      path: "/portfolio",
    },
    {
      label: "Settings",
      icon: IoSettingsOutline,
      path: "/settings",
    },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 border-r border-slate-100 bg-white p-4 md:flex flex-col justify-between">
      {/* Upper links */}
      <div className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || 
            (item.path === "/resumes" && location.pathname === "/dashboard");
          
          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-indigo-50 text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          );
        })}
      </div>

      {/* Log out action */}
      <div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 transition-all duration-200"
        >
          <IoLogOutOutline className="h-5 w-5" />
          Log Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
