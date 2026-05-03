"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "../../../context/AdminContext";
import { Save, AlertCircle, Plus, Briefcase, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import AdminEntryShell from "../../../components/admin/AdminEntryShell";
import AdminField from "../../../components/admin/AdminField";
import AdminImageUpload from "../../../components/admin/AdminImageUpload";

export default function AdminResponsibilitiesPage() {
  const { adminKey } = useAdmin();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [responsibilities, setResponsibilities] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/admin/responsibilities", {
          headers: { "x-admin-key": adminKey },
          cache: "no-store",
        });
        const data = await res.json();

        if (res.ok) {
          setResponsibilities(data.responsibilities || []);
        }
      } catch (error) {
        console.error("Failed to load responsibilities", error);
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
      const response = await fetch("/api/admin/responsibilities", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({ responsibilities }),
      });

      if (response.ok) {
        setStatus("Responsibilities updated.");
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

  const addResponsibility = () => {
    setResponsibilities([
      {
        organization: "",
        period: "",
        logoUrl: "",
        featured: true,
        displayOrder: 0,
        roles: [
          { title: "", period: "", description: "", points: [] }
        ]
      },
      ...responsibilities
    ]);
  };

  const updateField = (index, field, value) => {
    setResponsibilities(responsibilities.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const addRole = (resIndex) => {
    const newResponsibilities = [...responsibilities];
    newResponsibilities[resIndex].roles.push({ title: "", period: "", description: "", points: [] });
    setResponsibilities(newResponsibilities);
  };

  const updateRoleField = (resIndex, roleIndex, field, value) => {
    const newResponsibilities = [...responsibilities];
    newResponsibilities[resIndex].roles[roleIndex][field] = value;
    setResponsibilities(newResponsibilities);
  };

  const removeRole = (resIndex, roleIndex) => {
    const newResponsibilities = [...responsibilities];
    newResponsibilities[resIndex].roles = newResponsibilities[resIndex].roles.filter((_, i) => i !== roleIndex);
    setResponsibilities(newResponsibilities);
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex items-center justify-between gap-6 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Responsibilities
          </h1>
          <p className="mt-1 text-sm text-slate-500">Manage your leadership roles and career journey.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={addResponsibility}
            className="px-4 py-2.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-medium text-sm flex items-center gap-2 hover:bg-slate-200 transition-colors"
          >
            <Plus size={16} /> Add Organization
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium text-sm flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={16} />
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </header>

      {status && (
        <div className={`p-4 rounded-lg flex items-center gap-3 text-sm font-medium border ${status.includes("updated") ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"}`}>
          <AlertCircle size={18} />
          {status}
        </div>
      )}

      <div className="space-y-10">
        {responsibilities.map((item, index) => (
          <AdminEntryShell
            key={index}
            title={item.organization || "New Organization"}
            subtitle={item.period || "Time Period"}
            onRemove={() => setResponsibilities(responsibilities.filter((_, i) => i !== index))}
            onMoveUp={() => {
              if (index === 0) return;
              const next = [...responsibilities];
              [next[index - 1], next[index]] = [next[index], next[index - 1]];
              setResponsibilities(next);
            }}
            onMoveDown={() => {
              if (index === responsibilities.length - 1) return;
              const next = [...responsibilities];
              [next[index + 1], next[index]] = [next[index], next[index + 1]];
              setResponsibilities(next);
            }}
            isFirst={index === 0}
            isLast={index === responsibilities.length - 1}
          >
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-3">
                  <AdminImageUpload 
                    label="Org Logo"
                    currentImage={item.logoUrl}
                    onUploadSuccess={(url) => updateField(index, "logoUrl", url)}
                  />
                </div>
                <div className="md:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AdminField
                    label="Organization Name"
                    value={item.organization || ""}
                    onChange={(e) => updateField(index, "organization", e.target.value)}
                  />
                  <AdminField
                    label="Overall Period"
                    value={item.period || ""}
                    onChange={(e) => updateField(index, "period", e.target.value)}
                    placeholder="e.g. Aug 2024 - Present"
                  />
                  <AdminField
                    label="LinkedIn/Organization URL"
                    value={item.organizationUrl || ""}
                    onChange={(e) => updateField(index, "organizationUrl", e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
              </div>

              {/* Roles Journey Section */}
              <div className="border-t border-slate-100 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Briefcase size={16} className="text-indigo-500" />
                    Roles Journey
                  </h4>
                  <button
                    onClick={() => addRole(index)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                  >
                    <Plus size={14} /> Add Role
                  </button>
                </div>

                <div className="space-y-6">
                  {item.roles.map((role, roleIndex) => (
                    <div key={roleIndex} className="p-4 rounded-xl bg-slate-50 border border-slate-200 relative group/role">
                      <button
                        onClick={() => removeRole(index, roleIndex)}
                        className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 transition-colors opacity-0 group-hover/role:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AdminField
                          label="Role Title"
                          value={role.title || ""}
                          onChange={(e) => updateRoleField(index, roleIndex, "title", e.target.value)}
                          compact
                        />
                        <AdminField
                          label="Role Period"
                          value={role.period || ""}
                          onChange={(e) => updateRoleField(index, roleIndex, "period", e.target.value)}
                          compact
                        />
                        <div className="md:col-span-2">
                          <AdminField
                            label="Role Description"
                            value={role.description || ""}
                            onChange={(e) => updateRoleField(index, roleIndex, "description", e.target.value)}
                            textarea
                            compact
                          />
                        </div>
                        <div className="md:col-span-2">
                          <AdminField
                            label="Points (Comma separated)"
                            value={Array.isArray(role.points) ? role.points.join(", ") : ""}
                            onChange={(e) => updateRoleField(index, roleIndex, "points", e.target.value.split(",").map(p => p.trim()))}
                            textarea
                            compact
                            placeholder="Bullet points separated by commas..."
                          />
                        </div>
                      </div>
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
