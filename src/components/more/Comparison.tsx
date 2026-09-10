import Link from "next/link";
import { Check, X, ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { Squiggle } from "./icons";
import { defaultComparison } from "@/lib/cms-defaults";

type ComparisonCms = Partial<typeof defaultComparison>;

function Smiley() {
  return (
    <span className="absolute -top-8 left-1/2 z-10 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full bg-[var(--cream-page)]">
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

export function Comparison({ cms }: { cms?: ComparisonCms }) {
  const c = { ...defaultComparison, ...(cms ?? {}) };
  const rows = Array.isArray(c.rows) && c.rows.length > 0 ? c.rows : defaultComparison.rows;

  return (
    <section className="relative bg-[var(--cream-page)] py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
        <Reveal variant="zoom">
          <div className="relative rounded-[2rem] bg-white p-4 shadow-[0_30px_70px_rgba(69,31,34,0.12)] sm:p-8 lg:p-10">
            <Smiley />

            <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
              {/* photo card */}
              <div className="relative overflow-hidden rounded-[1.4rem] bg-[var(--cloud)]">
                <img
                  src="/images/adielas/jar-open.png"
                  alt="ADIELAS jar opened to show sprouted grain powder with a wooden spoon"
                  loading="lazy"
                  className="h-full min-h-[260px] w-full object-cover sm:min-h-[320px]"
                />
                <svg
                  viewBox="0 0 400 500"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 h-full w-full"
                >
                  <path
                    d="M-20 380 C 120 300, 180 420, 330 330 S 460 160, 300 90"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="26"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* table */}
              <div>
                <h2 className="text-2xl font-semibold leading-tight tracking-tight text-[var(--forest)] sm:text-4xl">
                  {c.headingLine1}
                  <br />
                  <span className="text-[var(--sage-deep)]">
                    {c.headingLine2}
                  </span>
                </h2>

                <div className="mt-6 sm:mt-8">
                  {/* head */}
                  <div className="grid grid-cols-[1.5fr_0.8fr_0.8fr] items-end gap-1.5 border-b-2 border-[var(--forest)]/70 pb-3 sm:gap-2">
                    <span className="text-[11px] font-semibold text-[var(--olive)] sm:text-xs">
                      {c.colLeft}
                    </span>
                    <span className="font-script text-center text-xl leading-none text-[var(--forest)] sm:text-2xl">
                      {c.colMid}
                    </span>
                    <span className="text-center text-[11px] font-semibold text-[var(--olive)] sm:text-xs">
                      {c.colRight}
                    </span>
                  </div>

                  {rows.map((label, i) => (
                    <Reveal
                      key={label}
                      delay={i * 60}
                      variant="left"
                      className="border-b border-[var(--forest)]/12"
                    >
                      <div className="grid grid-cols-[1.5fr_0.8fr_0.8fr] items-center gap-1.5 py-2.5 sm:gap-2 sm:py-3.5">
                        <span className="text-xs font-semibold text-[var(--forest-deep)] sm:text-sm">
                          {label}
                        </span>
                        <span className="flex justify-center">
                          <span className="flex h-8 w-11 items-center justify-center rounded-lg bg-[var(--cloud)] sm:h-9 sm:w-16">
                            <Check
                              className="h-3.5 w-3.5 text-[var(--forest)] sm:h-4 sm:w-4"
                              strokeWidth={3}
                            />
                          </span>
                        </span>
                        <span className="flex justify-center">
                          <X
                            className="h-3.5 w-3.5 text-[var(--forest)]/70 sm:h-4 sm:w-4"
                            strokeWidth={3}
                          />
                        </span>
                      </div>
                    </Reveal>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between gap-4">
                  <Link
                    href={c.ctaLink}
                    className="btn-pill group px-5 py-2.5 text-sm sm:text-base"
                  >
                    {c.ctaText}
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                  </Link>
                  <Squiggle className="h-3 w-24 shrink-0 text-[var(--forest)]" />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
