import { NextResponse } from "next/server";
import { isAdminAuthorized } from "../../../../lib/admin";
import { prisma } from "../../../../lib/prisma";

const defaultStats = {
  autoFetch: false,
  showGithubStats: true,
  showLeetcodeStats: true,
  showGfgStats: true,
  showCodeforcesStats: true,
  githubContributions: "1200+",
  githubRepos: "35+",
  githubStars: "150+",
  leetcodeSolved: "450+",
  leetcodeRating: "1650+",
  leetcodeRanking: "Top 5%",
  gfgScore: "1200+",
  gfgRank: "1",
  gfgPercentile: "Top 1%",
  cfRating: "1450+",
  cfRank: "Specialist",
  cfSolved: "300+",
  naGithubVal: 92,
  naGithubTrend: "+12%",
  naGithubLabel: "Open Source Velocity",
  naLeetcodeVal: 88,
  naLeetcodeTrend: "+5%",
  naLeetcodeLabel: "Algorithmic Precision",
  naGfgVal: 75,
  naGfgTrend: "+8%",
  naGfgLabel: "Consistency Index",
  naCfVal: 65,
  naCfTrend: "+2%",
  naCfLabel: "Competitive Standing",
  globalScore: "8.9"
};

const textStatKeys = [
  "githubContributions",
  "githubRepos",
  "githubStars",
  "leetcodeSolved",
  "leetcodeRating",
  "leetcodeRanking",
  "gfgScore",
  "gfgRank",
  "gfgPercentile",
  "cfRating",
  "cfRank",
  "cfSolved",
  "naGithubTrend",
  "naGithubLabel",
  "naLeetcodeTrend",
  "naLeetcodeLabel",
  "naGfgTrend",
  "naGfgLabel",
  "naCfTrend",
  "naCfLabel",
  "globalScore"
];

const numberStatKeys = ["naGithubVal", "naLeetcodeVal", "naGfgVal", "naCfVal"];

const toText = (value, fallback = "") => {
  if (value == null) return fallback;
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return fallback;
};

const normalizeStats = (incoming = {}) => {
  const next = { ...defaultStats, ...incoming };

  textStatKeys.forEach((key) => {
    next[key] = toText(next[key], defaultStats[key]);
  });

  numberStatKeys.forEach((key) => {
    const value = Number(next[key]);
    next[key] = Number.isFinite(value) ? value : defaultStats[key];
  });

  next.autoFetch = Boolean(next.autoFetch);
  next.showGithubStats = typeof next.showGithubStats === "boolean" ? next.showGithubStats : true;
  next.showLeetcodeStats = typeof next.showLeetcodeStats === "boolean" ? next.showLeetcodeStats : true;
  next.showGfgStats = typeof next.showGfgStats === "boolean" ? next.showGfgStats : true;
  next.showCodeforcesStats = typeof next.showCodeforcesStats === "boolean" ? next.showCodeforcesStats : true;

  return next;
};

export async function GET(req) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let stats = await prisma.codingStats.findFirst();
    if (!stats) {
      stats = await prisma.codingStats.create({
        data: {} // Uses defaults from schema
      });
    }
    return NextResponse.json({ stats });
  } catch (error) {
    console.error("Admin Stats GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}

export async function POST(req) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const { id, updatedAt, ...updateData } = data;
    const normalizedData = normalizeStats(updateData);

    let stats = await prisma.codingStats.findFirst();
    if (stats) {
      stats = await prisma.codingStats.update({
        where: { id: stats.id },
        data: normalizedData
      });
    } else {
      stats = await prisma.codingStats.create({
        data: normalizedData
      });
    }
    return NextResponse.json({ stats });
  } catch (error) {
    console.error("Admin Stats POST Error:", error);
    return NextResponse.json({ error: "Failed to update stats" }, { status: 500 });
  }
}
