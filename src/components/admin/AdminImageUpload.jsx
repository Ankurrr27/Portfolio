"use client";

import React, { useState } from "react";
import { Upload, X, Image as ImageIcon, Loader2, Crop as CropIcon } from "lucide-react";
import { useAdmin } from "../../context/AdminContext";
import ManualCropModal from "./ManualCropModal";

export default function AdminImageUpload({ onUploadSuccess, currentImage, label = "Upload Image" }) {
  const { adminKey } = useAdmin();
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage);
  const [aspectRatio, setAspectRatio] = useState("16:9");
  
  const [tempImage, setTempImage] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  const getRatioNumber = (ratioStr) => {
    if (ratioStr === "16:9") return 16 / 9;
    if (ratioStr === "4:3") return 4 / 3;
    if (ratioStr === "1:1") return 1 / 1;
    return 16 / 9;
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      console.log("File loaded, opening cropper...");
      setTempImage(reader.result);
      setShowCropper(true);
    });
    reader.readAsDataURL(file);
    // Reset input
    e.target.value = "";
  };

  const handleCropComplete = async (croppedBlob) => {
    setShowCropper(false);
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", croppedBlob, "cropped-image.jpg");
    formData.append("aspectRatio", aspectRatio);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "x-admin-key": adminKey },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setPreview(data.url);
        onUploadSuccess(data.url);
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Something went wrong during upload");
    } finally {
      setIsUploading(false);
      setTempImage(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          {label}
        </label>
        
        {!preview && (
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 p-1 rounded-lg">
            {["16:9", "4:3", "1:1"].map(ratio => (
              <button
                key={ratio}
                onClick={() => setAspectRatio(ratio)}
                className={`px-2 py-0.5 rounded-md text-[8px] font-bold transition-all ${aspectRatio === ratio ? "bg-white dark:bg-white/10 text-indigo-600 shadow-sm" : "text-slate-400"}`}
              >
                {ratio}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="relative group">
        {preview ? (
          <div className={`relative w-full rounded-[2rem] overflow-hidden border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 ${
            aspectRatio === "16:9" ? "aspect-video" : aspectRatio === "4:3" ? "aspect-[4/3]" : "aspect-square"
          }`}>
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute top-4 left-4">
               <span className="px-2 py-1 rounded-md bg-black/50 backdrop-blur-md text-[8px] font-bold text-white uppercase tracking-widest border border-white/10 flex items-center gap-1.5">
                  <CropIcon size={10} /> {aspectRatio} Manual Crop
               </span>
            </div>
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button 
                onClick={() => { setPreview(null); onUploadSuccess(""); }}
                className="p-2 rounded-lg bg-rose-500 text-white shadow-lg"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ) : (
          <label className={`flex flex-col items-center justify-center w-full rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-all cursor-pointer group ${
            aspectRatio === "16:9" ? "aspect-video" : aspectRatio === "4:3" ? "aspect-[4/3]" : "aspect-square"
          }`}>
            {isUploading ? (
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            ) : (
              <>
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                  <Upload size={20} className="text-slate-400 group-hover:text-indigo-600" />
                </div>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Crop & Upload ({aspectRatio})</p>
              </>
            )}
            <input type="file" className="hidden" accept="image/*" onChange={handleFileSelect} disabled={isUploading} />
          </label>
        )}
      </div>

      {showCropper && (
        <ManualCropModal 
          image={tempImage}
          aspect={getRatioNumber(aspectRatio)}
          onCropComplete={handleCropComplete}
          onClose={() => { setShowCropper(false); setTempImage(null); }}
        />
      )}
    </div>
  );
}
