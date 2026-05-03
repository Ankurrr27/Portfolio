"use client";
import React, { useEffect, useRef, useState } from "react";
import { GraduationCap } from "lucide-react";
import EditSectionButton from "./admin/EditSectionButton";
import { formatText } from "../utils/formatText";
import { motion } from "framer-motion";

const EducationItem = ({ institution, period, detail, degree, isVisible, index, imageUrl, skills, description }) => {
  const skillList = skills ? skills.split(",").map(s => s.trim()) : [];
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  
  return (
    <motion.div
      layout
      className={`group relative w-full rounded-2xl overflow-hidden border border-white/5 bg-zinc-950/40 flex flex-col md:flex-row ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Left side: Compact Visual */}
      <motion.div 
        layout
        className="w-full md:w-[260px] lg:w-[300px] shrink-0 relative overflow-hidden h-64 md:h-auto group/img"
        whileHover={!isMobile ? { width: 380 } : {}}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {imageUrl ? (
          <motion.img 
            layout
            src={imageUrl} 
            alt={institution} 
            className="w-full h-full object-cover opacity-60 group-hover/img:opacity-100"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6 }}
          />
        ) : (
          <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
            <GraduationCap className="w-12 h-12 text-zinc-800" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/40 to-transparent pointer-events-none hidden md:block" />
      </motion.div>

      {/* Right side: Compact Content */}
      <motion.div layout className="flex-1 p-5 md:p-8 lg:p-10 flex flex-col justify-center">
        {/* Timeline Pill */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
            <span className="text-[9px] font-black uppercase tracking-[0.15em] text-amber-500">{period}</span>
          </div>
          <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-500">Academic History</span>
        </div>

        {/* Institution Info */}
        <div className="mb-4">
          <h3 className="text-xl md:text-2xl font-black text-white tracking-tight leading-tight">
            {institution}
          </h3>
          <p className="text-xs md:text-sm font-bold text-zinc-400 mt-1 uppercase tracking-widest flex items-center gap-2">
             {degree}
          </p>
        </div>

        {/* Details - Compacted */}
        {(description || detail) && (
          <div className="text-xs md:text-sm leading-relaxed text-zinc-500 font-medium mb-5 max-w-3xl border-l border-zinc-800 pl-4 py-0.5">
            {formatText(description || detail)}
          </div>
        )}

        {/* Tags - Smaller */}
        {skillList.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mt-auto">
            {skillList.map((skill) => (
              <span 
                key={skill} 
                className="px-2 py-0.5 md:px-2.5 md:py-1 rounded-md bg-zinc-900/80 border border-white/5 text-[8px] md:text-[9px] font-bold uppercase tracking-wider text-zinc-400"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

const Education = () => {
  const [education, setEducation] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    // Check cache first
    const cached = localStorage.getItem("portfolio_education");
    if (cached) {
      setEducation(JSON.parse(cached));
      setIsLoading(false);
      setTimeout(() => setIsVisible(true), 100);
    }

    const fetchEducation = async () => {
      try {
        const res = await fetch("/api/education");
        const data = await res.json();
        if (data.education && data.education.length > 0) {
          setEducation(data.education);
          localStorage.setItem("portfolio_education", JSON.stringify(data.education));
        }
      } catch (err) {
        console.error("Education: Error fetching", err);
      } finally {
        if (!cached) {
          setIsLoading(false);
          setTimeout(() => setIsVisible(true), 300);
        }
      }
    };
    fetchEducation();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  if (isLoading) return null;

  return (
    <section
      ref={containerRef}
      className="section-shell overflow-hidden"
      id="education"
    >
      <EditSectionButton href="/admin/education" label="Edit Education" />
      <div className="section-container relative z-10">
        
        {/* Engineering Header */}
        <div className={`flex flex-col mb-12 md:mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
           <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                 <GraduationCap size={16} className="text-amber-400" />
                 <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest">Curriculum Vitae</span>
              </div>
              <h2 className="section-title">
                Academic <span className="text-amber-500">Path</span>
              </h2>
           </div>
        </div>

        <div className="relative space-y-6">
          {education.map((item, index) => (
            <EducationItem
              key={item.id}
              index={index}
              institution={item.institution}
              period={item.period}
              detail={item.detail}
              degree={item.degree}
              imageUrl={item.imageUrl}
              skills={item.skills}
              description={item.description}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
