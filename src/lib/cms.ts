import { db } from "./db";
import {
  defaultBenefits,
  defaultHero,
  defaultMarquee,
  defaultMission,
  defaultReviews,
  defaultSettings,
} from "./cms-defaults";

export async function getCmsSection<T>(key: string, fallback: T): Promise<T> {
  try {
    const entry = await db.siteContent.findUnique({
      where: { key },
    });
    if (!entry || !entry.data) return fallback;
    return JSON.parse(entry.data) as T;
  } catch {
    return fallback;
  }
}

export async function getAllCms() {
  const [settings, hero, marquee, mission, benefits, reviews] = await Promise.all([
    getCmsSection("settings", defaultSettings),
    getCmsSection("hero", defaultHero),
    getCmsSection("marquee", defaultMarquee),
    getCmsSection("mission", defaultMission),
    getCmsSection("benefits", defaultBenefits),
    getCmsSection("reviews", defaultReviews),
  ]);

  return { settings, hero, marquee, mission, benefits, reviews };
}
