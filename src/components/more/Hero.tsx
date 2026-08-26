import { ArrowUpRight, CurvedArrow, Squiggle } from "./icons";
import { MaskedLines, Reveal } from "./Reveal";
import { Counter, Parallax } from "./motion";

function BuyButton({ className = "" }: { className?: string }) {
  return (
    <a
      href="#shop"
      className={`btn-pill group py-1.5 pl-1.5 pr-7 text-base sm:text-lg ${className}`}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--cream)] text-[var(--forest)] transition-transform duration-300 group-hover:rotate-45">
        <ArrowUpRight className="h-4 w-4" />
      </span>
      Buy now
    </a>
  );
}

const stats = [
  { to: 20, unit: "G", label: "of Protein", pos: "left-[54%] top-[3%]", delay: 300 },
  { to: 95, unit: "%", label: "less Sugar", pos: "left-[16%] top-[30%]", delay: 600 },
  { to: 85, unit: "MG", label: "of Caffeine", pos: "left-[0%] top-[62%]", delay: 900 },
];

/* bubbles parked along the big white ring path */
function StatBubbles() {
  return (
    <>
      {stats.map((s, i) => (
        <Reveal
          key={s.label}
          variant="zoom"
          delay={s.delay}
          className={`absolute z-10 ${s.pos}`}
        >
          <div
            className="flex h-[84px] w-[84px] animate-floaty flex-col items-center justify-center rounded-full bg-[var(--cream)] text-center text-[var(--forest)] shadow-[0_14px_30px_rgba(20,56,15,0.10)] sm:h-[104px] sm:w-[104px]"
            style={{ animationDelay: `${i * 0.8}s` }}
          >
            <span className="font-display text-2xl leading-none sm:text-3xl">
              <Counter to={s.to} />
              <span className="align-top text-base sm:text-lg">{s.unit}</span>
            </span>
            <span className="mt-1 px-2 text-[10px] font-semibold leading-tight sm:text-[11px]">
              {s.label}
            </span>
          </div>
        </Reveal>
      ))}
    </>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 sm:pt-28" id="top">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        {/* giant wordmark */}
        <div className="flex flex-col items-center text-center">
          <h1 className="text-center">
            <MaskedLines
              lines={[
                <span
                  key="mark"
                  className="font-script select-none text-[clamp(5.5rem,17vw,15rem)] leading-[0.9] text-[var(--forest)]"
                >
                  more
                </span>,
              ]}
            />
          </h1>
          <Reveal delay={220} variant="down" className="mt-2 sm:mt-4">
            <BuyButton />
          </Reveal>
        </div>

        {/* lower hero grid */}
        <div className="mt-8 grid items-start gap-6 pb-10 sm:mt-4 lg:grid-cols-2 lg:gap-2 lg:pb-0">
          {/* can + ring composition */}
          <Reveal className="order-2 lg:order-1" delay={150} variant="right">
            <div className="relative mx-auto aspect-square w-full max-w-[560px]">
              {/* big white ring */}
              <div
                aria-hidden="true"
                className="absolute left-[6%] top-[4%] h-[92%] w-[92%] rounded-full border-[26px] border-white sm:border-[34px]"
              />
              <StatBubbles />

              {/* tilted can cutout, floating over the ring */}
              <Parallax speed={0.05} className="absolute inset-0">
                <div className="animate-sway absolute left-1/2 top-1/2 w-[52%] -translate-x-1/2 -translate-y-[48%] sm:w-[56%]">
                  <img
                    src="/images/more/can-green-cut.png"
                    alt="Protein iced matcha latte tub"
                    className="w-full -rotate-6 drop-shadow-[0_40px_44px_rgba(20,56,15,0.35)]"
                  />
                </div>
              </Parallax>

              {/* handwritten note */}
              <div className="absolute -left-2 top-[6%] hidden -rotate-6 text-[var(--forest)] sm:block">
                <p className="font-hand text-2xl leading-[0.95]">
                  Real Matcha,
                  <br />
                  Original Taste
                </p>
                <CurvedArrow className="ml-2 mt-1 h-10 w-16 -scale-x-100" />
              </div>
            </div>
          </Reveal>

          {/* headline */}
          <div className="order-1 pt-4 text-center lg:order-2 lg:pt-24 lg:text-center">
            <h2 className="text-center">
              <MaskedLines
                startDelay={140}
                lines={[
                  <span
                    key="l1"
                    className="font-display block text-[clamp(3rem,7.5vw,6rem)] leading-[0.95] text-white drop-shadow-[0_2px_0_rgba(30,74,25,0.08)]"
                  >
                    MATCHA
                  </span>,
                  <span
                    key="l2"
                    className="font-display block text-[clamp(3rem,7.5vw,6rem)] leading-[0.95] text-[var(--forest)]"
                  >
                    MEETS
                  </span>,
                  <span
                    key="l3"
                    className="font-display block text-[clamp(3rem,7.5vw,6rem)] leading-[0.95] text-[var(--forest)]"
                  >
                    PROTEIN
                  </span>,
                ]}
              />
            </h2>
            <Reveal delay={200}>
              <p className="mx-auto mt-6 max-w-md text-base font-medium leading-relaxed text-[var(--forest-deep)] sm:text-lg">
                Our Protein Iced Matcha Latte blends true matcha with protein
                and glucomannan, a natural fiber that helps you stay full —
                creamy, green and crash-free.
              </p>
              <div className="mt-4 flex justify-center text-[var(--forest)]">
                <Squiggle className="h-4 w-32" />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
