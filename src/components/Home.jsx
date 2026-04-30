"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, ChevronRight, MapPin } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";

import MagneticButton from "./MagneticButton";

const fallbackProfile = {
  fullName: "Ankur",
  headline: "High-performance web architecture meets complex algorithm engineering.",
  bio: "B.Tech CSE student at IIIT Kota building scalable interfaces, clean backend systems, and engineering-heavy product experiences.",
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

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[92dvh] overflow-hidden border-b border-zinc-900 bg-zinc-950 px-4 pb-16 pt-28 sm:px-5 md:px-12 md:pt-32 lg:px-24"
      id="home"
    >
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,rgba(39,39,42,0.25)_1px,transparent_1px),linear-gradient(to_bottom,rgba(39,39,42,0.16)_1px,transparent_1px)] bg-[size:64px_64px] opacity-35" />
      <div className="absolute inset-x-0 top-0 h-px bg-orange-500/50" />

      <motion.div
        style={{ y, opacity }}
        className="section-container relative z-10 grid min-h-[calc(92dvh-9rem)] grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.8fr)]"
      >
        {isLoading ? (
          <div className="w-full max-w-3xl animate-pulse space-y-6">
            <div className="h-8 w-48 rounded-lg bg-zinc-900" />
            <div className="h-24 w-full rounded-xl bg-zinc-900" />
            <div className="h-20 w-full max-w-xl rounded-xl bg-zinc-900" />
          </div>
        ) : (
          <>
            <div className="flex flex-col items-start gap-7 text-left">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="section-kicker"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                Available for serious builds
              </motion.div>

              <div className="space-y-5">
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.05 }}
                  className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
                >
                  {p.fullName || "Ankur"} / Full-stack Developer
                </motion.p>

                <motion.h1
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="max-w-4xl text-left text-[clamp(2.45rem,8.5vw,5.8rem)] font-bold leading-[0.98] tracking-tight text-white"
                >
                  Engineering digital systems that feel fast, stable, and intentional.
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.18 }}
                  className="section-copy max-w-2xl text-base md:text-lg"
                >
                  {p.headline || fallbackProfile.headline} I care about the whole path: clean UI, predictable backend behavior, and code that stays understandable as the product grows.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
              >
                <MagneticButton>
                  <a href="#projects" className="primary-button group">
                    See the work
                    <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </a>
                </MagneticButton>

                <MagneticButton>
                  <a href={p.linkedinUrl || "#"} target="_blank" rel="noopener noreferrer" className="secondary-button">
                    Start a conversation
                    <ArrowUpRight size={16} />
                  </a>
                </MagneticButton>
              </motion.div>

              <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
                {proofPoints.map(([value, label]) => (
                  <div key={value} className="panel-subtle p-4">
                    <p className="text-lg font-bold text-white">{value}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <motion.aside
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="panel relative overflow-hidden p-3 md:p-4"
            >
              <div className="relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
                <img
                  src={p.profileImageUrl || fallbackProfile.profileImageUrl}
                  alt={p.fullName || "Ankur"}
                  className="aspect-[4/5] w-full object-cover object-center opacity-95"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent p-5">
                  <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                    <MapPin size={15} className="text-orange-500" />
                    {(p.location || fallbackProfile.location).replace("â€¢", "-")}
                  </div>
                  <h2 className="mt-3 text-2xl font-bold tracking-tight text-white">{p.fullName || "Ankur"}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    Builder, problem solver, and engineering student turning complex ideas into useful software.
                  </p>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-3">
                <a href={p.githubUrl || "#"} target="_blank" rel="noopener noreferrer" className="panel-subtle flex min-h-12 items-center justify-center text-zinc-500 hover:text-orange-500">
                  <FaGithub size={18} />
                </a>
                <a href={p.linkedinUrl || "#"} target="_blank" rel="noopener noreferrer" className="panel-subtle flex min-h-12 items-center justify-center text-zinc-500 hover:text-orange-500">
                  <FaLinkedin size={18} />
                </a>
                <div className="panel-subtle flex min-h-12 flex-col items-center justify-center">
                  <span className="text-sm font-bold text-white">{totalViews.toLocaleString()}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">Views</span>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </motion.div>
    </section>
  );
};

export default Home;
