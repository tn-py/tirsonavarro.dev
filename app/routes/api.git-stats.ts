import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { GITHUB_USERNAME } from "~/lib/gitContributions";

interface GitHubUser {
  public_repos: number;
  followers: number;
  created_at: string;
}

interface GitHubRepo {
  stargazers_count: number;
  language: string | null;
  fork: boolean;
}

// Simple in-memory rate limiter
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 20;
const ipHits = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = ipHits.get(ip);
  if (!record || record.resetAt < now) {
    ipHits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (record.count >= MAX_REQUESTS) return false;
  record.count++;
  return true;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  if (!checkRateLimit(ip)) {
    throw new Response("Rate limit exceeded", { status: 429 });
  }
  const url = new URL(request.url);
  const username = url.searchParams.get("user") || GITHUB_USERNAME;
  const headers: Record<string, string> = {
    "user-agent": "tirsonavarro.dev-terminal",
    accept: "application/vnd.github+json",
  };

  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers.authorization = `Bearer ${token}`;
  }

  const [userRes, reposRes] = await Promise.all([
    fetch(`https://api.github.com/users/${username}`, { headers }),
    fetch(`https://api.github.com/users/${username}/repos?per_page=100&type=owner&sort=updated`, {
      headers,
    }),
  ]);

  if (!userRes.ok) {
    throw new Response(`Failed to load GitHub stats (${userRes.status})`, { status: 502 });
  }

  const user = (await userRes.json()) as GitHubUser;
  const repos = reposRes.ok ? ((await reposRes.json()) as GitHubRepo[]) : [];
  const ownRepos = repos.filter((r) => !r.fork);

  const totalStars = ownRepos.reduce((sum, r) => sum + r.stargazers_count, 0);

  const langCounts = new Map<string, number>();
  for (const repo of ownRepos) {
    if (!repo.language) continue;
    langCounts.set(repo.language, (langCounts.get(repo.language) ?? 0) + 1);
  }
  const topLanguages = [...langCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  return json(
    {
      username,
      publicRepos: user.public_repos,
      followers: user.followers,
      totalStars,
      topLanguages,
      createdAt: user.created_at,
    },
    {
      headers: {
        "cache-control": "public, max-age=300, s-maxage=300",
      },
    },
  );
};
