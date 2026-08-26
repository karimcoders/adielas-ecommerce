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
      <div className="flex flex-wrap items-stretch gap-3">
        {/* qty stepper */}
        <div className="flex items-center gap-1 rounded-full border-2 border-[var(--forest)]/20 bg-white p-1.5">
          <button
            type="button"
            onClick={() => setQty((q) => clamped(q - 1))}
            aria-label="Decrease quantity"
            className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--forest)] transition hover:bg-[var(--cloud)]"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span
            aria-live="polite"
            className="w-10 text-center text-lg font-extrabold text-[var(--forest)]"
          >
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((q) => clamped(q + 1))}
            aria-label="Increase quantity"
            className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--forest)] transition hover:bg-[var(--cloud)]"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={addToCart}
          className="btn-pill group flex-1 justify-center px-6 py-3.5 text-base"
        >
          <ShoppingBag className="h-4.5 w-4.5" />
          Add to cart · {formatINR(product.price * qty)}
        </button>

        <button
          type="button"
          onClick={buyNow}
          className="flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-[var(--forest)] bg-transparent px-6 py-3.5 text-base font-semibold text-[var(--forest)] transition hover:bg-[var(--forest)] hover:text-[var(--cream)]"
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
