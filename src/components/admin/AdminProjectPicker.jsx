import { useState } from "react";
import { Import, Star, CheckCircle2, ChevronDown, Image as ImageIcon, ArrowUp, ArrowDown } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import AdminSectionCard from "./AdminSectionCard";
import ProjectImageEditor from "./ProjectImageEditor";

export default function AdminProjectPicker({
  githubUsername,
  projectLimit,
  githubProjects,
  selectedSlugs,
  projectImages, // kept for backwards compat but not the primary source anymore
  onToggleProject,
  onUpdateProjectImage,
  onMoveUp,
  onMoveDown,
  onImportSelected,
  isLoading,
}) {
  const [expandedSlug, setExpandedSlug] = useState(null);
  const [localImages, setLocalImages] = useState({}); // track updated images locally
  const [searchQuery, setSearchQuery] = useState("");

  const featuredProjects = selectedSlugs
    .map((slug) => githubProjects.find((p) => p.slug === slug))
    .filter(Boolean);
  const availableProjects = githubProjects.filter((p) => {
    if (selectedSlugs.includes(p.slug)) return false;
    if (searchQuery.trim() === "") return true;
    return p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const handleImagesSaved = (updatedProject) => {
    setLocalImages((prev) => ({
      ...prev,
      [updatedProject.slug]: {
        imageUrl: updatedProject.imageUrl,
        galleryUrls: updatedProject.galleryUrls,
      },
    }));
  };

  const renderProjectCard = (project, isSelected, index) => {
    const canSelect = isSelected || selectedSlugs.length < projectLimit;
    const isExpanded = expandedSlug === project.slug;
    const imgData = localImages[project.slug] || {};
    const cover = imgData.imageUrl || project.imageUrl || projectImages?.[project.slug];

    return (
      <div
        key={project.slug}
        className={`rounded-xl border transition-all duration-200 overflow-hidden ${
          isSelected
            ? "border-blue-200 bg-blue-50/50"
            : "border-slate-200 bg-white"
        }`}
      >
        {/* Card Header */}
        <div className="flex items-start gap-4 p-5">
          {/* Rank Indicator for Featured */}
          {isSelected && (
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={() => onMoveUp(index)}
                disabled={index === 0}
                className="p-1 rounded hover:bg-blue-100 text-blue-400 hover:text-blue-600 disabled:opacity-20 transition-colors"
                title="Move Up"
              >
                <ArrowUp size={16} />
              </button>
              <span className="text-[10px] font-bold text-blue-600 mono bg-blue-100/50 w-6 h-6 flex items-center justify-center rounded-full">
                {index + 1}
              </span>
              <button
                onClick={() => onMoveDown(index)}
                disabled={index === selectedSlugs.length - 1}
                className="p-1 rounded hover:bg-blue-100 text-blue-400 hover:text-blue-600 disabled:opacity-20 transition-colors"
                title="Move Down"
              >
                <ArrowDown size={16} />
              </button>
            </div>
          )}

          {/* Thumbnail */}
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
            {cover ? (
              <img src={cover} alt={project.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <ImageIcon size={20} />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-slate-900 font-semibold text-base leading-tight">{project.name}</h3>
              <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium flex-shrink-0">
                <Star size={14} className={isSelected ? "text-blue-600" : ""} />
                {project.stargazers_count || 0}
              </div>
            </div>
            <p className="mt-1 text-slate-600 text-sm line-clamp-2">
              {project.description || "No description available."}
            </p>

            <div className="flex items-center justify-between mt-3">
              <div className="flex flex-wrap gap-2">
                {project.language && (
                  <span className="rounded bg-slate-100 text-slate-600 px-2 py-0.5 text-xs font-medium">
                    {project.language}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Select / Deselect */}
                <button
                  onClick={() => onToggleProject(project.slug)}
                  disabled={!canSelect}
                  className={`text-xs font-semibold px-3 py-1 rounded-lg transition-colors ${
                    isSelected
                      ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40"
                  } disabled:cursor-not-allowed`}
                >
                  {isSelected ? (
                    <span className="flex items-center gap-1"><CheckCircle2 size={12} /> Featured</span>
                  ) : "Select"}
                </button>

                {/* Expand photos only for selected */}
                {isSelected && (
                  <button
                    onClick={() => setExpandedSlug(isExpanded ? null : project.slug)}
                    className="text-xs font-semibold px-3 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors flex items-center gap-1"
                  >
                    <ImageIcon size={12} /> Photos
                    <ChevronDown size={12} className={`transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Expanded Image Editor */}
        {isSelected && isExpanded && (
          <div className="border-t border-slate-100 p-5 bg-white">
            <ProjectImageEditor
              project={{
                slug: project.slug,
                name: project.name,
                imageUrl: imgData.imageUrl ?? (project.imageUrl || projectImages?.[project.slug] || ""),
                galleryUrls: imgData.galleryUrls ?? (project.galleryUrls || []),
              }}
              onSaved={handleImagesSaved}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Featured Section */}
      <AdminSectionCard
        icon={<CheckCircle2 size={22} className="text-blue-600" />}
        title="Featured Showcase"
        subtitle={`Your top ${featuredProjects.length} repositories, ordered as they will appear on your portfolio.`}
      >
        {featuredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredProjects.map((p, idx) => renderProjectCard(p, true, idx))}
          </div>
        ) : (
          <div className="p-10 text-center border border-slate-200 border-dashed rounded-xl bg-slate-50">
            <Star size={32} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-600 font-medium text-base">No projects featured yet.</p>
            <p className="text-slate-400 text-sm mt-1">Select repositories from the browser below to showcase them.</p>
          </div>
        )}
      </AdminSectionCard>

      {/* Available Section */}
      <AdminSectionCard
        icon={<FaGithub size={22} />}
        title="Repository Browser"
        subtitle={`Select up to ${projectLimit} repositories from ${githubUsername} to feature.`}
        action={
          <div className="relative w-full md:w-64">
            <input 
              type="text" 
              placeholder="Search repositories..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:bg-white focus:border-blue-500 outline-none transition-colors"
            />
          </div>
        }
      >
        {availableProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableProjects.map(p => renderProjectCard(p, false))}
          </div>
        ) : (
          <div className="p-10 text-center border border-slate-200 border-dashed rounded-xl bg-slate-50">
            <FaGithub size={32} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-600 font-medium text-base">No available repositories found.</p>
            <p className="text-slate-400 text-sm mt-1">Check your search query or GitHub connection.</p>
          </div>
        )}
      </AdminSectionCard>
    </div>
  );
}
