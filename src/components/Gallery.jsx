"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize2, Camera } from "lucide-react";
import EditSectionButton from "./admin/EditSectionButton";


export default function Gallery() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch("/api/gallery");
        const data = await res.json();
        if (data.items) setItems(data.items);
      } catch (err) {
        console.error("Gallery: Error", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGallery();
  }, []);

  if (isLoading) {
    return (
      <section className="w-full py-24 px-6 md:px-12 bg-zinc-950">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="h-10 w-48 mx-auto bg-zinc-900 rounded-lg animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="aspect-square rounded-xl bg-zinc-900 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  return (
    <section id="gallery" className="w-full py-20 px-6 md:px-12 lg:px-24 bg-zinc-950 relative scroll-mt-20 overflow-hidden border-b border-zinc-900">
      <EditSectionButton href="/admin/gallery" label="Edit Gallery" />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-10 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 mb-6">
            <Camera size={16} className="text-orange-500" />
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Visual Log</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.1]">
            Snapshot <br /> <span className="text-orange-500">Chronicles.</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map((item, index) => (
            <motion.div
              key={item.id || index}
              layoutId={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              onClick={() => setSelectedImage(item)}
              className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer border border-zinc-800 shadow-xl hover:border-zinc-700 transition-all duration-300"
            >
              <img 
                src={item.url} 
                alt={item.title || "Gallery Item"} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                 <div className="p-4 rounded-2xl bg-white/10 border border-white/20 text-white scale-75 group-hover:scale-100 transition-all duration-300 shadow-2xl backdrop-blur-md">
                    <Maximize2 size={20} />
                 </div>
              </div>
              {item.category && (
                <div className="absolute bottom-3 left-3">
                   <span className="px-2.5 py-1 rounded-lg bg-zinc-900/90 border border-zinc-800 text-[10px] font-bold text-zinc-100 uppercase tracking-[0.2em] shadow-2xl backdrop-blur-md">
                      {item.category}
                   </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[3000] flex items-center justify-center p-4 md:p-10 bg-zinc-950/90 backdrop-blur-xl"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white transition-all active:scale-95 border border-zinc-800 shadow-2xl"
              onClick={() => setSelectedImage(null)}
            >
              <X size={24} />
            </button>
            
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center gap-6"
              onClick={e => e.stopPropagation()}
            >
              <img 
                src={selectedImage.url} 
                alt={selectedImage.title} 
                className="max-w-full max-h-[80vh] rounded-3xl object-contain shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-zinc-800 bg-zinc-900"
              />
              <div className="text-center space-y-2 bg-zinc-900 px-8 py-5 rounded-2xl shadow-2xl border border-zinc-800 backdrop-blur-xl">
                <h3 className="text-xl font-bold text-white tracking-tight">{selectedImage.title}</h3>
                <p className="text-orange-500 text-[10px] font-bold uppercase tracking-[0.2em]">{selectedImage.category}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
