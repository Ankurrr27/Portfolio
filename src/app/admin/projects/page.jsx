"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "../../../context/AdminContext";
import AdminProjectPicker from "../../../components/admin/AdminProjectPicker";
import { Save, AlertCircle } from "lucide-react";

export default function AdminProjectsPage() {
  const { adminKey } = useAdmin();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [githubProjects, setGithubProjects] = useState([]);
  const [selectedSlugs, setSelectedSlugs] = useState([]);
  const [projectImages, setProjectImages] = useState({});
  const [projectLimit, setProjectLimit] = useState(6);
  const [githubUsername, setGithubUsername] = useState("Ankurrr27");

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/admin/projects", {
          headers: { "x-admin-key": adminKey },
          cache: "no-store",
        });
        const data = await res.json();

        if (res.ok) {
          setGithubProjects(data.githubProjects || []);
          setSelectedSlugs(data.selectedSlugs || []);
          setProjectImages(data.selectedImages || {});
          setProjectLimit(data.projectLimit || 6);
          setGithubUsername(data.githubUsername || "Ankurrr27");
        }
      } catch (error) {
        console.error("Failed to load projects", error);
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
      const response = await fetch("/api/admin/projects", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({ selectedSlugs, projectImages }),
      });

      if (response.ok) {
        setStatus("Changes saved successfully.");
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

  const toggleProjectSelection = (slug) => {
    setSelectedSlugs((current) => {
      if (current.includes(slug)) {
        return current.filter((item) => item !== slug);
      }
      if (current.length >= projectLimit) return current;
      return [...current, slug];
    });
  };

  const updateProjectImage = (slug, imageUrl) => {
    setProjectImages((current) => ({
      ...current,
      [slug]: imageUrl,
    }));
  };

  const moveUp = (index) => {
    if (index === 0) return;
    setSelectedSlugs((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  };

  const moveDown = (index) => {
    setSelectedSlugs((prev) => {
      if (index === prev.length - 1) return prev;
      const next = [...prev];
      [next[index + 1], next[index]] = [next[index], next[index + 1]];
      return next;
    });
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex items-center justify-between gap-6 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Projects
          </h1>
          <p className="mt-1 text-sm text-slate-500">Manage which GitHub repositories are featured.</p>
        </div>

        <button
          onClick={handleSave}
          disabled={isLoading || selectedSlugs.length === 0}
          className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium text-sm flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={16} />
          {isLoading ? "Saving..." : "Save Selection"}
        </button>
      </header>

      {status && (
        <div className={`p-4 rounded-lg flex items-center gap-3 text-sm font-medium border ${status.includes("success") ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"}`}>
          <AlertCircle size={18} />
          {status}
        </div>
      )}

      <AdminProjectPicker
        githubUsername={githubUsername}
        projectLimit={projectLimit}
        githubProjects={githubProjects}
        selectedSlugs={selectedSlugs}
        projectImages={projectImages}
        onToggleProject={toggleProjectSelection}
        onUpdateProjectImage={updateProjectImage}
        onMoveUp={moveUp}
        onMoveDown={moveDown}
        onImportSelected={handleSave}
        isLoading={isLoading}
      />
    </div>
  );
}
