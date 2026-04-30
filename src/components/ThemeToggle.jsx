"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border shadow-sm transition-all active:scale-95 ${
        resolvedTheme === "dark"
          ? "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-orange-500 hover:text-orange-500"
          : "border-zinc-200 bg-zinc-100 text-zinc-700 hover:border-orange-500 hover:text-orange-500"
      }`}
      aria-label="Toggle theme"
      type="button"
    >
      {resolvedTheme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
};

export default ThemeToggle;
