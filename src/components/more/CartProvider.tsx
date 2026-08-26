"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem } from "@/lib/products";
import { getProduct } from "@/lib/products";

type AddOptions = { open?: boolean };

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (slug: string, qty?: number, opts?: AddOptions) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "adielas-cart-v1";

function sanitize(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((entry) => {
    const slug = typeof entry?.slug === "string" ? entry.slug : "";
    const qty = Number(entry?.qty);
    if (!slug || !getProduct(slug) || !Number.isFinite(qty)) return [];
    return [{ slug, qty: Math.min(20, Math.max(1, Math.round(qty))) }];
  });
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) setItems(sanitize(JSON.parse(raw)));
      } catch {
        /* corrupted storage — start fresh */
      }
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage full/blocked — cart still works in memory */
    }
  }, [items, hydrated]);

  const add = useCallback((slug: string, qty = 1, opts?: AddOptions) => {
    if (!getProduct(slug)) return;
    setItems((prev) => {
      const found = prev.find((it) => it.slug === slug);
      if (found) {
        return prev.map((it) =>
          it.slug === slug ? { ...it, qty: Math.min(20, it.qty + qty) } : it,
        );
      }
      return [...prev, { slug, qty: Math.min(20, Math.max(1, qty)) }];
    });
    if (opts?.open !== false) setIsOpen(true);
  }, []);

  const remove = useCallback((slug: string) => {
    setItems((prev) => prev.filter((it) => it.slug !== slug));
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setItems((prev) =>
      prev.flatMap((it) => {
        if (it.slug !== slug) return [it];
        const next = Math.round(qty);
        if (next < 1) return [];
        return [{ ...it, qty: Math.min(20, next) }];
      }),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = items.reduce((sum, it) => {
      const p = getProduct(it.slug);
      return sum + (p ? p.price * it.qty : 0);
    }, 0);
    const count = items.reduce((sum, it) => sum + it.qty, 0);
    return { items, count, subtotal, add, remove, setQty, clear, isOpen, openCart, closeCart };
  }, [items, add, remove, setQty, clear, isOpen, openCart, closeCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
