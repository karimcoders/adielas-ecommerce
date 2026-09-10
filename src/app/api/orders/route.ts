import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

type IncomingItem = { slug: string; qty: number };

const SHIPPING_FEE = 49;
const FREE_SHIPPING_THRESHOLD = 499;

function makeOrderNumber() {
  const t = Date.now().toString(36).toUpperCase().slice(-6);
  const r = Math.floor(Math.random() * 1296)
    .toString(36)
    .toUpperCase()
    .padStart(2, "0");
  return `ADL-${t}${r}`;
}

/** POST /api/orders — create a new order from checkout. */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const session = await getSession();

    const rawItems: IncomingItem[] = Array.isArray(body?.items) ? body.items : [];
    const items = rawItems
      .map((it) => ({ slug: String(it?.slug ?? ""), qty: Math.round(Number(it?.qty ?? 0)) }))
      .filter((it) => it.slug && it.qty > 0 && it.qty <= 20);

    if (items.length === 0) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }

    const customerName = String(body?.customerName ?? "").trim();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const phone = String(body?.phone ?? "").trim();
    const addressLine1 = String(body?.addressLine1 ?? "").trim();
    const addressLine2 = String(body?.addressLine2 ?? "").trim() || null;
    const city = String(body?.city ?? "").trim();
    const state = String(body?.state ?? "").trim();
    const pincode = String(body?.pincode ?? "").trim();
    const paymentMethod = ["UPI", "CARD", "COD"].includes(body?.paymentMethod)
      ? body.paymentMethod
      : "UPI";
    const notes = String(body?.notes ?? "").trim() || null;
    const couponCode = String(body?.couponCode ?? "").trim().toUpperCase() || null;

    if (!customerName || !email || !phone || !addressLine1 || !city || !state || !pincode) {
      return NextResponse.json({ error: "Please fill all required fields." }, { status: 400 });
    }
    if (!/^\d{6}$/.test(pincode)) {
      return NextResponse.json({ error: "PIN code must be 6 digits." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
    }

    // --- Server-side price validation from DB (never trust client prices) ---
    const products = await db.product.findMany({
      where: { slug: { in: items.map((i) => i.slug) }, active: true },
    });

    const lines = [] as {
      productId: string | null;
      slug: string;
      name: string;
      price: number;
      qty: number;
      image: string | null;
    }[];

    for (const it of items) {
      const p = products.find((x) => x.slug === it.slug);
      if (!p) {
        return NextResponse.json(
          { error: `"${it.slug}" is no longer available.` },
          { status: 400 },
        );
      }
      if (p.stock < it.qty) {
        return NextResponse.json(
          { error: `Only ${p.stock} left in stock for ${p.name}.` },
          { status: 400 },
        );
      }
      lines.push({
        productId: p.id,
        slug: p.slug,
        name: p.name,
        price: p.price,
        qty: it.qty,
        image: p.image,
      });
    }

    const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);

    // --- Coupon (validated server-side) ---
    let discount = 0;
    let appliedCoupon: string | null = null;
    if (couponCode) {
      const coupon = await db.coupon.findUnique({ where: { code: couponCode } });
      const valid =
        coupon &&
        coupon.active &&
        (!coupon.expiresAt || coupon.expiresAt > new Date()) &&
        subtotal >= coupon.minOrder;
      if (valid) {
        discount =
          coupon.type === "PERCENT"
            ? Math.min(
                Math.round((subtotal * coupon.value) / 100),
                coupon.maxDiscount ?? Number.MAX_SAFE_INTEGER,
              )
            : Math.min(coupon.value, subtotal);
        appliedCoupon = coupon.code;
      }
    }

    const shipping = subtotal - discount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const total = Math.max(0, subtotal - discount + shipping);

    const order = await db.order.create({
      data: {
        orderNumber: makeOrderNumber(),
        userId: session?.sub ?? null,
        email,
        customerName,
        phone,
        addressLine1,
        addressLine2,
        city,
        state,
        pincode,
        paymentMethod,
        paymentStatus: paymentMethod === "COD" ? "PENDING" : "PAID",
        status: "PLACED",
        subtotal,
        shipping,
        discount,
        total,
        couponCode: appliedCoupon,
        notes,
        items: { create: lines },
      },
      include: { items: true },
    });

    // --- Stock decrement + coupon usage ---
    await Promise.all(
      lines.map((l) =>
        db.product.update({
          where: { id: l.productId! },
          data: { stock: { decrement: l.qty } },
        }),
      ),
    );
    if (appliedCoupon) {
      await db.coupon.update({ where: { code: appliedCoupon }, data: { usedCount: { increment: 1 } } });
    }

    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    console.error("[orders:POST]", err);
    return NextResponse.json({ error: "Could not place the order. Please try again." }, { status: 500 });
  }
}

/** GET /api/orders — admin sees all (with ?status= filter), customers see their own. */
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    if (session.role === "ADMIN") {
      const orders = await db.order.findMany({
        where: status && status !== "ALL" ? { status } : undefined,
        include: { items: true },
        orderBy: { createdAt: "desc" },
        take: 500,
      });
      return NextResponse.json({ orders });
    }

    const orders = await db.order.findMany({
      where: { userId: session.sub },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ orders });
  } catch (err) {
    console.error("[orders:GET]", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
