"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check, Minus, Plus, X } from "lucide-react";
import { useCart } from "./CartProvider";
import {
  FREE_SHIPPING_THRESHOLD,
  formatINR,
  getProduct,
} from "@/lib/products";

export function CartDrawer() {
  const { isOpen, closeCart, items, setQty, remove, subtotal } = useCart();
  const pathname = usePathname();
  const panelRef = useRef<HTMLElement | null>(null);

  // close when navigating (e.g. checkout link inside the drawer)
  useEffect(() => {
    closeCart();
  }, [pathname, closeCart]);

  // esc + scroll lock
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, closeCart]);

  const freeShipPct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <div
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-[70] ${isOpen ? "" : "pointer-events-none"}`}
    >
      {/* backdrop */}
      <button
        type="button"
        aria-label="Close cart"
        onClick={closeCart}
        tabIndex={isOpen ? 0 : -1}
        className={`absolute inset-0 h-full w-full cursor-default bg-[#451f22]/45 backdrop-blur-[3px] transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* panel */}
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        tabIndex={-1}
        className={`absolute right-0 top-0 flex h-full w-[min(430px,100vw)] flex-col bg-[var(--cream-page)] shadow-[0_0_80px_rgba(69,31,34,0.35)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] outline-none ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* header */}
        <div className="flex items-center justify-between border-b border-[var(--forest)]/12 px-5 py-4">
          <h2 className="font-display text-xl tracking-wide text-[var(--forest)]">
            YOUR CART
            {items.length > 0 && (
              <span className="ml-2 align-middle text-sm font-semibold text-[var(--sage-deep)]">
                ({items.reduce((n, it) => n + it.qty, 0)})
              </span>
            )}
          </h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[var(--forest)] shadow transition hover:rotate-90 hover:bg-[var(--forest)] hover:text-[var(--cream)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* free shipping bar */}
        <div className="border-b border-[var(--forest)]/12 bg-white/60 px-5 py-3">
          {remaining > 0 ? (
            <p className="text-xs font-semibold text-[var(--forest-deep)]">
              Add{" "}
              <span className="text-[var(--sage-deep)]">
                {formatINR(remaining)}
              </span>{" "}
              more for FREE shipping
            </p>
          ) : (
            <p className="flex items-center gap-1.5 text-xs font-semibold text-[var(--forest-deep)]">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--sage-deep)] text-white">
                <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
              </span>
              You&apos;ve unlocked FREE shipping!
            </p>
          )}
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--cloud)]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[var(--sage-deep)] to-[var(--forest)] transition-all duration-700"
              style={{ width: `${freeShipPct}%` }}
            />
          </div>
        </div>

        {/* items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <img
                src="/images/adielas/jar-trio.png"
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="w-36 rotate-[-5deg] rounded-2xl opacity-90 shadow-md"
              />
              <p className="font-script mt-6 text-3xl text-[var(--forest)]">
                still empty…
              </p>
              <p className="mt-1 max-w-[240px] text-sm font-medium text-[var(--forest-deep)]/85">
                Pick a stage and fill it with honest, sprouted goodness.
              </p>
              <Link
                href="/shop"
                tabIndex={isOpen ? 0 : -1}
                onClick={closeCart}
                className="btn-pill group mt-6 px-6 py-3 text-base"
              >
                Browse products
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((it) => {
                const p = getProduct(it.slug);
                if (!p) return null;
                return (
                  <li
                    key={it.slug}
                    className="flex gap-3 rounded-2xl bg-white p-3 shadow-[0_10px_26px_rgba(69,31,34,0.08)]"
                  >
                    <Link
                      href={`/shop/${p.slug}`}
                      tabIndex={isOpen ? 0 : -1}
                      onClick={closeCart}
                      className="relative block h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[var(--cloud)]"
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/shop/${p.slug}`}
                          tabIndex={isOpen ? 0 : -1}
                          onClick={closeCart}
                          className="text-sm font-bold leading-snug text-[var(--forest)] hover:text-[var(--sage-deep)]"
                        >
                          {p.nameLines[0]} · {p.nameLines[1]}
                        </Link>
                        <button
                          type="button"
                          onClick={() => remove(it.slug)}
                          tabIndex={isOpen ? 0 : -1}
                          aria-label={`Remove ${p.name} from cart`}
                          className="text-[var(--forest)]/50 transition hover:text-[#8c2f39]"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="mt-0.5 text-xs font-medium text-[var(--olive)]">
                        {p.ageLabel} · {p.weight}
                      </p>
                      <div className="mt-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-1 rounded-full border border-[var(--forest)]/15 bg-[var(--cream-page)] p-1">
                          <button
                            type="button"
                            onClick={() => setQty(it.slug, it.qty - 1)}
                            tabIndex={isOpen ? 0 : -1}
                            aria-label="Decrease quantity"
                            className="flex h-6 w-6 items-center justify-center rounded-full text-[var(--forest)] transition hover:bg-[var(--cloud)]"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span
                            aria-live="polite"
                            className="w-6 text-center text-sm font-bold text-[var(--forest)]"
                          >
                            {it.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQty(it.slug, it.qty + 1)}
                            tabIndex={isOpen ? 0 : -1}
                            aria-label="Increase quantity"
                            className="flex h-6 w-6 items-center justify-center rounded-full text-[var(--forest)] transition hover:bg-[var(--cloud)]"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="text-sm font-bold text-[var(--forest)]">
                          {formatINR(p.price * it.qty)}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* footer */}
        {items.length > 0 && (
          <div className="border-t border-[var(--forest)]/12 bg-white/70 px-5 py-4">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-semibold text-[var(--olive)]">
                Subtotal
              </span>
              <span className="font-display text-2xl text-[var(--forest)]">
                {formatINR(subtotal)}
              </span>
            </div>
            <p className="mt-0.5 text-[11px] font-medium text-[var(--forest-deep)]/70">
              Taxes included · Shipping calculated at checkout
            </p>
            <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
              <Link
                href="/checkout"
                tabIndex={isOpen ? 0 : -1}
                onClick={closeCart}
                className="btn-pill group justify-center py-3.5 text-base"
              >
                Checkout
              </Link>
              <button
                type="button"
                onClick={closeCart}
                tabIndex={isOpen ? 0 : -1}
                className="rounded-full border border-[var(--forest)]/25 px-5 py-3.5 text-base font-semibold text-[var(--forest)] transition hover:bg-[var(--cloud)]"
              >
                Keep shopping
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
