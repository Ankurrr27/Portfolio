import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { isAdminAuthorized } from "../../../../lib/admin";
import {
  fallbackProjects,
  fetchGitHubProjects,
  GITHUB_USERNAME,
  pickProjects,
  PROJECT_LIMIT,
} from "../../../../lib/github-projects";

export async function GET(request) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const fetchDatabaseProjects = async () => {
      if (!process.env.DATABASE_URL) return [];
      try {
        return await prisma.project.findMany({
          orderBy: [
            { featured: "desc" },
            { displayOrder: "asc" },
            { updatedAt: "desc" }
          ],
        });
      } catch (dbError) {
        console.warn("DB error in admin projects:", dbError.message);
        return [];
      }
    };

    const [databaseProjects, githubProjects] = await Promise.all([
      fetchDatabaseProjects(),
      fetchGitHubProjects(), // returns [] on failure, never throws
    ]);

    const selectedSlugs = databaseProjects.filter(p => p.featured).map((p) => p.slug);
    const dbMap = Object.fromEntries(databaseProjects.map((p) => [p.slug, p]));

    // Merge DB image data into GitHub project list
    const mergedGithub = githubProjects.map((gp) => ({
      ...gp,
      imageUrl: dbMap[gp.slug]?.imageUrl || null,
      galleryUrls: dbMap[gp.slug]?.galleryUrls || [],
      socialLinks: dbMap[gp.slug]?.socialLinks || [],
    }));

    // If GitHub is rate-limited/down, surface DB projects so admin can still manage
    let finalList = mergedGithub;
    if (finalList.length === 0) {
      if (databaseProjects.length > 0) {
        finalList = databaseProjects.map((p) => ({
          id: p.githubId,
          name: p.name,
          slug: p.slug,
          html_url: p.htmlUrl,
          homepage: p.homepage,
          description: p.description,
          topics: p.topics,
          language: p.language,
          stargazers_count: p.stars,
          updated_at: p.updatedAt?.toISOString(),
          imageUrl: p.imageUrl || null,
          galleryUrls: p.galleryUrls || [],
          socialLinks: p.socialLinks || [],
        }));
      } else {
        finalList = pickProjects(fallbackProjects);
      }
    }

    return NextResponse.json({
      githubUsername: GITHUB_USERNAME,
      projectLimit: PROJECT_LIMIT,
      githubProjects: finalList,
      selectedSlugs,
      githubAvailable: mergedGithub.length > 0,
    });
  } catch (error) {
    console.error("Unable to load admin projects:", error);
    return NextResponse.json({
      githubUsername: GITHUB_USERNAME,
      projectLimit: PROJECT_LIMIT,
      githubProjects: pickProjects(fallbackProjects),
      selectedSlugs: [],
      githubAvailable: false,
    });
  }
}

export async function PUT(request) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const selectedSlugs = Array.isArray(body.selectedSlugs)
      ? body.selectedSlugs.slice(0, PROJECT_LIMIT)
      : [];

    const origin = new URL(request.url).origin;
    const response = await fetch(`${origin}/api/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "select-projects", selectedSlugs }),
      cache: "no-store",
    });

    const payload = await response.json();
    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    console.error("Unable to save selected projects:", error);
    return NextResponse.json(
      { error: "Unable to save selected projects." },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { slug, imageUrl, galleryUrls, socialLinks } = body;

    if (!slug) {
      return NextResponse.json({ error: "slug is required" }, { status: 400 });
    }

    const updated = await prisma.project.update({
      where: { slug },
      data: {
        ...(imageUrl !== undefined && { imageUrl }),
        ...(galleryUrls !== undefined && { galleryUrls }),
        ...(socialLinks !== undefined && { socialLinks }),
      },
    });

    return NextResponse.json({ project: updated });
  } catch (error) {
    console.error("Failed to update project data:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
