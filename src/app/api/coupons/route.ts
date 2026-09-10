import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

/** GET /api/coupons — admin list. */
export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const coupons = await db.coupon.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ coupons });
}

/** POST /api/coupons — admin create. */
export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const b = await req.json();
    const code = String(b?.code ?? "").trim().toUpperCase();
    const type = b?.type === "FLAT" ? "FLAT" : "PERCENT";
    const value = Math.round(Number(b?.value ?? 0));

    if (!code) return NextResponse.json({ error: "Code is required." }, { status: 400 });
    if (value <= 0) return NextResponse.json({ error: "Value must be positive." }, { status: 400 });
    if (type === "PERCENT" && value > 100) {
      return NextResponse.json({ error: "Percent cannot exceed 100." }, { status: 400 });
    }

    const exists = await db.coupon.findUnique({ where: { code } });
    if (exists) return NextResponse.json({ error: "This code already exists." }, { status: 409 });

    const coupon = await db.coupon.create({
      data: {
        code,
        type,
        value,
        minOrder: Math.max(0, Math.round(Number(b?.minOrder ?? 0))),
        maxDiscount: b?.maxDiscount ? Math.round(Number(b.maxDiscount)) : null,
        expiresAt: b?.expiresAt ? new Date(b.expiresAt) : null,
        active: b?.active === false ? false : true,
      },
    });
    return NextResponse.json({ coupon }, { status: 201 });
  } catch (err) {
    console.error("[coupons:POST]", err);
    return NextResponse.json({ error: "Could not create coupon." }, { status: 500 });
  }
}
