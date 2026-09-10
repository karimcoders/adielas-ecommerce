import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession, hashPassword, verifyPassword } from "@/lib/auth";

/** PATCH /api/account/profile — update name/phone, optionally change password. */
export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const b = await req.json();
    const data: { name?: string; phone?: string | null; passwordHash?: string } = {};

    if (b?.name !== undefined) {
      const name = String(b.name).trim();
      if (name.length < 2) return NextResponse.json({ error: "Name is too short." }, { status: 400 });
      data.name = name;
    }
    if (b?.phone !== undefined) data.phone = String(b.phone).trim() || null;

    if (b?.newPassword) {
      if (String(b.newPassword).length < 6) {
        return NextResponse.json({ error: "New password must be at least 6 characters." }, { status: 400 });
      }
      const user = await db.user.findUnique({ where: { id: session.sub } });
      if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });

      const ok = await verifyPassword(String(b.currentPassword ?? ""), user.passwordHash);
      if (!ok) return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });

      data.passwordHash = await hashPassword(String(b.newPassword));
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
    }

    const user = await db.user.update({
      where: { id: session.sub },
      data,
      select: { id: true, email: true, name: true, phone: true, role: true },
    });
    return NextResponse.json({ user });
  } catch (err) {
    console.error("[profile:PATCH]", err);
    return NextResponse.json({ error: "Could not update profile." }, { status: 500 });
  }
}
