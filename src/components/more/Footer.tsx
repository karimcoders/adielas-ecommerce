import { ArrowUpRight, InstagramIcon, TikTokIcon, YouTubeIcon } from "./icons";
import Link from "next/link";
import { Reveal } from "./Reveal";

export function Footer({ className = "" }: { className?: string }) {
  return (
    <footer className={`relative overflow-hidden bg-[var(--sage)] ${className}`}>
      <div className="mx-auto max-w-7xl px-4 pb-40 pt-16 sm:px-6 sm:pb-48 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          {/* big brand card */}
          <Reveal variant="right">
            <div className="relative overflow-hidden rounded-[1.8rem] bg-[var(--sage-soft)] px-6 pb-8 pt-12 text-center shadow-[0_30px_70px_rgba(69,31,34,0.20)] sm:px-10 sm:pt-16">
              <h2 className="font-display text-[clamp(2.2rem,4.4vw,3.8rem)] leading-[0.92] text-white">
                NUTRITION
                <br />
                THAT GROWS
                <br />
                WITH THEM
              </h2>
              <div className="pointer-events-none relative mx-auto mt-6 flex w-fit items-end justify-center">
                <img
                  src="/images/adielas/jar-stage1-cut.png"
                  alt=""
                  aria-hidden="true"
                  className="w-20 -rotate-6 sm:w-24"
                />
                <img
                  src="/images/adielas/jar-stage3-cut.png"
                  alt="ADIELAS nutrition jars"
                  className="-ml-4 w-28 sm:w-32"
                />
              </div>
              <Link href="/shop" className="btn-pill group relative mt-6 inline-flex px-6 py-3 text-base">
                Buy now
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
              </Link>
            </div>
          </Reveal>

          {/* info column */}
          <div className="flex flex-col items-start gap-6 lg:pt-2">
            <Reveal variant="left" delay={100}>
              <div className="flex gap-4">
                <a
                  href="/shop"
                  className="flex w-36 flex-col items-center gap-2 rounded-2xl bg-white px-4 py-5 text-center shadow-[0_16px_36px_rgba(69,31,34,0.12)] transition hover:-translate-y-1"
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
                  href="/#doctor"
                  className="flex w-36 flex-col items-center gap-2 rounded-2xl bg-white px-4 py-5 text-center shadow-[0_16px_36px_rgba(69,31,34,0.12)] transition hover:-translate-y-1"
                >
                  <svg viewBox="0 0 40 40" className="h-9 w-9" aria-hidden="true">
                    <circle cx="20" cy="13" r="7" fill="none" stroke="var(--olive)" strokeWidth="2.4" />
                    <path d="M8 34c1.8-7 6.4-10.5 12-10.5S30.2 27 32 34" fill="none" stroke="var(--olive)" strokeWidth="2.4" strokeLinecap="round" />
                    <path d="M26 8c2 1.6 3 3.4 3 5" stroke="var(--olive)" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <span className="font-display text-sm leading-tight text-[var(--forest)]">
                    DR.
                    <br />
                    VANDANA
                  </span>
                </a>
              </div>
            </Reveal>

            <Reveal variant="left" delay={160}>
              <h3 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                <span className="text-[var(--sage-deep)]">ADIELAS</span>
                <br />
                <span className="text-[var(--forest)]">
                  Nutrition for Growing Children
                </span>
              </h3>
            </Reveal>

            <Reveal variant="left" delay={220}>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--forest)]/60">
                    Explore
                  </span>
                  <a
                    href="/#why"
                    className="w-fit text-xs font-semibold text-[var(--forest)] underline underline-offset-4 hover:text-[var(--forest-deep)]"
                  >
                    Why ADIELAS
                  </a>
                  <a
                    href="/shop"
                    className="w-fit text-xs font-semibold text-[var(--forest)] underline underline-offset-4 hover:text-[var(--forest-deep)]"
                  >
                    Shop Stages
                  </a>
                  <Link
                    href="/p/about-us"
                    className="w-fit text-xs font-semibold text-[var(--forest)] underline underline-offset-4 hover:text-[var(--forest-deep)]"
                  >
                    Our Story
                  </Link>
                  <Link
                    href="/p/faq"
                    className="w-fit text-xs font-semibold text-[var(--forest)] underline underline-offset-4 hover:text-[var(--forest-deep)]"
                  >
                    FAQs
                  </Link>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--forest)]/60">
                    Policies
                  </span>
                  <Link
                    href="/p/shipping-policy"
                    className="w-fit text-xs font-semibold text-[var(--forest)] underline underline-offset-4 hover:text-[var(--forest-deep)]"
                  >
                    Shipping & Delivery
                  </Link>
                  <Link
                    href="/p/refund-policy"
                    className="w-fit text-xs font-semibold text-[var(--forest)] underline underline-offset-4 hover:text-[var(--forest-deep)]"
                  >
                    Refund & Returns
                  </Link>
                  <Link
                    href="/p/privacy-policy"
                    className="w-fit text-xs font-semibold text-[var(--forest)] underline underline-offset-4 hover:text-[var(--forest-deep)]"
                  >
                    Privacy Policy
                  </Link>
                  <a
                    href="mailto:Info@adielas.com"
                    className="w-fit text-xs font-semibold text-[var(--forest)] underline underline-offset-4 hover:text-[var(--forest-deep)]"
                  >
                    Contact Us
                  </a>
                </div>
              </div>
            </Reveal>

            <Reveal variant="left" delay={280}>
              <address className="text-sm not-italic leading-relaxed text-[var(--forest-deep)]/85">
                649, 6th C Main, 14th Cross, JP Nagar 3rd Phase,
                <br />
                Bangalore 560078 ·{" "}
                <a
                  href="tel:+919845379428"
                  className="underline underline-offset-4 hover:text-[var(--forest)]"
                >
                  +91 98453 79428
                </a>{" "}
                ·{" "}
                <a
                  href="mailto:Info@adielas.com"
                  className="underline underline-offset-4 hover:text-[var(--forest)]"
                >
                  Info@adielas.com
                </a>
              </address>
            </Reveal>

            <Reveal variant="left" delay={340}>
              <div className="flex items-center gap-2.5">
                {[
                  { label: "Instagram", Icon: InstagramIcon },
                  { label: "TikTok", Icon: TikTokIcon },
                  { label: "YouTube", Icon: YouTubeIcon },
                ].map(({ label, Icon }) => (
                  <a
                    key={label}
                    href={
                      label === "Instagram"
                        ? "https://www.instagram.com"
                        : label === "TikTok"
                          ? "https://www.tiktok.com"
                          : "https://www.youtube.com"
                    }
                    target="_blank"
                    rel="noreferrer noopener"
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
        <div className="mt-14 flex flex-col items-start justify-between gap-2 text-xs font-medium text-[var(--forest)]/80 sm:flex-row">
          <p>© {new Date().getFullYear()} ADIELAS. All rights reserved. · GST: 29ADFPV3524L3ZZ</p>
          <div className="flex items-center gap-4">
            <Link href="/account" className="underline underline-offset-2 hover:text-[var(--forest-deep)]">
              Customer Account
            </Link>
            <span>·</span>
            <Link href="/admin" className="underline underline-offset-2 font-bold text-amber-800 hover:text-amber-900">
              Admin CMS
            </Link>
          </div>
        </div>
      </div>

      {/* giant clipped wordmark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 select-none overflow-hidden"
      >
        <p className="font-script translate-y-[24%] text-center text-[30vw] leading-[0.8] text-[var(--forest)]">
          adielas
        </p>
      </div>
    </footer>
  );
}
