import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const githubUser = "Ankurrr27";
    const leetcodeUser = "a_nkurrr";
    
    // GitHub Data
    const ghRes = await fetch(`https://api.github.com/users/${githubUser}`, {
      next: { revalidate: 3600 }
    });
    const ghData = await ghRes.json();
    
    // GitHub Stars (requires fetching repos)
    const reposRes = await fetch(`https://api.github.com/users/${githubUser}/repos?per_page=100`, {
      next: { revalidate: 3600 }
    });
    const reposData = await reposRes.json();
    const stars = Array.isArray(reposData) ? reposData.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0) : 0;
    
    // LeetCode Data (using a public proxy)
    const lcRes = await fetch(`https://leetcode-stats-api.herokuapp.com/${leetcodeUser}`, {
      next: { revalidate: 3600 }
    });
    const lcData = await lcRes.json();
    
    return NextResponse.json({
      github: {
        contributions: "1400+", // GitHub API doesn't give total contributions directly without GraphQL
        repositories: ghData.public_repos || 35,
        stars: stars || 150,
      },
      leetcode: {
        solved: lcData.totalSolved || 480,
        rating: 1650, // Hardcoded as LC stats API doesn't always have contest rating
        ranking: lcData.ranking || 0,
        reputation: lcData.reputation || 0,
      },
      gfg: {
        score: "1250+",
        rank: "1",
        percentile: "Top 1%",
      }
    });
  } catch (error) {
    console.error("Stats API Error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
