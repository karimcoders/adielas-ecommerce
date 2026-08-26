import { Package, Truck } from "lucide-react";
import { Reveal } from "./Reveal";
import { ArrowUpRight, Squiggle } from "./icons";

const payments = ["VISA", "Mastercard", "PayPal", "Apple Pay", "G Pay", "Amex", "Klarna"];

export function CTA() {
  return (
    <section className="relative overflow-hidden bg-[var(--forest)] py-20 text-[var(--cream)] sm:py-28">
      {/* decorative rings */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-[26px] border-white/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 animate-spin-slow rounded-full border border-dashed border-white/20"
      />

      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
        <Reveal>
          <p className="font-display text-sm tracking-[0.3em] text-white/70">
            3–5 DAYS DELIVERY
          </p>
          <h2 className="font-display mt-4 text-[clamp(2.6rem,7vw,5.5rem)] leading-[0.95]">
            DON&apos;T JUST CRAVE IT.
            <br />
            <span className="text-white">GET IT.</span>
          </h2>
          <div className="mt-5 flex justify-center text-white/80">
            <Squiggle className="h-4 w-36" />
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#shop"
              className="group flex items-center gap-2 rounded-full bg-[var(--cream)] py-2 pl-2 pr-7 text-lg font-bold text-[var(--forest)] transition hover:scale-[1.03] hover:bg-white"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--forest)] text-[var(--cream)] transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight className="h-4 w-4" />
              </span>
              Shop all
            </a>
            <div className="flex items-center gap-4 text-xs font-semibold text-white/80 sm:text-sm">
              <span className="flex items-center gap-2">
                <Truck className="h-4 w-4" /> Free shipping over €50
              </span>
              <span className="hidden h-4 w-px bg-white/30 sm:block" />
              <span className="flex items-center gap-2">
                <Package className="h-4 w-4" /> 30-day returns
              </span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2.5">
            {payments.map((p) => (
              <span
                key={p}
                className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold tracking-wide text-white/90 ring-1 ring-inset ring-white/20"
              >
                {p}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
