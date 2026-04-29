import { ArrowUp, ArrowDown } from "lucide-react";

export default function AdminEntryShell({
  title,
  subtitle,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
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
        <div className="flex items-center gap-3">
          {(onMoveUp || onMoveDown) && (
            <div className="flex items-center gap-1 border-r border-slate-200 pr-3 mr-1">
              <button
                onClick={onMoveUp}
                disabled={isFirst}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 disabled:opacity-20 transition-all active:scale-95"
                title="Move Up"
              >
                <ArrowUp size={14} />
              </button>
              <button
                onClick={onMoveDown}
                disabled={isLast}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 disabled:opacity-20 transition-all active:scale-95"
                title="Move Down"
              >
                <ArrowDown size={14} />
              </button>
            </div>
          )}
          <button
            onClick={onRemove}
            className="rounded-lg border border-red-100 px-4 py-2 text-red-500 font-bold text-[10px] uppercase tracking-wider hover:bg-red-50 transition-all active:scale-95"
          >
            Remove
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}
