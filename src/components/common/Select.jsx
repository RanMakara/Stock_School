export default function Select({
  label,
  error,
  helperText,
  className = "",
  children,
  id,
  ...props
}) {
  const selectId = id || props.name;
  return (
    <label className="block">
      {label ? <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span> : null}
      <select
        id={selectId}
        className={`w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${className}`}
        {...props}
      >
        {children}
      </select>
      {helperText ? <span className="mt-1 block text-xs text-slate-500">{helperText}</span> : null}
      {error ? <span className="mt-1 block text-xs font-medium text-rose-600">{error}</span> : null}
    </label>
  );
}
