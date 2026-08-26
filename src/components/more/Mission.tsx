import { Play, Star } from "lucide-react";
import { Reveal } from "./Reveal";
import { ArrowUpRight } from "./icons";

const clips = [
  {
    title: "Shake it, sip it",
    image: "/images/more/clip-shake.png",
    alt: "Shaker bottle with creamy iced matcha latte",
    seconds: "0:14",
  },
  {
    title: "Morning ritual",
    image: "/images/more/clip-morning.png",
    alt: "Glass of iced matcha latte on a sunlit kitchen counter",
    seconds: "0:22",
  },
  {
    title: "Post-workout glow",
    image: "/images/more/clip-gym.png",
    alt: "Athlete drinking a matcha protein smoothie after a workout",
    seconds: "0:31",
  },
];

export function Mission() {
  return (
    <section id="nutrition" className="relative overflow-hidden py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <Reveal>
          <h2 className="mx-auto max-w-4xl text-center text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            You deserve the good stuff.
            <br />
            You deserve <span className="font-script text-[1.15em] leading-none">more</span> — Iced
            Matcha Latte.
          </h2>
        </Reveal>

        {/* clip cards */}
        <div className="mt-12 grid gap-4 sm:gap-6 md:grid-cols-3">
          {clips.map((clip, i) => (
            <Reveal key={clip.title} delay={i * 120}>
              <button
                type="button"
                className="group relative flex h-56 w-full items-center justify-center overflow-hidden rounded-[2rem] shadow-[0_18px_40px_rgba(20,56,15,0.18)] transition-transform duration-300 hover:-translate-y-1.5 sm:h-64"
                aria-label={`Play clip: ${clip.title}`}
              >
                <img
                  src={clip.image}
                  alt={clip.alt}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-[var(--forest-deep)]/55 via-transparent to-black/10" />
                <span className="absolute left-4 top-4 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                  {clip.seconds}
                </span>
                <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/85 text-[var(--forest)] shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <Play className="ml-0.5 h-6 w-6 fill-current" />
                </span>
                <span className="font-display absolute bottom-4 left-5 text-left text-xl text-white drop-shadow">
                  {clip.title}
                </span>
              </button>
            </Reveal>
          ))}
        </div>

        {/* mission statement */}
        <Reveal delay={120}>
          <div className="mx-auto mt-16 max-w-3xl text-center sm:mt-20">
            <h3 className="text-xl font-semibold leading-snug sm:text-2xl lg:text-[1.75rem]">
              We keep healthy nutrition simple: real ingredients, science-backed
              doses and flavours you actually crave — so feeling your best
              becomes the easiest part of your day.
            </h3>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a href="#shop" className="btn-pill group px-6 py-3 text-base">
                Buy now
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
              </a>
              <a href="#reviews" className="flex items-center gap-2 text-sm font-semibold">
                <span className="flex gap-0.5 text-[var(--forest)]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </span>
                3,158 verified reviews
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
