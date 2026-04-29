"use client";

import React, { useState, useEffect } from "react";
import { Edit3 } from "lucide-react";
import Link from "next/link";

export default function EditSectionButton({ href, label = "Edit Section" }) {
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const checkMode = () => {
      const mode = window.localStorage.getItem("portfolio_edit_mode");
      setIsEditMode(mode === "true");
    };

    checkMode();
    const handleToggle = (e) => setIsEditMode(e.detail);
    window.addEventListener("portfolio_edit_mode_change", handleToggle);
    return () => window.removeEventListener("portfolio_edit_mode_change", handleToggle);
  }, []);

  if (!isEditMode) return null;

  return (
    <div className="absolute top-4 right-4 z-[1000] group/edit">
      <Link 
        href={href}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-[9px] uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all"
      >
        <Edit3 size={12} />
        {label}
      </Link>
    </div>
  );
}
