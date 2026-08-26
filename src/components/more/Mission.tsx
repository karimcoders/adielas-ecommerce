import { Play, Star, VolumeX } from "lucide-react";
import { Reveal } from "./Reveal";
import { CurvedArrow } from "./icons";
import { ArrowUpRight } from "./icons";
import { Parallax } from "./motion";

const clips = [
  {
    image: "/images/more/clip-shake.png",
    alt: "Shaker bottle with creamy iced matcha latte",
    rotate: "-rotate-6",
    pos: "left-0 top-[6%] w-[46%] sm:w-[44%]",
    muted: false,
    z: "z-10",
    speed: 0.06,
  },
  {
    image: "/images/more/clip-gym.png",
    alt: "Athlete drinking a matcha protein smoothie after a workout",
    rotate: "rotate-2",
    pos: "left-[24%] top-[26%] w-[50%] sm:w-[48%]",
    muted: true,
    z: "z-20",
    speed: -0.04,
  },
  {
    image: "/images/more/clip-morning.png",
    alt: "Glass of iced matcha latte on a sunlit kitchen counter",
    rotate: "-rotate-1",
    pos: "left-[44%] top-0 w-[52%] sm:w-[50%]",
    muted: true,
    z: "z-30",
    speed: 0.09,
  },
];

export function Mission() {
  return (
    <section
      id="nutrition"
      className="relative z-0 -mt-24 overflow-x-clip rounded-t-[50%_70px] bg-[var(--cream-page)] pb-20 pt-32 sm:-mt-36 sm:rounded-t-[50%_120px] sm:pt-44"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <Reveal>
          <h2 className="mx-auto max-w-4xl text-center text-3xl font-semibold leading-tight tracking-tight text-[var(--forest)] sm:text-4xl lg:text-5xl">
            Second-rate nutrition? Hard pass.
            <br />
            Your daily ritual deserves better:
            <br />
            <span className="text-[var(--sage-deep)]">Iced Matcha Latte.</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid items-center gap-12 lg:mt-20 lg:grid-cols-2 lg:gap-8">
          {/* tilted polaroid collage */}
          <div className="relative mx-auto aspect-[5/4] w-full max-w-[560px]">
            {clips.map((clip, i) => (
              <Parallax
                key={clip.image}
                speed={clip.speed}
                className={`absolute ${clip.pos} ${clip.z}`}
              >
                <Reveal variant="zoom" delay={i * 140}>
                  <button
                    type="button"
                    className={`group relative block overflow-hidden rounded-xl border-[6px] border-white bg-white shadow-[0_24px_50px_rgba(20,56,15,0.18)] transition-transform duration-300 hover:scale-[1.03] ${clip.rotate}`}
                    aria-label={`Play community clip ${i + 1}`}
                  >
                    <img
                      src={clip.image}
                      alt={clip.alt}
                      loading="lazy"
                      className="aspect-[3/4] w-full object-cover"
                    />
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/85 text-[var(--forest)] opacity-90 shadow transition-transform duration-300 group-hover:scale-110">
                        <Play className="ml-0.5 h-5 w-5 fill-current" />
                      </span>
                    </span>
                    {clip.muted && (
                      <span className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/45 text-white">
                        <VolumeX className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </button>
                </Reveal>
              </Parallax>
            ))}
          </div>

          {/* copy block */}
          <div>
            <Reveal variant="left">
              <p className="text-2xl font-bold leading-snug tracking-tight text-[var(--forest)] sm:text-3xl">
                Honest, science-backed nutrition — that actually tastes
                amazing. Feel better, do more, enjoy every sip.
              </p>
            </Reveal>
            <Reveal variant="left" delay={120}>
              <p className="mt-6 max-w-lg text-base font-medium leading-relaxed text-[var(--forest-deep)]/90 sm:text-lg">
                Thousands of our community stir this mix into ice and milk
                every day: real green tea powder, quality protein and
                glucomannan fiber. Ridiculously creamy, never boring.
              </p>
            </Reveal>
            <Reveal variant="left" delay={200}>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <a href="#shop" className="btn-pill group px-6 py-3 text-base">
                  Buy now
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                </a>
                <a
                  href="#reviews"
                  className="flex items-center gap-2 text-sm font-semibold text-[var(--forest)]"
                >
                  <span className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </span>
                  <span className="underline underline-offset-4">
                    3,158 Reviews
                  </span>
                </a>
              </div>
            </Reveal>
            <Reveal delay={280}>
              <div className="mt-10 rotate-[-4deg] text-[var(--forest)]">
                <p className="font-hand text-2xl leading-[0.95]">
                  Why people
                  <br />
                  love it
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
