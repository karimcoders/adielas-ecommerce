import Link from "next/link";
import { ArrowUpRight, CurvedArrow, Squiggle } from "./icons";
import { MaskedLines, Reveal } from "./Reveal";
import { Counter, Parallax } from "./motion";

function BuyButton({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/shop"
      className={`btn-pill group py-1.5 pl-1.5 pr-7 text-base sm:text-lg ${className}`}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--cream)] text-[var(--forest)] transition-transform duration-300 group-hover:rotate-45">
        <ArrowUpRight className="h-4 w-4" />
      </span>
      Shop now
    </Link>
  );
}

const stats = [
  { to: 100, unit: "%", label: "Organic Grains", pos: "left-[54%] top-[3%]", delay: 300 },
  { to: 0, unit: "", label: "Added Sugar", pos: "left-[16%] top-[30%]", delay: 600 },
  { to: 35, unit: "+", label: "Yrs Expertise", pos: "left-[0%] top-[62%]", delay: 900 },
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
            className="flex h-[84px] w-[84px] animate-floaty flex-col items-center justify-center rounded-full bg-[var(--cream)] text-center text-[var(--forest)] shadow-[0_14px_30px_rgba(69,31,34,0.12)] sm:h-[104px] sm:w-[104px]"
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
        {/* brand crest + giant script wordmark */}
        <div className="flex flex-col items-center text-center">
          <Reveal variant="zoom">
            <img
              src="/images/adielas/logo.png"
              alt="ADIELAS"
              className="h-14 w-auto sm:h-20"
            />
          </Reveal>
          <h1 className="text-center">
            <MaskedLines
              lines={[
                <span
                  key="mark"
                  className="font-script select-none text-[clamp(4.5rem,13vw,11rem)] leading-[0.95] text-[var(--forest)]"
                >
                  adielas
                </span>,
              ]}
            />
          </h1>
          <Reveal delay={220} variant="down" className="mt-1 sm:mt-2">
            <BuyButton />
          </Reveal>
        </div>

        {/* lower hero grid */}
        <div className="mt-8 grid items-start gap-6 pb-10 sm:mt-4 lg:grid-cols-2 lg:gap-2 lg:pb-0">
          {/* pack + ring composition */}
          <Reveal className="order-2 lg:order-1" delay={150} variant="right">
            <div className="relative mx-auto aspect-square w-full max-w-[560px]">
              {/* big white ring */}
              <div
                aria-hidden="true"
                className="absolute left-[6%] top-[4%] h-[92%] w-[92%] rounded-full border-[26px] border-white sm:border-[34px]"
              />
              <StatBubbles />

              {/* tilted jar mockup, floating over the ring */}
              <Parallax speed={0.05} className="absolute inset-0">
                <div className="animate-sway absolute left-1/2 top-1/2 w-[56%] -translate-x-1/2 -translate-y-[46%] sm:w-[60%]">
                  <img
                    src="/images/adielas/jar-stage3-cut.png"
                    alt="ADIELAS Stage 3 dry-fruits nutrition jar"
                    className="w-full -rotate-6 drop-shadow-[0_40px_44px_rgba(69,31,34,0.30)]"
                  />
                </div>
              </Parallax>

              {/* handwritten note */}
              <div className="absolute -left-2 top-[6%] hidden -rotate-6 text-[var(--forest)] sm:block">
                <p className="font-hand text-2xl leading-[0.95]">
                  Sprouted Ragi,
                  <br />
                  Sun-Dried
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
                    className="font-display block text-[clamp(2.8rem,6.5vw,5.4rem)] leading-[0.95] text-white drop-shadow-[0_2px_0_rgba(69,31,34,0.10)]"
                  >
                    ANCIENT
                  </span>,
                  <span
                    key="l2"
                    className="font-display block text-[clamp(2.8rem,6.5vw,5.4rem)] leading-[0.95] text-[var(--forest)]"
                  >
                    GRAINS MEET
                  </span>,
                  <span
                    key="l3"
                    className="font-display block text-[clamp(2.8rem,6.5vw,5.4rem)] leading-[0.95] text-[var(--forest)]"
                  >
                    GROWING KIDS
                  </span>,
                ]}
              />
            </h2>
            <Reveal delay={200}>
              <p className="mx-auto mt-6 max-w-md text-base font-medium leading-relaxed text-[var(--forest-deep)] sm:text-lg">
                Wholesome everyday nutrition for little ones — sprouted
                millets, multigrains and dry fruits, blended with clinical
                care. Clean labels, happy tummies, zero shortcuts.
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
