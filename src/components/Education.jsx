"use client";
import React, { useEffect, useRef, useState } from "react";
import { GraduationCap } from "lucide-react";
import EditSectionButton from "./admin/EditSectionButton";




const EducationItem = ({ institution, period, detail, degree, side, isVisible, index, imageUrl }) => (
  <div
    className={`relative flex items-center justify-between w-full mb-12 md:mb-16 ${
      side === "left" ? "md:flex-row-reverse" : "md:flex-row"
    }`}
  >
    {/* Timeline dot */}
    <div className="absolute left-[15px] md:left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full border-4 border-zinc-950 bg-orange-500 z-10 shadow-sm" />

    {/* Content Card */}
    <div
      className={`group w-[calc(100%-40px)] md:w-[45%] ml-auto md:ml-0 rounded-[2rem] bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 hover:border-orange-500/30 transition-all duration-500 overflow-hidden flex flex-col sm:flex-row ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Marginal Expanding Image Section */}
      {imageUrl && (
        <div className="relative overflow-hidden flex-shrink-0 bg-zinc-950 transition-all duration-700 ease-in-out w-16 sm:w-24 md:w-32 group-hover:w-full sm:group-hover:w-56 md:group-hover:w-64 aspect-video sm:aspect-auto border-r border-zinc-800/50">
          <img 
            src={imageUrl} 
            alt={institution} 
            className="w-full h-full object-cover opacity-40 grayscale group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/20 to-zinc-900/60 group-hover:from-transparent transition-all duration-700" />
          
          {/* Subtle accent line */}
          <div className="absolute inset-y-0 right-0 w-[1px] bg-zinc-800 group-hover:bg-orange-500/30 transition-colors" />
        </div>
      )}

      {/* Content Section */}
      <div className="flex-1 p-6 md:p-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
           <div className="px-3 py-1 rounded-full bg-zinc-950 border border-zinc-800 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{period}</span>
           </div>
           <span className="text-[9px] font-bold text-zinc-500 border border-zinc-800 px-3 py-1 rounded-full uppercase tracking-[0.2em] group-hover:text-orange-500 group-hover:border-orange-500/30 transition-all">Verified</span>
        </div>
        
        <div className="space-y-3">
           <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-tight group-hover:text-orange-500 transition-colors">
             {institution}
           </h3>
           <div className="flex items-center gap-2">
             <div className="w-4 h-[1px] bg-zinc-700" />
             <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest leading-none">
               {degree}
             </p>
           </div>
        </div>

        {detail && (
          <p className="text-sm leading-relaxed text-zinc-500 group-hover:text-zinc-400 transition-colors">
            {detail}
          </p>
        )}
      </div>
    </div>

    {/* Spacer for the other side on desktop */}
    <div className="hidden md:block md:w-[45%]" />
  </div>
);

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
        // Fallback visibility if observer fails
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

  if (isLoading) return (
    <section className="w-full py-20 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 space-y-12 animate-pulse">
        <div className="flex justify-between items-end gap-6">
          <div className="space-y-4">
             <div className="w-40 h-8 bg-zinc-900 rounded-lg"></div>
             <div className="w-64 h-16 bg-zinc-900 rounded-xl"></div>
          </div>
          <div className="w-32 h-20 bg-zinc-900 rounded-xl"></div>
        </div>
        <div className="space-y-8">
          {[1,2].map(i => (
            <div key={i} className="h-40 w-full md:w-[45%] bg-zinc-900 rounded-xl"></div>
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <section
      ref={containerRef}
      className="w-full relative pt-32 pb-24 bg-zinc-950 overflow-hidden border-b border-zinc-900 px-6 md:px-12 lg:px-24"
      id="education"
    >
      <EditSectionButton href="/admin/education" label="Edit Education" />
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Engineering Header */}
        <div className={`flex flex-col md:flex-row justify-between items-end gap-6 mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
           <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900">
                 <GraduationCap size={16} className="text-orange-500" />
                 <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Academic Verification</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.1]">
                Educational <br />
                <span className="text-orange-500">
                  Ledger.
                </span>
              </h2>
           </div>
           <p className="max-w-xs text-zinc-400 text-sm md:text-base leading-relaxed text-left md:text-right">
              Formal academic training and educational background.
           </p>
        </div>

        <div className="relative">
          {/* Vertical Timeline Line */}
          <div className="absolute left-[15px] md:left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-zinc-900" />

          {/* Timeline Items */}
          <div className="space-y-4">
            {education.map((item, index) => (
              <EducationItem
                key={item.id}
                index={index}
                side={index % 2 === 0 ? "left" : "right"}
                institution={item.institution}
                period={item.period}
                detail={item.detail}
                degree={item.degree}
                imageUrl={item.imageUrl}
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
