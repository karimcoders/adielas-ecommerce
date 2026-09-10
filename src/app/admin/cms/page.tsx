"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  ExternalLink,
  Layers,
  Loader2,
  RotateCcw,
  Save,
} from "lucide-react";
import {
  defaultBenefits,
  defaultComparison,
  defaultFlavors,
  defaultFooter,
  defaultHero,
  defaultMarquee,
  defaultMission,
  defaultReviews,
  defaultSettings,
  defaultShop,
} from "@/lib/cms-defaults";

type SectionKey =
  | "hero"
  | "marquee"
  | "mission"
  | "benefits"
  | "flavors"
  | "comparison"
  | "reviews"
  | "shop"
  | "footer"
  | "settings";

const TABS: { id: SectionKey; label: string; hint: string }[] = [
  { id: "hero", label: "Hero", hint: "Top banner: headline, subtext, stats, CTA" },
  { id: "marquee", label: "Marquee", hint: "Rotating ticker phrases" },
  { id: "mission", label: "Mission", hint: "'Why Adielas' section" },
  { id: "benefits", label: "Benefits", hint: "Four 'MORE ...' cards" },
  { id: "flavors", label: "Stages", hint: "Stage trio heading + notes" },
  { id: "comparison", label: "Comparison", hint: "Comparison table rows" },
  { id: "reviews", label: "Reviews", hint: "Testimonial carousel" },
  { id: "shop", label: "Shop Page", hint: "Shop heading + trust badges" },
  { id: "footer", label: "Footer", hint: "Footer CTA, about, copyright" },
  { id: "settings", label: "Settings", hint: "Store name, contact, socials" },
];

const DEFAULTS: Record<SectionKey, unknown> = {
  hero: defaultHero,
  marquee: defaultMarquee,
  mission: defaultMission,
  benefits: defaultBenefits,
  flavors: defaultFlavors,
  comparison: defaultComparison,
  reviews: defaultReviews,
  shop: defaultShop,
  footer: defaultFooter,
  settings: defaultSettings,
};

export default function AdminCmsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SectionKey>("hero");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [toast, setToast] = useState<{ ok: boolean; msg: string } | null>(null);

  const [cms, setCms] = useState<Record<SectionKey, any>>({
    hero: defaultHero,
    marquee: defaultMarquee,
    mission: defaultMission,
    benefits: defaultBenefits,
    flavors: defaultFlavors,
    comparison: defaultComparison,
    reviews: defaultReviews,
    shop: defaultShop,
    footer: defaultFooter,
    settings: defaultSettings,
  });

  const loadCms = useCallback(async () => {
    try {
      setLoading(true);
      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json();
      if (!meData?.user || meData.user.role !== "ADMIN") {
        router.push("/admin/login");
        return;
      }

      const res = await fetch("/api/cms", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setCms((prev) => ({
          hero: data.hero ?? prev.hero,
          marquee: data.marquee ?? prev.marquee,
          mission: data.mission ?? prev.mission,
          benefits: data.benefits ?? prev.benefits,
          flavors: data.flavors ?? prev.flavors,
          comparison: data.comparison ?? prev.comparison,
          reviews: data.reviews ?? prev.reviews,
          shop: data.shop ?? prev.shop,
          footer: data.footer ?? prev.footer,
          settings: data.settings ?? prev.settings,
        }));
      }
    } catch {
      setToast({ ok: false, msg: "Failed to load CMS content" });
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadCms();
  }, [loadCms]);

  const showToast = (ok: boolean, msg: string) => {
    setToast({ ok, msg });
    window.setTimeout(() => setToast(null), 2600);
  };

  const update = (section: SectionKey, patch: Record<string, unknown>) => {
    setCms((prev) => ({ ...prev, [section]: { ...prev[section], ...patch } }));
  };

  const saveSection = async () => {
    try {
      setSaving(true);
      const res = await fetch("/api/cms", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: activeTab, data: cms[activeTab] }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Save failed");
      }
      showToast(true, "Saved! Live site updated.");
    } catch (e) {
      showToast(false, e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const resetSection = async () => {
    if (!window.confirm(`Reset "${activeTab}" to the original designed content?`)) return;
    try {
      setResetting(true);
      const res = await fetch(`/api/cms?section=${activeTab}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Reset failed");
      setCms((prev) => ({ ...prev, [activeTab]: clone(DEFAULTS[activeTab]) }));
      showToast(true, "Section reset to defaults.");
    } catch (e) {
      showToast(false, e instanceof Error ? e.message : "Reset failed");
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f3ec] text-[#45202a]">
        <div className="flex items-center gap-3 text-sm font-bold">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading CMS…
        </div>
      </div>
    );
  }

  const active = TABS.find((t) => t.id === activeTab)!;

  return (
    <div className="min-h-screen bg-[#f6f3ec] text-[#3d1f27]">
      {/* top bar — static on mobile (admin shell bars are fixed), sticky on desktop */}
      <header className="border-b border-[#3d1f27]/10 bg-white/90 backdrop-blur lg:sticky lg:top-0 lg:z-30">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
            <div className="flex min-w-0 flex-1 items-center gap-3 sm:flex-1">
              <Link
                href="/admin"
                className="flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-[#3d1f27]/15 px-3 text-sm font-bold text-[#3d1f27] transition hover:bg-[#3d1f27]/5"
              >
                <ArrowLeft className="h-4 w-4" />
                Dashboard
              </Link>
              <div className="hidden min-w-0 flex-1 sm:block">
                <h1 className="font-display truncate text-lg font-black uppercase leading-none tracking-wide">
                  Content CMS
                </h1>
                <p className="text-xs font-medium text-[#3d1f27]/60">
                  Edit any page of the live site — changes apply instantly after saving.
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                aria-label="View live site"
                className="flex h-9 items-center gap-1.5 rounded-full border border-[#3d1f27]/15 px-3 text-sm font-bold text-[#3d1f27] transition hover:bg-[#3d1f27]/5"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="hidden sm:inline">View site</span>
              </a>
              <button
                type="button"
                onClick={saveSection}
                disabled={saving}
                className="flex h-9 items-center gap-1.5 rounded-full bg-[#3f6b3f] px-4 text-sm font-bold text-white transition hover:bg-[#355a35] disabled:opacity-60"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save
              </button>
            </div>
            <h1 className="font-display w-full text-lg font-black uppercase leading-none tracking-wide sm:hidden">
              Content CMS
            </h1>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[240px_1fr]">
        {/* section rail — horizontal scroll chips on mobile, sidebar list on desktop */}
        <aside className="min-w-0 lg:sticky lg:top-[76px] lg:self-start">
          <div className="rounded-2xl border border-[#3d1f27]/10 bg-white p-2 shadow-sm">
            <div className="flex gap-1 overflow-x-auto pb-1 max-lg:-mx-1 max-lg:px-1 lg:flex-col lg:overflow-visible lg:pb-0">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id)}
                  className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2.5 text-left text-sm font-bold transition lg:w-full lg:shrink lg:whitespace-normal ${
                    activeTab === t.id
                      ? "bg-[#3f6b3f] text-white"
                      : "text-[#3d1f27] hover:bg-[#3d1f27]/5"
                  }`}
                >
                  <Layers className="h-4 w-4 shrink-0" />
                  {t.label}
                  {activeTab === t.id && <Check className="ml-auto hidden h-4 w-4 lg:block" />}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={resetSection}
            disabled={resetting}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#b3352f]/30 px-3 py-2.5 text-sm font-bold text-[#b3352f] transition hover:bg-[#b3352f]/5 disabled:opacity-60"
          >
            {resetting ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
            Reset section to default
          </button>
        </aside>

        {/* editor */}
        <main className="min-w-0 rounded-2xl border border-[#3d1f27]/10 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 border-b border-[#3d1f27]/10 pb-4">
            <h2 className="font-display text-2xl font-black uppercase tracking-wide">
              {active.label}
            </h2>
            <p className="text-sm font-medium text-[#3d1f27]/60">{active.hint}</p>
          </div>

          {activeTab === "hero" && (
            <HeroEditor cms={cms.hero} update={(p) => update("hero", p)} />
          )}
          {activeTab === "marquee" && (
            <MarqueeEditor cms={cms.marquee} update={(p) => update("marquee", p)} />
          )}
          {activeTab === "mission" && (
            <MissionEditor cms={cms.mission} update={(p) => update("mission", p)} />
          )}
          {activeTab === "benefits" && (
            <BenefitsEditor cms={cms.benefits} update={(p) => update("benefits", p)} />
          )}
          {activeTab === "flavors" && (
            <FlavorsEditor cms={cms.flavors} update={(p) => update("flavors", p)} />
          )}
          {activeTab === "comparison" && (
            <ComparisonEditor cms={cms.comparison} update={(p) => update("comparison", p)} />
          )}
          {activeTab === "reviews" && (
            <ReviewsEditor cms={cms.reviews} update={(p) => update("reviews", p)} />
          )}
          {activeTab === "shop" && (
            <ShopEditor cms={cms.shop} update={(p) => update("shop", p)} />
          )}
          {activeTab === "footer" && (
            <FooterEditor cms={cms.footer} update={(p) => update("footer", p)} />
          )}
          {activeTab === "settings" && (
            <SettingsEditor cms={cms.settings} update={(p) => update("settings", p)} />
          )}

          {/* save bar */}
          <div className="mt-8 flex items-center justify-between gap-3 border-t border-[#3d1f27]/10 pt-5">
            <p className="text-xs font-medium text-[#3d1f27]/55">
              Saving updates the live storefront immediately.
            </p>
            <button
              type="button"
              onClick={saveSection}
              disabled={saving}
              className="flex h-11 items-center gap-2 rounded-full bg-[#3f6b3f] px-6 text-sm font-bold text-white transition hover:bg-[#355a35] disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save {active.label}
            </button>
          </div>
        </main>
      </div>

      {/* toast */}
      {toast && (
        <div
          className={`fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-lg ${
            toast.ok ? "bg-[#3f6b3f]" : "bg-[#b3352f]"
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

/* ---------- shared field primitives ---------- */

export function Field({
  label,
  value,
  onChange,
  placeholder,
  hint,
  type = "text",
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-wider text-[#3d1f27]/70">
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-[#3d1f27]/15 bg-[#faf8f3] px-3.5 py-2.5 text-base font-medium outline-none transition focus:border-[#3f6b3f] focus:bg-white sm:text-sm"
      />
      {hint && <span className="mt-1 block text-[11px] font-medium text-[#3d1f27]/50">{hint}</span>}
    </label>
  );
}

export function AreaField({
  label,
  value,
  onChange,
  rows = 3,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-wider text-[#3d1f27]/70">
        {label}
      </span>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-[#3d1f27]/15 bg-[#faf8f3] px-3.5 py-2.5 text-base font-medium outline-none transition focus:border-[#3f6b3f] focus:bg-white sm:text-sm"
      />
      {hint && <span className="mt-1 block text-[11px] font-medium text-[#3d1f27]/50">{hint}</span>}
    </label>
  );
}

export function ArrayItemCard({
  title,
  onRemove,
  canRemove = true,
  children,
}: {
  title: string;
  onRemove?: () => void;
  canRemove?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#3d1f27]/10 bg-[#faf8f3] p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-extrabold uppercase tracking-wider text-[#3d1f27]/70">
          {title}
        </span>
        {canRemove && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="rounded-full border border-[#b3352f]/30 px-2.5 py-1 text-[11px] font-bold text-[#b3352f] transition hover:bg-[#b3352f]/5"
          >
            Remove
          </button>
        )}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-xl border-2 border-dashed border-[#3f6b3f]/35 px-3 py-2.5 text-sm font-bold text-[#3f6b3f] transition hover:bg-[#3f6b3f]/5"
    >
      + {label}
    </button>
  );
}

/* ---------- section editors ---------- */

function HeroEditor({
  cms,
  update,
}: {
  cms: typeof defaultHero;
  update: (patch: Record<string, unknown>) => void;
}) {
  const stats = Array.isArray(cms.stats) ? cms.stats : defaultHero.stats;

  const setStat = (i: number, patch: Record<string, unknown>) => {
    const next = stats.map((s: Record<string, unknown>, idx: number) =>
      idx === i ? { ...s, ...patch } : s
    );
    update({ stats: next });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Brand script word" value={cms.brandScript} onChange={(v) => update({ brandScript: v })} />
        <Field label="Handwritten note (line 1)" value={cms.noteLine1} onChange={(v) => update({ noteLine1: v })} />
        <Field label="Headline line 1" value={cms.headlineLine1} onChange={(v) => update({ headlineLine1: v })} />
        <Field label="Headline line 2" value={cms.headlineLine2} onChange={(v) => update({ headlineLine2: v })} />
        <Field label="Headline line 3" value={cms.headlineLine3} onChange={(v) => update({ headlineLine3: v })} />
        <Field label="Handwritten note (line 2)" value={cms.noteLine2} onChange={(v) => update({ noteLine2: v })} />
        <Field label="CTA button text" value={cms.ctaText} onChange={(v) => update({ ctaText: v })} />
        <Field label="CTA button link" value={cms.ctaLink} onChange={(v) => update({ ctaLink: v })} hint="e.g. /shop or /#stages" />
      </div>
      <AreaField label="Sub-headline" rows={3} value={cms.subheadline} onChange={(v) => update({ subheadline: v })} />

      <div className="space-y-3">
        <span className="block text-xs font-extrabold uppercase tracking-wider text-[#3d1f27]/70">
          Floating stat bubbles (3)
        </span>
        {stats.map((s: Record<string, unknown>, i: number) => (
          <ArrayItemCard key={i} title={`Stat bubble ${i + 1}`} canRemove={false}>
            <div className="grid gap-3 sm:grid-cols-3">
              <Field
                label="Number"
                type="number"
                value={Number(s.to) || 0}
                onChange={(v) => setStat(i, { to: Number(v) || 0 })}
              />
              <Field label="Unit" value={String(s.unit ?? "")} onChange={(v) => setStat(i, { unit: v })} hint="% , g, +" />
              <Field label="Label" value={String(s.label ?? "")} onChange={(v) => setStat(i, { label: v })} />
            </div>
          </ArrayItemCard>
        ))}
      </div>
    </div>
  );
}

function MarqueeEditor({
  cms,
  update,
}: {
  cms: typeof defaultMarquee;
  update: (patch: Record<string, unknown>) => void;
}) {
  const phrases = Array.isArray(cms.phrases) ? cms.phrases : [];

  return (
    <div className="space-y-4">
      <p className="rounded-xl bg-[#3f6b3f]/8 px-4 py-3 text-xs font-semibold text-[#3f6b3f]">
        These phrases repeat around the rotating circle band below the hero. Keep them short and punchy.
      </p>
      {phrases.map((p: string, i: number) => (
        <div key={i} className="flex items-end gap-2">
          <div className="flex-1">
            <Field
              label={`Phrase ${i + 1}`}
              value={p}
              onChange={(v) => update({ phrases: phrases.map((x: string, idx: number) => (idx === i ? v : x)) })}
            />
          </div>
          <button
            type="button"
            onClick={() => update({ phrases: phrases.filter((_: string, idx: number) => idx !== i) })}
            className="mb-0.5 rounded-full border border-[#b3352f]/30 px-3 py-2.5 text-xs font-bold text-[#b3352f] transition hover:bg-[#b3352f]/5"
          >
            Remove
          </button>
        </div>
      ))}
      <AddButton label="Add phrase" onClick={() => update({ phrases: [...phrases, "NEW PHRASE"] })} />
    </div>
  );
}

function MissionEditor({
  cms,
  update,
}: {
  cms: typeof defaultMission;
  update: (patch: Record<string, unknown>) => void;
}) {
  const checklist = Array.isArray(cms.checklist) ? cms.checklist : defaultMission.checklist;

  const setItem = (i: number, patch: Record<string, unknown>) => {
    update({
      checklist: checklist.map((c: Record<string, unknown>, idx: number) =>
        idx === i ? { ...c, ...patch } : c
      ),
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Eyebrow badge" value={cms.eyebrow} onChange={(v) => update({ eyebrow: v })} />
        <Field label="Handwritten kicker" value={cms.kicker} onChange={(v) => update({ kicker: v })} />
        <Field label="Heading line 1" value={cms.headingLine1} onChange={(v) => update({ headingLine1: v })} />
        <Field label="Heading line 2" value={cms.headingLine2} onChange={(v) => update({ headingLine2: v })} />
        <Field label="Floating bubble value" value={cms.bubbleValue} onChange={(v) => update({ bubbleValue: v })} hint="e.g. 0g" />
        <Field label="Floating bubble label" value={cms.bubbleLabel} onChange={(v) => update({ bubbleLabel: v })} hint="e.g. Added sugar" />
        <Field label="Social proof text" value={cms.socialProof} onChange={(v) => update({ socialProof: v })} hint="e.g. 12k+ parents" />
        <Field label="CTA button text" value={cms.ctaText} onChange={(v) => update({ ctaText: v })} />
        <Field label="Doctor note link text" value={cms.doctorNote} onChange={(v) => update({ doctorNote: v })} />
      </div>
      <AreaField label="Description (below heading)" rows={3} value={cms.description} onChange={(v) => update({ description: v })} />
      <AreaField label="Lead paragraph (right column)" rows={2} value={cms.lead} onChange={(v) => update({ lead: v })} />

      <div className="space-y-3">
        <span className="block text-xs font-extrabold uppercase tracking-wider text-[#3d1f27]/70">
          Checklist items
        </span>
        {checklist.map((item: Record<string, unknown>, i: number) => (
          <ArrayItemCard key={i} title={`Item ${i + 1}`} canRemove={false}>
            <Field label="Title" value={String(item.title ?? "")} onChange={(v) => setItem(i, { title: v })} />
            <AreaField label="Body" rows={2} value={String(item.body ?? "")} onChange={(v) => setItem(i, { body: v })} />
          </ArrayItemCard>
        ))}
      </div>
    </div>
  );
}

function BenefitsEditor({
  cms,
  update,
}: {
  cms: typeof defaultBenefits;
  update: (patch: Record<string, unknown>) => void;
}) {
  const scenes = Array.isArray(cms.scenes) ? cms.scenes : defaultBenefits.scenes;

  const setScene = (i: number, patch: Record<string, unknown>) => {
    update({
      scenes: scenes.map((s: Record<string, unknown>, idx: number) =>
        idx === i ? { ...s, ...patch } : s
      ),
    });
  };

  return (
    <div className="space-y-4">
      <p className="rounded-xl bg-[#3f6b3f]/8 px-4 py-3 text-xs font-semibold text-[#3f6b3f]">
        The four big cards on the homepage. &quot;Highlight word&quot; gets the hand-drawn circle — leave it empty to skip.
      </p>
      {scenes.map((s: Record<string, unknown>, i: number) => (
        <ArrayItemCard key={i} title={`Card ${i + 1}`} canRemove={false}>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Title line 1" value={String(s.titleLine1 ?? "")} onChange={(v) => setScene(i, { titleLine1: v })} />
            <Field label="Title line 2" value={String(s.titleLine2 ?? "")} onChange={(v) => setScene(i, { titleLine2: v })} />
          </div>
          <Field label="Highlight word (circled)" value={String(s.highlight ?? "")} onChange={(v) => setScene(i, { highlight: v })} />
          <AreaField label="Caption" rows={2} value={String(s.body ?? "")} onChange={(v) => setScene(i, { body: v })} />
        </ArrayItemCard>
      ))}
    </div>
  );
}

function FlavorsEditor({
  cms,
  update,
}: {
  cms: typeof defaultFlavors;
  update: (patch: Record<string, unknown>) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Heading line 1" value={cms.headingLine1} onChange={(v) => update({ headingLine1: v })} />
        <Field label="Heading line 2 (highlighted)" value={cms.headingLine2} onChange={(v) => update({ headingLine2: v })} />
      </div>
      <AreaField label="Stage 1 note (left)" rows={2} value={cms.stageNote1} onChange={(v) => update({ stageNote1: v })} hint="Two lines separated by Enter" />
      <AreaField label="Stage 2 note (centre — shown on pack hover only)" rows={2} value={cms.stageNote2} onChange={(v) => update({ stageNote2: v })} hint="Two lines separated by Enter" />
      <AreaField label="Stage 3 note (right)" rows={2} value={cms.stageNote3} onChange={(v) => update({ stageNote3: v })} hint="Two lines separated by Enter" />
    </div>
  );
}

function ComparisonEditor({
  cms,
  update,
}: {
  cms: typeof defaultComparison;
  update: (patch: Record<string, unknown>) => void;
}) {
  const rows = Array.isArray(cms.rows) ? cms.rows : [];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Heading line 1" value={cms.headingLine1} onChange={(v) => update({ headingLine1: v })} />
        <Field label="Heading line 2 (highlighted)" value={cms.headingLine2} onChange={(v) => update({ headingLine2: v })} />
        <Field label="Column 1 label" value={cms.colLeft} onChange={(v) => update({ colLeft: v })} />
        <Field label="Column 2 label (our brand)" value={cms.colMid} onChange={(v) => update({ colMid: v })} />
        <Field label="Column 3 label (the other guys)" value={cms.colRight} onChange={(v) => update({ colRight: v })} />
        <Field label="CTA button text" value={cms.ctaText} onChange={(v) => update({ ctaText: v })} />
        <Field label="CTA button link" value={cms.ctaLink} onChange={(v) => update({ ctaLink: v })} />
      </div>

      <div className="space-y-3">
        <span className="block text-xs font-extrabold uppercase tracking-wider text-[#3d1f27]/70">
          Comparison rows
        </span>
        {rows.map((r: string, i: number) => (
          <div key={i} className="flex items-end gap-2">
            <div className="flex-1">
              <Field
                label={`Row ${i + 1}`}
                value={r}
                onChange={(v) => update({ rows: rows.map((x: string, idx: number) => (idx === i ? v : x)) })}
              />
            </div>
            <button
              type="button"
              onClick={() => update({ rows: rows.filter((_: string, idx: number) => idx !== i) })}
              className="mb-0.5 rounded-full border border-[#b3352f]/30 px-3 py-2.5 text-xs font-bold text-[#b3352f] transition hover:bg-[#b3352f]/5"
            >
              Remove
            </button>
          </div>
        ))}
        <AddButton label="Add row" onClick={() => update({ rows: [...rows, "New benefit row"] })} />
      </div>
    </div>
  );
}

function ReviewsEditor({
  cms,
  update,
}: {
  cms: typeof defaultReviews;
  update: (patch: Record<string, unknown>) => void;
}) {
  const items = Array.isArray(cms.items) ? cms.items : defaultReviews.items;

  const setItem = (i: number, patch: Record<string, unknown>) => {
    update({
      items: items.map((it: Record<string, unknown>, idx: number) =>
        idx === i ? { ...it, ...patch } : it
      ),
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Eyebrow (handwritten)" value={cms.eyebrow} onChange={(v) => update({ eyebrow: v })} />
        <Field label="Sub-heading" value={cms.subheading} onChange={(v) => update({ subheading: v })} />
        <Field label="Big heading line 1" value={cms.heading1} onChange={(v) => update({ heading1: v })} />
        <Field label="Big heading line 2" value={cms.heading2} onChange={(v) => update({ heading2: v })} />
      </div>

      <div className="space-y-3">
        <span className="block text-xs font-extrabold uppercase tracking-wider text-[#3d1f27]/70">
          Review cards
        </span>
        {items.map((it: Record<string, unknown>, i: number) => (
          <ArrayItemCard
            key={i}
            title={`Review ${i + 1}`}
            onRemove={() => update({ items: items.filter((_: unknown, idx: number) => idx !== i) })}
          >
            <Field label="Title" value={String(it.title ?? "")} onChange={(v) => setItem(i, { title: v })} />
            <AreaField label="Review text" rows={3} value={String(it.body ?? "")} onChange={(v) => setItem(i, { body: v })} />
            <Field label="Parent name" value={String(it.name ?? "")} onChange={(v) => setItem(i, { name: v })} />
          </ArrayItemCard>
        ))}
        <AddButton
          label="Add review"
          onClick={() => update({ items: [...items, { title: "Great product!", body: "Write the review here.", name: "Happy Parent" }] })}
        />
      </div>
    </div>
  );
}

function ShopEditor({
  cms,
  update,
}: {
  cms: typeof defaultShop;
  update: (patch: Record<string, unknown>) => void;
}) {
  const trust = Array.isArray(cms.trust) ? cms.trust : defaultShop.trust;

  const setTrust = (i: number, v: string) => {
    update({ trust: trust.map((x: string, idx: number) => (idx === i ? v : x)) });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Eyebrow badge" value={cms.eyebrow} onChange={(v) => update({ eyebrow: v })} />
        <Field label="Heading line 1" value={cms.heading1} onChange={(v) => update({ heading1: v })} />
        <Field label="Heading line 2 (highlighted)" value={cms.heading2} onChange={(v) => update({ heading2: v })} />
      </div>
      <AreaField label="Description" rows={3} value={cms.description} onChange={(v) => update({ description: v })} />

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Trust badge 1" value={String(trust[0] ?? "")} onChange={(v) => setTrust(0, v)} />
        <Field label="Trust badge 2" value={String(trust[1] ?? "")} onChange={(v) => setTrust(1, v)} />
        <Field label="Trust badge 3" value={String(trust[2] ?? "")} onChange={(v) => setTrust(2, v)} />
        <Field label="Trust badge 4" value={String(trust[3] ?? "")} onChange={(v) => setTrust(3, v)} />
      </div>
    </div>
  );
}

function FooterEditor({
  cms,
  update,
}: {
  cms: typeof defaultFooter;
  update: (patch: Record<string, unknown>) => void;
}) {
  return (
    <div className="space-y-4">
      <Field label="CTA button text" value={cms.ctaText} onChange={(v) => update({ ctaText: v })} />
      <AreaField label="About text" rows={3} value={cms.aboutText} onChange={(v) => update({ aboutText: v })} />
      <Field label="Copyright text" value={cms.copyrightText} onChange={(v) => update({ copyrightText: v })} hint='e.g. "All rights reserved."' />
      <p className="rounded-xl bg-[#3f6b3f]/8 px-4 py-3 text-xs font-semibold text-[#3f6b3f]">
        Store name, contact details, GST number and social links live in the Settings tab.
      </p>
    </div>
  );
}

function SettingsEditor({
  cms,
  update,
}: {
  cms: typeof defaultSettings;
  update: (patch: Record<string, unknown>) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Store name" value={cms.storeName} onChange={(v) => update({ storeName: v })} />
        <Field label="Tagline" value={cms.tagline} onChange={(v) => update({ tagline: v })} />
        <Field label="Phone" value={cms.phone} onChange={(v) => update({ phone: v })} />
        <Field label="Email" value={cms.email} onChange={(v) => update({ email: v })} />
        <Field label="GST number" value={cms.gstNumber} onChange={(v) => update({ gstNumber: v })} />
        <Field label="WhatsApp number" value={cms.whatsappNumber} onChange={(v) => update({ whatsappNumber: v })} />
        <Field label="Instagram URL" value={cms.instagramUrl} onChange={(v) => update({ instagramUrl: v })} />
        <Field label="YouTube URL" value={cms.youtubeUrl} onChange={(v) => update({ youtubeUrl: v })} />
        <Field
          label="Free shipping threshold (₹)"
          type="number"
          value={Number(cms.freeShippingThreshold) || 0}
          onChange={(v) => update({ freeShippingThreshold: Number(v) || 0 })}
        />
        <Field
          label="Shipping fee (₹)"
          type="number"
          value={Number(cms.shippingFee) || 0}
          onChange={(v) => update({ shippingFee: Number(v) || 0 })}
        />
      </div>
      <AreaField label="Store address" rows={2} value={cms.address} onChange={(v) => update({ address: v })} />
    </div>
  );
}
