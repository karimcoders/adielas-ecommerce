import { requireDb } from "@/lib/api-guard";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, signSession, setSessionCookie } from "@/lib/auth";
import { recordAuthEvent } from "@/lib/analytics-server";

export async function POST(req: NextRequest) {
  const denied = requireDb();
  if (denied) return denied;

  try {
    const body = await req.json();
    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const phone = String(body?.phone ?? "").trim() || null;
    const password = String(body?.password ?? "");

    if (name.length < 2) {
      return NextResponse.json({ error: "Please enter your full name." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 },
      );
    }

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists. Try logging in." },
        { status: 409 },
      );
    }

    const user = await db.user.create({
      data: {
        email,
        name,
        phone,
        passwordHash: await hashPassword(password),
        role: "CUSTOMER",
      },
    });

    const token = await signSession({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: "CUSTOMER",
    });
    await setSessionCookie(token);

    // analytics: new-account event with geo (server-side)
    await recordAuthEvent(db, req, {
      event: "register",
      userId: user.id,
      email: user.email,
      name: user.name,
      path: "/register",
    });

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (err) {
    console.error("[register]", err);
    const code = (err as { code?: string })?.code ?? "";
    if (["P1001", "P1012", "P2021", "P1003"].includes(code)) {
      return NextResponse.json(
        {
          error: "The store's database is temporarily unreachable.",
          hint: "Store owner: check your Neon database status (Vercel → Storage) — it may be paused. Opening the Neon console once usually resumes it.",
          dbDown: true,
        },
        { status: 503 },
      );
    }
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
