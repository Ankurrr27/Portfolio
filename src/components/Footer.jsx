import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Globe, Share2 } from "lucide-react";
import { 
  FaGithub, 
  FaLinkedin, 
  FaInstagram, 
  FaDiscord, 
  FaFacebook, 
  FaYoutube, 
  FaTelegram, 
  FaThreads, 
  FaXTwitter 
} from "react-icons/fa6";
import MagneticButton from "./MagneticButton";
import PhoneComponent from "./PhoneComponent";

const SocialIcon = ({ platform }) => {
  const icons = {
    github: FaGithub,
    linkedin: FaLinkedin,
    instagram: FaInstagram,
    discord: FaDiscord,
    twitter: FaXTwitter,
    threads: FaThreads,
    youtube: FaYoutube,
    telegram: FaTelegram,
    facebook: FaFacebook,
    website: Globe,
  };
  const Icon = icons[platform] || Share2;
  return <Icon size={20} />;
};

const Footer = ({ totalViews = 0 }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();
        if (data.profile) setProfile(data.profile);
      } catch (err) {
        console.error("Footer: Error fetching profile", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <footer className="w-full relative py-12 bg-slate-950 overflow-hidden border-t border-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center gap-4 animate-pulse">
          <div className="w-24 h-4 bg-slate-900 rounded-full"></div>
          <div className="w-48 h-10 bg-slate-900 rounded-xl"></div>
        </div>
      </footer>
    );
  }

  const p = profile || {};

  return (
    <footer className="w-full relative py-12 bg-slate-950 overflow-hidden border-t border-slate-900 text-white">
      
      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* The Final CTA (Conversion) - Compact Superb Glassmorphism */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative group mb-16 overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.02] backdrop-blur-3xl shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
        >
          {/* Animated Background Nodes - Slightly smaller */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
             {[...Array(4)].map((_, i) => (
               <motion.div
                 key={i}
                 className="absolute bg-blue-500/20 rounded-full blur-xl"
                 style={{
                   width: Math.random() * 150 + 50,
                   height: Math.random() * 150 + 50,
                   left: Math.random() * 100 + "%",
                   top: Math.random() * 100 + "%",
                 }}
                 animate={{
                   scale: [1, 1.1, 1],
                   opacity: [0.1, 0.2, 0.1],
                   x: [0, 30, 0],
                 }}
                 transition={{
                   duration: 15,
                   repeat: Infinity,
                   ease: "linear",
                 }}
               />
             ))}
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 p-8 md:p-12 relative z-10">
             <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/5 backdrop-blur-md">
                   <span className="relative flex h-2 w-2">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                   </span>
                   <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/60">
                      Collaboration Active
                   </span>
                </div>

                <h2 className="text-3xl md:text-6xl font-black tracking-tighter text-white leading-[1] uppercase italic">
                  Let's build <br/> 
                  <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    Extraordinary.
                  </span>
                </h2>
                
                <div className="flex flex-col sm:flex-row items-center gap-6 pt-2 w-full sm:w-auto">
                   <MagneticButton>
                     <a 
                       href={`mailto:${p.email || ""}`}
                       className="group px-8 py-4 bg-white text-zinc-950 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all duration-500 flex items-center gap-3 shadow-xl active:scale-95"
                     >
                       Contact <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                     </a>
                   </MagneticButton>
                   
                   <div className="flex items-center gap-2 p-2 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl">
                      {p.socialLinks && p.socialLinks.length > 0 ? (
                        p.socialLinks.slice(0, 5).map((link, i) => (
                          <a 
                            key={i}
                            href={link.url} 
                            target="_blank" 
                            className="text-white/30 hover:text-white transition-all p-3 rounded-xl hover:bg-white/10"
                            title={link.platform}
                          >
                             <SocialIcon platform={link.platform} size={18} />
                          </a>
                        ))
                      ) : (
                        <>
                          <a href={p.githubUrl || "#"} target="_blank" className="text-white/30 hover:text-white transition-colors p-3 rounded-xl hover:bg-white/10"><FaGithub size={20} /></a>
                          <a href={p.linkedinUrl || "#"} target="_blank" className="text-white/30 hover:text-white transition-colors p-3 rounded-xl hover:bg-white/10"><FaLinkedin size={20} /></a>
                        </>
                      )}
                   </div>
                </div>
             </div>
  
             <div className="flex-shrink-0 relative group/phone scale-75 lg:block hidden origin-right">
                <PhoneComponent />
             </div>
          </div>
        </motion.div>

        {/* Technical Footer Grid - Compact */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-12 border-t border-white/5">
           
           <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-2">
                 <span className="text-xl font-black tracking-tighter text-white uppercase italic">{p.fullName || "Engineer"}</span>
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              </div>
              <p className="text-zinc-500 text-[11px] font-medium leading-relaxed max-w-xs">
                Engineering resilient digital infrastructure and high-performance user experiences. Based in {(p.location || "Earth").split("•")[0]}.
              </p>
           </div>

           <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6">
               <div className="space-y-3">
                  <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Navigation</h4>
                  <ul className="space-y-2">
                     {["Home", "Projects", "Achievements", "Skills"].map(link => (
                       <li key={link}><a href={`#${link.toLowerCase()}`} className="text-zinc-500 hover:text-blue-400 transition-colors text-[11px] font-bold uppercase tracking-wider">{link}</a></li>
                     ))}
                  </ul>
               </div>
  
               <div className="space-y-3">
                  <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Connect</h4>
                  <ul className="space-y-2">
                     <li><a href={p.resumeUrl || "#"} className="text-zinc-500 hover:text-blue-400 transition-colors text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">Resume <ExternalLink size={10} /></a></li>
                     <li><a href="/admin" className="text-zinc-500 hover:text-blue-400 transition-colors text-[11px] font-bold uppercase tracking-wider">Admin Portal</a></li>
                  </ul>
               </div>

              <div className="space-y-3">
                 <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Manifest</h4>
                 <div className="space-y-2">
                    <div className="flex flex-col">
                       <span className="text-zinc-600 text-[9px] font-bold uppercase tracking-widest">Total Visits</span>
                       <span className="text-zinc-400 text-xs font-black mono">{totalViews.toLocaleString()}</span>
                    </div>
                 </div>
              </div>
           </div>

        </div>

         {/* Bottom Legal bar - Compact */}
         <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 mt-8 border-t border-white/5">
            <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
              © {currentYear} • {p.fullName || "Admin"}
            </p>
            <div className="flex items-center gap-4">
               <span className="text-zinc-700 text-[9px] font-black uppercase tracking-[0.2em]">Crafted with Precision</span>
            </div>
         </div>

      </div>
    </footer>
  );
};

export default Footer;
