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
  };

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 border-r-3 border-black bg-[#0e0e10] p-4 md:flex flex-col justify-between shadow-[4px_0px_0px_0px_#000]">
      {/* Upper links */}
      <div className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-wider transition-all duration-150 border-2 ${
                isActive
                  ? "bg-[#0ae448] text-black border-black shadow-[4px_4px_0px_0px_#000] translate-x-1"
                  : "bg-[#16161a] text-slate-300 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-[#202028] hover:text-white hover:shadow-[4px_4px_0px_0px_#000]"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </div>

      {/* Log out action */}
      <div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl border-2 border-black bg-red-600 px-4 py-3 text-xs font-black uppercase tracking-wider text-white shadow-[3px_3px_0px_0px_#000] hover:bg-red-700 hover:shadow-[5px_5px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
        >
          <IoLogOutOutline className="h-4 w-4" />
          Log Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
