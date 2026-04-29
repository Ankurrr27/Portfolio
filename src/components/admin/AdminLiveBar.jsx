"use client";

import React, { useState, useEffect } from "react";
import { Edit3, Settings, EyeOff } from "lucide-react";
import Link from "next/link";

export default function AdminLiveBar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const checkAdmin = () => {
      const key = window.localStorage.getItem("portfolio_admin_key");
      setIsAdmin(!!key);
      const mode = window.localStorage.getItem("portfolio_edit_mode");
      setIsEditMode(mode === "true");
    };

    checkAdmin();
    window.addEventListener("storage", checkAdmin);
    return () => window.removeEventListener("storage", checkAdmin);
  }, []);

  const toggleEditMode = () => {
    const newMode = !isEditMode;
    setIsEditMode(newMode);
    window.localStorage.setItem("portfolio_edit_mode", newMode.toString());
    window.dispatchEvent(new CustomEvent("portfolio_edit_mode_change", { detail: newMode }));
  };

  if (!isAdmin) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[2000] flex items-center gap-1 p-1.5 rounded-2xl bg-white/80 dark:bg-[#0d0d12]/80 backdrop-blur-xl border border-slate-200 dark:border-white/5 shadow-2xl transition-colors duration-500">
      <div className="flex items-center gap-2 px-3 py-1.5 border-r border-slate-200 dark:border-white/10">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Live Editor</span>
      </div>

      <button
        onClick={toggleEditMode}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300
          ${isEditMode ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"}
        `}
      >
        {isEditMode ? <EyeOff size={14} /> : <Edit3 size={14} />}
        <span className="text-[10px] font-bold uppercase tracking-widest">
          {isEditMode ? "Exit Preview" : "Enable Edit"}
        </span>
      </button>

      <Link
        href="/admin"
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all duration-300"
      >
        <Settings size={14} />
        <span className="text-[10px] font-bold uppercase tracking-widest text-nowrap">Admin Portal</span>
      </Link>
    </div>
  );
}
