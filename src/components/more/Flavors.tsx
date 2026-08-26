import { Reveal } from "./Reveal";

const flavors = [
  { name: "Original", colors: "from-[#9dbb6a] to-[#5c7a3f]" },
  { name: "Cookie", colors: "from-[#d9c39a] to-[#8a6b42]" },
  { name: "Strawberry", colors: "from-[#f2b8c6] to-[#d96a86]" },
  { name: "Banana", colors: "from-[#f4e3a1] to-[#d9b83f]" },
  { name: "Chocolate", colors: "from-[#b08d68] to-[#5f4028]" },
];

export function Flavors() {
  return (
    <section className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <Reveal>
          <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Matcha, just the way you like it.{" "}
            <span className="font-script text-[1.2em] leading-none">What&apos;s your flavour?</span>
          </h2>
        </Reveal>

        <div className="mt-12 flex flex-wrap items-start justify-center gap-8 sm:gap-12">
          {flavors.map((f, i) => (
            <Reveal key={f.name} delay={i * 90}>
              <div className="group flex w-24 flex-col items-center gap-3 sm:w-28">
                <div
                  className={`h-24 w-24 rounded-full bg-gradient-to-br ${f.colors} shadow-[0_16px_32px_rgba(20,56,15,0.22),inset_-10px_-12px_20px_rgba(20,56,15,0.25),inset_8px_8px_16px_rgba(255,255,255,0.35)] transition-transform duration-300 group-hover:-translate-y-2 group-hover:scale-105 sm:h-28 sm:w-28`}
                />
                <span className="font-display text-sm tracking-wide text-[var(--forest)] sm:text-base">
                  {f.name.toUpperCase()}
                </span>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={160}>
          <p className="mx-auto mt-10 max-w-xl text-center text-sm font-medium leading-relaxed text-[var(--forest-deep)]/90 sm:text-base">
            One 300ml base latte, endless moods — swap the flavour with a single
            scoop and your tastebuds never get bored.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
