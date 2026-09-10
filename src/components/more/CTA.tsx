import Link from "next/link";
import { Reveal } from "./Reveal";
import { MaskedLines } from "./Reveal";
import { Parallax } from "./motion";

/* real payment-method logos floating in white pills */
const payLogos = [
  { src: "/images/pay/upi.png", alt: "UPI", h: "h-14 sm:h-16", imgH: "h-[30%]", max: "max-w-[74px] sm:max-w-[86px]", pos: "left-[4%] top-0 sm:left-[3%] sm:top-6", speed: 0.1 },
  { src: "/images/pay/paytm.png", alt: "Paytm", h: "h-14 sm:h-20", imgH: "h-[32%] sm:h-[30%]", max: "max-w-[84px] sm:max-w-[112px]", pos: "left-[36%] top-0 sm:left-[15%] sm:top-20", speed: 0.05 },
  { src: "/images/pay/phonepe.png", alt: "PhonePe", h: "h-14 sm:h-16", imgH: "h-[46%]", max: "max-w-[70px] sm:max-w-[88px]", pos: "left-[68%] top-0 sm:left-[32%] sm:top-28", speed: 0.12 },
  { src: "/images/pay/rupay.png", alt: "RuPay", h: "h-14 sm:h-20", imgH: "h-[36%] sm:h-[34%]", max: "max-w-[84px] sm:max-w-[112px]", pos: "left-[4%] top-[76px] sm:left-[47%] sm:top-4", speed: 0.07 },
  { src: "/images/pay/gpay.png", alt: "Google Pay", h: "h-14 sm:h-16", imgH: "h-[32%]", max: "max-w-[78px] sm:max-w-[100px]", pos: "left-[36%] top-[76px] sm:left-[63%] sm:top-24", speed: 0.11 },
  { src: "/images/pay/visa.png", alt: "Visa", h: "h-14 sm:h-20", imgH: "h-[28%] sm:h-[26%]", max: "max-w-[76px] sm:max-w-[104px]", pos: "left-[68%] top-[76px] sm:left-[77%] sm:top-12", speed: 0.06 },
  { src: "/images/pay/mastercard.png", alt: "Mastercard", h: "h-14 sm:h-16", imgH: "h-[56%]", max: "max-w-[64px] sm:max-w-[76px]", pos: "left-[90%] top-28 hidden md:flex", speed: 0.09 },
  { src: "/images/pay/amazonpay.png", alt: "Amazon Pay", h: "h-14 sm:h-16", imgH: "h-[46%]", max: "max-w-[70px] sm:max-w-[82px]", pos: "left-[23%] top-40 hidden sm:flex", speed: 0.08 },
];

function PayBubble({
  src,
  alt,
  h,
  imgH,
  max,
  pos,
  speed = 0.06,
}: (typeof payLogos)[number]) {
  return (
    <Parallax speed={speed} className={`absolute ${pos}`}>
      <span
        className={`${h} flex items-center justify-center rounded-full bg-white px-5 shadow-[0_18px_36px_rgba(69,31,34,0.12)] ring-1 ring-[var(--forest)]/5 sm:px-6`}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={`${imgH} w-auto ${max} object-contain`}
        />
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
          <Link href="/shop" className="btn-pill group mt-8 inline-flex px-7 py-3.5 text-lg">
            Shop now
          </Link>
          <p className="font-hand mt-10 rotate-[-3deg] text-xl text-[var(--forest)] sm:text-2xl">
            Safe, secure checkout
          </p>
        </Reveal>
      </div>

      {/* real payment logos */}
      <div className="relative mx-auto mt-12 h-[168px] max-w-6xl px-4 sm:mt-16 sm:h-[240px]">
        {payLogos.map((p) => (
          <PayBubble key={p.alt} {...p} />
        ))}
      </div>

      <Reveal>
        <p className="relative mx-auto mt-8 text-center text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--forest)]/70">
          UPI · Cards · Wallets · Cash on delivery
        </p>
      </Reveal>
    </section>
  );
}
