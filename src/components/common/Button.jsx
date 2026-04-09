import { Loader2 } from "lucide-react";
import { cn } from "../../utils/helpers";

const variants = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
  secondary: "bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200",
  success: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm",
  warning: "bg-amber-500 text-white hover:bg-amber-600 shadow-sm",
  danger: "bg-rose-600 text-white hover:bg-rose-700 shadow-sm",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  loading = false,
  icon: Icon,
  type = "button",
  as: Component = "button",
  ...props
}) {
  const sharedClassName = cn(
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
    variants[variant] || variants.primary,
    className
  );

  if (Component !== "button") {
    return (
      <Component className={sharedClassName} {...props}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : Icon ? <Icon className="h-4 w-4" /> : null}
        <span>{children}</span>
      </Component>
    );
  }

  return (
    <button
      type={type}
      className={sharedClassName}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : Icon ? <Icon className="h-4 w-4" /> : null}
      <span>{children}</span>
    </button>
  );
}
