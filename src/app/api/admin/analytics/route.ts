import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireDb } from "@/lib/api-guard";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const denied = requireDb();
  if (denied) return denied;

  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const range = searchParams.get("range") || "7d"; // "today" | "7d" | "30d" | "all"
  const eventFilter = searchParams.get("event") || null;

  const now = new Date();
  const activeSince = new Date(Date.now() - 15 * 60 * 1000); // last 15 mins for live active

  let since = new Date();
  if (range === "today") {
    since.setHours(0, 0, 0, 0);
  } else if (range === "7d") {
    since.setDate(now.getDate() - 7);
    since.setHours(0, 0, 0, 0);
  } else if (range === "30d") {
    since.setDate(now.getDate() - 30);
    since.setHours(0, 0, 0, 0);
  } else {
    // all time — past 1 year
    since = new Date(0);
  }

  // Live active visitors (last 15m)
  const activeVisitorsRes = await db.analyticsEvent.groupBy({
    by: ["visitorId"],
    where: { createdAt: { gte: activeSince } },
  });
  const activeVisitors = activeVisitorsRes.length;

  // Events matching range and filter
  const whereClause: Record<string, unknown> = {
    createdAt: { gte: since },
  };
  if (eventFilter && eventFilter !== "all") {
    whereClause.event = eventFilter;
  }

  // Fetch events for aggregation (take recent 2000 for high performance)
  const events = await db.analyticsEvent.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    take: 2000,
  });

  // Calculate high-level KPIs
  const uniqueVisitors = new Set(events.map((e) => e.visitorId)).size;
  const pageviews = events.filter((e) => e.event === "page_view").length;
  const addToCart = events.filter((e) => e.event === "add_to_cart").length;
  const ordersPlaced = events.filter((e) => e.event === "order_placed").length;
  const conversionRate = uniqueVisitors > 0 ? ((ordersPlaced / uniqueVisitors) * 100).toFixed(1) : "0.0";

  // Top locations (City + Country)
  const locationMap = new Map<string, { city: string; country: string; count: number }>();
  for (const e of events) {
    const city = e.city || "Unknown City";
    const country = e.country || "Unknown Country";
    const key = `${city}, ${country}`;
    const cur = locationMap.get(key) ?? { city, country, count: 0 };
    cur.count += 1;
    locationMap.set(key, cur);
  }
  const topLocations = [...locationMap.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Top visited pages
  const pageMap = new Map<string, number>();
  for (const e of events.filter((e) => e.event === "page_view")) {
    const cur = pageMap.get(e.path) ?? 0;
    pageMap.set(e.path, cur + 1);
  }
  const topPages = [...pageMap.entries()]
    .map(([path, views]) => ({ path, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  // Event counts breakdown
  const eventCountsMap = new Map<string, number>();
  for (const e of events) {
    const cur = eventCountsMap.get(e.event) ?? 0;
    eventCountsMap.set(e.event, cur + 1);
  }
  const eventCounts = [...eventCountsMap.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // Visitor journeys (group events by visitorId)
  const journeyMap = new Map<
    string,
    {
      visitorId: string;
      customerName: string | null;
      customerEmail: string | null;
      city: string | null;
      country: string | null;
      region: string | null;
      device: string | null;
      browser: string | null;
      os: string | null;
      ip: string | null;
      firstSeen: string;
      lastSeen: string;
      steps: {
        id: string;
        event: string;
        path: string;
        metadata: unknown;
        time: string;
      }[];
    }
  >();

  for (const e of events) {
    const vid = e.visitorId;
    let journey = journeyMap.get(vid);
    if (!journey) {
      journey = {
        visitorId: vid,
        customerName: e.userName || null,
        customerEmail: e.userEmail || null,
        city: e.city || null,
        country: e.country || null,
        region: e.region || null,
        device: e.device || null,
        browser: e.browser || null,
        os: e.os || null,
        ip: e.ip || null,
        firstSeen: e.createdAt.toISOString(),
        lastSeen: e.createdAt.toISOString(),
        steps: [],
      };
      journeyMap.set(vid, journey);
    }

    if (!journey.customerName && e.userName) journey.customerName = e.userName;
    if (!journey.customerEmail && e.userEmail) journey.customerEmail = e.userEmail;
    if (!journey.city && e.city) journey.city = e.city;
    if (!journey.country && e.country) journey.country = e.country;

    let parsedMeta: unknown = null;
    if (e.metadata) {
      try {
        parsedMeta = JSON.parse(e.metadata);
      } catch {
        parsedMeta = e.metadata;
      }
    }

    journey.steps.push({
      id: e.id,
      event: e.event,
      path: e.path,
      metadata: parsedMeta,
      time: e.createdAt.toISOString(),
    });

    if (new Date(e.createdAt) > new Date(journey.lastSeen)) {
      journey.lastSeen = e.createdAt.toISOString();
    }
    if (new Date(e.createdAt) < new Date(journey.firstSeen)) {
      journey.firstSeen = e.createdAt.toISOString();
    }
  }

  // Reverse steps inside each journey so they read chronologically (earliest to latest)
  const visitorJourneys = [...journeyMap.values()]
    .map((j) => ({
      ...j,
      steps: j.steps.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()),
    }))
    .sort((a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime())
    .slice(0, 30);

  // Time series for charts
  const seriesMap = new Map<string, { date: string; views: number; visitors: Set<string> }>();
  for (const e of events) {
    const d = e.createdAt.toISOString().slice(0, 10);
    const cur = seriesMap.get(d) ?? { date: d, views: 0, visitors: new Set<string>() };
    if (e.event === "page_view") cur.views += 1;
    cur.visitors.add(e.visitorId);
    seriesMap.set(d, cur);
  }

  const series = [...seriesMap.entries()]
    .map(([date, val]) => ({
      date,
      views: val.views,
      visitors: val.visitors.size,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Recent 60 raw events for the live ticker
  const recentEvents = events.slice(0, 60).map((e) => {
    let meta: unknown = null;
    if (e.metadata) {
      try {
        meta = JSON.parse(e.metadata);
      } catch {
        meta = e.metadata;
      }
    }
    return {
      id: e.id,
      visitorId: e.visitorId,
      customerName: e.userName,
      customerEmail: e.userEmail,
      event: e.event,
      path: e.path,
      city: e.city,
      country: e.country,
      region: e.region,
      device: e.device,
      browser: e.browser,
      os: e.os,
      ip: e.ip,
      metadata: meta,
      time: e.createdAt.toISOString(),
    };
  });

  return NextResponse.json({
    kpis: {
      activeVisitors,
      uniqueVisitors,
      pageviews,
      addToCart,
      ordersPlaced,
      conversionRate,
      totalEvents: events.length,
    },
    topLocations,
    topPages,
    eventCounts,
    visitorJourneys,
    recentEvents,
    series,
  });
}
