"use client";
import React from "react";
import { Cpu } from "lucide-react";
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
    <section id="skills" className="w-full pt-32 pb-0 px-0 bg-zinc-950 relative overflow-hidden border-b border-zinc-900">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 relative z-10 mb-12">
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

      <div className="w-full h-[600px] md:h-[700px] relative">
        <InfiniteMenu items={allSkills} scale={1.2} />
      </div>
    </section>
  );
};

export default Skills;
