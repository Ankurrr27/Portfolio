"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "../../../context/AdminContext";
import { Save, Plus, Trash2, Layers } from "lucide-react";
import AdminSectionCard from "../../../components/admin/AdminSectionCard";
import AdminField from "../../../components/admin/AdminField";
import AdminEntryShell from "../../../components/admin/AdminEntryShell";
import { SKILLS_DB } from "../../../lib/skills-db";
import { toast } from "sonner";

export default function AdminSkillsPage() {
  const { adminKey } = useAdmin();
  const [domains, setDomains] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSkills = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/admin/skills", { headers: { "x-admin-key": adminKey } });
        const data = await res.json();
        if (data.domains) setDomains(data.domains);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    if (adminKey) fetchSkills();
  }, [adminKey]);

  const handleSave = async () => {
    setIsLoading(true);
    const toastId = toast.loading("Saving skills configuration...");
    try {
      const orderedDomains = domains.map((d, index) => ({
        ...d,
        displayOrder: index,
      }));

      const res = await fetch("/api/admin/skills", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
        body: JSON.stringify({ domains: orderedDomains }),
      });
      if (res.ok) {
        toast.success("Skills updated successfully", { id: toastId });
      } else {
        throw new Error("Failed to save");
      }
    } catch (err) {
      toast.error(err.message, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const addDomain = () => {
    setDomains([...domains, { key: "new-domain", title: "New Domain", summary: "", displayOrder: domains.length, items: [] }]);
  };

  const setupDefaults = () => {
    setDomains([
      { key: "front", title: "Frontend Development", summary: "Building high-performance user interfaces.", displayOrder: 0, items: [] },
      { key: "back", title: "Backend & Infrastructure", summary: "Scalable server-side architectures.", displayOrder: 1, items: [] },
      { key: "lang", title: "Programming Languages", summary: "Core algorithmic foundations.", displayOrder: 2, items: [] },
      { key: "tools", title: "DevOps & Tooling", summary: "Engineering workflow optimization.", displayOrder: 3, items: [] }
    ]);
  };

  const removeDomain = (index) => {
    setDomains(domains.filter((_, i) => i !== index));
  };

  const updateDomain = (index, field, value) => {
    setDomains(domains.map((d, i) => i === index ? { ...d, [field]: value } : d));
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const next = [...domains];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    setDomains(next);
  };

  const moveDown = (index) => {
    if (index === domains.length - 1) return;
    const next = [...domains];
    [next[index + 1], next[index]] = [next[index], next[index + 1]];
    setDomains(next);
  };

  const addSkill = (domainIndex) => {
    const newDomains = [...domains];
    newDomains[domainIndex].items.push({ name: "", level: "Proficient", description: "", iconName: "", logoUrl: "", x: null, y: null });
    setDomains(newDomains);
  };

  const removeSkill = (domainIndex, skillIndex) => {
    const newDomains = [...domains];
    newDomains[domainIndex].items = newDomains[domainIndex].items.filter((_, i) => i !== skillIndex);
    setDomains(newDomains);
  };

  const updateSkill = (domainIndex, skillIndex, field, value) => {
    const newDomains = [...domains];
    newDomains[domainIndex].items[skillIndex][field] = value;
    setDomains(newDomains);
  };

  const SKILL_LIBRARY = Object.keys(SKILLS_DB).sort();

  const addFromLibrary = (domainIndex, skillName) => {
    const newDomains = [...domains];
    newDomains[domainIndex].items.push({ 
      name: skillName, 
      level: "Proficient",
      description: "",
      iconName: "",
      logoUrl: "",
      x: null,
      y: null
    });
    setDomains(newDomains);
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex items-center justify-between gap-6 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Skills
          </h1>
          <p className="mt-1 text-sm text-slate-500">Manage technical skills and domains.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={setupDefaults}
            className="px-4 py-2.5 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 font-medium text-sm flex items-center gap-2 hover:bg-orange-100 transition-colors"
          >
            <Layers size={16} /> Reset Defaults
          </button>
          <button
            onClick={addDomain}
            className="px-4 py-2.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-medium text-sm flex items-center gap-2 hover:bg-slate-200 transition-colors"
          >
            <Plus size={16} /> Add Domain
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium text-sm flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={16} />
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </header>

      <div className="space-y-8">
        {domains.map((domain, dIndex) => (
          <AdminEntryShell
            key={dIndex}
            title={domain.title || "New Domain"}
            subtitle={domain.key || "domain-id"}
            onRemove={() => removeDomain(dIndex)}
            onMoveUp={() => moveUp(dIndex)}
            onMoveDown={() => moveDown(dIndex)}
            isFirst={dIndex === 0}
            isLast={dIndex === domains.length - 1}
            className={
              domain.key === 'front' ? 'border-l-4 border-l-blue-500' :
              domain.key === 'back' ? 'border-l-4 border-l-emerald-500' :
              domain.key === 'lang' ? 'border-l-4 border-l-amber-500' :
              domain.key === 'tools' ? 'border-l-4 border-l-purple-500' : ''
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <AdminField 
                  label="Domain Key (id)"
                  value={domain.key}
                  onChange={(e) => updateDomain(dIndex, "key", e.target.value)}
                  placeholder="frontend, backend, etc."
                />
                <AdminField 
                  label="Title"
                  value={domain.title}
                  onChange={(e) => updateDomain(dIndex, "title", e.target.value)}
                  placeholder="Domain Name"
                />
                <AdminField 
                  label="Summary"
                  value={domain.summary}
                  onChange={(e) => updateDomain(dIndex, "summary", e.target.value)}
                  textarea
                  placeholder="Short description..."
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <label className="text-sm font-semibold text-slate-700">Skills List</label>
                  <div className="flex items-center gap-3">
                    <select 
                      onChange={(e) => {
                        if (e.target.value) {
                          addFromLibrary(dIndex, e.target.value);
                          e.target.value = "";
                        }
                      }}
                      className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:border-blue-500"
                    >
                      <option value="">+ From Library</option>
                      {SKILL_LIBRARY.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <button 
                      onClick={() => addSkill(dIndex)}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <Plus size={16} /> Add Skill
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {domain.items.map((skill, sIndex) => (
                    <div key={sIndex} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                      <div className="flex items-center gap-3">
                        <input 
                          type="text" 
                          value={skill.name}
                          onChange={(e) => updateSkill(dIndex, sIndex, "name", e.target.value)}
                          placeholder="Skill name"
                          className="flex-1 bg-white px-3 py-1.5 rounded border border-slate-200 text-sm text-slate-900 focus:border-blue-500 outline-none"
                        />
                        <input 
                          type="text" 
                          value={skill.level || ""}
                          onChange={(e) => updateSkill(dIndex, sIndex, "level", e.target.value)}
                          placeholder="Level"
                          className="w-24 bg-white px-3 py-1.5 rounded border border-slate-200 text-xs text-slate-500 font-medium text-right focus:border-blue-500 outline-none"
                        />
                        <button onClick={() => removeSkill(dIndex, sIndex)} className="text-red-500 hover:text-red-600 p-1">
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <textarea
                        value={skill.description || ""}
                        onChange={(e) => updateSkill(dIndex, sIndex, "description", e.target.value)}
                        placeholder="Brief description or key tools..."
                        className="w-full bg-white px-3 py-2 rounded border border-slate-200 text-xs text-slate-600 focus:border-blue-500 outline-none resize-none h-16"
                      />
                      <input 
                        type="text" 
                        value={skill.logoUrl || ""}
                        onChange={(e) => updateSkill(dIndex, sIndex, "logoUrl", e.target.value)}
                        placeholder="Logo URL (optional)"
                        className="w-full bg-white px-3 py-1.5 rounded border border-slate-200 text-xs text-slate-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AdminEntryShell>
        ))}
      </div>
    </div>
  );
}
