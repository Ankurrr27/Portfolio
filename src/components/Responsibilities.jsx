"use client";

import React, { useEffect, useRef, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { FaInstagram, FaLinkedin, FaTwitter, FaGlobe } from "react-icons/fa";
import EditSectionButton from "./admin/EditSectionButton";

const ResponsibilityItem = ({ organization, period, isVisible, index, logoUrl, roles, organizationUrl, socials }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayRoles = isExpanded ? roles : [roles[0]];
  const hasMore = roles.length > 1;

  return (
    <div
      className={`panel w-full overflow-hidden transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="flex flex-col w-full">
        {/* Card Header ("Navbar" style) */}
        <div className="flex flex-row items-center justify-between gap-3 border-b border-zinc-800/50 bg-zinc-950/50 p-4 md:px-8 md:py-6">
          <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
            <div className="shrink-0">
              {logoUrl ? (
                <img src={logoUrl} alt={organization} className="w-10 h-10 md:w-14 md:h-14 object-contain opacity-90 rounded-lg" />
              ) : (
                <div className="icon-box flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-lg bg-zinc-900 border border-zinc-800">
                  <ShieldCheck size={18} className="text-zinc-400" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base md:text-2xl font-bold tracking-tight leading-tight text-white truncate md:whitespace-normal">
                {organization}
              </h3>
              <p className="mt-0.5 text-[9px] md:text-xs font-bold uppercase tracking-widest text-zinc-500 truncate md:whitespace-normal opacity-80">
                {period}
              </p>
            </div>
          </div>

          {/* Social Handles */}
          {socials && socials.length > 0 && (
            <div className="flex items-center gap-1.5 md:gap-3 shrink-0">
              {socials.map((social, idx) => {
                const Icon = social.icon;
                return (
                  <a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-1.5 md:p-2 rounded-full bg-zinc-900/80 border border-zinc-800 transition-all hover:scale-110 hover:bg-zinc-800 hover:border-zinc-700 ${social.color || 'text-zinc-400'}`}
                    aria-label={social.name}
                  >
                    <Icon size={14} className="md:w-5 md:h-5" />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {/* Roles / Posts Section */}
        <div className="p-5 md:p-8">
          <div className="relative space-y-6 md:space-y-8 pl-5 md:pl-6">
            {roles.length > 1 && <div className="absolute left-[7px] top-2 bottom-2 w-px bg-zinc-800" />}

            {displayRoles.map((role, rIndex) => (
              <div key={rIndex} className="relative animate-in fade-in slide-in-from-top-2 duration-200">
                <div className={`absolute -left-[19px] md:-left-[23px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-zinc-950 ${rIndex === 0 ? "bg-orange-500" : "bg-zinc-700"}`} />

                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h4 className="text-[15px] md:text-lg font-semibold text-zinc-100">{role.title}</h4>
                    <span className="chip">{role.period}</span>
                  </div>

                  {role.description && <p className="text-sm md:text-base leading-relaxed font-medium max-w-3xl text-zinc-400">{role.description}</p>}

                  {role.points && role.points.length > 0 && (
                    <ul className="space-y-2">
                      {role.points.map((point, pIndex) => (
                        <li key={pIndex} className="flex gap-3 text-sm leading-relaxed text-zinc-400">
                          <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-500/60" />
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
                className="min-h-11 text-xs font-semibold uppercase tracking-wide text-orange-500 hover:text-orange-400 transition-colors"
              >
                {isExpanded ? "Show less" : `Show ${roles.length - 1} more role${roles.length - 1 > 1 ? "s" : ""}`}
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
      { threshold: 0.05, rootMargin: "50px" }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={containerRef} className="section-shell overflow-visible" id="responsibilities">
      <EditSectionButton href="/admin/responsibilities" label="Edit Responsibilities" />
      <div className="section-container relative z-10">
        <div className={`flex flex-col md:flex-row justify-between items-start md:items-end gap-5 md:gap-6 mb-10 md:mb-14 transition-all duration-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div className="space-y-4">
            <div className="section-kicker">
              <ShieldCheck size={16} className="text-orange-500" />
              <span>Responsibilities</span>
            </div>
            <h2 className="section-title">
              Leadership <span className="accent-text">roles.</span>
            </h2>
          </div>
          <p className="section-copy max-w-sm md:text-right">
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
