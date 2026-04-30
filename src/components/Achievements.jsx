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

// Brand colors per platform (Zinc Themed)
const platformColors = {
  github:   { bg: "bg-zinc-900",  text: "text-white",        icon: "text-zinc-100", border: "border-zinc-800" },
  leetcode: { bg: "bg-orange-600", text: "text-white",        icon: "text-white",    border: "border-orange-500" },
  gfg:      { bg: "bg-emerald-700",  text: "text-white",        icon: "text-white",    border: "border-emerald-600" },
};

// Zinc-aligned palette
const categoryColors = [
  { border: "border-zinc-800", bg: "bg-zinc-900", icon: "bg-zinc-800", text: "text-zinc-100", desc: "text-zinc-400", tag: "text-zinc-400 bg-zinc-800/50" },
  { border: "border-zinc-800", bg: "bg-zinc-900", icon: "bg-zinc-800", text: "text-zinc-100", desc: "text-zinc-400", tag: "text-zinc-400 bg-zinc-800/50" },
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



  return (
    <section
      ref={sectionRef}
      className="w-full relative pt-32 pb-24 bg-zinc-950 overflow-hidden border-b border-zinc-900 px-6 md:px-12 lg:px-24"
      id="achievements"
    >
      <EditSectionButton href="/admin/achievements" label="Edit Achievements" />
      <div className="max-w-7xl mx-auto relative z-10">

        {/* Engineering Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
           <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900">
                 <Trophy size={16} className="text-orange-500" />
                 <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wide">Verification System</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.1]">
                Major <br />
                <span className="text-orange-500">
                  Milestones.
                </span>
              </h2>
           </div>
           <p className="max-w-xs text-zinc-400 text-sm md:text-base leading-relaxed text-left md:text-right">
              Validated technical recognition records and competitive programming milestones.
           </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-8 rounded-xl border border-zinc-800 bg-zinc-900/50 flex flex-col justify-between shadow-sm relative overflow-hidden h-32 animate-pulse">
                <div className="w-20 h-3 bg-zinc-800 rounded mb-4" />
                <div className="w-16 h-10 bg-zinc-800 rounded mb-2" />
                <div className="w-24 h-3 bg-zinc-800 rounded" />
              </div>
            ))}
          </div>
        ) : codingStats.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {codingStats.map((stat, i) => {
              const pc = platformColors[stat.icon] || { bg: "bg-zinc-800", text: "text-white", icon: "text-white", border: "border-zinc-700" };
              return (
                <div key={i} className={`p-8 rounded-xl border ${pc.border} ${pc.bg} flex items-center justify-between group shadow-sm hover:shadow-xl transition-all duration-300`}>
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

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="p-8 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col h-full shadow-lg relative overflow-hidden min-h-[300px] animate-pulse">
                 <div className="flex justify-between items-start mb-6">
                    <div className="w-10 h-10 bg-zinc-800 rounded-xl" />
                    <div className="w-16 h-6 bg-zinc-800 rounded-lg" />
                 </div>
                 <div className="w-16 h-3 bg-zinc-800 rounded mb-4" />
                 <div className="w-3/4 h-6 bg-zinc-800 rounded mb-4" />
                 <div className="w-full h-3 bg-zinc-800 rounded mb-2" />
                 <div className="w-5/6 h-3 bg-zinc-800 rounded mb-8" />
                 <div className="w-32 h-4 bg-zinc-800 rounded mt-auto" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((a, i) => {
              const palette = categoryColors[i % categoryColors.length] || categoryColors[0];
              return (
                <div key={a.id || i} className={`group p-8 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/80 transition-all duration-300 flex flex-col h-full shadow-lg`}>
                   <div className="flex justify-between items-start mb-6">
                      <div className={`p-3 rounded-xl bg-zinc-800 text-orange-500 group-hover:scale-110 transition-transform duration-300 border border-zinc-700`}>
                         <Trophy size={20} />
                      </div>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest bg-zinc-800 border border-zinc-700 px-3 py-1 rounded-lg">
                         {a.dateLabel || "Archive"}
                      </span>
                   </div>
                   
                   <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-2 text-zinc-500`}>{a.category || "Merit"}</p>
                   <h4 className="text-xl font-bold text-white mb-3 leading-tight">
                      {a.title}
                   </h4>
                   
                   <p className="text-zinc-400 text-sm leading-relaxed flex-1 mb-8">
                      {a.description}
                   </p>
                   
                   {a.achievementUrl && (
                     <a href={a.achievementUrl} target="_blank" rel="noopener" className="flex items-center gap-2 text-sm font-semibold text-zinc-300 hover:text-orange-500 group/link transition-colors mt-auto">
                        View Verification <ArrowUpRight size={16} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                     </a>
                   )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Achievements;
