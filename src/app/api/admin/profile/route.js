import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { isAdminAuthorized } from "../../../../lib/admin";

export async function GET(request) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const profile = await prisma.profile.findFirst();
    return NextResponse.json({ profile });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(request) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { profile } = body;

    // Strip Prisma-managed readonly fields and old invalid keys before upsert
    const { 
      id, createdAt, updatedAt, 
      githubUsername, leetcodeUsername, gfgUsername, 
      ...safeProfile 
    } = profile;

    const updatedProfile = await prisma.profile.upsert({
      where: { email: safeProfile.email || "ankur.personal@gmail.com" },
      update: safeProfile,
      create: safeProfile,
    });

    return NextResponse.json({ profile: updatedProfile });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
