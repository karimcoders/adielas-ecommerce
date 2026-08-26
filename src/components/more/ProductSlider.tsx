"use client";

import { useCallback, useEffect, useState } from "react";
import { Reveal } from "./Reveal";
import { ArrowUpRight } from "./icons";

const packs = [
  {
    name: ["FUDGE", "BROWNIE"],
    tint: "from-[#6f4a33] to-[#3f2a1c]",
    accent: "#d9b08c",
    price: "€14.90",
  },
  {
    name: ["VANILLA CHOC", "CHIP COOKIE"],
    tint: "from-[#d9c9a3] to-[#a68b5b]",
    accent: "#5f4028",
    price: "€14.90",
  },
  {
    name: ["SALTED", "CARAMEL"],
    tint: "from-[#e0b878] to-[#b07f3f]",
    accent: "#5c4322",
    price: "€14.90",
  },
  {
    name: ["VANILLA", "PERFECTION"],
    tint: "from-[#f2ecd9] to-[#cdbf96]",
    accent: "#6f5f38",
    price: "€14.90",
  },
  {
    name: ["STRAWBERRY", "PERFECTION"],
    tint: "from-[#f2b8c6] to-[#d96a86]",
    accent: "#7a2f42",
    price: "€14.90",
  },
];

function Pouch({ tint, accent }: { tint: string; accent: string }) {
  return (
    <div
      className={`relative mx-auto h-52 w-40 rounded-t-[1.4rem] rounded-b-[0.9rem] bg-gradient-to-b ${tint} shadow-[0_20px_40px_rgba(20,56,15,0.25),inset_-14px_0_24px_rgba(0,0,0,0.18),inset_12px_0_20px_rgba(255,255,255,0.18)] transition-transform duration-300 group-hover:-translate-y-2 group-hover:rotate-2`}
    >
      {/* crimp top */}
      <div className="absolute inset-x-0 -top-2 h-4 rounded-[50%] bg-white/25" />
      <div className="flex h-full flex-col items-center justify-center gap-1 px-4 text-center">
        <span className="font-script text-3xl leading-none text-white drop-shadow">more</span>
        <span className="text-[8px] font-bold uppercase tracking-[0.25em]" style={{ color: accent }}>
          Flavour Boost
        </span>
        <span className="mt-2 h-8 w-8 rounded-full bg-white/20 blur-[2px]" />
      </div>
    </div>
  );
}

export function ProductSlider() {
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(4);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setPerView(1);
      else if (window.innerWidth < 1024) setPerView(2);
      else if (window.innerWidth < 1280) setPerView(3);
      else setPerView(4);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxIndex = Math.max(0, packs.length - perView);
  const current = Math.min(index, maxIndex);
  const prev = useCallback(() => setIndex((i) => Math.min(i, maxIndex) <= 0 ? maxIndex : Math.min(i, maxIndex) - 1), [maxIndex]);
  const next = useCallback(() => setIndex((i) => Math.min(i, maxIndex) >= maxIndex ? 0 : Math.min(i, maxIndex) + 1), [maxIndex]);

  return (
    <section id="shop" className="relative overflow-hidden py-20 sm:py-28">
      {/* giant background script */}
      <span
        aria-hidden="true"
        className="font-script pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 select-none whitespace-nowrap text-[22vw] leading-none text-white/15"
      >
        boost it
      </span>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Flavour <span className="font-script text-[1.2em] leading-none">Boost</span>
            </h2>
            <h3 className="font-display mt-2 text-2xl text-[var(--forest-deep)] sm:text-3xl">
              NEW TASTE. LOW SUGAR.
            </h3>
            <p className="mt-4 text-sm font-medium leading-relaxed text-[var(--forest-deep)]/90 sm:text-base">
              Stir a 3 g scoop into your 300 ml iced matcha and turn today&apos;s
              sip into fudge brownie, salted caramel or strawberry perfection —
              under 15 calories, seriously dessert-level.
            </p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="relative mt-12">
            <div className="overflow-hidden px-1">
              <div
                className="flex transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ transform: `translateX(-${current * (100 / perView)}%)` }}
              >
                {packs.map((pack) => (
                  <div
                    key={pack.name.join(" ")}
                    className="shrink-0 px-2 sm:px-3"
                    style={{ width: `${100 / perView}%` }}
                  >
                    <div className="group flex h-full flex-col items-center rounded-[2rem] bg-white/55 p-6 pt-8 shadow-[0_18px_44px_rgba(20,56,15,0.12)] backdrop-blur transition hover:bg-white/75 sm:p-8">
                      <Pouch tint={pack.tint} accent={pack.accent} />
                      <h4 className="font-display mt-6 text-center text-lg leading-tight sm:text-xl">
                        {pack.name[0]}
                        <br />
                        {pack.name[1]}
                      </h4>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-[var(--forest)]/60">
                        Flavour Boost®
                      </p>
                      <p className="mt-2 text-base font-bold">{pack.price}</p>
                      <a
                        href="#top"
                        className="btn-pill group/btn mt-4 py-1.5 pl-1.5 pr-6 text-sm"
                        aria-label={`Buy ${pack.name.join(" ")}`}
                      >
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--cream)] text-[var(--forest)] transition-transform duration-300 group-hover/btn:rotate-45">
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </span>
                        Buy now
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* arrows */}
            <div className="mt-8 flex justify-center gap-3">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous products"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--forest)] text-[var(--cream)] transition hover:scale-110 hover:bg-[var(--forest-deep)]"
              >
                <ArrowUpRight className="h-5 w-5 rotate-[225deg]" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next products"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--forest)] text-[var(--cream)] transition hover:scale-110 hover:bg-[var(--forest-deep)]"
              >
                <ArrowUpRight className="h-5 w-5 rotate-45" />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
