import { Plus, Trophy } from "lucide-react";
import AdminEntryShell from "./AdminEntryShell";
import AdminField from "./AdminField";
import AdminSectionCard from "./AdminSectionCard";

export default function AdminAchievementEditor({
  achievements,
  setAchievements,
  updateAchievement,
}) {
  return (
    <AdminSectionCard
      icon={<Trophy size={22} />}
      title="Achievements"
      subtitle="Manage the dynamic milestone cards shown on the public site."
      action={
        <button
          onClick={() =>
            setAchievements([
              {
                title: "",
                issuer: "",
                description: "",
                achievementUrl: "",
                badgeImageUrl: "",
                category: "",
                dateLabel: "",
                featured: true,
              },
              ...achievements,
            ])
          }
          className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-slate-700 font-medium text-sm hover:bg-slate-200 transition-colors"
        >
          <Plus size={16} />
          Add Entry
        </button>
      }
    >
      <div className="space-y-5">
        {achievements.map((item, index) => (
          <AdminEntryShell
            key={`${item.id || "new"}-${index}`}
            title={item.title || `Achievement ${index + 1}`}
            subtitle={`Highlight block ${index + 1}`}
            onRemove={() =>
              setAchievements(
                achievements.filter((_, itemIndex) => itemIndex !== index)
              )
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AdminField
                label="Title"
                value={item.title || ""}
                onChange={(e) =>
                  updateAchievement(index, "title", e.target.value)
                }
              />
              <AdminField
                label="Issuer"
                value={item.issuer || ""}
                onChange={(e) =>
                  updateAchievement(index, "issuer", e.target.value)
                }
              />
              <AdminField
                label="Category"
                value={item.category || ""}
                onChange={(e) =>
                  updateAchievement(index, "category", e.target.value)
                }
              />
              <AdminField
                label="Date Label"
                value={item.dateLabel || ""}
                onChange={(e) =>
                  updateAchievement(index, "dateLabel", e.target.value)
                }
              />
              <AdminField
                label="Achievement URL"
                value={item.achievementUrl || ""}
                onChange={(e) =>
                  updateAchievement(index, "achievementUrl", e.target.value)
                }
              />
              <AdminField
                label="Badge Image URL"
                value={item.badgeImageUrl || ""}
                onChange={(e) =>
                  updateAchievement(index, "badgeImageUrl", e.target.value)
                }
              />
              <AdminField
                label="Description"
                value={item.description || ""}
                onChange={(e) =>
                  updateAchievement(index, "description", e.target.value)
                }
                textarea
              />
            </div>
          </AdminEntryShell>
        ))}
      </div>
    </AdminSectionCard>
  );
}
