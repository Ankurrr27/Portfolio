"use client";
import React, { useState, useEffect } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = ["Home", "About", "Skills", "Projects", "Achievements", "Gallery", "Responsibilities", "Education"];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [active, setActive] = useState("Home");

  useEffect(() => {
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

  return (
    <nav
      className={`fixed top-3 md:top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
        isScrolled
          ? "w-[calc(100%-2rem)] md:w-[90%] lg:w-[78%]"
          : "w-[calc(100%-2rem)] max-w-7xl"
      }`}
    >
      <div className="panel w-full min-h-14 px-4 md:px-6 flex items-center justify-between bg-zinc-950/95 backdrop-blur-sm">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-1.5 group">
            <span className="text-lg font-bold text-white transition-colors duration-300">
              Ankur.
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1 relative">
            {navLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className={`px-3 py-2 text-[10px] font-semibold uppercase tracking-wide transition-all rounded-md ${
                  active === link 
                    ? "bg-orange-500 text-white" 
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
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
              className="cursor-pointer text-white min-h-11 min-w-11 p-2 rounded-md border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 transition-all active:scale-95 flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
            </button>
          </div>
        </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed md:hidden left-1/2 -translate-x-1/2 top-20 w-[calc(100vw-2rem)] max-h-[75vh] overflow-y-auto panel z-[900] p-3"
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
                    className={`flex items-center min-h-11 px-4 py-3 rounded-md text-sm font-semibold uppercase tracking-wide transition-colors ${
                      active === link 
                        ? "bg-orange-500 text-white" 
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
