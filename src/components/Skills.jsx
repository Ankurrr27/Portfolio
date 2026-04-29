"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Globe, Database, Layers, CheckCircle2 } from "lucide-react";
import EditSectionButton from "./admin/EditSectionButton";

import { skillGroups } from "../data/skills";

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
        ? "bg-blue-50 border-blue-200 shadow-sm" 
        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
    }`}
  >
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 flex-shrink-0 rounded-lg flex items-center justify-center transition-colors ${isActive ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`}>
        {domainIcons[domain.key] || <Layers size={20} />}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
           <span className={`text-xs font-semibold uppercase tracking-wider ${isActive ? "text-blue-600" : "text-slate-500"}`}>
              {domain.key}
           </span>
           {isActive && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />}
        </div>
        <h4 className="text-base font-bold text-slate-900 mt-1">{domain.title}</h4>
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
        } else {
          setDomains(skillGroups.domains);
          setActiveDomain(skillGroups.domains[0].key);
          setAllSkills(skillGroups.domains.flatMap(d => d.items || []));
        }
      } catch (err) {
        console.error("Skills: Error", err);
        setDomains(skillGroups.domains);
        setActiveDomain(skillGroups.domains[0].key);
        setAllSkills(skillGroups.domains.flatMap(d => d.items || []));
      } finally {
        setIsLoading(false);
      }
    };
    fetchSkills();
    // Fallback visibility
    const timer = setTimeout(() => {
      if (isLoading) setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return (
    <div className="w-full h-[400px] flex items-center justify-center bg-slate-50">
      <div className="w-[80%] h-full rounded-2xl bg-slate-200 animate-pulse" />
    </div>
  );
  if (domains.length === 0) return null;

  const currentDomain = domains.find((d) => d.key === activeDomain) || domains[0];

  return (
    <section id="skills" className="w-full py-20 px-6 md:px-12 lg:px-24 bg-slate-50 relative overflow-hidden border-b border-slate-100">
      <EditSectionButton href="/admin/skills" label="Edit Skills" />
      
      <div className="max-w-7xl mx-auto flex flex-col gap-12 relative z-10">
        
        {/* Header Block */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white">
               <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
               <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Technical Inventory</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-[1.1]">
              Digital <br />
              <span className="text-blue-600">
                Foundations.
              </span>
            </h2>
          </div>
          <p className="max-w-md text-slate-600 text-sm md:text-base leading-relaxed border-l-2 border-blue-500 pl-5">
            Deploying resilient architectures across the full stack. Focus on performance optimization, scalable data structures, and algorithmic efficiency.
          </p>
        </div>

        {/* Main Interface Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Domain Selector & Console */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="space-y-3">
               <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest pl-1">Select Domain</p>
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

            {/* System Monitor Card */}
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
               <div className="flex justify-between items-center text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-3 font-semibold">
                  <span>System Monitor</span>
                  <span className="text-emerald-600 font-bold">Live</span>
               </div>
               <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-2">
                       <span className="text-slate-500">Processing</span>
                       <span className="text-slate-900">98%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                       <motion.div initial={{ width: 0 }} animate={{ width: "98%" }} className="h-full bg-blue-500" />
                    </div>
                  </div>
                  <div className="flex justify-between text-xs font-semibold">
                     <span className="text-slate-500">Stability</span>
                     <span className="text-blue-600 font-bold uppercase">Optimal</span>
                  </div>
               </div>
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
                   <div key={i} className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col items-center gap-2 text-center shadow-sm hover:shadow-md transition-all group">
                     <div className={`w-9 h-9 rounded-lg ${c.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                       <span className={`${c.text} font-bold text-xs`}>{skill.name?.slice(0,2).toUpperCase()}</span>
                     </div>
                     <span className="text-xs font-semibold text-slate-700 leading-tight">{skill.name}</span>
                     <div className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
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
                className="w-full bg-white border border-slate-200 shadow-sm rounded-xl p-8 h-full flex flex-col hover:border-slate-300 transition-colors duration-500"
              >
                 <div className="space-y-6 flex-1">
                    <div className="flex items-center justify-between">
                       <span className="text-xs uppercase tracking-wider text-blue-600 font-bold px-2 py-1 bg-blue-50 rounded">DOMAIN LOG</span>
                    </div>

                    <div className="space-y-3">
                       <h3 className="text-xl font-bold text-slate-900">{currentDomain?.title || "Unknown Domain"}</h3>
                       <p className="text-slate-600 text-sm leading-relaxed">{currentDomain?.summary || "No description available."}</p>
                    </div>

                     <div className="grid grid-cols-1 gap-3 pt-4">
                        {(currentDomain?.items || []).map((skill, si) => {
                          const barColors = ["bg-violet-500","bg-amber-500","bg-emerald-500","bg-rose-500","bg-sky-500","bg-orange-500"];
                          const barColor = barColors[si % barColors.length];
                          const pct = skill.level === 'Expert' ? '100%' : skill.level === 'Advanced' ? '85%' : skill.level === 'Intermediate' ? '65%' : '45%';
                          return (
                            <div key={skill.name} className="flex flex-col gap-1.5 p-3 rounded-lg bg-slate-50 border border-slate-100 hover:bg-white hover:border-slate-200 transition-colors">
                              <div className="flex items-center justify-between">
                                <p className="text-slate-900 text-sm font-semibold">{skill.name}</p>
                                <span className="text-xs text-slate-500 font-medium">{skill.level || "Learning"}</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1">
                                 <div className={`h-full ${barColor} rounded-full transition-all duration-700`} style={{ width: pct }} />
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
