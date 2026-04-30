

const GITHUB_USERNAME = "Ankurrr27";

function extractUsername(url, domain) {
  if (!url) return null;
  try {
    const parts = url.replace(/\/$/, '').split('/');
    return parts[parts.length - 1];
  } catch (e) {
    return null;
  }
}

export async function fetchCodingStats(profile = null) {
  const leetcodeUser = extractUsername(profile?.leetcodeUrl) || "a_nkurrr";
  const gfgUser = extractUsername(profile?.geeksforgeeksUrl) || "ankurrr";

  const stats = {
    github: { label: "GitHub", count: "0", detail: "Total Stars", icon: "github" },
    leetcode: { label: "LeetCode", count: profile?.leetcodeSolved || "0", detail: "Solved", icon: "leetcode" },
    gfg: { label: "GeeksforGeeks", count: profile?.gfgSolved || "0", detail: "Problems", icon: "gfg" },
  };

  try {
    // 1. Fetch GitHub Stats
    try {
      const githubRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(5000)
      });
      if (githubRes.ok) {
        const data = await githubRes.json();
        stats.github.count = data.public_repos || "10+";
        stats.github.detail = "Public Repos";
      }
    } catch (e) {
      console.warn("GitHub fetch failed, using fallback");
    }

    // 2. Fetch LeetCode Stats
    try {
      const leetcodeRes = await fetch(`https://leetcode-stats-api.herokuapp.com/${leetcodeUser}`, {
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(8000)
      });
      if (leetcodeRes.ok) {
        const data = await leetcodeRes.json();
        if (data.status === "success" && data.totalSolved) {
          stats.leetcode.count = data.totalSolved.toString();
        }
      }
    } catch (e) {
      console.warn("LeetCode fetch failed, using fallback");
    }

    // 3. Fetch GFG Stats
    try {
      const gfgRes = await fetch(`https://geeks-for-geeks-api.vercel.app/${gfgUser}`, {
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(5000)
      });
      if (gfgRes.ok) {
        const data = await gfgRes.json();
        if (data.total_problems_solved) {
          stats.gfg.count = data.total_problems_solved.toString();
        }
      }
    } catch (e) {
      console.warn("GFG fetch failed, using fallback");
    }

  } catch (error) {
    console.error("Error fetching coding stats:", error);
  }

  return Object.values(stats);
}
