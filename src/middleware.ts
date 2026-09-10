import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "adielas_session";

function secret(): Uint8Array {
  const raw =
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "adielas-dev-secret-change-me-in-production";
  return new TextEncoder().encode(raw);
}

type Payload = { sub?: string; role?: string };

async function readSession(req: NextRequest): Promise<Payload | null> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload as Payload;
  } catch {
    return null;
  }
}

/**
 * API routes that work fine without a database connection.
 * Everything else under /api returns a clear 503 until the
 * owner connects a Postgres database and redeploys.
 */
function dbOptional(pathname: string, method: string): boolean {
  if (pathname === "/api/health") return true;
  if (pathname === "/api/auth/logout") return true;
  if (pathname === "/api/cms" && method === "GET") return true; // falls back to built-in defaults
  return false;
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const session = await readSession(req);

  // --- API guard: clean 503 instead of ugly 500s before the DB is connected ---
  if (pathname.startsWith("/api/") && !dbOptional(pathname, req.method) && !process.env.DATABASE_URL) {
    return NextResponse.json(
      {
        error: "Database is not connected yet.",
        hint: "Store owner: connect a Postgres database (Vercel → Storage → Neon), then redeploy. Admin CMS, orders and accounts activate automatically.",
      },
      { status: 503 },
    );
  }

  // --- Admin area ---
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      // already logged in as admin → straight to dashboard
      if (session?.role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      return NextResponse.next();
    }
    if (!session || session.role !== "ADMIN") {
      const url = new URL("/admin/login", req.url);
      url.searchParams.set("next", pathname + search);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // --- Customer account area ---
  if (pathname.startsWith("/account")) {
    if (!session) {
      const url = new URL("/login", req.url);
      url.searchParams.set("next", pathname + search);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // --- Auth pages: logged-in users skip ---
  if (pathname === "/login" || pathname === "/register") {
    if (session) {
      return NextResponse.redirect(new URL("/account", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/login", "/register", "/api/:path*"],
};
