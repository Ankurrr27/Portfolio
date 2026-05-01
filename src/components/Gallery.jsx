"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) return null;
  if (!items || items.length === 0) return null;

  const displayItems = items.slice(0, 9);

  return (
    <section className="w-full relative bg-zinc-950 overflow-hidden pt-20 pb-24 border-b border-zinc-900" id="gallery">
      <div className="max-w-7xl mx-auto px-4 md:px-6 w-full">
        <div className="mb-12">
          <h1 className="section-title">
            Gallery <br />
            <span className="text-orange-500">Art.</span>
          </h1>
          <p className="section-copy max-w-2xl mt-5 md:mt-8">
            A visual exploration of events, hackathons, and technical pursuits.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayItems.map((item, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (idx % 3) * 0.1, duration: 0.5 }}
              key={item.id || idx}
              className="group relative flex-shrink-0 bg-zinc-900 border border-zinc-800 rounded-lg md:rounded-xl flex flex-col overflow-hidden shadow-xl hover:border-zinc-700 transition-colors"
            >
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="block relative w-full aspect-video bg-zinc-950 overflow-hidden">
                <img
                  src={item.url}
                  className="object-cover object-center w-full h-full opacity-90 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-300"
                  alt={item.title || "Gallery Item"}
                />
              </a>
              <div className="flex flex-col p-4 md:p-5 justify-center bg-zinc-900 border-t border-zinc-800 z-10 relative">
                <span className="text-[10px] font-bold uppercase tracking-wide text-orange-500 mb-2">
                  {item.category || "Gallery Art"}
                </span>
                <h2 className="text-white font-bold text-base leading-tight truncate">
                  {item.title || "Photo"}
                </h2>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
