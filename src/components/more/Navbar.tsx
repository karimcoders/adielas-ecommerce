"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  InstagramIcon,
  TikTokIcon,
  YouTubeIcon,
} from "./icons";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "./CartProvider";

const socials = [
  { label: "Instagram", href: "https://www.instagram.com", Icon: InstagramIcon },
  { label: "TikTok", href: "https://www.tiktok.com", Icon: TikTokIcon },
  { label: "YouTube", href: "https://www.youtube.com", Icon: YouTubeIcon },
];

const links = [
  { label: "Why Adielas", href: "/#why" },
  { label: "Stages", href: "/#stages" },
  { label: "Doctor", href: "/#doctor" },
];

export function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);
  const { openCart, count } = useCart();

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 24);
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
        className={`relative flex items-center justify-between gap-3 px-4 transition-[padding] duration-500 sm:px-6 lg:px-10 ${
          scrolled ? "py-1.5" : "py-3"
        }`}
      >
        {/* brand logo — pinned dead-centre of the header */}
        <Link
          href="/"
          aria-label="ADIELAS home"
          className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transition-transform duration-500 hover:scale-[1.04]"
        >
          <img
            src="/images/adielas/logo.png"
            alt="ADIELAS"
            className={`w-auto transition-[height] duration-500 ${
              scrolled ? "h-11 sm:h-12" : "h-12 sm:h-14"
            } drop-shadow-[0_10px_22px_rgba(69,31,34,0.22)]`}
          />
        </Link>

        {/* mobile hamburger */}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--cream)] text-[var(--forest)] shadow-sm backdrop-blur transition hover:bg-[var(--forest)] hover:text-[var(--cream)] lg:hidden"
        >
          {menuOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </button>

        {/* socials (desktop) */}
        <div className="hidden items-center gap-2 md:flex">
          {socials.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={label}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--cream)] text-[var(--forest)] shadow-sm backdrop-blur transition hover:scale-110 hover:bg-[var(--forest)] hover:text-[var(--cream)] sm:h-10 sm:w-10"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>

        {/* pills + shop (desktop, right of the centred logo) */}
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 lg:flex">
            {links.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="nav-pill px-5 py-2.5 text-sm"
              >
                {label}
              </Link>
            ))}
          </div>

          <Link
            href="/shop"
            className="hidden items-center gap-2 rounded-full bg-[var(--cream)] py-1.5 pl-1.5 pr-5 text-sm font-semibold text-[var(--forest)] shadow-sm backdrop-blur transition hover:bg-[var(--forest)] hover:text-[var(--cream)] sm:flex"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--forest)] text-[var(--cream)]">
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
            Shop now
          </Link>

          <button
            type="button"
            onClick={openCart}
            aria-label={`Open cart (${count} item${count === 1 ? "" : "s"})`}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[var(--forest)] text-[var(--cream)] shadow-sm transition hover:scale-110 hover:bg-[var(--forest-deep)] sm:h-11 sm:w-11"
          >
            <ShoppingBag className="h-4 w-4" />
            {count > 0 && (
              <span
                key={count}
                className="animate-pop absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-[var(--sage)] bg-[var(--sage-deep)] px-1 text-[10px] font-extrabold leading-none text-white"
              >
                {count > 20 ? "20+" : count}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* mobile menu sheet */}
      <div
        className={`overflow-hidden px-4 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden ${
          menuOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="mt-1 rounded-3xl border border-[var(--forest)]/10 bg-[var(--cream)] p-3 shadow-[0_24px_50px_rgba(69,31,34,0.22)]">
          {[...links, { label: "Shop All", href: "/shop" }].map(
            ({ label, href }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between rounded-2xl px-4 py-3 text-base font-semibold text-[var(--forest)] transition hover:bg-[var(--cloud)]"
              >
                {label}
                <ArrowUpRight className="h-4 w-4 text-[var(--olive)]" />
              </Link>
            ),
          )}
          <a
            href="tel:+919845379428"
            className="mt-1 block rounded-2xl px-4 pb-2 pt-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--olive)]"
          >
            Questions? +91 98453 79428
          </a>
        </div>
      </div>
    </header>
  );
}
