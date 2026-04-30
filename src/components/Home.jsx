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
  const [bgNodes, setBgNodes] = useState([]);
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

    // Generate random nodes only on the client
    const nodes = [...Array(15)].map(() => ({
      width: Math.random() * 4 + 2 + "px",
      height: Math.random() * 4 + 2 + "px",
      left: Math.random() * 100 + "%",
      top: Math.random() * 100 + "%",
      y: [0, Math.random() * -100 - 50],
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 10,
    }));
    setBgNodes(nodes);

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
      className="relative w-full min-h-[90dvh] flex items-center justify-center px-6 md:px-12 lg:px-24 overflow-hidden bg-zinc-950"
      id="home"
    >
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900/40 via-zinc-950 to-zinc-950" />
      
      {/* Floating Neural Nodes (Lightweight Background) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.15]">
        {bgNodes.map((node, i) => (
          <motion.div
            key={i}
            className="absolute bg-orange-500 rounded-full blur-[1px]"
            style={{
              width: node.width,
              height: node.height,
              left: node.left,
              top: node.top,
            }}
            animate={{
              y: node.y,
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: node.duration,
              repeat: Infinity,
              ease: "linear",
              delay: node.delay,
            }}
          />
        ))}
      </div>
      
      {/* Decorative background blobs */}
      <div className="absolute top-0 right-0 w-full lg:w-[55%] h-full z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[-5%] w-96 h-96 rounded-full bg-orange-500/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-[15%] right-[10%] w-64 h-64 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

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
          <div className="w-full md:w-[65%] flex flex-col items-start text-left space-y-8 pt-20 md:pt-16 lg:pt-0">

          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]"
            >
              Architecting
              <br />
              <span className="text-orange-500">
                Resilience.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-zinc-400 text-base md:text-lg font-medium leading-relaxed max-w-xl"
            >
              Engineering student specializing in <span className="text-orange-500 font-bold">scalable systems</span>, performance optimization, and clean architectural design.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto"
          >
            <MagneticButton>
              <a
                href="#projects"
                className="group relative px-8 py-3 w-full sm:w-auto bg-orange-600 text-white rounded-lg font-bold text-sm transition-all duration-300 hover:bg-orange-700 active:scale-95 flex items-center justify-center gap-2 shadow-sm"
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
                className="px-8 py-3 w-full sm:w-auto bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg font-bold text-sm hover:border-zinc-700 hover:bg-zinc-800 transition-all duration-300 flex items-center justify-center shadow-sm"
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
