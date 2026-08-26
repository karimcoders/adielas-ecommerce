"use client";

import { useCallback, useEffect, useState } from "react";
import { Star } from "lucide-react";
import { MaskedLines, Reveal } from "./Reveal";
import { ArrowUpRight } from "./icons";

const reviews = [
  {
    title: "Best matcha ever!",
    body: "Creamy, smooth and zero clumps. It genuinely tastes like the café version — minus the sugar coma.",
    name: "Amelia R.",
  },
  {
    title: "Super delicious!",
    body: "I stir in the cookie flavour and it feels like dessert for breakfast. My 3pm snack cravings are gone.",
    name: "Jonas K.",
  },
  {
    title: "Risk of addiction 🙈",
    body: "One shaker before work and I'm focused for hours. No jitters, no crash — just calm energy.",
    name: "Sofia M.",
  },
  {
    title: "The best Matcha.",
    body: "Tried five brands this year. Nothing comes close on taste, and the macros are unreal.",
    name: "Daniel P.",
  },
  {
    title: "Highly recommended!",
    body: "Lost 4 kg in two months without changing anything else. It keeps me full till lunch, every day.",
    name: "Lea B.",
  },
  {
    title: "Favorite!!!",
    body: "My whole gym crew is hooked now. Mixing is effortless and it never tastes chalky.",
    name: "Marco T.",
  },
];

function Stars() {
  return (
    <span className="flex gap-0.5 text-[var(--forest)]" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5 fill-current" />
      ))}
    </span>
  );
}

export function Reviews() {
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(3);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setPerView(1);
      else if (window.innerWidth < 1024) setPerView(2);
      else setPerView(3);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxIndex = Math.max(0, reviews.length - perView);
  const current = Math.min(index, maxIndex);
  const prev = useCallback(() => setIndex((i) => Math.min(i, maxIndex) <= 0 ? maxIndex : Math.min(i, maxIndex) - 1), [maxIndex]);
  const next = useCallback(() => setIndex((i) => Math.min(i, maxIndex) >= maxIndex ? 0 : Math.min(i, maxIndex) + 1), [maxIndex]);

  return (
    <section
      id="reviews"
      className="relative overflow-hidden bg-[var(--cream)] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <div>
            <p className="font-display text-sm tracking-[0.25em] text-[var(--forest)]/70">
              DON&apos;T TAKE OUR WORD FOR IT
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              <MaskedLines
                lines={[
                  <span key="r1" className="block">
                    Clean. Green.{" "}
                    <span className="font-script text-[1.15em] leading-none">
                      Goodness.
                    </span>
                  </span>,
                ]}
              />
            </h2>
          </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous reviews"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--forest)] text-[var(--cream)] transition hover:scale-110 hover:bg-[var(--forest-deep)]"
              >
                <ArrowUpRight className="h-5 w-5 rotate-[225deg]" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next reviews"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--forest)] text-[var(--cream)] transition hover:scale-110 hover:bg-[var(--forest-deep)]"
              >
                <ArrowUpRight className="h-5 w-5 rotate-45" />
              </button>
            </div>
          </Reveal>
        </div>

        <Reveal delay={140}>
          <div className="mt-12 overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ transform: `translateX(-${current * (100 / perView)}%)` }}
            >
              {reviews.map((review) => (
                <article
                  key={review.title}
                  className="shrink-0 px-2 sm:px-3"
                  style={{ width: `${100 / perView}%` }}
                >
                  <div className="flex h-full min-h-[210px] flex-col justify-between rounded-[1.6rem] bg-white p-6 shadow-[0_16px_40px_rgba(20,56,15,0.10)] transition-transform duration-300 hover:-translate-y-1.5 sm:p-7">
                    <div>
                      <div className="flex items-center justify-between">
                        <Stars />
                        <span className="font-script text-2xl leading-none text-[var(--forest)]/50">
                          more
                        </span>
                      </div>
                      <h3 className="mt-4 text-lg font-bold tracking-tight">{review.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--forest-deep)]/80">
                        {review.body}
                      </p>
                    </div>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-[var(--forest)]/60">
                      {review.name} · verified buyer
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
