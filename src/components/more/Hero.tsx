import { ArrowUpRight, CurvedArrow, Squiggle } from "./icons";
import { Reveal } from "./Reveal";

function BuyButton({ className = "" }: { className?: string }) {
  return (
    <a
      href="#shop"
      className={`btn-pill group py-1.5 pl-1.5 pr-7 text-base sm:text-lg ${className}`}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--cream)] text-[var(--forest)] transition-transform duration-300 group-hover:rotate-45">
        <ArrowUpRight className="h-4 w-4" />
      </span>
      Buy now
    </a>
  );
}

/** Pure-CSS drawn protein can */
function Can() {
  return (
    <div className="relative h-[300px] w-[190px] rotate-[14deg] sm:h-[360px] sm:w-[228px] lg:h-[420px] lg:w-[266px]">
      {/* lid */}
      <div className="absolute -top-3 left-1/2 h-12 w-[104%] -translate-x-1/2 rounded-[50%/60%] bg-[#eef2e6] shadow-[inset_0_-8px_14px_rgba(30,74,25,0.18)]" />
      <div className="absolute -top-1 left-1/2 h-5 w-[104%] -translate-x-1/2 rounded-[50%/60%] bg-white" />
      {/* body */}
      <div className="absolute inset-x-0 bottom-0 top-4 overflow-hidden rounded-t-[64px] rounded-b-[26px] bg-gradient-to-b from-[#87984f] via-[#95a75d] to-[#7c8d49] shadow-[inset_-24px_0_36px_rgba(20,56,15,0.25),inset_18px_0_30px_rgba(255,255,255,0.14),0_30px_50px_rgba(20,56,15,0.28)]">
        {/* label content */}
        <div className="flex h-full flex-col items-center px-5 pt-10 text-center sm:pt-12">
          <span className="font-script text-5xl leading-none text-[#f2f5e8] drop-shadow-sm sm:text-6xl">
            more
          </span>
          <span className="font-display mt-3 text-lg leading-[1.05] text-white sm:text-xl">
            PROTEIN
            <br />
            ICED MATCHA
            <br />
            LATTE
          </span>
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#e6eed7]">
            Original Taste
          </span>

          {/* tiny iced matcha glass illustration */}
          <div className="mt-5 flex items-end gap-1.5">
            <div className="relative h-16 w-12 rounded-b-xl rounded-t-md border-2 border-[#e9efdb]/80 bg-gradient-to-b from-[#d9e8b6]/70 via-[#a9c26a]/80 to-[#6f8f3f]">
              <div className="absolute inset-x-1.5 top-1.5 h-3 rounded-sm bg-white/50" />
              <div className="absolute -right-3 bottom-2 h-8 w-1.5 rotate-[16deg] rounded-full bg-[#e4ead1]" />
            </div>
            <div className="flex flex-col gap-1 pb-1">
              <span className="block h-1.5 w-8 rounded-full bg-white/40" />
              <span className="block h-1.5 w-6 rounded-full bg-white/40" />
              <span className="block h-1.5 w-7 rounded-full bg-white/40" />
            </div>
          </div>

          {/* small badges row */}
          <div className="mt-4 flex gap-2">
            {["20G", "95%", "85MG"].map((b) => (
              <span
                key={b}
                className="rounded-full border border-white/40 px-2 py-1 text-[8px] font-bold text-white/90"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
        {/* sheen */}
        <div className="pointer-events-none absolute inset-y-0 left-4 w-10 rounded-full bg-white/15 blur-md" />
      </div>
    </div>
  );
}

const stats = [
  { value: "20", unit: "G", label: "of Protein", pos: "left-[6%] top-[22%]", delay: "0s" },
  { value: "95", unit: "%", label: "less Sugar", pos: "left-[0%] top-[50%]", delay: "0.8s" },
  { value: "85", unit: "MG", label: "of Caffeine", pos: "left-[18%] top-[78%]", delay: "1.6s" },
];

function StatBubbles() {
  return (
    <>
      {/* arc path connecting bubbles */}
      <svg
        viewBox="0 0 320 360"
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <path
          d="M78 138C24 196 18 262 108 328"
          fill="none"
          stroke="#f4f8ee"
          strokeWidth="26"
          strokeLinecap="round"
          opacity="0.9"
        />
      </svg>
      {stats.map((s) => (
        <div
          key={s.label}
          className={`absolute z-10 ${s.pos} flex h-[88px] w-[88px] animate-floaty flex-col items-center justify-center rounded-full bg-[var(--cloud)] text-center shadow-[0_14px_30px_rgba(20,56,15,0.16)] sm:h-[104px] sm:w-[104px]`}
          style={{ animationDelay: s.delay }}
        >
          <span className="font-display text-2xl leading-none sm:text-3xl">
            {s.value}
            <span className="align-top text-base sm:text-lg">{s.unit}</span>
          </span>
          <span className="mt-1 px-2 text-[10px] font-semibold leading-tight sm:text-[11px]">
            {s.label}
          </span>
        </div>
      ))}
    </>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 sm:pt-28" id="top">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        {/* giant wordmark */}
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <h1 className="font-script select-none text-[clamp(5.5rem,17vw,15rem)] leading-[0.9] text-[var(--forest)]">
              more
            </h1>
          </Reveal>
          <Reveal delay={120} className="mt-2 sm:mt-4">
            <BuyButton />
          </Reveal>
        </div>

        {/* lower hero grid */}
        <div className="mt-10 grid items-center gap-10 pb-16 sm:mt-14 lg:mt-6 lg:grid-cols-2 lg:gap-4 lg:pb-24">
          {/* can composition */}
          <Reveal className="order-2 lg:order-1" delay={150}>
            <div className="relative mx-auto aspect-[320/360] w-full max-w-[420px]">
              <StatBubbles />
              <div className="absolute left-[58%] top-[54%] -translate-x-1/2 -translate-y-1/2">
                <Can />
              </div>
              {/* handwritten note */}
              <div className="absolute left-0 top-0 hidden -rotate-6 text-[var(--forest)] sm:block">
                <p className="font-hand text-2xl leading-[0.95]">
                  Real Matcha,
                  <br />
                  Original Taste
                </p>
                <CurvedArrow className="ml-6 mt-1 h-10 w-16 -scale-x-100" />
              </div>
            </div>
          </Reveal>

          {/* headline */}
          <div className="order-1 text-center lg:order-2 lg:pr-6 lg:text-center">
            <Reveal>
              <h2 className="font-display text-[clamp(3rem,8vw,6.5rem)] leading-[0.95]">
                <span className="text-white drop-shadow-[0_2px_0_rgba(30,74,25,0.08)]">
                  MATCHA
                </span>
                <br />
                <span className="text-[var(--forest)]">MEETS</span>
                <br />
                <span className="text-[var(--forest)]">PROTEIN</span>
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="mx-auto mt-6 max-w-md text-base font-medium leading-relaxed text-[var(--forest-deep)] sm:text-lg">
                Our Protein Iced Matcha Latte mixes ceremonial-style matcha with
                20g of protein and glucomannan fiber — a creamy ritual that
                keeps you full, focused and far from sugar crashes.
              </p>
              <div className="mt-4 flex justify-center text-[var(--forest)]">
                <Squiggle className="h-4 w-32" />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
