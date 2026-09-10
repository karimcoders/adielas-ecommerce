"use client";

import { useEffect, useRef } from "react";
import { HeartPulse, ShieldCheck, Sprout, Ban } from "lucide-react";
import { Reveal } from "./Reveal";
import { defaultBenefits } from "@/lib/cms-defaults";

type BenefitsCms = Partial<typeof defaultBenefits>;

const SCENE_ICONS = [Sprout, ShieldCheck, HeartPulse, Ban];
const SCENE_SIDES = ["right", "left", "right", "left"] as const;

function Smiley({ className = "" }: { className?: string }) {
  return (
    <span
      className={`flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-[0_10px_24px_rgba(69,31,34,0.14)] ${className}`}
    >
      <svg viewBox="0 0 48 48" className="h-11 w-11" aria-hidden="true">
        <circle
          cx="24"
          cy="24"
          r="17"
          fill="none"
          stroke="var(--sage-deep)"
          strokeWidth="3"
        />
        <circle cx="18" cy="20" r="2.2" fill="var(--sage-deep)" />
        <circle cx="30" cy="20" r="2.2" fill="var(--sage-deep)" />
        <path
          d="M16 28c2.4 3.6 6 5.4 8 5.4s5.6-1.8 8-5.4"
          fill="none"
          stroke="var(--sage-deep)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

/* hand-drawn ellipse used to circle words */
function Scribble({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block px-2">
      {children}
      <svg
        viewBox="0 0 120 44"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-1 inset-y-0 h-full w-[calc(100%+8px)]"
      >
        <ellipse
          cx="60"
          cy="22"
          rx="56"
          ry="18"
          fill="none"
          stroke="var(--forest)"
          strokeWidth="2.5"
          transform="rotate(-3 60 22)"
        />
      </svg>
    </span>
  );
}


/* the white connector path in its 1440 x 3400 viewBox */
const PATH_D =
  "M-80 240 C 320 60, 760 420, 1180 240 S 1560 620, 1120 900 C 700 1160, 320 1040, 220 1420 C 140 1780, 760 1740, 1120 1900 C 1500 2070, 1180 2460, 760 2480 C 380 2500, 240 2760, 560 2960 C 880 3160, 1300 3060, 1520 2860";
const VB_W = 1440;
const VB_H = 3400;

/* Jar that rides the white curve: it stays centred vertically in the
   viewport (sticky) and slides left/right to sit exactly on the line,
   sampling the SVG path at the scroll depth. */
function LineRider() {
  const jarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const jar = jarRef.current;
    if (!jar) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const section = jar.closest("section");
    const path = section?.querySelector<SVGPathElement>("svg path");
    if (!section || !path) return;

    /* sample the path once */
    const L = path.getTotalLength();
    const N = 560;
    const xs = new Float32Array(N + 1);
    const ys = new Float32Array(N + 1);
    for (let i = 0; i <= N; i++) {
      const pt = path.getPointAtLength((L * i) / N);
      xs[i] = pt.x;
      ys[i] = pt.y;
    }

    let curX = 0.5;
    let curTilt = 0;
    let raf = 0;
    const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.bottom < -80 || rect.top > vh + 80) return;

      /* viewport centre line -> section fraction -> viewBox y */
      const centerYFrac = clamp01((vh / 2 - rect.top) / rect.height);
      const yTarget = centerYFrac * VB_H;

      /* nearest path sample to that height, biased to keep continuity */
      let best = 0;
      let bestScore = Infinity;
      for (let i = 0; i <= N; i++) {
        const score = Math.abs(ys[i] - yTarget) + Math.abs(xs[i] / VB_W - curX) * 300;
        if (score < bestScore) {
          bestScore = score;
          best = i;
        }
      }
      const targetX = Math.max(0.03, Math.min(0.97, xs[best] / VB_W));

      /* tilt from local tangent */
      const j = Math.min(N, best + 5);
      const k = Math.max(0, best - 5);
      const tilt = Math.max(-12, Math.min(12, ((xs[j] - xs[k]) / VB_W) * 90));

      curX += (targetX - curX) * 0.14;
      curTilt += (tilt - curTilt) * 0.08;

      /* fade out near the very start/end of the travel so the jar never
         parks over a neighbouring section's heading */
      const edge = Math.min(centerYFrac, 1 - centerYFrac);
      jar.style.opacity = edge < 0.012 ? "0" : "1";

      const offset = (curX - 0.5) * rect.width;
      jar.style.transform = `translate3d(${offset.toFixed(1)}px,0,0) rotate(${curTilt.toFixed(2)}deg)`;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="sticky top-[calc(50vh-104px)] z-10 h-0">
      <div className="pointer-events-none absolute left-1/2 top-0 w-[168px] -translate-x-1/2 sm:w-[208px]">
        <div
          ref={jarRef}
          style={{ willChange: "transform", transition: "opacity 500ms ease" }}
        >
          <img
            src="/images/adielas/jar-stage3-cut.png"
            alt=""
            aria-hidden="true"
            className="w-full drop-shadow-[0_36px_40px_rgba(69,31,34,0.28)]"
          />
        </div>
      </div>
    </div>
  );
}

export function Benefits({ cms }: { cms?: BenefitsCms }) {
  const c = { ...defaultBenefits, ...(cms ?? {}) };
  const scenes = (
    Array.isArray(c.scenes) && c.scenes.length > 0 ? c.scenes : defaultBenefits.scenes
  ).slice(0, 4);

  return (
    <section
      id="benefits"
      className="relative overflow-x-clip bg-[var(--cream-page)] py-10 sm:py-16"
    >
      {/* white connector curve snaking through all scenes */}
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="none"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <path
          d={PATH_D}
          fill="none"
          stroke="#ffffff"
          strokeWidth="42"
          strokeLinecap="round"
        />
      </svg>

      <div className="relative">
        {/* sticky jar riding the white line, centred in the viewport */}
        <LineRider />

        {scenes.map((scene, i) => {
          const Icon = SCENE_ICONS[i] ?? Sprout;
          const side = SCENE_SIDES[i] ?? "right";
          const title = [scene.titleLine1, scene.titleLine2];
          return (
          <div
            key={`${scene.titleLine1}-${scene.titleLine2}-${i}`}
            className="flex min-h-[86vh] items-center px-4 sm:px-6 lg:px-10"
          >
            <Reveal
              variant={side === "right" ? "right" : "left"}
              className={`w-full lg:w-1/2 ${
                side === "right" ? "lg:justify-self-end" : "lg:justify-self-start"
              }`}
            >
              <div className="relative mx-auto max-w-[560px]">
                <Smiley className="absolute -top-8 left-1/2 z-10 -translate-x-1/2" />
                <div className="rounded-[1.6rem] bg-[var(--sage-soft)] px-6 pb-10 pt-16 text-center shadow-[0_24px_60px_rgba(69,31,34,0.14)] sm:px-10 sm:pb-12">
                  <h3 className="font-display text-[clamp(2.4rem,5vw,4.2rem)] leading-[0.92] text-white">
                    {title[0]}
                    <br />
                    {title[1]}
                  </h3>
                  <p className="mx-auto mt-6 flex max-w-sm flex-wrap items-start justify-center gap-x-2 text-sm font-semibold leading-relaxed text-[var(--forest-deep)] sm:text-base">
                    <Icon className="mt-1 h-4 w-4 shrink-0" />
                    <span>
                      {scene.highlight ? <Scribble>{scene.highlight}</Scribble> : null}
                      {scene.body}
                    </span>
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
          );
        })}
      </div>
    </section>
  );
}
