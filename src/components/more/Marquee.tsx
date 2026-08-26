import { ArrowUpRight } from "./icons";

const items = Array.from({ length: 8 });

export function Marquee() {
  return (
    <section aria-hidden="true" className="relative z-10 -rotate-1 overflow-hidden bg-[var(--cream)] py-4 shadow-[0_10px_30px_rgba(20,56,15,0.08)]">
      <div className="flex w-max animate-marquee items-center gap-8 pr-8">
        {[0, 1].map((half) => (
          <div key={half} className="flex items-center gap-8">
            {items.map((_, i) => (
              <span
                key={`${half}-${i}`}
                className="font-display flex items-center gap-8 whitespace-nowrap text-2xl text-[var(--forest)] sm:text-3xl"
              >
                IT&apos;S A MATCH(A)
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--forest)] text-[var(--cream)]">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
