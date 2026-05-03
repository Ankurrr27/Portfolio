"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Trophy, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import EditSectionButton from "./admin/EditSectionButton";
import { fallbackAchievements } from "../data/achievements";
import { formatText } from "../utils/formatText";



const categories = [
  "All",
  "Hackathons",
  "Certificates",
  "Events",
  "Position of Responsibilities",
  "Work"
];

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const sectionRef = useRef(null);


  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/achievements");
        const data = await res.json();
        const items = data.achievements || [];
        
        // If empty, use fallbacks but mapped to the carousel structure
        const finalItems = items.length > 0 ? items : [
            { id: "1", title: "Smart India Hackathon Finalist", category: "Hackathons", description: "Developed an AI-driven waste management solution.", url: "/images/hero_bg.png" },
            { id: "2", title: "AWS Certified Developer", category: "Certificates", description: "Validated expertise in developing and maintaining AWS-based applications.", url: "/images/savara_bg.png" },
            { id: "3", title: "Vice President - IIITians Network", category: "Position of Responsibilities", description: "Leading a community of 30,000+ students across India.", url: "/images/iiitians_white.png" }
        ];

        setAchievements(finalItems);
        setFilteredItems(finalItems);
      } catch (err) {
        console.error("Achievements: Error fetching", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredItems(achievements);
    } else {
      setFilteredItems(achievements.filter(a => {
        const cats = Array.isArray(a.category) ? a.category : [a.category];
        return cats.includes(selectedCategory);
      }));
    }
    setCurrentIndex(0);
  }, [selectedCategory, achievements]);

  const nextSlide = useCallback(() => {
    if (filteredItems.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % filteredItems.length);
  }, [filteredItems.length]);

  const prevSlide = useCallback(() => {
    if (filteredItems.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  }, [filteredItems.length]);

  return (
    <section ref={sectionRef} className="section-shell overflow-hidden" id="achievements">
      <EditSectionButton href="/admin/achievements" label="Edit Achievements" />
      
      <div className="section-container relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12">
           <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-amber-500/20 bg-amber-500/5">
                 <Trophy size={16} className="text-amber-400" />
                 <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest">Hall of Fame</span>
              </div>
              <h2 className="section-title text-white">
                Major <br />
                <span className="accent-text">Milestones.</span>
              </h2>
           </div>
           <p className="section-copy max-w-md lg:text-right text-zinc-400 italic">
              "Validated technical recognition records and leadership achievements."
           </p>
        </div>

        {/* Categories Selection - High Contrast Pill Design */}
        <div className="mb-12">
            <div className="flex flex-wrap items-center gap-3">
                {categories.map((cat) => {
                    const isActive = selectedCategory === cat;
                    return (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 border ${
                                isActive 
                                ? "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/20" 
                                : "bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                            }`}
                        >
                            {cat}
                        </button>
                    );
                })}
            </div>
        </div>

        {/* Achievement Carousel (Former Gallery) */}
        <div className="relative w-full max-w-5xl mx-auto h-[440px] md:h-[580px] flex items-center justify-center [perspective:1000px]">
          {filteredItems.length > 0 ? (
            <AnimatePresence initial={false}>
                {filteredItems.map((item, idx) => {
                let diff = idx - currentIndex;
                const halfLen = filteredItems.length / 2;
                if (diff > halfLen) diff -= filteredItems.length;
                else if (diff < -halfLen) diff += filteredItems.length;

                if (Math.abs(diff) > 2) return null;

                const isCenter = diff === 0;
                const isLeft = diff === -1;
                const isRight = diff === 1;

                let xOffset = 0;
                let yOffset = 0;
                let scale = 0.6;
                let zIndex = 0;
                let opacity = 0;
                let rotateY = 0;

                if (isMobile) {
                    if (isCenter) { xOffset = 0; yOffset = -25; scale = 1; zIndex = 30; opacity = 1; rotateY = 0; }
                    else if (isLeft) { xOffset = -35; yOffset = 30; scale = 0.65; zIndex = 20; opacity = 0.6; rotateY = 15; }
                    else if (isRight) { xOffset = 35; yOffset = 30; scale = 0.65; zIndex = 20; opacity = 0.6; rotateY = -15; }
                } else {
                    if (isCenter) { xOffset = 0; yOffset = 0; scale = 1; zIndex = 30; opacity = 1; rotateY = 0; }
                    else if (isLeft) { xOffset = -45; yOffset = 0; scale = 0.75; zIndex = 20; opacity = 0.4; rotateY = 8; }
                    else if (isRight) { xOffset = 45; yOffset = 0; scale = 0.75; zIndex = 20; opacity = 0.4; rotateY = -8; }
                }

                return (
                    <motion.div
                    key={item.id || idx}
                    className="absolute flex flex-col w-[320px] sm:w-[440px] md:w-[620px] lg:w-[720px] h-[360px] sm:h-[420px] md:h-[480px] lg:h-[540px] rounded-[24px] md:rounded-[32px] overflow-hidden cursor-pointer border border-zinc-800/50 bg-zinc-950 group"
                    initial={false}
                    animate={{
                        x: `${xOffset}%`,
                        y: `${yOffset}%`,
                        scale: scale,
                        zIndex: zIndex,
                        opacity: opacity,
                        rotateY: rotateY
                    }}
                    whileHover={isCenter ? "hover" : ""}
                    transition={{ 
                        type: "spring", 
                        stiffness: 120, 
                        damping: 20,
                        mass: 1
                    }}
                    onClick={() => {
                        if (isLeft) prevSlide();
                        if (isRight) nextSlide();
                    }}
                    style={{ 
                        transformOrigin: "center center",
                        transformStyle: "preserve-3d"
                    }}
                    >
                    {/* Image Area */}
                    <div className="relative w-full flex-1 bg-zinc-900 overflow-hidden">
                        <motion.img
                            src={item.url || item.badgeImageUrl || "/images/hero_bg.png"}
                            alt={item.title}
                            variants={{
                                hover: { scale: 1.1 }
                            }}
                            transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
                            className="w-full h-full object-cover object-center"
                        />
                        
                        <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-1.5 max-w-[80%]">
                            {(Array.isArray(item.category) ? item.category : [item.category]).map((cat, i) => (
                                <span key={i} className="px-2 py-1 rounded-md bg-black/40 backdrop-blur-md text-[8px] font-black uppercase tracking-[0.15em] text-white border border-white/10 whitespace-nowrap">
                                    {cat}
                                </span>
                            ))}
                        </div>

                        {/* Title Overlay - ONLY the heading here */}
                        <div className={`absolute inset-x-0 bottom-0 p-5 md:p-8 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-500 flex flex-col justify-end ${isCenter ? 'opacity-100' : 'opacity-0'}`}>
                            <h3 className="text-white font-black text-lg md:text-2xl leading-tight tracking-tighter drop-shadow-md">
                                {item.title}
                            </h3>
                        </div>
                    </div>

                    {/* Details Area - Below Image */}
                    <div className={`shrink-0 min-h-[100px] md:min-h-[120px] p-5 md:p-8 bg-zinc-950 border-t border-zinc-800/80 transition-opacity duration-500 flex flex-col justify-start ${isCenter ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400">{item.issuer}</span>
                            <span className="w-1 h-1 rounded-full bg-zinc-800"></span>
                            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500">{item.dateLabel}</span>
                        </div>
                        
                        <div className="space-y-4">
                            <p className="text-[11px] md:text-sm font-medium leading-relaxed text-zinc-400/70 line-clamp-2 md:line-clamp-1 max-w-2xl">
                                {item.description}
                            </p>
                            
                            <div className="flex items-center gap-6">
                                {item.achievementUrl && (
                                    <a href={item.achievementUrl} target="_blank" rel="noopener" className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
                                        Verify <ArrowUpRight size={12} />
                                    </a>
                                )}
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedMilestone(item);
                                    }}
                                    className="text-[9px] font-bold uppercase tracking-widest text-amber-500/90 hover:text-amber-400 transition-colors"
                                >
                                    Read Story
                                </button>
                            </div>
                        </div>
                    </div>
                    </motion.div>
                );
                })}
            </AnimatePresence>
          ) : (
            <div className="text-zinc-500 font-bold uppercase tracking-widest text-sm">No milestones found in this category</div>
          )}

          {/* Milestone Detail Modal */}
          <AnimatePresence>
              {selectedMilestone && (
                  <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-[5000] flex items-center justify-center p-4 md:p-8 bg-zinc-950/95 backdrop-blur-sm"
                      onClick={() => setSelectedMilestone(null)}
                  >
                      <motion.div 
                          initial={{ scale: 0.9, opacity: 0, y: 20 }}
                          animate={{ scale: 1, opacity: 1, y: 0 }}
                          exit={{ scale: 0.9, opacity: 0, y: 20 }}
                          transition={{ type: "spring", damping: 25, stiffness: 300 }}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full max-w-4xl max-h-[90vh] bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col md:flex-row relative"
                      >
                          {/* Image Side */}
                          <div className="w-full md:w-1/2 h-64 md:h-auto bg-zinc-900 border-b md:border-b-0 md:border-r border-zinc-800">
                              <img 
                                  src={selectedMilestone.url || selectedMilestone.badgeImageUrl || "/images/hero_bg.png"} 
                                  alt={selectedMilestone.title}
                                  className="w-full h-full object-cover"
                              />
                          </div>

                          {/* Content Side */}
                          <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center overflow-y-auto">
                              <div className="mb-6 flex flex-wrap gap-2">
                                  {(Array.isArray(selectedMilestone.category) ? selectedMilestone.category : [selectedMilestone.category]).map((cat, i) => (
                                      <span key={i} className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-500 text-[9px] font-black uppercase tracking-[0.2em] border border-amber-500/20">
                                          {cat}
                                      </span>
                                  ))}
                              </div>

                              <h3 className="text-white font-black text-2xl md:text-4xl leading-tight tracking-tighter mb-4">
                                  {selectedMilestone.title}
                              </h3>

                              <div className="flex items-center gap-3 mb-8">
                                  <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">{selectedMilestone.issuer}</span>
                                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-800"></span>
                                  <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">{selectedMilestone.dateLabel}</span>
                              </div>

                              <div className="text-sm md:text-base text-zinc-400 leading-relaxed mb-10">
                                  {formatText(selectedMilestone.description)}
                              </div>

                              <div className="flex items-center gap-4">
                                  {selectedMilestone.achievementUrl && (
                                      <a 
                                          href={selectedMilestone.achievementUrl} 
                                          target="_blank" 
                                          rel="noopener"
                                          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all shadow-lg shadow-white/5"
                                      >
                                          Verify Milestone <ArrowUpRight size={14} />
                                      </a>
                                  )}
                                  <button 
                                      onClick={() => setSelectedMilestone(null)}
                                      className="px-6 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-black uppercase tracking-widest hover:text-white transition-all"
                                  >
                                      Close
                                  </button>
                              </div>
                          </div>

                          {/* Close Button X */}
                          <button 
                              onClick={() => setSelectedMilestone(null)}
                              className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white/60 hover:text-white backdrop-blur-md transition-colors"
                          >
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                          </button>
                      </motion.div>
                  </motion.div>
              )}
          </AnimatePresence>

          {/* Navigation */}
          {filteredItems.length > 1 && (
              <>
                <button
                    onClick={prevSlide}
                    className="absolute top-[30%] md:top-1/2 -translate-y-1/2 left-2 md:-left-8 lg:-left-12 z-40 p-3 md:p-5 rounded-full bg-zinc-900/80 backdrop-blur-xl border border-white/10 text-white hover:bg-amber-500 transition-all group"
                >
                    <ChevronLeft size={20} className="group-hover:scale-110 transition-transform" />
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute top-[30%] md:top-1/2 -translate-y-1/2 right-2 md:-right-8 lg:-right-12 z-40 p-3 md:p-5 rounded-full bg-zinc-900/80 backdrop-blur-xl border border-white/10 text-white hover:bg-amber-500 transition-all group"
                >
                    <ChevronRight size={20} className="group-hover:scale-110 transition-transform" />
                </button>
              </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Achievements;
