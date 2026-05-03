"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "../../../context/AdminContext";
import { Save, AlertCircle, Plus, GraduationCap, Image as ImageIcon } from "lucide-react";
import AdminEntryShell from "../../../components/admin/AdminEntryShell";
import AdminField from "../../../components/admin/AdminField";
import AdminImageUpload from "../../../components/admin/AdminImageUpload";

export default function AdminEducationPage() {
  const { adminKey } = useAdmin();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [education, setEducation] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/admin/education", {
          headers: { "x-admin-key": adminKey },
          cache: "no-store",
        });
        const data = await res.json();

        if (res.ok) {
          setEducation(data.education || []);
        }
      } catch (error) {
        console.error("Failed to load education", error);
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
      const orderedEducation = education.map((item, index) => ({
        ...item,
        displayOrder: index,
      }));

      const response = await fetch("/api/admin/education", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({ education: orderedEducation }),
      });

      if (response.ok) {
        setStatus("Education updated.");
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

  const addEducation = () => {
    setEducation([
      {
        institution: "",
        degree: "",
        period: "",
        detail: "",
        skills: "",
        description: "",
        imageUrl: "",
        displayOrder: 0
      },
      ...education
    ]);
  };

  const updateField = (index, field, value) => {
    setEducation(education.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex items-center justify-between gap-6 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Education
          </h1>
          <p className="mt-1 text-sm text-slate-500">Manage your academic background and skills.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={addEducation}
            className="px-4 py-2.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-medium text-sm flex items-center gap-2 hover:bg-slate-200 transition-colors"
          >
            <Plus size={16} /> Add Entry
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

      <div className="space-y-6">
        {education.map((item, index) => (
          <AdminEntryShell
            key={index}
            title={item.institution || "New Education"}
            subtitle={item.degree || "Degree Detail"}
            onRemove={() => setEducation(education.filter((_, i) => i !== index))}
            onMoveUp={() => {
              if (index === 0) return;
              const next = [...education];
              [next[index - 1], next[index]] = [next[index], next[index - 1]];
              setEducation(next);
            }}
            onMoveDown={() => {
              if (index === education.length - 1) return;
              const next = [...education];
              [next[index + 1], next[index]] = [next[index], next[index + 1]];
              setEducation(next);
            }}
            isFirst={index === 0}
            isLast={index === education.length - 1}
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-4 lg:col-span-3">
                <AdminImageUpload 
                  label="Institution Logo"
                  currentImage={item.imageUrl}
                  onUploadSuccess={(url) => updateField(index, "imageUrl", url)}
                />
              </div>

              <div className="md:col-span-8 lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6">
                <AdminField
                  label="Institution"
                  value={item.institution || ""}
                  onChange={(e) => updateField(index, "institution", e.target.value)}
                />
                <AdminField
                  label="Degree"
                  value={item.degree || ""}
                  onChange={(e) => updateField(index, "degree", e.target.value)}
                />
                <AdminField
                  label="Period"
                  value={item.period || ""}
                  onChange={(e) => updateField(index, "period", e.target.value)}
                />
                <AdminField
                  label="Skills"
                  value={item.skills || ""}
                  onChange={(e) => updateField(index, "skills", e.target.value)}
                  placeholder="e.g. React, Node.js, Python"
                />
                <div className="md:col-span-2">
                  <AdminField
                    label="Description"
                    value={item.description || ""}
                    onChange={(e) => updateField(index, "description", e.target.value)}
                    textarea
                  />
                </div>
              </div>
            </div>
          </AdminEntryShell>
        ))}
      </div>
    </div>
  );
}
