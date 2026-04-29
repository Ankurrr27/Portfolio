"use client";
import React, { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Globe, Database, Layers, CheckCircle2 } from "lucide-react";
import EditSectionButton from "./admin/EditSectionButton";
import SkillSphere from "./SkillSphere";



const domainIcons = {
  frontend: <Globe size={20} strokeWidth={2} />,
  backend: <Database size={20} strokeWidth={2} />,
  "problem-solving": <Cpu size={20} strokeWidth={2} />,
};

const CapabilityCard = ({ domain, isActive, onClick }) => (
  <motion.button
    whileHover={{ x: 4 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`relative w-full p-5 text-left rounded-xl border transition-all duration-300 ${
      isActive 
        ? "bg-zinc-900 border-orange-500 shadow-2xl" 
        : "bg-zinc-950 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900"
    }`}
  >
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 flex-shrink-0 rounded-lg flex items-center justify-center transition-colors ${isActive ? "bg-orange-500 text-white" : "bg-zinc-800 text-zinc-500"}`}>
        {domainIcons[domain.key] || <Layers size={20} />}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
           <span className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? "text-orange-500" : "text-zinc-500"}`}>
              {domain.key}
           </span>
           {isActive && <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />}
        </div>
        <h4 className="text-base font-bold text-white mt-1">{domain.title}</h4>
      </div>
    </div>
  </motion.button>
);

const Skills = () => {
  const [domains, setDomains] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeDomain, setActiveDomain] = useState(null);
  const [allSkills, setAllSkills] = useState([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch("/api/skills");
        const data = await res.json();
        if (data.domains && data.domains.length > 0) {
          setDomains(data.domains);
          setActiveDomain(data.domains[0].key);
          setAllSkills(data.domains.flatMap(d => d.items || []));
        }
      } catch (err) {
        console.error("Skills: Error", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSkills();
    // Fallback visibility
    const timer = setTimeout(() => {
      if (isLoading) setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return (
    <section className="w-full py-20 px-6 md:px-12 lg:px-24 bg-zinc-950">
      <div className="max-w-7xl mx-auto space-y-12 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="w-40 h-8 bg-zinc-900 rounded-lg"></div>
            <div className="w-64 h-16 bg-zinc-900 rounded-xl"></div>
          </div>
          <div className="w-full h-24 bg-zinc-900 rounded-xl"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3 space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-20 bg-zinc-900 rounded-xl"></div>)}
          </div>
          <div className="lg:col-span-6 h-64 bg-zinc-900 rounded-xl"></div>
          <div className="lg:col-span-3 h-64 bg-zinc-900 rounded-xl"></div>
        </div>
      </div>
    </section>
  );
  // Removed early return to ensure section is visible even if empty
  const currentDomain = domains.find((d) => d.key === activeDomain) || domains[0] || { title: "No Domain", items: [] };

  return (
    <section id="skills" className="w-full pt-32 pb-24 px-6 md:px-12 lg:px-24 bg-zinc-950 relative overflow-hidden border-b border-zinc-900">
      <EditSectionButton href="/admin/skills" label="Edit Skills" />
      
      <div className="max-w-7xl mx-auto flex flex-col gap-12 relative z-10">
        
        {/* Header Block */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900">
               <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
               <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Technical Inventory</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.1]">
              Digital <br />
              <span className="text-orange-500">
                Foundations.
              </span>
            </h2>
          </div>
          <div className="hidden lg:block h-[300px] w-full">
             <Suspense fallback={<div className="w-full h-full bg-zinc-900 rounded-2xl animate-pulse" />}>
                <SkillSphere skills={domains.flatMap(d => d.items || [])} />
             </Suspense>
          </div>
        </div>
        
        <p className="max-w-2xl text-zinc-400 text-sm md:text-base leading-relaxed border-l-2 border-orange-500 pl-5 mb-8">
            Deploying resilient architectures across the full stack. Focus on performance optimization, scalable data structures, and algorithmic efficiency.
        </p>

        {/* Main Interface Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Domain Selector & Console */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="space-y-3">
               <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest pl-1">Select Domain</p>
               <div className="grid grid-cols-1 gap-3">
                 {domains.map((domain) => (
                   <CapabilityCard 
                     key={domain.key} 
                     domain={domain} 
                     isActive={activeDomain === domain.key}
                     onClick={() => setActiveDomain(domain.key)}
                   />
                 ))}
               </div>
            </div>

            <div className="lg:hidden w-full aspect-square -my-10">
               <Suspense fallback={<div className="w-full h-full bg-zinc-900 rounded-2xl animate-pulse" />}>
                  <SkillSphere skills={domains.flatMap(d => d.items || [])} />
               </Suspense>
            </div>
          </div>

          {/* Center: Skills Visual */}
          <div className="lg:col-span-6 flex items-center justify-center min-h-[300px]">
             <div className="w-full grid grid-cols-3 gap-3 p-4">
               {allSkills.slice(0, 9).map((skill, i) => {
                 const colors = [
                   { bg: "bg-violet-100", text: "text-violet-700", dot: "bg-violet-500" },
                   { bg: "bg-amber-100",  text: "text-amber-700",  dot: "bg-amber-500"  },
                   { bg: "bg-emerald-100",text: "text-emerald-700",dot: "bg-emerald-500"},
                   { bg: "bg-rose-100",   text: "text-rose-700",   dot: "bg-rose-500"   },
                   { bg: "bg-sky-100",    text: "text-sky-700",    dot: "bg-sky-500"    },
                   { bg: "bg-indigo-100", text: "text-indigo-700", dot: "bg-indigo-500" },
                   { bg: "bg-orange-100", text: "text-orange-700", dot: "bg-orange-500" },
                   { bg: "bg-teal-100",   text: "text-teal-700",   dot: "bg-teal-500"   },
                   { bg: "bg-pink-100",   text: "text-pink-700",   dot: "bg-pink-500"   },
                 ];
                 const c = colors[i % colors.length];
                  return (
                    <div key={i} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col items-center gap-2 text-center shadow-lg hover:border-zinc-700 hover:bg-zinc-800 transition-all group">
                      <div className={`w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform border border-zinc-700`}>
                        <span className={`text-zinc-100 font-bold text-[10px]`}>{skill.name?.slice(0,2).toUpperCase()}</span>
                      </div>
                      <span className="text-[10px] font-bold text-zinc-400 leading-tight uppercase tracking-wider">{skill.name}</span>
                      <div className={`w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]`} />
                    </div>
                  );
               })}
             </div>
          </div>

          {/* Right: Technical Manifest */}
          <div className="lg:col-span-3 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDomain}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                 transition={{ duration: 0.3 }}
                 className="w-full bg-zinc-900 border border-zinc-800 shadow-2xl rounded-xl p-8 h-full flex flex-col hover:border-zinc-700 transition-all duration-500"
               >
                  <div className="space-y-6 flex-1">
                     <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-widest text-orange-500 font-bold px-3 py-1 bg-orange-500/10 rounded-lg border border-orange-500/20">DOMAIN LOG</span>
                     </div>

                     <div className="space-y-3">
                        <h3 className="text-xl font-bold text-white">{currentDomain?.title || "Unknown Domain"}</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed">{currentDomain?.summary || "No description available."}</p>
                     </div>

                      <div className="grid grid-cols-1 gap-3 pt-4">
                         {(currentDomain?.items || []).map((skill, si) => {
                           const pct = skill.level === 'Expert' ? '100%' : skill.level === 'Advanced' ? '85%' : skill.level === 'Intermediate' ? '65%' : '45%';
                           return (
                             <div key={skill.name} className="flex flex-col gap-2 p-4 rounded-xl bg-zinc-950/50 border border-zinc-800 hover:border-zinc-700 transition-all group">
                               <div className="flex items-center justify-between">
                                 <p className="text-white text-sm font-bold tracking-tight">{skill.name}</p>
                                 <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{skill.level || "Learning"}</span>
                               </div>
                               <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden mt-1">
                                  <div className={`h-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)] rounded-full transition-all duration-1000`} style={{ width: pct }} />
                               </div>
                             </div>
                           );
                         })}
                      </div>
                 </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
