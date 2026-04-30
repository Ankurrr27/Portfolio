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
        <div className="relative min-h-[700px] flex flex-col lg:flex-row gap-8 items-center overflow-hidden rounded-[3rem] border border-white/10 bg-black/45 shadow-[0_40px_120px_rgba(0,0,0,0.65)] p-4 md:p-8">
          
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:56px_56px] opacity-20 pointer-events-none" />

          {/* Left: 3D Sphere Container */}
          <div className="relative flex-1 w-full h-[500px] lg:h-[650px] rounded-[2rem] bg-zinc-950/30 border border-white/5 overflow-hidden group">
            {/* Control Label */}
            <div className="absolute top-6 left-6 z-20 flex items-center gap-2 rounded-full border border-white/10 bg-zinc-950/80 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400 shadow-xl backdrop-blur-md">
              <Sparkles size={13} className="text-blue-400" />
              Interacting: Sphere_Orbit
            </div>

            {/* Spline Background - Micro Accent */}
            <div className="absolute inset-0 z-0 opacity-40 flex items-center justify-center overflow-hidden pointer-events-none">
              <div className="w-full h-full scale-[0.2] origin-center">
                <Suspense fallback={null}>
                  <Spline scene="https://prod.spline.design/rfoM3Abbt2sf0Ghq/scene.splinecode" />
                </Suspense>
              </div>
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
            
            {/* Visual Guides */}
            <div className="absolute inset-0 border border-white/5 pointer-events-none rounded-[2rem] shadow-[inset_0_0_100px_rgba(59,130,246,0.05)]" />
          </div>

          {/* Right: Info Panel */}
          <div className="w-full lg:w-[400px] shrink-0 space-y-6 relative z-20">
            <div className="p-8 rounded-[2rem] bg-zinc-900/60 backdrop-blur-2xl border border-white/10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Cpu size={80} />
              </div>

              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <Zap size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">Skill Manifest</h4>
                    <p className="text-xs text-zinc-400">Selected Node Status</p>
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-white/10 to-transparent w-full" />

                {selectedSkill ? (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-2xl bg-zinc-950 border border-white/10 p-4 flex items-center justify-center shadow-inner">
                        <img src={selectedSkill.image} alt={selectedSkill.title} className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold text-white tracking-tight">{selectedSkill.title}</h3>
                        <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-2 inline-block">
                          {selectedSkill.description}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Efficiency</span>
                        <span className="text-xs font-bold text-blue-400 font-mono">94.2%</span>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden border border-white/5">
                        <div className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] w-[94%]" />
                      </div>
                    </div>

                    <p className="text-sm text-zinc-400 leading-relaxed">
                      Technical proficiency in {selectedSkill.title} verified across multiple production-grade projects and architectural implementations.
                    </p>
                  </div>
                ) : (
                  <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                    <div className="w-16 h-16 rounded-full border border-dashed border-white/20 animate-spin-slow" />
                    <p className="text-xs font-medium text-zinc-500 uppercase tracking-[0.2em]">Select Node to View Data</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom HUD info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-zinc-900/40 border border-white/5 flex flex-col gap-1">
                <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Core_Dump</span>
                <span className="text-xs font-mono text-zinc-400">ACTIVE_STATE</span>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-900/40 border border-white/5 flex flex-col gap-1">
                <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Level_Manifest</span>
                <span className="text-xs font-mono text-zinc-400">VERIFIED</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Skills;
