import { db } from "./db";
import {
  defaultBenefits,
  defaultComparison,
  defaultFlavors,
  defaultFooter,
  defaultHero,
  defaultMarquee,
  defaultMission,
  defaultReviews,
  defaultSettings,
  defaultShop,
} from "./cms-defaults";

/**
 * Fetch one CMS section from the DB. Falls back to the designed default
 * when the key is missing (or the DB is unreachable, e.g. during build).
 */
export async function getCmsSection<T>(key: string, fallback: T): Promise<T> {
  try {
    const entry = await db.siteContent.findUnique({
      where: { key },
    });
    if (!entry || !entry.data) return fallback;
    const parsed = JSON.parse(entry.data);
    // Merge with defaults so newly-added fields keep sane values.
    if (Array.isArray(fallback)) return parsed as T;
    if (Array.isArray(parsed)) return fallback;
    return { ...(fallback as object), ...(parsed as object) } as T;
  } catch {
    return fallback;
  }
}

export async function getAllCms() {
  const [settings, hero, marquee, mission, benefits, flavors, comparison, reviews, shop, footer] =
    await Promise.all([
      getCmsSection("settings", defaultSettings),
      getCmsSection("hero", defaultHero),
      getCmsSection("marquee", defaultMarquee),
      getCmsSection("mission", defaultMission),
      getCmsSection("benefits", defaultBenefits),
      getCmsSection("flavors", defaultFlavors),
      getCmsSection("comparison", defaultComparison),
      getCmsSection("reviews", defaultReviews),
      getCmsSection("shop", defaultShop),
      getCmsSection("footer", defaultFooter),
    ]);

  return {
    settings,
    hero,
    marquee,
    mission,
    benefits,
    flavors,
    comparison,
    reviews,
    shop,
    footer,
  };
}

export type AllCms = Awaited<ReturnType<typeof getAllCms>>;
