"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "../../../context/AdminContext";
import { Save, AlertCircle, User, Mail, MapPin } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { profileContent as staticProfile } from "../../../data/profile";

export default function AdminProfilePage() {
  const { adminKey } = useAdmin();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [profile, setProfile] = useState(staticProfile);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/admin/profile", {
          headers: { "x-admin-key": adminKey },
          cache: "no-store",
        });
        const data = await res.json();

        if (res.ok && data.profile) {
          setProfile(data.profile);
        }
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (adminKey) loadData();
  }, [adminKey]);

  const handleSave = async () => {
    setIsLoading(true);
    setStatus("");
    try {
      const response = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({ profile }),
      });

      if (response.ok) {
        setStatus("Profile updated.");
      } else {
        const data = await response.json();
        throw new Error(data.error || "Save failed");
      }
    } catch (error) {
      setStatus(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <p className="text-indigo-600 font-bold mono text-[10px] uppercase tracking-[0.4em] mb-2 px-1">Identity</p>
          <h1 className="text-3xl font-extrabold syne tracking-tighter uppercase text-slate-900">
            Profile
          </h1>
        </div>

        <button
          onClick={handleSave}
          disabled={isLoading}
          className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
        >
          <Save size={16} />
          {isLoading ? "Saving..." : "Save Profile"}
        </button>
      </header>

      {status && (
        <div className={`p-4 rounded-xl flex items-center gap-3 text-xs font-bold ${status.includes("updated") ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100"}`}>
          <AlertCircle size={16} />
          {status}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="p-8 rounded-[2rem] border border-slate-200 bg-white shadow-sm space-y-6">
            <h3 className="text-sm font-bold syne tracking-tight uppercase text-slate-900">Basics</h3>
            <div className="space-y-4">
              {[
                { label: "Full Name", key: "fullName", icon: User },
                { label: "Email", key: "email", icon: Mail },
                { label: "Location", key: "location", icon: MapPin },
                { label: "CGPA (Optional)", key: "cgpa", icon: User },
              ].map(field => (
                <div key={field.key} className="space-y-2">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                    <field.icon size={10} /> {field.label}
                  </label>
                  <input
                    type="text"
                    value={profile[field.key] || ""}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:border-indigo-500/50 outline-none transition-all"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-8 rounded-[2rem] border border-slate-200 bg-white shadow-sm space-y-6">
            <h3 className="text-sm font-bold syne tracking-tight uppercase text-slate-900">Narrative</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1">Headline</label>
                <textarea
                  value={profile.headline || ""}
                  onChange={(e) => updateField("headline", e.target.value)}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:border-indigo-500/50 outline-none transition-all resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1">Bio</label>
                <textarea
                  value={profile.bio || ""}
                  onChange={(e) => updateField("bio", e.target.value)}
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:border-indigo-500/50 outline-none transition-all resize-none"
                />
              </div>
            </div>
          </div>

          <div className="p-8 rounded-[2rem] border border-slate-200 bg-white shadow-sm space-y-6">
            <h3 className="text-sm font-bold syne tracking-tight uppercase text-slate-900">Links & Profiles</h3>
            <div className="space-y-4">
              {[
                { label: "LinkedIn URL", key: "linkedinUrl" },
                { label: "GitHub URL", key: "githubUrl" },
                { label: "LeetCode URL", key: "leetcodeUrl" },
                { label: "GFG URL", key: "geeksforgeeksUrl" },
              ].map(field => (
                <div key={field.key} className="space-y-2">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    value={profile[field.key] || ""}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:border-indigo-500/50 outline-none transition-all"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* New Section for Preferences & Custom Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8">
        <div className="space-y-6">
          <div className="p-8 rounded-[2rem] border border-slate-200 bg-white shadow-sm space-y-6">
            <h3 className="text-sm font-bold syne tracking-tight uppercase text-slate-900">Display Limits</h3>
            <p className="text-xs text-slate-500 mb-4">Set the maximum number of items to display on the public frontend.</p>
            <div className="space-y-4">
              {[
                { label: "Max Projects to Show", key: "maxProjects", type: "number" },
                { label: "Max Achievements to Show", key: "maxAchievements", type: "number" },
                { label: "Max Gallery Photos", key: "maxGalleryPhotos", type: "number" },
                { label: "Lanyard Accent Color", key: "lanyardColor", type: "color" },
              ].map(field => (
                <div key={field.key} className="space-y-2">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1">
                    {field.label}
                  </label>
                  <div className="flex gap-3">
                    <input
                      type={field.type}
                      value={profile[field.key] || (field.type === 'color' ? '#f97316' : "")}
                      onChange={(e) => updateField(field.key, field.type === "number" ? parseInt(e.target.value) || 0 : e.target.value)}
                      className={`${field.type === 'color' ? 'w-12 h-10 p-1' : 'w-full'} bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:border-indigo-500/50 outline-none transition-all`}
                    />
                    {field.type === 'color' && (
                      <input 
                        type="text"
                        value={profile[field.key] || "#f97316"}
                        onChange={(e) => updateField(field.key, e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs outline-none"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-8 rounded-[2rem] border border-slate-200 bg-white shadow-sm space-y-6">
            <h3 className="text-sm font-bold syne tracking-tight uppercase text-slate-900">Lanyard Settings</h3>
            <p className="text-xs text-slate-500 mb-4">Configure your 3D Interactive Identity Card.</p>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs font-bold text-slate-700">Show Lanyard</span>
                <button
                  onClick={() => updateField("showLanyard", !profile.showLanyard)}
                  className={`w-12 h-6 rounded-full transition-all relative ${profile.showLanyard ? 'bg-indigo-600' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${profile.showLanyard ? 'right-1' : 'left-1'}`} />
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1">Lanyard Accent Color</label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={profile.lanyardColor || "#f97316"}
                    onChange={(e) => updateField("lanyardColor", e.target.value)}
                    className="w-12 h-10 p-1 bg-slate-50 border border-slate-100 rounded-xl outline-none"
                  />
                  <input 
                    type="text"
                    value={profile.lanyardColor || "#f97316"}
                    onChange={(e) => updateField("lanyardColor", e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1">Card Image Override (URL)</label>
                <input
                  type="text"
                  placeholder="Defaults to profile image"
                  value={profile.lanyardImageUrl || ""}
                  onChange={(e) => updateField("lanyardImageUrl", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:border-indigo-500/50 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="p-8 rounded-[2rem] border border-slate-200 bg-white shadow-sm space-y-6">
            <h3 className="text-sm font-bold syne tracking-tight uppercase text-slate-900">Cached Coding Stats</h3>
            <p className="text-xs text-slate-500 mb-4">Fallback values used if the LeetCode or GFG APIs fail to respond.</p>
            <div className="space-y-4">
              {[
                { label: "LeetCode Solved (Fallback)", key: "leetcodeSolved" },
                { label: "GFG Solved (Fallback)", key: "gfgSolved" },
              ].map(field => (
                <div key={field.key} className="space-y-2">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    value={profile[field.key] || ""}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:border-indigo-500/50 outline-none transition-all"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
