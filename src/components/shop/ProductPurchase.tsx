"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag, Zap } from "lucide-react";
import { useCart } from "@/components/more/CartProvider";
import { useToast } from "@/hooks/use-toast";
import { FREE_SHIPPING_THRESHOLD, formatINR, type Product } from "@/lib/products";

export function ProductPurchase({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const { add } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  const addToCart = useCallback(() => {
    add(product.slug, qty, { open: true });
    toast({
      title: "Added to cart",
      description: `${product.name} × ${qty} · ${formatINR(product.price * qty)}`,
    });
  }, [add, product, qty, toast]);

  const buyNow = useCallback(() => {
    add(product.slug, qty, { open: false });
    router.push("/checkout");
  }, [add, product.slug, qty, router]);

  const clamped = (n: number) => Math.min(20, Math.max(1, Math.round(n)));

  return (
    <div>
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-stretch sm:gap-3">
        <div className="flex items-center gap-2.5">
          {/* qty stepper */}
          <div className="flex items-center gap-0.5 rounded-full border-2 border-[var(--forest)]/20 bg-white p-1">
            <button
              type="button"
              onClick={() => setQty((q) => clamped(q - 1))}
              aria-label="Decrease quantity"
              className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--forest)] transition hover:bg-[var(--cloud)] active:scale-95"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span
              aria-live="polite"
              className="w-8 text-center text-base font-extrabold text-[var(--forest)]"
            >
              {qty}
            </span>
            <button
              type="button"
              onClick={() => setQty((q) => clamped(q + 1))}
              aria-label="Increase quantity"
              className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--forest)] transition hover:bg-[var(--cloud)] active:scale-95"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={addToCart}
            className="btn-pill group flex-1 justify-center px-4 py-3 text-sm sm:px-6 sm:py-3.5 sm:text-base"
          >
            <ShoppingBag className="h-4 w-4" />
            Add to cart · {formatINR(product.price * qty)}
          </button>
        </div>

        <button
          type="button"
          onClick={buyNow}
          className="flex items-center justify-center gap-2 rounded-full border-2 border-[var(--forest)] bg-transparent px-6 py-3 text-sm font-bold text-[var(--forest)] transition hover:bg-[var(--forest)] hover:text-[var(--cream)] active:scale-98 sm:flex-1 sm:py-3.5 sm:text-base"
        >
          <Zap className="h-4 w-4 fill-current" />
          Buy now
        </button>
      </div>

      <p className="mt-3 text-xs font-medium text-[var(--forest-deep)]/75">
        {product.mrp && (
          <span className="mr-1 font-bold text-[var(--sage-deep)]">
            You save {formatINR(product.mrp - product.price)}
          </span>
        )}
        · Free shipping on orders above {formatINR(FREE_SHIPPING_THRESHOLD)} ·
        COD available
      </p>
    </div>
  );
}
