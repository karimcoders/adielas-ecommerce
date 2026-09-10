"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Eye,
  FileText,
  HeartHandshake,
  Layers,
  MessageSquare,
  Plus,
  RefreshCw,
  Save,
  Settings,
  Sparkles,
  Trash2,
} from "lucide-react";
import {
  defaultBenefits,
  defaultHero,
  defaultMarquee,
  defaultMission,
  defaultReviews,
  defaultSettings,
} from "@/lib/cms-defaults";

export default function AdminCmsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "hero" | "mission" | "benefits" | "reviews" | "settings"
  >("hero");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // CMS State
  const [hero, setHero] = useState<any>(defaultHero);
  const [marquee, setMarquee] = useState<any>(defaultMarquee);
  const [mission, setMission] = useState<any>(defaultMission);
  const [benefits, setBenefits] = useState<any>(defaultBenefits);
  const [reviews, setReviews] = useState<any>(defaultReviews);
  const [settings, setSettings] = useState<any>(defaultSettings);

  useEffect(() => {
    async function loadCms() {
      try {
        setLoading(true);
        const meRes = await fetch("/api/auth/me");
        const meData = await meRes.json();
        if (!meData.user || meData.user.role !== "ADMIN") {
          router.push("/login");
          return;
        }

        const res = await fetch("/api/cms");
        if (res.ok) {
          const data = await res.json();
          if (data.hero) setHero(data.hero);
          if (data.marquee) setMarquee(data.marquee);
          if (data.mission) setMission(data.mission);
          if (data.benefits) setBenefits(data.benefits);
          if (data.reviews) setReviews(data.reviews);
          if (data.settings) setSettings(data.settings);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadCms();
  }, [router]);

  const saveCurrentSection = async () => {
    try {
      setSaving(true);
      setSavedSuccess(false);

      let payload: any = {};
      if (activeTab === "hero") {
        await Promise.all([
          fetch("/api/cms", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ section: "hero", data: hero }),
          }),
          fetch("/api/cms", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ section: "marquee", data: marquee }),
          }),
        ]);
      } else {
        let dataToSave: any = null;
        if (activeTab === "mission") dataToSave = mission;
        else if (activeTab === "benefits") dataToSave = benefits;
        else if (activeTab === "reviews") dataToSave = reviews;
        else if (activeTab === "settings") dataToSave = settings;

        await fetch("/api/cms", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ section: activeTab, data: dataToSave }),
        });
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[var(--cream-page)]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--forest)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--cream-page)] pb-24 pt-24 sm:pt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 rounded-[2rem] bg-[var(--forest-deep)] p-6 text-white shadow-xl sm:flex-row sm:items-center sm:p-8">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--cream)]/80 hover:text-white mb-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Operations Dashboard
            </Link>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-amber-400/20 px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-amber-300">
                100% EDITABLE
              </span>
              <h1 className="font-display text-3xl sm:text-4xl text-[var(--cream)]">
                WEBSITE CMS &amp; CONTENT EDITOR
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-white/20"
            >
              <Eye className="h-3.5 w-3.5" />
              Preview Live Site
            </Link>
            <button
              onClick={saveCurrentSection}
              disabled={saving}
              className="flex items-center gap-2 rounded-full bg-amber-400 px-5 py-2.5 text-xs font-extrabold text-[var(--forest-deep)] shadow-md transition hover:bg-amber-300 disabled:opacity-50"
            >
              {saving ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : savedSuccess ? (
                <Check className="h-3.5 w-3.5 text-emerald-800" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              {savedSuccess ? "Saved Successfully!" : "Save Section Changes"}
            </button>
          </div>
        </div>

        {/* CMS Tab Nav */}
        <div className="mt-8 flex flex-wrap gap-2 border-b border-[var(--forest)]/10 pb-4">
          {[
            { id: "hero", label: "Hero & Marquee", Icon: Sparkles },
            { id: "mission", label: "Mission & Story", Icon: FileText },
            { id: "benefits", label: "Benefits Cards", Icon: Layers },
            { id: "reviews", label: "Parent Reviews", Icon: MessageSquare },
            { id: "settings", label: "Store & Contact", Icon: Settings },
          ].map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition ${
                activeTab === id
                  ? "bg-[var(--forest)] text-[var(--cream)] shadow-md"
                  : "bg-white text-[var(--forest)] hover:bg-[var(--cloud)]"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Content Edit Panels */}
        <div className="mt-6 rounded-[2rem] bg-white p-6 shadow-[0_20px_50px_rgba(69,31,34,0.08)] sm:p-8">
          {/* TAB 1: HERO & MARQUEE */}
          {activeTab === "hero" && (
            <div className="space-y-6">
              <div className="border-b border-[var(--forest)]/10 pb-4">
                <h2 className="text-xl font-extrabold text-[var(--forest)]">
                  Hero Section &amp; Scrolling Marquee
                </h2>
                <p className="text-xs text-[var(--forest-deep)]/70">
                  Edit the top headline, subheadline, 3 floating stat bubbles, and marquee ticker.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[var(--olive)]">
                    Eyebrow Badge
                  </label>
                  <input
                    type="text"
                    value={hero.eyebrow}
                    onChange={(e) => setHero({ ...hero, eyebrow: e.target.value })}
                    className="w-full rounded-xl border border-[var(--forest)]/20 p-3 text-sm font-medium text-[var(--forest)] outline-none focus:border-[var(--sage-deep)]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[var(--olive)]">
                    Handwritten Sticky Note
                  </label>
                  <textarea
                    rows={2}
                    value={hero.handwrittenNote}
                    onChange={(e) => setHero({ ...hero, handwrittenNote: e.target.value })}
                    className="w-full rounded-xl border border-[var(--forest)]/20 p-3 text-sm font-medium text-[var(--forest)] outline-none focus:border-[var(--sage-deep)] font-mono"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[var(--olive)]">
                    Headline Line 1
                  </label>
                  <input
                    type="text"
                    value={hero.headlineLine1}
                    onChange={(e) => setHero({ ...hero, headlineLine1: e.target.value })}
                    className="w-full rounded-xl border border-[var(--forest)]/20 p-3 text-sm font-bold text-[var(--forest)] outline-none focus:border-[var(--sage-deep)]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[var(--olive)]">
                    Headline Line 2
                  </label>
                  <input
                    type="text"
                    value={hero.headlineLine2}
                    onChange={(e) => setHero({ ...hero, headlineLine2: e.target.value })}
                    className="w-full rounded-xl border border-[var(--forest)]/20 p-3 text-sm font-bold text-[var(--forest)] outline-none focus:border-[var(--sage-deep)]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[var(--olive)]">
                    Sub-Headline Description
                  </label>
                  <textarea
                    rows={3}
                    value={hero.subheadline}
                    onChange={(e) => setHero({ ...hero, subheadline: e.target.value })}
                    className="w-full rounded-xl border border-[var(--forest)]/20 p-3 text-sm font-medium text-[var(--forest)] outline-none focus:border-[var(--sage-deep)]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[var(--olive)]">
                    Call To Action Button Text
                  </label>
                  <input
                    type="text"
                    value={hero.ctaText}
                    onChange={(e) => setHero({ ...hero, ctaText: e.target.value })}
                    className="w-full rounded-xl border border-[var(--forest)]/20 p-3 text-sm font-bold text-[var(--forest)] outline-none focus:border-[var(--sage-deep)]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[var(--olive)]">
                    CTA Link
                  </label>
                  <input
                    type="text"
                    value={hero.ctaLink}
                    onChange={(e) => setHero({ ...hero, ctaLink: e.target.value })}
                    className="w-full rounded-xl border border-[var(--forest)]/20 p-3 text-sm font-medium text-[var(--forest)] outline-none focus:border-[var(--sage-deep)]"
                  />
                </div>
              </div>

              {/* Stat Bubbles */}
              <div className="mt-8 rounded-2xl bg-[var(--cloud)]/40 p-6">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-[var(--forest)]">
                  3 Floating Stat Bubbles (Surrounding Jar)
                </h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl bg-white p-4 shadow-sm">
                    <span className="text-xs font-bold text-[var(--olive)]">Bubble 1</span>
                    <div className="mt-2 flex gap-2">
                      <input
                        type="number"
                        value={hero.stat1Number}
                        onChange={(e) => setHero({ ...hero, stat1Number: Number(e.target.value) })}
                        placeholder="100"
                        className="w-20 rounded-lg border border-gray-200 p-2 text-xs font-bold"
                      />
                      <input
                        type="text"
                        value={hero.stat1Unit}
                        onChange={(e) => setHero({ ...hero, stat1Unit: e.target.value })}
                        placeholder="%"
                        className="w-14 rounded-lg border border-gray-200 p-2 text-xs font-bold"
                      />
                    </div>
                    <input
                      type="text"
                      value={hero.stat1Label}
                      onChange={(e) => setHero({ ...hero, stat1Label: e.target.value })}
                      placeholder="Label"
                      className="mt-2 w-full rounded-lg border border-gray-200 p-2 text-xs"
                    />
                  </div>

                  <div className="rounded-xl bg-white p-4 shadow-sm">
                    <span className="text-xs font-bold text-[var(--olive)]">Bubble 2</span>
                    <div className="mt-2 flex gap-2">
                      <input
                        type="number"
                        value={hero.stat2Number}
                        onChange={(e) => setHero({ ...hero, stat2Number: Number(e.target.value) })}
                        placeholder="0"
                        className="w-20 rounded-lg border border-gray-200 p-2 text-xs font-bold"
                      />
                      <input
                        type="text"
                        value={hero.stat2Unit}
                        onChange={(e) => setHero({ ...hero, stat2Unit: e.target.value })}
                        placeholder="g"
                        className="w-14 rounded-lg border border-gray-200 p-2 text-xs font-bold"
                      />
                    </div>
                    <input
                      type="text"
                      value={hero.stat2Label}
                      onChange={(e) => setHero({ ...hero, stat2Label: e.target.value })}
                      placeholder="Label"
                      className="mt-2 w-full rounded-lg border border-gray-200 p-2 text-xs"
                    />
                  </div>

                  <div className="rounded-xl bg-white p-4 shadow-sm">
                    <span className="text-xs font-bold text-[var(--olive)]">Bubble 3</span>
                    <div className="mt-2 flex gap-2">
                      <input
                        type="number"
                        value={hero.stat3Number}
                        onChange={(e) => setHero({ ...hero, stat3Number: Number(e.target.value) })}
                        placeholder="35"
                        className="w-20 rounded-lg border border-gray-200 p-2 text-xs font-bold"
                      />
                      <input
                        type="text"
                        value={hero.stat3Unit}
                        onChange={(e) => setHero({ ...hero, stat3Unit: e.target.value })}
                        placeholder="+"
                        className="w-14 rounded-lg border border-gray-200 p-2 text-xs font-bold"
                      />
                    </div>
                    <input
                      type="text"
                      value={hero.stat3Label}
                      onChange={(e) => setHero({ ...hero, stat3Label: e.target.value })}
                      placeholder="Label"
                      className="mt-2 w-full rounded-lg border border-gray-200 p-2 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Marquee Phrases */}
              <div className="mt-6">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--olive)]">
                  Marquee Ticker Phrases (Comma-separated)
                </label>
                <input
                  type="text"
                  value={marquee.phrases.join(", ")}
                  onChange={(e) =>
                    setMarquee({
                      phrases: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  className="w-full rounded-xl border border-[var(--forest)]/20 p-3 text-sm font-medium text-[var(--forest)] outline-none focus:border-[var(--sage-deep)]"
                />
              </div>
            </div>
          )}

          {/* TAB 2: MISSION & STORY */}
          {activeTab === "mission" && (
            <div className="space-y-6">
              <div className="border-b border-[var(--forest)]/10 pb-4">
                <h2 className="text-xl font-extrabold text-[var(--forest)]">
                  Mission &amp; Doctor Story ("Why Settle?")
                </h2>
                <p className="text-xs text-[var(--forest-deep)]/70">
                  Update the brand philosophy, doctor credentials, and key bullet points.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[var(--olive)]">
                    Eyebrow Chip
                  </label>
                  <input
                    type="text"
                    value={mission.eyebrow}
                    onChange={(e) => setMission({ ...mission, eyebrow: e.target.value })}
                    className="w-full rounded-xl border border-[var(--forest)]/20 p-3 text-sm font-bold text-[var(--forest)]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[var(--olive)]">
                    Handwritten Kicker Question
                  </label>
                  <input
                    type="text"
                    value={mission.kicker}
                    onChange={(e) => setMission({ ...mission, kicker: e.target.value })}
                    className="w-full rounded-xl border border-[var(--forest)]/20 p-3 text-sm font-medium text-[var(--forest)] font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[var(--olive)]">
                    Main Display Heading
                  </label>
                  <input
                    type="text"
                    value={mission.heading}
                    onChange={(e) => setMission({ ...mission, heading: e.target.value })}
                    className="w-full rounded-xl border border-[var(--forest)]/20 p-3 text-sm font-extrabold text-[var(--forest)]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[var(--olive)]">
                    Mission Narrative Paragraph
                  </label>
                  <textarea
                    rows={4}
                    value={mission.description}
                    onChange={(e) => setMission({ ...mission, description: e.target.value })}
                    className="w-full rounded-xl border border-[var(--forest)]/20 p-3 text-sm font-medium text-[var(--forest)]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--olive)]">
                  Key Trust Bullets (3 items)
                </label>
                <div className="space-y-3">
                  {mission.bullets.map((b: string, index: number) => (
                    <input
                      key={index}
                      type="text"
                      value={b}
                      onChange={(e) => {
                        const next = [...mission.bullets];
                        next[index] = e.target.value;
                        setMission({ ...mission, bullets: next });
                      }}
                      className="w-full rounded-xl border border-[var(--forest)]/20 p-3 text-sm font-medium text-[var(--forest)]"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BENEFITS */}
          {activeTab === "benefits" && (
            <div className="space-y-6">
              <div className="border-b border-[var(--forest)]/10 pb-4">
                <h2 className="text-xl font-extrabold text-[var(--forest)]">
                  Core Benefits Cards (Line-Riding Section)
                </h2>
                <p className="text-xs text-[var(--forest-deep)]/70">
                  Edit the 4 benefit titles, highlighted phrases, and explanations.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {benefits.map((card: any, i: number) => (
                  <div key={card.id || i} className="rounded-2xl bg-[var(--cloud)]/40 p-5 shadow-sm">
                    <span className="text-xs font-bold uppercase tracking-widest text-[var(--olive)]">
                      Benefit Card {i + 1}
                    </span>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <input
                        type="text"
                        value={card.titleLine1}
                        onChange={(e) => {
                          const next = [...benefits];
                          next[i].titleLine1 = e.target.value;
                          setBenefits(next);
                        }}
                        placeholder="MORE"
                        className="rounded-xl border border-gray-200 bg-white p-2.5 text-xs font-bold"
                      />
                      <input
                        type="text"
                        value={card.titleLine2}
                        onChange={(e) => {
                          const next = [...benefits];
                          next[i].titleLine2 = e.target.value;
                          setBenefits(next);
                        }}
                        placeholder="GROWTH"
                        className="rounded-xl border border-gray-200 bg-white p-2.5 text-xs font-bold"
                      />
                    </div>
                    <div className="mt-3">
                      <label className="text-[10px] font-bold uppercase text-[var(--olive)]">
                        Circled Highlight Word
                      </label>
                      <input
                        type="text"
                        value={card.highlightWord}
                        onChange={(e) => {
                          const next = [...benefits];
                          next[i].highlightWord = e.target.value;
                          setBenefits(next);
                        }}
                        className="mt-1 w-full rounded-xl border border-gray-200 bg-white p-2.5 text-xs font-semibold"
                      />
                    </div>
                    <div className="mt-3">
                      <label className="text-[10px] font-bold uppercase text-[var(--olive)]">
                        Caption / Explanation
                      </label>
                      <textarea
                        rows={3}
                        value={card.caption}
                        onChange={(e) => {
                          const next = [...benefits];
                          next[i].caption = e.target.value;
                          setBenefits(next);
                        }}
                        className="mt-1 w-full rounded-xl border border-gray-200 bg-white p-2.5 text-xs font-medium"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: REVIEWS */}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[var(--forest)]/10 pb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-[var(--forest)]">
                    Parent Reviews &amp; Testimonials
                  </h2>
                  <p className="text-xs text-[var(--forest-deep)]/70">
                    Add, edit, or remove parent testimonials displayed on the homepage carousel.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setReviews([
                      ...reviews,
                      {
                        id: String(Date.now()),
                        parentName: "New Parent",
                        childInfo: "Mom / Dad",
                        city: "India",
                        rating: 5,
                        text: "Wonderful organic food for my baby!",
                      },
                    ])
                  }
                  className="flex items-center gap-1.5 rounded-full bg-[var(--forest)] px-4 py-2 text-xs font-bold text-[var(--cream)]"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Review
                </button>
              </div>

              <div className="space-y-4">
                {reviews.map((rev: any, i: number) => (
                  <div
                    key={rev.id || i}
                    className="rounded-2xl border border-[var(--forest)]/15 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="grid flex-1 gap-3 sm:grid-cols-3">
                        <input
                          type="text"
                          value={rev.parentName}
                          onChange={(e) => {
                            const next = [...reviews];
                            next[i].parentName = e.target.value;
                            setReviews(next);
                          }}
                          placeholder="Parent Name"
                          className="rounded-xl border border-gray-200 p-2.5 text-xs font-bold"
                        />
                        <input
                          type="text"
                          value={rev.childInfo}
                          onChange={(e) => {
                            const next = [...reviews];
                            next[i].childInfo = e.target.value;
                            setReviews(next);
                          }}
                          placeholder="Child Info (e.g. Mom to Kabir, 8m)"
                          className="rounded-xl border border-gray-200 p-2.5 text-xs"
                        />
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={rev.city}
                            onChange={(e) => {
                              const next = [...reviews];
                              next[i].city = e.target.value;
                              setReviews(next);
                            }}
                            placeholder="City"
                            className="flex-1 rounded-xl border border-gray-200 p-2.5 text-xs"
                          />
                          <select
                            value={rev.rating}
                            onChange={(e) => {
                              const next = [...reviews];
                              next[i].rating = Number(e.target.value);
                              setReviews(next);
                            }}
                            className="rounded-xl border border-gray-200 p-2.5 text-xs font-bold"
                          >
                            <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
                            <option value={4}>⭐⭐⭐⭐ (4)</option>
                            <option value={3}>⭐⭐⭐ (3)</option>
                          </select>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setReviews(reviews.filter((_: any, idx: number) => idx !== i))}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                        title="Delete Review"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={rev.text}
                      onChange={(e) => {
                        const next = [...reviews];
                        next[i].text = e.target.value;
                        setReviews(next);
                      }}
                      placeholder="Review content..."
                      className="mt-3 w-full rounded-xl border border-gray-200 p-2.5 text-xs font-medium"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="border-b border-[var(--forest)]/10 pb-4">
                <h2 className="text-xl font-extrabold text-[var(--forest)]">
                  Store Contact, Policies &amp; Branding
                </h2>
                <p className="text-xs text-[var(--forest-deep)]/70">
                  Global contact details, shipping rules, and social media handles.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[var(--olive)]">
                    Store Brand Name
                  </label>
                  <input
                    type="text"
                    value={settings.storeName}
                    onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                    className="w-full rounded-xl border border-[var(--forest)]/20 p-3 text-sm font-bold text-[var(--forest)]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[var(--olive)]">
                    Brand Tagline
                  </label>
                  <input
                    type="text"
                    value={settings.tagline}
                    onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                    className="w-full rounded-xl border border-[var(--forest)]/20 p-3 text-sm font-medium text-[var(--forest)]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[var(--olive)]">
                    Support Phone Number
                  </label>
                  <input
                    type="text"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full rounded-xl border border-[var(--forest)]/20 p-3 text-sm font-medium text-[var(--forest)]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[var(--olive)]">
                    Support Email
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full rounded-xl border border-[var(--forest)]/20 p-3 text-sm font-medium text-[var(--forest)]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[var(--olive)]">
                    Office / Kitchen Address
                  </label>
                  <input
                    type="text"
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    className="w-full rounded-xl border border-[var(--forest)]/20 p-3 text-sm font-medium text-[var(--forest)]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[var(--olive)]">
                    Free Shipping Threshold (₹)
                  </label>
                  <input
                    type="number"
                    value={settings.freeShippingThreshold}
                    onChange={(e) =>
                      setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })
                    }
                    className="w-full rounded-xl border border-[var(--forest)]/20 p-3 text-sm font-bold text-[var(--forest)]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[var(--olive)]">
                    Standard Shipping Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={settings.shippingFee}
                    onChange={(e) =>
                      setSettings({ ...settings, shippingFee: Number(e.target.value) })
                    }
                    className="w-full rounded-xl border border-[var(--forest)]/20 p-3 text-sm font-bold text-[var(--forest)]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[var(--olive)]">
                    Instagram Profile URL
                  </label>
                  <input
                    type="text"
                    value={settings.instagramUrl}
                    onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                    className="w-full rounded-xl border border-[var(--forest)]/20 p-3 text-sm font-medium text-[var(--forest)]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[var(--olive)]">
                    FSSAI License / GST Number
                  </label>
                  <input
                    type="text"
                    value={settings.gstNumber}
                    onChange={(e) => setSettings({ ...settings, gstNumber: e.target.value })}
                    className="w-full rounded-xl border border-[var(--forest)]/20 p-3 text-sm font-medium text-[var(--forest)]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
