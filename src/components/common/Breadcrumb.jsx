import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Breadcrumb({ items = [] }) {
  return (
    <nav className="mb-4 flex flex-wrap items-center gap-2 text-sm text-slate-500">
      {items.map((item, index) => (
        <div key={`${item.label}-${index}`} className="flex items-center gap-2">
          {index > 0 ? <ChevronRight className="h-4 w-4" /> : null}
          {item.to ? (
            <Link to={item.to} className="hover:text-slate-900">
              {item.label}
            </Link>
          ) : (
            <span className={item.active ? "font-medium text-slate-900" : ""}>{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
