import { Check, X } from "lucide-react";
import { Reveal } from "./Reveal";

const rows = [
  { label: "Protein per serving", more: "20 g", other: "~0 g" },
  { label: "Added sugar", more: "0 g", other: "15–25 g" },
  { label: "Natural caffeine + L-theanine", more: "85 mg", other: "varies" },
  { label: "Satiety fiber (glucomannan)", more: "included", other: "—" },
  { label: "Ready in 30 seconds", more: true, other: false },
];

export function Comparison() {
  return (
    <section className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
        <Reveal>
          <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            More for you.{" "}
            <span className="font-script text-[1.2em] leading-none">See the difference.</span>
          </h2>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-12 overflow-hidden rounded-[2rem] bg-white/70 shadow-[0_24px_60px_rgba(20,56,15,0.14)] backdrop-blur">
            {/* header */}
            <div className="grid grid-cols-[1.4fr_1fr_1fr] items-center gap-2 bg-[var(--forest)] px-4 py-5 text-[var(--cream)] sm:px-8">
              <span className="text-xs font-semibold uppercase tracking-widest sm:text-sm">
                What&apos;s inside
              </span>
              <span className="text-center">
                <span className="font-script block text-xl leading-none sm:text-2xl">more</span>
                <span className="mt-1 block text-[10px] font-semibold uppercase tracking-widest sm:text-xs">
                  Iced Matcha Latte
                </span>
              </span>
              <span className="text-center text-[10px] font-semibold uppercase tracking-widest opacity-75 sm:text-xs">
                Regular café matcha
              </span>
            </div>

            {/* rows */}
            {rows.map((row, i) => (
              <Reveal key={row.label} delay={i * 70} variant="left">
                <div
                  className={`grid grid-cols-[1.4fr_1fr_1fr] items-center gap-2 px-4 py-4 sm:px-8 sm:py-5 ${
                    i % 2 === 0 ? "bg-white/60" : "bg-transparent"
                  }`}
                >
                  <span className="text-xs font-semibold text-[var(--forest-deep)] sm:text-sm">
                    {row.label}
                  </span>
                  <span className="flex items-center justify-center gap-1.5 text-center">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--forest)] text-white">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    <span className="font-display text-sm text-[var(--forest)] sm:text-lg">
                      {typeof row.more === "string" ? row.more : ""}
                    </span>
                  </span>
                  <span className="flex items-center justify-center gap-1.5 text-center">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--sage-deep)] text-[var(--forest)]">
                      <X className="h-3 w-3" strokeWidth={3} />
                    </span>
                    <span className="text-xs font-medium text-[var(--forest-deep)]/60 sm:text-sm">
                      {typeof row.other === "string" ? row.other : ""}
                    </span>
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
