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
    title: "Risk of addiction",
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

function Stars({ className = "" }: { className?: string }) {
  return (
    <span
      className={`flex gap-0.5 text-[var(--sage-deep)] ${className}`}
      aria-label="5 out of 5 stars"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5 fill-current" />
      ))}
    </span>
  );
}

function VerifiedBadge() {
  return (
    <span className="flex items-center gap-1.5 text-xs font-semibold">
      <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
        <path
          fill="var(--sage-deep)"
          d="M10 0l2.4 1.8 3-.2 1 2.8 2.6 1.6-.8 2.9.8 2.9-2.6 1.6-1 2.8-3-.2L10 20l-2.4-1.8-3 .2-1-2.8L1 13.8l.8-2.9L1 8l2.6-1.6 1-2.8 3 .2z"
        />
        <path
          d="M6.2 10.2l2.4 2.4 5-5"
          fill="none"
          stroke="#fff"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Verified
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
  // the centered (active) card renders white; the others stay glassy
  const activeIdx = current + Math.floor((perView - 1) / 2);
  const prev = useCallback(() => setIndex((i) => Math.min(i, maxIndex) <= 0 ? maxIndex : Math.min(i, maxIndex) - 1), [maxIndex]);
  const next = useCallback(() => setIndex((i) => Math.min(i, maxIndex) >= maxIndex ? 0 : Math.min(i, maxIndex) + 1), [maxIndex]);

  return (
    <section
      id="reviews"
      className="relative overflow-hidden bg-[var(--forest-deep)] py-20 sm:py-28"
    >
      {/* full-bleed photo backdrop */}
      <img
        src="/images/more/clip-morning.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[#3a4033]/72" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col items-center text-center">
          <Reveal variant="down">
            <p className="font-hand -rotate-3 text-2xl text-white/90">
              Premium Matcha Taste
            </p>
          </Reveal>
          <h2 className="mt-2 text-white">
            <MaskedLines
              lines={[
                <span
                  key="r1"
                  className="font-display block text-[clamp(3rem,8vw,6.5rem)] leading-[0.95]"
                >
                  CLEAN. GREEN.
                </span>,
                <span
                  key="r2"
                  className="font-display block text-[clamp(3rem,8vw,6.5rem)] leading-[0.95]"
                >
                  GOODNESS.
                </span>,
              ]}
            />
          </h2>
          <Reveal delay={200}>
            <p className="font-display mt-6 text-lg tracking-[0.14em] text-white sm:text-xl">
              DON&apos;T TAKE OUR WORD FOR IT
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous reviews"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[var(--forest)] transition hover:scale-110"
              >
                <ArrowUpRight className="h-5 w-5 rotate-[225deg]" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next reviews"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[var(--forest)] transition hover:scale-110"
              >
                <ArrowUpRight className="h-5 w-5 rotate-45" />
              </button>
            </div>
          </Reveal>
        </div>

        <Reveal delay={140}>
          <div className="mt-10 overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ transform: `translateX(-${current * (100 / perView)}%)` }}
            >
              {reviews.map((review, i) => {
                const active = i === activeIdx;
                return (
                  <article
                    key={review.title}
                    className="shrink-0 px-2 sm:px-3"
                    style={{ width: `${100 / perView}%` }}
                  >
                    <div
                      className={`flex h-full min-h-[230px] flex-col justify-between rounded-[1.4rem] p-6 transition-colors duration-500 sm:p-7 ${
                        active
                          ? "bg-white text-[var(--forest)] shadow-[0_24px_60px_rgba(0,0,0,0.35)]"
                          : "border border-white/35 bg-white/10 text-white backdrop-blur-sm"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <Stars />
                          {active && (
                            <span className="font-script text-2xl leading-none text-[var(--forest)]/40">
                              more
                            </span>
                          )}
                        </div>
                        <h3 className="mt-4 text-lg font-bold tracking-tight sm:text-xl">
                          {review.title}
                        </h3>
                        <p
                          className={`mt-2 text-sm leading-relaxed sm:text-base ${
                            active
                              ? "text-[var(--forest-deep)]/85"
                              : "text-white/85"
                          }`}
                        >
                          {review.body}
                        </p>
                      </div>
                      <div
                        className={`mt-5 flex items-center justify-between border-t pt-4 ${
                          active
                            ? "border-[var(--forest)]/15"
                            : "border-white/20"
                        }`}
                      >
                        <span className="text-sm font-bold">{review.name}</span>
                        <VerifiedBadge />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
