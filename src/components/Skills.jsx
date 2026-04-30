"use client";

import React from "react";
import { Cpu, Zap } from "lucide-react";
import InfiniteMenu from "./ui/InfiniteMenu";

const getLogoUrl = (skillName) => {
  const name = skillName.toLowerCase().trim();

  const mapping = {
    sc: "scala",
    cpp: "cplusplus",
    java: "java",
    js: "javascript",
    ts: "typescript",
    github: "github",
    git: "git",
    vscode: "vscode",
    figma: "figma",
    docker: "docker",
    html: "html5",
    css: "css3",
    python: "python",
    react: "react",
    next: "nextjs",
    nodejs: "nodejs",
    express: "express",
    angular: "angularjs",
    mongodb: "mongodb",
    tailwind: "tailwindcss",
    aws: "amazonwebservices",
    postgresql: "postgresql",
    firebase: "firebase",
    rust: "rust",
    go: "go",
    kubernetes: "kubernetes",
    mysql: "mysql",
    redis: "redis",
    linux: "linux",
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

  const allSkills = React.useMemo(
    () =>
      HARDCODED_SKILLS.map((item) => ({
        image: getLogoUrl(item.name),
        title: item.name,
        description: item.level,
        link: "#",
      })),
    []
  );

  return (
    <section id="skills" className="section-shell overflow-hidden">
      <div className="section-container relative z-10 mb-8 md:mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-4">
            <div className="section-kicker">
              <Cpu size={16} className="text-orange-500" />
              <span>Skills</span>
            </div>
            <h2 className="section-title">
              Technical <span className="accent-text">toolkit.</span>
            </h2>
          </div>
          <p className="section-copy max-w-sm md:text-right">
            A focused map of languages, frameworks, databases, and tools I use to build reliable software.
          </p>
        </div>
      </div>

      <div className="section-container">
        <div className="panel grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-5 md:gap-8 p-3 md:p-6">
          <div className="relative h-[360px] sm:h-[420px] md:h-[560px] overflow-hidden rounded-lg bg-zinc-950 border border-zinc-800">
            <div className="absolute left-3 top-3 md:left-4 md:top-4 z-20 section-kicker bg-zinc-950/80">
              Stack Map
            </div>
            <InfiniteMenu items={allSkills} scale={1.05} hideInfo={true} onItemChange={setSelectedSkill} />
          </div>

          <aside className="panel-subtle p-4 md:p-6 flex flex-col justify-between min-h-[260px] md:min-h-[320px]">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="icon-box">
                  <Zap size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Selected Skill</h4>
                  <p className="text-sm text-zinc-400">Tap or hover the map to inspect a tool.</p>
                </div>
              </div>

              {selectedSkill ? (
                <div className="space-y-5 md:space-y-6 animate-in fade-in slide-in-from-right-4 duration-200">
                  <div className="flex items-center gap-4 md:gap-5">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-zinc-950 border border-zinc-800 p-3 md:p-4 flex items-center justify-center shrink-0">
                      <img src={selectedSkill.image} alt={selectedSkill.title} className="w-full h-full object-contain grayscale" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight break-words">{selectedSkill.title}</h3>
                      <p className="mt-2 text-xs font-semibold text-orange-500 uppercase tracking-wide">{selectedSkill.description}</p>
                    </div>
                  </div>

                  <p className="section-copy">
                    Practical production experience with {selectedSkill.title}, focused on maintainable implementation and clear system boundaries.
                  </p>
                </div>
              ) : (
                <div className="py-16 border border-dashed border-zinc-800 rounded-lg text-center">
                  <p className="text-xs font-semibold text-zinc-600 uppercase tracking-wide">Awaiting selection</p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Skills;
