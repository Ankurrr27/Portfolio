"use client";

import React, { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import { SiLeetcode, SiGeeksforgeeks, SiGithub } from "react-icons/si";
import { motion } from "framer-motion";

const icons = {
  github: <SiGithub className="text-zinc-100" />,
  leetcode: <SiLeetcode className="text-[#FFA116]" />,
  gfg: <SiGeeksforgeeks className="text-[#2F8D46]" />,
};

import { profileContent } from "../data/profile";

const platformColors = {
  github:     { text: "text-white",   icon: "text-zinc-100",   glow: "group-hover:shadow-[0_0_40px_rgba(255,255,255,0.08)]" },
  leetcode:   { text: "text-white",   icon: "text-[#FFA116]", glow: "group-hover:shadow-[0_0_40px_rgba(255,161,22,0.15)]" },
  gfg:        { text: "text-white",   icon: "text-[#2F8D46]", glow: "group-hover:shadow-[0_0_40px_rgba(47,141,70,0.15)]" },
  codeforces: { text: "text-white",   icon: "text-[#1f89c7]", glow: "group-hover:shadow-[0_0_40px_rgba(31,137,199,0.15)]" },
};

const CodingStats = () => {
  const [stats, setStats] = useState({
    github: { contributions: "1200+", repositories: "35+", stars: "150+" },
    leetcode: { solved: "450+", rating: "1650+", ranking: "Top 5%" },
    gfg: { score: "1200+", rank: "1", percentile: "Top 1%" },
    codeforces: { rating: "1450+", rank: "Specialist", solved: "300+" }
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats");
        const data = await res.json();
        if (!data.error) {
          setStats(prev => ({
            ...prev,
            github: { 
              contributions: data.github.contributions, 
              repositories: `${data.github.repositories}+`, 
              stars: `${data.github.stars}+` 
            },
            leetcode: { 
              solved: `${data.leetcode.solved}+`, 
              rating: `${data.leetcode.rating}+`, 
              ranking: data.leetcode.ranking > 0 ? `#${data.leetcode.ranking}` : "Top 5%" 
            },
            gfg: data.gfg
          }));
        }
      } catch (err) {
        console.error("Stats: Error fetching", err);
      }
    };
    fetchStats();
    setIsVisible(true);
  }, []);

  const codingStats = [
    { 
      label: "GitHub Presence", 
      count: stats.github.contributions, 
      detail: "Contributions", 
      subStats: `${stats.github.repositories} Repos • ${stats.github.stars} Stars`,
      icon: "github",
      url: profileContent.githubUrl,
      theme: "from-zinc-900/80 to-zinc-900/40",
      accent: "rgba(255,255,255,0.1)"
    },
    { 
      label: "LeetCode Mastery", 
      count: stats.leetcode.solved, 
      detail: `Solved • ${stats.leetcode.rating} Rating`, 
      subStats: `${stats.leetcode.ranking} Global • Knight`,
      showGraph: true,
      icon: "leetcode",
      url: profileContent.leetcodeUrl,
      theme: "from-orange-600/20 to-orange-950/40",
      accent: "rgba(249,115,22,0.15)"
    },
    { 
      label: "GFG Proficiency", 
      count: stats.gfg.score, 
      detail: "Overall Score", 
      subStats: `Rank ${stats.gfg.rank} at IIIT Kota • ${stats.gfg.percentile}`,
      icon: "gfg",
      url: profileContent.geeksforgeeksUrl,
      theme: "from-emerald-600/20 to-emerald-950/40",
      accent: "rgba(16,185,129,0.15)"
    },
    { 
        label: "Codeforces", 
        count: stats.codeforces.rating, 
        detail: stats.codeforces.rank, 
        subStats: `${stats.codeforces.solved} Solved • Rating Growth`,
        icon: "codeforces",
        url: profileContent.codeforcesUrl,
        theme: "from-blue-600/20 to-blue-950/40",
        accent: "rgba(31,137,199,0.15)"
      }
  ];

  return (
    <section className="section-shell overflow-visible py-20" id="stats">
      <div className="section-container relative z-10">
        {/* Header */}
        <div className={`flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
           <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-amber-500/20 bg-amber-500/5">
                 <Trophy size={16} className="text-amber-400" />
                 <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest">Technical Ledger</span>
              </div>
              <h2 className="section-title text-white">
                Technical <br />
                <span className="accent-text">Dominance.</span>
              </h2>
           </div>
           <p className="section-copy max-w-md lg:text-right text-zinc-400 italic">
              "Competitive records and verified milestones synchronized in real-time."
           </p>
        </div>

        {/* Grid System */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {codingStats.map((stat, i) => {
            const pc = platformColors[stat.icon] || { text: "text-white", icon: "text-white", glow: "" };
            return (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className={`group relative p-8 rounded-[32px] border border-white/5 bg-gradient-to-br ${stat.theme} flex flex-col justify-between transition-all duration-700 backdrop-blur-3xl hover:border-amber-500/30 ${pc.glow} overflow-hidden`}
              >
                 {/* Profile Redirect Badge */}
                 <a 
                    href={stat.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 border border-white/10 hover:bg-white hover:text-black transition-all duration-300 z-20 group/btn"
                 >
                    <span className="text-[8px] font-bold uppercase tracking-widest">Profile</span>
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover/btn:translate-x-0.5 transition-transform"><path d="M7 17l10-10M7 7h10v10"/></svg>
                 </a>

                 <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-[100px] opacity-20" style={{ backgroundColor: stat.accent }} />

                 <div className="space-y-6 relative z-10">
                    <div className={`text-4xl ${pc.icon} opacity-60 group-hover:opacity-100 transition-all duration-500`}>
                       {icons[stat.icon] || <Trophy />}
                    </div>
                    
                    <div className="space-y-1">
                      <p className={`text-[10px] font-bold uppercase tracking-[0.25em] ${pc.text} opacity-50`}>{stat.label}</p>
                      <h4 className={`text-4xl font-black tracking-tighter ${pc.text} drop-shadow-sm`}>{stat.count}</h4>
                      <p className={`text-xs font-bold ${pc.text} opacity-90`}>{stat.detail}</p>
                    </div>

                    <div className="flex flex-col gap-1">
                       <p className={`text-[9px] font-semibold ${pc.text} opacity-40`}>{stat.subStats}</p>
                       {stat.showGraph && (
                         <div className="pt-3 h-8 flex items-end gap-1">
                           {[30, 50, 40, 70, 60, 85, 75, 100].map((h, idx) => (
                             <motion.div
                               key={idx}
                               initial={{ height: 0 }}
                               animate={{ height: `${h}%` }}
                               transition={{ delay: (i * 0.1) + (idx * 0.05), duration: 0.8, ease: "circOut" }}
                               className="w-full bg-orange-500/40 rounded-t-[1.5px] group-hover:bg-orange-400 transition-colors"
                             />
                           ))}
                         </div>
                       )}
                    </div>
                 </div>
              </motion.div>
            );
          })}
        </div>

        <div className={`relative p-1 rounded-[40px] bg-gradient-to-br from-amber-500/20 via-zinc-900/40 to-emerald-500/20 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="bg-zinc-950/90 backdrop-blur-3xl rounded-[36px] p-8 md:p-14 border border-white/5 overflow-hidden relative">
                {/* Decorative neural lines */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-amber-500 to-transparent" />
                    <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-emerald-500 to-transparent" />
                </div>

                <div className="flex flex-col xl:flex-row gap-12 relative z-10">
                    <div className="flex-1 space-y-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                </span>
                                <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Platform Activity Matrix</span>
                            </div>
                            <h3 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-tight">
                                Neural <span className="accent-text">Activity.</span>
                            </h3>
                            <p className="text-sm md:text-base text-zinc-400 leading-relaxed max-w-xl">
                                Real-time cross-platform engagement analytics. Measuring technical consistency, problem-solving frequency, and open-source velocity.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {[
                                { name: "GitHub", val: 92, color: "bg-white", label: "Open Source Velocity", trend: "+12%" },
                                { name: "LeetCode", val: 88, color: "bg-[#FFA116]", label: "Algorithmic Precision", trend: "+5%" },
                                { name: "GeeksForGeeks", val: 75, color: "bg-[#2F8D46]", label: "Consistency Index", trend: "+8%" },
                                { name: "Codeforces", val: 65, color: "bg-[#1f89c7]", label: "Competitive Standing", trend: "+2%" }
                            ].map((p, i) => (
                                <div key={i} className="space-y-3 group/item">
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-0.5">
                                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{p.name}</p>
                                            <p className="text-xs font-bold text-zinc-200">{p.label}</p>
                                        </div>
                                        <span className="text-xs font-black text-amber-400">{p.trend}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={isVisible ? { width: `${p.val}%` } : {}}
                                            transition={{ delay: 0.5 + (i * 0.1), duration: 1.5, ease: "circOut" }}
                                            className={`h-full ${p.color} shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover/item:brightness-125 transition-all`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="xl:w-80 flex flex-col justify-center gap-6">
                        <div className="p-8 rounded-[32px] bg-amber-500/10 border border-amber-500/20 text-center space-y-2 relative overflow-hidden group/card">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
                            <p className="text-[10px] font-black text-amber-300 uppercase tracking-widest relative z-10">Global Score</p>
                            <h4 className="text-6xl font-black text-white tracking-tighter relative z-10">8.9<span className="text-2xl text-amber-400">/10</span></h4>
                            <p className="text-[10px] font-bold text-amber-400/60 relative z-10 uppercase">High Technical Velocity</p>
                        </div>
                        
                        <div className="p-6 rounded-[28px] bg-zinc-900/50 border border-white/5 space-y-4">
                            <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">Activity Heatmap</p>
                            <div className="flex flex-wrap gap-1.5">
                                {Array.from({length: 40}).map((_, i) => (
                                    <div 
                                        key={i} 
                                        className={`w-3.5 h-3.5 rounded-[3px] transition-all duration-500 hover:scale-125 hover:z-10 cursor-pointer ${
                                            i % 7 === 0 ? "bg-amber-500" : 
                                            i % 5 === 0 ? "bg-amber-500/60" : 
                                            i % 3 === 0 ? "bg-amber-500/30" : "bg-zinc-800"
                                        }`} 
                                    />
                                ))}
                            </div>
                            <p className="text-[8px] font-bold text-zinc-600 uppercase text-center">365-Day Consistency Sync</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default CodingStats;
