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
      <section className="w-full py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="h-10 w-48 mx-auto bg-slate-200 rounded-lg animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="aspect-square rounded-xl bg-slate-200 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  return (
    <section id="gallery" className="w-full py-20 px-6 md:px-12 lg:px-24 bg-white relative scroll-mt-20 overflow-hidden border-b border-slate-100">
      <EditSectionButton href="/admin/gallery" label="Edit Gallery" />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-10 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 mb-6">
            <Camera size={16} className="text-blue-600" />
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Visual Log</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-[1.1]">
            Snapshot <br /> <span className="text-blue-600">Chronicles.</span>
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
              className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <img 
                src={item.url} 
                alt={item.title || "Gallery Item"} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                 <div className="p-3 rounded-full bg-white/90 text-slate-900 scale-75 group-hover:scale-100 transition-transform duration-300 shadow-lg">
                    <Maximize2 size={20} />
                 </div>
              </div>
              {item.category && (
                <div className="absolute bottom-3 left-3">
                   <span className="px-2.5 py-1 rounded-lg bg-white/90 border border-slate-200 text-[10px] font-bold text-slate-700 uppercase tracking-wider shadow-sm">
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
            className="fixed inset-0 z-[3000] flex items-center justify-center p-4 md:p-10 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 p-3 rounded-xl bg-white/20 hover:bg-white/40 text-white transition-colors backdrop-blur-md"
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
                className="max-w-full max-h-[80vh] rounded-2xl object-contain shadow-2xl border border-slate-200 bg-white"
              />
              <div className="text-center space-y-2 bg-white px-6 py-4 rounded-xl shadow-lg border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">{selectedImage.title}</h3>
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{selectedImage.category}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
