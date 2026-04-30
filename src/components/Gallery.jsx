"use client";

import React, { useEffect, useState } from "react";
import { HeroParallax } from "./ui/hero-parallax";

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

  let parallaxProducts = items.map(p => ({
    title: p.title || "Gallery Photo",
    link: p.url || "#",
    thumbnail: p.url || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
    category: p.category || "Gallery Art",
  }));
  
  if (parallaxProducts.length > 0) {
    while (parallaxProducts.length < 10) {
      parallaxProducts = [...parallaxProducts, ...parallaxProducts].slice(0, 10);
    }
  }

  if (parallaxProducts.length === 0) return null;

  return (
    <section className="w-full relative bg-zinc-950 overflow-hidden border-b border-zinc-900" id="gallery">
      <HeroParallax products={parallaxProducts} />
    </section>
  );
};

export default Gallery;
