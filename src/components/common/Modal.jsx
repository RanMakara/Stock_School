import Button from "./Button";

export default function Modal({ open, title, children, onClose, onConfirm, confirmLabel = "Confirm", confirmTone = "primary" }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="border-b border-slate-100 px-5 py-4">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        </div>
        <div className="px-5 py-4 text-sm text-slate-600">{children}</div>
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-5 py-4">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant={confirmTone} onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}
