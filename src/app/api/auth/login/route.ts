import { requireDb } from "@/lib/api-guard";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, signSession, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const denied = requireDb();
  if (denied) return denied;

  try {
    const body = await req.json();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const password = String(body?.password ?? "");
    // Which login page submitted the request: "customer" (default) or "admin".
    const portal = body?.portal === "admin" ? "admin" : "customer";

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { email } });
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const isAdmin = user.role === "ADMIN";

    // Keep the two logins strictly separate.
    if (portal === "admin" && !isAdmin) {
      return NextResponse.json(
        { error: "This is a customer account — use the customer login instead.", customerPortal: true },
        { status: 403 },
      );
    }
    if (portal === "customer" && isAdmin) {
      return NextResponse.json(
        { error: "This is an admin account — use the Admin Login page.", adminPortal: true },
        { status: 403 },
      );
    }

    const role = isAdmin ? "ADMIN" : "CUSTOMER";
    const token = await signSession({
      sub: user.id,
      email: user.email,
      name: user.name,
      role,
    });
    await setSessionCookie(token);

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, role },
      redirect: role === "ADMIN" ? "/admin" : "/account",
    });
  } catch (err) {
    console.error("[login]", err);
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
