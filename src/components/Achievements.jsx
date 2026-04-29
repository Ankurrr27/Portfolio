"use client";

import React, { useEffect, useRef, useState } from "react";
import { Trophy, ArrowUpRight } from "lucide-react";
import { SiLeetcode, SiGeeksforgeeks, SiGithub } from "react-icons/si";
import EditSectionButton from "./admin/EditSectionButton";


const icons = {
  github: <SiGithub />,
  leetcode: <SiLeetcode />,
  gfg: <SiGeeksforgeeks />,
};

// Brand colors per platform
const platformColors = {
  github:   { bg: "bg-slate-900",  text: "text-white",        icon: "text-white" },
  leetcode: { bg: "bg-orange-500", text: "text-white",        icon: "text-white" },
  gfg:      { bg: "bg-green-600",  text: "text-white",        icon: "text-white" },
};

// Category color palette (cycles)
const categoryColors = [
  { border: "border-violet-200", bg: "bg-violet-50",   icon: "bg-violet-600",   tag: "text-violet-600 bg-violet-50" },
  { border: "border-amber-200",  bg: "bg-amber-50",    icon: "bg-amber-500",    tag: "text-amber-600 bg-amber-50"  },
  { border: "border-emerald-200",bg: "bg-emerald-50",  icon: "bg-emerald-600",  tag: "text-emerald-700 bg-emerald-50" },
  { border: "border-rose-200",   bg: "bg-rose-50",     icon: "bg-rose-600",     tag: "text-rose-600 bg-rose-50"   },
  { border: "border-sky-200",    bg: "bg-sky-50",      icon: "bg-sky-600",      tag: "text-sky-600 bg-sky-50"     },
  { border: "border-indigo-200", bg: "bg-indigo-50",   icon: "bg-indigo-600",   tag: "text-indigo-600 bg-indigo-50" },
];



const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [codingStats, setCodingStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const sectionRef = useRef(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/achievements");
        const data = await res.json();
        if (data.achievements) setAchievements(data.achievements);
        if (data.codingStats) setCodingStats(data.codingStats);
      } catch (err) {
        console.error("Achievements: Error", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) return null;

  return (
    <section
      ref={sectionRef}
      className="w-full relative py-20 bg-white overflow-hidden border-b border-slate-100"
      id="achievements"
    >
      <EditSectionButton href="/admin/achievements" label="Edit Achievements" />
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 relative z-10">

        {/* Engineering Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
           <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50">
                 <Trophy size={16} className="text-blue-600" />
                 <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Verification System</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-[1.1]">
                Major <br />
                <span className="text-blue-600">
                  Milestones.
                </span>
              </h2>
           </div>
           <p className="max-w-xs text-slate-600 text-sm md:text-base leading-relaxed text-left md:text-right">
              Validated technical recognition records and competitive programming milestones.
           </p>
        </div>

        {codingStats.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {codingStats.map((stat, i) => {
              const pc = platformColors[stat.icon] || { bg: "bg-blue-600", text: "text-white", icon: "text-white" };
              return (
                <div key={i} className={`p-8 rounded-xl border border-transparent ${pc.bg} flex items-center justify-between group shadow-sm hover:shadow-lg transition-all duration-300`}>
                   <div className="space-y-1">
                      <p className={`text-xs font-semibold uppercase tracking-wider ${pc.text} opacity-70`}>{stat.label}</p>
                      <h4 className={`text-4xl font-bold tracking-tight ${pc.text}`}>{stat.count}</h4>
                      <p className={`text-sm font-medium ${pc.text} opacity-80`}>{stat.detail}</p>
                   </div>
                   <div className={`text-5xl ${pc.icon} opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500`}>
                      {icons[stat.icon] || <Trophy />}
                   </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((a, i) => {
            const palette = categoryColors[i % categoryColors.length];
            return (
              <div key={a.id || i} className={`group p-8 rounded-xl bg-white border ${palette.border} hover:shadow-lg transition-all duration-300 flex flex-col h-full`}>
                 <div className="flex justify-between items-start mb-6">
                    <div className={`p-3 rounded-xl ${palette.icon} text-white group-hover:scale-110 transition-transform duration-300`}>
                       <Trophy size={20} />
                    </div>
                    <span className="text-xs text-slate-500 font-medium bg-slate-50 border border-slate-100 px-3 py-1 rounded-full">
                       {a.dateLabel || "Archive"}
                    </span>
                 </div>
                 
                 <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${palette.tag}`}>{a.category || "Merit"}</p>
                 <h4 className="text-xl font-bold text-slate-900 mb-3 leading-tight">
                    {a.title}
                 </h4>
                 
                 <p className="text-slate-600 text-sm leading-relaxed flex-1 mb-8">
                    {a.description}
                 </p>
                 
                 {a.achievementUrl && (
                   <a href={a.achievementUrl} target="_blank" rel="noopener" className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900 group/link transition-colors">
                      View Verification <ArrowUpRight size={16} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                   </a>
                 )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Achievements;
