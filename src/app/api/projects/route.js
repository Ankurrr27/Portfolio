import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import {
  fallbackProjects,
  fetchGitHubProjects,
  GITHUB_USERNAME,
  normalizeGitHubRepo,
  pickProjects,
  PROJECT_LIMIT,
} from "../../../lib/github-projects";

const serializeProject = (project) => ({
  id: project.id,
  name: project.name,
  slug: project.slug,
  htmlUrl: project.htmlUrl,
  homepage: project.homepage || "",
  description: project.description || "",
  topics: project.topics || [],
  language: project.language || "",
  stars: project.stars || 0,
  forks: project.forks || 0,
  imageUrl: project.imageUrl || null,
  galleryUrls: project.galleryUrls || [],
  updatedAt: project.updatedAt.toISOString(),
});

async function readDatabaseProjects() {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  const projects = await prisma.project.findMany({
    where: { featured: true },
    orderBy: [{ displayOrder: "asc" }, { updatedAt: "desc" }],
    take: PROJECT_LIMIT,
  });

  return projects.map(serializeProject);
}

async function saveSelectedProjects(selectedRepos) {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing");
  }

  const selectedSlugs = new Set(selectedRepos.map((repo) => repo.slug));
  await prisma.project.updateMany({
    where: {
      slug: {
        in: Array.from(selectedSlugs),
      },
    },
    data: {
      featured: false,
      displayOrder: null,
    },
  });

  await Promise.all(
    selectedRepos.map((project, index) =>
      prisma.project.upsert({
        where: { slug: project.slug },
        update: {
          githubId: typeof project.id === "number" ? project.id : null,
          name: project.name,
          htmlUrl: project.html_url,
          homepage: project.homepage || null,
          description: project.description || null,
          topics: Array.isArray(project.topics) ? project.topics : [],
          language: project.language || null,
          stars: project.stargazers_count || 0,
          fork: Boolean(project.fork),
          featured: true,
          displayOrder: index,
          updatedAt: new Date(project.updated_at),
        },
        create: {
          githubId: typeof project.id === "number" ? project.id : null,
          name: project.name,
          slug: project.slug,
          htmlUrl: project.html_url,
          homepage: project.homepage || null,
          description: project.description || null,
          topics: Array.isArray(project.topics) ? project.topics : [],
          language: project.language || null,
          stars: project.stargazers_count || 0,
          fork: Boolean(project.fork),
          featured: true,
          displayOrder: index,
          updatedAt: new Date(project.updated_at),
        },
      })
    )
  );
}

export async function GET() {
  try {
    const databaseProjects = await readDatabaseProjects();

    if (databaseProjects.length > 0) {
      return NextResponse.json({
        projects: databaseProjects,
        source: "database",
      });
    }
  } catch (error) {
    console.error("Database fetch failed:", error);
  }

  try {
    const githubProjects = pickProjects(await fetchGitHubProjects());
    return NextResponse.json({
      projects: githubProjects,
      source: "github",
    });
  } catch (error) {
    console.error("GitHub fetch failed:", error);
    return NextResponse.json(
      {
        projects: fallbackProjects,
        source: "fallback",
      },
      { status: 200 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const action = body?.action || "sync-github";

    if (action === "sync-github") {
      const githubProjects = pickProjects(await fetchGitHubProjects());
      await saveSelectedProjects(githubProjects);

      return NextResponse.json({
        message: "Projects synced successfully.",
        projects: await readDatabaseProjects(),
        source: "database",
      });
    }

    if (action === "select-projects") {
      const selectedSlugs = Array.isArray(body.selectedSlugs)
        ? body.selectedSlugs.slice(0, PROJECT_LIMIT)
        : [];

      const githubProjects = await fetchGitHubProjects();
      const selectedRepos = selectedSlugs
        .map((slug) => githubProjects.find((repo) => repo.slug === slug))
        .filter(Boolean)
        .map(normalizeGitHubRepo);

      await prisma.project.updateMany({
        data: {
          featured: false,
          displayOrder: null,
        },
      });

      await saveSelectedProjects(selectedRepos);

      return NextResponse.json({
        message: "Selected projects imported successfully.",
        projects: await readDatabaseProjects(),
        source: "database",
        githubUsername: GITHUB_USERNAME,
      });
    }

    return NextResponse.json(
      { error: "Unsupported action." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Project sync failed:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to sync projects.",
      },
      { status: 500 }
    );
  }
}
