import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

const toText = (value, fallback = "") => {
  if (value == null) return fallback;
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return fallback;
};

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const githubHeaders = {
  Accept: "application/vnd.github+json",
  "User-Agent": "ankur-portfolio",
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

const languageColors = {
  JavaScript: "bg-red-500",
  TypeScript: "bg-orange-500",
  "C++": "bg-emerald-500",
  Python: "bg-blue-500",
  CSS: "bg-yellow-400",
  HTML: "bg-orange-600",
  Java: "bg-sky-400",
  Shell: "bg-zinc-400",
  Other: "bg-zinc-500",
};

const fetchGithubJson = async (url, init = {}) => {
  const res = await fetch(url, {
    ...init,
    headers: {
      ...githubHeaders,
      ...(init.headers || {}),
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) return null;
  return res.json();
};

const fetchGithubText = async (url) => {
  const res = await fetch(url, {
    headers: githubHeaders,
    next: { revalidate: 3600 },
  });

  if (!res.ok) return "";
  return res.text();
};

const getGithubSearchCount = async (query) => {
  const data = await fetchGithubJson(`https://api.github.com/search/issues?q=${encodeURIComponent(query)}`);
  return data?.total_count ?? 0;
};

const getGithubCommitCount = async (username) => {
  const data = await fetchGithubJson(`https://api.github.com/search/commits?q=${encodeURIComponent(`author:${username}`)}`, {
    headers: { Accept: "application/vnd.github.cloak-preview+json" },
  });
  return data?.total_count ?? 0;
};

const parseGithubContributionCalendar = async (username) => {
  const html = await fetchGithubText(`https://github.com/users/${username}/contributions`);
  const totalMatch = html.match(/<h2[^>]*>\s*([\d,]+)\s*contributions/i);
  const total = totalMatch ? Number(totalMatch[1].replace(/,/g, "")) : 0;
  const cells = [];
  const tdRegex = /<td[^>]*data-date="([^"]+)"[^>]*>/g;
  let match;
  while ((match = tdRegex.exec(html)) !== null) {
    const tdTag = match[0];
    const levelMatch = tdTag.match(/data-level="([^"]+)"/);
    if (levelMatch) {
      cells.push({
        date: match[1],
        level: Number(levelMatch[1]) || 0
      });
    }
  }
  const activeDays = cells.filter((cell) => cell.level > 0).length;
  const monthFormatter = new Intl.DateTimeFormat("en", { month: "short" });
  const months = [];

  cells.forEach((cell) => {
    const label = monthFormatter.format(new Date(`${cell.date}T00:00:00Z`));
    if (months[months.length - 1] !== label) months.push(label);
  });

  let maxStreak = 0;
  let runningStreak = 0;
  cells.forEach((cell) => {
    runningStreak = cell.level > 0 ? runningStreak + 1 : 0;
    maxStreak = Math.max(maxStreak, runningStreak);
  });

  let currentStreak = 0;
  for (let i = cells.length - 1; i >= 0; i -= 1) {
    if (cells[i].level === 0) break;
    currentStreak += 1;
  }

  return {
    total,
    activeDays,
    maxStreak,
    currentStreak,
    months,
    cells,
  };
};

const getGithubLiveStats = async (username) => {
  const [profile, repos] = await Promise.all([
    fetchGithubJson(`https://api.github.com/users/${username}`),
    fetchGithubJson(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`),
  ]);

  const publicRepos = Array.isArray(repos) ? repos.filter((repo) => !repo.fork) : [];
  const stars = publicRepos.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0);
  const openIssues = publicRepos.reduce((acc, repo) => acc + (repo.open_issues_count || 0), 0);
  const languageTotals = {};

  const languageResponses = await Promise.allSettled(
    publicRepos.slice(0, 30).map((repo) => fetchGithubJson(repo.languages_url))
  );

  languageResponses.forEach((result) => {
    if (result.status !== "fulfilled" || !result.value) return;
    Object.entries(result.value).forEach(([language, bytes]) => {
      languageTotals[language] = (languageTotals[language] || 0) + bytes;
    });
  });

  const languageBytes = Object.values(languageTotals).reduce((acc, bytes) => acc + bytes, 0);
  const languages = Object.entries(languageTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, bytes]) => ({
      name,
      percent: languageBytes ? Math.round((bytes / languageBytes) * 100) : 0,
      color: languageColors[name] || languageColors.Other,
    }));

  const usedPercent = languages.reduce((acc, language) => acc + language.percent, 0);
  if (usedPercent < 100 && languages.length > 0) {
    languages[0].percent += 100 - usedPercent;
  }

  const [commits, prs, authoredIssues, contributionCalendar] = await Promise.all([
    getGithubCommitCount(username),
    getGithubSearchCount(`author:${username} type:pr`),
    getGithubSearchCount(`author:${username} type:issue`),
    parseGithubContributionCalendar(username),
  ]);

  return {
    contributions: contributionCalendar.total || 0,
    repositories: profile?.public_repos ?? publicRepos.length,
    stars,
    openIssues,
    commits,
    prs,
    issues: authoredIssues,
    languages,
    contributionCalendar,
  };
};

export async function GET() {
  try {
    // 1. Get database overrides/cache
    let dbStats = await prisma.codingStats.findFirst();
    const visibility = {
      github: dbStats?.showGithubStats ?? true,
      leetcode: dbStats?.showLeetcodeStats ?? true,
      gfg: dbStats?.showGfgStats ?? true,
      codeforces: dbStats?.showCodeforcesStats ?? true,
    };
    const neural = {
      github: {
        val: toNumber(dbStats?.naGithubVal, 0),
        trend: toText(dbStats?.naGithubTrend, "..."),
        label: toText(dbStats?.naGithubLabel, "Syncing..."),
      },
      leetcode: {
        val: toNumber(dbStats?.naLeetcodeVal, 0),
        trend: toText(dbStats?.naLeetcodeTrend, "..."),
        label: toText(dbStats?.naLeetcodeLabel, "Syncing..."),
      },
      gfg: {
        val: toNumber(dbStats?.naGfgVal, 0),
        trend: toText(dbStats?.naGfgTrend, "..."),
        label: toText(dbStats?.naGfgLabel, "Syncing..."),
      },
      codeforces: {
        val: toNumber(dbStats?.naCfVal, 0),
        trend: toText(dbStats?.naCfTrend, "..."),
        label: toText(dbStats?.naCfLabel, "Syncing..."),
      },
      globalScore: toText(dbStats?.globalScore, "--"),
    };

    const githubUser = process.env.GITHUB_USERNAME || "Ankurrr27";
    let githubLive = null;

    if (visibility.github) {
      try {
        githubLive = await getGithubLiveStats(githubUser);
      } catch (githubError) {
        console.warn("GitHub Live Stats Warning:", githubError.message);
      }
    }
    
    // If autoFetch is OFF, return DB values immediately
    if (dbStats && !dbStats.autoFetch) {
      return NextResponse.json({
        visibility,
        neural,
        github: {
          contributions: githubLive?.contributions ? `${githubLive.contributions}+` : toText(dbStats.githubContributions, "--"),
          repositories: githubLive?.repositories ? `${githubLive.repositories}+` : toText(dbStats.githubRepos, "--"),
          stars: githubLive ? `${githubLive.stars}+` : toText(dbStats.githubStars, "--"),
          dashboard: githubLive,
        },
        leetcode: {
          solved: toText(dbStats.leetcodeSolved, "--"),
          rating: toText(dbStats.leetcodeRating, "--"),
          ranking: toText(dbStats.leetcodeRanking, "--"),
        },
        gfg: {
          score: toText(dbStats.gfgScore, "--"),
          rank: toText(dbStats.gfgRank, "--"),
          percentile: toText(dbStats.gfgPercentile, "--"),
        },
        codeforces: {
          rating: toText(dbStats.cfRating, "--"),
          rank: toText(dbStats.cfRank, "--"),
          solved: toText(dbStats.cfSolved, "--"),
        }
      });
    }

    // 2. Otherwise, perform live fetch (or fallback if DB exists)
    const leetcodeUser = "a_nkurrr";
    
    // Default live data structure (with DB fallbacks if available)
    const stats = {
      github: {
        contributions: toText(dbStats?.githubContributions, "--"),
        repositories: toText(dbStats?.githubRepos, "--"),
        stars: toText(dbStats?.githubStars, "--"),
        dashboard: null,
      },
      leetcode: {
        solved: toText(dbStats?.leetcodeSolved, "--"),
        easy: 0,
        medium: 0,
        hard: 0,
        rating: toText(dbStats?.leetcodeRating, "--"),
        ranking: toText(dbStats?.leetcodeRanking, "--"),
      },
      gfg: {
        score: toText(dbStats?.gfgScore, "--"),
        rank: toText(dbStats?.gfgRank, "--"),
        percentile: toText(dbStats?.gfgPercentile, "--"),
      },
      codeforces: {
        rating: toText(dbStats?.cfRating, "--"),
        rank: toText(dbStats?.cfRank, "--"),
        solved: toText(dbStats?.cfSolved, "--"),
      },
      visibility,
      neural,
    };

    try {
      if (githubLive) {
        stats.github.contributions = `${githubLive.contributions}+`;
        stats.github.repositories = `${githubLive.repositories}+`;
        stats.github.stars = `${githubLive.stars}+`;
        stats.github.dashboard = githubLive;
      }

      // Live LeetCode Data
      const lcRes = await fetch(`https://leetcode-stats-api.herokuapp.com/${leetcodeUser}`, { next: { revalidate: 3600 } });
      const lcData = await lcRes.json();
      if (lcData.totalSolved) {
        stats.leetcode.solved = lcData.totalSolved;
        stats.leetcode.easy = lcData.easySolved || stats.leetcode.easy;
        stats.leetcode.medium = lcData.mediumSolved || stats.leetcode.medium;
        stats.leetcode.hard = lcData.hardSolved || stats.leetcode.hard;
      }
      if (lcData.ranking) stats.leetcode.ranking = `#${lcData.ranking}`;

    } catch (apiError) {
      console.warn("Live Stats Fetch Warning:", apiError.message);
    }

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Stats API Error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
