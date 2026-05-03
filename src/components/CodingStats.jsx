"use client";

import React, { useEffect, useState } from "react";
import { GitCommitHorizontal, GitPullRequest, Info, Star, TriangleAlert, Trophy } from "lucide-react";
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

const getUsernameFromUrl = (url, fallback, segmentAfter = null) => {
  try {
    const parts = new URL(url).pathname.split("/").filter(Boolean);
    if (segmentAfter) {
      const index = parts.indexOf(segmentAfter);
      return parts[index + 1] || fallback;
    }
    return parts[0] || fallback;
  } catch {
    return fallback;
  }
};

const parseNumber = (value, fallback = 0) => {
  const parsed = Number(String(value ?? "").replace(/[^\d]/g, ""));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const contributionMonths = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"];
const fallbackLevels = [
  0,0,0,1,2,1,0, 0,1,2,3,4,2,0, 1,2,3,4,4,3,1, 0,1,2,3,2,1,0,
  0,0,1,2,1,0,0, 1,2,2,3,2,1,0, 2,3,4,4,3,2,1, 1,2,3,2,1,0,0,
  0,1,2,1,0,0,0, 0,1,2,3,2,1,0, 1,2,3,4,3,2,1, 0,1,2,1,0,0,0,
  0,0,1,1,2,1,0, 1,2,3,4,2,1,0
];
const contributionCells = fallbackLevels.map((level, index) => ({
  date: String(index),
  level: level
}));

const languageStats = [
  { name: "JavaScript", percent: 51, color: "bg-amber-500" },
  { name: "TypeScript", percent: 27, color: "bg-amber-400" },
  { name: "C++", percent: 10, color: "bg-amber-600" },
  { name: "Others", percent: 5, color: "bg-zinc-400" },
  { name: "CSS", percent: 4, color: "bg-amber-300" },
  { name: "Java", percent: 3, color: "bg-zinc-500" },
];

const CodingStats = () => {
  const [stats, setStats] = useState({
    github: { contributions: "--", repositories: "--", stars: "--", dashboard: null },
    leetcode: { solved: "--", rating: "--", ranking: "--" },
    gfg: { score: "--", rank: "--", percentile: "--" },
    codeforces: { rating: "--", rank: "--", solved: "--" },
    visibility: { github: true, leetcode: true, gfg: true, codeforces: true },
    neural: {
      github: { val: 0, label: "Syncing...", trend: "..." },
      leetcode: { val: 0, label: "Syncing...", trend: "..." },
      gfg: { val: 0, label: "Syncing...", trend: "..." },
      codeforces: { val: 0, label: "Syncing...", trend: "..." },
      globalScore: "--",
    }
  });
  const [isVisible, setIsVisible] = useState(false);
  const [activeDomain, setActiveDomain] = useState("all");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats");
        const data = await res.json();
        if (!data.error) {
          setStats(prev => ({
            ...prev,
            github: { 
              contributions: data.github?.contributions ?? prev.github.contributions, 
              repositories: data.github?.repositories ?? prev.github.repositories, 
              stars: data.github?.stars ?? prev.github.stars,
              dashboard: data.github?.dashboard ?? prev.github.dashboard
            },
            leetcode: { 
              solved: data.leetcode?.solved ?? prev.leetcode.solved, 
              rating: data.leetcode?.rating ?? prev.leetcode.rating, 
              ranking: data.leetcode?.ranking ?? prev.leetcode.ranking 
            },
            gfg: data.gfg ?? prev.gfg,
            codeforces: data.codeforces ?? prev.codeforces,
            visibility: data.visibility ?? prev.visibility,
            neural: data.neural ?? prev.neural
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
      visible: stats.visibility.github,
      url: profileContent.githubUrl,
      theme: "from-zinc-900/80 to-zinc-900/40",
      accent: "rgba(255,255,255,0.1)"
    },
    { 
      label: "LeetCode Mastery", 
      count: stats.leetcode.solved, 
      detail: `Solved • ${stats.leetcode.rating} Rating`, 
      subStats: `${stats.leetcode.ranking} Global`,
      showGraph: true,
      icon: "leetcode",
      visible: stats.visibility.leetcode,
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
      visible: stats.visibility.gfg,
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
        visible: stats.visibility.codeforces,
        url: profileContent.codeforcesUrl,
        theme: "from-blue-600/20 to-blue-950/40",
        accent: "rgba(31,137,199,0.15)"
      }
  ].filter((stat) => stat.visible);

  const githubUsername = getUsernameFromUrl(profileContent.githubUrl, "Ankurrr27");
  const leetcodeUsername = getUsernameFromUrl(profileContent.leetcodeUrl, "a_nkurrr", "u");
  const githubDashboard = stats.github.dashboard;
  const displayedContributionCells = githubDashboard?.contributionCalendar?.cells?.length
    ? githubDashboard.contributionCalendar.cells.slice(-98) // Ensure max 98 for UI fit
    : contributionCells;
  const displayedContributionMonths = githubDashboard?.contributionCalendar?.months?.length
    ? githubDashboard.contributionCalendar.months
    : contributionMonths;
  const displayedLanguages = githubDashboard?.languages?.length ? githubDashboard.languages : languageStats;
  const totalContributions = githubDashboard?.contributionCalendar?.total || parseNumber(stats.github.contributions, 0);
  const activeDays = githubDashboard?.contributionCalendar?.activeDays || Math.max(Math.round(totalContributions * 0.13), 1);
  const maxStreak = githubDashboard?.contributionCalendar?.maxStreak || 0;
  const currentStreak = githubDashboard?.contributionCalendar?.currentStreak || 0;
  const githubStars = githubDashboard?.stars ?? parseNumber(stats.github.stars, 0);
  const githubCommits = githubDashboard?.commits ?? 0;
  const githubPrs = githubDashboard?.prs ?? 0;
  const githubIssues = githubDashboard?.issues ?? 0;
  const allStats = codingStats;
  const developmentStats = codingStats.filter((stat) => stat.icon === "github");
  const dsaStats = codingStats.filter((stat) => ["leetcode", "gfg"].includes(stat.icon));
  const cpStats = codingStats.filter((stat) => stat.icon === "codeforces");
  const availableDomains = [
    allStats.length > 0 && { key: "all", label: "All", count: allStats.length },
    developmentStats.length > 0 && { key: "development", label: "Development", count: developmentStats.length },
    dsaStats.length > 0 && { key: "dsa", label: "DSA", count: dsaStats.length },
    cpStats.length > 0 && { key: "cp", label: "CP", count: cpStats.length },
  ].filter(Boolean);
  const currentDomain = availableDomains.some((domain) => domain.key === activeDomain)
    ? activeDomain
    : availableDomains[0]?.key;
  const activeStats = currentDomain === "all" ? allStats
    : currentDomain === "development" ? developmentStats
    : currentDomain === "dsa" ? dsaStats
    : cpStats;
  const getGridClass = (count) =>
    count === 1 ? "grid-cols-1" : count === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-3";
  const statsGridClass = getGridClass(codingStats.length);

  let lcTotal = parseNumber(stats.leetcode?.solved, 525);
  let lcEasy = Number(stats.leetcode?.easy) || 0;
  let lcMedium = Number(stats.leetcode?.medium) || 0;
  let lcHard = Number(stats.leetcode?.hard) || 0;

  // Fallback mathematically so they always sum up perfectly to total
  if (lcEasy === 0 && lcMedium === 0 && lcHard === 0) {
    lcEasy = Math.round(lcTotal * 0.33); // ~33%
    lcMedium = Math.round(lcTotal * 0.50); // ~50%
    lcHard = lcTotal - lcEasy - lcMedium; // Remaining
  }

  const leetcodeData = {
    easy: lcEasy,
    medium: lcMedium,
    hard: lcHard,
    total: lcTotal,
    rating: stats.leetcode?.rating || "1619",
    maxRating: "1645"
  };

  const lcEasyPct = leetcodeData.total ? Math.round((leetcodeData.easy / leetcodeData.total) * 100) : 33;
  const lcMedPct = leetcodeData.total ? Math.round((leetcodeData.medium / leetcodeData.total) * 100) : 49;
  const lcMedStop = lcEasyPct + lcMedPct;

  const renderStatCard = (stat, i) => {
    const pc = platformColors[stat.icon] || { text: "text-white", icon: "text-white", glow: "" };
    return (
      <motion.div
        key={stat.icon}
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: i * 0.1, duration: 0.8 }}
        className={`group relative p-8 rounded-[32px] border border-white/5 bg-gradient-to-br ${stat.theme} flex flex-col justify-between transition-all duration-700 backdrop-blur-3xl hover:border-amber-500/30 ${pc.glow} overflow-hidden`}
      >
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
  };

  if (codingStats.length === 0) return null;

  return (
    <section className="section-shell overflow-hidden py-20" id="stats">
      <div className="section-container relative z-10">
        {/* Header */}
        <div className={`flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
           <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                 <Trophy size={16} className="text-amber-400" />
                 <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest">Technical Ledger</span>
              </div>
              <h2 className="section-title">
                Technical <span className="text-amber-500">Domain.</span>
              </h2>
           </div>

        </div>

        <div className="mb-12 space-y-8">
          <div className="overflow-x-auto border-b border-white/10">
            <div className="flex min-w-max gap-8">
              {availableDomains.map((domain) => {
                const isActive = currentDomain === domain.key;
                return (
                  <button
                    key={domain.key}
                    type="button"
                    onClick={() => setActiveDomain(domain.key)}
                    className={`flex items-center gap-2 border-b-2 px-1 pb-4 text-sm font-bold transition-colors ${
                      isActive
                        ? "border-amber-400 text-white"
                        : "border-transparent text-zinc-400 hover:text-white"
                    }`}
                  >
                    <span>{domain.label}</span>
                    <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300">{domain.count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <section className="space-y-5">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-zinc-500">
                {currentDomain === "all" ? "01" : currentDomain === "development" ? "02" : currentDomain === "dsa" ? "03" : "04"}
              </p>
              <h3 className="mt-1 text-2xl font-black text-white tracking-tight">
                {currentDomain === "all" ? "All Profiles" : currentDomain === "development" ? "Development" : currentDomain === "dsa" ? "Data Structures & Algorithms" : "Competitive Programming"}
              </h3>
            </div>

            <div className={`grid ${getGridClass(activeStats.length)} gap-6`}>
              {activeStats.map(renderStatCard)}
            </div>
          </section>
        </div>

        {/* Grid System */}
        <div className={`hidden ${statsGridClass} gap-6 mb-12`}>
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
        <div className={`grid gap-6 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {(currentDomain === "dsa" || currentDomain === "all") && stats.visibility.leetcode && (
              <div className="grid gap-5 lg:grid-cols-2 mt-2">
                {/* Solved Problems Doughnut */}
                <div className="rounded-xl border border-white/10 bg-zinc-950/80 p-6 md:p-8 flex flex-col justify-center relative min-h-[250px]">
                  <p className="text-lg font-black text-zinc-300 mb-6">Problems Solved</p>
                  <div className="flex items-center gap-6 md:gap-8 mt-2">
                      <div className="relative w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-full flex items-center justify-center" 
                          style={{ background: `conic-gradient(#00b8a3 0% ${lcEasyPct}%, #ffc01e ${lcEasyPct}% ${lcMedStop}%, #ef4743 ${lcMedStop}% 100%)` }}>
                        <div className="absolute inset-2 bg-zinc-950 rounded-full flex items-center justify-center">
                            <span className="text-xl md:text-2xl font-black text-white">{leetcodeData.total}</span>
                        </div>
                      </div>
                      
                      <div className="flex-1 space-y-3 md:space-y-4">
                        <div className="flex justify-between items-center text-xs md:text-sm font-bold bg-zinc-900/50 px-3 py-1.5 rounded-md">
                            <span className="text-[#00b8a3]">Easy</span>
                            <span className="text-white">{leetcodeData.easy}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs md:text-sm font-bold bg-zinc-900/50 px-3 py-1.5 rounded-md">
                            <span className="text-[#ffc01e]">Medium</span>
                            <span className="text-white">{leetcodeData.medium}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs md:text-sm font-bold bg-zinc-900/50 px-3 py-1.5 rounded-md">
                            <span className="text-[#ef4743]">Hard</span>
                            <span className="text-white">{leetcodeData.hard}</span>
                        </div>
                      </div>
                  </div>
                </div>

                {/* Contest Rankings */}
                <div className="rounded-xl border border-white/10 bg-zinc-950/80 p-6 md:p-8 flex flex-col items-center justify-center relative overflow-hidden min-h-[250px]">
                  <div className="absolute -right-4 -bottom-4 opacity-5">
                    <SiLeetcode className="text-[12rem]" />
                  </div>
                  <p className="text-lg font-black text-zinc-300 mb-4 w-full text-left">Ranking & Score</p>
                  <div className="flex items-center gap-6 relative z-10 w-full justify-center h-full">
                    <SiLeetcode className="text-5xl md:text-6xl text-zinc-600" />
                    <div className="text-center">
                      <p className="text-6xl md:text-7xl font-black tracking-tight text-white">{leetcodeData.rating}</p>
                      <p className="text-xs text-zinc-500 font-semibold mt-2 uppercase tracking-widest">(max: {leetcodeData.maxRating})</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </section>
  );
};

export default CodingStats;
