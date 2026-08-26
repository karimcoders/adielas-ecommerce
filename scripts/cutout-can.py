#!/usr/bin/env python3
"""Chroma-key the sage backdrop out of can.png -> can-cut.png (RGBA)."""
from PIL import Image, ImageFilter
import math

SRC = "/home/z/my-project/public/images/more/can.png"
DST = "/home/z/my-project/public/images/more/can-cut.png"

img = Image.open(SRC).convert("RGB")
w, h = img.size
px = img.load()

# sample corner patches for the backdrop color
patch = 24
samples = []
for cx, cy in [(4, 4), (w - 5, 4), (4, h - 5), (w - 5, h - 5)]:
    for dx in range(patch):
        for dy in range(patch):
            x = min(max(cx + dx - patch // 2, 0), w - 1)
            y = min(max(cy + dy - patch // 2, 0), h - 1)
            samples.append(px[x, y])
r = sum(s[0] for s in samples) / len(samples)
g = sum(s[1] for s in samples) / len(samples)
b = sum(s[2] for s in samples) / len(samples)
print(f"bg color ≈ ({r:.0f},{g:.0f},{b:.0f})")

# per-pixel distance to bg; soft threshold
t0, t1 = 26, 66
alpha = Image.new("L", (w, h))
ap = alpha.load()
for y in range(h):
    for x in range(w):
        p = px[x, y]
        d = math.sqrt((p[0] - r) ** 2 + (p[1] - g) ** 2 + (p[2] - b) ** 2)
        if d <= t0:
            a = 0
        elif d >= t1:
            a = 255
        else:
            a = int(255 * (d - t0) / (t1 - t0))
        ap[x, y] = a

# clean: slight blur + hard threshold re-apply to kill halos
alpha = alpha.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.2))

out = img.convert("RGBA")
out.putalpha(alpha)

# crop to content bbox
bbox = out.getbbox()
if bbox:
    pad = 8
    bbox = (
        max(0, bbox[0] - pad),
        max(0, bbox[1] - pad),
        min(w, bbox[2] + pad),
        min(h, bbox[3] + pad),
    )
    out = out.crop(bbox)

out.save(DST)
print(f"saved {DST} size={out.size}")
