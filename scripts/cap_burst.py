#!/usr/bin/env python3
"""Burst-capture captcha frames and analyze which mouse jumps the lowest."""
import subprocess, time, glob, os

D = "/home/z/my-project/scripts"
# clean old burst frames
for f in glob.glob(f"{D}/burst_*.png"):
    os.remove(f)

N = 10
for i in range(N):
    subprocess.run(["agent-browser", "screenshot", f"{D}/burst_{i:02d}.png"],
                   capture_output=True, timeout=30)
    time.sleep(0.25)

frames = sorted(glob.glob(f"{D}/burst_*.png"))
print(f"captured {len(frames)} frames")
