import React, { useState, useEffect } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = ["Home", "About", "Skills", "Projects", "Achievements", "Education"];

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
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 px-6 md:px-8 flex items-center justify-between rounded-xl border bg-white shadow-sm ${
        isScrolled
          ? "w-[92%] md:w-[80%] lg:w-[65%] h-14 border-slate-200"
          : "w-[95%] md:w-[85%] lg:w-[75%] h-16 border-transparent"
      }`}
    >
      {/* Logo */}
      <a href="#home" className="flex items-center gap-1.5 group">
        <span className="text-xl font-bold text-slate-900 transition-colors duration-300">
          Ankur.
        </span>
      </a>

      {/* Desktop nav */}
      <div className="flex items-center gap-6">
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link}>
              <a
                href={`#${link.toLowerCase()}`}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active === link
                    ? "text-blue-600 bg-blue-50"
                    : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                }`}
              >
                {link}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile controls */}
      <div className="flex items-center gap-3 md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="cursor-pointer text-slate-700 p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all active:scale-95"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
        </button>
      </div>

      {/* Mobile menu - Redesigned for Glassmorphism */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed md:hidden left-0 top-20 w-[90%] left-1/2 -translate-x-1/2 max-h-[80vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl z-[900] p-6"
          >
            <ul className="flex flex-col gap-2">
              {navLinks.map((link, i) => (
                <li
                  key={link}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full"
                >
                  <a
                    href={`#${link.toLowerCase()}`}
                    className={`flex items-center px-4 py-3 rounded-lg text-lg font-medium transition-colors ${
                      active === link 
                        ? "bg-blue-50 text-blue-700" 
                        : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
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
