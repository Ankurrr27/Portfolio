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
  
  if (slug === "github") return "https://cdn.simpleicons.org/github/white";
  if (slug === "nextjs") return "https://cdn.simpleicons.org/nextdotjs/white";
  if (slug === "express") return "https://cdn.simpleicons.org/express/white";
  if (slug === "rust") return "https://cdn.simpleicons.org/rust/white";
  if (slug === "authjs") return "https://cdn.simpleicons.org/auth0";
  if (slug === "threejs") return "https://cdn.simpleicons.org/threedotjs/white";
  if (slug === "amazonwebservices") return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg";
  
  return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-original.svg`;
};

const HARDCODED_SKILLS = [
  { name: "CPP", level: "Expert", contribution: "34", about: "Core language used for competitive programming, deep algorithm optimization, and high-performance systems." },
  { name: "Java", level: "Advanced", contribution: "18", about: "Utilized for enterprise-level backend development, object-oriented design, and scalable architectures." },
  { name: "JS", level: "Expert", contribution: "42", about: "The backbone of my web development, powering dynamic interactions, API integrations, and complex frontends." },
  { name: "TS", level: "Advanced", contribution: "28", about: "Ensuring type safety, robust code architecture, and fewer runtime errors across large-scale web applications." },
  { name: "Python", level: "Expert", contribution: "35", about: "Leveraged for rapid backend prototyping, data processing scripts, and integrating AI/ML models." },
  { name: "Go", level: "Intermediate", contribution: "12", about: "Exploring highly concurrent, performant backend microservices and modern distributed systems." },
  { name: "Rust", level: "Learning", contribution: "5", about: "Currently learning memory-safe system programming and building blazing fast terminal utilities." },
  { name: "HTML", level: "Expert", contribution: "60", about: "Writing semantic, accessible, and SEO-friendly document structures for the modern web." },
  { name: "CSS", level: "Expert", contribution: "55", about: "Crafting responsive, high-fidelity UI designs with modern layout techniques and smooth animations." },
  { name: "React", level: "Expert", contribution: "48", about: "Building complex, state-driven user interfaces with modular, reusable component architecture." },
  { name: "Next", level: "Expert", contribution: "30", about: "Primary framework for production-ready, server-rendered React applications with optimal SEO." },
  { name: "NodeJS", level: "Expert", contribution: "38", about: "Developing scalable backend architectures, RESTful APIs, and efficient event-driven microservices." },
  { name: "Express", level: "Advanced", contribution: "25", about: "Streamlining Node.js backend routing, middleware integration, and secure API endpoint creation." },
  { name: "Tailwind", level: "Expert", contribution: "45", about: "Rapidly styling responsive, modern interfaces using utility-first classes and custom design systems." },
  { name: "MongoDB", level: "Advanced", contribution: "22", about: "Managing flexible, document-based NoSQL databases for rapid prototyping and unstructured data." },
  { name: "PostgreSQL", level: "Advanced", contribution: "18", about: "Designing robust relational database schemas, complex queries, and ACID-compliant transaction systems." },
  { name: "Redis", level: "Intermediate", contribution: "8", about: "Implementing high-speed in-memory caching layers and managing real-time session states." },
  { name: "Docker", level: "Advanced", contribution: "15", about: "Containerizing applications for consistent, isolated development environments and seamless deployments." },
  { name: "AWS", level: "Intermediate", contribution: "10", about: "Deploying applications, managing cloud storage, and configuring scalable cloud infrastructure." },
  { name: "GitHub", level: "Expert", contribution: "100", about: "Central hub for version control, open-source collaboration, and automated CI/CD pipeline actions." },
  { name: "Git", level: "Expert", contribution: "100", about: "Maintaining strict version control, branch management, and collaborative codebase synchronization." },
  { name: "Linux", level: "Advanced", contribution: "40", about: "Daily driver for development, server management, shell scripting, and deep system configuration." },
  { name: "VSCode", level: "Pro", contribution: "100", about: "Primary IDE optimized with custom extensions, snippets, and integrated terminal workflows." },
  { name: "Figma", level: "Intermediate", contribution: "15", about: "Translating wireframes into high-fidelity UI/UX prototypes and extracting precise design tokens." },
  { name: "Auth.js", level: "Advanced", contribution: "20", about: "Implementing secure authentication flows, OAuth integrations, and robust session management." },
  { name: "Postman", level: "Expert", contribution: "100", about: "Testing, documenting, and managing RESTful API endpoints and backend microservices." },
  { name: "MySQL", level: "Intermediate", contribution: "15", about: "Structuring relational databases and writing optimized SQL queries for web applications." },
  { name: "Android Studio", level: "Advanced", contribution: "30", about: "Developing native mobile applications with integrated debugging and profiling tools." },
  { name: "Dart", level: "Advanced", contribution: "40", about: "Writing reactive, object-oriented code for cross-platform mobile and web applications." },
  { name: "Flutter", level: "Advanced", contribution: "45", about: "Building beautiful, natively compiled, multi-platform applications from a single codebase." },
  { name: "Three.js", level: "Intermediate", contribution: "10", about: "Creating interactive 3D graphics and immersive WebGL experiences in the browser." },
];

const Skills = () => {
  const [selectedSkill, setSelectedSkill] = React.useState(null);

  const allSkills = React.useMemo(
    () =>
      HARDCODED_SKILLS.map((item) => ({
        image: getLogoUrl(item.name),
        title: item.name,
        description: item.level,
        contribution: item.contribution,
        about: item.about,
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
              <Cpu size={16} className="text-amber-500" />
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


              {selectedSkill ? (
                <div className="space-y-5 md:space-y-6 animate-in fade-in slide-in-from-right-4 duration-200">
                  <div className="flex items-center gap-4 md:gap-5">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-zinc-950 border border-zinc-800 p-3 md:p-4 flex items-center justify-center shrink-0">
                      <img src={selectedSkill.image} alt={selectedSkill.title} className="w-full h-full object-contain drop-shadow-md" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight break-words">{selectedSkill.title}</h3>
                      <p className="mt-2 text-xs font-semibold text-amber-500 uppercase tracking-wide">{selectedSkill.description}</p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">GitHub Contribution</span>
                      <span className="text-xs font-bold text-white">{selectedSkill.contribution}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                      <div className="h-full bg-amber-500 rounded-full transition-all duration-1000 ease-out" style={{ width: `${selectedSkill.contribution}%` }} />
                    </div>
                  </div>

                  <p className="section-copy text-sm leading-relaxed">
                    {selectedSkill.about}
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
