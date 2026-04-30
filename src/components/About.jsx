"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Code2, Cpu, Shield, Zap } from "lucide-react";
import EditSectionButton from "./admin/EditSectionButton";

const Feature = ({ icon: Icon, title, desc }) => (
  <div className="panel flex flex-col gap-2 p-5 hover:border-zinc-700 transition-colors duration-200">
    <div className="icon-box mb-2">
      <Icon size={20} strokeWidth={2.4} />
    </div>
    <h4 className="text-base font-semibold text-white">{title}</h4>
    <p className="text-sm leading-relaxed text-zinc-400">{desc}</p>
  </div>
);

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

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.98, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  if (isLoading) {
    return (
      <section className="section-shell min-h-screen">
        <div className="section-container flex flex-col lg:flex-row gap-14 items-center lg:items-start">
          <div className="w-full lg:w-7/12 flex flex-col justify-center space-y-8 animate-pulse">
            <div className="space-y-5">
              <div className="w-40 h-8 rounded-lg bg-zinc-900" />
              <div className="w-3/4 h-16 rounded-xl bg-zinc-900" />
              <div className="w-full max-w-lg h-24 rounded-xl bg-zinc-900 mt-4" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 rounded-lg bg-zinc-900 border border-zinc-800" />
              ))}
            </div>
          </div>
          <div className="w-full lg:w-5/12 relative animate-pulse">
            <div className="w-full aspect-square md:aspect-[4/5] rounded-lg bg-zinc-900" />
          </div>
        </div>
      </section>
    );
  }

  const { bio, longBio, aboutImageUrl } = profile || {};

  return (
    <section id="about" ref={containerRef} className="section-shell overflow-hidden">
      <EditSectionButton href="/admin/profile" label="Edit Bio" />

      <div className="section-container flex flex-col lg:flex-row gap-14 items-center lg:items-start relative z-10">
        <div className="w-full lg:w-7/12 flex flex-col justify-center space-y-8">
          <div className="space-y-5">
            <div className="section-kicker">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              <span>About</span>
            </div>
            <h2 className="section-title">
              Engineering with <span className="accent-text">clarity.</span>
            </h2>
            <div className="flex gap-4 items-start border-l border-orange-500 pl-5 py-1">
              <p className="section-copy max-w-xl">
                {bio ||
                  "System resilience is part of the design process. My architecture choices are driven by data, performance, and long-term maintainability."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Feature icon={Zap} title="Performance First" desc="Optimizing the critical path with measurable tradeoffs." />
            <Feature icon={Shield} title="Resilient Systems" desc="Designing stable flows with clear failure handling." />
            <Feature icon={Cpu} title="Algorithmic Depth" desc="Using data structures and computation where they matter." />
            <Feature icon={Code2} title="Clean Architecture" desc="Keeping codebases readable, scalable, and maintainable." />
          </div>

          {longBio && (
            <div className="panel p-5">
              <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wide mb-3">Extended Background</p>
              <p className="text-zinc-300 text-sm leading-relaxed">{longBio}</p>
            </div>
          )}
        </div>

        <motion.div style={{ scale, opacity }} className="w-full lg:w-5/12 relative">
          <div className="panel relative overflow-hidden p-2 group">
            <img
              src={aboutImageUrl || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000"}
              alt="Engineering workspace"
              className="w-full rounded-md object-cover aspect-square md:aspect-[4/5] opacity-90 transition-transform duration-300 group-hover:scale-[1.01]"
            />

            <div className="absolute bottom-6 right-6 bg-zinc-950 px-5 py-3 rounded-lg shadow-xl border border-zinc-800">
              <span className="block text-white font-bold text-xl tracking-tight">100%</span>
              <span className="block text-zinc-500 text-xs font-semibold uppercase tracking-wide">Uptime Target</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
