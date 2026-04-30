"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Code2, Github, Linkedin, ExternalLink, ChevronRight, MapPin } from "lucide-react";
import { FaGithub, FaLinkedin, FaCode } from "react-icons/fa6";
import { SiLeetcode, SiGeeksforgeeks, SiCodeforces, SiCodechef } from "react-icons/si";
import EditSectionButton from "./admin/EditSectionButton";

const fallbackProfile = {
  bio: "B.Tech CSE @ IIIT Kota. Full-stack developer focused on scalable architecture and production-grade software. Specialized in building high-performance web systems and complex algorithm engineering.",
  aboutImageUrl: "/images/Ankur_Sem1_1.jpg",
  githubUrl: "https://github.com/Ankurrr27",
  linkedinUrl: "https://linkedin.com/in/ankur-personal",
  leetcodeUrl: "https://leetcode.com/u/a_nkurrr/",
  geeksforgeeksUrl: "https://www.geeksforgeeks.org/profile/ankurrr/",
};

const About = ({ totalViews = 0 }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [carouselIndex, setCarouselIndex] = useState(0);
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

  const imageY = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const opacity = useTransform(scrollYProgress, [0, 0.28], [0, 1]);

  if (isLoading) {
    return (
      <section className="section-shell min-h-screen">
        <div className="section-container grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8 animate-pulse space-y-5">
            <div className="h-8 w-32 rounded-lg bg-zinc-900" />
            <div className="h-24 w-full max-w-2xl rounded-xl bg-zinc-900" />
          </div>
          <div className="lg:col-span-4 h-96 rounded-lg bg-zinc-900 animate-pulse" />
        </div>
      </section>
    );
  }

  const p = profile || fallbackProfile;

  const socials = [
    { icon: FaGithub, url: p.githubUrl, label: "GitHub" },
    { icon: FaLinkedin, url: p.linkedinUrl, label: "LinkedIn" },
    { icon: SiLeetcode, url: p.leetcodeUrl, label: "LeetCode" },
    { icon: SiGeeksforgeeks, url: p.geeksforgeeksUrl, label: "GFG" },
  ];

  const images = [
    p.aboutImageUrl || fallbackProfile.aboutImageUrl,
    "/images/Ankur_Alora_1.0_Cropped.jpg",
  ];

  const next = () => setCarouselIndex((i) => (i + 1) % images.length);
  const prev = () => setCarouselIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <section id="about" ref={containerRef} className="section-shell overflow-hidden pt-20">
      <EditSectionButton href="/admin/profile" label="Edit Bio" />

      <div className="section-container grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
        {/* Left Side: Bio and Socials */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-6">
            <div className="section-kicker">
              <Code2 size={16} className="text-orange-500" />
              About the builder
            </div>

            <h2 className="section-title">
              Shipping production-ready software.
            </h2>

            <p className="section-copy text-base leading-relaxed md:text-lg">
              {p.bio || fallbackProfile.bio}
            </p>

            <div className="flex flex-wrap gap-3 pt-4">
              {socials.map(({ icon: Icon, url, label }) => (
                <a
                  key={label}
                  href={url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="panel-subtle group flex items-center gap-3 px-5 py-3 transition-all hover:border-orange-500/50 hover:bg-orange-500/5"
                >
                  <Icon size={18} className="text-zinc-500 transition-colors group-hover:text-orange-500" />
                  <span className="text-sm font-semibold text-zinc-400 transition-colors group-hover:text-white">{label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: High-Fidelity Carousel Card */}
        <motion.div 
          style={{ opacity, y: imageY }} 
          className="lg:col-span-5 relative group"
        >
          {/* Decorative Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-blue-500/20 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
          
          <div className="relative panel overflow-hidden border-zinc-800/50 bg-zinc-950/50 backdrop-blur-sm">
            {/* Status Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/50 bg-zinc-900/30">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Unit: {carouselIndex + 1}/{images.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={prev} className="p-1 hover:text-orange-500 transition-colors cursor-pointer text-zinc-500">
                  <ChevronRight size={14} className="rotate-180" />
                </button>
                <button onClick={next} className="p-1 hover:text-orange-500 transition-colors cursor-pointer text-zinc-500">
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* Carousel Image */}
            <div className="relative aspect-[4/5] overflow-hidden bg-zinc-900">
              <motion.img
                key={carouselIndex}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                src={images[carouselIndex]}
                alt={p.fullName}
                className="w-full h-full object-cover"
              />
              
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent p-6">
                <div className="flex items-center gap-2 text-xs font-medium text-orange-500 mb-2">
                  <MapPin size={14} />
                  <span className="tracking-wide uppercase font-bold">IIIT KOTA</span>
                </div>
                <h2 className="text-3xl font-black tracking-tighter text-white mb-1">
                  {p.fullName || "Ankur"}
                </h2>
                <p className="text-sm font-medium text-zinc-400">
                  IIIT Kota · CSE · B.Tech
                </p>
              </div>

              {/* Indicators */}
              <div className="absolute top-4 right-4 flex gap-1">
                {images.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1 rounded-full transition-all duration-300 ${i === carouselIndex ? "w-4 bg-orange-500" : "w-1 bg-white/30"}`} 
                  />
                ))}
              </div>
            </div>

            {/* Card Footer */}
            <div className="grid grid-cols-2 border-t border-zinc-800/50">
              <div className="px-6 py-4 border-r border-zinc-800/50 flex flex-col justify-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Status</p>
                <p className="text-xs font-mono text-zinc-300">SYSTEM_ACTIVE</p>
              </div>
              <div className="px-6 py-4 bg-orange-500/5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-orange-500/70 mb-1">Total Views</p>
                <p className="text-xl font-black text-white leading-none">
                  {totalViews.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Blueprint Detail Accents */}
          <div className="absolute -bottom-2 -right-2 w-12 h-12 border-r-2 border-b-2 border-orange-500/20 rounded-br-xl pointer-events-none" />
          <div className="absolute -top-2 -left-2 w-12 h-12 border-l-2 border-t-2 border-orange-500/20 rounded-tl-xl pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
};

export default About;
