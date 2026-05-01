"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch("/api/gallery");
        const data = await res.json();
        if (data.items) setItems(data.items);
      } catch (err) {
        console.error("Gallery: Error fetching", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  // Auto-play functionality
  useEffect(() => {
    if (items.length === 0) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [items.length, nextSlide]);

  if (isLoading) return null;
  if (!items || items.length === 0) return null;

  return (
    <section className="w-full relative bg-zinc-950 overflow-hidden pt-20 pb-24 border-b border-zinc-900" id="gallery">
      <div className="max-w-7xl mx-auto px-4 md:px-6 w-full">
        {/* Header similar to screenshot but matching app theme */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-5 border-b border-zinc-800/50 pb-6">
          <div className="space-y-4">
            <div className="section-kicker">
              <ImageIcon size={16} className="text-orange-500" />
              <span>Memories & Events</span>
            </div>
            <h2 className="section-title">
              Gallery <span className="text-orange-500">Art.</span>
            </h2>
          </div>
          <div className="text-xl md:text-2xl font-black tracking-tighter pb-1">
            <span className="text-white">{(currentIndex + 1).toString().padStart(2, '0')}</span>
            <span className="text-zinc-600">/{items.length.toString().padStart(2, '0')}</span>
          </div>
        </div>

        {/* Coverflow Carousel */}
        <div className="relative w-full max-w-5xl mx-auto h-[480px] md:h-[600px] flex items-center justify-center [perspective:1000px]">
          <AnimatePresence initial={false}>
            {items.map((item, idx) => {
              // Calculate distance considering wrapping (infinite loop logic)
              let diff = idx - currentIndex;
              
              // Handle wrap around
              const halfLen = items.length / 2;
              if (diff > halfLen) diff -= items.length;
              else if (diff < -halfLen) diff += items.length;

              // Only render if within range to save performance
              if (Math.abs(diff) > 2) return null;

              const isCenter = diff === 0;
              const isLeft = diff === -1;
              const isRight = diff === 1;

              // Use diff to calculate animations
              let xOffset = 0;
              let yOffset = 0;
              let scale = 0.6;
              let zIndex = 0;
              let opacity = 0;
              let rotateY = 0;

              if (isMobile) {
                if (isCenter) {
                  xOffset = 0;
                  yOffset = -25;
                  scale = 1; // Removed scaling to prevent horizontal overflow on small phones
                  zIndex = 30;
                  opacity = 1;
                  rotateY = 0;
                } else if (isLeft) {
                  xOffset = -35;
                  yOffset = 30;
                  scale = 0.65;
                  zIndex = 20;
                  opacity = 0.6;
                  rotateY = 15;
                } else if (isRight) {
                  xOffset = 35;
                  yOffset = 30;
                  scale = 0.65;
                  zIndex = 20;
                  opacity = 0.6;
                  rotateY = -15;
                } else if (diff === -2) {
                  xOffset = -100;
                  yOffset = 30;
                  scale = 0.4;
                  zIndex = 10;
                  opacity = 0;
                } else if (diff === 2) {
                  xOffset = 100;
                  yOffset = 30;
                  scale = 0.4;
                  zIndex = 10;
                  opacity = 0;
                }
              } else {
                if (isCenter) {
                  xOffset = 0;
                  yOffset = 0;
                  scale = 1;
                  zIndex = 30;
                  opacity = 1;
                  rotateY = 0;
                } else if (isLeft) {
                  xOffset = -60; // relative to container width percentage
                  yOffset = 0;
                  scale = 0.75;
                  zIndex = 20;
                  opacity = 0.5;
                  rotateY = 10;
                } else if (isRight) {
                  xOffset = 60;
                  yOffset = 0;
                  scale = 0.75;
                  zIndex = 20;
                  opacity = 0.5;
                  rotateY = -10;
                } else if (diff === -2) {
                  xOffset = -100;
                  yOffset = 0;
                  scale = 0.5;
                  zIndex = 10;
                  opacity = 0;
                } else if (diff === 2) {
                  xOffset = 100;
                  yOffset = 0;
                  scale = 0.5;
                  zIndex = 10;
                  opacity = 0;
                }
              }

              return (
                <motion.div
                  key={item.id || idx}
                  className="absolute flex flex-col w-[340px] sm:w-[480px] md:w-[640px] lg:w-[720px] h-[280px] sm:h-[380px] md:h-[460px] lg:h-[520px] rounded-2xl md:rounded-[24px] overflow-hidden cursor-pointer shadow-2xl border border-zinc-800/50 bg-zinc-950"
                  initial={false}
                  animate={{
                    x: `${xOffset}%`,
                    y: `${yOffset}%`,
                    scale: scale,
                    zIndex: zIndex,
                    opacity: opacity,
                    rotateY: rotateY
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 25,
                  }}
                  onClick={() => {
                    if (isLeft) prevSlide();
                    if (isRight) nextSlide();
                  }}
                  style={{
                    transformOrigin: "center center",
                    boxShadow: isCenter ? "0 25px 50px -12px rgba(0, 0, 0, 0.6)" : "none"
                  }}
                >
                  {/* Image Background */}
                  <div className="relative w-full flex-1 bg-black/40 overflow-hidden flex items-center justify-center">
                    <img
                      src={item.url}
                      alt={item.title || "Gallery Item"}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Card Format Info at Bottom */}
                  <div 
                    className={`shrink-0 h-[90px] md:h-[110px] p-4 md:p-6 bg-zinc-950 border-t border-zinc-800/80 transition-opacity duration-500 flex flex-col justify-center ${
                      isCenter ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <h2 className="text-white font-bold text-lg md:text-xl leading-tight truncate mb-1">
                      {item.title || "Gallery Photo"}
                    </h2>
                    <span className="block text-[11px] md:text-sm font-medium leading-relaxed text-zinc-400 line-clamp-2">
                      {item.category || "Gallery Art"}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute top-[26%] md:top-1/2 -translate-y-1/2 left-1 md:left-6 lg:-left-4 z-40 p-2 md:p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all shadow-lg"
            aria-label="Previous image"
          >
            <ChevronLeft size={20} className="md:w-6 md:h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute top-[26%] md:top-1/2 -translate-y-1/2 right-1 md:right-6 lg:-right-4 z-40 p-2 md:p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all shadow-lg"
            aria-label="Next image"
          >
            <ChevronRight size={20} className="md:w-6 md:h-6" />
          </button>
        </div>

        {/* Indicators */}
        <div className="flex justify-center mt-6 md:mt-10 gap-2">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? "w-8 bg-zinc-300" : "w-3 bg-zinc-700 hover:bg-zinc-500"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
