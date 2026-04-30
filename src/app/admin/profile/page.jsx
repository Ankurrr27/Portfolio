"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAdmin } from "../../../context/AdminContext";
import { Save, AlertCircle, User, Mail, MapPin } from "lucide-react";
import { 
  FaGithub, 
  FaLinkedin, 
  FaInstagram, 
  FaDiscord, 
  FaFacebook, 
  FaYoutube, 
  FaTelegram, 
  FaThreads, 
  FaXTwitter 
} from "react-icons/fa6";
import { profileContent as staticProfile } from "../../../data/profile";
import { Plus, Trash2, Globe, Share2 } from "lucide-react";

const PLATFORMS = [
  { id: "instagram", name: "Instagram", icon: FaInstagram },
  { id: "discord", name: "Discord", icon: FaDiscord },
  { id: "threads", name: "Threads", icon: FaThreads },
  { id: "linkedin", name: "LinkedIn", icon: FaLinkedin },
  { id: "twitter", name: "X / Twitter", icon: FaXTwitter },
  { id: "youtube", name: "YouTube", icon: FaYoutube },
  { id: "telegram", name: "Telegram", icon: FaTelegram },
  { id: "facebook", name: "Facebook", icon: FaFacebook },
  { id: "website", name: "Website", icon: Globe },
];

export default function AdminProfilePage() {
  const { adminKey } = useAdmin();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingLanyard, setIsUploadingLanyard] = useState(false);
  const [lanyardPreviewUrl, setLanyardPreviewUrl] = useState("");
  const [status, setStatus] = useState("");
  const [profile, setProfile] = useState({ ...staticProfile, socialLinks: [] });

  // ... (rest of the logic remains same until return)
  // ... (keeping useEffects and handlers)

  useEffect(() => {
    const controller = new AbortController();
    
    const loadData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/admin/profile", {
          headers: { "x-admin-key": adminKey },
          cache: "no-store",
          signal: controller.signal
        });
        const data = await res.json();

        if (res.ok && data.profile) {
          setProfile(data.profile);
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error("Failed to load profile:", error);
          toast.error("Database connection slow. Retrying...");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (adminKey) loadData();
    return () => controller.abort();
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

  const addSocialLink = () => {
    const nextLinks = [...(profile.socialLinks || []), { platform: "instagram", url: "" }];
    updateField("socialLinks", nextLinks);
  };

  const removeSocialLink = (index) => {
    const nextLinks = (profile.socialLinks || []).filter((_, i) => i !== index);
    updateField("socialLinks", nextLinks);
  };

  const updateSocialLink = (index, field, value) => {
    const nextLinks = [...(profile.socialLinks || [])];
    nextLinks[index][field] = value;
    updateField("socialLinks", nextLinks);
  };

  useEffect(() => {
    return () => {
      if (lanyardPreviewUrl) URL.revokeObjectURL(lanyardPreviewUrl);
    };
  }, [lanyardPreviewUrl]);

  const handleLanyardUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (lanyardPreviewUrl) URL.revokeObjectURL(lanyardPreviewUrl);
    const previewUrl = URL.createObjectURL(file);
    setLanyardPreviewUrl(previewUrl);
    setIsUploadingLanyard(true);

    const toastId = toast.loading("Uploading lanyard photo...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      console.debug("Lanyard upload: file selected", {
        name: file.name,
        size: file.size,
        type: file.type,
      });

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          "x-admin-key": adminKey,
        },
        body: formData,
      });

      const data = await res.json();
      const uploadedUrl = data.url || data.secure_url;

      console.debug("Lanyard upload: API response", {
        ok: res.ok,
        uploadedUrl,
        data,
      });

      if (!res.ok || !uploadedUrl) {
        throw new Error(data.error || "Upload failed");
      }

      updateField("lanyardImageUrl", uploadedUrl);
      setLanyardPreviewUrl("");
      toast.success("Photo uploaded. Save profile to publish it.", { id: toastId });
    } catch (err) {
      toast.error("Upload failed: " + err.message, { id: toastId });
    } finally {
      setIsUploadingLanyard(false);
      event.target.value = "";
    }
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
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold syne tracking-tight uppercase text-slate-900">Global Social Hub</h3>
              <button
                onClick={addSocialLink}
                className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded-md transition-all"
              >
                <Plus size={12} /> Add Platform
              </button>
            </div>
            
            <p className="text-[10px] text-slate-500 font-medium">These links will appear in your website footer and contact sections.</p>

            <div className="space-y-4">
              {(profile.socialLinks || []).map((link, index) => {
                const PlatformIcon = PLATFORMS.find(p => p.id === link.platform)?.icon || Share2;
                return (
                  <div key={index} className="flex items-center gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="relative shrink-0">
                      <select
                        value={link.platform}
                        onChange={(e) => updateSocialLink(index, "platform", e.target.value)}
                        className="appearance-none bg-slate-50 border border-slate-100 rounded-xl pl-8 pr-6 py-2 text-[10px] font-bold uppercase tracking-widest focus:bg-white focus:border-indigo-500/50 outline-none transition-all text-slate-700"
                      >
                        {PLATFORMS.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                      <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                        <PlatformIcon size={12} />
                      </div>
                    </div>

                    <input
                      type="url"
                      placeholder="Platform URL..."
                      value={link.url}
                      onChange={(e) => updateSocialLink(index, "url", e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs focus:bg-white focus:border-indigo-500/50 outline-none transition-all"
                    />

                    <button
                      onClick={() => removeSocialLink(index)}
                      className="p-2 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}

              {(profile.socialLinks || []).length === 0 && (
                <div className="py-8 text-center border border-slate-100 border-dashed rounded-2xl bg-slate-50/50">
                  <Share2 size={24} className="mx-auto text-slate-200 mb-2" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No social links added yet</p>
                </div>
              )}
            </div>
          </div>

          <div className="p-8 rounded-[2rem] border border-slate-200 bg-white shadow-sm space-y-6">
            <h3 className="text-sm font-bold syne tracking-tight uppercase text-slate-900">Developer IDs</h3>
            <div className="space-y-4">
              {[
                { label: "GitHub URL", key: "githubUrl" },
                { label: "LinkedIn URL", key: "linkedinUrl" },
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
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1">College Name</label>
                <input
                  type="text"
                  value={profile.college || ""}
                  onChange={(e) => updateField("college", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:border-indigo-500/50 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1">Qualification / Degree</label>
                <input
                  type="text"
                  value={profile.qualification || ""}
                  onChange={(e) => updateField("qualification", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:border-indigo-500/50 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1">Lanyard Photo</label>
                <div className="flex flex-col gap-4">
                  {lanyardPreviewUrl || profile.lanyardImageUrl || profile.profileImageUrl ? (
                    <div className="relative w-full aspect-square max-w-[200px] mx-auto rounded-2xl overflow-hidden border border-slate-100 group">
                      <img 
                        src={lanyardPreviewUrl || profile.lanyardImageUrl || profile.profileImageUrl} 
                        alt="Lanyard" 
                        className="w-full h-full object-cover"
                        onError={(event) => {
                          if (event.currentTarget.src !== window.location.origin + staticProfile.profileImageUrl) {
                            event.currentTarget.src = staticProfile.profileImageUrl;
                          } else {
                            event.currentTarget.style.display = "none";
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                         <span className="text-[10px] text-white font-bold">
                           {isUploadingLanyard ? "UPLOADING..." : "CURRENT PREVIEW"}
                         </span>
                      </div>
                    </div>
                  ) : null}
                  
                  <div className="relative">
                    <input
                      id="lanyard-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      disabled={isUploadingLanyard}
                      onChange={handleLanyardUpload}
                    />
                    <label 
                      htmlFor="lanyard-upload"
                      className="flex items-center justify-center gap-2 w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 rounded-xl px-4 py-3 text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                      Click to Upload Photo
                    </label>
                  </div>
                </div>
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
