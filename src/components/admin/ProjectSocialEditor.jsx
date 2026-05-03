import React, { useState } from "react";
import { Plus, Trash2, Globe, Share2, Save, Loader2 } from "lucide-react";
import { 
  FaInstagram, 
  FaDiscord, 
  FaFacebook, 
  FaLinkedin, 
  FaYoutube, 
  FaTelegram, 
  FaThreads, 
  FaXTwitter 
} from "react-icons/fa6";
import { useAdmin } from "../../context/AdminContext";

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

export default function ProjectSocialEditor({ project, onSaved }) {
  const { adminKey } = useAdmin();
  const [links, setLinks] = useState(project.socialLinks || []);
  const [isSaving, setIsSaving] = useState(false);

  const addLink = () => {
    setLinks([...links, { platform: "instagram", url: "" }]);
  };

  const removeLink = (index) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const updateLink = (index, field, value) => {
    const next = [...links];
    next[index][field] = value;
    setLinks(next);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/admin/projects", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({
          slug: project.slug,
          socialLinks: links,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (onSaved) onSaved(data.project);
      }
    } catch (error) {
      console.error("Failed to save social links:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
          <Share2 size={16} className="text-indigo-500" />
          Social Hub & Community Links
        </h4>
        <button
          onClick={addLink}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded-md"
        >
          <Plus size={14} /> Add Link
        </button>
      </div>

      <div className="space-y-3">
        {links.length > 0 ? (
          links.map((link, index) => {
            const PlatformIcon = PLATFORMS.find(p => p.id === link.platform)?.icon || Share2;
            return (
              <div key={index} className="flex items-center gap-3 group">
                <div className="relative">
                  <select
                    value={link.platform}
                    onChange={(e) => updateLink(index, "platform", e.target.value)}
                    className="appearance-none bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-8 py-2 text-sm focus:bg-white focus:border-indigo-500 outline-none transition-colors font-medium text-slate-700"
                  >
                    {PLATFORMS.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <PlatformIcon size={14} />
                  </div>
                </div>

                <input
                  type="url"
                  placeholder="Paste platform URL here..."
                  value={link.url}
                  onChange={(e) => updateLink(index, "url", e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:bg-white focus:border-indigo-500 outline-none transition-colors"
                />

                <button
                  onClick={() => removeLink(index)}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })
        ) : (
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 text-center">
            <p className="text-xs text-slate-400 italic">No community links added yet.</p>
          </div>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50"
        >
          {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          Save Social Links
        </button>
      </div>
    </div>
  );
}
