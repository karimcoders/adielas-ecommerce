#!/usr/bin/env python3
"""Trim contiguous near-black photo borders from the real ADIELAS pack cutouts."""
from PIL import Image
import numpy as np

BASE = "/home/z/my-project/public/images/adielas"

def edge_fraction(mask, axis_slice):
    sub = mask[axis_slice]
    return sub.mean() if sub.size else 0.0

def trim(name, thresh=52, frac=0.5, max_trim=0.10):
    path = f"{BASE}/{name}"
    im = Image.open(path).convert("RGBA")
    a = np.asarray(im).astype(np.int16)
    rgb = a[..., :3]
    lum = rgb.mean(axis=2)
    dark = (lum < thresh) & (a[..., 3] > 60)

    h, w = dark.shape
    limit_h, limit_w = int(h * max_trim), int(w * max_trim)

    top = 0
    while top < limit_h and edge_fraction(dark, (slice(top, top + 1), slice(None))) > frac:
        top += 1
    bot = h
    while bot > h - limit_h and edge_fraction(dark, (slice(bot - 1, bot), slice(None))) > frac:
        bot -= 1
    left = 0
    while left < limit_w and edge_fraction(dark, (slice(None), slice(left, left + 1))) > frac:
        left += 1
    right = w
    while right > w - limit_w and edge_fraction(dark, (slice(None), slice(right - 1, right))) > frac:
        right -= 1

    if (top, bot, left, right) != (0, h, 0, w):
        out = im.crop((left, top, right, bot))
        out.save(path)
        print(f"{name}: {w}x{h} -> {out.width}x{out.height} (t{top} b{h-bot} l{left} r{w-right})")
    else:
        print(f"{name}: nothing trimmed")

for n in ["stage1-cut.png", "stage2-cut.png", "stage3-cut.png"]:
    trim(n)
print("done")
