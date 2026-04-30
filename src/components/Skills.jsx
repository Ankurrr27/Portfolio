"use client";
import React, { Suspense, lazy } from "react";
import { Cpu, Sparkles, Zap, Loader2 } from "lucide-react";
import InfiniteMenu from "./ui/InfiniteMenu";

const Spline = lazy(() => import("@splinetool/react-spline"));

const getLogoUrl = (skillName) => {
  const name = skillName.toLowerCase().trim();
  
  const mapping = {
    "sc": "scala",
    "cpp": "cplusplus",
    "java": "java",
    "js": "javascript",
    "ts": "typescript",
    "github": "github",
    "git": "git",
    "vscode": "vscode",
    "figma": "figma",
    "docker": "docker",
    "html": "html5",
    "css": "css3",
    "python": "python",
    "react": "react",
    "next": "nextjs",
    "nodejs": "nodejs",
    "express": "express",
    "angular": "angularjs",
    "mongodb": "mongodb",
    "tailwind": "tailwindcss",
    "aws": "amazonwebservices",
    "postgresql": "postgresql",
    "firebase": "firebase",
    "rust": "rust",
    "go": "go",
    "kubernetes": "kubernetes",
    "mysql": "mysql",
    "redis": "redis",
    "linux": "linux"
  };

  const slug = mapping[name] || name.replace(/[^a-z0-9]/g, "");
  if (slug === "github") return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg";
  return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-original.svg`;
};

const HARDCODED_SKILLS = [
  { name: "CPP", level: "Expert" },
  { name: "Java", level: "Advanced" },
  { name: "JS", level: "Expert" },
  { name: "TS", level: "Advanced" },
  { name: "Python", level: "Expert" },
  { name: "Go", level: "Intermediate" },
  { name: "Rust", level: "Learning" },
  { name: "HTML", level: "Expert" },
  { name: "CSS", level: "Expert" },
  { name: "React", level: "Expert" },
  { name: "Next", level: "Expert" },
  { name: "NodeJS", level: "Expert" },
  { name: "Express", level: "Advanced" },
  { name: "Tailwind", level: "Expert" },
  { name: "MongoDB", level: "Advanced" },
  { name: "PostgreSQL", level: "Advanced" },
  { name: "Redis", level: "Intermediate" },
  { name: "Docker", level: "Advanced" },
  { name: "AWS", level: "Intermediate" },
  { name: "GitHub", level: "Expert" },
  { name: "Git", level: "Expert" },
  { name: "Linux", level: "Advanced" },
  { name: "VSCode", level: "Pro" },
  { name: "Figma", level: "Intermediate" },
];

const Skills = () => {
  const [selectedSkill, setSelectedSkill] = React.useState(null);

  const allSkills = React.useMemo(() => 
    HARDCODED_SKILLS.map(item => ({
      image: getLogoUrl(item.name),
      title: item.name,
      description: item.level,
      link: "#"
    })), []);

  return (
    <section id="skills" className="w-full pt-32 pb-24 px-0 bg-zinc-950 relative overflow-hidden border-b border-zinc-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(37,99,235,0.18),transparent_34%),radial-gradient(circle_at_18%_70%,rgba(249,115,22,0.16),transparent_28%),linear-gradient(180deg,#09090b_0%,#020617_100%)]" />
      <div className="absolute inset-x-0 top-28 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 relative z-10 mb-16">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900">
               <Cpu size={16} className="text-blue-500" />
               <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Neural Skill Web</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-[1.1]">
              Technical <br />
              <span className="text-blue-500 drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]">Skill Sphere.</span>
            </h2>
          </div>
          <p className="max-w-xs text-zinc-400 text-sm md:text-base leading-relaxed text-left md:text-right">
            A high-density 3D visualization of my technical stack and engineering expertise.
          </p>
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[110rem] px-4 md:px-8 lg:px-14">
        <div className="relative min-h-[700px] flex flex-col lg:flex-row gap-12 items-center overflow-hidden rounded-[3rem] bg-black/20 shadow-2xl p-4 md:p-8">
          
          {/* Left: 3D Sphere Container */}
          <div className="relative flex-1 w-full h-[500px] lg:h-[700px] overflow-hidden group">
            {/* Control Label */}
            <div className="absolute top-6 left-6 z-20 flex items-center gap-2 rounded-full border border-white/5 bg-zinc-950/40 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500 shadow-xl backdrop-blur-md">
              <Sparkles size={13} className="text-blue-500/50" />
              Neural_Architecture
            </div>

            {/* The Sphere Menu */}
            <div className="relative z-10 h-full w-full">
              <InfiniteMenu 
                items={allSkills} 
                scale={1.8} 
                hideInfo={true}
                onItemChange={setSelectedSkill}
              />
            </div>
          </div>

          {/* Right: Info Panel */}
          <div className="w-full lg:w-[450px] shrink-0 space-y-6 relative z-20">
            <div className="p-10 rounded-[3rem] bg-zinc-900/40 backdrop-blur-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
              <div className="space-y-8 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-center justify-center">
                    <Zap size={24} className="text-blue-500/40" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.4em]">Node Analysis</h4>
                    <p className="text-xs text-zinc-500 font-mono">STABLE_CONNECTION</p>
                  </div>
                </div>

                {selectedSkill ? (
                  <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-700">
                    <div className="flex items-center gap-8">
                      <div className="w-24 h-24 rounded-3xl bg-black/40 border border-white/5 p-5 flex items-center justify-center shadow-2xl">
                        <img src={selectedSkill.image} alt={selectedSkill.title} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500" />
                      </div>
                      <div>
                        <h3 className="text-4xl font-bold text-white tracking-tight">{selectedSkill.title}</h3>
                        <div className="flex items-center gap-2 mt-3">
                          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                          <span className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em]">
                            {selectedSkill.description}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest font-mono">0x00_EFFICIENCY</span>
                        <span className="text-xs font-bold text-blue-500/60 font-mono">98.4%</span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500/40 w-[98%]" />
                      </div>
                    </div>

                    <p className="text-sm text-zinc-500 leading-relaxed font-light">
                      High-frequency production experience in {selectedSkill.title}, focusing on scalable architecture and performance optimization within the Neural Skill Web.
                    </p>
                  </div>
                ) : (
                  <div className="py-24 flex flex-col items-center justify-center text-center space-y-6 opacity-30">
                    <div className="w-20 h-20 rounded-full border border-dashed border-white/10 animate-spin-slow" />
                    <p className="text-xs font-medium text-zinc-600 uppercase tracking-[0.3em]">Awaiting Node Selection...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Minimal HUD info */}
            <div className="flex gap-8 px-8 opacity-40">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">Sys_Log</span>
                <span className="text-[10px] font-mono text-zinc-500">INIT_OK</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">Network</span>
                <span className="text-[10px] font-mono text-zinc-500">ENCRYPTED</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Skills;
