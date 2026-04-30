import React, { useEffect, useState } from "react";
import { ArrowRight, ExternalLink, Globe, Share2 } from "lucide-react";
import {
  FaDiscord,
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaTelegram,
  FaThreads,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import MagneticButton from "./MagneticButton";

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
  return <Icon size={18} />;
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
      <footer className="section-shell py-12">
        <div className="section-container flex flex-col items-start gap-4 animate-pulse">
          <div className="w-24 h-4 bg-zinc-900 rounded-full" />
          <div className="w-48 h-10 bg-zinc-900 rounded-lg" />
        </div>
      </footer>
    );
  }

  const p = profile || {};

  return (
    <footer className="section-shell py-12 text-white">
      <div className="section-container">
        <div className="panel mb-10 md:mb-12 p-5 md:p-10">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 md:gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="section-kicker">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                Available for collaboration
              </div>
              <h2 className="section-title">
                Let&apos;s build something <span className="accent-text">clear and useful.</span>
              </h2>
              <p className="section-copy">
                I care about reliable systems, clean interfaces, and engineering decisions that hold up beyond the first demo.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
              <MagneticButton>
                <a href={`mailto:${p.email || ""}`} className="primary-button group">
                  Contact <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </MagneticButton>

              <div className="flex items-center gap-2 flex-wrap">
                {p.socialLinks && p.socialLinks.length > 0 ? (
                  p.socialLinks.slice(0, 5).map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 rounded-md border border-zinc-800 bg-zinc-950 text-zinc-500 hover:text-white hover:border-orange-500/50 transition-colors flex items-center justify-center"
                      title={link.platform}
                    >
                      <SocialIcon platform={link.platform} />
                    </a>
                  ))
                ) : (
                  <>
                    <a href={p.githubUrl || "#"} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-md border border-zinc-800 bg-zinc-950 text-zinc-500 hover:text-white hover:border-orange-500/50 transition-colors flex items-center justify-center">
                      <FaGithub size={18} />
                    </a>
                    <a href={p.linkedinUrl || "#"} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-md border border-zinc-800 bg-zinc-950 text-zinc-500 hover:text-white hover:border-orange-500/50 transition-colors flex items-center justify-center">
                      <FaLinkedin size={18} />
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-10 border-t border-zinc-900">
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white">{p.fullName || "Engineer"}</span>
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            </div>
            <p className="section-copy max-w-sm">
              Engineering resilient digital infrastructure and high-performance user experiences. Based in {(p.location || "Earth").split("•")[0]}.
            </p>
          </div>

          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Navigation</h4>
              <ul className="space-y-2">
                {["Home", "Projects", "Achievements", "Skills"].map((link) => (
                  <li key={link}>
                    <a href={`#${link.toLowerCase()}`} className="text-zinc-500 hover:text-orange-500 transition-colors text-sm font-medium">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Connect</h4>
              <ul className="space-y-2">
                <li>
                  <a href={p.resumeUrl || "#"} className="text-zinc-500 hover:text-orange-500 transition-colors text-sm font-medium flex items-center gap-1.5">
                    Resume <ExternalLink size={12} />
                  </a>
                </li>
                <li>
                  <a href="/admin" className="text-zinc-500 hover:text-orange-500 transition-colors text-sm font-medium">
                    Admin Portal
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Stats</h4>
              <div className="space-y-1">
                <span className="block text-zinc-600 text-xs font-semibold uppercase tracking-wide">Total Visits</span>
                <span className="text-zinc-300 text-sm font-bold">{totalViews.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-6 mt-8 border-t border-zinc-900">
          <p className="text-zinc-600 text-xs font-semibold uppercase tracking-wide">
            © {currentYear} • {p.fullName || "Admin"}
          </p>
          <span className="text-zinc-700 text-xs font-semibold uppercase tracking-wide">Built with precision</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
