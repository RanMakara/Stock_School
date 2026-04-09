export default function LoadingSkeleton({ rows = 4 }) {
  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="h-4 animate-pulse rounded bg-slate-200" />
      ))}
    </div>
  );
}
