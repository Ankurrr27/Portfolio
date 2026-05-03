"use client";
import React, { useEffect, useRef, useState } from "react";
import { GraduationCap } from "lucide-react";
import EditSectionButton from "./admin/EditSectionButton";
import { formatText } from "../utils/formatText";

const EducationItem = ({ institution, period, detail, degree, isVisible, index, imageUrl, skills, description }) => {
  const skillList = skills ? skills.split(",").map(s => s.trim()) : [];
  
  return (
    <div
      className={`panel group relative w-full transition-all duration-300 overflow-hidden flex flex-col md:flex-row hover:border-zinc-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
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
             className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-300"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-60" />
        </div>
      )}

      {/* Right Side: Content Area */}
      <div className="flex-1 p-5 md:p-8 flex flex-col justify-center relative z-20">
         {/* Top Row: Pill Tags */}
         <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="chip text-orange-400 border-orange-500/30 flex items-center gap-1.5">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              {period}
            </span>
            <span className="chip text-zinc-300">
              {degree}
            </span>
            <span className="chip text-blue-300 border-blue-500/30">
              VERIFIED
            </span>
         </div>

         {/* Title */}
         <h3 className="text-xl md:text-3xl font-semibold text-white tracking-tight leading-tight mb-3 group-hover:text-orange-500 transition-colors duration-200 break-words">
           {institution}
         </h3>

         {/* Description */}
         {(description || detail) && (
            <div className="text-sm md:text-base leading-relaxed text-zinc-400 font-medium mb-6">
              {formatText(description || detail)}
            </div>
         )}

         {/* Bottom Row: Skill Tags */}
         {skillList.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-auto">
               {skillList.map(skill => (
                 <span key={skill} className="chip hover:border-orange-500/40 hover:text-orange-400 transition-colors cursor-default">
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
      { threshold: 0.05, rootMargin: "50px" }
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
        <div className={`flex flex-col md:flex-row justify-between items-start md:items-end gap-5 md:gap-6 mb-10 md:mb-14 transition-all duration-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
           <div className="space-y-4">
              <div className="section-kicker">
                 <GraduationCap size={16} className="text-orange-500" />
                 <span>Education</span>
              </div>
              <h2 className="section-title">
                Academic <span className="accent-text">foundation.</span>
              </h2>
           </div>
           <p className="section-copy max-w-sm md:text-right">
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
