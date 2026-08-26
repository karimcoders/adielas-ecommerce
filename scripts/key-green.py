#!/usr/bin/env python3
"""Green-screen keying: chroma green -> transparent for generated assets."""
from PIL import Image, ImageFilter
import os

DIR = "/home/z/my-project/public/images/more"
JOBS = ["can-green.png", "ingredient-cookie.png", "ingredient-strawberry.png"]


def key_green(src, dst):
    img = Image.open(src).convert("RGB")
    w, h = img.size
    px = img.load()

    # estimate the screen green from corners
    patch = 20
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
    print(f"{os.path.basename(src)}: screen=({r:.0f},{g:.0f},{b:.0f})")

    # green dominance metric: how much greener vs the screen green
    t0, t1 = 30, 90
    alpha = Image.new("L", (w, h))
    ap = alpha.load()
    for y in range(h):
        for x in range(w):
            pr, pg, pb = px[x, y]
            # distance from screen color weighted toward green channel
            d = abs(pg - g) + 0.6 * (abs(pr - r) + abs(pb - b))
            if d <= t0:
                a = 0
            elif d >= t1:
                a = 255
            else:
                a = int(255 * (d - t0) / (t1 - t0))
            ap[x, y] = a

    alpha = alpha.filter(ImageFilter.MedianFilter(3)).filter(ImageFilter.GaussianBlur(1.0))

    out = img.convert("RGBA")
    out.putalpha(alpha)
    bbox = out.getbbox()
    if bbox:
        pad = 10
        bbox = (
            max(0, bbox[0] - pad),
            max(0, bbox[1] - pad),
            min(w, bbox[2] + pad),
            min(h, bbox[3] + pad),
        )
        out = out.crop(bbox)
    out.save(dst)
    print(f"  -> {os.path.basename(dst)} size={out.size}")


for job in JOBS:
    src = os.path.join(DIR, job)
    dst = os.path.join(DIR, job.replace("-green", "-cut"))
    key_green(src, dst)
print("all done")
