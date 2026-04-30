"use client";
import React, { useEffect, useRef, useState } from "react";
import { GraduationCap } from "lucide-react";
import EditSectionButton from "./admin/EditSectionButton";




const EducationItem = ({ institution, period, detail, degree, isVisible, index, imageUrl, skills, description }) => {
  const skillList = skills ? skills.split(",").map(s => s.trim()) : [];
  
  return (
    <div className="relative pl-8 md:pl-20 pb-16 group/item">
      {/* Architectural Timeline Line */}
      <div className="absolute left-[3px] top-4 h-full w-px bg-zinc-900 group-last/item:h-0" />
      
      {/* Timeline Node with Pulse */}
      <div className="absolute left-[-2px] top-4 w-3 h-3 rounded-full bg-zinc-950 border-2 border-orange-500 z-10 transition-all shadow-[0_0_15px_rgba(249,115,22,0.5)] group-hover/item:scale-125" />
      
      <div
        className={`group relative w-full rounded-3xl bg-zinc-900/30 backdrop-blur-xl border border-zinc-800/50 hover:border-orange-500/40 transition-all duration-700 overflow-hidden flex flex-col shadow-2xl ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
        style={{ transitionDelay: `${index * 150}ms` }}
      >
        {/* Subtle Background Mesh */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#f97316 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }} />

        {/* 1. Header: Technical Metadata */}
        <div className="px-6 py-4 border-b border-zinc-800/50 flex items-center justify-between bg-zinc-950/40">
           <div className="flex items-center gap-4">
              <span className="font-mono text-[11px] font-black text-orange-500 uppercase tracking-[0.2em]">{period}</span>
              <div className="h-4 w-px bg-zinc-800" />
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-[10px] font-bold text-zinc-500 uppercase tracking-widest">System Verified</span>
              </div>
           </div>
           <span className="font-mono text-[10px] text-zinc-600 font-bold">#EDU_{index + 1}</span>
        </div>

        {/* 2. Main Content: Technical Ledger */}
        <div className="p-8 md:p-10 flex flex-col lg:flex-row items-start gap-8 lg:gap-10">
           {/* Logo Component */}
           {imageUrl && (
             <div className="relative flex-shrink-0 group-hover:rotate-3 transition-transform duration-500">
               <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-zinc-950 border-2 border-zinc-800 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group-hover:border-orange-500/50 transition-all duration-500">
                 <img 
                   src={imageUrl} 
                   alt={institution} 
                   className="w-full h-full object-contain" 
                 />
               </div>
               {/* Decorative corner accent */}
               <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-orange-500/50 rounded-br-lg" />
             </div>
           )}

           <div className="flex-1 space-y-5">
              <div className="space-y-2">
                 <h3 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-tight group-hover:text-orange-500 transition-colors duration-500">
                   {institution}
                 </h3>
                 <div className="inline-block px-3 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20">
                   <p className="text-[10px] md:text-xs font-black text-orange-500 uppercase tracking-[0.15em]">
                     {degree}
                   </p>
                 </div>
              </div>

              {(description || detail) && (
                <p className="text-sm md:text-base leading-relaxed text-zinc-400 font-medium max-w-4xl border-l-2 border-zinc-800 pl-6 group-hover:border-orange-500/30 transition-all">
                  {description || detail}
                </p>
              )}
           </div>
        </div>

        {/* 3. Footer: Competency Tags */}
        {skillList.length > 0 && (
          <div className="px-8 md:px-10 py-6 border-t border-zinc-800/50 bg-zinc-950/40">
            <div className="flex flex-wrap gap-3">
               {skillList.map(skill => (
                 <span key={skill} className="px-4 py-1.5 rounded-xl bg-zinc-900/50 border border-zinc-800 text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:border-orange-500/40 hover:text-white hover:bg-zinc-800 transition-all cursor-default">
                    {skill}
                 </span>
               ))}
            </div>
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
