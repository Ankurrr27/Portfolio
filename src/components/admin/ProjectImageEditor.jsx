"use client";

import { useState, useRef, useCallback } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Upload, X, Image as ImageIcon, Check, Loader2, Plus, Trash2 } from "lucide-react";
import { useAdmin } from "../../context/AdminContext";

// ─── Helpers ───────────────────────────────────────────────────────────────

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop({ unit: "%", width: 90 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight
  );
}

async function getCroppedBlob(imageEl, crop, fileName) {
  const canvas = document.createElement("canvas");
  const scaleX = imageEl.naturalWidth / imageEl.width;
  const scaleY = imageEl.naturalHeight / imageEl.height;
  canvas.width = Math.floor(crop.width * scaleX);
  canvas.height = Math.floor(crop.height * scaleY);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(
    imageEl,
    crop.x * scaleX, crop.y * scaleY,
    crop.width * scaleX, crop.height * scaleY,
    0, 0, canvas.width, canvas.height
  );
  return new Promise((resolve) =>
    canvas.toBlob((blob) => resolve(new File([blob], fileName, { type: "image/jpeg" })), "image/jpeg", 0.92)
  );
}

// ─── CropModal ─────────────────────────────────────────────────────────────

function CropModal({ src, fileName, aspect, onDone, onCancel }) {
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);

  const onImageLoad = useCallback((e) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, aspect));
  }, [aspect]);

  const handleConfirm = async () => {
    if (!completedCrop || !imgRef.current) return;
    const file = await getCroppedBlob(imgRef.current, completedCrop, fileName);
    onDone(file);
  };

  return (
    <div className="fixed inset-0 z-[9000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900">Crop Image</h3>
            <p className="text-xs text-slate-500 mt-0.5">{aspect === 16 / 9 ? "Cover — 16:9" : "Square — 1:1"} ratio</p>
          </div>
          <button onClick={onCancel} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 bg-slate-50 flex items-center justify-center min-h-[300px]">
          <ReactCrop
            crop={crop}
            onChange={(_, pct) => setCrop(pct)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspect}
            minWidth={50}
            className="max-h-[60vh]"
          >
            <img
              ref={imgRef}
              src={src}
              onLoad={onImageLoad}
              alt="Crop preview"
              className="max-h-[60vh] object-contain"
            />
          </ReactCrop>
        </div>

        <div className="flex justify-end gap-3 p-5 border-t border-slate-100">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!completedCrop}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Check size={16} /> Apply Crop
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function ProjectImageEditor({ project, onSaved }) {
  const { adminKey } = useAdmin();
  const [imageUrl, setImageUrl] = useState(project.imageUrl || "");
  const [galleryUrls, setGalleryUrls] = useState(project.galleryUrls || []);
  const [cropModal, setCropModal] = useState(null); // { src, fileName, aspect, target: "cover"|"gallery" }
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const coverInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  // ── Upload a File to Cloudinary via our API ──
  const uploadFile = async (file, aspect) => {
    setUploading(true);
    setStatus("");
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("aspectRatio", aspect === 16 / 9 ? "16:9" : "1:1");
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "x-admin-key": adminKey },
        body: form,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      return data.url;
    } finally {
      setUploading(false);
    }
  };

  // ── Handle file selection → open crop modal ──
  const handleCoverSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const src = URL.createObjectURL(file);
    setCropModal({ src, fileName: file.name, aspect: 16 / 9, target: "cover" });
    e.target.value = "";
  };

  const handleGallerySelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const src = URL.createObjectURL(file);
    setCropModal({ src, fileName: file.name, aspect: 16 / 9, target: "gallery" });
    e.target.value = "";
  };

  // ── After crop is confirmed ──
  const handleCropDone = async (croppedFile) => {
    const { target, aspect } = cropModal;
    setCropModal(null);
    try {
      const url = await uploadFile(croppedFile, aspect);
      if (target === "cover") {
        setImageUrl(url);
      } else {
        setGalleryUrls((prev) => [...prev, url]);
      }
    } catch {
      setStatus("Upload failed. Check Cloudinary credentials.");
    }
  };

  const removeGalleryImage = (idx) => {
    setGalleryUrls((prev) => prev.filter((_, i) => i !== idx));
  };

  // ── Save to DB ──
  const handleSave = async () => {
    setSaving(true);
    setStatus("");
    try {
      const res = await fetch("/api/admin/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
        body: JSON.stringify({ slug: project.slug, imageUrl, galleryUrls }),
      });
      if (!res.ok) throw new Error("Save failed");
      setStatus("Saved!");
      onSaved?.({ ...project, imageUrl, galleryUrls });
    } catch {
      setStatus("Save failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cover Image */}
      <div>
        <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Cover Image (16:9)</p>
        <div
          className="relative h-44 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 overflow-hidden group cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all"
          onClick={() => coverInputRef.current?.click()}
        >
          {imageUrl ? (
            <>
              <img src={imageUrl} alt="Cover" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white font-semibold text-sm flex items-center gap-2"><Upload size={16} /> Replace</span>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-400">
              <ImageIcon size={32} />
              <span className="text-sm font-medium">Click to upload cover</span>
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <Loader2 size={24} className="text-blue-600 animate-spin" />
            </div>
          )}
        </div>
        <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverSelect} />
      </div>

      {/* Gallery */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Gallery Photos</p>
          <button
            onClick={() => galleryInputRef.current?.click()}
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Plus size={14} /> Add Photo
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {galleryUrls.map((url, i) => (
            <div key={i} className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 group">
              <img src={url} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
              <button
                onClick={() => removeGalleryImage(i)}
                className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
          <button
            onClick={() => galleryInputRef.current?.click()}
            className="aspect-video rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/30 transition-all flex items-center justify-center text-slate-400 hover:text-blue-500"
          >
            <Plus size={20} />
          </button>
        </div>
        <input ref={galleryInputRef} type="file" accept="image/*" className="hidden" onChange={handleGallerySelect} />
      </div>

      {/* Save */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        {status && (
          <span className={`text-xs font-semibold ${status === "Saved!" ? "text-emerald-600" : "text-red-600"}`}>
            {status}
          </span>
        )}
        <div className="ml-auto">
          <button
            onClick={handleSave}
            disabled={saving || uploading}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            Save Images
          </button>
        </div>
      </div>

      {/* Crop Modal */}
      {cropModal && (
        <CropModal
          src={cropModal.src}
          fileName={cropModal.fileName}
          aspect={cropModal.aspect}
          onDone={handleCropDone}
          onCancel={() => setCropModal(null)}
        />
      )}
    </div>
  );
}
