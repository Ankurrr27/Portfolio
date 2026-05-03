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
      className={`inline-flex min-h-9 min-w-9 md:min-h-11 md:min-w-11 items-center justify-center rounded-md border shadow-sm transition-all active:scale-95 ${
        resolvedTheme === "dark"
          ? "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-amber-500 hover:text-amber-500"
          : "border-zinc-200 bg-zinc-100 text-zinc-700 hover:border-amber-500 hover:text-amber-500"
      }`}
      aria-label="Toggle theme"
      type="button"
    >
      {resolvedTheme === "dark" ? <Moon className="w-4 h-4 md:w-[18px] md:h-[18px]" /> : <Sun className="w-4 h-4 md:w-[18px] md:h-[18px]" />}
    </button>
  );
};

export default ThemeToggle;
