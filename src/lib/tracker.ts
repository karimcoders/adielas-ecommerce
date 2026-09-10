"use client";

const VISITOR_KEY = "adielas_vid";
const SESSION_KEY = "adielas_sid";
const USER_KEY = "adielas_t_user";

function generateUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "v-" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

export function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  try {
    let vid = localStorage.getItem(VISITOR_KEY);
    if (!vid) {
      vid = generateUUID();
      localStorage.setItem(VISITOR_KEY, vid);
    }
    return vid;
  } catch {
    return "guest-anon";
  }
}

export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let sid = sessionStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = generateUUID();
      sessionStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
  } catch {
    return "session-anon";
  }
}

export function setTrackingUser(user: { email?: string; name?: string } | null) {
  if (typeof window === "undefined") return;
  try {
    if (!user) {
      localStorage.removeItem(USER_KEY);
    } else {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  } catch {
    // Storage full/disabled
  }
}

export function getTrackingUser(): { email?: string; name?: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function trackEvent(
  event: string,
  metadata?: Record<string, unknown>,
  pathOverride?: string
) {
  if (typeof window === "undefined") return;

  try {
    const visitorId = getVisitorId();
    const sessionId = getSessionId();
    const currentPath = pathOverride || window.location.pathname;

    // Never track admin internal actions as customer visits
    if (currentPath.startsWith("/admin")) return;

    const user = getTrackingUser();

    const payload = {
      visitorId,
      sessionId,
      event,
      path: currentPath,
      referrer: document.referrer || null,
      userEmail: user?.email || undefined,
      userName: user?.name || undefined,
      metadata: metadata || undefined,
      timestamp: Date.now(),
    };

    const data = JSON.stringify(payload);

    if (typeof fetch === "function") {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: data,
        keepalive: true,
      }).catch(() => {
        // Silently ignore network failures for tracking
      });
    } else if (navigator.sendBeacon) {
      const blob = new Blob([data], { type: "application/json" });
      navigator.sendBeacon("/api/track", blob);
    }
  } catch {
    // Tracking is non-blocking and safe
  }
}
