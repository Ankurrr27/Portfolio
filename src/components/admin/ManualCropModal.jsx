"use client";

import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { X, Check, RotateCcw, ZoomIn } from "lucide-react";
import { getCroppedImg } from "../../lib/crop-image";

export default function ManualCropModal({ image, onCropComplete, onClose, aspect = 16 / 9 }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = useCallback((crop) => {
    setCrop(crop);
  }, []);

  const onZoomChange = useCallback((zoom) => {
    setZoom(zoom);
  }, []);

  const onCropCompleteInternal = useCallback((_croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      if (croppedImage && onCropComplete) {
        onCropComplete(croppedImage);
      } else {
        console.error("Failed to generate cropped image blob");
      }
    } catch (e) {
      console.error("Crop error:", e);
    }
  };

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 md:p-10">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden flex flex-col shadow-2xl">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Manual Crop</h3>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Adjust position and scale</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>

        <div className="relative w-full h-[350px] md:h-[450px] bg-slate-900">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteInternal}
            onZoomChange={onZoomChange}
          />
        </div>

        <div className="p-6 space-y-6">
           <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                 <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    <ZoomIn size={14} /> Zoom Control
                 </label>
                 <span className="text-sm font-bold text-blue-600">{Math.round(zoom * 100)}%</span>
              </div>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
           </div>

           <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="flex-[2] py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
              >
                <Check size={18} /> Confirm Selection
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
