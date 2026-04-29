"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Zap, Shield, Cpu, Code2 } from "lucide-react";
import EditSectionButton from "./admin/EditSectionButton";


const Feature = ({ icon: Icon, title, desc }) => (
  <div className="flex flex-col gap-2 p-5 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mb-2">
      <Icon size={20} strokeWidth={2.5} />
    </div>
    <h4 className="text-slate-900 font-bold text-base">{title}</h4>
    <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
  </div>
);

const About = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();
        if (data.profile) setProfile(data.profile);
      } catch (err) {
        console.error("About: Error fetching profile", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  if (isLoading) {
    return (
      <section className="w-full pt-32 pb-20 px-6 md:px-12 lg:px-24 bg-white relative overflow-hidden border-b border-slate-100 min-h-screen">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center lg:items-start">
          <div className="w-full lg:w-7/12 flex flex-col justify-center space-y-8 animate-pulse">
            <div className="space-y-5">
              <div className="w-40 h-8 rounded-lg bg-slate-100"></div>
              <div className="w-3/4 h-16 rounded-xl bg-slate-100"></div>
              <div className="w-2/3 h-16 rounded-xl bg-slate-100"></div>
              <div className="w-full max-w-lg h-24 rounded-xl bg-slate-50 mt-4"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-32 rounded-xl bg-slate-50 border border-slate-100"></div>
              ))}
            </div>
          </div>
          <div className="w-full lg:w-5/12 relative animate-pulse">
            <div className="w-full aspect-square md:aspect-[4/5] rounded-xl bg-slate-100"></div>
            <div className="absolute bottom-6 right-6 w-32 h-20 bg-slate-200 rounded-xl"></div>
          </div>
        </div>
      </section>
    );
  }

  const { bio, longBio, aboutImageUrl } = profile || {};

  return (
    <section id="about" ref={containerRef} className="w-full pt-32 pb-20 px-6 md:px-12 lg:px-24 bg-white relative scroll-mt-20 overflow-hidden border-b border-slate-100">
       <EditSectionButton href="/admin/profile" label="Edit Bio" />
       
       <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center lg:items-start relative z-10">
          
          <div className="w-full lg:w-7/12 flex flex-col justify-center space-y-8">
             
             <div className="space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border border-slate-200 bg-slate-50">
                   <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                   <span className="text-xs font-semibold text-slate-700 tracking-wide uppercase">Core Architecture</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-[1.1]">
                  Solving for <br />
                  <span className="text-blue-600">Complexity.</span>
                </h2>
                <div className="flex gap-4 items-start border-l-2 border-blue-500 pl-5 py-1 mt-4">
                   <p className="text-slate-600 text-base md:text-lg font-medium leading-relaxed max-w-lg">
                     {bio || "System resilience isn't an afterthought—it's the core. My architecture choices are driven by data, performance, and long-term scalability."}
                   </p>
                </div>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Feature icon={Zap} title="Performance First" desc="Optimizing every millisecond of the critical path." />
                <Feature icon={Shield} title="Resilient Systems" desc="Architecting with fail-safes for zero-downtime." />
                <Feature icon={Cpu} title="Algorithmic Depth" desc="Low-level optimization and complex data structures." />
                <Feature icon={Code2} title="Clean Architecture" desc="Maintainable, scalable, and self-documenting codebases." />
             </div>

             {longBio && (
               <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-3">Extended Background</p>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    {longBio}
                  </p>
               </div>
             )}
          </div>

          <motion.div style={{ scale, opacity }} className="w-full lg:w-5/12 relative">
             <div className="relative group">
                <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-white p-2 shadow-sm">
                   <img 
                     src={aboutImageUrl || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000"} 
                     alt="Engineering Mindset" 
                     className="w-full rounded-lg object-cover aspect-square md:aspect-[4/5] transition-transform duration-700 group-hover:scale-[1.02]"
                   />
                   
                   <div className="absolute bottom-6 right-6 bg-white px-6 py-4 rounded-xl shadow-lg border border-slate-100 flex items-center gap-4">
                      <div className="flex flex-col">
                         <span className="text-slate-900 font-bold text-2xl tracking-tight">100%</span>
                         <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Uptime Target</span>
                      </div>
                   </div>
                </div>

                {/* Data Points */}
                <div className="absolute -bottom-6 -left-6 hidden xl:flex flex-col gap-3 p-5 rounded-xl bg-white border border-slate-200 shadow-lg text-xs text-slate-600 font-medium tracking-wide">
                   <div className="flex justify-between gap-8 text-slate-500"><span>Latency:</span> <span className="text-blue-600 font-semibold">Optimized</span></div>
                   <div className="flex justify-between gap-8 text-slate-500"><span>Throughput:</span> <span className="text-blue-600 font-semibold">Stable</span></div>
                   <div className="flex justify-between gap-8 text-slate-500"><span>Availability:</span> <span className="text-blue-600 font-semibold">99.9%</span></div>
                </div>
             </div>
          </motion.div>
       </div>
    </section>
  );
};

export default About;
