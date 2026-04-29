"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "../../../context/AdminContext";
import { Save, AlertCircle, Plus, GraduationCap } from "lucide-react";

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
            className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium text-sm flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div key={index} className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm relative group">
            <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <GraduationCap size={20} />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Entry #{index + 1}</h3>
              </div>
              <button
                onClick={() => setEducation(education.filter((_, i) => i !== index))}
                className="rounded-lg border border-red-200 px-4 py-2 text-red-600 font-medium text-xs hover:bg-red-50 transition-colors"
              >
                Remove
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Institution</label>
                <input
                  type="text"
                  value={item.institution}
                  onChange={(e) => updateField(index, "institution", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Degree</label>
                <input
                  type="text"
                  value={item.degree || ""}
                  onChange={(e) => updateField(index, "degree", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Period</label>
                <input
                  type="text"
                  value={item.period || ""}
                  onChange={(e) => updateField(index, "period", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Skills</label>
                <input
                  type="text"
                  value={item.skills || ""}
                  onChange={(e) => updateField(index, "skills", e.target.value)}
                  placeholder="e.g. React, Node.js, Python"
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700">Description</label>
                <textarea
                  value={item.description || ""}
                  onChange={(e) => updateField(index, "description", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors min-h-[100px] resize-y"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
