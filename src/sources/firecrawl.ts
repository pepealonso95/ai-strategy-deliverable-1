import { getEnv } from "@/src/lib/env";

export type FirecrawlDocument = {
  markdown: string | null;
  html: string | null;
  metadata: Record<string, unknown>;
};

type FirecrawlResponse = {
  success?: boolean;
  data?: {
    markdown?: string;
    html?: string;
    metadata?: Record<string, unknown>;
  };
  error?: string;
};

export async function scrapeWithFirecrawl(url: string): Promise<FirecrawlDocument> {
  const env = getEnv();
  if (!env.FIRECRAWL_API_KEY) {
    throw new Error("FIRECRAWL_API_KEY is not configured");
  }

  const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.FIRECRAWL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url,
      formats: ["markdown", "html"],
      onlyMainContent: true,
    }),
    next: {
      revalidate: 0,
    },
  });

  if (!response.ok) {
    throw new Error(`Firecrawl request failed for ${url}: ${response.status}`);
  }

  const payload = (await response.json()) as FirecrawlResponse;
  if (!payload.success || !payload.data) {
    throw new Error(payload.error || `Firecrawl returned no data for ${url}`);
  }

  return {
    markdown: typeof payload.data.markdown === "string" ? payload.data.markdown : null,
    html: typeof payload.data.html === "string" ? payload.data.html : null,
    metadata: payload.data.metadata ?? {},
  };
}
