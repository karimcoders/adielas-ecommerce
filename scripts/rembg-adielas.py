from rembg import remove, new_session
from PIL import Image
import os

DIR = "/home/z/my-project/public/images/adielas"
session = new_session("u2net")

for name in ["stage1.png", "stage2.png", "stage3.png"]:
    src = os.path.join(DIR, name)
    img = Image.open(src).convert("RGB")
    out = remove(img, session=session, alpha_matting=False)
    bbox = out.getbbox()
    if bbox:
        pad = 12
        w, h = out.size
        bbox = (max(0, bbox[0]-pad), max(0, bbox[1]-pad), min(w, bbox[2]+pad), min(h, bbox[3]+pad))
        out = out.crop(bbox)
    dst = os.path.join(DIR, name.replace(".png", "-cut.png"))
    out.save(dst)
    print("OK", name, "->", out.size)
