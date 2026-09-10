#!/usr/bin/env python3
"""Analyze burst frames: find the 3 mice (tan blobs), track jump apex per column.

Prints per-frame, per-column top-most y of tan pixels. The mouse whose apex
stays LOWEST across frames (largest min-height value) jumps the lowest.
"""
from PIL import Image
import glob
import numpy as np

frames = sorted(glob.glob("/home/z/my-project/scripts/burst_*.png"))

# challenge image area (from screenshot): x 476..805, y 139..467 on 1280x577 page
X0, X1, Y0, Y1 = 476, 806, 139, 468

def tan_mask(rgb):
    r, g, b = rgb[..., 0].astype(int), rgb[..., 1].astype(int), rgb[..., 2].astype(int)
    # mice fur is tan: r>g>b with MODERATE r-g gap (~30-60).
    # red/crimson backgrounds have r-g > 100 -> excluded.
    return (r > 130) & (g > 95) & (b < 130) & (r - b > 40) & (r - g < 80) & (g - b > 15)

per_col_apex = {0: [], 1: [], 2: []}
for fi, fp in enumerate(frames):
    img = np.array(Image.open(fp).convert("RGB"))[Y0:Y1, X0:X1]
    m = tan_mask(img)
    ys, xs = np.nonzero(m)
    if len(xs) < 50:
        print(f"frame {fi}: too few tan px ({len(xs)})")
        continue
    # cluster x into 3 columns by fixed thirds of detected spread
    xmin, xmax = xs.min(), xs.max()
    w = (xmax - xmin) / 3.0
    out = []
    for c in range(3):
        sel = (xs >= xmin + c * w) & (xs < xmin + (c + 1) * w)
        if sel.sum() < 20:
            out.append(None)
            continue
        top = ys[sel].min()          # apex (higher pixel = smaller y = higher jump)
        per_col_apex[c].append(top)
        out.append(int(top))
    print(f"frame {fi}: apex_y per mouse L/M/R = {out}")

print("\n--- summary ---")
for c, name in [(0, "LEFT"), (1, "MIDDLE"), (2, "RIGHT")]:
    v = per_col_apex[c]
    if v:
        print(f"{name}: n={len(v)} min_apex={min(v)} max_apex={max(v)} mean={np.mean(v):.1f}")
    else:
        print(f"{name}: no data")
