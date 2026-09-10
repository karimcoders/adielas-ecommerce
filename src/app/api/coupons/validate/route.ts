import { requireDb } from "@/lib/api-guard";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/** POST /api/coupons/validate — public: check a coupon against a subtotal. */
export async function POST(req: NextRequest) {
  const denied = requireDb();
  if (denied) return denied;

  try {
    const { code, subtotal } = await req.json();
    const clean = String(code ?? "").trim().toUpperCase();
    const sub = Math.max(0, Math.round(Number(subtotal ?? 0)));

    if (!clean) return NextResponse.json({ error: "Enter a coupon code." }, { status: 400 });

    const coupon = await db.coupon.findUnique({ where: { code: clean } });
    if (!coupon || !coupon.active) {
      return NextResponse.json({ error: "This code is invalid." }, { status: 404 });
    }
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return NextResponse.json({ error: "This code has expired." }, { status: 410 });
    }
    if (sub < coupon.minOrder) {
      return NextResponse.json(
        { error: `Minimum order of ₹${coupon.minOrder} required for this code.` },
        { status: 400 },
      );
    }

    const discount =
      coupon.type === "PERCENT"
        ? Math.min(Math.round((sub * coupon.value) / 100), coupon.maxDiscount ?? Number.MAX_SAFE_INTEGER)
        : Math.min(coupon.value, sub);

    return NextResponse.json({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      discount,
    });
  } catch {
    return NextResponse.json({ error: "Could not validate coupon." }, { status: 500 });
  }
}
