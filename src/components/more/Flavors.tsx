import { Reveal } from "./Reveal";
import { Parallax } from "./motion";

const floating = [
  {
    src: "/images/more/ingredient-cookie-cut.png",
    label: "Vanilla Crumble",
    alt: "Chocolate chip cookies",
    pos: "left-[2%] top-[34%] w-[84px] sm:w-[110px]",
    rotate: "-rotate-12",
    note: "left-[6%] top-[16%]",
    arrow: "rotate-[24deg]",
    speed: 0.1,
  },
  {
    src: "/images/more/ingredient-strawberry-cut.png",
    label: "Strawberry Cheesecake",
    alt: "Fresh strawberries",
    pos: "right-[0%] top-[42%] w-[110px] sm:w-[150px]",
    rotate: "rotate-6",
    note: "right-[4%] top-[18%]",
    arrow: "-rotate-[24deg]",
    speed: -0.08,
  },
];

export function Flavors() {
  return (
    <section className="relative overflow-x-clip bg-[var(--cream-page)] pb-0 pt-20 sm:pt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <Reveal>
          <h2 className="mx-auto max-w-4xl text-center text-4xl font-semibold leading-tight tracking-tight text-[var(--forest)] sm:text-5xl lg:text-[3.4rem]">
            Any way you like your matcha —
            <br />
            <span className="text-[var(--sage-deep)]">which flavour today?</span>
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
                className="w-full drop-shadow-[0_18px_26px_rgba(20,56,15,0.25)]"
              />
            </Parallax>
          </div>
        ))}

        {/* handwritten labels + arrows */}
        <div className={`absolute left-[8%] top-[6%] hidden -rotate-6 sm:block`}>
          <p className="font-hand text-xl leading-[0.95] text-[var(--forest)]">
            Vanilla
            <br />
            Crumble
          </p>
          <svg
            viewBox="0 0 60 40"
            className={`ml-6 mt-1 h-8 w-10 ${floating[0].arrow}`}
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
        <div className="absolute right-[6%] top-[6%] hidden rotate-3 text-right sm:block">
          <p className="font-hand text-xl leading-[0.95] text-[var(--forest)]">
            Strawberry
            <br />
            Cheesecake
          </p>
          <svg
            viewBox="0 0 60 40"
            className={`ml-auto mr-6 mt-1 h-8 w-10 ${floating[1].arrow}`}
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

        {/* cans rising from the bottom edge */}
        <Reveal variant="down" delay={120} className="absolute bottom-0 left-[10%] hidden w-[21%] sm:block">
          <div className="translate-y-[16%] -rotate-6">
            <img
              src="/images/more/can-green-cut.png"
              alt="Vanilla crumble tub"
              loading="lazy"
              className="w-full drop-shadow-[0_30px_36px_rgba(20,56,15,0.28)]"
            />
          </div>
        </Reveal>
        <Reveal variant="down" className="absolute bottom-0 left-1/2 z-10 w-[30%] -translate-x-1/2">
          <div className="translate-y-[12%]">
            <img
              src="/images/more/can-green-cut.png"
              alt="Original protein iced matcha latte tub"
              loading="lazy"
              className="w-full drop-shadow-[0_30px_40px_rgba(20,56,15,0.32)]"
            />
          </div>
        </Reveal>
        <Reveal variant="down" delay={220} className="absolute bottom-0 right-[10%] hidden w-[21%] sm:block">
          <div className="translate-y-[16%] rotate-6">
            <img
              src="/images/more/can-green-cut.png"
              alt="Strawberry cheesecake tub"
              loading="lazy"
              className="w-full drop-shadow-[0_30px_36px_rgba(20,56,15,0.28)]"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
