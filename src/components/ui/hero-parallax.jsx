"use client";
import React from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export const HeroParallax = ({ products }) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1000]), springConfig);
  const translateXReverse = useSpring(useTransform(scrollYProgress, [0, 1], [0, -1000]), springConfig);
  const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.2], [15, 0]), springConfig);
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.2], [0.2, 1]), springConfig);
  const rotateZ = useSpring(useTransform(scrollYProgress, [0, 0.2], [20, 0]), springConfig);
  const translateY = useSpring(useTransform(scrollYProgress, [0, 0.2], [0, 50]), springConfig);

  return (
    <div
      ref={ref}
      className="h-[180vh] pt-10 pb-40 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className=""
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-10 mb-10 mt-10">
          {firstRow.map((product, idx) => (
            <ProductCard product={product} translate={translateX} key={`${product.title}-${idx}`} />
          ))}
        </motion.div>
        <motion.div className="flex flex-row mb-10 space-x-10">
          {secondRow.map((product, idx) => (
            <ProductCard product={product} translate={translateXReverse} key={`${product.title}-${idx}-second`} />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = () => {
  return (
    <div className="max-w-7xl relative mx-auto py-10 md:py-20 px-4 w-full left-0 top-0">
      <h1 className="text-4xl md:text-7xl font-bold text-white tracking-tight leading-[1.1]">
        Gallery <br />
        <span className="text-orange-500">Art.</span>
      </h1>
      <p className="max-w-2xl text-base md:text-xl mt-8 text-zinc-400 leading-relaxed">
        A visual exploration of technical architecture and system designs.
        Scroll down to explore the immersive 3D gallery.
      </p>
    </div>
  );
};

export const ProductCard = ({ product, translate }) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={`${product.title}`}
      className="group/product h-[22rem] w-[22rem] md:w-[24rem] relative flex-shrink-0 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden shadow-xl"
    >
      <a href={product.link} target="_blank" rel="noopener noreferrer" className="block relative w-full h-[65%] bg-zinc-950 overflow-hidden">
        <img
          src={product.thumbnail}
          className="object-contain object-center w-full h-full opacity-90 group-hover/product:opacity-100 group-hover/product:scale-105 transition-all duration-500"
          alt={product.title}
        />
      </a>
      <div className="flex flex-col p-5 h-[35%] justify-center bg-zinc-900 border-t border-zinc-800 z-10 relative">
        <span className="text-[10px] font-bold uppercase tracking-widest text-orange-500 mb-2">
          {product.category || "Gallery Art"}
        </span>
        <h2 className="text-white font-bold text-lg md:text-xl leading-tight truncate">
          {product.title}
        </h2>
      </div>
    </motion.div>
  );
};
