#!/usr/bin/env python3
"""Remove backgrounds with rembg for floating product compositions."""
from rembg import remove, new_session
from PIL import Image
import os

DIR = "/home/z/my-project/public/images/more"
FILES = [
    "can-green.png",
    "ingredient-cookie.png",
    "ingredient-strawberry.png",
    "pouch-fudge.png",
    "pouch-vanilla-choc.png",
    "pouch-caramel.png",
    "pouch-vanilla.png",
    "pouch-strawberry.png",
]

session = new_session("u2net")

for name in FILES:
    src = os.path.join(DIR, name)
    if not os.path.exists(src):
        print(f"missing: {name}")
        continue
    img = Image.open(src).convert("RGB")
    out = remove(img, session=session, alpha_matting=False)
    # crop to content
    bbox = out.getbbox()
    if bbox:
        pad = 10
        w, h = out.size
        bbox = (
            max(0, bbox[0] - pad),
            max(0, bbox[1] - pad),
            min(w, bbox[2] + pad),
            min(h, bbox[3] + pad),
        )
        out = out.crop(bbox)
    dst = os.path.join(DIR, name.replace(".png", "-cut.png"))
    out.save(dst)
    print(f"OK {name} -> {os.path.basename(dst)} {out.size}")
print("done")
