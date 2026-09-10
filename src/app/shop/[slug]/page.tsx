import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowUpRight,
  Ban,
  Leaf,
  RotateCcw,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/more/Reveal";
import { Gallery } from "@/components/shop/Gallery";
import { ProductPurchase } from "@/components/shop/ProductPurchase";
import { ProductCard } from "@/components/shop/ProductCard";
import { formatINR } from "@/lib/products";
import { getCatalog } from "@/lib/server-catalog";
import { jarOpenPath } from "@/lib/pdp-assets";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const catalog = await getCatalog();
  const product = catalog.find((p) => p.slug === slug);
  if (!product) return { title: "Product not found — ADIELAS" };
  return {
    title: `${product.name} — ADIELAS Nutrition`,
    description: product.tagline,
  };
}

const assurances = [
  { Icon: Leaf, label: "Sprouted grains" },
  { Icon: Ban, label: "No added sugar" },
  { Icon: Truck, label: "Ships in 24–48h" },
  { Icon: RotateCcw, label: "Easy returns" },
];

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const catalog = await getCatalog();
  const product = catalog.find((p) => p.slug === slug);
  if (!product) notFound();

  const discount = product.mrp
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  const gallery = [
    { src: product.image, alt: `${product.name} — product pack` },
    { src: jarOpenPath, alt: "Open jar with sprouted grain powder and spoon" },
    { src: "/images/adielas/jar-trio.png", alt: "All three ADIELAS stages together" },
  ];

  const related = catalog.filter((p) => p.slug !== product.slug);

  return (
    <div className="bg-[var(--cream-page)] pb-24 pt-24 sm:pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        {/* breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--olive)]"
        >
          <Link href="/" className="hover:text-[var(--forest)]">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/shop" className="hover:text-[var(--forest)]">
            Shop
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[var(--forest)]" aria-current="page">
            {product.nameLines[0]}
          </span>
        </nav>

        <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:gap-14">
          {/* gallery */}
          <Reveal variant="right">
            <Gallery images={gallery} />
          </Reveal>

          {/* details */}
          <div>
            <Reveal variant="left">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="rounded-full px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] text-white"
                  style={{ backgroundColor: product.accent }}
                >
                  {product.stageLabel}
                </span>
                <span className="rounded-full border border-[var(--olive)]/35 bg-white/70 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--olive)]">
                  {product.ageLabel}
                </span>
                <span className="rounded-full border border-[var(--olive)]/35 bg-white/70 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--olive)]">
                  {product.weight}
                </span>
              </div>

              <h1 className="font-display mt-5 text-[clamp(2.6rem,5.5vw,4.4rem)] leading-[0.95] text-[var(--forest)]">
                {product.nameLines[0]}
                <br />
                <span className="text-[var(--sage-deep)]">
                  {product.nameLines[1]}
                </span>
              </h1>

              <div className="mt-4 flex items-center gap-3">
                <span className="flex gap-0.5 text-[var(--sage-deep)]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.round(product.rating) ? "fill-current" : "opacity-30"}`}
                    />
                  ))}
                </span>
                <span className="text-sm font-bold text-[var(--forest)]">
                  {product.rating.toFixed(1)}
                </span>
                <span className="text-sm font-medium text-[var(--forest-deep)]/70">
                  · {product.reviews} verified reviews
                </span>
              </div>

              <p className="mt-4 max-w-lg text-lg font-medium leading-relaxed text-[var(--forest-deep)]/90">
                {product.tagline}
              </p>
            </Reveal>

            <Reveal variant="left" delay={120}>
              <div className="mt-6 flex items-end gap-3">
                <span className="font-display text-5xl leading-none text-[var(--forest)]">
                  {formatINR(product.price)}
                </span>
                {product.mrp && (
                  <>
                    <span className="pb-1 text-lg font-semibold text-[var(--forest-deep)]/45 line-through">
                      {formatINR(product.mrp)}
                    </span>
                    {discount > 0 && (
                      <span className="mb-1 rounded-full bg-[var(--sage-soft)] px-3 py-1 text-xs font-extrabold text-[var(--forest)]">
                        SAVE {discount}%
                      </span>
                    )}
                  </>
                )}
              </div>
            </Reveal>

            <Reveal variant="left" delay={200}>
              <div className="mt-7">
                <ProductPurchase product={product} />
              </div>
            </Reveal>

            <Reveal delay={260}>
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {assurances.map(({ Icon, label }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-2 rounded-2xl bg-white/80 px-3 py-4 text-center shadow-[0_10px_26px_rgba(69,31,34,0.07)]"
                  >
                    <Icon className="h-5 w-5 text-[var(--sage-deep)]" />
                    <span className="text-xs font-bold leading-tight text-[var(--forest)]">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={300}>
              <Accordion
                type="single"
                collapsible
                className="mt-8 rounded-[1.4rem] bg-white/80 px-5 shadow-[0_16px_40px_rgba(69,31,34,0.08)]"
              >
                <AccordionItem value="story">
                  <AccordionTrigger className="text-base font-bold">
                    The story inside
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 text-sm font-medium leading-relaxed text-[var(--forest-deep)]/90">
                    {product.description.map((para) => (
                      <p key={para.slice(0, 24)}>{para}</p>
                    ))}
                    <ul className="space-y-1.5 pt-1">
                      {product.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2">
                          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--sage-deep)]" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="ingredients">
                  <AccordionTrigger className="text-base font-bold">
                    Ingredients
                  </AccordionTrigger>
                  <AccordionContent className="text-sm font-medium leading-relaxed text-[var(--forest-deep)]/90">
                    {product.ingredients}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="nutrition">
                  <AccordionTrigger className="text-base font-bold">
                    Nutrition (per 100 g)
                  </AccordionTrigger>
                  <AccordionContent>
                    <dl className="divide-y divide-[var(--forest)]/10">
                      {product.nutrition.map((row) => (
                        <div
                          key={row.label}
                          className="flex items-center justify-between py-2 text-sm font-semibold"
                        >
                          <dt className="text-[var(--forest-deep)]/85">
                            {row.label}
                          </dt>
                          <dd className="text-[var(--forest)]">
                            {row.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="howto">
                  <AccordionTrigger className="text-base font-bold">
                    How to prepare
                  </AccordionTrigger>
                  <AccordionContent className="text-sm font-medium leading-relaxed text-[var(--forest-deep)]/90">
                    {product.howTo}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="shipping">
                  <AccordionTrigger className="text-base font-bold">
                    Shipping &amp; returns
                  </AccordionTrigger>
                  <AccordionContent className="text-sm font-medium leading-relaxed text-[var(--forest-deep)]/90">
                    Dispatched within 24–48 hours from our Bengaluru kitchen,
                    delivery in 2–5 days across India. Free shipping on orders
                    above {formatINR(499)}. Unopened jars can be returned
                    within 7 days — no questions, no forms.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Reveal>
          </div>
        </div>

        {/* related */}
        <div className="mt-20">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-[clamp(2.2rem,5vw,3.6rem)] leading-[0.95] text-[var(--forest)]">
                COMPLETE THE
                <br />
                <span className="text-[var(--sage-deep)]">JOURNEY</span>
              </h2>
              <Link
                href="/shop"
                className="btn-pill group mb-1 px-5 py-2.5 text-sm"
              >
                View all
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
              </Link>
            </div>
          </Reveal>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p, i) => (
              <Reveal key={p.slug} delay={i * 90}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
