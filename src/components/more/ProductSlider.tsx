"use client";

import { useCallback, useEffect, useState } from "react";
import { Reveal } from "./Reveal";
import { Parallax } from "./motion";
import { ArrowUpRight, CurvedArrow } from "./icons";

const stages = [
  {
    name: ["STAGE 1", "FIRST WEANING"],
    age: "5 months+",
    image: "/images/adielas/stage1-cut.png",
    alt: "ADIELAS Stage 1 pack",
    price: "₹299",
    note: "Sprouted ragi, gently introduced",
  },
  {
    name: ["STAGE 2", "MULTIGRAIN"],
    age: "6 months+",
    image: "/images/adielas/stage2-cut.png",
    alt: "ADIELAS Stage 2 pack",
    price: "₹399",
    note: "Ragi plus a multigrain medley",
  },
  {
    name: ["STAGE 3", "DRY FRUITS"],
    age: "1 year+",
    image: "/images/adielas/stage3-cut.png",
    alt: "ADIELAS Stage 3 pack",
    price: "₹475",
    note: "Multigrains with premium dry fruits",
  },
];

export function ProductSlider() {
  const [index, setIndex] = useState(2);

  const prev = useCallback(
    () => setIndex((i) => (i <= 0 ? stages.length - 1 : i - 1)),
    [],
  );
  const next = useCallback(
    () => setIndex((i) => (i >= stages.length - 1 ? 0 : i + 1)),
    [],
  );

  // gentle auto-advance until the visitor interacts
  useEffect(() => {
    const id = window.setInterval(next, 5200);
    const stop = () => window.clearInterval(id);
    window.addEventListener("pointerdown", stop, { once: true });
    return () => {
      window.clearInterval(id);
      window.removeEventListener("pointerdown", stop);
    };
  }, [next]);

  const active = stages[index];

  return (
    <section
      id="shop"
      className="relative overflow-x-clip bg-[var(--cream-page)] pb-24 pt-20 sm:pb-32 sm:pt-28"
    >
      {/* big ring arc on the right */}
      <Parallax
        speed={0.1}
        className="pointer-events-none absolute -right-40 top-24 h-[520px] w-[520px] sm:-right-24"
      >
        <div className="h-full w-full rounded-full border-[46px] border-white" />
      </Parallax>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <Reveal>
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="font-display text-[clamp(3rem,8.5vw,7rem)] leading-[0.95] text-[var(--forest)]">
              PICK A STAGE
            </h2>
            <p className="mt-3 text-2xl font-semibold text-[var(--sage-deep)] sm:text-3xl">
              Clean, simple, age-wise nutrition
            </p>
            <p className="mx-auto mt-5 max-w-md text-sm font-medium leading-relaxed text-[var(--forest-deep)]/90 sm:text-base">
              400 g packs of sprouted, sun-dried goodness — formulated by a
              pediatrician, free from pesticides, preservatives and sugar.
            </p>
          </div>
        </Reveal>

        {/* handwritten note */}
        <Reveal delay={140}>
          <div className="relative mx-auto max-w-6xl">
            <div className="absolute -top-2 left-0 hidden -rotate-6 text-[var(--forest)] lg:block">
              <p className="font-hand text-2xl leading-[0.95]">
                Stage-wise
                <br />
                goodness
              </p>
              <CurvedArrow className="ml-8 mt-1 h-12 w-10 rotate-[115deg]" />
            </div>

            {/* composition: bowl illustration + current stage pack */}
            <div className="mt-14 flex items-center justify-center gap-6 sm:gap-14">
              <div className="relative flex w-[38%] max-w-[300px] items-end justify-center">
                <img
                  src="/images/adielas/logo.png"
                  alt=""
                  aria-hidden="true"
                  className="w-[78%] -rotate-[5deg] opacity-95 drop-shadow-[0_22px_30px_rgba(69,31,34,0.20)]"
                />
              </div>

              <span className="font-display flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-3xl text-[var(--forest)] shadow-[0_14px_30px_rgba(69,31,34,0.14)] sm:h-16 sm:w-16 sm:text-4xl">
                +
              </span>

              <div className="relative flex w-[38%] max-w-[300px] items-end justify-center">
                <img
                  key={active.image}
                  src={active.image}
                  alt={active.alt}
                  className="w-[88%] rotate-[5deg] drop-shadow-[0_26px_34px_rgba(69,31,34,0.26)]"
                />
              </div>
            </div>

            {/* stage label + buy + arrows */}
            <div className="mt-10 flex flex-col items-center gap-6 text-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--olive)]">
                  {active.age}
                </p>
                <h3 className="font-display mt-1 text-3xl leading-[0.95] text-[var(--forest)] sm:text-4xl">
                  {active.name[0]}
                  <br />
                  {active.name[1]}
                </h3>
                <p className="mt-2 text-sm font-medium text-[var(--forest-deep)]/80">
                  {active.note}
                </p>
              </div>
              <div className="flex items-center gap-6">
                <a href="#top" className="btn-pill group px-6 py-3 text-base">
                  Buy now
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                </a>
                <span className="text-lg font-bold text-[var(--forest)]">
                  {active.price}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={prev}
                    aria-label="Previous stage"
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[var(--forest)] shadow transition hover:scale-110"
                  >
                    <ArrowUpRight className="h-5 w-5 rotate-[225deg]" />
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    aria-label="Next stage"
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[var(--forest)] shadow transition hover:scale-110"
                  >
                    <ArrowUpRight className="h-5 w-5 rotate-45" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
