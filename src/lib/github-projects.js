const GITHUB_USERNAME = process.env.GITHUB_USERNAME || "Ankurrr27";
const PROJECT_LIMIT = 6;

export const fallbackProjects = [
  {
    id: "intervu",
    name: "InterVU",
    html_url: "https://github.com/ankur-personal/InterVU",
    homepage: "https://intervu-pro.vercel.app",
    description:
      "A professional real-time mock interview platform with collaborative interview tooling.",
    topics: ["Next.js", "WebRTC", "Socket.io", "Tailwind"],
    language: "JavaScript",
    stargazers_count: 0,
    updated_at: "2026-01-01T00:00:00Z",
    slug: "intervu",
  },
  {
    id: "velocity",
    name: "Velocity",
    html_url: "https://github.com/ankur-personal/Velocity",
    homepage: "",
    description:
      "A productivity-focused browser experience for managing workflows and tabs with less friction.",
    topics: ["React", "Chrome API", "Firebase", "Node.js"],
    language: "JavaScript",
    stargazers_count: 0,
    updated_at: "2026-01-01T00:00:00Z",
    slug: "velocity",
  },
  {
    id: "nexus-ai",
    name: "Nexus AI",
    html_url: "https://github.com/ankur-personal/NexusAI",
    homepage: "https://nexus-ai-studio.vercel.app",
    description:
      "An AI workspace for model experimentation, evaluation, and dataset-centric workflows.",
    topics: ["Python", "FastAPI", "TensorFlow", "React"],
    language: "Python",
    stargazers_count: 0,
    updated_at: "2026-01-01T00:00:00Z",
    slug: "nexus-ai",
  },
];

export function toSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeGitHubRepo(repo) {
  return {
    ...repo,
    slug: repo.slug || toSlug(repo.name),
  };
}

export function pickProjects(repos) {
  return repos
    .filter((repo) => !repo.fork)
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    )
    .slice(0, PROJECT_LIMIT)
    .map(normalizeGitHubRepo);
}

export async function fetchGitHubProjects() {
  try {
    const headers = {
      Accept: "application/vnd.github+json",
    };
    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`,
      { headers, next: { revalidate: 1800 } }
    );

    if (!response.ok) {
      console.warn(`GitHub API returned ${response.status}. Falling back to DB data.`);
      return [];
    }

    const repos = await response.json();
    return repos
      .filter((repo) => !repo.fork)
      .sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )
      .map(normalizeGitHubRepo);
  } catch (err) {
    console.warn("GitHub fetch failed:", err.message);
    return [];
  }
}

export { GITHUB_USERNAME, PROJECT_LIMIT };
