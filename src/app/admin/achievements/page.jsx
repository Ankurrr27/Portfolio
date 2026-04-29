"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "../../../context/AdminContext";
import AdminAchievementEditor from "../../../components/admin/AdminAchievementEditor";
import { Save, AlertCircle } from "lucide-react";

export default function AdminAchievementsPage() {
  const { adminKey } = useAdmin();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/admin/content", {
          headers: { "x-admin-key": adminKey },
          cache: "no-store",
        });
        const data = await res.json();

        if (res.ok) {
          setAchievements(data.achievements || []);
        }
      } catch (error) {
        console.error("Failed to load achievements", error);
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
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({ achievements }),
      });

      if (response.ok) {
        setStatus("Achievements updated.");
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

  const updateAchievement = (index, field, value) => {
    setAchievements((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      )
    );
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex items-center justify-between gap-6 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Achievements
          </h1>
          <p className="mt-1 text-sm text-slate-500">Manage your milestone cards.</p>
        </div>

        <button
          onClick={handleSave}
          disabled={isLoading}
          className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium text-sm flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={16} />
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </header>

      {status && (
        <div className={`p-4 rounded-lg flex items-center gap-3 text-sm font-medium border ${status.includes("updated") ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"}`}>
          <AlertCircle size={18} />
          {status}
        </div>
      )}

      <AdminAchievementEditor
        achievements={achievements}
        setAchievements={setAchievements}
        updateAchievement={updateAchievement}
      />
    </div>
  );
}
