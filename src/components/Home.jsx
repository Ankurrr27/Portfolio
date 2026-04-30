"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronRight } from "lucide-react";

import MagneticButton from "./MagneticButton";

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
      }
    };
    fetchProfile();
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
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
      className="relative w-full min-h-[90dvh] flex items-center justify-center px-6 md:px-12 lg:px-24 overflow-hidden bg-zinc-950 border-b border-zinc-900"
      id="home"
    >
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,rgba(39,39,42,0.26)_1px,transparent_1px),linear-gradient(to_bottom,rgba(39,39,42,0.18)_1px,transparent_1px)] bg-[size:72px_72px] opacity-25" />
      <div className="absolute inset-x-0 top-0 h-px bg-orange-500/40" />

      <motion.div
        style={{ y: y1, opacity }}
        className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8"
      >
        {isLoading ? (
          <div className="w-full md:w-[65%] flex flex-col items-start text-left space-y-8 pt-20 md:pt-16 lg:pt-0 animate-pulse">
            <div className="w-full max-w-xl h-24 rounded-2xl bg-zinc-900"></div>
            <div className="w-full max-w-lg h-16 rounded-xl bg-zinc-900"></div>
            <div className="flex gap-3 pt-4">
              <div className="w-40 h-12 rounded-lg bg-zinc-900"></div>
              <div className="w-32 h-12 rounded-lg bg-zinc-900"></div>
            </div>
          </div>
        ) : (
          <div className="w-full md:w-[66%] flex flex-col items-start text-left gap-8 pt-20 md:pt-16 lg:pt-0">

          <div className="space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="section-kicker"
            >
              Full-stack Engineering Portfolio
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="section-title max-w-3xl"
            >
              Building precise systems with clean product execution.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="section-copy max-w-2xl"
            >
              {headline || "Engineering student focused on scalable web systems, performance, and maintainable software architecture."}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto"
          >
            <MagneticButton>
              <a
                href="#projects"
                className="primary-button w-full sm:w-auto group"
              >
                Explore Projects
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </MagneticButton>

            <MagneticButton>
              <a
                href={linkedinUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="secondary-button w-full sm:w-auto"
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
        <span className="text-xs font-bold text-zinc-500 uppercase tracking-[0.3em]">Scroll</span>
        <div className="w-[1px] h-12 bg-zinc-800 relative overflow-hidden">
          <motion.div 
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-orange-500 w-full h-full"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Home;
