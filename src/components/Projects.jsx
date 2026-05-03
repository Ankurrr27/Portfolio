"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGithub, FaInstagram, FaDiscord, FaFacebook, FaLinkedin, FaYoutube, FaTelegram, FaThreads, FaXTwitter } from "react-icons/fa6";
import { RxExternalLink } from "react-icons/rx";
import { Terminal, X, Maximize2, Plus, ArrowRight, Share2, ChevronDown } from "lucide-react";
import EditSectionButton from "./admin/EditSectionButton";
import { formatText } from "../utils/formatText";

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
      className="p-1.5 rounded-md bg-zinc-950 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors duration-200 border border-zinc-800"
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
    className="panel group relative h-full flex flex-col overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-700"
  >
    {/* Image Container */}
    <div className="relative h-48 md:h-56 overflow-hidden bg-zinc-950 border-b border-zinc-800">
      {project.imageUrl ? (
        <img
          src={project.imageUrl}
          alt={project.name}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300 opacity-90 group-hover:opacity-100"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-zinc-700">
          <FaGithub size={48} />
        </div>
      )}
      
      {/* Platform Badges */}
      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
        <span className="chip bg-zinc-950/90 text-zinc-100">
           {project.language || "CODE"}
        </span>
      </div>

      {/* Social Links Overlay (as requested in the image) */}
      {project.socialLinks && project.socialLinks.length > 0 && (
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:translate-y-2 md:group-hover:translate-y-0 transition-all duration-300">
           {project.socialLinks.map((link, i) => (
             <SocialIcon key={i} platform={link.platform} url={link.url} />
           ))}
        </div>
      )}
    </div>

    {/* Content */}
    <div className="p-4 md:p-6 flex flex-col flex-1">
      <div className="flex items-center justify-between mb-3">
         <h3 className="text-lg font-semibold text-white line-clamp-1 group-hover:text-amber-500 transition-colors tracking-tight">
           {project.name}
         </h3>
      </div>

      <div className="text-zinc-400 text-sm leading-relaxed line-clamp-3 mb-6 flex-1 font-medium">
        {formatText(project.description || "No description available.")}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2 md:gap-3 mb-6">
         <div className="panel-subtle p-2.5 md:p-3 text-center group-hover:border-zinc-700 transition-colors">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">Stars</p>
            <p className="text-sm text-white font-bold">{project.stars || 0}</p>
         </div>
         <div className="panel-subtle p-2.5 md:p-3 text-center group-hover:border-zinc-700 transition-colors">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">Status</p>
            <p className="text-sm text-amber-500 font-bold">Live</p>
         </div>
         <div className="panel-subtle p-2.5 md:p-3 text-center group-hover:border-zinc-700 transition-colors">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">Forks</p>
            <p className="text-sm text-amber-500 font-bold">{project.forks || 0}</p>
         </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
         <button 
           onClick={() => onOpen(project)}
           className="min-h-11 text-sm font-bold text-indigo-500 flex items-center gap-2 group/btn hover:text-indigo-400 transition-colors uppercase tracking-wide"
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
    <div id="projects" className="section-shell">
      <EditSectionButton href="/admin/projects" label="Edit Projects" />
      
      {/* Engineering Header */}
      <div className="section-container flex flex-col items-start text-left">
        <div className="section-kicker mb-6">
           <Terminal size={16} className="text-amber-500" />
           <span>Portfolio Projects</span>
        </div>
        <h2 className="section-title mb-6">
          Development <span className="accent-text">Projects</span>
        </h2>
        
      </div>

      <div className="section-container py-8">
         <div className="flex flex-wrap gap-2 md:gap-3 mb-8 md:mb-10">
             {uniqueLanguages.map(lang => (
                <button
                  key={lang}
                  onClick={() => setActiveFilter(lang)}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 border ${
                    activeFilter === lang 
                      ? "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/20" 
                      : "bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                  }`}
                >
                  {lang}
                </button>
             ))}
         </div>
         
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[420px] md:h-[450px] bg-zinc-900 rounded-lg md:rounded-2xl border border-zinc-800 flex flex-col overflow-hidden animate-pulse">
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
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
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
            className="fixed inset-0 z-[4000] flex items-center justify-center p-3 md:p-6 bg-zinc-950/95"
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
               className="w-full max-w-5xl h-full max-h-[92vh] md:max-h-[85vh] panel overflow-hidden flex flex-col relative"
             >
               {/* Modal Header - Slightly more compact */}
               <div className="shrink-0 flex items-start justify-between gap-3 p-4 md:p-6 border-b border-zinc-800/50 bg-zinc-900 relative z-10">
                  <div className="flex min-w-0 items-start gap-3 md:gap-4">
                     <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                        <Terminal size={20} />
                     </div>
                     <div className="min-w-0">
                        <h3 className="text-lg md:text-2xl font-bold text-white tracking-tight leading-tight break-words">
                           {selectedProject.name.replace(/_/g, ' ')}
                        </h3>
                        <div className="flex items-center gap-2 mt-1.5">
                           <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-500 uppercase tracking-wide bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                              <div className="w-1 h-1 rounded-full bg-amber-500" /> Live
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
                    className="group min-w-11 w-11 h-11 flex items-center justify-center rounded-md bg-zinc-800/50 hover:bg-indigo-500 text-zinc-400 hover:text-white border border-zinc-700/50 hover:border-indigo-400 transition-all duration-200 active:scale-95 shrink-0"
                  >
                    <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                  </button>
               </div>
 
               {/* Scrollable Content - Slightly more compact */}
               <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                     
                     {/* Primary Content (Left) */}
                     <div className="lg:col-span-8 space-y-6 md:space-y-8">
                        {/* Hero Image Section */}
                        <div className="relative group">
                           <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 flex items-center justify-center shadow-xl">
                              <img 
                                key={activeImage || selectedProject.imageUrl}
                                src={activeImage || selectedProject.imageUrl} 
                                alt={selectedProject.name} 
                                className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-700"
                              />
                              
                              {/* Quick Stats Overlay - Compact */}
                              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                                 <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-900/90 border border-zinc-700/50 shadow-xl">
                                    <FaGithub size={12} className="text-zinc-400" />
                                    <span className="text-[9px] font-bold text-white uppercase tracking-widest">{selectedProject.stars || 0}</span>
                                 </div>
                                 <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-900/90 border border-zinc-700/50 shadow-xl">
                                    <Share2 size={12} className="text-indigo-500" />
                                    <span className="text-[9px] font-bold text-white uppercase tracking-widest">{selectedProject.socialLinks?.length || 0} Hub</span>
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Description Section */}
                        <div className="space-y-4">
                           <div className="flex items-center gap-3 min-w-0">
                           <h4 className="text-xs font-semibold text-amber-500 uppercase tracking-wide px-3 bg-zinc-900/50 py-1 rounded-md border border-amber-500/20">Project Overview</h4>
                              <div className="h-px flex-1 bg-zinc-800/50" />
                           </div>
                           <div className="text-zinc-300 text-base leading-relaxed font-medium">
                             {formatText(selectedProject.description || "Project documentation is being finalized.")}
                           </div>
                        </div>
                     </div>
 
                     {/* Sidebar Content (Right) */}
                     <div className="lg:col-span-4 space-y-6 md:space-y-8">
                        
                        {/* Community Hub (Featured Socials) */}
                        {selectedProject.socialLinks && selectedProject.socialLinks.length > 0 && (
                          <div className="panel-subtle p-5">
                             <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                                <Share2 size={12} className="text-amber-500" /> Links
                             </h4>
                             <div className="grid grid-cols-4 gap-2 md:gap-3">
                                {selectedProject.socialLinks.map((link, i) => (
                                  <motion.a
                                    key={i}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener"
                                    whileHover={{ scale: 1.03, y: -1 }}
                                    className="aspect-square rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-amber-500/50 transition-all"
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
                             <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide pl-2 border-l border-amber-500">Gallery</h4>
                             <div className="grid grid-cols-2 gap-2 md:gap-3">
                                {selectedProject.galleryUrls.map((url, i) => (
                                  <motion.div 
                                    key={i} 
                                    whileHover={{ scale: 1.02 }}
                                    className={`aspect-video rounded-lg overflow-hidden border-2 cursor-pointer group relative bg-zinc-950 shadow-xl transition-all duration-200 ${
                                      (activeImage === url) ? "border-amber-500" : "border-zinc-800 hover:border-zinc-600"
                                    }`}
                                    onClick={() => setActiveImage(url)}
                                  >
                                     <img src={url} className="w-full h-full object-cover transition-all duration-700 opacity-60 group-hover:opacity-100" />
                                     <div className="absolute inset-0 bg-amber-500/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Maximize2 size={16} className="text-white drop-shadow-lg" />
                                     </div>
                                  </motion.div>
                                ))}
                             </div>
                          </div>
                        )}
  
                        {/* Tech Stack Chips */}
                        <div className="space-y-4">
                           <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide pl-2 border-l border-amber-500">Tech Stack</h4>
                            <div className="flex flex-wrap gap-2">
                              {(selectedProject.topics || []).map(topic => (
                                <span key={topic} className="chip hover:text-white hover:border-zinc-600 transition-all cursor-default">
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
                                className="group flex items-center justify-between p-4 rounded-lg bg-white text-zinc-950 font-bold text-xs uppercase tracking-wide hover:bg-amber-500 hover:text-white transition-all duration-200 shadow-xl active:scale-[0.98]"
                              >
                                <span className="flex items-center gap-3"><FaGithub size={18} /> Access Source</span>
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                              </a>
                              
                              {selectedProject.homepage && (
                                <a 
                                  href={selectedProject.homepage} 
                                  target="_blank" 
                                  rel="noopener"
                                  className="group flex min-h-11 items-center justify-between p-4 rounded-lg bg-zinc-800/50 border border-zinc-700 text-white font-bold text-xs uppercase tracking-wide hover:bg-zinc-700 transition-all duration-200 shadow-xl active:scale-[0.98]"
                                >
                                  <span className="flex items-center gap-3"><RxExternalLink size={18} className="text-indigo-500" /> Launch Project</span>
                                  <Maximize2 size={16} className="text-zinc-500 group-hover:text-white transition-colors" />
                                </a>
                              )}
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

                {/* Background Decorative Element */}
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Projects;
