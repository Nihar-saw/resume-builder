import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import {
  IoNotificationsOutline,
  IoSearchOutline,
  IoChevronDownOutline,
  IoPersonOutline,
  IoSettingsOutline,
  IoLogOutOutline,
  IoSparklesOutline,
} from "react-icons/io5";
import gsap from "gsap";
import Button from "./Button";

const Navbar = ({ isDashboard = false }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const navRef = useRef(null);

  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(
        navRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.1 }
      );
    }
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header
      ref={navRef}
      className="sticky top-0 z-40 w-full border-b-3 border-black bg-[#0e0e10]/95 backdrop-blur-md shadow-[0_4px_0px_0px_#000]"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Logo & Search */}
        <div className="flex items-center gap-8">
          <Link
            to={isAuthenticated ? "/dashboard" : "/"}
            className="flex items-center gap-2.5 group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0ae448] border-2.5 border-black text-black font-black text-base shadow-[3px_3px_0px_0px_#000] group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform">
              A
            </div>
            <span
              className="text-2xl font-black tracking-tight text-white uppercase"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Astra<span className="text-[#0ae448]">CV</span>
            </span>
          </Link>

          {/* Search bar (Dashboard only) */}
          {isDashboard && (
            <div className="relative hidden md:block w-72">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <IoSearchOutline className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="Search resumes, templates..."
                className="w-full rounded-xl border-2 border-black bg-[#16161a] py-2 pl-10 pr-4 text-xs font-semibold text-white placeholder:text-slate-500 shadow-[2px_2px_0px_0px_#000] focus:shadow-[4px_4px_0px_0px_#0ae448] focus:outline-none transition-all"
              />
            </div>
          )}
        </div>

        {/* Center Nav Links (Guest Landing page only) */}
        {!isDashboard && !isAuthenticated && (
          <nav className="hidden md:flex items-center gap-6 text-xs font-extrabold uppercase tracking-wider text-slate-300">
            <a
              href="#features"
              className="hover:text-[#0ae448] transition-colors"
            >
              Features
            </a>
            <Link
              to="/templates"
              className="hover:text-[#0ae448] transition-colors"
            >
              Templates
            </Link>
            <a
              href="#ai-tools"
              className="hover:text-[#0ae448] transition-colors"
            >
              AI Tools
            </a>
          </nav>
        )}

        {/* Right Action Section */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            /* Logged-in Controls */
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <button
                className="relative rounded-xl border-2 border-black bg-[#16161a] p-2 text-slate-300 shadow-[2px_2px_0px_0px_#000] hover:bg-[#202028] transition-all"
                aria-label="View notifications"
              >
                <IoNotificationsOutline className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-[#0ae448] border-2 border-black" />
              </button>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 rounded-xl border-2 border-black bg-[#16161a] p-1.5 pr-3 shadow-[3px_3px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                >
                  <img
                    src={
                      user?.avatar ||
                      `https://api.dicebear.com/7.x/adventurer/svg?seed=${
                        user?.firstName || "User"
                      }`
                    }
                    alt={user?.firstName}
                    className="h-8 w-8 rounded-lg object-cover bg-[#222] border-2 border-black"
                  />
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-black text-white leading-tight">
                      {user?.firstName || "User"}
                    </p>
                    <p className="text-[10px] text-[#0ae448] font-bold uppercase tracking-wider">
                      PRO MEMBER
                    </p>
                  </div>
                  <IoChevronDownOutline
                    className={`h-3.5 w-3.5 text-slate-400 transition-transform ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-3 w-56 origin-top-right rounded-2xl border-3 border-black bg-[#16161a] p-2 shadow-[6px_6px_0px_0px_#000] z-40 animate-fadeIn">
                      <div className="px-3 py-2 border-b-2 border-black mb-1 bg-[#202028] rounded-xl">
                        <p className="text-sm font-black text-white">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-slate-400 truncate font-mono">
                          {user?.email}
                        </p>
                      </div>
                      <Link
                        to="/settings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-200 hover:bg-[#0ae448] hover:text-black border-2 border-transparent hover:border-black transition-all my-1"
                      >
                        <IoPersonOutline className="h-4 w-4" />
                        My Profile
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-200 hover:bg-[#facc15] hover:text-black border-2 border-transparent hover:border-black transition-all my-1"
                      >
                        <IoSettingsOutline className="h-4 w-4" />
                        Settings
                      </Link>
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          handleLogout();
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-extrabold text-white bg-red-600 hover:bg-red-700 border-2 border-black shadow-[2px_2px_0px_0px_#000] transition-all my-1"
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
                <Button variant="outline" size="sm">
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
