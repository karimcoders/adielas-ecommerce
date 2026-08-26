import { Play, Star, VolumeX } from "lucide-react";
import { Reveal } from "./Reveal";
import { CurvedArrow } from "./icons";
import { ArrowUpRight } from "./icons";
import { Parallax } from "./motion";

const cards = [
  {
    image: "/images/adielas/stage1-cut.png",
    alt: "ADIELAS Stage 1 pack",
    rotate: "-rotate-6",
    pos: "left-0 top-[10%] w-[44%] sm:w-[42%]",
    z: "z-10",
    speed: 0.06,
    polaroid: true,
  },
  {
    image: "/images/adielas/why.jpg",
    alt: "Dr. Vandana Rao, pediatrician",
    rotate: "rotate-2",
    pos: "left-[26%] top-[30%] w-[46%] sm:w-[44%]",
    z: "z-20",
    speed: -0.04,
    polaroid: true,
    tag: "DR. VANDANA RAO",
  },
  {
    image: "/images/adielas/stage2-cut.png",
    alt: "ADIELAS Stage 2 pack",
    rotate: "-rotate-1",
    pos: "left-[48%] top-[2%] w-[48%] sm:w-[46%]",
    z: "z-30",
    speed: 0.09,
    polaroid: false,
  },
];

export function Mission() {
  return (
    <section
      id="why"
      className="relative z-0 -mt-24 overflow-x-clip rounded-t-[50%_70px] bg-[var(--cream-page)] pb-20 pt-32 sm:-mt-36 sm:rounded-t-[50%_120px] sm:pt-44"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <Reveal>
          <h2 className="mx-auto max-w-4xl text-center text-3xl font-semibold leading-tight tracking-tight text-[var(--forest)] sm:text-4xl lg:text-5xl">
            Why settle for complicated labels?
            <br />
            Your child deserves simple, honest food:
            <br />
            <span className="text-[var(--sage-deep)]">ADIELAS Nutrition.</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid items-center gap-12 lg:mt-20 lg:grid-cols-2 lg:gap-8">
          {/* tilted collage */}
          <div className="relative mx-auto aspect-[5/4] w-full max-w-[560px]">
            {cards.map((card, i) => (
              <Parallax
                key={card.image}
                speed={card.speed}
                className={`absolute ${card.pos} ${card.z}`}
              >
                <Reveal variant="zoom" delay={i * 140}>
                  <div
                    className={`relative ${
                      card.polaroid
                        ? "rounded-xl border-[6px] border-white bg-white shadow-[0_24px_50px_rgba(69,31,34,0.18)]"
                        : ""
                    }`}
                  >
                    <img
                      src={card.image}
                      alt={card.alt}
                      loading="lazy"
                      className={`w-full object-cover ${card.rotate} ${
                        card.polaroid
                          ? "rounded-lg"
                          : "drop-shadow-[0_26px_36px_rgba(69,31,34,0.24)]"
                      }`}
                    />
                    {card.tag && (
                      <span className="font-display absolute bottom-2 left-1/2 w-[86%] -translate-x-1/2 rounded bg-[var(--forest)] py-1 text-center text-[10px] tracking-[0.18em] text-[var(--cream)]">
                        {card.tag}
                      </span>
                    )}
                    {!card.polaroid && (
                      <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 hover:opacity-100">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/85 text-[var(--forest)] shadow">
                          <Play className="ml-0.5 h-5 w-5 fill-current" />
                        </span>
                      </span>
                    )}
                  </div>
                </Reveal>
              </Parallax>
            ))}
          </div>

          {/* copy block */}
          <div>
            <Reveal variant="left">
              <p className="text-2xl font-bold leading-snug tracking-tight text-[var(--forest)] sm:text-3xl">
                Co-created by a senior pediatrician and a nutrition PhD —
                ancient grains, revived for little ones.
              </p>
            </Reveal>
            <Reveal variant="left" delay={120}>
              <p className="mt-6 max-w-lg text-base font-medium leading-relaxed text-[var(--forest-deep)]/90 sm:text-lg">
                ADIELAS blends clinical know-how with a mother&apos;s care:
                organically sourced grains, sprouted and naturally sun-dried,
                then balanced with modern nutritional science. Simple,
                everyday food for holistic growth — nothing more hidden in
                the pack.
              </p>
            </Reveal>
            <Reveal variant="left" delay={200}>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <a href="#shop" className="btn-pill group px-6 py-3 text-base">
                  Shop now
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                </a>
                <a
                  href="#doctor"
                  className="flex items-center gap-2 text-sm font-semibold text-[var(--forest)]"
                >
                  <span className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </span>
                  <span className="underline underline-offset-4">
                    A doctor&apos;s promise
                  </span>
                </a>
              </div>
            </Reveal>
            <Reveal delay={280}>
              <div className="mt-10 rotate-[-4deg] text-[var(--forest)]">
                <p className="font-hand text-2xl leading-[0.95]">
                  Why parents
                  <br />
                  trust it
                </p>
                <CurvedArrow className="mt-1 h-12 w-10 rotate-[130deg]" />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
