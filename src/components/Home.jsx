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
  "Full Stack Developer",
  "App Developer",
  "UI/UX Designer",
  "DSA Enthusiast",
  "Engineering Lead",
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
  const containerRef = useRef(null);
  const roleText = useTypewriter(ROLES);

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
    const timer = setTimeout(() => setIsLoading(false), 250);
    return () => clearTimeout(timer);
  }, []);

  const p = profile || fallbackProfile;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
    layoutEffect: false,
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const opacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  const gridColor = resolvedTheme === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)";

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[92dvh] overflow-hidden bg-zinc-950 px-4 pb-16 pt-28 sm:px-5 md:px-12 md:pt-32 lg:px-24"
      id="home"
    >
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <Ballpit
          count={150}
          gravity={0.4}
          friction={0.99}
          wallBounce={0.8}
          followCursor={true}
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
        className="section-container relative z-10 flex min-h-[calc(92dvh-9rem)] flex-col items-center justify-center text-center"
      >
        {isLoading ? (
          <div className="w-full max-w-3xl animate-pulse space-y-6">
            <div className="h-24 w-full rounded-xl bg-zinc-900" />
            <div className="h-20 w-full max-w-xl rounded-xl bg-zinc-900" />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-10">
            <div className="space-y-6">
              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-5xl text-center text-[clamp(2.2rem,8vw,5.5rem)] font-bold leading-[1.05] tracking-tight text-white"
              >
                Hello, I'm{" "}
                <span className="text-orange-500">{p.fullName || "Ankur"}</span>{" "}
                and I'm a
                <br />
                <span className="inline-flex items-center gap-[4px] min-h-[1.1em]">
                  <span className="text-white">{roleText || "\u00A0"}</span>
                  <span className="inline-block h-[1em] w-[2px] translate-y-[1px] animate-[blink_0.9s_step-end_infinite] bg-orange-500" />
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.18 }}
                className="section-copy mx-auto max-w-2xl text-base md:text-lg"
              >
                Clean code. Scalable systems. Shipped products.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row"
            >
              <MagneticButton>
                <a href="#projects" className="primary-button group px-10">
                  See the work
                  <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
                </a>
              </MagneticButton>

              <MagneticButton>
                <a href={p.linkedinUrl || "#"} target="_blank" rel="noopener noreferrer" className="secondary-button px-10">
                  Start a conversation
                  <ArrowUpRight size={16} />
                </a>
              </MagneticButton>
            </motion.div>

            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 pt-10 border-t border-white/5 w-full max-w-5xl">
              {[
                { label: "Projects Worked", value: "10+" },
                { label: "GitHub Repos", value: "25+" },
                { label: "Total Contributions", value: "500+" },
                { label: "Problems Solved", value: "600+" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col items-center sm:items-start group">
                  <span className="text-3xl font-black text-white tracking-tighter group-hover:text-orange-500 transition-colors">{stat.value}</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 group-hover:text-zinc-300 transition-colors">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
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
