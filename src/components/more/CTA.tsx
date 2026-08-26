import { Reveal } from "./Reveal";
import { MaskedLines } from "./Reveal";
import { Parallax } from "./motion";

function PayBubble({
  label,
  size,
  className = "",
  speed = 0.06,
}: {
  label: string;
  size: string;
  className?: string;
  speed?: number;
}) {
  return (
    <Parallax speed={speed} className={`absolute ${className}`}>
      <span
        className={`${size} flex items-center justify-center rounded-full bg-white text-center text-sm font-bold tracking-tight text-[#1a1a1a] shadow-[0_18px_36px_rgba(69,31,34,0.10)] sm:text-base`}
      >
        {label}
      </span>
    </Parallax>
  );
}

export function CTA() {
  return (
    <section className="relative overflow-x-clip bg-[var(--sage)] pb-16 pt-20 text-[var(--forest)] sm:pb-24 sm:pt-28">
      {/* wavy white line through the background */}
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <path
          d="M-60 620 C 240 480, 420 700, 700 560 S 1140 420, 1500 560"
          fill="none"
          stroke="#ffffff"
          strokeWidth="40"
          strokeLinecap="round"
          opacity="0.9"
        />
      </svg>

      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
        <Reveal variant="down">
          <p className="font-hand absolute -top-10 left-2 hidden -rotate-6 text-2xl text-[var(--forest)] sm:block lg:left-10">
            easy
            <br />
            online ordering
          </p>
        </Reveal>

        <h2 className="mx-auto max-w-4xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          <MaskedLines
            lines={[
              <span key="c1" className="block">
                Give them the good stuff.
              </span>,
              <span key="c2" className="block text-[var(--sage-deep)]">
                Get it.
              </span>,
            ]}
          />
        </h2>

        <Reveal delay={140}>
          <a href="#shop" className="btn-pill group mt-8 px-7 py-3.5 text-lg">
            Shop now
          </a>
          <p className="font-hand mt-10 rotate-[-3deg] text-xl text-[var(--forest)] sm:text-2xl">
            Safe, secure checkout
          </p>
        </Reveal>
      </div>

      {/* payment bubbles */}
      <div className="relative mt-14 h-[170px] sm:h-[210px]">
        <PayBubble label="UPI" size="h-20 w-20" className="left-[3%] top-2 sm:h-24 sm:w-24" speed={0.1} />
        <PayBubble label="Paytm" size="h-24 w-24 sm:h-28 sm:w-28" className="left-[16%] top-16" speed={0.05} />
        <PayBubble label="PhonePe" size="h-20 w-20 sm:h-24 sm:w-24" className="left-[33%] top-24" speed={0.12} />
        <PayBubble label="RuPay" size="h-24 w-24 sm:h-28 sm:w-28" className="left-[47%] top-6" speed={0.07} />
        <PayBubble label="G Pay" size="h-20 w-20 sm:h-24 sm:w-24" className="left-[65%] top-20" speed={0.11} />
        <PayBubble label="VISA" size="h-24 w-24 sm:h-28 sm:w-28" className="left-[79%] top-10" speed={0.06} />
        <PayBubble label="Mastercard" size="h-20 w-24 sm:h-24 sm:w-28" className="left-[90%] top-24 hidden md:flex" speed={0.09} />
      </div>
    </section>
  );
}
