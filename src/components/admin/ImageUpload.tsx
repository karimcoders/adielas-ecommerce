"use client";

import { useState, useRef } from "react";
import { CloudUpload, Image as ImageIcon, Loader2, Check, X, ExternalLink } from "lucide-react";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}

export function ImageUpload({
  value,
  onChange,
  folder = "adielas-products",
  label = "Product Image (Cloudinary CDN)",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (PNG, JPG, WEBP)");
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      onChange(data.url);
    } catch (err: any) {
      setError(err.message || "Upload failed. Check Cloudinary settings.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
          {label}
        </label>
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
          ☁️ Cloudinary Enabled
        </span>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 transition cursor-pointer text-center ${
          dragOver
            ? "border-sky-500 bg-sky-50/50"
            : value
              ? "border-emerald-200 bg-emerald-50/20 hover:bg-emerald-50/40"
              : "border-gray-200 bg-gray-50/50 hover:border-gray-300 hover:bg-gray-50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              handleFile(e.target.files[0]);
            }
          }}
        />

        {uploading ? (
          <div className="py-4 flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
            <span className="text-xs font-bold text-gray-700">Uploading to Cloudinary CDN...</span>
          </div>
        ) : value ? (
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-between">
            <div className="flex items-center gap-3">
              <img
                src={value}
                alt="Preview"
                className="h-16 w-16 rounded-xl object-contain bg-white border border-gray-200 p-1 shadow-sm"
              />
              <div className="text-left">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-full">
                  <Check className="h-3 w-3" /> Image Live on Cloudinary
                </span>
                <p className="mt-1 font-mono text-[11px] text-gray-500 truncate max-w-xs sm:max-w-sm">
                  {value}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                title="View full image"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
              <button
                type="button"
                onClick={() => onChange("")}
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"
                title="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="py-3 flex flex-col items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
              <CloudUpload className="h-5 w-5" />
            </div>
            <p className="text-xs font-bold text-gray-700">
              Click to browse or drag and drop image
            </p>
            <p className="text-[11px] text-gray-400">
              PNG, JPG, WEBP up to 10MB (Automatically optimized by Cloudinary)
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs font-semibold text-red-600">{error}</p>
      )}

      {/* Manual URL input fallback */}
      <div className="flex items-center gap-2 pt-1">
        <span className="text-[11px] font-semibold text-gray-400">Or paste direct URL:</span>
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://res.cloudinary.com/..."
          className="flex-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-800 outline-none focus:border-sky-500"
        />
      </div>
    </div>
  );
}
