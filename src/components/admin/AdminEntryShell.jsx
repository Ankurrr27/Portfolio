export default function AdminEntryShell({
  title,
  subtitle,
  onRemove,
  children,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div>
          <p className="text-slate-900 text-base font-semibold">{title}</p>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mt-1">
            {subtitle}
          </p>
        </div>
        <button
          onClick={onRemove}
          className="rounded-lg border border-red-200 px-4 py-2 text-red-600 font-medium text-xs hover:bg-red-50 transition-all active:scale-95"
        >
          Remove
        </button>
      </div>
      {children}
    </div>
  );
}
