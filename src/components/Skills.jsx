"use client";
import React from "react";
import { Cpu, Sparkles, Zap } from "lucide-react";
import InfiniteMenu from "./ui/InfiniteMenu";

const getLogoUrl = (skillName) => {
  const name = skillName.toLowerCase().trim();
  
  const mapping = {
    "sc": "scala",
    "cpp": "cplusplus",
    "java": "java",
    "js": "javascript",
    "github": "github",
    "igt": "git",
    "git": "git",
    "vscode": "vscode",
    "figma": "figma",
    "docker": "docker",
    "htmcl": "html5",
    "html": "html5",
    "css": "css3",
    "python": "python",
    "crud": "chrome",
    "cors": "chrome",
    "rest": "chrome",
    "react": "react",
    "next": "nextjs",
    "nodejs": "nodejs",
    "exoress": "express",
    "angular": "angularjs",
    "express": "express",
  };

  const slug = mapping[name] || name.replace(/[^a-z0-9]/g, "");
  if (slug === "github") return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg";
  return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-original.svg`;
};

const HARDCODED_SKILLS = [
  { name: "SC", level: "Language" },
  { name: "CPP", level: "Expert" },
  { name: "Java", level: "Advanced" },
  { name: "JS", level: "Expert" },
  { name: "GitHub", level: "VCS" },
  { name: "IGT", level: "VCS" },
  { name: "VSCode", level: "IDE" },
  { name: "Figma", level: "Design" },
  { name: "Docker", level: "DevOps" },
  { name: "HTMCL", level: "Frontend" },
  { name: "CSS", level: "Frontend" },
  { name: "Python", level: "Backend" },
  { name: "CRUD", level: "Backend" },
  { name: "CORS", level: "Security" },
  { name: "REST", level: "API" },
  { name: "React", level: "Frontend" },
  { name: "Next", level: "FullStack" },
  { name: "NodeJS", level: "Backend" },
  { name: "Exoress", level: "Backend" },
  { name: "Angular", level: "Frontend" },
];

const Skills = () => {
  const allSkills = HARDCODED_SKILLS.map(item => ({
    image: getLogoUrl(item.name),
    title: item.name,
    description: item.level,
    link: "#"
  }));

  return (
    <section id="skills" className="w-full pt-32 pb-20 px-0 bg-zinc-950 relative overflow-hidden border-b border-zinc-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(37,99,235,0.18),transparent_34%),radial-gradient(circle_at_18%_70%,rgba(249,115,22,0.16),transparent_28%),linear-gradient(180deg,#09090b_0%,#020617_100%)]" />
      <div className="absolute inset-x-0 top-28 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="absolute left-1/2 top-[54%] h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5" />
      <div className="absolute left-1/2 top-[54%] h-[31rem] w-[31rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-500/10" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 relative z-10 mb-10">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900">
               <Cpu size={16} className="text-orange-500" />
               <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Architectural Graph</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-[1.1]">
              Technical <br />
              <span className="text-orange-400 drop-shadow-[0_0_20px_rgba(251,146,60,0.3)]">Infinite Orbit.</span>
            </h2>
          </div>
          <p className="max-w-xs text-zinc-400 text-sm md:text-base leading-relaxed text-left md:text-right">
            An immersive 3D visualization of my technical stack and engineering expertise.
          </p>
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[110rem] px-4 md:px-8 lg:px-14">
        <div className="relative min-h-[680px] overflow-hidden rounded-[2rem] border border-white/10 bg-black/45 shadow-[0_40px_120px_rgba(0,0,0,0.65)] [perspective:1200px]">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:56px_56px] opacity-35" />
          <div className="absolute inset-8 rounded-[1.5rem] border border-white/5 shadow-[inset_0_0_80px_rgba(37,99,235,0.12)]" />

          <div className="absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-zinc-950/80 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400 shadow-xl backdrop-blur-md md:flex">
            <Sparkles size={13} className="text-blue-400" />
            Drag the orbit
            <Zap size={13} className="text-orange-400" />
          </div>

          <div className="absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="relative h-[680px] md:h-[720px]">
            <InfiniteMenu items={allSkills} scale={0.72} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
