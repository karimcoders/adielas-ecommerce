import { ArrowUpRight, InstagramIcon, TikTokIcon, YouTubeIcon } from "./icons";

const socials = [
  { label: "Instagram", href: "#", Icon: InstagramIcon },
  { label: "TikTok", href: "#", Icon: TikTokIcon },
  { label: "YouTube", href: "#", Icon: YouTubeIcon },
];

const links = [
  { label: "Nutrition", href: "#nutrition" },
  { label: "Benefits", href: "#benefits" },
  { label: "Reviews", href: "#reviews" },
];

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="flex items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-10" aria-label="Main">
        {/* socials */}
        <div className="flex items-center gap-2">
          {socials.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--cloud)] text-[var(--forest)] transition hover:scale-110 hover:bg-[var(--forest)] hover:text-[var(--cream)] sm:h-10 sm:w-10"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>

        {/* center pills */}
        <div className="hidden items-center gap-2 md:flex">
          {links.map(({ label, href }) => (
            <a key={label} href={href} className="nav-pill px-5 py-2.5 text-sm">
              {label}
            </a>
          ))}
        </div>

        {/* shop all */}
        <a
          href="#shop"
          className="flex items-center gap-2 rounded-full bg-[var(--cloud)] py-1.5 pl-1.5 pr-5 text-sm font-semibold text-[var(--forest)] transition hover:bg-[var(--forest)] hover:text-[var(--cream)]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--forest)] text-[var(--cream)]">
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
          Shop all
        </a>
      </nav>
    </header>
  );
}
