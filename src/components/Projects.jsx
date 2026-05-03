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
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay: index * 0.1, ease: [0.21, 1.11, 0.81, 0.99] }}
    className="panel group relative h-full flex flex-col overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:border-zinc-700 cursor-pointer"
    onClick={() => onOpen(project)}
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

      <div className="flex items-center justify-between pt-4 border-t border-zinc-800" onClick={(e) => e.stopPropagation()}>
         <button 
           onClick={() => onOpen(project)}
           className="min-h-11 text-xs md:text-sm font-bold text-amber-500 flex items-center gap-2 group/btn hover:text-amber-400 transition-colors uppercase tracking-wide"
         >
           View Details <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
         </button>
         
         <div className="flex items-center gap-4">
             <a 
               href={project.htmlUrl}
               target="_blank"
               rel="noopener noreferrer"
               className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest"
               title="Source Code"
             >
               <FaGithub size={16} /> <span className="hidden sm:inline">Code</span>
             </a>
             {project.homepage && (
               <a 
                 href={project.homepage}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="text-zinc-400 hover:text-amber-500 transition-colors flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest"
                 title="Live Project"
               >
                 <RxExternalLink size={16} /> <span className="hidden sm:inline">Live</span>
               </a>
             )}
         </div>
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
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="section-container flex flex-col items-start text-left"
      >
        <div className="section-kicker mb-6">
           <Terminal size={16} className="text-amber-500" />
           <span>Portfolio Projects</span>
        </div>
        <h2 className="section-title mb-6">
          Development <span className="accent-text">Projects</span>
        </h2>
      </motion.div>

      <div className="section-container py-8">
         {/* Categories Selection - Tab Design */}
         <div className="mb-12 border-b border-white/10 overflow-x-auto">
            <div className="flex min-w-max gap-8">
                {["ALL", ...new Set(projects.map(p => p.language).filter(Boolean))].map((lang) => {
                    const count = lang === "ALL" 
                        ? projects.length 
                        : projects.filter(p => p.language === lang).length;
                    
                    const isActive = activeFilter === lang;
                    return (
                        <button
                            key={lang}
                            type="button"
                            onClick={() => setActiveFilter(lang)}
                            className={`relative flex items-center gap-2 px-1 pb-4 text-sm font-bold transition-colors ${
                                isActive
                                    ? "text-white"
                                    : "text-zinc-400 hover:text-white"
                            }`}
                        >
                            <span className="uppercase tracking-widest">{lang === "ALL" ? "All" : lang}</span>
                            <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-300">
                                {count}
                            </span>
                            {isActive && (
                                <motion.div 
                                  layoutId="projectActiveTab"
                                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber-500"
                                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>
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
               initial={{ scale: 0.98, opacity: 0, y: 15 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.98, opacity: 0, y: 15 }}
               transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
               onClick={(e) => e.stopPropagation()}
               className="w-full max-w-4xl h-full max-h-[90vh] bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col relative shadow-2xl"
             >
                {/* Modal Header */}
                <div className="shrink-0 flex items-center justify-between px-6 py-5 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl z-20 absolute top-0 left-0 right-0">
                    <div className="min-w-0 flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-zinc-950 shrink-0">
                          <Terminal size={14} className="font-bold" />
                       </div>
                       <h3 className="text-xl font-bold text-white tracking-tight truncate">
                          {selectedProject.name.replace(/_/g, ' ')}
                       </h3>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedProject(null);
                        setActiveImage(null);
                      }}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                    >
                      <X size={18} />
                    </button>
                </div>
  
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar pt-[73px]">
                   {/* Hero Image */}
                   <div className="relative w-full aspect-video border-b border-zinc-800 bg-zinc-900">
                      <img 
                        key={activeImage || selectedProject.imageUrl}
                        src={activeImage || selectedProject.imageUrl} 
                        alt={selectedProject.name} 
                        className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-700"
                      />
                   </div>
 
                   <div className="p-6 md:p-10 space-y-12">
                      {/* Top Row: Info & Stack */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
                         <div className="md:col-span-2 space-y-5">
                            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Project Overview</h4>
                            <div className="text-zinc-300 text-[15px] leading-loose font-medium">
                              {formatText(selectedProject.description || "Project documentation is being finalized.")}
                            </div>
                         </div>
                         
                         <div className="space-y-10">
                            {/* Tech Stack */}
                            <div className="space-y-4">
                               <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Tech Stack</h4>
                               <div className="flex flex-wrap gap-2">
                                  {(selectedProject.topics || []).map(topic => (
                                    <span key={topic} className="px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-semibold">
                                       {topic}
                                    </span>
                                  ))}
                                  {!(selectedProject.topics && selectedProject.topics.length > 0) && (
                                    <span className="text-zinc-500 text-sm italic">Not specified</span>
                                  )}
                               </div>
                            </div>
                            
                            {/* Links */}
                            <div className="space-y-4">
                               <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Links</h4>
                               <div className="flex flex-col gap-3">
                                  <a href={selectedProject.htmlUrl} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-sm font-bold text-zinc-400 hover:text-white transition-colors">
                                     <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-zinc-600 transition-colors">
                                        <FaGithub size={16} />
                                     </div>
                                     Source Code
                                  </a>
                                  {selectedProject.homepage && (
                                    <a href={selectedProject.homepage} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-sm font-bold text-amber-500 hover:text-amber-400 transition-colors">
                                       <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                                          <RxExternalLink size={16} />
                                       </div>
                                       Live Project
                                    </a>
                                  )}
                               </div>
                            </div>
                         </div>
                      </div>
 
                      {/* Gallery */}
                      {(selectedProject.galleryUrls && selectedProject.galleryUrls.length > 0) && (
                        <div className="space-y-6 pt-10 border-t border-zinc-800/50">
                           <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Gallery</h4>
                           <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              {selectedProject.galleryUrls.map((url, i) => (
                                <motion.div 
                                  key={i} 
                                  whileHover={{ scale: 1.02 }}
                                  className={`aspect-video rounded-xl overflow-hidden border-2 cursor-pointer group relative bg-zinc-950 transition-all duration-200 ${
                                    (activeImage === url) ? "border-amber-500" : "border-zinc-800 hover:border-zinc-600"
                                  }`}
                                  onClick={() => setActiveImage(url)}
                                >
                                   <img src={url} className="w-full h-full object-cover transition-all duration-700 opacity-60 group-hover:opacity-100" />
                                   <div className="absolute inset-0 bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                      <Maximize2 size={16} className="text-white drop-shadow-lg" />
                                   </div>
                                </motion.div>
                              ))}
                           </div>
                        </div>
                      )}
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
