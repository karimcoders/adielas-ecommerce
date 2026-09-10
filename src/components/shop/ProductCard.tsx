"use client";

import Link from "next/link";
import { Plus, Star } from "lucide-react";
import { useCart } from "@/components/more/CartProvider";
import { useToast } from "@/hooks/use-toast";
import { formatINR, type Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const { toast } = useToast();
  const discount = product.mrp
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  const quickAdd = () => {
    add(product.slug, 1, { open: false });
    toast({
      title: "Added to cart",
      description: `${product.name} × 1 · ${formatINR(product.price)}`,
    });
  };

  return (
    <article className="group relative flex flex-col rounded-[1.6rem] bg-white p-3 pb-5 shadow-[0_18px_44px_rgba(69,31,34,0.10)] transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_rgba(69,31,34,0.16)]">
      <div className="relative overflow-hidden rounded-2xl bg-[var(--cloud)]">
        <Link
          href={`/shop/${product.slug}`}
          aria-label={`View ${product.name}`}
          className="block"
        >
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="aspect-square w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
          />
        </Link>
        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-[var(--forest)] px-3 py-1 text-[11px] font-extrabold tracking-wide text-[var(--cream)]">
            SAVE {discount}%
          </span>
        )}
        <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-[var(--forest)] backdrop-blur">
          {product.ageLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-2 pt-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--olive)]">
          {product.stageLabel} · {product.weight}
        </p>
        <h3 className="font-display mt-1.5 text-xl leading-[1.02] text-[var(--forest)]">
          <Link
            href={`/shop/${product.slug}`}
            className="transition-colors hover:text-[var(--sage-deep)]"
          >
            {product.nameLines[0]} · {product.nameLines[1]}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm font-medium leading-relaxed text-[var(--forest-deep)]/80">
          {product.tagline}
        </p>

        <div className="mt-3 flex items-center gap-2">
          <span className="flex gap-0.5 text-[var(--sage-deep)]">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-current" />
            ))}
          </span>
          <span className="text-xs font-semibold text-[var(--forest-deep)]/70">
            {product.rating.toFixed(1)} ({product.reviews})
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-[var(--forest)]/10 pt-4">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl text-[var(--forest)]">
              {formatINR(product.price)}
            </span>
            {product.mrp && (
              <span className="text-sm font-semibold text-[var(--forest-deep)]/45 line-through">
                {formatINR(product.mrp)}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={quickAdd}
            aria-label={`Add ${product.name} to cart`}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--forest)] text-[var(--cream)] shadow transition duration-300 hover:rotate-90 hover:bg-[var(--forest-deep)]"
          >
            <Plus className="h-5 w-5" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </article>
  );
}
