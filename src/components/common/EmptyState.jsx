import { Inbox } from "lucide-react";
import Button from "./Button";

export default function EmptyState({ title = "No data yet", description = "Create a new record to get started.", actionLabel, onAction }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm">
      <Inbox className="mx-auto mb-4 h-10 w-10 text-slate-400" />
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{description}</p>
      {actionLabel && onAction ? (
        <div className="mt-6">
          <Button onClick={onAction}>{actionLabel}</Button>
        </div>
      ) : null}
    </div>
  );
}
