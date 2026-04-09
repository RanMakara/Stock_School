import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "../../utils/constants";
import { cn } from "../../utils/helpers";
import { X } from "lucide-react";

export default function Sidebar({ open, onClose, logo, systemName, schoolName }) {
  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-30 bg-slate-900/40 transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "sidebar fixed left-0 top-0 z-40 flex h-full w-72 flex-col border-r border-slate-200 bg-white shadow-xl transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="System logo" className="h-11 w-11 rounded-2xl object-cover" />
            <div>
              <h1 className="text-sm font-bold leading-5 text-slate-900">{systemName}</h1>
              <p className="text-xs text-slate-500">{schoolName}</p>
            </div>
          </div>
          <button className="rounded-lg p-2 hover:bg-slate-100 lg:hidden" onClick={onClose} aria-label="Close sidebar">
            <X className="h-5 w-5 text-slate-600" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )
                  }
                  onClick={onClose}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-slate-100 px-5 py-4 text-xs text-slate-500">
          School use only
        </div>
      </aside>
    </>
  );
}
