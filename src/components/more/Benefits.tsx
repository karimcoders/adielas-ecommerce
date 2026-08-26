import { HeartPulse, ShieldCheck, Sprout, Ban } from "lucide-react";
import { Reveal } from "./Reveal";

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

const scenes = [
  {
    Icon: Sprout,
    title: ["MORE", "GROWTH"],
    side: "right" as const,
    caption: (
      <>
        <Scribble>Sprouted ragi</Scribble> with multigrains and dry fruits —
        natural protein, fiber and amino acids for steady, healthy growth.
      </>
    ),
  },
  {
    Icon: ShieldCheck,
    title: ["MORE", "IMMUNITY"],
    side: "left" as const,
    caption: (
      <>
        Plant antioxidants, vitamins and minerals — polyphenols, flavonoids,
        carotenoids and more, straight from real food.
      </>
    ),
  },
  {
    Icon: HeartPulse,
    title: ["NO ADDED", "SUGAR"],
    side: "right" as const,
    caption: (
      <>
        Only the gentle, naturally occurring sweetness of grains and fruits —
        never a spoonful of refined sugar.
      </>
    ),
  },
  {
    Icon: Ban,
    title: ["THE 'NEVER'", "LIST"],
    side: "left" as const,
    caption: (
      <>
        No preservatives, colours, flavours, sweeteners, emulsifiers or
        thickeners. If a child doesn&apos;t need it, it stays out.
      </>
    ),
  },
];

export function Benefits() {
  return (
    <section
      id="benefits"
      className="relative overflow-x-clip bg-[var(--cream-page)] py-10 sm:py-16"
    >
      {/* white connector curve snaking through all scenes */}
      <svg
        viewBox="0 0 1440 3400"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <path
          d="M-80 240 C 320 60, 760 420, 1180 240 S 1560 620, 1120 900 C 700 1160, 320 1040, 220 1420 C 140 1780, 760 1740, 1120 1900 C 1500 2070, 1180 2460, 760 2480 C 380 2500, 240 2760, 560 2960 C 880 3160, 1300 3060, 1520 2860"
          fill="none"
          stroke="#ffffff"
          strokeWidth="42"
          strokeLinecap="round"
        />
      </svg>

      <div className="relative">
        {/* sticky pack riding the center of all scenes */}
        <div className="sticky top-[24vh] z-10 h-0">
          <div className="pointer-events-none mx-auto -mt-6 w-[150px] sm:w-[190px]">
            <div className="animate-sway">
              <img
                src="/images/adielas/stage3-cut.png"
                alt=""
                aria-hidden="true"
                className="w-full drop-shadow-[0_36px_40px_rgba(69,31,34,0.28)]"
              />
            </div>
          </div>
        </div>

        {scenes.map(({ Icon, title, side, caption }, i) => (
          <div
            key={title.join(" ")}
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
                    <span>{caption}</span>
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        ))}
      </div>
    </section>
  );
}
