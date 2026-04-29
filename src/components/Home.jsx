"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronRight, Sparkles, Eye } from "lucide-react";

import MagneticButton from "./MagneticButton";

const highlights = [
  "Full-stack product engineering",
  "Performance-minded architecture",
  "Clean admin and public UX",
];

const statLabel = (views) => `${views.toLocaleString()} portfolio visits`;

const Home = ({ totalViews = 0 }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();
        if (data.profile) setProfile(data.profile);
      } catch (err) {
        console.error("Home: Error fetching profile", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const { headline, linkedinUrl } = profile || {};

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
    layoutEffect: false,
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[90dvh] flex items-center justify-center px-6 md:px-12 lg:px-24 overflow-hidden bg-slate-50"
      id="home"
    >
      {/* Background Decor */}
      <div className="absolute inset-0 bg-grid-slate-100/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-900/[0.04] dark:bg-[bottom_1px_center]" style={{ maskImage: "linear-gradient(to bottom, transparent, black)" }}></div>
      
      {/* Decorative background blobs */}
      <div className="absolute top-0 right-0 w-full lg:w-[55%] h-full z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[-5%] w-96 h-96 rounded-full bg-blue-100/60 blur-3xl" />
        <div className="absolute bottom-[15%] right-[10%] w-64 h-64 rounded-full bg-indigo-100/50 blur-2xl" />
        <div className="absolute top-[40%] right-[30%] w-32 h-32 rounded-full bg-slate-200/40 blur-xl" />
      </div>
      <motion.div
        style={{ y: y1, opacity }}
        className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8"
      >
        {isLoading ? (
          <div className="w-full md:w-[65%] flex flex-col items-start text-left space-y-8 pt-20 md:pt-16 lg:pt-0 animate-pulse">
            <div className="flex gap-3">
              <div className="w-40 h-8 rounded-lg bg-slate-200"></div>
              <div className="w-32 h-8 rounded-lg bg-slate-200"></div>
            </div>
            <div className="w-full max-w-xl h-24 rounded-2xl bg-slate-200"></div>
            <div className="w-full max-w-lg h-16 rounded-xl bg-slate-200"></div>
            <div className="flex gap-3 pt-4">
              <div className="w-40 h-12 rounded-lg bg-slate-200"></div>
              <div className="w-32 h-12 rounded-lg bg-slate-200"></div>
            </div>
          </div>
        ) : (
          <div className="w-full md:w-[65%] flex flex-col items-start text-left space-y-8 pt-20 md:pt-16 lg:pt-0">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-3"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold tracking-wide text-slate-700 shadow-sm">
               [ STATUS: OPERATIONAL ]
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold tracking-wide text-slate-700 shadow-sm">
              <Eye size={14} />
              {totalViews.toLocaleString()} VISITS
            </div>
          </motion.div>

          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]"
            >
              Architecting
              <br />
              <span className="text-blue-600">
                Resilience.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-slate-600 text-base md:text-lg font-medium leading-relaxed max-w-xl"
            >
              Engineering student specializing in <span className="text-blue-600 font-semibold">scalable systems</span>, performance optimization, and clean architectural design.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-2.5"
          >
            {highlights.map((item) => (
              <div
                key={item}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 transition-all hover:bg-slate-50 cursor-default shadow-sm"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                {item}
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto"
          >
            <MagneticButton>
              <a
                href="#projects"
                className="group relative px-8 py-3 w-full sm:w-auto bg-blue-600 text-white rounded-lg font-semibold text-sm transition-all duration-300 hover:bg-blue-700 active:scale-95 flex items-center justify-center gap-2 shadow-sm"
              >
                Explore Projects
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </MagneticButton>

            <MagneticButton>
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 w-full sm:w-auto bg-white border border-slate-300 text-slate-700 rounded-lg font-semibold text-sm hover:border-slate-400 hover:bg-slate-50 transition-all duration-300 flex items-center justify-center shadow-sm"
              >
                Connect
              </a>
            </MagneticButton>
          </motion.div>
          </div>
        )}
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
      >
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Scroll</span>
        <div className="w-[1px] h-12 bg-slate-200 relative overflow-hidden">
          <motion.div 
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-blue-500 w-full h-full"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Home;
