import { Plus, Trophy, Trash2, ArrowUp, ArrowDown, ChevronDown, ChevronUp } from "lucide-react";
import AdminField from "./AdminField";
import AdminSectionCard from "./AdminSectionCard";
import AdminImageUpload from "./AdminImageUpload";
import { useState } from "react";

export default function AdminAchievementEditor({
  achievements,
  setAchievements,
  updateAchievement,
}) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const parseDate = (dateStr) => {
    if (!dateStr) return new Date(0);
    const months = {
      jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
      jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
    };
    const parts = dateStr.toLowerCase().split(' ');
    if (parts.length === 2) {
      const month = months[parts[0]] || 0;
      const year = parseInt(parts[1]);
      if (!isNaN(year)) return new Date(year, month);
    }
    const yearOnly = parseInt(dateStr);
    if (!isNaN(yearOnly)) return new Date(yearOnly, 0);
    return new Date(0);
  };

  const sortByDate = () => {
    const sorted = [...achievements].sort((a, b) => {
      return parseDate(b.dateLabel) - parseDate(a.dateLabel);
    });
    setAchievements(sorted);
  };

  const moveItem = (index, direction) => {
    const next = [...achievements];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= achievements.length) return;
    [next[index], next[newIndex]] = [next[newIndex], next[index]];
    setAchievements(next);
  };

  const removeItem = (index) => {
    setAchievements(achievements.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--card-bg)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600">
            <Trophy size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)]">Achievements Hub</h2>
            <p className="text-sm text-[var(--muted)]">Manage your milestones in a visual grid layout.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={sortByDate}
            className="px-4 py-2.5 rounded-xl bg-[var(--surface-subtle)] text-[var(--muted)] font-bold text-xs hover:text-[var(--foreground)] transition-all border border-[var(--border-color)]"
          >
            Sort by Date
          </button>
          <button
            onClick={() => {
              setAchievements([
                {
                  title: "",
                  issuer: "",
                  description: "",
                  achievementUrl: "",
                  badgeImageUrl: "",
                  category: "Hackathons",
                  dateLabel: "",
                  featured: true,
                },
                ...achievements,
              ]);
            }}
            className="px-5 py-2.5 rounded-xl bg-orange-500 text-white font-bold text-sm flex items-center gap-2 hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
          >
            <Plus size={18} />
            Add Milestone
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {achievements.map((item, index) => {
          const isExpanded = expandedIndex === index;
          return (
            <div 
              key={`${item.id || "new"}-${index}`} 
              className="group flex flex-col bg-[var(--card-bg)] rounded-3xl border border-[var(--border-color)] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
            >
              {/* Header / Summary View */}
              <div 
                onClick={() => toggleExpand(index)}
                className="p-4 md:p-6 flex items-center justify-between cursor-pointer hover:bg-[var(--surface-subtle)] transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-16 h-10 md:w-20 md:h-12 rounded-xl bg-[var(--surface-subtle)] overflow-hidden flex-shrink-0 border border-[var(--border-color)] relative">
                    {item.badgeImageUrl ? (
                      <img src={item.badgeImageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[var(--muted)]">
                        <Trophy size={16} />
                      </div>
                    )}
                    {/* Compact category badge on image */}
                    <div className="absolute top-1 left-1 flex gap-0.5">
                       {(Array.isArray(item.category) ? item.category : [item.category || "Hackathons"]).slice(0, 1).map((cat, i) => (
                         <div key={i} className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]"></div>
                       ))}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                       <h3 className="text-sm md:text-base font-bold text-[var(--foreground)] truncate">
                        {item.title || "Untitled Milestone"}
                       </h3>
                       <div className="flex gap-1 flex-shrink-0">
                        {(Array.isArray(item.category) ? item.category : [item.category || "Hackathons"]).map((cat, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded-md bg-orange-500/10 text-orange-600 dark:text-orange-500 text-[7px] font-black uppercase tracking-widest border border-orange-500/20">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] font-bold text-[var(--muted)] uppercase tracking-widest">{item.dateLabel || "No Date"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                   <div className="hidden group-hover:flex items-center gap-1 mr-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); moveItem(index, 'up'); }}
                        disabled={index === 0}
                        className="p-1.5 rounded-lg text-[var(--muted)] hover:text-orange-500 disabled:opacity-20"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); moveItem(index, 'down'); }}
                        disabled={index === achievements.length - 1}
                        className="p-1.5 rounded-lg text-[var(--muted)] hover:text-orange-500 disabled:opacity-20"
                      >
                        <ArrowDown size={14} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeItem(index); }}
                        className="p-1.5 rounded-lg text-[var(--muted)] hover:text-rose-500"
                      >
                        <Trash2 size={14} />
                      </button>
                   </div>
                   <div className={`p-2 rounded-xl bg-[var(--surface-subtle)] text-[var(--muted)] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                      <ChevronDown size={18} />
                   </div>
                </div>
              </div>

              {/* Expanded Edit Form */}
              {isExpanded && (
                <div className="border-t border-[var(--border-color)] p-6 md:p-8 animate-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left: Image Upload */}
                    <div className="lg:col-span-4">
                      <AdminImageUpload 
                        currentImage={item.badgeImageUrl || ""}
                        onUploadSuccess={(url) => updateAchievement(index, "badgeImageUrl", url)}
                        label="Milestone Cover"
                      />
                    </div>

                    {/* Right: Fields */}
                    <div className="lg:col-span-8 space-y-6">
                      <AdminField
                        label="Title"
                        value={item.title || ""}
                        onChange={(e) => updateAchievement(index, "title", e.target.value)}
                        placeholder="e.g. SIH 2026 Winner"
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest px-1">Categories</label>
                          <div className="flex flex-wrap gap-2 p-4 bg-[var(--surface-subtle)] border border-[var(--border-color)] rounded-2xl">
                            {["Hackathons", "Certificates", "Events", "Position of Responsibilities", "Work"].map((cat) => {
                              const currentCats = Array.isArray(item.category) ? item.category : [item.category || "Hackathons"];
                              const isSelected = currentCats.includes(cat);
                              return (
                                <button
                                  key={cat}
                                  type="button"
                                  onClick={() => {
                                    const newCats = isSelected 
                                      ? currentCats.filter(c => c !== cat)
                                      : [...currentCats, cat];
                                    updateAchievement(index, "category", newCats.length > 0 ? newCats : ["Hackathons"]);
                                  }}
                                  className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                    isSelected 
                                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" 
                                    : "bg-[var(--card-bg)] text-[var(--muted)] border border-[var(--border-color)] hover:border-orange-500/30"
                                  }`}
                                >
                                  {cat}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <AdminField
                          label="Date"
                          value={item.dateLabel || ""}
                          onChange={(e) => updateAchievement(index, "dateLabel", e.target.value)}
                          placeholder="e.g. Mar 2026"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AdminField
                          label="Issuer"
                          value={item.issuer || ""}
                          onChange={(e) => updateAchievement(index, "issuer", e.target.value)}
                          placeholder="e.g. Ministry of Education"
                        />
                        <AdminField
                          label="Verification Link"
                          value={item.achievementUrl || ""}
                          onChange={(e) => updateAchievement(index, "achievementUrl", e.target.value)}
                          placeholder="https://..."
                        />
                      </div>

                      <AdminField
                        label="Description"
                        value={item.description || ""}
                        onChange={(e) => updateAchievement(index, "description", e.target.value)}
                        textarea
                        placeholder="Briefly describe the impact..."
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {achievements.length === 0 && (
          <div className="md:col-span-2 xl:col-span-3 py-32 text-center border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-[2.5rem]">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Trophy size={32} className="text-slate-300" />
            </div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">No achievements tracked yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
