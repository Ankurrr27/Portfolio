"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "../../../context/AdminContext";
import { Save, AlertCircle, Plus, Trash2, Layers } from "lucide-react";
import AdminSectionCard from "../../../components/admin/AdminSectionCard";
import AdminField from "../../../components/admin/AdminField";
import AdminEntryShell from "../../../components/admin/AdminEntryShell";

export default function AdminSkillsPage() {
  const { adminKey } = useAdmin();
  const [domains, setDomains] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");

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
    setStatus("");
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
      if (res.ok) setStatus("Skills updated successfully.");
      else throw new Error("Failed to save");
    } catch (err) {
      setStatus(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const addDomain = () => {
    setDomains([...domains, { key: "new-domain", title: "New Domain", summary: "", displayOrder: domains.length, items: [] }]);
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
    newDomains[domainIndex].items.push({ name: "", level: "Proficient" });
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

      {status && (
        <div className={`p-4 rounded-lg flex items-center gap-3 text-sm font-medium border ${status.includes("successfully") ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"}`}>
          <AlertCircle size={18} />
          {status}
        </div>
      )}

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
                  <button 
                    onClick={() => addSkill(dIndex)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Plus size={16} /> Add Skill
                  </button>
                </div>
                
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {domain.items.map((skill, sIndex) => (
                    <div key={sIndex} className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <input 
                        type="text" 
                        value={skill.name}
                        onChange={(e) => updateSkill(dIndex, sIndex, "name", e.target.value)}
                        placeholder="Skill name"
                        className="flex-1 bg-transparent border-none outline-none text-sm text-slate-900 placeholder:text-slate-400"
                      />
                      <input 
                        type="text" 
                        value={skill.level || ""}
                        onChange={(e) => updateSkill(dIndex, sIndex, "level", e.target.value)}
                        placeholder="Level"
                        className="w-24 bg-transparent border-none outline-none text-xs text-slate-500 font-medium text-right"
                      />
                      <button onClick={() => removeSkill(dIndex, sIndex)} className="text-red-500 hover:text-red-600 p-1">
                        <Trash2 size={16} />
                      </button>
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
