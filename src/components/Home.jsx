"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, ChevronRight, MapPin } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { useTheme } from "next-themes";

import MagneticButton from "./MagneticButton";
import Ballpit from "./ui/Ballpit";

const fallbackProfile = {
  fullName: "Ankur",
  headline: "Building high-performance systems with algorithmic precision.",
  bio: "B.Tech CSE @ IIIT Kota. Full-stack developer focused on scalable architecture and production-grade software.",
  profileImageUrl: "/images/Ankur_Alora_1.0_Cropped.jpg",
  location: "IIIT Kota - Full Stack Developer",
  githubUrl: "https://github.com/Ankurrr27",
  linkedinUrl: "https://linkedin.com/in/ankur-personal",
};

const proofPoints = [
  ["Full-stack", "Product engineering"],
  ["DSA", "Algorithmic depth"],
  ["Systems", "Performance focus"],
];

const ROLES = [
  "Web Developer",
  "App Developer",
  "UI/UX Designer",
  "DSA Enthusiast",
];

const TYPING_SPEED = 68;
const DELETING_SPEED = 38;
const PAUSE_AFTER_TYPE = 1000;
const PAUSE_AFTER_DELETE = 200;

function useTypewriter(words) {
  const [display, setDisplay] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex % words.length];
    
    if (!isDeleting && display === current) {
      const timeout = setTimeout(() => setIsDeleting(true), PAUSE_AFTER_TYPE);
      return () => clearTimeout(timeout);
    }
    
    if (isDeleting && display === "") {
      const timeout = setTimeout(() => {
        setIsDeleting(false);
        setWordIndex((i) => (i + 1) % words.length);
      }, PAUSE_AFTER_DELETE);
      return () => clearTimeout(timeout);
    }

    const nextChar = isDeleting 
      ? current.slice(0, display.length - 1)
      : current.slice(0, display.length + 1);

    const timeout = setTimeout(() => {
      setDisplay(nextChar);
    }, isDeleting ? DELETING_SPEED : TYPING_SPEED);

    return () => clearTimeout(timeout);
  }, [display, isDeleting, wordIndex, words]);

  return display;
}

const Home = ({ totalViews = 0 }) => {
  const { resolvedTheme } = useTheme();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [ballCount, setBallCount] = useState(150);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef(null);
  const roleText = useTypewriter(ROLES);

  useEffect(() => {
    setMounted(true);
    const updateCount = () => {
      setBallCount(window.innerWidth < 768 ? 60 : 150);
    };
    updateCount();
    window.addEventListener("resize", updateCount);

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
    const timer = setTimeout(() => setIsLoading(false), 250);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateCount);
    };
  }, []);

  const p = profile || fallbackProfile;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
    layoutEffect: false,
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const opacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  const gridColor = mounted && resolvedTheme === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)";

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[92dvh] lg:min-h-[100dvh] flex flex-col overflow-hidden bg-zinc-950 px-4 pb-4 pt-24 sm:px-5 sm:pb-6 md:px-12 md:pt-32 lg:px-24"
      id="home"
    >
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <Ballpit
          count={ballCount}
          gravity={0.4}
          friction={0.99}
          wallBounce={0.8}
          followCursor={true}
          enableTouchInteractions={false}
          minSize={0.3}
          maxSize={0.65}
          colors={[0xff6600, 0x333333, 0x111111]}
        />
      </div>

      <div 
        className="absolute inset-0 pointer-events-none z-1" 
        style={{
          backgroundImage: `linear-gradient(to right, ${gridColor} 1px, transparent 1px), linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)`,
          backgroundSize: '64px 64px'
        }}
      />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 flex flex-col items-start sm:items-center text-left sm:text-center pt-4 sm:pt-10 flex-1 w-full"
      >
        {/* Main Content Cluster */}
        <div className="flex flex-col items-start sm:items-center max-w-4xl w-full px-1 mt-8 sm:mt-auto mb-auto z-20">
          <div className="space-y-4 sm:space-y-6 w-full mb-8 sm:mb-10">
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-5xl text-left sm:text-center text-[clamp(2.5rem,8vw,5.5rem)] font-bold leading-[1.05] tracking-tight text-white"
            >
              I'm <span className="text-amber-500">{p.fullName || "Ankur"}</span>, a<br />
              <span className="inline-flex items-center gap-[4px] min-h-[1.1em]">
                <span className="text-amber-500">{roleText || "\u00A0"}</span>
                <span className="inline-block h-[1em] w-[2px] translate-y-[1px] animate-[blink_0.9s_step-end_infinite] bg-amber-500" />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18 }}
              className="section-copy mx-0 sm:mx-auto max-w-2xl text-left sm:text-center text-sm sm:text-base md:text-lg"
            >
              Clean code. Scalable systems. Shipped products.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex w-full flex-row justify-start sm:justify-center gap-3 sm:gap-4"
          >
            <MagneticButton>
              <a
                href="#projects"
                className="inline-flex h-10 sm:h-12 w-auto items-center justify-center rounded-lg bg-amber-500 px-5 sm:px-10 text-[12px] sm:text-sm font-bold text-white transition-all hover:bg-amber-600 active:scale-95 whitespace-nowrap"
              >
                <span className="sm:hidden">See work</span>
                <span className="hidden sm:inline">See the work</span>
                <ChevronRight size={14} className="ml-1.5 transition-transform group-hover:translate-x-1" />
              </a>
            </MagneticButton>

            <MagneticButton>
              <a
                href={p.linkedinUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 sm:h-12 w-auto items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 px-5 sm:px-10 text-[12px] sm:text-sm font-bold text-zinc-300 transition-all hover:border-zinc-700 active:scale-95 whitespace-nowrap"
              >
                <span className="sm:hidden">Contact</span>
                <span className="hidden sm:inline">Start a conversation</span>
                <ArrowUpRight size={14} className="ml-1.5" />
              </a>
            </MagneticButton>
          </motion.div>
        </div>

        {/* Bottom Stats Cluster */}
        <div className="mt-auto grid w-full max-w-5xl grid-cols-4 items-start justify-between gap-1 border-t border-white/5 pt-6 pb-2 sm:pb-0 sm:flex sm:flex-row sm:justify-center sm:gap-x-12 sm:gap-y-6 sm:pt-10 relative z-20">
              {[
                { label: "Projects Worked", value: "10+" },
                { label: "GitHub Repos", value: "25+" },
                { label: "Total Contributions", value: "700+" },
                { label: "Problems Solved", value: "600+" },
              ].map((stat) => (
                <div key={stat.label} className="group flex min-w-0 flex-col items-center justify-start px-1 sm:items-start sm:px-0">
                  <span className="text-xl font-black tracking-tighter text-white transition-colors group-hover:text-amber-500 sm:text-3xl">{stat.value}</span>
                  <span className="mt-1 max-w-full text-center text-[8px] font-bold uppercase leading-tight tracking-[0.06em] text-zinc-500 transition-colors group-hover:text-zinc-300 sm:text-left sm:text-[10px] sm:tracking-[0.2em]">{stat.label}</span>
                </div>
              ))}
            </div>
      </motion.div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  );
};

export default Home;
