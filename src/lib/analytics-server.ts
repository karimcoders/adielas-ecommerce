import type { NextRequest } from "next/server";
import type { PrismaClient } from "@prisma/client";

/**
 * Server-side analytics recorder for the AnalyticsEvent model.
 * Used by auth routes (login/register) — client tracker can't see these.
 * Best-effort: NEVER throws, never blocks the caller.
 */

function parseUA(ua: string | null): { device: string; browser: string; os: string } {
  const s = ua ?? "";
  const device = /iPad|tablet/i.test(s)
    ? "Tablet"
    : /Mobile|Android|iPhone|iPod/i.test(s)
      ? "Mobile"
      : "Desktop";
  let browser = "Other";
  if (/Edg\//i.test(s)) browser = "Edge";
  else if (/SamsungBrowser/i.test(s)) browser = "Samsung Internet";
  else if (/OPR\/|Opera/i.test(s)) browser = "Opera";
  else if (/Firefox\//i.test(s)) browser = "Firefox";
  else if (/Chrome\//i.test(s)) browser = "Chrome";
  else if (/Safari\//i.test(s)) browser = "Safari";
  let os = "Other";
  if (/iPhone|iPad|iPod/i.test(s)) os = "iOS";
  else if (/Android/i.test(s)) os = "Android";
  else if (/Windows NT/i.test(s)) os = "Windows";
  else if (/Macintosh|Mac OS X/i.test(s)) os = "macOS";
  else if (/Linux/i.test(s)) os = "Linux";
  return { device, browser, os };
}

export async function recordAuthEvent(
  db: PrismaClient,
  req: NextRequest,
  input: {
    event: "login" | "register";
    userId: string;
    email: string;
    name: string;
    path: string;
    meta?: Record<string, unknown>;
  },
): Promise<void> {
  try {
    const h = req.headers;
    const fwd = h.get("x-forwarded-for") ?? "";
    const ua = parseUA(h.get("user-agent"));
    await db.analyticsEvent.create({
      data: {
        visitorId: `user-${input.userId}`,
        sessionId: req.cookies.get("adielas_sid")?.value ?? null,
        userId: input.userId,
        userEmail: input.email,
        userName: input.name,
        event: input.event,
        path: input.path,
        referrer: null,
        ip: (fwd.split(",")[0]?.trim() || h.get("x-real-ip") || null)?.slice(0, 64) ?? null,
        city: h.get("x-vercel-ip-city")
          ? decodeURIComponent(h.get("x-vercel-ip-city")!).slice(0, 120)
          : null,
        region: h.get("x-vercel-ip-country-region"),
        country: h.get("x-vercel-ip-country"),
        device: ua.device,
        browser: ua.browser,
        os: ua.os,
        metadata: input.meta ? JSON.stringify(input.meta).slice(0, 2000) : null,
      },
    });
  } catch {
    /* analytics must never break logins or registrations */
  }
}
