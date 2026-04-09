export default function Input({
  label,
  error,
  helperText,
  className = "",
  id,
  ...props
}) {
  const inputId = id || props.name;
  return (
    <label className="block">
      {label ? <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span> : null}
      <input
        id={inputId}
        className={`w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${className}`}
        {...props}
      />
      {helperText ? <span className="mt-1 block text-xs text-slate-500">{helperText}</span> : null}
      {error ? <span className="mt-1 block text-xs font-medium text-rose-600">{error}</span> : null}
    </label>
  );
}
