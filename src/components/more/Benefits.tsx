import { Coffee, Leaf, Scale, XCircle } from "lucide-react";
import { Reveal } from "./Reveal";

const benefits = [
  {
    Icon: Leaf,
    title: "MORE TASTE",
    copy: "Ceremonial-grade matcha, stone-ground slow for a naturally sweet, umami-rich sip — never bitter.",
  },
  {
    Icon: Coffee,
    title: "MORE CAFFEINE",
    copy: "85mg of clean caffeine paired with L-theanine for calm, crash-free energy that lasts hours.",
  },
  {
    Icon: Scale,
    title: "MORE WEIGHT LOSS",
    copy: "20g protein plus glucomannan fiber keep you fuller for longer, so snacking quietly steps aside.",
  },
  {
    Icon: XCircle,
    title: "NO ADDED SUGAR",
    copy: "95% less sugar than a café latte. All creaminess, zero of the syrupy regret.",
  },
];

export function Benefits() {
  return (
    <section id="benefits" className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="space-y-6 sm:space-y-10">
          {benefits.map(({ Icon, title, copy }, i) => (
            <Reveal key={title} delay={i * 80}>
              <div className="group flex flex-col gap-4 border-b-2 border-[var(--forest)]/15 pb-6 sm:flex-row sm:items-center sm:gap-10 sm:pb-10">
                <div className="flex items-center gap-4 sm:w-[46%] sm:shrink-0">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--forest)] text-[var(--cream)] transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 sm:h-16 sm:w-16">
                    <Icon className="h-5 w-5 sm:h-7 sm:w-7" />
                  </span>
                  <h3
                    className={`font-display text-[clamp(2rem,6vw,4.5rem)] leading-none transition-colors duration-300 ${
                      i % 2 === 0 ? "text-[var(--forest)]" : "text-white"
                    } group-hover:text-[var(--forest-deep)]`}
                  >
                    {title}
                  </h3>
                </div>
                <p className="max-w-md text-sm font-medium leading-relaxed text-[var(--forest-deep)]/90 sm:text-base">
                  {copy}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
