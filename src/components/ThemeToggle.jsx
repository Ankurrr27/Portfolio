"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative p-2.5 rounded-xl overflow-hidden backdrop-blur-md border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-300 group shadow-lg"
      aria-label="Toggle Theme"
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/0 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <AnimatePresence mode="wait">
        {theme === "dark" ? (
          <motion.div
            key="moon"
            initial={{ y: 10, opacity: 0, rotate: -20 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -10, opacity: 0, rotate: 20 }}
            transition={{ duration: 0.3, ease: "backOut" }}
            className="text-slate-400 dark:text-indigo-400 relative z-10"
          >
            <Moon size={18} fill="currentColor" fillOpacity={0.1} />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ y: 10, opacity: 0, rotate: 45 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -10, opacity: 0, rotate: -45 }}
            transition={{ duration: 0.3, ease: "backOut" }}
            className="text-amber-500 relative z-10"
          >
            <Sun size={18} fill="currentColor" fillOpacity={0.1} />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Dynamic Glow Ring */}
      <div className="absolute inset-0 rounded-xl border border-indigo-500/0 group-hover:border-indigo-500/30 transition-colors duration-500 pointer-events-none" />
    </motion.button>
  );
};

export default ThemeToggle;
