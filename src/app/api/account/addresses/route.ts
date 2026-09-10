import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

/** GET /api/account/addresses — current user's saved addresses. */
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const addresses = await db.address.findMany({
    where: { userId: session.sub },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
  return NextResponse.json({ addresses });
}

/** POST /api/account/addresses — add an address. */
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const b = await req.json();
    const fullName = String(b?.fullName ?? "").trim();
    const phone = String(b?.phone ?? "").trim();
    const line1 = String(b?.line1 ?? "").trim();
    const city = String(b?.city ?? "").trim();
    const state = String(b?.state ?? "").trim();
    const pincode = String(b?.pincode ?? "").trim();

    if (!fullName || !phone || !line1 || !city || !state) {
      return NextResponse.json({ error: "Please fill all required fields." }, { status: 400 });
    }
    if (!/^\d{6}$/.test(pincode)) {
      return NextResponse.json({ error: "PIN code must be 6 digits." }, { status: 400 });
    }

    const count = await db.address.count({ where: { userId: session.sub } });
    const isDefault = b?.isDefault === true || count === 0;

    if (isDefault) {
      await db.address.updateMany({ where: { userId: session.sub }, data: { isDefault: false } });
    }

    const address = await db.address.create({
      data: {
        userId: session.sub,
        label: String(b?.label ?? "Home"),
        fullName,
        phone,
        line1,
        line2: String(b?.line2 ?? "").trim() || null,
        city,
        state,
        pincode,
        isDefault,
      },
    });
    return NextResponse.json({ address }, { status: 201 });
  } catch (err) {
    console.error("[addresses:POST]", err);
    return NextResponse.json({ error: "Could not save address." }, { status: 500 });
  }
}
