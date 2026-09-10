import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { getAllCms, getCmsSection } from "@/lib/cms";
import {
  cmsSections,
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

const FALLBACKS: Record<string, unknown> = {
  settings: defaultSettings,
  hero: defaultHero,
  marquee: defaultMarquee,
  mission: defaultMission,
  benefits: defaultBenefits,
  flavors: defaultFlavors,
  comparison: defaultComparison,
  reviews: defaultReviews,
  shop: defaultShop,
  footer: defaultFooter,
};

/** Public read — anyone (including the storefront itself) can read content. */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const section = searchParams.get("section");

    if (section) {
      const fallback = FALLBACKS[section] ?? null;
      const data = await getCmsSection(section, fallback);
      return NextResponse.json({ section, data });
    }

    const all = await getAllCms();
    return NextResponse.json(all);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load CMS";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** Admin-only write — upserts one section as a JSON blob. */
export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const { section, data } = body as { section?: string; data?: unknown };

    if (!section || data === undefined || data === null) {
      return NextResponse.json({ error: "Section and data are required" }, { status: 400 });
    }

    if (!(cmsSections as readonly string[]).includes(section)) {
      return NextResponse.json({ error: `Unknown section: ${section}` }, { status: 400 });
    }

    await db.siteContent.upsert({
      where: { key: section },
      update: { data: JSON.stringify(data) },
      create: { key: section, data: JSON.stringify(data) },
    });

    return NextResponse.json({ success: true, section });
  } catch (error: unknown) {
    console.error("CMS update error:", error);
    const message = error instanceof Error ? error.message : "Failed to update CMS";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** Admin-only reset — delete a section override so defaults kick back in. */
export async function DELETE(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const section = searchParams.get("section");
    if (!section) {
      return NextResponse.json({ error: "Section is required" }, { status: 400 });
    }

    await db.siteContent.deleteMany({ where: { key: section } });
    return NextResponse.json({ success: true, section });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to reset CMS";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
