"use client";

import { useEffect, useRef, useState } from "react";
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
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 24);
      // scrolling down → tuck the bar away; scrolling up → bring it back
      if (y > lastY.current && y > 140) setHidden(true);
      else setHidden(false);
      lastY.current = y;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{
        transform: hidden ? "translateY(-120%)" : "translateY(0)",
        willChange: "transform",
      }}
    >
      <nav
        aria-label="Main"
        className={`flex items-center justify-between gap-3 px-4 sm:px-6 lg:px-10 ${
          scrolled
            ? "py-2.5 transition-[padding] duration-500"
            : "py-4 transition-[padding] duration-500"
        }`}
      >
        {/* socials */}
        <div className="flex items-center gap-2">
          {socials.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--cloud)] text-[var(--forest)] shadow-sm backdrop-blur transition hover:scale-110 hover:bg-[var(--forest)] hover:text-[var(--cream)] sm:h-10 sm:w-10"
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
          className="flex items-center gap-2 rounded-full bg-[var(--cloud)] py-1.5 pl-1.5 pr-5 text-sm font-semibold text-[var(--forest)] shadow-sm backdrop-blur transition hover:bg-[var(--forest)] hover:text-[var(--cream)]"
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
