import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { fallbackAchievements } from "../../../data/achievements";
import { fetchCodingStats } from "../../../lib/coding-stats";

export async function GET() {
  try {
    const profile = await prisma.profile.findFirst();
    const statsPromise = fetchCodingStats(profile);
    
    if (!process.env.DATABASE_URL) {
      const liveStats = await statsPromise;
      return NextResponse.json({
        achievements: fallbackAchievements,
        codingStats: liveStats,
        source: "fallback",
      });
    }

    const [achievements, liveStats] = await Promise.all([
      prisma.achievement.findMany({
        orderBy: { displayOrder: "asc" },
      }),
      statsPromise
    ]);

    return NextResponse.json({
      achievements: achievements,
      codingStats: liveStats,
      source: "database",
    });
  } catch (error) {
    console.error("Unable to load achievements:", error);
    const liveStats = await fetchCodingStats().catch(() => []);
    return NextResponse.json({
      achievements: [],
      codingStats: liveStats,
      source: "database",
    });
  }
}
