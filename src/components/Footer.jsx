"use client";
import React, { useState } from "react";
import { profileContent } from "../data/profile";
import { ArrowRight, ExternalLink } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import MagneticButton from "./MagneticButton";

const Footer = () => {
  const [viewCount] = useState(12450);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full relative py-16 bg-white overflow-hidden border-t border-slate-200 text-slate-900">
      
      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* The Final CTA (Conversion) */}
        <div className="flex flex-col items-center text-center space-y-6 mb-16">
           <span className="px-4 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-700">
             Available for work
           </span>
           <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
             Let's build <br/> something <span className="text-blue-600">Extraordinary.</span>
           </h2>
           
           <div className="flex flex-col sm:flex-row items-center gap-4 pt-6">
              <MagneticButton>
                <a 
                  href={`mailto:${profileContent.email}`}
                  className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all flex items-center gap-3 shadow-md active:scale-95"
                >
                  Get in Touch <ArrowRight size={16} />
                </a>
              </MagneticButton>
              
              <div className="flex items-center gap-4 ml-0 sm:ml-4">
                 <a href={profileContent.githubUrl} target="_blank" className="text-slate-500 hover:text-blue-600 transition-colors p-2"><FaGithub size={24} /></a>
                 <a href={profileContent.linkedinUrl} target="_blank" className="text-slate-500 hover:text-blue-600 transition-colors p-2"><FaLinkedin size={24} /></a>
              </div>
           </div>
        </div>

        {/* Technical Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pt-16 border-t border-slate-100">
           
           <div className="md:col-span-5 space-y-6">
              <div className="flex items-center gap-3">
                 <span className="text-2xl font-bold tracking-tight text-slate-900">{profileContent.fullName}</span>
                 <div className="w-2 h-2 rounded-full bg-blue-600" />
              </div>
              <p className="text-slate-600 text-sm leading-relaxed max-w-sm">
                Engineering resilient digital infrastructure and high-performance user experiences. Based in {profileContent.location.split("•")[0]}.
              </p>
              
              <div className="flex items-center gap-3 pt-2">
                 <div className="px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs text-slate-700 font-semibold uppercase tracking-wider">Available For Work</span>
                 </div>
              </div>
           </div>

           <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div className="space-y-4">
                 <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Navigation</h4>
                 <ul className="space-y-3">
                    {["Home", "About", "Skills", "Projects", "Achievements", "Education"].map(link => (
                      <li key={link}><a href={`#${link.toLowerCase()}`} className="text-slate-600 hover:text-blue-600 transition-colors text-sm font-medium">{link}</a></li>
                    ))}
                 </ul>
              </div>

              <div className="space-y-4">
                 <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Connect</h4>
                 <ul className="space-y-3">
                    <li><a href={profileContent.resumeUrl} className="text-slate-600 hover:text-blue-600 transition-colors text-sm font-medium flex items-center gap-1.5">Resume <ExternalLink size={14} /></a></li>
                    <li><a href="/admin" className="text-slate-600 hover:text-blue-600 transition-colors text-sm font-medium">Admin Panel</a></li>
                    <li><a href={profileContent.linkedinUrl} className="text-slate-600 hover:text-blue-600 transition-colors text-sm font-medium">LinkedIn</a></li>
                 </ul>
              </div>

              <div className="space-y-4">
                 <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">System</h4>
                 <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                       <span className="text-slate-500 text-xs font-semibold">Total Visits</span>
                       <span className="text-slate-900 text-base font-bold">{viewCount.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                       <span className="text-slate-500 text-xs font-semibold">Current Year</span>
                       <span className="text-slate-900 text-base font-bold">{currentYear}</span>
                    </div>
                 </div>
              </div>
           </div>

        </div>

        {/* Bottom Legal bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 mt-12 border-t border-slate-100">
           <p className="text-slate-500 text-sm font-medium">
             © {currentYear} • Engineered by {profileContent.fullName}
           </p>
           <div className="flex items-center gap-6">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Crafted with Precision</span>
           </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
