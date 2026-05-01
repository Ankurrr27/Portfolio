"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Code2, ChevronRight, Mail } from "lucide-react";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa6";
import { SiLeetcode, SiGeeksforgeeks } from "react-icons/si";
import EditSectionButton from "./admin/EditSectionButton";
import ProfileCard from "./ui/ProfileCard";

const fallbackProfile = {
  bio: "B.Tech CSE @ IIIT Kota. Full-stack developer focused on scalable architecture and production-grade software. Specialized in building high-performance web systems and complex algorithm engineering.",
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

  const p = profile || fallbackProfile;

  const socials = [
    { icon: Mail, url: `mailto:${p.email || fallbackProfile.email}`, label: "Email", color: "text-orange-500" },
    { icon: FaLinkedin, url: p.linkedinUrl, label: "LinkedIn", color: "text-[#0A66C2]" },
    { icon: FaGithub, url: p.githubUrl, label: "GitHub", color: "text-white" },
    { icon: SiLeetcode, url: p.leetcodeUrl, label: "LeetCode", color: "text-[#FFA116]" },
    { icon: SiGeeksforgeeks, url: p.geeksforgeeksUrl, label: "GFG", color: "text-[#2F8D46]" },
    { icon: FaInstagram, url: p.instagramUrl || fallbackProfile.instagramUrl, label: "Instagram", color: "text-[#E4405F]" },
  ];

  const images = [
    p.aboutImageUrl || fallbackProfile.aboutImageUrl,
    "/images/Ankur_Alora_1.0_Cropped.jpg",
  ].filter((image, index, allImages) => image && allImages.indexOf(image) === index);

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

            <h2 className="section-title">
              What Ankur do ?
            </h2>

            <p
              className={`section-copy text-base leading-relaxed md:text-lg ${
                isBioExpanded ? "" : "max-h-60 overflow-hidden md:max-h-none"
              }`}
            >
              {p.bio || fallbackProfile.bio}
            </p>

            <button
              type="button"
              onClick={() => setIsBioExpanded((value) => !value)}
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 px-4 text-sm font-bold text-zinc-300 transition-colors hover:border-orange-500/50 hover:text-white md:hidden"
              aria-expanded={isBioExpanded}
            >
              {isBioExpanded ? "View less" : "View more"}
            </button>

            <div className="grid grid-cols-2 gap-3 pt-4 sm:flex sm:flex-wrap">
              {socials.map(({ icon: Icon, url, label, isCustom, color }) => (
                <a
                  key={label}
                  href={url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="panel-subtle group flex min-h-12 items-center justify-center gap-2 px-3 py-3 transition-all hover:border-orange-500/50 hover:bg-orange-500/5 sm:justify-start sm:gap-3 sm:px-5"
                >
                  {isCustom ? (
                    <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor" className={`${color} transition-transform group-hover:scale-110`}>
                      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-1-13v2H9v2h2v6h2v-6h2v-2h-2V7h-2z"/>
                    </svg>
                  ) : (
                    <Icon size={18} className={`${color} transition-transform group-hover:scale-110`} />
                  )}
                  <span className="min-w-0 text-center text-xs font-semibold text-zinc-400 transition-colors group-hover:text-white sm:text-left sm:text-sm">{label}</span>
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
            avatarUrl={images[carouselIndex]}
            miniAvatarUrl={images[carouselIndex]}
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
              className="flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 transition-colors hover:border-orange-500/50 hover:text-orange-500"
              aria-label="Previous image"
            >
              <ChevronRight size={16} className="rotate-180" />
            </button>

            <div className="flex min-h-10 items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-4">
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
              className="flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 transition-colors hover:border-orange-500/50 hover:text-orange-500"
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
