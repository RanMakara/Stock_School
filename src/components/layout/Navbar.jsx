import { Menu, Moon, SunMedium, LogOut, UserRound, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../common/Button";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { cn } from "../../utils/helpers";

export default function Navbar({ onMenuClick, logo, systemName }) {
  const { currentUser, logout } = useAuth();
  const { themeMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex items-center justify-between gap-3 px-4 py-3 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            className="rounded-xl border border-slate-200 bg-white p-2 shadow-sm lg:hidden"
            onClick={onMenuClick}
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5 text-slate-700" />
          </button>
          <div className="hidden items-center gap-3 sm:flex">
            <img src={logo} alt="System logo" className="h-10 w-10 rounded-2xl object-cover" />
            <div>
              <p className="text-sm font-semibold text-slate-900">{systemName}</p>
              <p className="text-xs text-slate-500">Enterprise school dashboard</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="secondary"
            className="px-3 py-2"
            onClick={toggleTheme}
            icon={themeMode === "dark" ? SunMedium : Moon}
            aria-label="Toggle theme"
          >
            <span className="hidden sm:inline">{themeMode === "dark" ? "Light" : "Dark"}</span>
          </Button>

          <Link to="/profile" className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm md:flex">
            <img
              src={currentUser?.photo || logo}
              alt="User avatar"
              className="h-7 w-7 rounded-full object-cover"
            />
            <span className="max-w-[140px] truncate font-medium text-slate-700">
              {currentUser?.fullName || "Profile"}
            </span>
          </Link>

          <Button variant="secondary" className="px-3 py-2" onClick={() => navigate("/profile")} icon={UserRound}>
            <span className="hidden sm:inline">Profile</span>
          </Button>
          <Button variant="secondary" className="px-3 py-2" onClick={() => navigate("/settings")} icon={Settings}>
            <span className="hidden sm:inline">Settings</span>
          </Button>
          <Button variant="danger" className="px-3 py-2" onClick={handleLogout} icon={LogOut}>
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
