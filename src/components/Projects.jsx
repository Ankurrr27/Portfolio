"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGithub, FaInstagram, FaDiscord, FaFacebook, FaLinkedin, FaYoutube, FaTelegram, FaThreads, FaXTwitter } from "react-icons/fa6";
import { RxExternalLink } from "react-icons/rx";
import { Terminal, X, Maximize2, Plus, ArrowRight, Share2 } from "lucide-react";
import EditSectionButton from "./admin/EditSectionButton";

const SocialIcon = ({ platform, url }) => {
  const icons = {
    instagram: FaInstagram,
    discord: FaDiscord,
    facebook: FaFacebook,
    linkedin: FaLinkedin,
    youtube: FaYoutube,
    telegram: FaTelegram,
    threads: FaThreads,
    twitter: FaXTwitter,
    x: FaXTwitter,
  };
  const Icon = icons[platform.toLowerCase()] || Share2;
  
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="p-1.5 rounded-lg bg-zinc-950/50 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all duration-300 backdrop-blur-sm border border-zinc-800/50"
      onClick={(e) => e.stopPropagation()}
    >
      <Icon size={16} />
    </a>
  );
};

const ProjectCard = ({ project, index, onOpen }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="group relative h-full flex flex-col bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-zinc-700 hover:bg-zinc-800/80"
  >
    {/* Image Container */}
    <div className="relative h-48 md:h-56 overflow-hidden bg-zinc-950 border-b border-zinc-800">
      {project.imageUrl ? (
        <img
          src={project.imageUrl}
          alt={project.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-zinc-700">
          <FaGithub size={48} />
        </div>
      )}
      
      {/* Platform Badges */}
      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
        <span className="px-3 py-1 rounded-lg bg-zinc-900/90 text-[10px] font-bold text-zinc-100 tracking-widest shadow-sm backdrop-blur-md border border-zinc-700">
           {project.language || "CODE"}
        </span>
      </div>

      {/* Social Links Overlay (as requested in the image) */}
      {project.socialLinks && project.socialLinks.length > 0 && (
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 delay-100">
           {project.socialLinks.map((link, i) => (
             <SocialIcon key={i} platform={link.platform} url={link.url} />
           ))}
        </div>
      )}
    </div>

    {/* Content */}
    <div className="p-5 md:p-6 flex flex-col flex-1">
      <div className="flex items-center justify-between mb-3">
         <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-orange-500 transition-colors uppercase tracking-tight">
           {project.name}
         </h3>
      </div>

      <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3 mb-6 flex-1 font-medium">
        {project.description || "No description available."}
      </p>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
         <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-center group-hover:border-zinc-700 transition-colors">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Stars</p>
            <p className="text-sm text-white font-bold">{project.stars || 0}</p>
         </div>
         <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-center group-hover:border-zinc-700 transition-colors">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Status</p>
            <p className="text-sm text-emerald-500 font-bold">Live</p>
         </div>
         <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-center group-hover:border-zinc-700 transition-colors">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Forks</p>
            <p className="text-sm text-orange-500 font-bold">{project.forks || 0}</p>
         </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
         <button 
           onClick={() => onOpen(project)}
           className="text-sm font-bold text-orange-500 flex items-center gap-2 group/btn hover:text-orange-400 transition-colors uppercase tracking-widest"
         >
           View Details <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
         </button>
      </div>
    </div>
  </motion.div>
);

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [activeFilter, setActiveFilter] = useState("ALL");

  useEffect(() => {
    // Check cache first
    const cached = localStorage.getItem("portfolio_projects");
    if (cached) {
      setProjects(JSON.parse(cached));
      setIsLoading(false);
    }

    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        if (data.projects) {
          setProjects(data.projects);
          localStorage.setItem("portfolio_projects", JSON.stringify(data.projects));
        }
      } catch (err) {
        console.error("Projects: Error fetching", err);
      } finally {
        if (!cached) setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const uniqueLanguages = ["ALL", ...new Set(projects.map(p => p.language).filter(Boolean))];
  const filteredProjects = activeFilter === "ALL" 
    ? projects 
    : projects.filter(p => p.language === activeFilter);

  return (
    <div id="projects" className="w-full bg-zinc-950 relative scroll-mt-20 border-b border-zinc-900 pt-32 pb-24 px-6 md:px-12 lg:px-24">
      <EditSectionButton href="/admin/projects" label="Edit Projects" />
      
      {/* Engineering Header */}
      <div className="max-w-7xl mx-auto flex flex-col items-start text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 mb-6">
           <Terminal size={16} className="text-orange-500" />
           <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Portfolio Projects</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
          Technical <br /> <span className="text-orange-500">Architecture.</span>
        </h2>
        <p className="text-zinc-400 text-base max-w-2xl leading-relaxed">
           Deep dives into scalable systems, performance-driven implementations, and complex algorithmic structures.
        </p>
      </div>

      <div className="max-w-7xl mx-auto py-8">
         <div className="flex flex-wrap gap-3 mb-10">
            {uniqueLanguages.map(lang => (
               <button
                 key={lang}
                 onClick={() => setActiveFilter(lang)}
                 className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border ${
                   activeFilter === lang 
                     ? "bg-orange-500 text-white border-orange-400 shadow-[0_0_15px_rgba(251,146,60,0.4)]" 
                     : "bg-zinc-900/50 text-zinc-500 border-zinc-800 hover:border-zinc-700 hover:text-zinc-300"
                 }`}
               >
                 {lang}
               </button>
            ))}
         </div>
         
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[450px] bg-zinc-900 rounded-2xl border border-zinc-800 flex flex-col overflow-hidden animate-pulse">
                 <div className="h-48 md:h-56 bg-zinc-800/50 border-b border-zinc-800" />
                 <div className="p-5 flex-1 flex flex-col">
                    <div className="w-1/2 h-6 bg-zinc-800 rounded mb-4" />
                    <div className="w-full h-4 bg-zinc-800 rounded mb-2" />
                    <div className="w-5/6 h-4 bg-zinc-800 rounded mb-8" />
                    <div className="grid grid-cols-3 gap-3 mb-6">
                       <div className="h-16 bg-zinc-800 rounded-xl" />
                       <div className="h-16 bg-zinc-800 rounded-xl" />
                       <div className="h-16 bg-zinc-800 rounded-xl" />
                    </div>
                 </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <ProjectCard 
                  key={project.id || project.slug} 
                  project={project} 
                  index={index} 
                  onOpen={(p) => {
                    setSelectedProject(p);
                    setActiveImage(null);
                  }}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[4000] flex items-center justify-center p-4 md:p-6 bg-zinc-950/90 backdrop-blur-xl"
            onClick={() => {
              setSelectedProject(null);
              setActiveImage(null);
            }}
          >
            <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 30 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.9, opacity: 0, y: 30 }}
               transition={{ type: "spring", damping: 25, stiffness: 300 }}
               onClick={(e) => e.stopPropagation()}
               className="w-full max-w-5xl h-full max-h-[85vh] bg-zinc-900/80 border border-zinc-800 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col relative"
             >
               {/* Modal Header - Slightly more compact */}
               <div className="shrink-0 flex items-center justify-between p-5 md:p-6 border-b border-zinc-800/50 bg-zinc-900/40 backdrop-blur-md relative z-10">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                        <Terminal size={20} />
                     </div>
                     <div>
                        <h3 className="text-xl md:text-2xl font-black text-white tracking-tighter uppercase leading-none">
                           {selectedProject.name.replace(/_/g, ' ')}
                        </h3>
                        <div className="flex items-center gap-2 mt-1.5">
                           <span className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/5 px-2 py-0.5 rounded-md border border-emerald-500/10">
                              <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" /> Live
                           </span>
                           <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                              {selectedProject.language || "Native Module"}
                           </span>
                        </div>
                     </div>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedProject(null);
                      setActiveImage(null);
                    }}
                    className="group w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-800/50 hover:bg-orange-500 text-zinc-400 hover:text-white border border-zinc-700/50 hover:border-orange-400 transition-all duration-300 shadow-xl active:scale-95"
                  >
                    <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                  </button>
               </div>
 
               {/* Scrollable Content - Slightly more compact */}
               <div className="flex-1 overflow-y-auto p-5 md:p-8 custom-scrollbar">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                     
                     {/* Primary Content (Left) */}
                     <div className="lg:col-span-8 space-y-8">
                        {/* Hero Image Section */}
                        <div className="relative group">
                           <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 flex items-center justify-center shadow-2xl">
                              <img 
                                key={activeImage || selectedProject.imageUrl}
                                src={activeImage || selectedProject.imageUrl} 
                                alt={selectedProject.name} 
                                className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-700"
                              />
                              
                              {/* Quick Stats Overlay - Compact */}
                              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                                 <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-700/50 backdrop-blur-md shadow-xl">
                                    <FaGithub size={12} className="text-zinc-400" />
                                    <span className="text-[9px] font-bold text-white uppercase tracking-widest">{selectedProject.stars || 0}</span>
                                 </div>
                                 <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-700/50 backdrop-blur-md shadow-xl">
                                    <Share2 size={12} className="text-orange-500" />
                                    <span className="text-[9px] font-bold text-white uppercase tracking-widest">{selectedProject.socialLinks?.length || 0} Hub</span>
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Description Section */}
                        <div className="space-y-4">
                           <div className="flex items-center gap-3">
                              <h4 className="text-[9px] font-black text-orange-500 uppercase tracking-[0.4em] px-3 whitespace-nowrap bg-zinc-900/50 py-1 rounded-full border border-orange-500/20">System Overview</h4>
                              <div className="h-px flex-1 bg-zinc-800/50" />
                           </div>
                           <p className="text-zinc-300 text-base leading-relaxed font-medium">
                             {selectedProject.description || "Project documentation is being finalized."}
                           </p>
                        </div>
                     </div>
 
                     {/* Sidebar Content (Right) */}
                     <div className="lg:col-span-4 space-y-8">
                        
                        {/* Community Hub (Featured Socials) */}
                        {selectedProject.socialLinks && selectedProject.socialLinks.length > 0 && (
                          <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 shadow-inner">
                             <h4 className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                <Share2 size={10} className="text-orange-500" /> Community Hub
                             </h4>
                             <div className="grid grid-cols-4 gap-3">
                                {selectedProject.socialLinks.map((link, i) => (
                                  <motion.a
                                    key={i}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener"
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    className="aspect-square rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-orange-500/50 transition-all shadow-xl"
                                  >
                                     <SocialIcon platform={link.platform} url={link.url} />
                                  </motion.a>
                                ))}
                             </div>
                          </div>
                        )}

                        {/* Project Gallery */}
                        {(selectedProject.galleryUrls && selectedProject.galleryUrls.length > 0) && (
                          <div className="space-y-4">
                             <h4 className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] pl-2 border-l-2 border-orange-500">Asset Manifest</h4>
                             <div className="grid grid-cols-2 gap-3">
                                {selectedProject.galleryUrls.map((url, i) => (
                                  <motion.div 
                                    key={i} 
                                    whileHover={{ scale: 1.05 }}
                                    className={`aspect-video rounded-xl overflow-hidden border-2 cursor-pointer group relative bg-zinc-950 shadow-2xl transition-all duration-300 ${
                                      (activeImage === url) ? "border-orange-500" : "border-zinc-800 hover:border-zinc-600"
                                    }`}
                                    onClick={() => setActiveImage(url)}
                                  >
                                     <img src={url} className="w-full h-full object-cover transition-all duration-700 opacity-60 group-hover:opacity-100" />
                                     <div className="absolute inset-0 bg-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                                        <Maximize2 size={16} className="text-white drop-shadow-lg" />
                                     </div>
                                  </motion.div>
                                ))}
                             </div>
                          </div>
                        )}
  
                        {/* Tech Stack Chips */}
                        <div className="space-y-4">
                           <h4 className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] pl-2 border-l-2 border-orange-500">Engine Stack</h4>
                            <div className="flex flex-wrap gap-2">
                              {(selectedProject.topics || []).map(topic => (
                                <span key={topic} className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[9px] font-bold text-zinc-400 hover:text-white hover:border-zinc-600 transition-all cursor-default uppercase tracking-widest shadow-md">
                                   {topic}
                                </span>
                              ))}
                           </div>
                        </div>
  
                        {/* Action Buttons */}
                        <div className="space-y-3 pt-4 border-t border-zinc-800/50">
                           <div className="flex flex-col gap-3">
                              <a 
                                href={selectedProject.htmlUrl} 
                                target="_blank" 
                                rel="noopener"
                                className="group flex items-center justify-between p-4 rounded-2xl bg-white text-zinc-950 font-black text-[10px] uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-xl active:scale-[0.98]"
                              >
                                <span className="flex items-center gap-3"><FaGithub size={18} /> Access Source</span>
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                              </a>
                              
                              {selectedProject.homepage && (
                                <a 
                                  href={selectedProject.homepage} 
                                  target="_blank" 
                                  rel="noopener"
                                  className="group flex items-center justify-between p-4 rounded-2xl bg-zinc-800/50 border border-zinc-700 text-white font-black text-[10px] uppercase tracking-widest hover:bg-zinc-700 transition-all duration-300 shadow-xl active:scale-[0.98]"
                                >
                                  <span className="flex items-center gap-3"><RxExternalLink size={18} className="text-orange-500" /> Launch System</span>
                                  <Maximize2 size={16} className="text-zinc-500 group-hover:text-white transition-colors" />
                                </a>
                              )}
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

                {/* Background Decorative Element */}
                <div className="absolute top-0 right-0 -z-10 w-1/3 h-full bg-gradient-to-l from-orange-500/5 to-transparent pointer-events-none" />
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Projects;
