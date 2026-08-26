"use client";

import { useCallback, useEffect, useState } from "react";
import { Reveal } from "./Reveal";
import { ArrowUpRight } from "./icons";

const packs = [
  {
    name: ["FUDGE", "BROWNIE"],
    image: "/images/more/pouch-fudge.png",
    alt: "Chocolate brown flavour pouch",
    price: "€14.90",
  },
  {
    name: ["VANILLA CHOC", "CHIP COOKIE"],
    image: "/images/more/pouch-vanilla-choc.png",
    alt: "Vanilla choc chip cookie flavour pouch",
    price: "€14.90",
  },
  {
    name: ["SALTED", "CARAMEL"],
    image: "/images/more/pouch-caramel.png",
    alt: "Salted caramel flavour pouch",
    price: "€14.90",
  },
  {
    name: ["VANILLA", "PERFECTION"],
    image: "/images/more/pouch-vanilla.png",
    alt: "Vanilla perfection flavour pouch",
    price: "€14.90",
  },
  {
    name: ["STRAWBERRY", "PERFECTION"],
    image: "/images/more/pouch-strawberry.png",
    alt: "Strawberry perfection flavour pouch",
    price: "€14.90",
  },
];

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
                    <div className="group flex h-full flex-col items-center rounded-[2rem] bg-white/55 p-4 pt-4 shadow-[0_18px_44px_rgba(20,56,15,0.12)] backdrop-blur transition hover:bg-white/75 sm:p-5">
                      <div className="w-full overflow-hidden rounded-3xl">
                        <img
                          src={pack.image}
                          alt={pack.alt}
                          className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-64"
                        />
                      </div>
                      <h4 className="font-display mt-5 text-center text-lg leading-tight sm:text-xl">
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
