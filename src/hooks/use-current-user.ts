"use client";

import { useEffect, useState } from "react";

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "ADMIN" | "CUSTOMER";
};

let cachedUser: CurrentUser | null | undefined = undefined;
let pendingPromise: Promise<CurrentUser | null> | null = null;
const listeners = new Set<(u: CurrentUser | null) => void>();

export function clearUserCache() {
  cachedUser = undefined;
  pendingPromise = null;
  listeners.forEach((l) => l(null));
}

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(cachedUser ?? null);
  const [loading, setLoading] = useState(cachedUser === undefined);

  useEffect(() => {
    let cancelled = false;

    const handleUpdate = (u: CurrentUser | null) => {
      if (!cancelled) {
        setUser(u);
        setLoading(false);
      }
    };

    listeners.add(handleUpdate);

    if (cachedUser === undefined) {
      if (!pendingPromise) {
        pendingPromise = fetch("/api/auth/me")
          .then((r) => (r.ok ? r.json() : null))
          .then((d) => {
            cachedUser = d?.user ?? null;
            listeners.forEach((l) => l(cachedUser!));
            return cachedUser;
          })
          .catch(() => {
            cachedUser = null;
            listeners.forEach((l) => l(null));
            return null;
          })
          .finally(() => {
            pendingPromise = null;
          });
      }
    } else {
      setUser(cachedUser);
      setLoading(false);
    }

    return () => {
      cancelled = true;
      listeners.delete(handleUpdate);
    };
  }, []);

  return {
    user,
    isAdmin: user?.role === "ADMIN",
    loading,
  };
}
