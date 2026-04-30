"use client";
import React, { useEffect, useRef, useState } from "react";
import { GraduationCap } from "lucide-react";
import EditSectionButton from "./admin/EditSectionButton";




const EducationItem = ({ institution, period, detail, degree, isVisible, index, imageUrl, skills, description }) => {
  const skillList = skills ? skills.split(",").map(s => s.trim()) : [];
  
  return (
    <div className="relative pl-8 md:pl-20 pb-12 group/item">
      {/* Architectural Timeline Line */}
      <div className="absolute left-[3px] top-4 h-full w-px bg-zinc-900 group-last/item:h-0" />
      
      {/* Timeline Node with Pulse */}
      <div className="absolute left-[-2px] top-4 w-3 h-3 rounded-full bg-zinc-950 border-2 border-orange-500 z-10 transition-all shadow-[0_0_15px_rgba(249,115,22,0.5)] group-hover/item:scale-125" />
      
      <div
        className={`group relative w-full rounded-2xl bg-zinc-900/40 backdrop-blur-md border border-zinc-800/60 transition-all duration-700 overflow-hidden flex flex-col md:flex-row shadow-lg hover:border-orange-500/30 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
        style={{ transitionDelay: `${index * 100}ms` }}
      >
        {/* Left Side: Flush Image */}
        {imageUrl && (
          <div className={`w-full shrink-0 relative bg-zinc-950 border-b md:border-b-0 md:border-r border-zinc-800/60 overflow-hidden ${
            (description || detail) || skillList.length > 0
              ? "h-48 md:h-auto md:w-[260px] lg:w-[300px]"
              : "h-48 md:h-auto md:w-36 lg:w-44"
          }`}>
             <img 
               src={imageUrl} 
               alt={institution} 
               className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-60" />
          </div>
        )}

        {/* Right Side: Content Area */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-center relative z-20">
           {/* Top Row: Pill Tags */}
           <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-orange-500/10 text-[10px] font-bold text-orange-400 uppercase tracking-widest border border-orange-500/20 flex items-center gap-1.5">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                {period}
              </span>
              <span className="px-3 py-1 rounded-full bg-zinc-800/50 text-[10px] font-bold text-zinc-300 uppercase tracking-widest border border-zinc-700/50">
                {degree}
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-600 text-[10px] font-bold text-white uppercase tracking-widest">
                VERIFIED
              </span>
           </div>

           {/* Title */}
           <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight mb-3 group-hover:text-orange-500 transition-colors duration-300">
             {institution}
           </h3>

           {/* Description */}
           {(description || detail) && (
              <p className="text-sm md:text-base leading-relaxed text-zinc-400 font-medium mb-6">
                {description || detail}
              </p>
           )}

           {/* Bottom Row: Skill Tags */}
           {skillList.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-auto">
                 {skillList.map(skill => (
                   <span key={skill} className="px-3 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-zinc-500 uppercase tracking-widest hover:border-orange-500/40 hover:text-orange-400 transition-colors cursor-default">
                      {skill}
                   </span>
                 ))}
              </div>
           )}
        </div>
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
    const fetchEducation = async () => {
      try {
        const res = await fetch("/api/education");
        const data = await res.json();
        if (data.education && data.education.length > 0) {
          setEducation(data.education);
        }
      } catch (err) {
        console.error("Education: Error fetching", err);
      } finally {
        setIsLoading(false);
        setTimeout(() => setIsVisible(true), 300);
      }
    };
    fetchEducation();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.05, rootMargin: "50px" }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  if (isLoading) return null;

  return (
    <section
      ref={containerRef}
      className="w-full relative pt-32 pb-24 bg-zinc-950 overflow-hidden border-b border-zinc-900 px-6 md:px-12 lg:px-24"
      id="education"
    >
      <EditSectionButton href="/admin/education" label="Edit Education" />
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Engineering Header */}
        <div className={`flex flex-col md:flex-row justify-between items-end gap-6 mb-20 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
           <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900">
                 <GraduationCap size={16} className="text-orange-500" />
                 <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Academic Verification</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-[1.1]">
                Educational <br />
                <span className="text-orange-500">
                  Ledger.
                </span>
              </h2>
           </div>
           <p className="max-w-xs text-zinc-400 text-sm md:text-base leading-relaxed text-left md:text-right">
              Formal academic training and verified educational background.
           </p>
        </div>

        <div className="relative">
          {/* Vertical Timeline Line - Moved to Left */}
          <div className="absolute left-[5px] top-0 bottom-0 w-px bg-zinc-800" />

          <div className="space-y-6">
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
      </div>
    </section>
  );
};

export default Education;
