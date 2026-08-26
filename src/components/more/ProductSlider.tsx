"use client";

import { useCallback, useEffect, useState } from "react";
import { Reveal } from "./Reveal";
import { Parallax } from "./motion";
import { ArrowUpRight, CurvedArrow } from "./icons";

const flavours = [
  {
    name: ["FUDGE", "BROWNIE"],
    image: "/images/more/pouch-fudge-cut.png",
    alt: "Chocolate brown flavour pouch",
    price: "€14.90",
  },
  {
    name: ["VANILLA CHOC", "CHIP COOKIE"],
    image: "/images/more/pouch-vanilla-choc-cut.png",
    alt: "Vanilla choc chip cookie flavour pouch",
    price: "€14.90",
  },
  {
    name: ["SALTED", "CARAMEL"],
    image: "/images/more/pouch-caramel-cut.png",
    alt: "Salted caramel flavour pouch",
    price: "€14.90",
  },
  {
    name: ["VANILLA", "PERFECTION"],
    image: "/images/more/pouch-vanilla-cut.png",
    alt: "Vanilla flavour pouch",
    price: "€14.90",
  },
  {
    name: ["STRAWBERRY", "PERFECTION"],
    image: "/images/more/pouch-strawberry-cut.png",
    alt: "Strawberry flavour pouch",
    price: "€14.90",
  },
];

export function ProductSlider() {
  const [index, setIndex] = useState(4);

  const prev = useCallback(
    () => setIndex((i) => (i <= 0 ? flavours.length - 1 : i - 1)),
    [],
  );
  const next = useCallback(
    () => setIndex((i) => (i >= flavours.length - 1 ? 0 : i + 1)),
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

  const active = flavours[index];

  return (
    <section id="shop" className="relative overflow-x-clip bg-[var(--cream-page)] pb-24 pt-20 sm:pb-32 sm:pt-28">
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
            <h2 className="font-display text-[clamp(3.2rem,9vw,7.5rem)] leading-[0.95] text-[var(--forest)]">
              FLAVOUR BOOST
            </h2>
            <p className="mt-3 text-2xl font-semibold text-[var(--sage-deep)] sm:text-3xl">
              New taste, low sugar
            </p>
            <p className="mx-auto mt-5 max-w-md text-sm font-medium leading-relaxed text-[var(--forest-deep)]/90 sm:text-base">
              Stir a 3 g scoop into your 300 ml iced matcha and turn today&apos;s
              sip into a dessert-level treat — under 15 calories a cup.
            </p>
          </div>
        </Reveal>

        {/* handwritten note */}
        <Reveal delay={140}>
          <div className="relative mx-auto max-w-6xl">
            <div className="absolute -top-2 left-0 hidden -rotate-6 text-[var(--forest)] lg:block">
              <p className="font-hand text-2xl leading-[0.95]">
                More flavour
                <br />
                combos
              </p>
              <CurvedArrow className="ml-8 mt-1 h-12 w-10 rotate-[115deg]" />
            </div>

            {/* composition: base combo + current flavour */}
            <div className="mt-14 flex items-center justify-center gap-4 sm:gap-10">
              <div className="relative flex w-[34%] max-w-[300px] items-end justify-center sm:w-[30%]">
                <img
                  src="/images/more/pouch-vanilla-cut.png"
                  alt=""
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 w-[68%] -rotate-[9deg] drop-shadow-[0_22px_30px_rgba(20,56,15,0.22)]"
                />
                <img
                  src="/images/more/can-green-cut.png"
                  alt="Protein iced matcha latte tub"
                  className="relative z-10 w-[72%] translate-x-[16%] drop-shadow-[0_26px_34px_rgba(20,56,15,0.26)]"
                />
              </div>

              <span className="font-display flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-3xl text-[var(--forest)] shadow-[0_14px_30px_rgba(20,56,15,0.14)] sm:h-16 sm:w-16 sm:text-4xl">
                +
              </span>

              <div className="relative flex w-[34%] max-w-[300px] items-end justify-center sm:w-[30%]">
                <img
                  key={active.image}
                  src={active.image}
                  alt={active.alt}
                  className="w-[86%] rotate-[7deg] drop-shadow-[0_26px_34px_rgba(20,56,15,0.26)] transition-opacity duration-300"
                />
              </div>
            </div>

            {/* flavour label + buy + arrows */}
            <div className="mt-10 flex flex-col items-center gap-6 text-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--olive)]">
                  Flavour Boost®
                </p>
                <h3 className="font-display mt-1 text-3xl leading-[0.95] text-[var(--forest)] sm:text-4xl">
                  {active.name[0]}
                  <br />
                  {active.name[1]}
                </h3>
              </div>
              <div className="flex items-center gap-6">
                <a href="#top" className="btn-pill group px-6 py-3 text-base">
                  Buy now
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                </a>
                <span className="text-base font-bold text-[var(--forest)]">
                  {active.price}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={prev}
                    aria-label="Previous flavour"
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[var(--forest)] shadow transition hover:scale-110"
                  >
                    <ArrowUpRight className="h-5 w-5 rotate-[225deg]" />
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    aria-label="Next flavour"
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
