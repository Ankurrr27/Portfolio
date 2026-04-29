"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGithub } from "react-icons/fa";
import { RxExternalLink } from "react-icons/rx";
import { Terminal, X, Maximize2, Plus, ArrowRight } from "lucide-react";
import EditSectionButton from "./admin/EditSectionButton";


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
      
      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
        <span className="px-3 py-1 rounded-lg bg-zinc-900/90 text-[10px] font-bold text-zinc-100 tracking-widest shadow-sm backdrop-blur-md border border-zinc-700">
           {project.language || "CODE"}
        </span>
      </div>
    </div>

    {/* Content */}
    <div className="p-5 md:p-6 flex flex-col flex-1">
      <div className="flex items-center justify-between mb-3">
         <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-orange-500 transition-colors">
           {project.name}
         </h3>
      </div>

      <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
        {project.description || "No description available."}
      </p>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
         <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-center">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Stars</p>
            <p className="text-sm text-white font-bold">{project.stars || 0}</p>
         </div>
         <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-center">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Status</p>
            <p className="text-sm text-emerald-500 font-bold">Live</p>
         </div>
         <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-center">
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

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        if (data.projects) setProjects(data.projects);
      } catch (err) {
        console.error("Projects: Error fetching", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (isLoading) return null;

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

      <div className="max-w-7xl mx-auto py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
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
        </div>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[4000] flex items-center justify-center p-4 md:p-8 bg-slate-900/40 backdrop-blur-sm"
            className="fixed inset-0 z-[4000] flex items-center justify-center p-4 md:p-8 bg-zinc-950/80 backdrop-blur-sm"
            onClick={() => {
              setSelectedProject(null);
              setActiveImage(null);
            }}
          >
            <motion.div 
               initial={{ scale: 0.95, y: 20 }}
               animate={{ scale: 1, y: 0 }}
               exit={{ scale: 0.95, y: 20 }}
               onClick={(e) => e.stopPropagation()}
               className="w-full max-w-5xl h-full md:h-[90vh] bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-800 overflow-hidden flex flex-col"
             >
               {/* Clean Header */}
               <div className="relative flex items-center justify-between p-6 md:p-8 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-xl">
                  <div>
                     <h3 className="text-2xl md:text-4xl font-bold text-white tracking-tight">{selectedProject.name}</h3>
                     <p className="text-zinc-500 font-bold mt-2 flex items-center gap-2 uppercase text-[10px] tracking-widest">
                        <FaGithub size={14} className="text-orange-500" /> {selectedProject.language || "Repository"}
                     </p>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedProject(null);
                      setActiveImage(null);
                    }}
                    className="p-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-zinc-700 transition-all shadow-xl active:scale-95"
                  >
                    <X size={20} />
                  </button>
               </div>
 
               <div className="p-6 md:p-8 overflow-y-auto flex-1 bg-zinc-900">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                     <div className="lg:col-span-8 space-y-10">
                        
                        {/* Main Image - Original Size / Unstretched */}
                        {(activeImage || selectedProject.imageUrl) && (
                          <div className="w-full rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-950 flex items-center justify-center p-2 transition-all duration-300">
                            <img 
                              key={activeImage || selectedProject.imageUrl}
                              src={activeImage || selectedProject.imageUrl} 
                              alt={selectedProject.name} 
                              className="w-full h-auto max-h-[60vh] object-contain rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-500"
                            />
                          </div>
                        )}
 
                        <div className="space-y-4">
                           <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] border-l-2 border-orange-500 pl-4">Overview</h4>
                           <p className="text-zinc-300 text-base leading-relaxed whitespace-pre-line">
                             {selectedProject.description || "No description available."}
                           </p>
                        </div>
                     </div>
 
                     <div className="lg:col-span-4 space-y-8 lg:pl-4">
                        
                        {/* Project Gallery - Moved to Right Side */}
                        {(selectedProject.galleryUrls && selectedProject.galleryUrls.length > 0) && (
                          <div className="space-y-4">
                             <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] border-l-2 border-orange-500 pl-4">Gallery</h4>
                             <div className="grid grid-cols-2 gap-3">
                                {selectedProject.galleryUrls.map((url, i) => (
                                  <motion.div 
                                    key={i} 
                                    whileHover={{ scale: 1.05 }}
                                    className={`aspect-video rounded-2xl overflow-hidden border cursor-pointer group relative bg-zinc-950 shadow-xl transition-all ${
                                      (activeImage === url) ? "border-orange-500 ring-2 ring-orange-500/20" : "border-zinc-800 hover:border-zinc-700"
                                    }`}
                                    onClick={() => setActiveImage(url)}
                                  >
                                     <img src={url} className="w-full h-full object-cover transition-all duration-700 opacity-60 group-hover:opacity-100" />
                                     <div className="absolute inset-0 bg-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                                        <Maximize2 size={16} className="text-white drop-shadow-md" />
                                     </div>
                                  </motion.div>
                                ))}
                             </div>
                          </div>
                        )}
 
                        <div className="space-y-4 pt-2">
                           <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] border-l-2 border-orange-500 pl-4">Tech Stack</h4>
                            <div className="flex flex-wrap gap-2">
                              {(selectedProject.topics || []).map(topic => (
                                <span key={topic} className="px-3 py-1.5 rounded-xl bg-zinc-800 border border-zinc-700 text-[10px] font-bold text-zinc-300 hover:text-white transition-all cursor-default shadow-lg uppercase tracking-widest">
                                   {topic}
                                </span>
                              ))}
                           </div>
                        </div>
 
                        <div className="space-y-4 pt-2">
                           <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] border-l-2 border-orange-500 pl-4">Links</h4>
                            <div className="flex flex-col gap-3">
                              <a 
                                href={selectedProject.htmlUrl} 
                                target="_blank" 
                                rel="noopener"
                                className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-white text-zinc-950 font-bold text-sm hover:bg-zinc-200 hover:-translate-y-1 transition-all shadow-xl active:scale-95"
                              >
                                <FaGithub size={18} /> Source Code
                              </a>
                              {selectedProject.homepage && (
                                <a 
                                  href={selectedProject.homepage} 
                                  target="_blank" 
                                  rel="noopener"
                                  className="flex items-center justify-center gap-2 p-4 rounded-2xl border border-zinc-700 bg-zinc-800 text-white font-bold text-sm hover:bg-zinc-700 hover:-translate-y-1 transition-all shadow-xl active:scale-95"
                                >
                                  <RxExternalLink size={18} /> Live Website
                                </a>
                              )}
                           </div>
                        </div>
                     </div>
                 </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Projects;
