"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Code2, ChevronRight, Mail } from "lucide-react";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa6";
import { SiLeetcode, SiGeeksforgeeks } from "react-icons/si";
import EditSectionButton from "./admin/EditSectionButton";
import ProfileCard from "./ui/ProfileCard";
import { formatText } from "../utils/formatText";

const fallbackProfile = {
  bio: "I am Ankur Singh, a frontend developer and UI/UX designer currently studying B.Tech CSE at IIIT Kota. As a core developer at the IIITians Network, I specialize in building high-performance web applications and scalable software systems.",
  aboutImageUrl: "/images/Ankur_Sem1_1.jpg",
  githubUrl: "https://github.com/Ankurrr27",
  linkedinUrl: "https://linkedin.com/in/ankur-personal",
  leetcodeUrl: "https://leetcode.com/u/a_nkurrr/",
  geeksforgeeksUrl: "https://www.geeksforgeeks.org/profile/ankurrr/",
  instagramUrl: "https://instagram.com/ankurrr27",
  email: "ankurrr27@gmail.com",
};

const About = ({ totalViews = 0 }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await fetch("/api/profile");
        const profileData = await profileRes.json();
        if (profileData.profile) setProfile(profileData.profile);
      } catch (err) {
        console.error("About: Error fetching data", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
    layoutEffect: false,
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const opacity = useTransform(scrollYProgress, [0, 0.28], [0, 1]);

  const p = profile || fallbackProfile;

  const socials = [
    { icon: Mail, url: `mailto:${p.email || fallbackProfile.email}`, label: "Email", color: "text-orange-500" },
    { icon: FaLinkedin, url: p.linkedinUrl, label: "LinkedIn", color: "text-[#0A66C2]" },
    { icon: FaGithub, url: p.githubUrl, label: "GitHub", color: "text-white" },
    { icon: SiLeetcode, url: p.leetcodeUrl, label: "LeetCode", color: "text-[#FFA116]" },
    { icon: SiGeeksforgeeks, url: p.geeksforgeeksUrl, label: "GFG", color: "text-[#2F8D46]" },
    { icon: FaInstagram, url: p.instagramUrl || fallbackProfile.instagramUrl, label: "Instagram", color: "text-[#E4405F]" },
  ];

  const images = React.useMemo(() => {
    const urls = [
      p.aboutImageUrl || fallbackProfile.aboutImageUrl,
      "/images/Ankur_Alora_1.0_Cropped.jpg",
    ];
    return urls.filter((image, index, allImages) => image && allImages.indexOf(image) === index);
  }, [p.aboutImageUrl]);

  useEffect(() => {
    if (images.length <= 1 || isCarouselPaused) return undefined;

    const timer = window.setInterval(() => {
      setCarouselIndex((index) => (index + 1) % images.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, [images.length, isCarouselPaused]);

  useEffect(() => {
    setCarouselIndex((index) => Math.min(index, Math.max(images.length - 1, 0)));
  }, [images.length]);

  const next = () => setCarouselIndex((i) => (i + 1) % images.length);
  const prev = () => setCarouselIndex((i) => (i - 1 + images.length) % images.length);

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

  return (
    <section id="about" ref={containerRef} className="section-shell overflow-hidden pt-20">
      <EditSectionButton href="/admin/profile" label="Edit Bio" />

      <div className="section-container grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
        {/* Left Side: Bio and Socials */}
        <div className="order-2 space-y-8 lg:order-1 lg:col-span-7">
          <div className="space-y-6">
            <div className="section-kicker">
              <Code2 size={16} className="text-orange-500" />
              About the builder
            </div>

            <div className="section-title">
              {formatText(p.headline || "Ankur Singh - Web Developer & IIIT Kota Student")}
            </div>

            <div
              className={`section-copy text-base leading-relaxed md:text-lg ${
                isBioExpanded ? "" : "max-h-60 overflow-hidden md:max-h-none"
              }`}
            >
              {formatText(p.bio || fallbackProfile.bio)}
            </div>

            <button
              type="button"
              onClick={() => setIsBioExpanded((value) => !value)}
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 px-4 text-sm font-bold text-zinc-300 transition-colors hover:border-orange-500/50 hover:text-white md:hidden"
              aria-expanded={isBioExpanded}
            >
              {isBioExpanded ? "View less" : "View more"}
            </button>

            <div className="grid grid-cols-3 gap-2 pt-4 lg:grid-cols-6">
              {socials.map(({ icon: Icon, url, label, color }) => (
                <a
                  key={label}
                  href={url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.055] px-2 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl transition-all hover:border-orange-500/40 hover:bg-orange-500/10"
                >
                  <Icon size={17} className={`${color} shrink-0 transition-transform group-hover:scale-110`} />
                  <span className="min-w-0 truncate text-center text-[11px] font-semibold text-zinc-300 transition-colors group-hover:text-white lg:text-xs">{label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: React Bits Profile Card Carousel */}
        <motion.div
          style={{ y: imageY }}
          className="order-1 relative mx-auto w-full max-w-sm lg:order-2 lg:col-span-5 lg:max-w-none"
          onMouseEnter={() => setIsCarouselPaused(true)}
          onMouseLeave={() => setIsCarouselPaused(false)}
          onFocus={() => setIsCarouselPaused(true)}
          onBlur={() => setIsCarouselPaused(false)}
        >
          <ProfileCard
            avatarUrl={images[carouselIndex] || fallbackProfile.aboutImageUrl}
            miniAvatarUrl={p.profileImageUrl || p.aboutImageUrl || fallbackProfile.aboutImageUrl}
            name={p.fullName || "Ankur"}
            title="IIIT Kota - CSE - B.Tech"
            handle="ankurrr27"
            status={`Total Visits: ${totalViews.toLocaleString()}`}
            contactText="Next"
            showUserInfo
            enableTilt
            enableMobileTilt={false}
            behindGlowEnabled
            behindGlowColor="rgba(249, 115, 22, 0.66)"
            behindGlowSize="52%"
            innerGradient="linear-gradient(145deg, rgba(249,115,22,0.36) 0%, rgba(56,189,248,0.22) 55%, rgba(9,9,11,0.9) 100%)"
            onContactClick={next}
          />

          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={prev}
              className="flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] text-zinc-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl transition-colors hover:border-orange-500/50 hover:text-orange-500"
              aria-label="Previous image"
            >
              <ChevronRight size={16} className="rotate-180" />
            </button>

            <div className="flex min-h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.06] px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl">
              {images.map((_, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setCarouselIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === carouselIndex ? "w-7 bg-orange-500" : "w-2 bg-zinc-600 hover:bg-zinc-400"
                  }`}
                  aria-label={`Show image ${i + 1}`}
                  aria-current={i === carouselIndex ? "true" : undefined}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={next}
              className="flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] text-zinc-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl transition-colors hover:border-orange-500/50 hover:text-orange-500"
              aria-label="Next image"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
