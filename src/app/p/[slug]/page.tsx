import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, ShieldCheck } from "lucide-react";
import { db } from "@/lib/db";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await db.customPage.findUnique({
    where: { slug },
  });

  if (!page || !page.published) {
    return {
      title: "Page Not Found — ADIELAS",
    };
  }

  return {
    title: `${page.title} — ADIELAS`,
    description: `Official ${page.title} for ADIELAS Pediatrician-Backed Nutrition.`,
  };
}

export default async function CustomPageView({ params }: Props) {
  const { slug } = await params;
  const page = await db.customPage.findUnique({
    where: { slug },
  });

  if (!page || !page.published) {
    notFound();
  }

  const formattedDate = new Date(page.updatedAt).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-[var(--cream-page)] pb-24 pt-28 sm:pt-36">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--olive)]">
          <Link
            href="/"
            className="flex items-center gap-1.5 transition hover:text-[var(--forest)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Home
          </Link>
          <span>/</span>
          <span className="text-[var(--forest)] truncate max-w-xs">{page.title}</span>
        </div>

        {/* Hero Header Card */}
        <div className="overflow-hidden rounded-[2rem] bg-[var(--forest-deep)] p-8 text-[var(--cream)] shadow-[0_20px_50px_rgba(69,31,34,0.18)] sm:p-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-3.5 py-1 text-xs font-bold text-amber-300">
            <ShieldCheck className="h-3.5 w-3.5" />
            Official Policy & Information
          </div>
          <h1 className="font-display mt-4 text-[clamp(2rem,5vw,3.5rem)] leading-[0.95] text-white">
            {page.title}
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-5 text-xs font-semibold text-white/70">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-amber-300" />
              Last updated: {formattedDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-amber-300" />
              Verified by ADIELAS Pediatric Team
            </span>
          </div>
        </div>

        {/* Page Content Body */}
        <div className="mt-8 rounded-[2rem] bg-white p-6 shadow-[0_12px_36px_rgba(69,31,34,0.08)] sm:p-12">
          <div className="prose prose-stone max-w-none text-base leading-relaxed text-[var(--forest-deep)]/90">
            {page.content.split("\n\n").map((block, idx) => {
              const trimmed = block.trim();
              if (trimmed.startsWith("### ")) {
                return (
                  <h3
                    key={idx}
                    className="font-display mb-3 mt-8 text-xl text-[var(--forest)]"
                  >
                    {trimmed.replace("### ", "")}
                  </h3>
                );
              }
              if (trimmed.startsWith("## ")) {
                return (
                  <h2
                    key={idx}
                    className="font-display mb-4 mt-10 text-2xl text-[var(--forest)] first:mt-0"
                  >
                    {trimmed.replace("## ", "")}
                  </h2>
                );
              }
              if (trimmed.startsWith("# ")) {
                return (
                  <h1
                    key={idx}
                    className="font-display mb-4 mt-8 text-3xl text-[var(--forest)]"
                  >
                    {trimmed.replace("# ", "")}
                  </h1>
                );
              }
              if (trimmed.startsWith("- ")) {
                const listItems = trimmed.split("\n").filter((l) => l.trim().startsWith("- "));
                return (
                  <ul key={idx} className="my-4 space-y-2 list-disc pl-5">
                    {listItems.map((item, itemIdx) => (
                      <li key={itemIdx} className="text-sm font-medium leading-relaxed">
                        <span
                          dangerouslySetInnerHTML={{
                            __html: item
                              .replace(/^- /, "")
                              .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                              .replace(/\*(.*?)\*/g, "<em>$1</em>"),
                          }}
                        />
                      </li>
                    ))}
                  </ul>
                );
              }
              if (/^\d+\.\s/.test(trimmed)) {
                const listItems = trimmed.split("\n").filter((l) => /^\d+\.\s/.test(l.trim()));
                return (
                  <ol key={idx} className="my-4 space-y-2 list-decimal pl-5">
                    {listItems.map((item, itemIdx) => (
                      <li key={itemIdx} className="text-sm font-medium leading-relaxed">
                        <span
                          dangerouslySetInnerHTML={{
                            __html: item
                              .replace(/^\d+\.\s/, "")
                              .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                              .replace(/\*(.*?)\*/g, "<em>$1</em>"),
                          }}
                        />
                      </li>
                    ))}
                  </ol>
                );
              }
              return (
                <p
                  key={idx}
                  className="my-4 text-base font-medium leading-relaxed text-[var(--forest-deep)]/85"
                  dangerouslySetInnerHTML={{
                    __html: trimmed
                      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                      .replace(/\*(.*?)\*/g, "<em>$1</em>")
                      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="font-bold underline text-[var(--forest)] hover:text-amber-700">$1</a>'),
                  }}
                />
              );
            })}
          </div>

          {/* Need Assistance Callout */}
          <div className="mt-12 flex flex-col items-start justify-between gap-4 rounded-2xl border border-[var(--forest)]/15 bg-[var(--cream)]/60 p-6 sm:flex-row sm:items-center">
            <div>
              <h4 className="font-display text-base text-[var(--forest)]">
                Still have questions regarding this policy?
              </h4>
              <p className="mt-1 text-xs font-semibold text-[var(--forest-deep)]/70">
                Our care team and pediatrician support are available 7 days a week.
              </p>
            </div>
            <a
              href="mailto:Info@adielas.com"
              className="rounded-full bg-[var(--forest)] px-5 py-2.5 text-xs font-bold text-[var(--cream)] shadow-sm transition hover:bg-[var(--forest-deep)]"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
