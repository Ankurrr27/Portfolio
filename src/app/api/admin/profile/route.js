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
    const { profile: p } = body;

    if (!p || typeof p !== "object") {
      return NextResponse.json({ error: "Profile payload is required" }, { status: 400 });
    }

    const fallbackEmail = "ankur.personal@gmail.com";
    const email = p.email || fallbackEmail;

    // Explicitly map fields to prevent "Unknown argument" errors
    const safeData = {
      fullName: p.fullName,
      headline: p.headline,
      bio: p.bio,
      longBio: p.longBio,
      email,
      resumeUrl: p.resumeUrl,
      profileImageUrl: p.profileImageUrl,
      aboutImageUrl: p.aboutImageUrl,
      location: p.location,
      githubUrl: p.githubUrl,
      linkedinUrl: p.linkedinUrl,
      leetcodeUrl: p.leetcodeUrl,
      geeksforgeeksUrl: p.geeksforgeeksUrl,
      codechefUrl: p.codechefUrl,
      lanyardColor: p.lanyardColor,
      lanyardImageUrl: p.lanyardImageUrl,
      showLanyard: p.showLanyard === true,
      college: p.college,
      qualification: p.qualification,
      maxProjects: Number.parseInt(p.maxProjects, 10) || 6,
      maxAchievements: Number.parseInt(p.maxAchievements, 10) || 6,
      maxGalleryPhotos: Number.parseInt(p.maxGalleryPhotos, 10) || 12,
      cgpa: p.cgpa,
      leetcodeSolved: p.leetcodeSolved,
      gfgSolved: p.gfgSolved,
      // socialLinks is in the schema (Json?) but requires `npx prisma generate`
      // (stop dev server first) before the client recognises it.
      // Uncomment the line below after regenerating:
      // socialLinks: p.socialLinks || [],
    };

    const writeProfile = (data) => {
      if (p.id) {
        return prisma.profile.update({
          where: { id: p.id },
          data,
        });
      }

      return prisma.profile.upsert({
        where: { email },
        update: data,
        create: data,
      });
    };

    try {
      const updatedProfile = await writeProfile(safeData);
      return NextResponse.json({ profile: updatedProfile });
    } catch (upsertError) {
      console.warn("Primary profile write failed, retrying without newly added fields...", upsertError);
      const { showLanyard, college, qualification, ...retryData } = safeData;
      const updatedProfile = await writeProfile(retryData);
      return NextResponse.json({ profile: updatedProfile });
    }
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
