"use client";

import { useState } from "react";

type GalleryImage = { src: string; alt: string };

export function Gallery({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState(0);
  const current = images[Math.min(active, images.length - 1)];

  return (
    <div>
      <div className="relative overflow-hidden rounded-[2rem] border-[10px] border-white bg-[var(--cloud)] shadow-[0_40px_90px_rgba(69,31,34,0.18)] sm:border-[14px]">
        <img
          key={current.src}
          src={current.src}
          alt={current.alt}
          className="aspect-square w-full animate-pop object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex justify-center gap-3">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}: ${img.alt}`}
              aria-pressed={i === active}
              className={`h-20 w-20 overflow-hidden rounded-2xl border-[3px] bg-[var(--cloud)] transition sm:h-24 sm:w-24 ${
                i === active
                  ? "border-[var(--forest)] shadow-[0_10px_24px_rgba(69,31,34,0.18)]"
                  : "border-white opacity-80 hover:opacity-100"
              }`}
            >
              <img
                src={img.src}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
