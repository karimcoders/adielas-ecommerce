import Link from "next/link";
import { Check, X, ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { Squiggle } from "./icons";

const rows = [
  "No added sugar",
  "No preservatives or colours",
  "Sprouted & sun-dried grains",
  "Pediatrician co-formulated",
  "Plant-based protein & fiber",
  "Naturally occurring nutrients",
  "Stage-wise for growing ages",
];

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

export function Comparison() {
  return (
    <section className="relative bg-[var(--cream-page)] py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
        <Reveal variant="zoom">
          <div className="relative rounded-[2rem] bg-white p-5 shadow-[0_30px_70px_rgba(69,31,34,0.12)] sm:p-8 lg:p-10">
            <Smiley />

            <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
              {/* photo card */}
              <div className="relative overflow-hidden rounded-[1.4rem] bg-[var(--cloud)]">
                <img
                  src="/images/adielas/jar-open.png"
                  alt="ADIELAS jar opened to show sprouted grain powder with a wooden spoon"
                  loading="lazy"
                  className="h-full min-h-[320px] w-full object-cover"
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
                <h2 className="text-3xl font-semibold leading-tight tracking-tight text-[var(--forest)] sm:text-4xl">
                  Every spoon, compared.
                  <br />
                  <span className="text-[var(--sage-deep)]">
                    The difference is clear.
                  </span>
                </h2>

                <div className="mt-8">
                  {/* head */}
                  <div className="grid grid-cols-[1.6fr_0.8fr_1fr] items-end gap-2 border-b-2 border-[var(--forest)]/70 pb-3">
                    <span className="text-xs font-semibold text-[var(--olive)]">
                      What matters
                    </span>
                    <span className="font-script text-center text-2xl leading-none text-[var(--forest)]">
                      adielas
                    </span>
                    <span className="text-center text-xs font-semibold text-[var(--olive)]">
                      Sugary kids drinks
                    </span>
                  </div>

                  {rows.map((label, i) => (
                    <Reveal
                      key={label}
                      delay={i * 60}
                      variant="left"
                      className="border-b border-[var(--forest)]/12"
                    >
                      <div className="grid grid-cols-[1.6fr_0.8fr_1fr] items-center gap-2 py-3.5">
                        <span className="text-sm font-semibold text-[var(--forest-deep)]">
                          {label}
                        </span>
                        <span className="flex justify-center">
                          <span className="flex h-9 w-16 items-center justify-center rounded-lg bg-[var(--cloud)]">
                            <Check
                              className="h-4 w-4 text-[var(--forest)]"
                              strokeWidth={3}
                            />
                          </span>
                        </span>
                        <span className="flex justify-center">
                          <X
                            className="h-4 w-4 text-[var(--forest)]/70"
                            strokeWidth={3}
                          />
                        </span>
                      </div>
                    </Reveal>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between gap-4">
                  <Link
                    href="/shop/stage-1"
                    className="btn-pill group px-5 py-2.5 text-sm sm:text-base"
                  >
                    Start with Stage 1
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
