import { ArrowUpRight, InstagramIcon, TikTokIcon, YouTubeIcon } from "./icons";
import Link from "next/link";
import { Reveal } from "./Reveal";
import { defaultFooter, defaultSettings } from "@/lib/cms-defaults";

type FooterCms = { settings?: Partial<typeof defaultSettings>; footer?: Partial<typeof defaultFooter> };

export function Footer({
  className = "",
  cms,
}: {
  className?: string;
  cms?: FooterCms;
}) {
  const s = { ...defaultSettings, ...(cms?.settings ?? {}) };
  const f = { ...defaultFooter, ...(cms?.footer ?? {}) };

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
                {f.ctaText}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
              </Link>
            </div>
          </Reveal>

          {/* info column */}
          <div className="flex flex-col items-start gap-6 lg:pt-2">
            <Reveal variant="left" delay={100} className="w-full sm:w-auto">
              <div className="grid grid-cols-2 gap-3 w-full sm:flex sm:w-auto">
                <a
                  href="/shop"
                  className="flex flex-col items-center gap-2 rounded-2xl bg-white px-3 py-4 text-center shadow-[0_16px_36px_rgba(69,31,34,0.12)] transition hover:-translate-y-1 sm:w-36 sm:px-4 sm:py-5"
                >
                  <svg viewBox="0 0 40 40" className="h-8 w-8 sm:h-9 sm:w-9" aria-hidden="true">
                    <rect x="7" y="12" width="16" height="20" rx="3" fill="none" stroke="var(--olive)" strokeWidth="2.4" />
                    <rect x="11" y="7" width="16" height="20" rx="3" fill="none" stroke="var(--olive)" strokeWidth="2.4" />
                    <rect x="15" y="3" width="16" height="20" rx="3" fill="none" stroke="var(--olive)" strokeWidth="2.4" />
                  </svg>
                  <span className="font-display text-xs sm:text-sm leading-tight text-[var(--forest)]">
                    SHOP ALL
                    <br />
                    PRODUCTS
                  </span>
                </a>
                <a
                  href="/#doctor"
                  className="flex flex-col items-center gap-2 rounded-2xl bg-white px-3 py-4 text-center shadow-[0_16px_36px_rgba(69,31,34,0.12)] transition hover:-translate-y-1 sm:w-36 sm:px-4 sm:py-5"
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
                <span className="text-[var(--sage-deep)]">{s.storeName}</span>
                <br />
                <span className="text-[var(--forest)]">
                  {s.tagline}
                </span>
              </h3>
            </Reveal>

            <Reveal variant="left" delay={220}>
              <nav aria-label="Footer" className="flex flex-col gap-2.5">
                <a
                  href="/#why"
                  className="w-fit text-sm font-semibold text-[var(--forest)] underline underline-offset-4 hover:text-[var(--forest-deep)]"
                >
                  Why ADIELAS
                </a>
                <a
                  href="/shop"
                  className="w-fit text-sm font-semibold text-[var(--forest)] underline underline-offset-4 hover:text-[var(--forest-deep)]"
                >
                  Shop Stages
                </a>
                <a
                  href="mailto:Info@adielas.com"
                  className="w-fit text-sm font-semibold text-[var(--forest)] underline underline-offset-4 hover:text-[var(--forest-deep)]"
                >
                  Contact us
                </a>
              </nav>
            </Reveal>

            <Reveal variant="left" delay={280}>
              <address className="text-sm not-italic leading-relaxed text-[var(--forest-deep)]/85">
                {f.aboutText}
              </address>

              <address className="text-sm not-italic leading-relaxed text-[var(--forest-deep)]/85">
                {s.address}
                <br />
                <a
                  href={`tel:${s.phone.replace(/\s+/g, "")}`}
                  className="underline underline-offset-4 hover:text-[var(--forest)]"
                >
                  {s.phone}
                </a>{" "}
                ·{" "}
                <a
                  href={`mailto:${s.email}`}
                  className="underline underline-offset-4 hover:text-[var(--forest)]"
                >
                  {s.email}
                </a>
              </address>
            </Reveal>

            <Reveal variant="left" delay={340}>
              <div className="flex items-center gap-2.5">
                {[
                  { label: "Instagram", Icon: InstagramIcon, href: s.instagramUrl },
                  { label: "TikTok", Icon: TikTokIcon, href: "https://www.tiktok.com" },
                  { label: "YouTube", Icon: YouTubeIcon, href: s.youtubeUrl },
                ].map(({ label, Icon, href }) => (
                  <a
                    key={label}
                    href={href}
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
          <p>© {new Date().getFullYear()} {s.storeName}. {f.copyrightText} · GST: {s.gstNumber}</p>
          <p>Contact: {s.email}</p>
        </div>
      </div>

      {/* giant clipped wordmark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 select-none overflow-hidden"
      >
        <p className="font-script translate-y-[24%] text-center text-[30vw] leading-[0.8] text-[var(--forest)]">
          {s.storeName.toLowerCase()}
        </p>
      </div>
    </footer>
  );
}
