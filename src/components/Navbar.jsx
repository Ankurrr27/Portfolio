"use client";
import React, { useState, useEffect } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";

import GlassSurface from "./ui/GlassSurface";
import Lanyard from "./ui/Lanyard";

const navLinks = ["Home", "About", "Skills", "Projects", "Achievements", "Education", "Gallery"];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [active, setActive] = useState("Home");
  const [profile, setProfile] = useState(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();
        if (data.profile) setProfile(data.profile);
      } catch (err) {
        console.error("Navbar: Error fetching profile", err);
      }
    };
    fetchProfile();

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
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

  const lanyardOpacity = Math.max(0, 1 - scrollY / 300);

  const lanyardData = {
    name: profile?.fullName || "ANKUR",
    role: profile?.headline || "Full Stack Engineer",
    social: profile?.linkedinUrl ? "@" + profile.linkedinUrl.split('/').pop() : "@ankurrr27",
    color: profile?.lanyardColor || "#f97316",
    imageUrl: profile?.lanyardImageUrl || profile?.profileImageUrl || "/assets/profile.jpg"
  };

  const showLanyard = profile?.showLanyard !== false; // Default true

  return (
    <nav
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
        isScrolled
          ? "w-[96%] md:w-[90%] lg:w-[75%] h-14"
          : "w-[calc(100%-3rem)] max-w-7xl h-16"
      }`}
    >
      <GlassSurface
        width="100%"
        height="100%"
        borderRadius={16}
        brightness={30}
        opacity={0.8}
        blur={12}
        backgroundOpacity={0.05}
        className="w-full h-full shadow-[0_8px_32px_rgba(0,0,0,0.8)] relative"
      >
        <div className="w-full px-4 md:px-8 flex items-center justify-between h-full relative">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-1.5 group">
            <span className="text-xl font-bold text-white transition-colors duration-300">
              Ankur.
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1 rounded-xl bg-black/20 border border-white/5 relative">
            {navLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className={`px-3 py-2 text-[9px] font-bold uppercase tracking-[0.15em] transition-all rounded-lg ${
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
        </div>
      </GlassSurface>

      {/* Lanyard hanging outside the glass container to avoid clipping */}
      {showLanyard && (
        <div className="hidden lg:block absolute top-0 right-0 w-full h-screen pointer-events-none z-[60]">
          <div className="absolute top-4 right-[6%] h-14 flex items-center">
            <div className="relative w-0 h-0">
               <div className="absolute top-[-10px] left-[-30px]">
                  <Lanyard 
                    position={[0, 0, 20]} 
                    gravity={[0, -30, 0]} 
                    fov={25}
                    userData={lanyardData}
                    opacity={lanyardOpacity}
                  />
               </div>
            </div>
          </div>
        </div>
      )}

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
