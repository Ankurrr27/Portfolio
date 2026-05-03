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
const contributionCells = Array.from({ length: 98 }, (_, index) => {
  const seed = (index * 17 + 11) % 19;
  if (seed > 14) return "bg-emerald-400";
  if (seed > 10) return "bg-emerald-600";
  if (seed > 6) return "bg-emerald-900";
  return "bg-zinc-700";
});

const languageStats = [
  { name: "JavaScript", percent: 51, color: "bg-red-500" },
  { name: "TypeScript", percent: 27, color: "bg-orange-500" },
  { name: "C++", percent: 10, color: "bg-emerald-500" },
  { name: "Others", percent: 5, color: "bg-orange-400" },
  { name: "CSS", percent: 4, color: "bg-yellow-400" },
  { name: "Java", percent: 3, color: "bg-sky-400" },
];

const CodingStats = () => {
  const [stats, setStats] = useState({
    github: { contributions: "1200+", repositories: "35+", stars: "150+", dashboard: null },
    leetcode: { solved: "450+", rating: "1650+", ranking: "Top 5%" },
    gfg: { score: "1200+", rank: "1", percentile: "Top 1%" },
    codeforces: { rating: "1450+", rank: "Specialist", solved: "300+" },
    visibility: { github: true, leetcode: true, gfg: true, codeforces: true },
    neural: {
      github: { val: 92, label: "Open Source Velocity", trend: "+12%" },
      leetcode: { val: 88, label: "Algorithmic Precision", trend: "+5%" },
      gfg: { val: 75, label: "Consistency Index", trend: "+8%" },
      codeforces: { val: 65, label: "Competitive Standing", trend: "+2%" },
      globalScore: "8.9",
    }
  });
  const [isVisible, setIsVisible] = useState(false);
  const [activeDomain, setActiveDomain] = useState("development");

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
      subStats: `${stats.leetcode.ranking} Global • Knight`,
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
    ? githubDashboard.contributionCalendar.cells
    : contributionCells.map((className, index) => ({ date: String(index), level: className.includes("400") ? 4 : className.includes("600") ? 3 : className.includes("900") ? 2 : 0 }));
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
  const developmentStats = codingStats.filter((stat) => stat.icon === "github");
  const cpStats = codingStats.filter((stat) => ["leetcode", "gfg", "codeforces"].includes(stat.icon));
  const availableDomains = [
    developmentStats.length > 0 && { key: "development", label: "Development", count: developmentStats.length },
    cpStats.length > 0 && { key: "cp-dsa", label: "CP & DSA", count: cpStats.length },
  ].filter(Boolean);
  const currentDomain = availableDomains.some((domain) => domain.key === activeDomain)
    ? activeDomain
    : availableDomains[0]?.key;
  const activeStats = currentDomain === "development" ? developmentStats : cpStats;
  const getGridClass = (count) =>
    count === 1
      ? "grid-cols-1"
      : count === 2
        ? "grid-cols-1 md:grid-cols-2"
        : "grid-cols-1 md:grid-cols-3";
  const statsGridClass = getGridClass(codingStats.length);
  const showDetailPanel = currentDomain === "development"
    ? stats.visibility.github
    : stats.visibility.leetcode;

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
    <section className="section-shell overflow-visible py-20" id="stats">
      <div className="section-container relative z-10">
        {/* Header */}
        <div className={`flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
           <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                 <Trophy size={16} className="text-amber-400" />
                 <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest">Technical Ledger</span>
              </div>
              <h2 className="section-title text-white">
                Technical <span className="accent-text">Domain.</span>
              </h2>
           </div>
           <p className="section-copy max-w-md lg:text-right text-zinc-400 italic">
              Development work and problem-solving records, separated by domain.
           </p>
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
                {currentDomain === "development" ? "01" : "02"}
              </p>
              <h3 className="mt-1 text-2xl font-black text-white tracking-tight">
                {currentDomain === "development" ? "Development" : "CP & DSA"}
              </h3>
              <p className="mt-2 max-w-2xl text-sm text-zinc-400">
                {currentDomain === "development"
                  ? "GitHub, open-source work, repositories, stars, commits, and language activity."
                  : "LeetCode, GFG, and Codeforces progress for problem solving and contests."}
              </p>
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

        {showDetailPanel && (
          <div className={`grid gap-6 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {currentDomain === "cp-dsa" && stats.visibility.leetcode && (
              <div className="rounded-[28px] border border-orange-400/20 bg-orange-500/10 p-6 md:p-8">
                <div className="flex items-center gap-3">
                  <SiLeetcode className="text-2xl text-[#FFA116]" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-orange-200/70">LeetCode Contest Rating</p>
                    <a href={profileContent.leetcodeUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-orange-200 hover:text-white">
                      @{leetcodeUsername}
                    </a>
                  </div>
                </div>
                <div className="mt-8">
                  <p className="text-6xl font-black tracking-tight text-white">{stats.leetcode.rating}</p>
                  <p className="mt-2 text-sm font-semibold text-orange-100/70">
                    {stats.leetcode.solved} solved problems • {stats.leetcode.ranking} global ranking
                  </p>
                </div>
              </div>
            )}

            {currentDomain === "development" && stats.visibility.github && (
              <div className="space-y-5 rounded-[28px] border border-white/10 bg-zinc-950/80 p-5 md:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">GitHub Activity</p>
                    <a href={profileContent.githubUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-2 text-sm font-bold text-zinc-200 hover:text-white">
                      <SiGithub className="text-lg" />
                      @{githubUsername}
                    </a>
                  </div>
                  <p className="text-xs font-bold text-zinc-400">{stats.github.repositories} repositories</p>
                </div>

                <div className="grid gap-5 xl:grid-cols-[220px_220px_1fr]">
                  <div className="relative rounded-xl border border-white/10 bg-white/[0.03] p-5">
                    <Info size={15} className="absolute right-4 top-4 text-zinc-500" />
                    <p className="text-lg font-black text-zinc-300">Total Contributions</p>
                    <p className="mt-5 text-6xl font-black tracking-tight text-white">{totalContributions}</p>
                  </div>

                  <div className="relative rounded-xl border border-white/10 bg-white/[0.03] p-5">
                    <Info size={15} className="absolute right-4 top-4 text-zinc-500" />
                    <p className="text-lg font-black text-zinc-300">Total Active Days</p>
                    <p className="mt-5 text-6xl font-black tracking-tight text-white">{activeDays}</p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                    <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-black text-zinc-300">
                      <span>Contributions <span className="text-white">{totalContributions}</span></span>
                      <span>Max.Streak <span className="text-white">{maxStreak}</span></span>
                      <span>Current.Streak <span className="text-white">{currentStreak}</span></span>
                    </div>
                    <div className="overflow-x-auto">
                      <div className="min-w-[600px]">
                        <div className="grid grid-flow-col grid-rows-7 gap-1">
                          {displayedContributionCells.map((cell, index) => (
                            <div
                              key={`${cell.date}-${index}`}
                              title={cell.date}
                              className={`h-3 w-3 rounded-[3px] ${
                                cell.level >= 4
                                  ? "bg-emerald-400"
                                  : cell.level === 3
                                    ? "bg-emerald-500"
                                    : cell.level === 2
                                      ? "bg-emerald-700"
                                      : cell.level === 1
                                        ? "bg-emerald-900"
                                        : "bg-zinc-700"
                              }`}
                            />
                          ))}
                        </div>
                        <div className="mt-2 grid grid-cols-7 text-center text-xs font-semibold text-zinc-500">
                          {displayedContributionMonths.slice(-7).map((month) => (
                            <span key={month}>{month}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                    <h4 className="text-lg font-black text-zinc-300">Languages</h4>
                    <div className="mt-8 flex h-6 overflow-hidden rounded-full bg-zinc-800">
                      {displayedLanguages.map((language) => (
                        <span
                          key={language.name}
                          className={language.color}
                          style={{ width: `${language.percent}%` }}
                        />
                      ))}
                    </div>
                    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {displayedLanguages.map((language) => (
                        <div key={language.name} className="flex items-center gap-3 text-sm font-bold text-zinc-300">
                          <span className={`h-4 w-4 rounded-full ${language.color}`} />
                          <span>{language.name}</span>
                          <span className="text-zinc-500">{language.percent}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                    <h4 className="text-lg font-black text-zinc-300">Stats</h4>
                    <div className="mt-6 space-y-5">
                      {[
                        { label: "Stars", value: githubStars, icon: Star, color: "text-yellow-400" },
                        { label: "Commits", value: githubCommits, icon: GitCommitHorizontal, color: "text-orange-400" },
                        { label: "PRs", value: githubPrs, icon: GitPullRequest, color: "text-emerald-400" },
                        { label: "Issues", value: githubIssues, icon: TriangleAlert, color: "text-red-400" },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between gap-4 text-xl font-black text-zinc-300">
                          <div className="flex items-center gap-3">
                            <item.icon className={item.color} size={24} />
                            <span>{item.label}</span>
                          </div>
                          <span className="text-white">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default CodingStats;
