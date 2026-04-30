"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Braces, Code2, GitBranch, Layers3, ShieldCheck, Timer } from "lucide-react";
import EditSectionButton from "./admin/EditSectionButton";

const fallbackProfile = {
  bio: "A dedicated B.Tech CSE student at IIIT Kota, driven by the passion to build impactful digital experiences. My expertise lies at the intersection of complex data structures and modern web development.",
  longBio: "Beyond the terminal, I find rhythm in music and focus in sport. Both keep my creativity sharp and my problem-solving practical.",
  aboutImageUrl: "/images/Ankur_Sem1_1.jpg",
};

const focusAreas = [
  {
    icon: Layers3,
    title: "Product systems",
    desc: "I think in flows, states, constraints, and maintainable interfaces rather than isolated screens.",
  },
  {
    icon: Timer,
    title: "Performance choices",
    desc: "I care about fast feedback, clean loading states, and code paths that do not waste user time.",
  },
  {
    icon: ShieldCheck,
    title: "Reliable delivery",
    desc: "I prefer predictable architecture, clear fallbacks, and features that remain stable after launch.",
  },
  {
    icon: Braces,
    title: "Algorithmic thinking",
    desc: "Data structures and problem solving shape how I break down complex technical work.",
  },
];

const About = () => {
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
        console.error("About: Error fetching profile", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
    layoutEffect: false,
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const opacity = useTransform(scrollYProgress, [0, 0.28], [0, 1]);

  if (isLoading) {
    return (
      <section className="section-shell min-h-screen">
        <div className="section-container grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7 animate-pulse space-y-5">
            <div className="h-8 w-32 rounded-lg bg-zinc-900" />
            <div className="h-24 w-full max-w-2xl rounded-xl bg-zinc-900" />
            <div className="h-28 w-full max-w-xl rounded-xl bg-zinc-900" />
          </div>
          <div className="lg:col-span-5 h-96 rounded-lg bg-zinc-900 animate-pulse" />
        </div>
      </section>
    );
  }

  const p = profile || fallbackProfile;

  return (
    <section id="about" ref={containerRef} className="section-shell overflow-hidden">
      <EditSectionButton href="/admin/profile" label="Edit Bio" />

      <div className="section-container grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <div className="space-y-5">
            <div className="section-kicker">
              <Code2 size={16} className="text-orange-500" />
              About the builder
            </div>

            <h2 className="section-title max-w-3xl">
              I build like the product has to survive real users.
            </h2>

            <p className="section-copy max-w-2xl text-base md:text-lg">
              {p.bio || fallbackProfile.bio}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {focusAreas.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="panel p-5">
                <div className="icon-box mb-4">
                  <Icon size={19} />
                </div>
                <h3 className="text-base font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <motion.div style={{ opacity, y: imageY }} className="lg:col-span-5">
          <div className="panel overflow-hidden p-3">
            <div className="relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
              <img
                src={p.aboutImageUrl || fallbackProfile.aboutImageUrl}
                alt="Ankur at work"
                className="aspect-[4/5] w-full object-cover opacity-95"
              />
              <div className="absolute left-4 top-4 rounded-md border border-orange-500/30 bg-orange-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                IIIT Kota
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3">
              <div className="panel-subtle p-4">
                <GitBranch size={18} className="text-orange-500" />
                <p className="mt-3 text-lg font-bold text-white">Build</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">Ship usable work</p>
              </div>
              <div className="panel-subtle p-4">
                <ShieldCheck size={18} className="text-orange-500" />
                <p className="mt-3 text-lg font-bold text-white">Refine</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">Improve with intent</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="lg:col-span-12">
          <div className="panel grid grid-cols-1 gap-6 p-5 md:grid-cols-[0.7fr_1fr] md:p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-orange-500">Working principle</p>
              <h3 className="mt-3 text-2xl font-bold tracking-tight text-white">Clean systems beat loud screens.</h3>
            </div>
            <p className="section-copy">
              {p.longBio || fallbackProfile.longBio} The same mindset carries into my engineering work: keep the intent clear, reduce unnecessary complexity, and make every interaction earn its place.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
