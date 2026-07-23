import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { IoSunnyOutline, IoMoonOutline, IoNotificationsOutline, IoSearchOutline, IoChevronDownOutline, IoPersonOutline, IoSettingsOutline, IoLogOutOutline } from "react-icons/io5";
import Button from "./Button";

const Navbar = ({ isDashboard = false }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Logo & Search */}
        <div className="flex items-center gap-8">
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-extrabold text-lg shadow-md shadow-indigo-600/30">
              R
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">
              Resume<span className="text-indigo-600">AI</span>
            </span>
          </Link>

          {/* Search bar (Dashboard only) */}
          {isDashboard && (
            <div className="relative hidden md:block w-72">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <IoSearchOutline className="h-5 w-5" />
              </span>
              <input
                type="text"
                placeholder="Search resumes, templates..."
                className="w-full rounded-xl border border-slate-100 bg-slate-50 py-1.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all duration-200"
              />
            </div>
          )}
        </div>

        {/* Center Nav Links (Guest Landing page only) */}
        {!isDashboard && !isAuthenticated && (
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <Link to="/templates" className="hover:text-indigo-600 transition-colors">Templates</Link>
            <a href="#ai-tools" className="hover:text-indigo-600 transition-colors">AI Tools</a>
            <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
          </nav>
        )}

        {/* Right Action Section */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all active:scale-95"
            aria-label="Toggle Theme"
          >
            {isDark ? <IoSunnyOutline className="h-5 w-5" /> : <IoMoonOutline className="h-5 w-5" />}
          </button>

          {isAuthenticated ? (
            /* Logged-in Controls */
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <button
                className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all"
                aria-label="View notifications"
              >
                <IoNotificationsOutline className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-indigo-600 ring-2 ring-white animate-pulse" />
              </button>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-slate-50 transition-all"
                >
                  <img
                    src={user?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.firstName || 'User'}`}
                    alt={user?.firstName}
                    className="h-8 w-8 rounded-xl object-cover bg-indigo-50 border border-slate-100"
                  />
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-semibold text-slate-800">{user?.firstName || "John"}</p>
                    <p className="text-[10px] text-slate-400 font-medium">Free Plan</p>
                  </div>
                  <IoChevronDownOutline className={`h-3 w-3 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-52 origin-top-right rounded-2xl border border-slate-100 bg-white p-2 shadow-xl ring-1 ring-black/5 z-40 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-3 py-2 border-b border-slate-50 mb-1">
                        <p className="text-sm font-semibold text-slate-800">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                      </div>
                      <Link
                        to="/settings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all"
                      >
                        <IoPersonOutline className="h-4 w-4" />
                        My Profile
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all"
                      >
                        <IoSettingsOutline className="h-4 w-4" />
                        Settings
                      </Link>
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          handleLogout();
                        }}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-all"
                      >
                        <IoLogOutOutline className="h-4 w-4" />
                        Log Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            /* Guest Actions */
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;
