"use client";
import React, { useState, useEffect } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = ["Home", "About", "Skills", "Projects", "Achievements", "Education", "Gallery"];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [active, setActive] = useState("Home");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Update active section on scroll
      for (const link of [...navLinks].reverse()) {
        const el = document.getElementById(link.toLowerCase());
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActive(link);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 px-6 md:px-8 flex items-center justify-between rounded-2xl border bg-zinc-950/40 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_8px_32px_rgba(0,0,0,0.8)] ring-1 ring-white/10 ${
        isScrolled
          ? "w-[92%] md:w-[80%] lg:w-[65%] h-14 border-white/10 shadow-[inset_0_0_12px_rgba(255,255,255,0.05)]"
          : "w-[calc(100%-3rem)] max-w-7xl h-16 border-white/10"
      }`}
    >
      {/* Logo */}
      <a href="#home" className="flex items-center gap-1.5 group">
        <span className="text-xl font-bold text-white transition-colors duration-300">
          Ankur.
        </span>
        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
      </a>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-black/20 border border-white/5">
        {navLinks.map((link) => (
          <a
            key={link}
            href={`#${link.toLowerCase()}`}
            className={`px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all rounded-lg ${
              active === link 
                ? "bg-zinc-800 text-white shadow-sm" 
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {link}
          </a>
        ))}
      </div>

      {/* Mobile controls */}
      <div className="flex items-center gap-3 md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="cursor-pointer text-white p-2 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 transition-all active:scale-95"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed md:hidden left-1/2 -translate-x-1/2 top-20 w-[90%] max-h-[80vh] overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl z-[900] p-6 backdrop-blur-xl"
          >
            <ul className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <li
                  key={link}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full"
                >
                  <a
                    href={`#${link.toLowerCase()}`}
                    className={`flex items-center px-4 py-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-colors ${
                      active === link 
                        ? "bg-white/10 text-orange-500" 
                        : "text-zinc-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
