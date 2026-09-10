import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { dbStatus } from "@/lib/api-guard";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

function parseUserAgent(ua: string | null): {
  device: "Mobile" | "Desktop" | "Tablet";
  browser: string;
  os: string;
} {
  if (!ua) return { device: "Desktop", browser: "Unknown", os: "Unknown" };

  // Device detection
  let device: "Mobile" | "Desktop" | "Tablet" = "Desktop";
  if (/iPad|tablet/i.test(ua)) {
    device = "Tablet";
  } else if (/Mobile|Android|iPhone|iPod/i.test(ua)) {
    device = "Mobile";
  }

  // OS detection
  let os = "Other";
  if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/Windows NT/i.test(ua)) os = "Windows";
  else if (/Macintosh|Mac OS X/i.test(ua)) os = "macOS";
  else if (/Linux/i.test(ua)) os = "Linux";

  // Browser detection
  let browser = "Other";
  if (/Edg\//i.test(ua)) browser = "Edge";
  else if (/Chrome\//i.test(ua) && !/Edg\//i.test(ua)) browser = "Chrome";
  else if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) browser = "Safari";
  else if (/Firefox\//i.test(ua)) browser = "Firefox";
  else if (/OPR\//i.test(ua) || /Opera/i.test(ua)) browser = "Opera";

  return { device, browser, os };
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { visitorId, sessionId, event, path, referrer, metadata } = body;

    if (!event || !visitorId) {
      return NextResponse.json({ ok: false, error: "Missing event or visitorId" }, { status: 400 });
    }

    // Geolocation from Vercel Edge headers
    const rawCity = req.headers.get("x-vercel-ip-city");
    let city: string | null = null;
    if (rawCity) {
      try {
        city = decodeURIComponent(rawCity);
      } catch {
        city = rawCity;
      }
    }

    const region = req.headers.get("x-vercel-ip-country-region") || null;
    const country = req.headers.get("x-vercel-ip-country") || null;

    // IP address
    const xForwardedFor = req.headers.get("x-forwarded-for");
    const ip = xForwardedFor ? xForwardedFor.split(",")[0].trim() : req.headers.get("x-real-ip") || null;

    // Fallback for local development
    const finalCity = city || (ip === "::1" || ip === "127.0.0.1" ? "Local Development" : null);
    const finalCountry = country || (ip === "::1" || ip === "127.0.0.1" ? "Local" : null);

    // Parse device, browser, OS
    const ua = req.headers.get("user-agent");
    const { device, browser, os } = parseUserAgent(ua);

    // Identify customer from active session or payload
    let userId: string | null = null;
    let userEmail: string | null = body.userEmail || null;
    let userName: string | null = body.userName || null;

    const session = await getSession().catch(() => null);
    if (session) {
      userId = session.sub;
      userEmail = session.email;
      userName = session.name || userName;
    }

    // Only record if database is reachable
    if (dbStatus().ok) {
      await db.analyticsEvent.create({
        data: {
          visitorId: String(visitorId),
          sessionId: sessionId ? String(sessionId) : null,
          userId,
          userEmail,
          userName,
          event: String(event),
          path: String(path || "/"),
          referrer: referrer ? String(referrer).slice(0, 500) : null,
          ip: ip ? ip.slice(0, 64) : null,
          city: finalCity ? finalCity.slice(0, 100) : null,
          region: region ? region.slice(0, 100) : null,
          country: finalCountry ? finalCountry.slice(0, 100) : null,
          device,
          browser,
          os,
          metadata: metadata ? JSON.stringify(metadata).slice(0, 2000) : null,
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[Track API Error]", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
