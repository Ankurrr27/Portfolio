"use client";
import React, { useState, useEffect, Suspense, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Globe, Database, Layers, CheckCircle2 } from "lucide-react";
import EditSectionButton from "./admin/EditSectionButton";
import SkillSphere from "./SkillSphere";



import { SKILLS_DB } from "../lib/skills-db";

const SkillNetwork = ({ domains }) => {
  const [nodes, setNodes] = useState([]);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Flatten items and merge with config for icons
    const allItems = domains.flatMap(d => d.items || []);
    
    const generatedNodes = allItems.map((item, i) => {
      // Find matching config from our central Skills DB
      const config = SKILLS_DB[item.name] || {
        name: item.name,
        icon: <Cpu size={14} />,
        color: "#94a3b8",
        category: "lang",
        about: item.description || "Technical expertise and implementation."
      };

      return {
        ...config,
        id: item.id,
        about: item.description || config.about, // Prefer DB description if set
        x: item.x ?? (5 + (Math.random() * 90)),
        y: item.y ?? (5 + (Math.random() * 90)),
        vx: (Math.random() - 0.5) * 0.03,
        vy: (Math.random() - 0.5) * 0.03,
        delay: Math.random() * 2,
      };
    });
    setNodes(generatedNodes);
  }, [domains]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNodes(prev => prev.map(node => {
        let newX = node.x + node.vx;
        let newY = node.y + node.vy;
        let newVx = node.vx;
        let newVy = node.vy;

        // Bounce off walls
        if (newX < 2 || newX > 98) newVx *= -1;
        if (newY < 2 || newY > 98) newVy *= -1;

        return { ...node, x: newX, y: newY, vx: newVx, vy: newVy };
      }));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleDrag = (id, info) => {
    setNodes(prev => prev.map(node => {
      if (node.id === id) {
        const container = containerRef.current;
        if (!container) return node;
        const rect = container.getBoundingClientRect();
        let newX = ((info.point.x - rect.left) / rect.width) * 100;
        let newY = ((info.point.y - rect.top) / rect.height) * 100;
        
        // Clamp drag position
        return {
          ...node,
          x: Math.max(5, Math.min(95, newX)),
          y: Math.max(5, Math.min(95, newY))
        };
      }
      return node;
    }));
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-[600px] md:h-[800px] overflow-hidden rounded-[3rem] bg-[#050508] border border-zinc-900 shadow-2xl group/network select-none"
    >
      {/* Blueprint Grid */}
      <div className="absolute inset-0 opacity-[0.1]" 
           style={{ backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      {/* SVG Spider Web Connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
        {nodes.map((node, i) => nodes.slice(i + 1).map((target) => {
            const dNodes = Math.sqrt(Math.pow(node.x - target.x, 2) + Math.pow(node.y - target.y, 2));
            if (dNodes > 25) return null;
            
            const isHighlighted = hoveredNode?.id === node.id || hoveredNode?.id === target.id;
            const isSameCategory = node.category === target.category;
            
            let connectionColor = "#1e293b";
            if (isHighlighted) connectionColor = "#fb923c";
            else if (isSameCategory) connectionColor = node.category === 'front' ? '#3b82f633' : node.category === 'back' ? '#10b98133' : '#f59e0b33';

            return (
              <motion.line
                key={`${node.id}-${target.id}`}
                stroke={connectionColor}
                strokeWidth={isHighlighted ? 2 : 0.6}
                initial={{ opacity: 0.1 }}
                animate={{ 
                  x1: `${node.x}%`,
                  y1: `${node.y}%`,
                  x2: `${target.x}%`,
                  y2: `${target.y}%`,
                  opacity: isHighlighted ? 0.8 : 0.2,
                }}
                transition={{ type: "tween", duration: 0.05 }}
              />
            );
          }))}
      </svg>


      {/* High-Fidelity Skill Badges (DRAGGABLE) */}
      {nodes.map((node) => {
        const finalX = Math.max(5, Math.min(95, node.x));
        const finalY = Math.max(5, Math.min(95, node.y));

        const isDimmed = activeFilter && node.category !== activeFilter;

        return (
          <motion.div
            key={node.id}
            drag
            dragMomentum={false}
            dragConstraints={containerRef}
            onDrag={(e, info) => handleDrag(node.id, info)}
            className="absolute z-20"
            style={{ 
              left: `${finalX}%`, 
              top: `${finalY}%`, 
              transform: 'translate(-50%, -50%)',
              pointerEvents: isDimmed ? 'none' : 'auto'
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: isDimmed ? 0.4 : 1, 
              opacity: isDimmed ? 0.2 : 1,
            }}
            transition={{
              scale: { duration: 0.3 },
              opacity: { duration: 0.3 }
            }}
            onMouseEnter={() => setHoveredNode(node)}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <div 
              className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg border transition-all duration-500 shadow-xl cursor-grab active:cursor-grabbing whitespace-nowrap bg-zinc-900/60 backdrop-blur-md border-zinc-800 group-hover:border-zinc-700 ${
                hoveredNode?.id === node.id 
                  ? "scale-110 z-50 shadow-[0_0_30px_rgba(251,146,60,0.3)] border-orange-400" 
                  : "z-10"
              }`}
              style={{ 
                borderColor: hoveredNode?.id === node.id ? "#fb923c" : 'rgba(39, 39, 42, 0.5)',
                boxShadow: hoveredNode?.id === node.id ? `0 0 30px #fb923c44` : 'none'
              }}
            >
               <div className="text-lg transition-colors duration-300" style={{ color: node.color }}>
                  {node.icon}
               </div>
               <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 ${
                 hoveredNode?.id === node.id ? "text-orange-400" : "text-zinc-400"
               }`}>
                 {node.name}
               </span>
            </div>
          </motion.div>
        );
      })}

      {/* Neural Intelligence Detail Panel */}
      <AnimatePresence>
        {hoveredNode && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute bottom-10 right-10 z-50 w-64 p-5 rounded-2xl bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 shadow-[0_0_40px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-zinc-800/50 text-xl" style={{ color: hoveredNode.color }}>
                {hoveredNode.icon}
              </div>
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-widest">{hoveredNode.name}</h4>
                <div className="h-1 w-12 rounded-full mt-1" style={{ backgroundColor: hoveredNode.color }} />
              </div>
            </div>
            <p className="text-[10px] leading-relaxed text-zinc-400 font-medium italic">
              "{hoveredNode.about}"
            </p>
            <div className="mt-4 pt-3 border-t border-zinc-800 flex justify-between items-center">
              <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-tighter">Stack Intelligence v2.0</span>
              <div className="flex gap-1">
                 {[1,2,3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-orange-500/30" />)}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LeetCode Style Dashboard Labels */}
      <div className="absolute top-10 left-10 hidden lg:flex flex-col gap-2 pointer-events-auto">
         <span className="text-[10px] font-black text-orange-400 uppercase tracking-[0.4em] mb-2 drop-shadow-[0_0_10px_rgba(251,146,60,0.3)]">Neural Network Mapping</span>
         <div className="flex gap-4">
            <button 
              onClick={() => setActiveFilter(activeFilter === 'front' ? null : 'front')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-300 ${
                activeFilter === 'front' ? "bg-blue-500/20 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]" : "bg-zinc-900/80 border-zinc-800 hover:border-zinc-700"
              }`}
            >
               <div className={`w-2 h-2 rounded-full ${activeFilter === 'front' ? "bg-blue-400 animate-pulse" : "bg-blue-500"}`} />
               <span className={`text-[9px] font-bold uppercase tracking-widest ${activeFilter === 'front' ? "text-blue-100" : "text-zinc-500"}`}>Frontend</span>
            </button>
            <button 
              onClick={() => setActiveFilter(activeFilter === 'back' ? null : 'back')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-300 ${
                activeFilter === 'back' ? "bg-emerald-500/20 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]" : "bg-zinc-900/80 border-zinc-800 hover:border-zinc-700"
              }`}
            >
               <div className={`w-2 h-2 rounded-full ${activeFilter === 'back' ? "bg-emerald-400 animate-pulse" : "bg-emerald-500"}`} />
               <span className={`text-[9px] font-bold uppercase tracking-widest ${activeFilter === 'back' ? "text-emerald-100" : "text-zinc-500"}`}>Backend</span>
            </button>
            <button 
              onClick={() => setActiveFilter(activeFilter === 'lang' ? null : 'lang')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-300 ${
                activeFilter === 'lang' ? "bg-amber-500/20 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]" : "bg-zinc-900/80 border-zinc-800 hover:border-zinc-700"
              }`}
            >
               <div className={`w-2 h-2 rounded-full ${activeFilter === 'lang' ? "bg-amber-400 animate-pulse" : "bg-amber-500"}`} />
               <span className={`text-[9px] font-bold uppercase tracking-widest ${activeFilter === 'lang' ? "text-amber-100" : "text-zinc-500"}`}>Languages</span>
            </button>
            <button 
              onClick={() => setActiveFilter(activeFilter === 'tools' ? null : 'tools')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-300 ${
                activeFilter === 'tools' ? "bg-purple-500/20 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]" : "bg-zinc-900/80 border-zinc-800 hover:border-zinc-700"
              }`}
            >
               <div className={`w-2 h-2 rounded-full ${activeFilter === 'tools' ? "bg-purple-400 animate-pulse" : "bg-purple-500"}`} />
               <span className={`text-[9px] font-bold uppercase tracking-widest ${activeFilter === 'tools' ? "text-purple-100" : "text-zinc-500"}`}>Tools</span>
            </button>
         </div>
      </div>
    </div>
  );
};

const Skills = () => {
  const [domains, setDomains] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Try to load from cache immediately
    const cachedData = localStorage.getItem("portfolio_skills_cache");
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        if (parsed.domains) {
          setDomains(parsed.domains);
          setIsLoading(false);
        }
      } catch (e) {
        console.error("Cache parse failed", e);
      }
    }

    const fetchSkills = async () => {
      try {
        const res = await fetch("/api/skills");
        const data = await res.json();
        if (data.domains && data.domains.length > 0) {
          setDomains(data.domains);
          localStorage.setItem("portfolio_skills_cache", JSON.stringify(data));
        }
      } catch (err) {
        console.error("Skills: Error", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSkills();
  }, []);

  if (isLoading) return null;

  return (
    <section id="skills" className="w-full pt-32 pb-24 px-6 md:px-12 lg:px-24 bg-zinc-950 relative overflow-hidden border-b border-zinc-900">
      <EditSectionButton href="/admin/skills" label="Edit Skills" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900">
               <Cpu size={16} className="text-orange-500" />
               <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Architectural Graph</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-[1.1]">
              Technical <br />
              <span className="text-orange-400 drop-shadow-[0_0_20px_rgba(251,146,60,0.3)]">Neural Web.</span>
            </h2>
          </div>
          <p className="max-w-xs text-zinc-400 text-sm md:text-base leading-relaxed text-left md:text-right">
            A visualized network of interconnected technical stacks and engineering expertise.
          </p>
        </div>

        <SkillNetwork domains={domains} />
      </div>
    </section>
  );
};

export default Skills;
