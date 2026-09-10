"use client";

import { useCallback, useEffect, useState } from "react";
import { Star } from "lucide-react";
import { MaskedLines, Reveal } from "./Reveal";
import { ArrowUpRight } from "./icons";

const reviews = [
  {
    title: "Mealtimes made easy!",
    body: "My fussy eater finishes the whole bowl. It mixes smooth, tastes mildly sweet and I know exactly what's inside.",
    name: "Priya S.",
  },
  {
    title: "Clean label, finally.",
    body: "No long chemical names on the pack. Just sprouted grains and dry fruits — exactly what I wanted for my son.",
    name: "Rahul M.",
  },
  {
    title: "Stage 2 is a winner",
    body: "We moved from Stage 1 to Stage 2 seamlessly. Tummy-friendly and keeps him full through the morning.",
    name: "Anita K.",
  },
  {
    title: "Doctor-formulated trust",
    body: "Knowing a pediatrician co-created it gives me real peace of mind. You can taste the quality.",
    name: "Farhan A.",
  },
  {
    title: "Grandma approves too!",
    body: "Three generations agree — it feels like the traditional ragi porridge, just easier and more balanced.",
    name: "Lakshmi V.",
  },
  {
    title: "Travel-friendly nutrition",
    body: "Quick to prepare anywhere. It has become our go-to for daycare lunches and evening hunger pangs.",
    name: "Neha D.",
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

export function Reviews({ data }: { data?: any[] }) {
  const activeReviews =
    data && data.length > 0
      ? data.map((d: any) => ({
          title: d.childInfo || "Parent Review",
          body: d.text,
          name: d.parentName + (d.city ? ` · ${d.city}` : ""),
        }))
      : reviews;

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

  const maxIndex = Math.max(0, activeReviews.length - perView);
  const current = Math.min(index, maxIndex);
  const activeIdx = current + Math.floor((perView - 1) / 2);
  const prev = useCallback(() => setIndex((i) => Math.min(i, maxIndex) <= 0 ? maxIndex : Math.min(i, maxIndex) - 1), [maxIndex]);
  const next = useCallback(() => setIndex((i) => Math.min(i, maxIndex) >= maxIndex ? 0 : Math.min(i, maxIndex) + 1), [maxIndex]);


  return (
    <section
      id="doctor"
      className="relative overflow-hidden bg-[var(--forest-deep)] py-20 sm:py-28"
    >
      {/* full-bleed photo backdrop */}
      <img
        src="/images/adielas/why.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-[var(--forest-deep)]/78" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col items-center text-center">
          <Reveal variant="down">
            <p className="font-hand -rotate-3 text-2xl text-white/90">
              Loved by little tummies
            </p>
          </Reveal>
          <h2 className="mt-2 text-white">
            <MaskedLines
              lines={[
                <span
                  key="r1"
                  className="font-display block text-[clamp(2.6rem,7vw,5.6rem)] leading-[0.95]"
                >
                  HAPPY KIDS.
                </span>,
                <span
                  key="r2"
                  className="font-display block text-[clamp(2.6rem,7vw,5.6rem)] leading-[0.95]"
                >
                  HAPPIER PARENTS.
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
              {activeReviews.map((review: any, i: number) => {
                const active = i === activeIdx;
                return (
                  <article
                    key={review.title + i}
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
                              adielas
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
