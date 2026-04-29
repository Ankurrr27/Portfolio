import { useState } from "react";
import { BookOpen, LockKeyhole, Trophy, UserRound } from "lucide-react";
import AdminField from "./AdminField";

export default function AdminLoginScreen({ handleLogin, isLoading }) {
  const [inputKey, setInputKey] = useState("");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    if (!inputKey.trim()) return;
    setSubmitting(true);
    setStatus("");
    const result = await handleLogin(inputKey.trim());
    if (!result?.success) {
      setStatus(result?.error || "Invalid key. Please try again.");
    }
    setSubmitting(false);
  };

  const busy = isLoading || submitting;

  return (
    <main className="min-h-screen bg-[#050505] relative overflow-hidden px-6 py-10 md:px-12">
      <div className="absolute top-0 left-0 h-[32rem] w-[32rem] rounded-full bg-primary/12 blur-[140px]"></div>
      <div className="absolute bottom-0 right-0 h-[26rem] w-[26rem] rounded-full bg-cyan-400/10 blur-[140px]"></div>

      <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] items-center min-h-[85vh]">
        <div>
          <p className="text-primary mono text-xs uppercase tracking-[0.38em]">
            Private Workspace
          </p>
          <h1 className="mt-5 text-white syne text-5xl md:text-7xl font-extrabold uppercase tracking-tighter leading-none">
            Control
            <br />
            Center
          </h1>
          <p className="mt-6 max-w-xl text-white/52 inter text-base md:text-lg leading-relaxed">
            Unlock your portfolio editor to manage achievement highlights and
            choose which GitHub projects appear on the public site.
          </p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: <UserRound size={18} />,
                title: "Focused Scope",
                text: "Static site sections stay hardcoded and clean.",
              },
              {
                icon: <BookOpen size={18} />,
                title: "Project Picker",
                text: "Select which GitHub repos get featured publicly.",
              },
              {
                icon: <Trophy size={18} />,
                title: "Achievements",
                text: "Edit milestone cards from one private panel.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/8 text-primary">
                  {item.icon}
                </div>
                <h2 className="mt-4 text-white gt text-xl">{item.title}</h2>
                <p className="mt-2 text-white/42 text-sm inter leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 rounded-[2.2rem] bg-gradient-to-br from-primary/18 via-transparent to-cyan-400/10 blur-2xl"></div>
          <div className="relative overflow-hidden rounded-[2.2rem] border border-white/10 bg-[#0d0d10]/85 p-8 md:p-10 shadow-[0_30px_120px_rgba(0,0,0,0.45)]">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                <LockKeyhole size={24} />
              </div>
              <div>
                <p className="text-white/40 mono text-[11px] uppercase tracking-[0.28em]">
                  Protected Route
                </p>
                <h2 className="text-white text-3xl gt mt-1">Admin Login</h2>
              </div>
            </div>

            <p className="mt-6 text-white/50 inter leading-relaxed">
              Enter the key stored in `.env.local` as `ADMIN_PANEL_KEY` to
              unlock the editor.
            </p>

            <div className="mt-8 space-y-5">
              <AdminField
                label="Admin Key"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSubmit()}
                placeholder="Enter ADMIN_PANEL_KEY"
                type="password"
              />

              <button
                onClick={onSubmit}
                disabled={busy || !inputKey.trim()}
                className="w-full rounded-full bg-primary px-6 py-4 text-white outfit uppercase tracking-[0.22em] disabled:opacity-50 shadow-[0_10px_30px_rgba(124,58,237,0.35)]"
              >
                {busy ? "Unlocking..." : "Unlock Admin"}
              </button>

              {status && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {status}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
