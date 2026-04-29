import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { isAdminAuthorized } from "../../../../lib/admin";

function normalizeAchievements(items = []) {
  return items.map((item, index) => ({
    title: item.title || "",
    issuer: item.issuer || null,
    description: item.description || null,
    achievementUrl: item.achievementUrl || null,
    badgeImageUrl: item.badgeImageUrl || null,
    category: item.category || null,
    dateLabel: item.dateLabel || null,
    featured: item.featured ?? true,
    displayOrder: index,
  }));
}

async function readAchievements() {
  return prisma.achievement.findMany({ orderBy: { displayOrder: "asc" } });
}

export async function GET(request) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "DATABASE_URL is not configured." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    achievements: await readAchievements(),
  });
}

export async function PUT(request) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "DATABASE_URL is not configured." },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const achievements = normalizeAchievements(body.achievements);

    await prisma.$transaction(async (tx) => {
      await tx.achievement.deleteMany();

      for (const item of achievements) {
        await tx.achievement.create({ data: item });
      }
    });

    return NextResponse.json({
      ok: true,
      achievements: await readAchievements(),
    });
  } catch (error) {
    console.error("Unable to save admin content:", error);
    return NextResponse.json(
      { error: "Unable to save admin content." },
      { status: 500 }
    );
  }
}
