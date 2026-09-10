import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { getAllCms, getCmsSection } from "@/lib/cms";
import {
  defaultBenefits,
  defaultHero,
  defaultMarquee,
  defaultMission,
  defaultReviews,
  defaultSettings,
} from "@/lib/cms-defaults";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const section = searchParams.get("section");

    if (section) {
      let fallback: any = null;
      if (section === "hero") fallback = defaultHero;
      else if (section === "settings") fallback = defaultSettings;
      else if (section === "mission") fallback = defaultMission;
      else if (section === "benefits") fallback = defaultBenefits;
      else if (section === "reviews") fallback = defaultReviews;
      else if (section === "marquee") fallback = defaultMarquee;

      const data = await getCmsSection(section, fallback);
      return NextResponse.json({ section, data });
    }

    const all = await getAllCms();
    return NextResponse.json(all);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to load CMS" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const { section, data } = body;

    if (!section || !data) {
      return NextResponse.json({ error: "Section and data are required" }, { status: 400 });
    }

    const updated = await db.siteContent.upsert({
      where: { key: section },
      update: {
        data: JSON.stringify(data),
      },
      create: {
        key: section,
        data: JSON.stringify(data),
      },
    });

    return NextResponse.json({ success: true, section, data });
  } catch (error: any) {
    console.error("CMS update error:", error);
    return NextResponse.json({ error: error?.message || "Failed to update CMS" }, { status: 500 });
  }
}
