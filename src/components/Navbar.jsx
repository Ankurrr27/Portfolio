"use client";
import React, { useState, useEffect } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import ThemeToggle from "./ThemeToggle";
import GlassSurface from "./ui/GlassSurface";

const navLinks = ["Home", "About", "Skills", "Projects", "Achievements", "Responsibilities", "Education"];

const WhatsNewButton = () => {
  const { resolvedTheme } = useTheme();
  return (
    <button
      className={`relative inline-flex min-h-9 min-w-9 md:min-h-11 md:min-w-11 items-center justify-center rounded-md border shadow-sm transition-all active:scale-95 ${
        resolvedTheme === "dark"
          ? "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-amber-500 hover:text-amber-500"
          : "border-zinc-200 bg-zinc-100 text-zinc-700 hover:border-amber-500 hover:text-amber-500"
      }`}
      aria-label="What's new"
      type="button"
    >
      <Sparkles className="w-4 h-4 md:w-[18px] md:h-[18px]" />
      <span className="absolute top-2.5 right-2.5 flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
      </span>
    </button>
  );
};

const Navbar = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [active, setActive] = useState("Home");

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);
      
      for (const link of [...navLinks].reverse()) {
        const el = document.getElementById(link.toLowerCase());
        if (el && currentScrollY >= el.offsetTop - 120) {
          setActive(link);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) return null;

  return (
    <nav
      className={`fixed top-1.5 md:top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
        isScrolled
          ? "w-[calc(100%-1.5rem)] md:w-[90%] lg:w-[78%]"
          : "w-[calc(100%-1.5rem)] max-w-7xl"
      }`}
    >
      <GlassSurface
        width="100%"
        height={isScrolled ? 48 : 52}
        borderRadius={10}
        brightness={resolvedTheme === "dark" ? 15 : 98}
        opacity={resolvedTheme === "dark" ? 0.4 : 0.6}
        blur={16}
        mixBlendMode="normal"
        backgroundOpacity={resolvedTheme === "dark" ? 0.12 : 0.2}
        saturation={1.4}
        className="w-full"
      >
      <div className="w-full h-full px-3 md:px-6 flex items-center justify-between">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-1.5 group">
            <span className={`text-xl font-black tracking-tighter transition-colors duration-300 uppercase ${
              resolvedTheme === "dark" ? "text-white" : "text-zinc-900"
            }`}>
              Ankur
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1 relative">
            {navLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className={`relative px-3 py-2 text-[10px] font-semibold uppercase tracking-wide transition-all rounded-md after:absolute after:bottom-1 after:left-3 after:right-3 after:h-0.5 after:rounded-full after:bg-amber-500 after:transition-opacity ${
                  active === link 
                    ? "text-amber-500 after:opacity-100" 
                    : "text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-900"
                } ${active === link ? "" : "after:opacity-0"}`}
              >
                {link}
              </a>
            ))}
          </div>

          {/* Mobile controls */}
          <div className="hidden md:flex items-center gap-3">
            <WhatsNewButton />
            <ThemeToggle />
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 md:hidden">
            <WhatsNewButton />
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`cursor-pointer min-h-9 min-w-9 p-1.5 md:min-h-11 md:min-w-11 md:p-2 rounded-md border transition-all active:scale-95 flex items-center justify-center ${
                resolvedTheme === "dark"
                  ? "border-zinc-800 bg-zinc-900 text-white hover:bg-zinc-800"
                  : "border-zinc-200 bg-zinc-100 text-zinc-700 hover:border-amber-500 hover:text-amber-500"
              }`}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <AiOutlineClose size={18} /> : <AiOutlineMenu size={18} />}
            </button>
          </div>
        </div>
      </GlassSurface>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed md:hidden left-1/2 -translate-x-1/2 top-20 w-[calc(100vw-2rem)] max-h-[75vh] z-[900]"
          >
            <GlassSurface
              width="100%"
              height="auto"
              borderRadius={10}
              brightness={55}
              opacity={0.82}
              blur={12}
              backgroundOpacity={0.16}
              saturation={1.35}
              className="w-full"
            >
              <ul className="flex w-full max-h-[75vh] flex-col gap-2 overflow-y-auto p-3">
                {navLinks.map((link) => (
                  <li
                    key={link}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full"
                  >
                    <a
                      href={`#${link.toLowerCase()}`}
                      className={`relative flex items-center min-h-11 px-4 py-3 rounded-md text-sm font-semibold uppercase tracking-wide transition-colors after:absolute after:bottom-2 after:left-4 after:h-0.5 after:w-10 after:rounded-full after:bg-amber-500 after:transition-opacity ${
                        active === link 
                          ? "text-amber-500 after:opacity-100" 
                          : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white"
                      } ${active === link ? "" : "after:opacity-0"}`}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </GlassSurface>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
