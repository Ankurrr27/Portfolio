import { Bold, Italic, Underline, Link as LinkIcon, Type } from "lucide-react";
import { useRef } from "react";

export default function AdminField({
  label,
  value,
  onChange,
  placeholder = "",
  textarea = false,
}) {
  const Tag = textarea ? "textarea" : "input";
  const inputRef = useRef(null);

  const insertFormat = (startTag, endTag = "") => {
    const el = inputRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = el.value;
    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);

    const newValue = before + startTag + selection + endTag + after;
    
    // Trigger onChange manually
    const event = {
      target: {
        value: newValue
      }
    };
    onChange(event);

    // Re-focus and set selection
    setTimeout(() => {
      el.focus();
      const newCursorPos = start + startTag.length + selection.length + endTag.length;
      el.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">
          {label}
        </span>
        {textarea && (
          <div className="flex items-center gap-1">
            <button 
              type="button" 
              onClick={() => insertFormat("**", "**")} 
              className="p-1 rounded hover:bg-[var(--surface-subtle)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              title="Bold"
            >
              <Bold size={12} />
            </button>
            <button 
              type="button" 
              onClick={() => insertFormat("*", "*")} 
              className="p-1 rounded hover:bg-[var(--surface-subtle)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              title="Italic"
            >
              <Italic size={12} />
            </button>
            <button 
              type="button" 
              onClick={() => insertFormat("__", "__")} 
              className="p-1 rounded hover:bg-[var(--surface-subtle)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              title="Underline"
            >
              <Underline size={12} />
            </button>
            <button 
              type="button" 
              onClick={() => insertFormat("[", "](url)")} 
              className="p-1 rounded hover:bg-[var(--surface-subtle)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              title="Link"
            >
              <LinkIcon size={12} />
            </button>
            <button 
              type="button" 
              onClick={() => insertFormat("\n\n")} 
              className="p-1 rounded hover:bg-[var(--surface-subtle)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              title="Paragraph Break"
            >
              <Type size={12} />
            </button>
          </div>
        )}
      </div>
      <Tag
        ref={inputRef}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] px-5 py-3.5 text-[var(--foreground)] text-sm outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/5 transition-all placeholder:text-[var(--muted)]/50 ${
          textarea ? "min-h-[160px] resize-y leading-relaxed" : "h-14"
        }`}
      />
    </div>
  );
}
