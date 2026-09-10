"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";

/**
 * URL input + one-click Cloudinary upload button + live preview.
 * Used by admin forms for product/CMS images.
 */
export function ImageUploadField({
  label,
  value,
  onChange,
  placeholder = "https://res.cloudinary.com/…",
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pick = () => inputRef.current?.click();

  const upload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error ?? "Upload failed.");
        return;
      }
      onChange(data.url);
    } catch {
      setError("Network error while uploading.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--olive)]">
        {label}
      </span>
      <div className="flex items-start gap-2">
        <div className="relative h-[42px] w-[42px] shrink-0 overflow-hidden rounded-xl border-2 border-[var(--forest)]/12 bg-white">
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[var(--forest)]/25">
              <ImagePlus className="h-4 w-4" />
            </div>
          )}
        </div>
        <div className="flex-1 space-y-1.5">
          <input
            className="w-full rounded-xl border-2 border-[var(--forest)]/15 bg-white px-3.5 py-2.5 text-sm font-medium text-[var(--forest)] outline-none transition focus:border-[var(--sage-deep)]"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={pick}
              disabled={uploading}
              className="flex items-center gap-1.5 rounded-full bg-[var(--forest)]/90 px-3.5 py-2 text-xs font-bold text-[var(--cream)] transition hover:bg-[var(--forest-deep)] disabled:opacity-60"
            >
              {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />}
              {uploading ? "Uploading…" : "Upload image"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                title="Clear"
                className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--forest)]/45 transition hover:bg-[var(--cloud)] hover:text-[#b3352f]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            <span className="text-[11px] font-semibold text-[var(--forest-deep)]/45">
              JPG / PNG / WebP · max 8 MB → Cloudinary
            </span>
          </div>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void upload(f);
          e.target.value = "";
        }}
      />
      {error && (
        <p role="alert" className="mt-1.5 rounded-lg bg-[#fbeaea] px-3 py-2 text-xs font-semibold text-[#b3352f]">
          {error}
        </p>
      )}
    </div>
  );
}
