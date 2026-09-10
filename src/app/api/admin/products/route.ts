import { requireDb } from "@/lib/api-guard";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** POST /api/admin/products — create product. */
export async function POST(req: NextRequest) {
  const denied = requireDb();
  if (denied) return denied;

  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const b = await req.json();
    const name = String(b?.name ?? "").trim();
    if (!name) return NextResponse.json({ error: "Name is required." }, { status: 400 });

    const slug = String(b?.slug ?? "").trim() || slugify(name);
    const exists = await db.product.findUnique({ where: { slug } });
    if (exists) return NextResponse.json({ error: "Slug already in use." }, { status: 409 });

    const product = await db.product.create({
      data: {
        slug,
        name,
        nameLine1: String(b?.nameLine1 ?? name.split(" ")[0] ?? "ADIELAS"),
        nameLine2: String(b?.nameLine2 ?? name),
        stageLabel: String(b?.stageLabel ?? "NEW"),
        ageLabel: String(b?.ageLabel ?? "All ages"),
        price: Math.max(1, Math.round(Number(b?.price ?? 0))),
        mrp: b?.mrp ? Math.round(Number(b.mrp)) : null,
        weight: String(b?.weight ?? "400 g"),
        tagline: String(b?.tagline ?? ""),
        description: JSON.stringify(
          Array.isArray(b?.description) ? b.description : [String(b?.description ?? "")].filter(Boolean),
        ),
        highlights: JSON.stringify(Array.isArray(b?.highlights) ? b.highlights : []),
        ingredients: String(b?.ingredients ?? ""),
        nutrition: JSON.stringify(Array.isArray(b?.nutrition) ? b.nutrition : []),
        howTo: String(b?.howTo ?? ""),
        image: String(b?.image ?? "/images/adielas/jar-trio.png"),
        cut: b?.cut ? String(b.cut) : null,
        accent: String(b?.accent ?? "#5C2B2E"),
        wash: b?.wash ? String(b.wash) : null,
        rating: Math.min(5, Math.max(0, Number(b?.rating ?? 4.8))),
        reviews: Math.max(0, Math.round(Number(b?.reviews ?? 0))),
        stock: Math.max(0, Math.round(Number(b?.stock ?? 100))),
        active: b?.active === false ? false : true,
        sortOrder: Math.round(Number(b?.sortOrder ?? 0)),
      },
    });
    return NextResponse.json({ product }, { status: 201 });
  } catch (err) {
    console.error("[admin/products:POST]", err);
    return NextResponse.json({ error: "Could not create product." }, { status: 500 });
  }
}

/** GET /api/admin/products — full list incl. inactive. */
export async function GET() {
  const denied = requireDb();
  if (denied) return denied;

  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const products = await db.product.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
  return NextResponse.json({ products });
}
