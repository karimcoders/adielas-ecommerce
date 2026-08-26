import { Reveal } from "./Reveal";
import { Parallax } from "./motion";

const floating = [
  {
    src: "/images/adielas/extra2.png",
    label: "5 Months+",
    alt: "Happy child illustration",
    pos: "left-[3%] top-[30%] w-[92px] sm:w-[120px]",
    rotate: "-rotate-6",
    note: "left-[5%] top-[12%]",
    arrow: "rotate-[24deg]",
    speed: 0.1,
  },
  {
    src: "/images/adielas/extra1.png",
    label: "1 Year+",
    alt: "Hazelnut illustration",
    pos: "right-[2%] top-[36%] w-[96px] sm:w-[124px]",
    rotate: "rotate-6",
    note: "right-[4%] top-[16%]",
    arrow: "-rotate-[24deg]",
    speed: -0.08,
  },
];

export function Flavors() {
  return (
    <section
      id="stages"
      className="relative overflow-x-clip bg-[var(--cream-page)] pb-0 pt-20 sm:pt-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <Reveal>
          <h2 className="mx-auto max-w-4xl text-center text-4xl font-semibold leading-tight tracking-tight text-[var(--forest)] sm:text-5xl lg:text-[3.4rem]">
            One recipe that grows with them —
            <br />
            <span className="text-[var(--sage-deep)]">which stage fits today?</span>
          </h2>
        </Reveal>
      </div>

      {/* trio composition */}
      <div className="relative mx-auto mt-16 h-[300px] max-w-6xl sm:mt-20 sm:h-[420px]">
        {floating.map((f) => (
          <div key={f.label} className={`absolute ${f.pos}`}>
            <Parallax speed={f.speed} className={f.rotate}>
              <img
                src={f.src}
                alt={f.alt}
                loading="lazy"
                className="w-full drop-shadow-[0_18px_26px_rgba(69,31,34,0.22)]"
              />
            </Parallax>
          </div>
        ))}

        {/* handwritten labels + arrows */}
        <div className="absolute left-[7%] top-[8%] hidden -rotate-6 sm:block">
          <p className="font-hand text-xl leading-[0.95] text-[var(--forest)]">
            Stage 1
            <br />
            5 months+
          </p>
          <svg
            viewBox="0 0 60 40"
            className="ml-6 mt-1 h-8 w-10 rotate-[24deg]"
            aria-hidden="true"
          >
            <path
              d="M4 4c14 6 22 16 26 30m0 0-7-6m7 6 2-9"
              fill="none"
              stroke="var(--forest)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="absolute right-[6%] top-[8%] hidden rotate-3 text-right sm:block">
          <p className="font-hand text-xl leading-[0.95] text-[var(--forest)]">
            Stage 3
            <br />
            1 year+
          </p>
          <svg
            viewBox="0 0 60 40"
            className="ml-auto mr-6 mt-1 h-8 w-10 -rotate-[24deg]"
            aria-hidden="true"
          >
            <path
              d="M56 4C42 10 34 20 30 34m0 0 7-6m-7 6-2-9"
              fill="none"
              stroke="var(--forest)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* packs rising from the bottom edge */}
        <Reveal variant="down" delay={120} className="absolute bottom-0 left-[10%] hidden w-[21%] sm:block">
          <div className="translate-y-[16%] -rotate-6">
            <img
              src="/images/adielas/stage1-cut.png"
              alt="ADIELAS Stage 1 pack — from 5 months"
              loading="lazy"
              className="w-full drop-shadow-[0_30px_36px_rgba(69,31,34,0.26)]"
            />
          </div>
        </Reveal>
        <Reveal variant="down" className="absolute bottom-0 left-1/2 z-10 w-[30%] -translate-x-1/2">
          <div className="translate-y-[12%]">
            <img
              src="/images/adielas/stage2-cut.png"
              alt="ADIELAS Stage 2 pack — from 6 months"
              loading="lazy"
              className="w-full drop-shadow-[0_30px_40px_rgba(69,31,34,0.30)]"
            />
          </div>
        </Reveal>
        <Reveal variant="down" delay={220} className="absolute bottom-0 right-[10%] hidden w-[21%] sm:block">
          <div className="translate-y-[16%] rotate-6">
            <img
              src="/images/adielas/stage3-cut.png"
              alt="ADIELAS Stage 3 pack — from 1 year"
              loading="lazy"
              className="w-full drop-shadow-[0_30px_36px_rgba(69,31,34,0.26)]"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
