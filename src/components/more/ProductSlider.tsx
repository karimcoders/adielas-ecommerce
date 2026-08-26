"use client";

import {
  useCallback,
  useEffect,
  useState,
  type CSSProperties,
} from "react";
import Link from "next/link";
import { Plus, ShoppingBag } from "lucide-react";
import { Reveal } from "./Reveal";
import { Parallax } from "./motion";
import { ArrowUpRight, CurvedArrow } from "./icons";
import { useCart } from "./CartProvider";
import { useToast } from "@/hooks/use-toast";
import { formatINR, products } from "@/lib/products";

/* the three stage jars rotate here; the trio lives on the shop page */
const stages = products.filter((p) => p.slug !== "starter-trio");

export function ProductSlider() {
  const [index, setIndex] = useState(1);
  const { add } = useCart();
  const { toast } = useToast();

  const prev = useCallback(
    () => setIndex((i) => (i <= 0 ? stages.length - 1 : i - 1)),
    [],
  );
  const next = useCallback(
    () => setIndex((i) => (i >= stages.length - 1 ? 0 : i + 1)),
    [],
  );

  // gentle auto-advance until the visitor interacts
  useEffect(() => {
    const id = window.setInterval(next, 5200);
    const stop = () => window.clearInterval(id);
    window.addEventListener("pointerdown", stop, { once: true });
    return () => {
      window.clearInterval(id);
      window.removeEventListener("pointerdown", stop);
    };
  }, [next]);

  const active = stages[index];

  const quickAdd = useCallback(() => {
    add(active.slug, 1, { open: false });
    toast({
      title: "Added to cart",
      description: `${active.name} × 1 · ${formatINR(active.price)}`,
    });
  }, [add, active, toast]);

  return (
    <section
      id="shop"
      className="stage-morph relative overflow-x-clip pb-24 pt-20 sm:pb-32 sm:pt-28"
      style={
        {
          "--stage-bg": active.wash ?? "var(--cream-page)",
          "--stage-accent": active.accent,
        } as CSSProperties
      }
    >
      {/* big ring arc on the right — tints itself to the active stage colour */}
      <Parallax
        speed={0.1}
        className="pointer-events-none absolute -right-40 top-24 h-[520px] w-[520px] sm:-right-24"
      >
        <div className="stage-ring h-full w-full rounded-full border-[46px]" />
      </Parallax>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <Reveal>
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="font-display text-[clamp(3rem,8.5vw,7rem)] leading-[0.95] text-[var(--forest)]">
              PICK A STAGE
            </h2>
            <p className="mt-3 text-2xl font-semibold text-[var(--sage-deep)] sm:text-3xl">
              Clean, simple, age-wise nutrition
            </p>
            <p className="mx-auto mt-5 max-w-md text-sm font-medium leading-relaxed text-[var(--forest-deep)]/90 sm:text-base">
              400 g jars of sprouted, sun-dried goodness — formulated by a
              pediatrician, free from pesticides, preservatives and sugar.
            </p>
          </div>
        </Reveal>

        {/* handwritten note */}
        <Reveal delay={140}>
          <div className="relative mx-auto max-w-6xl">
            <div className="absolute -top-2 left-0 hidden -rotate-6 text-[var(--forest)] lg:block">
              <p className="font-hand text-2xl leading-[0.95]">
                Stage-wise
                <br />
                goodness
              </p>
              <CurvedArrow className="ml-8 mt-1 h-12 w-10 rotate-[115deg]" />
            </div>

            {/* composition: brand wordmark + current stage jar */}
            <div className="mt-14 flex items-center justify-center gap-6 sm:gap-14">
              <div className="relative flex w-[34%] max-w-[260px] items-end justify-center">
                <img
                  src="/images/adielas/logo.png"
                  alt=""
                  aria-hidden="true"
                  className="w-[78%] -rotate-[5deg] opacity-95 drop-shadow-[0_22px_30px_rgba(69,31,34,0.20)]"
                />
              </div>

              <span className="font-display flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-3xl text-[var(--forest)] shadow-[0_14px_30px_rgba(69,31,34,0.14)] sm:h-16 sm:w-16 sm:text-4xl">
                +
              </span>

              <div
                key={active.slug}
                className="pack-swap relative flex w-[44%] max-w-[320px] items-end justify-center"
              >
                <img
                  src={active.cut ?? active.image}
                  alt={active.name}
                  className="w-full rotate-[5deg] drop-shadow-[0_26px_34px_rgba(69,31,34,0.26)]"
                />
              </div>
            </div>

            {/* stage label + buy/add + arrows */}
            <div className="mt-10 flex flex-col items-center gap-6 text-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--olive)]">
                  {active.ageLabel} · {active.weight}
                </p>
                <h3 className="font-display mt-1 text-3xl leading-[0.95] text-[var(--forest)] sm:text-4xl">
                  {active.nameLines[0]}
                  <br />
                  {active.nameLines[1]}
                </h3>
                <p className="mt-2 max-w-sm text-sm font-medium text-[var(--forest-deep)]/80">
                  {active.tagline}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                <span className="font-display text-2xl text-[var(--forest)]">
                  {formatINR(active.price)}
                </span>
                <Link
                  href={`/shop/${active.slug}`}
                  className="btn-pill group px-6 py-3 text-base"
                >
                  View &amp; buy
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                </Link>
                <button
                  type="button"
                  onClick={quickAdd}
                  className="flex items-center gap-2 rounded-full border-2 border-[var(--forest)]/25 bg-white px-5 py-2.5 text-sm font-bold text-[var(--forest)] transition hover:-translate-y-0.5 hover:border-[var(--forest)] hover:bg-[var(--forest)] hover:text-[var(--cream)]"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Add
                  <span className="sr-only">
                    Add {active.name} to cart
                  </span>
                </button>
                <div className="flex items-center gap-3 sm:gap-4">
                  {/* stage colour dots — the section bg follows this colour */}
                  <div
                    className="flex items-center gap-2"
                    role="group"
                    aria-label="Choose a stage"
                  >
                    {stages.map((s, i) => (
                      <button
                        key={s.slug}
                        type="button"
                        onClick={() => setIndex(i)}
                        aria-label={`Show ${s.name}`}
                        aria-pressed={i === index}
                        style={{ backgroundColor: s.accent }}
                        className={`stage-dot h-4 w-4 rounded-full transition duration-300 sm:h-5 sm:w-5 ${
                          i === index
                            ? "scale-125 ring-2 ring-[var(--forest)]/70 ring-offset-2 ring-offset-transparent"
                            : "opacity-55 hover:scale-110 hover:opacity-100"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="h-6 w-px bg-[var(--forest)]/15" aria-hidden="true" />
                  <button
                    type="button"
                    onClick={prev}
                    aria-label="Previous stage"
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[var(--forest)] shadow transition hover:scale-110"
                  >
                    <ArrowUpRight className="h-5 w-5 rotate-[225deg]" />
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    aria-label="Next stage"
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[var(--forest)] shadow transition hover:scale-110"
                  >
                    <ArrowUpRight className="h-5 w-5 rotate-45" />
                  </button>
                </div>
              </div>
              <Link
                href="/shop"
                className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--olive)] underline underline-offset-4 hover:text-[var(--forest)]"
              >
                or shop all products →
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
