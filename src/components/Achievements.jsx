"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Trophy, ArrowUpRight, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
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
              <div className="flex items-center gap-2 mb-2">
                 <Trophy size={16} className="text-amber-400" />
                 <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest">Hall of Fame</span>
              </div>
              <h2 className="section-title text-white">
                Major <span className="accent-text">Milestones</span>
              </h2>
           </div>

        </div>

        {/* Categories Selection - Tab Design */}
        <div className="mb-12 border-b border-white/10 overflow-x-auto">
            <div className="flex min-w-max gap-8">
                {categories.map((cat) => {
                    const count = cat === "All" 
                        ? achievements.length 
                        : achievements.filter(a => {
                            const cats = Array.isArray(a.category) ? a.category : [a.category];
                            return cats.includes(cat);
                          }).length;
                    
                    if (cat !== "All" && count === 0) return null;
                    
                    const isActive = selectedCategory === cat;
                    return (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => setSelectedCategory(cat)}
                            className={`flex items-center gap-2 border-b-2 px-1 pb-4 text-sm font-bold transition-colors ${
                                isActive
                                    ? "border-amber-400 text-white"
                                    : "border-transparent text-zinc-400 hover:text-white"
                            }`}
                        >
                            <span>{cat}</span>
                            <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-300">
                                {count}
                            </span>
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
                    drag={isCenter ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.6}
                    onDragEnd={(e, { offset, velocity }) => {
                        const swipeThreshold = 50;
                        if (offset.x < -swipeThreshold || velocity.x < -400) {
                            nextSlide();
                        } else if (offset.x > swipeThreshold || velocity.x > 400) {
                            prevSlide();
                        }
                    }}
                    style={{ 
                        transformOrigin: "center center",
                        transformStyle: "preserve-3d",
                        touchAction: isCenter ? "pan-y" : "auto"
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
                          initial={{ scale: 0.98, opacity: 0, y: 15 }}
                          animate={{ scale: 1, opacity: 1, y: 0 }}
                          exit={{ scale: 0.98, opacity: 0, y: 15 }}
                          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full max-w-3xl max-h-[90vh] bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col relative shadow-2xl"
                      >
                          {/* Modal Header */}
                          <div className="shrink-0 flex items-center justify-between px-6 py-5 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl z-20 absolute top-0 left-0 right-0">
                              <div className="min-w-0 flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-zinc-950 shrink-0">
                                    <Trophy size={14} className="font-bold" />
                                 </div>
                                 <h3 className="text-xl font-bold text-white tracking-tight truncate">
                                    Achievement
                                 </h3>
                              </div>
                              <button 
                                onClick={() => setSelectedMilestone(null)}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                              >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                              </button>
                          </div>
  
                          {/* Scrollable Content */}
                          <div className="flex-1 overflow-y-auto custom-scrollbar pt-[73px]">
                              {/* Hero Image */}
                              <div className="relative w-full aspect-video md:aspect-[21/9] border-b border-zinc-800 bg-zinc-900">
                                  <img 
                                      src={selectedMilestone.url || selectedMilestone.badgeImageUrl || "/images/hero_bg.png"} 
                                      alt={selectedMilestone.title}
                                      className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-700"
                                  />
                              </div>
  
                              <div className="p-6 md:p-10 space-y-10">
                                  {/* Info */}
                                  <div className="space-y-4">
                                      <div className="flex flex-wrap gap-2 mb-2">
                                          {(Array.isArray(selectedMilestone.category) ? selectedMilestone.category : [selectedMilestone.category]).map((cat, i) => (
                                              <span key={i} className="px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-semibold">
                                                  {cat}
                                              </span>
                                          ))}
                                      </div>
                                      
                                      <h3 className="text-2xl md:text-3xl font-black text-white leading-tight tracking-tighter">
                                          {selectedMilestone.title}
                                      </h3>
  
                                      <div className="flex items-center gap-3">
                                          <span className="text-xs font-bold uppercase tracking-widest text-amber-500">{selectedMilestone.issuer}</span>
                                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-800"></span>
                                          <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">{selectedMilestone.dateLabel}</span>
                                      </div>
                                  </div>
  
                                  <div className="text-zinc-300 text-[15px] leading-loose font-medium">
                                      {formatText(selectedMilestone.description)}
                                  </div>
  
                                  {/* Action Buttons */}
                                  <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-zinc-800/50">
                                      {selectedMilestone.achievementUrl && (
                                          <a 
                                              href={selectedMilestone.achievementUrl} 
                                              target="_blank" 
                                              rel="noopener noreferrer"
                                              className="w-full sm:w-auto group flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-zinc-950 font-bold text-xs uppercase tracking-wide hover:bg-amber-500 hover:text-white transition-all duration-200 shadow-xl active:scale-[0.98]"
                                          >
                                              Verify Milestone <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                          </a>
                                      )}
                                      <button 
                                          onClick={() => setSelectedMilestone(null)}
                                          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-bold uppercase tracking-wide hover:text-white transition-all active:scale-[0.98]"
                                      >
                                          Close
                                      </button>
                                  </div>
                              </div>
                          </div>
                      </motion.div>
                  </motion.div>
              )}
          </AnimatePresence>

          {/* Navigation */}
          {filteredItems.length > 1 && (
              <>
                <button
                    onClick={prevSlide}
                    className="hidden md:flex absolute top-[30%] md:top-1/2 -translate-y-1/2 left-2 md:-left-8 lg:-left-12 z-40 p-3 md:p-5 rounded-full bg-zinc-900/80 backdrop-blur-xl border border-white/10 text-white hover:bg-amber-500 transition-all group items-center justify-center"
                >
                    <ChevronLeft size={20} className="group-hover:scale-110 transition-transform" />
                </button>
                <button
                    onClick={nextSlide}
                    className="hidden md:flex absolute top-[30%] md:top-1/2 -translate-y-1/2 right-2 md:-right-8 lg:-right-12 z-40 p-3 md:p-5 rounded-full bg-zinc-900/80 backdrop-blur-xl border border-white/10 text-white hover:bg-amber-500 transition-all group items-center justify-center"
                >
                    <ChevronRight size={20} className="group-hover:scale-110 transition-transform" />
                </button>

                {/* Pagination Slide Bar */}
                <div className="absolute -bottom-4 md:-bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-40">
                  {filteredItems.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        currentIndex === idx 
                          ? "w-5 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" 
                          : "w-1.5 bg-zinc-600/60 hover:bg-zinc-400"
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Achievements;
