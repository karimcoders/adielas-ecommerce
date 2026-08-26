import { ArrowUpRight, InstagramIcon, TikTokIcon, YouTubeIcon } from "./icons";
import { Reveal } from "./Reveal";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[var(--sage)]">
      <div className="mx-auto max-w-7xl px-4 pb-40 pt-16 sm:px-6 sm:pb-48 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          {/* big product card */}
          <Reveal variant="right">
            <div className="relative overflow-hidden rounded-[1.8rem] bg-[var(--sage-deep)] px-6 pb-8 pt-12 text-center shadow-[0_30px_70px_rgba(20,56,15,0.22)] sm:px-10 sm:pt-16">
              <h2 className="font-display text-[clamp(2.6rem,5vw,4.4rem)] leading-[0.92] text-white">
                MATCHA
                <br />
                MEETS
                <br />
                PROTEIN
              </h2>
              <div className="pointer-events-none relative mx-auto mt-6 flex w-fit items-end justify-center">
                <img
                  src="/images/more/can-green-cut.png"
                  alt=""
                  aria-hidden="true"
                  className="w-24 -rotate-6 sm:w-28"
                />
                <img
                  src="/images/more/can-green-cut.png"
                  alt="Protein iced matcha latte tub"
                  className="-ml-4 w-32 sm:w-36"
                />
              </div>
              <a href="#top" className="btn-pill group relative mt-6 px-6 py-3 text-base">
                Buy now
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
              </a>
            </div>
          </Reveal>

          {/* info column */}
          <div className="flex flex-col items-start gap-6 lg:pt-2">
            <Reveal variant="left" delay={100}>
              <div className="flex gap-4">
                <a
                  href="#shop"
                  className="flex w-36 flex-col items-center gap-2 rounded-2xl bg-white px-4 py-5 text-center shadow-[0_16px_36px_rgba(20,56,15,0.12)] transition hover:-translate-y-1"
                >
                  <svg viewBox="0 0 40 40" className="h-9 w-9" aria-hidden="true">
                    <rect x="7" y="12" width="16" height="20" rx="3" fill="none" stroke="var(--olive)" strokeWidth="2.4" />
                    <rect x="11" y="7" width="16" height="20" rx="3" fill="none" stroke="var(--olive)" strokeWidth="2.4" />
                    <rect x="15" y="3" width="16" height="20" rx="3" fill="none" stroke="var(--olive)" strokeWidth="2.4" />
                  </svg>
                  <span className="font-display text-sm leading-tight text-[var(--forest)]">
                    SHOP ALL
                    <br />
                    PRODUCTS
                  </span>
                </a>
                <a
                  href="#shop"
                  className="flex w-36 flex-col items-center gap-2 rounded-2xl bg-white px-4 py-5 text-center shadow-[0_16px_36px_rgba(20,56,15,0.12)] transition hover:-translate-y-1"
                >
                  <svg viewBox="0 0 40 40" className="h-9 w-9" aria-hidden="true">
                    <rect x="6" y="10" width="24" height="16" rx="3" fill="none" stroke="var(--olive)" strokeWidth="2.4" />
                    <path d="M10 6h24v16" fill="none" stroke="var(--olive)" strokeWidth="2.4" strokeLinecap="round" />
                    <circle cx="13" cy="18" r="1.6" fill="var(--olive)" />
                    <path d="M18 15h8M18 21h8" stroke="var(--olive)" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <span className="font-display text-sm leading-tight text-[var(--forest)]">
                    SAMPLES
                    <br />
                    &amp; SINGLES
                  </span>
                </a>
              </div>
            </Reveal>

            <Reveal variant="left" delay={160}>
              <h3 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                <span className="text-[var(--sage-deep)]">More Nutrition</span>
                <br />
                <span className="text-[var(--forest)]">Iced Matcha Latte</span>
              </h3>
            </Reveal>

            <Reveal variant="left" delay={220}>
              <nav aria-label="Footer" className="flex flex-col gap-2.5">
                <a
                  href="#nutrition"
                  className="w-fit text-sm font-semibold text-[var(--forest)] underline underline-offset-4 hover:text-[var(--forest-deep)]"
                >
                  Shipping and Delivery
                </a>
                <a
                  href="#nutrition"
                  className="w-fit text-sm font-semibold text-[var(--forest)] underline underline-offset-4 hover:text-[var(--forest-deep)]"
                >
                  Returns and Exchanges
                </a>
              </nav>
            </Reveal>

            <Reveal variant="left" delay={280}>
              <div className="flex items-center gap-2.5">
                {[
                  { label: "Instagram", Icon: InstagramIcon },
                  { label: "TikTok", Icon: TikTokIcon },
                  { label: "YouTube", Icon: YouTubeIcon },
                ].map(({ label, Icon }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[var(--forest)] shadow-sm transition hover:scale-110 hover:bg-[var(--forest)] hover:text-[var(--cream)]"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        {/* legal line */}
        <div className="mt-14 flex items-center justify-between text-xs font-medium text-[var(--forest)]/80">
          <p>Demo rebuild for learning purposes — not affiliated with any brand.</p>
          <p>Site Credits</p>
        </div>
      </div>

      {/* giant clipped wordmark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 select-none overflow-hidden"
      >
        <p className="font-script translate-y-[24%] text-center text-[34vw] leading-[0.8] text-[var(--forest)]">
          more
        </p>
      </div>
    </footer>
  );
}
