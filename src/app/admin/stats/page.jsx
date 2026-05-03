"use client";

import React, { useState, useEffect } from "react";
import { Save, ArrowLeft, RefreshCw, Trophy, Code2, LayoutDashboard, Activity } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import Link from "next/link";
import { useAdmin } from "../../../context/AdminContext";
import AdminField from "../../../components/admin/AdminField";

const defaultStats = {
  autoFetch: false,
  showGithubStats: true,
  showLeetcodeStats: true,
  showGfgStats: true,
  showCodeforcesStats: true,
  githubContributions: "1200+",
  githubRepos: "35+",
  githubStars: "150+",
  leetcodeSolved: "450+",
  leetcodeRating: "1650+",
  leetcodeRanking: "Top 5%",
  gfgScore: "1200+",
  gfgRank: "1",
  gfgPercentile: "Top 1%",
  cfRating: "1450+",
  cfRank: "Specialist",
  cfSolved: "300+",
  naGithubVal: 92,
  naGithubTrend: "+12%",
  naGithubLabel: "Open Source Velocity",
  naLeetcodeVal: 88,
  naLeetcodeTrend: "+5%",
  naLeetcodeLabel: "Algorithmic Precision",
  naGfgVal: 75,
  naGfgTrend: "+8%",
  naGfgLabel: "Consistency Index",
  naCfVal: 65,
  naCfTrend: "+2%",
  naCfLabel: "Competitive Standing",
  globalScore: "8.9"
};

const textStatKeys = [
  "githubContributions",
  "githubRepos",
  "githubStars",
  "leetcodeSolved",
  "leetcodeRating",
  "leetcodeRanking",
  "gfgScore",
  "gfgRank",
  "gfgPercentile",
  "cfRating",
  "cfRank",
  "cfSolved",
  "naGithubTrend",
  "naGithubLabel",
  "naLeetcodeTrend",
  "naLeetcodeLabel",
  "naGfgTrend",
  "naGfgLabel",
  "naCfTrend",
  "naCfLabel",
  "globalScore"
];

const numberStatKeys = ["naGithubVal", "naLeetcodeVal", "naGfgVal", "naCfVal"];

const getInputValue = (value) => {
  if (value && typeof value === "object" && "target" in value) {
    return value.target?.value ?? "";
  }
  return value;
};

const toText = (value, fallback = "") => {
  const inputValue = getInputValue(value);
  if (inputValue == null) return fallback;
  if (typeof inputValue === "string") return inputValue;
  if (typeof inputValue === "number" || typeof inputValue === "boolean") return String(inputValue);
  return fallback;
};

const normalizeStats = (incoming = {}) => {
  const next = { ...defaultStats, ...incoming };

  textStatKeys.forEach((key) => {
    next[key] = toText(next[key], defaultStats[key]);
  });

  numberStatKeys.forEach((key) => {
    const value = Number(getInputValue(next[key]));
    next[key] = Number.isFinite(value) ? value : defaultStats[key];
  });

  next.autoFetch = Boolean(next.autoFetch);
  next.showGithubStats = next.showGithubStats ?? true;
  next.showLeetcodeStats = next.showLeetcodeStats ?? true;
  next.showGfgStats = next.showGfgStats ?? true;
  next.showCodeforcesStats = next.showCodeforcesStats ?? true;

  return next;
};

export default function AdminStatsPage() {
  const { adminKey } = useAdmin();
  const [stats, setStats] = useState(defaultStats);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (adminKey) fetchStats();
  }, [adminKey]);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats", { headers: { "x-admin-key": adminKey } });
      const data = await res.json();
      if (data.stats) setStats(prev => normalizeStats({ ...prev, ...data.stats }));
    } catch (err) {
      setStatus("Failed to load stats.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true); setStatus("");
    try {
      const res = await fetch("/api/admin/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
        body: JSON.stringify(normalizeStats(stats))
      });
      setStatus(res.ok ? "Stats updated successfully!" : "Failed to update stats.");
    } catch {
      setStatus("Error saving stats.");
    } finally {
      setIsSaving(false);
    }
  };

  const set = (key, val) => setStats(prev => normalizeStats({ ...prev, [key]: getInputValue(val) }));

  const naItems = [
    { key: "naGithub", label: "GitHub" },
    { key: "naLeetcode", label: "LeetCode" },
    { key: "naGfg", label: "GeeksForGeeks" },
    { key: "naCf", label: "Codeforces" },
  ];

  const visibilityItems = [
    { key: "showGithubStats", label: "GitHub" },
    { key: "showLeetcodeStats", label: "LeetCode" },
    { key: "showGfgStats", label: "GeeksForGeeks" },
    { key: "showCodeforcesStats", label: "Codeforces" },
  ];

  if (isLoading) return <div className="p-8 text-slate-500">Loading stats...</div>;

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Coding Stats Management</h1>
            <p className="text-sm text-slate-500">Manage platform metrics and neural activity data.</p>
          </div>
        </div>
        <button onClick={handleSave} disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all disabled:opacity-50">
          {isSaving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
          Save Changes
        </button>
      </div>

      {status && (
        <div className={`p-4 rounded-xl text-sm font-medium border ${status.includes("success") ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-rose-50 text-rose-700 border-rose-100"}`}>
          {status}
        </div>
      )}

      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div>
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest">Public Visibility</h2>
          <p className="text-xs text-slate-500 mt-1">Choose which platform stats appear on the portfolio.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {visibilityItems.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => set(key, !stats[key])}
              className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors ${
                stats[key]
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                  : "border-slate-200 bg-slate-50 text-slate-500"
              }`}
            >
              <span className="text-sm font-bold">{label}</span>
              <span className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${stats[key] ? "bg-emerald-500" : "bg-slate-300"}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${stats[key] ? "translate-x-6" : "translate-x-1"}`} />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Platform Stats Cards */}
      <div>
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Platform Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <FaGithub size={18} className="text-slate-700" />
              <h3 className="font-bold uppercase tracking-widest text-xs text-slate-900">GitHub Presence</h3>
            </div>
            <AdminField label="Contributions" value={stats.githubContributions} onChange={v => set("githubContributions", v)} placeholder="e.g. 1200+" />
            <AdminField label="Repositories" value={stats.githubRepos} onChange={v => set("githubRepos", v)} placeholder="e.g. 35+" />
            <AdminField label="Total Stars" value={stats.githubStars} onChange={v => set("githubStars", v)} placeholder="e.g. 150+" />
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <Code2 size={18} className="text-orange-500" />
              <h3 className="font-bold uppercase tracking-widest text-xs text-slate-900">LeetCode Mastery</h3>
            </div>
            <AdminField label="Solved Problems" value={stats.leetcodeSolved} onChange={v => set("leetcodeSolved", v)} placeholder="e.g. 450+" />
            <AdminField label="Contest Rating" value={stats.leetcodeRating} onChange={v => set("leetcodeRating", v)} placeholder="e.g. 1650+" />
            <AdminField label="Global Ranking" value={stats.leetcodeRanking} onChange={v => set("leetcodeRanking", v)} placeholder="e.g. Top 5%" />
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <Trophy size={18} className="text-emerald-600" />
              <h3 className="font-bold uppercase tracking-widest text-xs text-slate-900">GFG Proficiency</h3>
            </div>
            <AdminField label="Overall Score" value={stats.gfgScore} onChange={v => set("gfgScore", v)} placeholder="e.g. 1200+" />
            <AdminField label="Institute Rank" value={stats.gfgRank} onChange={v => set("gfgRank", v)} placeholder="e.g. 1" />
            <AdminField label="Percentile" value={stats.gfgPercentile} onChange={v => set("gfgPercentile", v)} placeholder="e.g. Top 1%" />
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <LayoutDashboard size={18} className="text-blue-500" />
              <h3 className="font-bold uppercase tracking-widest text-xs text-slate-900">Codeforces Standing</h3>
            </div>
            <AdminField label="Max Rating" value={stats.cfRating} onChange={v => set("cfRating", v)} placeholder="e.g. 1450+" />
            <AdminField label="Rank Title" value={stats.cfRank} onChange={v => set("cfRank", v)} placeholder="e.g. Specialist" />
            <AdminField label="Solved Count" value={stats.cfSolved} onChange={v => set("cfSolved", v)} placeholder="e.g. 300+" />
          </div>
        </div>
      </div>

      {/* Neural Activity Matrix */}
      <div>
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Activity size={14} /> Neural Activity Matrix
        </h2>
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-6">
          {naItems.map(({ key, label }) => (
            <div key={key} className="space-y-3 pb-6 border-b border-slate-100 last:border-0 last:pb-0">
              <p className="text-xs font-black text-slate-600 uppercase tracking-widest">{label}</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div className="sm:col-span-1 space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Activity % ({stats[`${key}Val`] ?? 0}%)</label>
                  <input
                    type="range" min={0} max={100}
                    value={stats[`${key}Val`] ?? 0}
                    onChange={e => set(`${key}Val`, Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>
                <AdminField
                  label="Trend Label"
                  value={stats[`${key}Trend`] ?? ""}
                  onChange={v => set(`${key}Trend`, v)}
                  placeholder="e.g. +12%"
                />
                <AdminField
                  label="Descriptor"
                  value={stats[`${key}Label`] ?? ""}
                  onChange={v => set(`${key}Label`, v)}
                  placeholder="e.g. Open Source Velocity"
                />
              </div>
            </div>
          ))}
          <div className="pt-2">
            <AdminField label="Global Score (e.g. 8.9)" value={stats.globalScore ?? "8.9"} onChange={v => set("globalScore", v)} placeholder="e.g. 8.9" />
          </div>
        </div>
      </div>

      {/* Auto Fetch Toggle */}
      <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wider">Automated Fetching</h3>
          <p className="text-xs text-amber-700 mt-1">When enabled, real-time data is fetched from external APIs instead of using values above.</p>
        </div>
        <button
          onClick={() => set("autoFetch", !stats.autoFetch)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${stats.autoFetch ? "bg-amber-500" : "bg-slate-300"}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${stats.autoFetch ? "translate-x-6" : "translate-x-1"}`} />
        </button>
      </div>
    </div>
  );
}
