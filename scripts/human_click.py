#!/usr/bin/env python3
"""Humanized captcha clicker: smooth approach curve + dwell + natural pacing.
Usage: python3 human_click.py X Y [verify_x verify_y]
"""
import subprocess, sys, time, random

def sh(*args, timeout=30):
    return subprocess.run(["agent-browser", *args], capture_output=True, timeout=timeout)

def jitter(v, amt=3):
    return v + random.randint(-amt, amt)

def move_curve(x0, y0, x1, y1, steps=14):
    """Ease-in-out path with slight arc + wobble."""
    cx = (x0 + x1) / 2 + random.randint(-25, 25)
    cy = (y0 + y1) / 2 + random.randint(-18, 18)
    for i in range(1, steps + 1):
        t = i / steps
        # quadratic bezier
        bx = (1-t)**2 * x0 + 2*(1-t)*t * cx + t**2 * x1
        by = (1-t)**2 * y0 + 2*(1-t)*t * cy + t**2 * y1
        sh("mouse", "move", str(int(bx)), str(int(by)))
        time.sleep(random.uniform(0.02, 0.06))

def click(x, y, last=(640, 400)):
    move_curve(last[0], last[1], x, y)
    time.sleep(random.uniform(0.15, 0.45))
    sh("mouse", "down", "left")
    time.sleep(random.uniform(0.09, 0.22))   # human press dwell
    sh("mouse", "up", "left")

target_x = int(sys.argv[1]); target_y = int(sys.argv[2])
do_verify = len(sys.argv) > 4
vx, vy = (int(sys.argv[3]), int(sys.argv[4])) if do_verify else (None, None)

# a bit of idle wandering first (humans fidget)
cur = (random.randint(300, 900), random.randint(200, 500))
sh("mouse", "move", str(cur[0]), str(cur[1]))
for _ in range(3):
    nxt = (jitter(cur[0], 60), jitter(cur[1], 40))
    move_curve(cur[0], cur[1], nxt[0], nxt[1], steps=5)
    cur = nxt
    time.sleep(random.uniform(0.1, 0.3))

click(target_x, target_y, last=cur)
time.sleep(random.uniform(0.8, 1.4))

if do_verify:
    click(vx, vy, last=(target_x, target_y))
    time.sleep(1.0)

print("humanized click done")
