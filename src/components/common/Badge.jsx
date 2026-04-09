import { cn } from "../../utils/helpers";

const toneClasses = {
  success: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
  warning: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
  danger: "bg-rose-100 text-rose-700 ring-1 ring-rose-200",
  info: "bg-blue-100 text-blue-700 ring-1 ring-blue-200",
  neutral: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
  purple: "bg-violet-100 text-violet-700 ring-1 ring-violet-200",
};

export default function Badge({ children, tone = "neutral", className = "" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        toneClasses[tone] || toneClasses.neutral,
        className
      )}
    >
      {children}
    </span>
  );
}
