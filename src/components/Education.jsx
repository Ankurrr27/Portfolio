"use client";
import React, { useEffect, useRef, useState } from "react";
import { GraduationCap } from "lucide-react";
import EditSectionButton from "./admin/EditSectionButton";
import { formatText } from "../utils/formatText";

const EducationItem = ({ institution, period, detail, degree, isVisible, index, imageUrl, skills, description }) => {
  const skillList = skills ? skills.split(",").map(s => s.trim()) : [];
  
  return (
    <div
      className={`panel group relative w-full transition-all duration-500 overflow-hidden flex flex-col md:flex-row hover:border-amber-500/50 hover:shadow-[0_20px_50px_rgba(245,158,11,0.15)] hover:-translate-y-1 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/0 via-amber-500/5 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none" />

      {/* Left Side: Flush Image */}
      {imageUrl && (
        <div className={`w-full shrink-0 relative bg-zinc-950 border-b md:border-b-0 md:border-r border-zinc-800/60 overflow-hidden ${
          (description || detail) || skillList.length > 0
            ? "h-52 md:h-auto md:w-[280px] lg:w-[340px]"
            : "h-52 md:h-auto md:w-40 lg:w-48"
        }`}>
           <img 
             src={imageUrl} 
             alt={institution} 
             className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />
           <div className="absolute inset-0 bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      )}

      {/* Right Side: Content Area */}
      <div className="flex-1 p-6 md:p-10 flex flex-col justify-center relative z-20 bg-white/0 dark:bg-zinc-900/10 backdrop-blur-3xl">
         {/* Top Row: Pill Tags */}
         <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="chip text-amber-400 border-amber-500/30 bg-amber-500/5 flex items-center gap-1.5 px-3">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              {period}
            </span>
            <span className="chip text-zinc-300 bg-white/5 border-white/10 px-3">
              {degree}
            </span>
            <span className="chip text-emerald-400 border-emerald-500/20 bg-emerald-500/5 px-3">
              VERIFIED
            </span>
         </div>

         {/* Title */}
         <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight mb-4 group-hover:text-amber-400 transition-colors duration-300 break-words">
           {institution}
         </h3>

         {/* Description */}
         {(description || detail) && (
            <div className="text-sm md:text-[1.05rem] leading-relaxed text-zinc-400 font-medium mb-8 max-w-3xl">
              {formatText(description || detail)}
            </div>
         )}

         {/* Bottom Row: Skill Tags */}
         {skillList.length > 0 && (
            <div className="flex flex-wrap gap-2.5 mt-auto">
               {skillList.map((skill, idx) => (
                 <span 
                   key={skill} 
                   className="chip bg-zinc-800/30 border-zinc-700/50 hover:border-amber-500/50 hover:text-amber-400 hover:bg-amber-500/5 transition-all duration-300 cursor-default"
                   style={{ 
                     transitionDelay: isVisible ? `${(index * 100) + (idx * 50)}ms` : '0ms',
                     opacity: isVisible ? 1 : 0,
                     transform: isVisible ? 'translateY(0)' : 'translateY(10px)'
                   }}
                 >
                    {skill}
                 </span>
               ))}
            </div>
         )}
      </div>
    </div>
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
      className="section-shell overflow-visible"
      id="education"
    >
      <EditSectionButton href="/admin/education" label="Edit Education" />
      <div className="section-container relative z-10">
        
        {/* Engineering Header */}
        <div className={`flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12 md:mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
           <div className="space-y-4">
              <div className="section-kicker bg-amber-500/10 border-amber-500/20">
                 <GraduationCap size={16} className="text-amber-400" />
                 <span className="text-amber-300">Curriculum Vitae</span>
              </div>
              <h2 className="section-title">
                Academic <span className="relative inline-block">
                  <span className="relative z-10 accent-text">foundation.</span>
                  <span className={`absolute -bottom-2 left-0 w-full h-1 bg-amber-500/30 blur-sm transition-all duration-1000 ${isVisible ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"}`} style={{ transformOrigin: 'left' }} />
                </span>
              </h2>
           </div>
           <p className="section-copy max-w-sm lg:text-right">
              Formal academic training and verified educational background.
           </p>
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
