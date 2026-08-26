import { ArrowUpRight, InstagramIcon, TikTokIcon, YouTubeIcon } from "./icons";

const shopLinks = [
  { label: "All products", href: "#shop" },
  { label: "Samples & singles", href: "#shop" },
  { label: "Flavour Boost", href: "#shop" },
];

const helpLinks = [
  { label: "Shipping & delivery", href: "#" },
  { label: "Returns & exchanges", href: "#" },
  { label: "FAQ", href: "#" },
];

export function Footer() {
  return (
    <footer className="bg-[var(--forest-deep)] text-[var(--cream)]">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 sm:pt-20 lg:px-10">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          {/* brand block */}
          <div className="max-w-md">
            <span className="font-script text-6xl leading-none text-[var(--cream)]">more</span>
            <h2 className="font-display mt-4 text-3xl leading-none sm:text-4xl">
              MATCHA MEETS
              <br />
              PROTEIN
            </h2>
            <a
              href="#shop"
              className="btn-pill group mt-6 py-2 pl-2 pr-6 text-sm"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--cream)] text-[var(--forest)] transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
              Buy now
            </a>
          </div>

          {/* link columns */}
          <div className="grid grid-cols-2 gap-10 sm:gap-16">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-white/50">Shop</h3>
              <ul className="mt-4 space-y-3">
                {shopLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm font-semibold transition hover:text-white hover:underline"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-white/50">Help</h3>
              <ul className="mt-4 space-y-3">
                {helpLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm font-semibold transition hover:text-white hover:underline"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex gap-2">
                {[
                  { label: "Instagram", Icon: InstagramIcon },
                  { label: "TikTok", Icon: TikTokIcon },
                  { label: "YouTube", Icon: YouTubeIcon },
                ].map(({ label, Icon }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-[var(--cream)] transition hover:scale-110 hover:bg-[var(--cream)] hover:text-[var(--forest-deep)]"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center">
          <p>© 2026 More Nutrition — design clone built for learning purposes.</p>
          <p>
            Demo only · not affiliated with the original brand ·{" "}
            <span className="font-script text-base text-white/70">its a match(a)</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
