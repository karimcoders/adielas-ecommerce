import { Check, Star } from "lucide-react";
import Link from "next/link";
import { MaskedLines, Reveal } from "./Reveal";
import { Parallax } from "./motion";
import { ArrowUpRight } from "./icons";
import { defaultMission } from "@/lib/cms-defaults";

type MissionCms = Partial<typeof defaultMission>;

export function Mission({ cms }: { cms?: MissionCms }) {
  const c = { ...defaultMission, ...(cms ?? {}) };
  const checklist =
    Array.isArray(c.checklist) && c.checklist.length > 0
      ? c.checklist
      : defaultMission.checklist;

  return (
    <section
      id="why"
      className="relative z-0 -mt-16 overflow-x-clip rounded-t-[50%_70px] bg-[var(--cream-page)] pb-24 pt-28 sm:-mt-24 sm:rounded-t-[50%_120px] sm:pb-28 sm:pt-40"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        {/* eyebrow */}
        <Reveal>
          <div className="flex justify-center">
            <span className="rounded-full border border-[var(--olive)]/35 bg-white/70 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--olive)]">
              {c.eyebrow}
            </span>
          </div>
        </Reveal>

        {/* clean, hierarchical headline */}
        <h2 className="mt-7 text-center">
          <MaskedLines
            startDelay={60}
            lines={[
              <span
                key="kicker"
                className="font-hand block text-2xl leading-none text-[var(--olive)] sm:text-3xl"
              >
                {c.kicker}
              </span>,
              <span
                key="l1"
                className="font-display mt-4 block text-[clamp(2.1rem,5.2vw,4.3rem)] leading-[0.98] text-[var(--forest)]"
              >
                {c.headingLine1}
              </span>,
              <span
                key="l2"
                className="font-display block text-[clamp(2.1rem,5.2vw,4.3rem)] leading-[0.98] text-[var(--sage-deep)]"
              >
                {c.headingLine2}
              </span>,
            ]}
          />
        </h2>

        <Reveal delay={120}>
          <p className="mx-auto mt-5 max-w-xl text-center text-base font-medium leading-relaxed text-[var(--forest-deep)]/90 sm:text-lg">
            {c.description}
          </p>
        </Reveal>

        <div className="mt-14 grid items-center gap-14 sm:mt-20 lg:grid-cols-[1.02fr_1fr] lg:gap-12">
          {/* arch-framed jar mockup + floating chips */}
          <Reveal variant="zoom">
            <div className="relative mx-auto w-full max-w-[500px]">
              <div className="relative overflow-hidden rounded-b-[2rem] rounded-t-[999px] border-[10px] border-white bg-[var(--cloud)] shadow-[0_40px_90px_rgba(69,31,34,0.20)] sm:border-[14px]">
                <img
                  src="/images/adielas/jar-stage2.png"
                  alt="ADIELAS Stage 2 multigrain jar — packaging mockup"
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>

              {/* floating sugar-free bubble */}
              <Parallax
                speed={0.08}
                className="absolute -left-3 top-[14%] sm:-left-8"
              >
                <div className="animate-floaty flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white text-center shadow-[0_18px_38px_rgba(69,31,34,0.16)] sm:h-28 sm:w-28">
                  <span className="font-display text-xl leading-none text-[var(--forest)] sm:text-2xl">
                    {c.bubbleValue}
                  </span>
                  <span className="mt-1 px-2 text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--olive)] sm:text-[10px]">
                    {c.bubbleLabel}
                  </span>
                </div>
              </Parallax>

              {/* floating polaroid */}
              <Parallax
                speed={-0.06}
                className="absolute -bottom-7 -right-2 sm:-right-6"
              >
                <div className="rotate-3 rounded-xl border-[5px] border-white bg-white pb-2 shadow-[0_22px_44px_rgba(69,31,34,0.20)]">
                  <img
                    src="/images/adielas/jar-stage1-cut.png"
                    alt="ADIELAS Stage 1 sprouted ragi jar"
                    loading="lazy"
                    className="mx-auto h-24 w-auto sm:h-28"
                  />
                  <div className="flex items-center justify-center gap-1 pt-1">
                    <span className="flex gap-0.5 text-[var(--sage-deep)]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-current" />
                      ))}
                    </span>
                    <span className="text-[10px] font-bold text-[var(--forest)]">
                      {c.socialProof}
                    </span>
                  </div>
                </div>
              </Parallax>
            </div>
          </Reveal>

          {/* copy + checklist */}
          <div>
            <Reveal variant="left">
              <p className="text-2xl font-bold leading-snug tracking-tight text-[var(--forest)] sm:text-3xl">
                {c.lead}
              </p>
            </Reveal>

            <div className="mt-8 space-y-5">
              {checklist.map((item, i) => (
                <Reveal key={item.title} variant="left" delay={120 + i * 90}>
                  <div className="flex items-start gap-4">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--sage-soft)]">
                      <Check
                        className="h-4 w-4 text-[var(--forest)]"
                        strokeWidth={3}
                      />
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-[var(--forest)] sm:text-lg">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm font-medium leading-relaxed text-[var(--forest-deep)]/85 sm:text-[15px]">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal variant="left" delay={400}>
              <div className="mt-9 flex flex-wrap items-center gap-6">
                <Link
                  href="/shop"
                  className="btn-pill group px-6 py-3 text-base"
                >
                  {c.ctaText}
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                </Link>
                <Link
                  href="/#doctor"
                  className="flex items-center gap-2 text-sm font-semibold text-[var(--forest)]"
                >
                  <span className="flex gap-0.5 text-[var(--sage-deep)]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </span>
                  <span className="underline underline-offset-4">
                    {c.doctorNote}
                  </span>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
