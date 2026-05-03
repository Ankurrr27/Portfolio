export default function AdminSectionCard({
  icon,
  title,
  subtitle,
  action,
  children,
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              {icon}
            </div>
            <div>
              <h2 className="text-slate-900 text-xl font-semibold">{title}</h2>
              <p className="mt-1 text-slate-500 text-sm">
                {subtitle}
              </p>
            </div>
          </div>
          {action}
        </div>
        {children}
      </div>
    </section>
  );
}
