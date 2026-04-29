"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "../../../context/AdminContext";
import { Save, AlertCircle, Plus, Trash2, Maximize2 } from "lucide-react";
import AdminSectionCard from "../../../components/admin/AdminSectionCard";
import AdminImageUpload from "../../../components/admin/AdminImageUpload";

export default function AdminGalleryPage() {
  const { adminKey } = useAdmin();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchGallery = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/admin/gallery", { headers: { "x-admin-key": adminKey } });
        const data = await res.json();
        if (data.items) setItems(data.items);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    if (adminKey) fetchGallery();
  }, [adminKey]);

  const handleSave = async () => {
    setIsLoading(true);
    setStatus("");
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
        body: JSON.stringify({ items }),
      });
      if (res.ok) setStatus("Gallery updated successfully.");
      else throw new Error("Failed to save");
    } catch (err) {
      setStatus(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = () => {
    setItems([...items, { url: "", title: "", category: "" }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    setItems(items.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex items-center justify-between gap-6 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Gallery
          </h1>
          <p className="mt-1 text-sm text-slate-500">Manage photos and images.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={addItem}
            className="px-4 py-2.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-medium text-sm flex items-center gap-2 hover:bg-slate-200 transition-colors"
          >
            <Plus size={16} /> Add Photo
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium text-sm flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={16} />
            {isLoading ? "Saving..." : "Save Gallery"}
          </button>
        </div>
      </header>

      {status && (
        <div className={`p-4 rounded-lg flex items-center gap-3 text-sm font-medium border ${status.includes("successfully") ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"}`}>
          <AlertCircle size={18} />
          {status}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <div key={index} className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-4 group relative">
            <button 
              onClick={() => removeItem(index)}
              className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-red-50 text-red-600 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-100"
            >
              <Trash2 size={16} />
            </button>

            <AdminImageUpload 
              currentImage={item.url}
              onUploadSuccess={(url) => updateItem(index, "url", url)}
              label="Photo"
            />

            <div className="space-y-3 pt-2">
              <input
                type="text"
                value={item.title}
                onChange={(e) => updateItem(index, "title", e.target.value)}
                placeholder="Photo Title"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
              <input
                type="text"
                value={item.category}
                onChange={(e) => updateItem(index, "category", e.target.value)}
                placeholder="Category (e.g. Workshop, Setup)"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="md:col-span-2 xl:col-span-3 py-24 text-center border-2 border-dashed border-slate-300 rounded-xl">
            <p className="text-slate-500 font-medium text-sm">No photos in gallery</p>
          </div>
        )}
      </div>
    </div>
  );
}
