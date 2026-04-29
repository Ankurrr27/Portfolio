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
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      onCropComplete(croppedImage);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-10">
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#0d0d12] rounded-[3rem] overflow-hidden flex flex-col h-[80vh] shadow-2xl">
        <div className="p-6 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold syne uppercase tracking-tight text-slate-900 dark:text-white">Manual Crop</h3>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Adjust position and scale</p>
          </div>
          <button onClick={onClose} className="p-3 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="relative flex-1 bg-slate-900 min-h-[400px]">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteInternal}
            onZoomChange={onZoomChange}
            classes={{ containerClassName: "h-full w-full relative" }}
          />
        </div>

        <div className="p-8 space-y-6 bg-white dark:bg-[#0d0d12]">
           <div className="flex items-center gap-6">
              <div className="flex-1 space-y-3">
                 <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <ZoomIn size={12} /> Zoom Level
                    </label>
                    <span className="text-[10px] font-bold text-indigo-600">{Math.round(zoom * 100)}%</span>
                 </div>
                 <input
                   type="range"
                   value={zoom}
                   min={1}
                   max={3}
                   step={0.1}
                   aria-labelledby="Zoom"
                   onChange={(e) => setZoom(parseFloat(e.target.value))}
                   className="w-full h-1.5 bg-slate-100 dark:bg-white/5 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                 />
              </div>
              <button 
                onClick={() => { setZoom(1); setCrop({ x: 0, y: 0 }); }}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-indigo-600 transition-all border border-slate-100 dark:border-white/5"
              >
                <RotateCcw size={18} />
              </button>
           </div>

           <div className="flex items-center gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-4 rounded-2xl border border-slate-200 dark:border-white/10 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="flex-[2] py-4 rounded-2xl bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
              >
                <Check size={16} /> Confirm Crop & Upload
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
