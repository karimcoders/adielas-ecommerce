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
  { to: 100, unit: "%", label: "Organic Grains", pos: "left-[56%] top-[1%]", delay: 300 },
  { to: 0, unit: "", label: "Added Sugar", pos: "left-[2%] top-[30%]", delay: 600 },
  { to: 35, unit: "+", label: "Yrs Expertise", pos: "left-[4%] top-[66%]", delay: 900 },
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
            className="flex h-[72px] w-[72px] animate-floaty flex-col items-center justify-center rounded-full bg-[var(--cream)] text-center text-[var(--forest)] shadow-[0_14px_30px_rgba(69,31,34,0.14)] sm:h-[92px] sm:w-[92px]"
            style={{ animationDelay: `${i * 0.8}s` }}
          >
            <span className="font-display text-xl leading-none sm:text-2xl">
              <Counter to={s.to} />
              <span className="align-top text-sm sm:text-base">{s.unit}</span>
            </span>
            <span className="mt-1 px-1.5 text-[9px] font-semibold leading-tight sm:text-[11px]">
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
    <section className="relative overflow-hidden pt-[84px] sm:pt-[96px]" id="top">
      {/* soft warm glow behind the whole hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[86%] w-[120%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,rgba(230,217,180,0.55),transparent)]"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-4 px-4 pb-6 sm:px-6 lg:min-h-[calc(100svh-110px)] lg:grid-cols-[1.02fr_1fr] lg:gap-6 lg:pb-8 lg:px-10">
        {/* LEFT — pack + ring composition */}
        <Reveal className="order-2 lg:order-1" delay={150} variant="right">
          <div className="relative mx-auto aspect-square w-full max-w-[360px] sm:max-w-[440px] lg:max-w-[520px]">
            {/* big white ring */}
            <div
              aria-hidden="true"
              className="absolute left-[7%] top-[5%] h-[90%] w-[90%] rounded-full border-[22px] border-white sm:border-[30px]"
            />
            <StatBubbles />

            {/* tilted jar mockup, floating over the ring */}
            <Parallax speed={0.05} className="absolute inset-0">
              <div className="animate-sway absolute left-1/2 top-1/2 w-[54%] -translate-x-1/2 -translate-y-[47%] sm:w-[58%]">
                <img
                  src="/images/adielas/jar-stage3-cut.png"
                  alt="ADIELAS Stage 3 dry-fruits nutrition jar"
                  className="w-full -rotate-6 drop-shadow-[0_40px_44px_rgba(69,31,34,0.30)]"
                />
                {/* floor shadow */}
                <div
                  aria-hidden="true"
                  className="mx-auto mt-[-6%] h-[9%] w-[62%] rounded-[50%] bg-[rgba(69,31,34,0.16)] blur-md"
                />
              </div>
            </Parallax>

            {/* handwritten note */}
            <div className="absolute -left-1 top-[2%] hidden -rotate-6 text-[var(--forest)] sm:block">
              <p className="font-hand text-xl leading-[0.95] sm:text-2xl">
                Sprouted Ragi,
                <br />
                Sun-Dried
              </p>
              <CurvedArrow className="ml-2 mt-1 h-8 w-14 -scale-x-100" />
            </div>
          </div>
        </Reveal>

        {/* RIGHT — brand + headline + copy + CTA */}
        <div className="order-1 pt-2 text-center lg:order-2 lg:pt-0">
          <MaskedLines
            lines={[
              <span
                key="mark"
                className="font-script select-none text-[clamp(2.6rem,6vw,4.6rem)] leading-[1] text-[var(--forest)]"
              >
                adielas
              </span>,
            ]}
          />
          <h2 className="mt-1 text-center sm:mt-2">
            <MaskedLines
              startDelay={140}
              lines={[
                <span
                  key="l1"
                  className="font-display block text-[clamp(2.3rem,4.6vw,4rem)] leading-[0.95] text-[var(--olive)]"
                >
                  ANCIENT
                </span>,
                <span
                  key="l2"
                  className="font-display block text-[clamp(2.3rem,4.6vw,4rem)] leading-[0.95] text-[var(--forest)]"
                >
                  GRAINS MEET
                </span>,
                <span
                  key="l3"
                  className="font-display block text-[clamp(2.3rem,4.6vw,4rem)] leading-[0.95] text-[var(--forest)]"
                >
                  GROWING KIDS
                </span>,
              ]}
            />
          </h2>
          <Reveal delay={200}>
            <p className="mx-auto mt-4 max-w-md text-sm font-medium leading-relaxed text-[var(--forest-deep)] sm:mt-5 sm:text-base lg:text-lg">
              Wholesome everyday nutrition for little ones — sprouted millets,
              multigrains and dry fruits, blended with clinical care. Clean
              labels, happy tummies, zero shortcuts.
            </p>
            <div className="mt-3 flex justify-center text-[var(--forest)]">
              <Squiggle className="h-3.5 w-28" />
            </div>
            <Reveal delay={260} variant="down" className="mt-5">
              <BuyButton />
            </Reveal>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
