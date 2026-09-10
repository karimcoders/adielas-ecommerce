import type { Metadata } from "next";
import Link from "next/link";
import { Ban, ShieldCheck, Stethoscope, Truck } from "lucide-react";
import { Reveal } from "@/components/more/Reveal";
import { ProductCard } from "@/components/shop/ProductCard";
import { getCatalog } from "@/lib/server-catalog";
import { getCmsSection } from "@/lib/cms";
import { defaultShop } from "@/lib/cms-defaults";

export const metadata: Metadata = {
  title: "Shop All — ADIELAS Nutrition",
  description:
    "Stage 1, 2 and 3 nutrition jars plus the Starter Trio — sprouted, sun-dried, pediatrician-formulated. Free shipping over ₹499.",
};

const TRUST_ICONS = [Stethoscope, Ban, Truck, ShieldCheck];

export default async function ShopPage() {
  const products = await getCatalog();
  const cmsShop = await getCmsSection("shop", defaultShop);
  const trustLabels =
    Array.isArray(cmsShop.trust) && cmsShop.trust.length > 0
      ? cmsShop.trust
      : defaultShop.trust;

  return (
    <div className="bg-[var(--cream-page)] pb-24 pt-28 sm:pt-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        {/* header */}
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <span className="inline-block rounded-full border border-[var(--olive)]/35 bg-white/70 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--olive)]">
              {cmsShop.eyebrow}
            </span>
          </Reveal>
          <h1 className="font-display mt-5 text-[clamp(3rem,9vw,6.5rem)] leading-[0.95] text-[var(--forest)]">
            {cmsShop.heading1}
            <br />
            <span className="text-[var(--sage-deep)]">{cmsShop.heading2}</span>
          </h1>
          <Reveal delay={120}>
            <p className="mx-auto mt-5 max-w-xl text-base font-medium leading-relaxed text-[var(--forest-deep)]/90 sm:text-lg">
              {cmsShop.description}
            </p>
          </Reveal>
        </div>

        {/* product grid */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 sm:gap-7 xl:grid-cols-4">
          {products.map((product, i) => (
            <Reveal key={product.slug} delay={i * 90} variant="up">
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>

        {/* trust strip */}
        <Reveal delay={120}>
          <div className="mt-16 grid grid-cols-2 gap-3 rounded-[1.6rem] bg-white/70 p-5 shadow-[0_16px_40px_rgba(69,31,34,0.08)] sm:grid-cols-4 sm:gap-4 sm:p-6">
            {trustLabels.map((label, i) => {
              const Icon = TRUST_ICONS[i] ?? ShieldCheck;
              return (
                <div
                  key={`${label}-${i}`}
                  className="flex items-center gap-3 rounded-2xl px-2 py-2"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--sage-soft)]">
                    <Icon className="h-5 w-5 text-[var(--forest)]" />
                  </span>
                  <span className="text-sm font-bold leading-tight text-[var(--forest)]">
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </Reveal>

        {/* help band */}
        <Reveal delay={160}>
          <div className="mt-14 flex flex-col items-center gap-5 rounded-[1.8rem] bg-[var(--sage-soft)] px-6 py-10 text-center shadow-[0_24px_54px_rgba(69,31,34,0.12)] sm:px-10">
            <p className="font-hand -rotate-2 text-2xl text-[var(--forest)] sm:text-3xl">
              not sure which stage fits?
            </p>
            <h2 className="max-w-2xl text-2xl font-bold leading-snug tracking-tight text-white sm:text-3xl">
              Follow the age chips — Stage 1 from 5 months, Stage 2 from 6
              months, Stage 3 from the first birthday.
            </h2>
            <div className="mt-1 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/#stages"
                className="btn-pill px-6 py-3 text-base"
              >
                See the stage guide
              </Link>
              <a
                href="tel:+919845379428"
                className="rounded-full border-2 border-white/70 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/15"
              >
                Ask a doctor — call us
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
