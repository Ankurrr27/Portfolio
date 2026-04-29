export default function AdminField({
  label,
  value,
  onChange,
  placeholder = "",
  textarea = false,
}) {
  const Tag = textarea ? "textarea" : "input";

  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-slate-700 text-sm font-semibold">
        {label}
      </span>
      <Tag
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors ${
          textarea ? "min-h-[120px] resize-y" : ""
        }`}
      />
    </label>
  );
}
