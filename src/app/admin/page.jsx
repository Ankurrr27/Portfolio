"use client";

import { useEffect, useMemo, useState } from "react";
import { BadgeCheck, Save, Sparkles, Trophy, ArrowRight } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { useAdmin } from "../../context/AdminContext";
import Link from "next/link";

export default function AdminPage() {
  const { adminKey } = useAdmin();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [achievements, setAchievements] = useState([]);
  const [githubProjects, setGithubProjects] = useState([]);
  const [selectedSlugs, setSelectedSlugs] = useState([]);

  useEffect(() => {
    if (adminKey) {
      loadAdminData(adminKey).catch((err) => {
        setStatus("Failed to load admin data: " + err.message);
      });
    }
  }, [adminKey]);

  const loadAdminData = async (key) => {
    const [contentResponse, projectResponse] = await Promise.all([
      fetch("/api/admin/content", {
        headers: { "x-admin-key": key },
        cache: "no-store",
      }),
      fetch("/api/admin/projects", {
        headers: { "x-admin-key": key },
        cache: "no-store",
      }),
    ]);

    const contentPayload = await contentResponse.json();
    const projectPayload = await projectResponse.json();

    if (!contentResponse.ok) {
      throw new Error(contentPayload.error || "Unable to load achievements.");
    }
    if (!projectResponse.ok) {
      throw new Error(projectPayload.error || "Unable to load GitHub projects.");
    }

    setAchievements(contentPayload.achievements || []);
    setGithubProjects(projectPayload.githubProjects || []);
    setSelectedSlugs(projectPayload.selectedSlugs || []);
  };

  const stats = useMemo(
    () => [
      {
        label: "Selected Projects",
        value: selectedSlugs.length,
        icon: <FaGithub size={18} />,
        href: "/admin/projects",
      },
      {
        label: "Achievements",
        value: achievements.length,
        icon: <Trophy size={18} />,
        href: "/admin/achievements",
      },
    ],
    [achievements.length, selectedSlugs.length]
  );

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="mt-2 text-sm text-slate-500 max-w-2xl">
          Welcome to your portfolio control center. Keep your structure clean by managing dynamic content here, while static elements remain safely hardcoded.
        </p>
      </header>

      {status && (
        <div className="rounded-md bg-rose-50 p-4 text-sm text-rose-600 border border-rose-100">
          {status}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center justify-between p-6 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition-all group"
          >
            <div>
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                <div className="text-blue-600">{item.icon}</div>
                <span className="text-xs font-semibold uppercase tracking-wider">{item.label}</span>
              </div>
              <span className="text-3xl font-bold text-slate-900">{item.value}</span>
            </div>
            <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
              <ArrowRight size={18} />
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Sparkles size={18} className="text-blue-600" /> Quick Actions
          </h2>
          <p className="text-sm text-slate-500 mt-1">Need to jump straight to editing?</p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/admin/projects"
            className="rounded-lg bg-slate-100 px-5 py-2.5 text-slate-700 font-medium text-sm hover:bg-slate-200 transition-colors"
          >
            Manage Projects
          </Link>
          <Link
            href="/admin/achievements"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-white font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm"
          >
            Edit Achievements
          </Link>
        </div>
      </div>
    </div>
  );
}
