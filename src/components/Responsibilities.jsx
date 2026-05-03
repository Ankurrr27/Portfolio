"use client";

import React, { useEffect, useRef, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { FaInstagram, FaLinkedin, FaTwitter, FaGlobe } from "react-icons/fa";
import EditSectionButton from "./admin/EditSectionButton";
import { formatText } from "../utils/formatText";

const ResponsibilityItem = ({ organization, period, isVisible, index, logoUrl, roles, organizationUrl, socials }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayRoles = isExpanded ? roles : [roles[0]];
  const hasMore = roles.length > 1;

  return (
    <div
      className={`panel w-full overflow-hidden transition-all duration-500 hover:border-indigo-500/50 hover:shadow-[0_20px_50px_rgba(99,102,241,0.12)] hover:-translate-y-1 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <div className="flex flex-col w-full relative">
        {/* Decorative Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none" />

        {/* Card Header ("Navbar" style) */}
        <div className="flex flex-row items-center justify-between gap-3 border-b border-zinc-800/50 bg-zinc-950/80 p-5 md:px-10 md:py-8 relative z-10">
          <div className="flex items-center gap-4 md:gap-6 flex-1 min-w-0">
            <div className="shrink-0 relative group/logo">
              {logoUrl ? (
                <div className="relative">
                  <img src={logoUrl} alt={organization} className="w-12 h-12 md:w-16 md:h-16 object-contain opacity-90 rounded-xl transition-transform duration-500 group-hover/logo:scale-110" />
                  <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover/logo:opacity-100 transition-opacity rounded-xl" />
                </div>
              ) : (
                <div className="icon-box flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-xl bg-zinc-900 border border-zinc-800 text-indigo-400">
                  <ShieldCheck size={24} />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg md:text-3xl font-bold tracking-tight leading-tight text-white transition-colors duration-300">
                {organization}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-indigo-400 opacity-90">
                  {period}
                </span>
              </div>
            </div>
          </div>

          {/* Social Handles */}
          {socials && socials.length > 0 && (
            <div className="flex items-center gap-2 md:gap-4 shrink-0">
              {socials.map((social, idx) => {
                const Icon = social.icon;
                return (
                  <a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 md:p-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800 transition-all hover:scale-110 hover:bg-indigo-500/10 hover:border-indigo-500/30 ${social.color || 'text-zinc-400'}`}
                    aria-label={social.name}
                  >
                    <Icon size={16} className="md:w-5 md:h-5" />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {/* Roles / Posts Section */}
        <div className="p-6 md:p-10 relative z-10">
          <div className="relative space-y-8 md:space-y-12 pl-6 md:pl-8">
            {roles.length > 1 && <div className="absolute left-[7px] md:left-[9px] top-3 bottom-3 w-px bg-gradient-to-b from-indigo-500/50 via-zinc-800 to-zinc-800/20" />}

            {displayRoles.map((role, rIndex) => (
              <div 
                key={rIndex} 
                className={`relative transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                style={{ transitionDelay: `${(index * 120) + (rIndex * 150)}ms` }}
              >
                <div className={`absolute -left-[23px] md:-left-[28px] top-1.5 w-3 h-3 rounded-full border-2 border-zinc-950 ring-4 ring-zinc-950/50 ${rIndex === 0 ? "bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" : "bg-zinc-700"}`} />

                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <h4 className="text-base md:text-xl font-bold text-zinc-100 tracking-tight">{role.title}</h4>
                    <span className="chip bg-indigo-500/5 border-indigo-500/20 text-indigo-400 px-3 py-1 text-[10px] md:text-xs">{role.period}</span>
                  </div>

                  {role.description && <div className="text-sm md:text-[1.05rem] leading-relaxed font-medium max-w-4xl text-zinc-400/90">{formatText(role.description)}</div>}

                  {role.points && role.points.length > 0 && (
                    <ul className="space-y-3 md:space-y-4">
                      {role.points.map((point, pIndex) => (
                        <li key={pIndex} className="flex gap-4 text-sm md:text-[0.95rem] leading-relaxed text-zinc-400/80 group/point">
                          <span className="shrink-0 mt-2 w-1.5 h-1.5 rounded-full bg-indigo-500/40 group-hover/point:bg-indigo-500 transition-colors" />
                          <div className="flex-1">
                            {formatText(point)}
                          </div>
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
                className="min-h-11 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-500 hover:text-indigo-400 transition-all hover:gap-3"
              >
                {isExpanded ? "Show less" : `Show ${roles.length - 1} more role${roles.length - 1 > 1 ? "s" : ""}`}
                <span className="text-lg">→</span>
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

  const responsibilities = [
    {
      id: "iiitians",
      organization: "IIITians Network",
      period: "Dec 2024 - Present • 1 yr 5 mos",
      socials: [
        { name: "Website", icon: FaGlobe, url: "https://iiitiansnetwork.com", color: "text-emerald-400" },
        { name: "LinkedIn", icon: FaLinkedin, url: "https://www.linkedin.com/company/iiitians-network/", color: "text-[#0A66C2]" },
        { name: "Instagram", icon: FaInstagram, url: "https://www.instagram.com/iiitians.network/", color: "text-[#E4405F]" },
      ],
      roles: [
        {
          title: "Vice President",
          period: "Feb 2026 - Present • 3 mos",
          description: "Leading initiatives and streamlining team coordination to support and grow a dynamic community of 30,000+ students.",
          points: [
            "Collaborating across verticals to ensure smooth execution of activities.",
            "Strengthening engagement and translating strategic ideas into impactful outcomes.",
            "Driving the overall growth and outreach of the network across IIITs.",
          ],
        },
        {
          title: "Lead - Social Media & Outreach team",
          period: "Jul 2025 - Feb 2026 • 8 mos",
          description: "Oversaw and maintained the online presence across multiple platforms to improve visibility.",
          points: [
            "Strengthened the network by building meaningful collaborations.",
            "Connecting students and communities across different IIITs through digital outreach.",
          ],
        },
        {
          title: "Member - Social Media & Outreach team",
          period: "Dec 2024 - Jul 2025 • 8 mos",
          description: "Managed and grew the official Instagram page through creative strategies.",
          points: [
            "Explored creative ways to increase reach and engagement.",
            "Collaborated with peers to achieve notable growth milestones.",
          ],
        },
      ],
      logoUrl: "/images/iiitians_white.png",
    },
    {
      id: "techknow",
      organization: "TechKnow | Technical Council, IIIT Kota",
      period: "Aug 2024 - Present • 1 yr 9 mos",
      socials: [
        { name: "Website", icon: FaGlobe, url: "#", color: "text-emerald-400" },
        { name: "LinkedIn", icon: FaLinkedin, url: "https://linkedin.com/company/techknow", color: "text-[#0A66C2]" },
        { name: "Instagram", icon: FaInstagram, url: "https://instagram.com/techknow", color: "text-[#E4405F]" },
      ],
      roles: [
        {
          title: "Senior General Secretary Executive",
          period: "Aug 2025 - Present • 9 mos",
          description: "Responsible for planning and managing technical events at IIIT Kota with clear coordination and delivery.",
          points: [
            "Guiding the junior team and maintaining communication with faculty and sponsors.",
            "Improving event management and execution quality.",
          ],
        },
        {
          title: "Junior Event Manager Executive",
          period: "Aug 2024 - Aug 2025 • 1 yr 1 mo",
          description: "Managed on-field event planning and team coordination for technical symposiums.",
          points: [
            "Ensured smooth execution and useful attendee experiences.",
            "Coordinated with cross-functional teams for logistics.",
          ],
        },
      ],
      logoUrl: "/images/techknow.jpg",
    },
    {
      id: "neon",
      organization: "Neon Cinematics",
      period: "Aug 2025 - Present",
      socials: [
        { name: "Website", icon: FaGlobe, url: "#", color: "text-emerald-400" },
        { name: "LinkedIn", icon: FaLinkedin, url: "#", color: "text-[#0A66C2]" },
        { name: "Instagram", icon: FaInstagram, url: "#", color: "text-[#E4405F]" },
      ],
      roles: [
        {
          title: "Co-Lead",
          period: "Aug 2025 - Present • 9 mos",
          description: "Guiding visual storytelling and cinematic presence for the college through creative leadership.",
          points: [
            "Mentoring the junior team in video editing, poster design, and cinematography.",
            "Capturing campus life through visuals that strengthen online presence.",
          ],
        },
      ],
      logoUrl: "/images/neon.jpg",
    },
    {
      id: "udbhav",
      organization: "UDBHAV - Inter IIIT Hackathon",
      period: "Jul 2025 - Feb 2026",
      socials: [
        { name: "Website", icon: FaGlobe, url: "#", color: "text-emerald-400" },
        { name: "LinkedIn", icon: FaLinkedin, url: "#", color: "text-[#0A66C2]" },
        { name: "Instagram", icon: FaInstagram, url: "#", color: "text-[#E4405F]" },
      ],
      roles: [
        {
          title: "Design Lead",
          period: "Jul 2025 - Feb 2026 • 8 mos",
          description: "Headed design for the first Inter IIIT Hackathon, keeping the event brand cohesive.",
          points: [
            "Guided and coordinated creative work throughout the event.",
            "Created posters, brochures, and visual branding for event communication.",
          ],
        },
      ],
      logoUrl: null,
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={containerRef} className="section-shell overflow-visible" id="responsibilities">
      <EditSectionButton href="/admin/responsibilities" label="Edit Responsibilities" />
      <div className="section-container relative z-10">
        <div className={`flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12 md:mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="space-y-4">
            <div className="section-kicker bg-indigo-500/10 border-indigo-500/20">
              <ShieldCheck size={16} className="text-indigo-400" />
              <span className="text-indigo-300">Experience Ledger</span>
            </div>
            <h2 className="section-title">
              Leadership <span className="relative inline-block">
                <span className="relative z-10 accent-text">roles.</span>
                <span className={`absolute -bottom-2 left-0 w-full h-1 bg-indigo-500/30 blur-sm transition-all duration-1000 ${isVisible ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"}`} style={{ transformOrigin: 'left' }} />
              </span>
            </h2>
          </div>
          <p className="section-copy max-w-sm lg:text-right">
            Organizational work, team coordination, and ownership beyond formal coursework.
          </p>
        </div>

        <div className="relative space-y-5 md:space-y-6">
          {responsibilities.map((item, index) => (
            <ResponsibilityItem
              key={item.id || index}
              index={index}
              organization={item.organization}
              period={item.period}
              roles={item.roles}
              logoUrl={item.logoUrl}
              organizationUrl={item.organizationUrl}
              socials={item.socials}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Responsibilities;
