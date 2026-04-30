"use client";
import React, { useEffect, useRef, useState } from "react";
import { Briefcase, Users, Award, ShieldCheck, ExternalLink } from "lucide-react";
import EditSectionButton from "./admin/EditSectionButton";

const ResponsibilityItem = ({ organization, period, isVisible, index, logoUrl, roles, organizationUrl }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayRoles = isExpanded ? roles : [roles[0]];
  const hasMore = roles.length > 1;

  // Specific styling for IIITians Network
  const isIIITians = organization === "IIITians Network";
  
  const containerStyles = isIIITians 
    ? "bg-gradient-to-br from-[#1b2b1a] via-[#2a3f29] to-[#1b2b1a] border-[#3a5238]/50 shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
    : "bg-zinc-900/60 border-zinc-800/60 shadow-2xl";

  return (
    <div
      className={`group relative w-full rounded-2xl backdrop-blur-xl border transition-all duration-700 overflow-hidden hover:border-blue-500/30 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${containerStyles}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Texture Overlay for IIITians */}
      {isIIITians && (
        <>
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay" />
          {/* Logo Watermark Overlay - alternates left/right */}
          <div className={`absolute -top-8 w-72 h-72 opacity-[0.08] pointer-events-none transition-all duration-1000 group-hover:opacity-[0.14] group-hover:scale-110 ${
            index % 2 === 0 ? "-left-10 -rotate-12 group-hover:rotate-0" : "-right-10 rotate-12 group-hover:rotate-0"
          }`}>
             <img 
               src="/images/iiitians.jpg" 
               alt="" 
               className="w-full h-full object-contain filter brightness-0 invert" 
             />
          </div>
        </>
      )}

      <div className="flex flex-col md:flex-row relative z-10">
        {/* Left Side: Logo/Icon Space (Compact for IIITians) */}
        <div className={`w-full md:w-24 lg:w-32 shrink-0 relative border-b md:border-b-0 md:border-r flex items-start justify-center p-6 md:pt-8 h-auto ${
          isIIITians ? "bg-transparent border-transparent" : "bg-zinc-950 border-zinc-800/60"
        }`}>
          {!isIIITians && (
            logoUrl ? (
              <img 
                src={logoUrl} 
                alt={organization} 
                className="w-16 h-16 md:w-12 md:h-12 lg:w-16 lg:h-16 object-contain opacity-80 group-hover:opacity-100 transition-all duration-500"
              />
            ) : (
              <div className={`w-16 h-16 md:w-12 md:h-12 lg:w-16 lg:h-16 rounded-xl border flex items-center justify-center transition-colors bg-zinc-900 border-zinc-800 text-blue-500 group-hover:text-blue-400`}>
                <Users size={32} />
              </div>
            )
          )}
        </div>

        {/* Right Side: Content Area */}
        <div className="flex-1 p-6 md:p-8 flex flex-col relative z-20">
          {/* Organization Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h3 className={`text-xl md:text-2xl font-bold tracking-tight leading-tight transition-colors duration-300 ${
                  isIIITians ? "text-[#d4f484] group-hover:text-white" : "text-white group-hover:text-blue-500"
                }`}>
                  {organization}
                </h3>
                {organizationUrl && (
                  <a 
                    href={organizationUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`transition-colors ${isIIITians ? "text-[#d4f484]/50 hover:text-white" : "text-zinc-500 hover:text-blue-500"}`}
                  >
                    <ExternalLink size={18} />
                  </a>
                )}
              </div>
              <p className={`font-bold text-[10px] uppercase tracking-widest mt-1 ${
                isIIITians ? "text-[#d4f484]/60" : "text-zinc-500"
              }`}>
                {period}
              </p>
            </div>
          </div>

          {/* Roles Journey */}
          <div className="relative space-y-12 pl-6">
            {/* Vertical Journey Line */}
            {roles.length > 1 && (
              <div className={`absolute left-[7px] top-2 bottom-2 w-0.5 transition-colors ${
                isIIITians ? "bg-[#d4f484]/10 group-hover:bg-[#d4f484]/30" : "bg-zinc-800 group-hover:bg-blue-500/20"
              }`} />
            )}

            {displayRoles.map((role, rIndex) => (
              <div key={rIndex} className="relative animate-in fade-in slide-in-from-top-2 duration-500">
                {/* Connector Dot */}
                <div className={`absolute -left-[23px] top-1.5 w-2.5 h-2.5 rounded-full border-2 z-10 ${
                  isIIITians 
                    ? `border-[#1b2b1a] ${rIndex === 0 ? "bg-[#d4f484]" : "bg-[#d4f484]/30"}`
                    : `border-zinc-950 ${rIndex === 0 ? "bg-blue-500" : "bg-zinc-700"}`
                }`} />
                
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h4 className={`text-lg font-bold ${isIIITians ? "text-white" : "text-zinc-100"}`}>{role.title}</h4>
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border transition-all ${
                      isIIITians 
                        ? "bg-[#d4f484]/10 text-[#d4f484] border-[#d4f484]/20 group-hover:bg-[#d4f484]/20" 
                        : "bg-zinc-800 text-zinc-400 border-zinc-700/50"
                    }`}>
                      {role.period}
                    </span>
                  </div>

                  {role.description && (
                    <p className={`text-sm md:text-base leading-relaxed font-medium max-w-3xl ${
                      isIIITians ? "text-[#d4f484]/70 group-hover:text-white/90" : "text-zinc-400"
                    }`}>
                      {role.description}
                    </p>
                  )}

                  {role.points && role.points.length > 0 && (
                    <ul className="space-y-2">
                      {role.points.map((point, pIndex) => (
                        <li key={pIndex} className={`flex gap-3 text-sm leading-relaxed ${
                          isIIITians ? "text-[#d4f484]/50 group-hover:text-[#d4f484]/80" : "text-zinc-400"
                        }`}>
                          <span className={`shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full ${
                            isIIITians ? "bg-[#d4f484]/30" : "bg-blue-500/40"
                          }`} />
                          {point}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}

            {hasMore && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`group/btn flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors mt-4 relative z-30 ${
                  isIIITians ? "text-[#d4f484] hover:text-white" : "text-blue-500 hover:text-blue-400"
                }`}
              >
                <span>{isExpanded ? "Show less" : `Show ${roles.length - 1} more role${roles.length - 1 > 1 ? "s" : ""}`}</span>
                <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-transform duration-300 ${
                  isExpanded ? "rotate-180" : ""
                } ${isIIITians ? "bg-[#d4f484]/10" : "bg-blue-500/10"}`}>
                   <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Responsibilities = () => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  // Hardcoded data as requested
  const responsibilities = [
    {
      id: "iiitians",
      organization: "IIITians Network",
      period: "Dec 2024 - Present • 1 yr 5 mos",
      roles: [
        {
          title: "Vice President",
          period: "Feb 2026 - Present • 3 mos",
          description: "Leading initiatives and streamlining team coordination to support and grow a dynamic community of 30,000+ students.",
          points: [
            "Collaborating across verticals to ensure smooth execution of activities.",
            "Strengthening engagement and translating strategic ideas into impactful outcomes.",
            "Driving the overall growth and outreach of the network across IIITs."
          ]
        },
        {
          title: "Lead - Social Media & Outreach team",
          period: "Jul 2025 - Feb 2026 • 8 mos",
          description: "Oversaw and maintained the online presence across multiple platforms to improve visibility.",
          points: [
            "Strengthened the network by building meaningful collaborations.",
            "Connecting students and communities across different IIITs through digital outreach."
          ]
        },
        {
          title: "Member - Social Media & Outreach team",
          period: "Dec 2024 - Jul 2025 • 8 mos",
          description: "Managed and grew the official Instagram page through creative strategies.",
          points: [
            "Explored creative ways to increase reach and engagement.",
            "Collaborated with peers to achieve notable growth milestones."
          ]
        }
      ],
      logoUrl: "/images/iiitians.jpg"
    },
    {
      id: "techknow",
      organization: "TechKnow | Technical Council, IIIT Kota",
      period: "Aug 2024 - Present • 1 yr 9 mos",
      roles: [
        {
          title: "Senior General Secretary Executive",
          period: "Aug 2025 - Present • 9 mos",
          description: "Responsible for planning and managing all technical events at IIIT Kota, ensuring creative and smooth delivery.",
          points: [
            "Guiding the junior team and maintaining clear communication with faculty and sponsors.",
            "Spearheading innovation in event management and execution."
          ]
        },
        {
          title: "Junior Event Manager Executive",
          period: "Aug 2024 - Aug 2025 • 1 yr 1 mo",
          description: "Managed on-field event planning and team coordination for various technical symposiums.",
          points: [
            "Ensured smooth execution and impactful experiences for attendees.",
            "Coordinated with cross-functional teams for logistical success."
          ]
        }
      ],
      logoUrl: "/images/techknow.jpg"
    },
    {
      id: "neon",
      organization: "Neon Cinematics",
      period: "Aug 2025 - Present",
      roles: [
        {
          title: "Co-Lead",
          period: "Aug 2025 - Present • 9 mos",
          description: "Guiding the visual storytelling and cinematic presence of the college through creative leadership.",
          points: [
            "Mentoring the junior team in video editing, poster design, and cinematography.",
            "Capturing campus life through engaging visuals that strengthen online presence."
          ]
        }
      ],
      logoUrl: null
    },
    {
      id: "udbhav",
      organization: "UDBHAV - Inter IIIT Hackathon",
      period: "Jul 2025 - Feb 2026",
      roles: [
        {
          title: "Design Lead",
          period: "Jul 2025 - Feb 2026 • 8 mos",
          description: "Headed the design efforts for the first-ever Inter IIIT Hackathon, ensuring a cohesive visual brand.",
          points: [
            "Guided and coordinated creative efforts throughout the event.",
            "Crafted posters, brochures, and visual branding that captured the event's energy."
          ]
        }
      ],
      logoUrl: null
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.05, rootMargin: "50px" }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={containerRef}
      className="w-full relative pt-32 pb-24 bg-zinc-950 overflow-visible border-b border-zinc-900 px-6 md:px-12 lg:px-24"
      id="responsibilities"
    >
      <EditSectionButton href="/admin/responsibilities" label="Edit Responsibilities" />
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* LinkedIn-style Engineering Header */}
        <div className={`flex flex-col md:flex-row justify-between items-end gap-6 mb-20 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
           <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900">
                 <ShieldCheck size={16} className="text-blue-500" />
                 <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Leadership Manifest</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-[1.1]">
                Positions of <br />
                <span className="text-blue-500">
                  Responsibility.
                </span>
              </h2>
           </div>
           <p className="max-w-xs text-zinc-400 text-sm md:text-base leading-relaxed text-left md:text-right">
              Strategic roles and leadership initiatives beyond formal coursework.
           </p>
        </div>

        <div className="relative space-y-10">
          {responsibilities.map((item, index) => (
            <ResponsibilityItem
              key={item.id || index}
              index={index}
              organization={item.organization}
              period={item.period}
              roles={item.roles}
              logoUrl={item.logoUrl}
              organizationUrl={item.organizationUrl}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Responsibilities;
