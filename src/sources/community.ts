import { normalizeWhitespace } from "@/src/sources/normalize";

type RedditChild = {
  data: {
    title: string;
    selftext: string;
    permalink: string;
    score: number;
    created_utc: number;
    subreddit: string;
    url?: string;
  };
};

type RedditListing = {
  data?: {
    children?: RedditChild[];
  };
};

export type RedditPost = {
  title: string;
  body: string;
  permalink: string;
  score: number;
  created_at: string;
  subreddit: string;
  url: string | null;
};

export type GitHubRepoMetric = {
  repo: string;
  stars: number;
  forks: number;
  open_issues: number;
  watchers: number;
  source_url: string;
};

export function parseRedditListing(json: unknown): RedditPost[] {
  const listing = json as RedditListing;
  const children = listing.data?.children ?? [];

  return children.map(({ data }) => ({
    title: normalizeWhitespace(data.title),
    body: normalizeWhitespace(data.selftext ?? ""),
    permalink: `https://www.reddit.com${data.permalink}`,
    score: data.score,
    created_at: new Date(data.created_utc * 1000).toISOString(),
    subreddit: data.subreddit,
    url: data.url ?? null,
  }));
}

export async function fetchGitHubRepoMetric(repo: string, githubToken?: string): Promise<GitHubRepoMetric> {
  const response = await fetch(`https://api.github.com/repos/${repo}`, {
    headers: {
      "User-Agent": "openai-competitor-intelligence-agent",
      Accept: "application/vnd.github+json",
      ...(githubToken ? { Authorization: `Bearer ${githubToken}` } : {}),
    },
    next: {
      revalidate: 0,
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub request failed for ${repo}: ${response.status}`);
  }

  const json = (await response.json()) as {
    stargazers_count: number;
    forks_count: number;
    open_issues_count: number;
    subscribers_count: number;
    html_url: string;
  };

  return {
    repo,
    stars: json.stargazers_count,
    forks: json.forks_count,
    open_issues: json.open_issues_count,
    watchers: json.subscribers_count,
    source_url: json.html_url,
  };
}
