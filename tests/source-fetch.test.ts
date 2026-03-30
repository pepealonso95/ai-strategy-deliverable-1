import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

describe("source bundle collection", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.PIPELINE_USE_FIXTURES;
    delete process.env.OPENAI_API_KEY;
    delete process.env.FIRECRAWL_API_KEY;
  });

  it("marks a source as fallback and emits no synthetic findings when live fetch fails", async () => {
    process.env.PIPELINE_USE_FIXTURES = "0";
    process.env.OPENAI_API_KEY = "test-key";
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("403 Forbidden")));
    vi.resetModules();

    const [{ buildSourceBundle }, { FileStore }] = await Promise.all([
      import("@/src/sources/fetch"),
      import("@/src/lib/storage/file-store"),
    ]);

    const tempDir = await mkdtemp(path.join(os.tmpdir(), "intel-source-bundle-"));
    try {
      const store = new FileStore(tempDir);
      await store.ensureSchema();

      const bundle = await buildSourceBundle("perplexity-comet", store);

      expect(bundle.collectionMode).toBe("fallback");
      expect(bundle.fallbackReason).toContain("403 Forbidden");
      expect(bundle.payload.extracted_items).toEqual([]);
      expect(bundle.payload.summary).toContain("No synthetic competitor findings were substituted");
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("uses Firecrawl first for targeted markdown sources", async () => {
    process.env.PIPELINE_USE_FIXTURES = "0";
    process.env.OPENAI_API_KEY = "test-key";
    process.env.FIRECRAWL_API_KEY = "fc-test";
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url === "https://api.firecrawl.dev/v1/scrape") {
          return new Response(
            JSON.stringify({
              success: true,
              data: {
                markdown: "# Gemini release notes\n\n## March 2026\n\n- Gemini Live adds agentic workflow support.",
                html: "<html><body><h1>Gemini release notes</h1></body></html>",
              },
            }),
            { status: 200, headers: { "Content-Type": "application/json" } },
          );
        }

        throw new Error(`Unexpected native fetch: ${url}`);
      }),
    );
    vi.resetModules();

    const [{ buildSourceBundle }, { FileStore }] = await Promise.all([
      import("@/src/sources/fetch"),
      import("@/src/lib/storage/file-store"),
    ]);

    const tempDir = await mkdtemp(path.join(os.tmpdir(), "intel-source-bundle-"));
    try {
      const store = new FileStore(tempDir);
      await store.ensureSchema();

      const bundle = await buildSourceBundle("gemini-release-notes", store);

      expect(bundle.collectionMode).toBe("live");
      expect(bundle.fetchProvider).toBe("firecrawl");
      expect(bundle.parseMode).toBe("markdown");
      expect(bundle.fallbackReason).toBeNull();
      expect(bundle.payload.extracted_items.length).toBeGreaterThan(0);
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("falls back to native fetch when Firecrawl fails but native extraction succeeds", async () => {
    process.env.PIPELINE_USE_FIXTURES = "0";
    process.env.OPENAI_API_KEY = "test-key";
    process.env.FIRECRAWL_API_KEY = "fc-test";
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url === "https://api.firecrawl.dev/v1/scrape") {
          return new Response(JSON.stringify({ success: false, error: "upstream timeout" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
        if (url === "https://labs.scale.com/leaderboard/swe_bench_pro_public") {
          return new Response(
            "<html><body><table><tr><th>Rank</th><th>Vendor</th><th>Model</th><th>Score</th></tr><tr><td>1</td><td>OpenAI</td><td>GPT-5.4</td><td>74.2</td></tr></table></body></html>",
            { status: 200, headers: { "Content-Type": "text/html" } },
          );
        }

        throw new Error(`Unexpected fetch: ${url}`);
      }),
    );
    vi.resetModules();

    const [{ buildSourceBundle }, { FileStore }] = await Promise.all([
      import("@/src/sources/fetch"),
      import("@/src/lib/storage/file-store"),
    ]);

    const tempDir = await mkdtemp(path.join(os.tmpdir(), "intel-source-bundle-"));
    try {
      const store = new FileStore(tempDir);
      await store.ensureSchema();

      const bundle = await buildSourceBundle("scale-swebench-pro", store);

      expect(bundle.collectionMode).toBe("live");
      expect(bundle.fetchProvider).toBe("native");
      expect(bundle.fallbackReason).toContain("Firecrawl extraction failed");
      expect(bundle.payload.extracted_items[0]).toMatchObject({ source_url: "https://labs.scale.com/leaderboard/swe_bench_pro_public" });
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("uses the docs changelog plus native RSS and Models API for the OpenAI baseline", async () => {
    process.env.PIPELINE_USE_FIXTURES = "0";
    process.env.OPENAI_API_KEY = "test-key";
    process.env.FIRECRAWL_API_KEY = "fc-test";
    const fetchSpy = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url === "https://api.firecrawl.dev/v1/scrape") {
        return new Response(
          JSON.stringify({
            success: true,
            data: {
              markdown:
                "# Changelog\n\n## Mar 16\n\nUpdated `gpt-5.3-chat-latest` to point to the latest model currently used in ChatGPT.",
              html: "<html><body><h1>Changelog</h1></body></html>",
            },
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }
      if (url === "https://openai.com/news/rss.xml") {
        return new Response(
          `<?xml version="1.0"?><rss><channel><title>OpenAI News</title><item><title>Update</title><link>https://openai.com/index/update</link><pubDate>Sat, 29 Mar 2026 00:00:00 GMT</pubDate><description>News item</description></item></channel></rss>`,
          { status: 200, headers: { "Content-Type": "application/rss+xml" } },
        );
      }
      if (url === "https://api.openai.com/v1/models") {
        return new Response(JSON.stringify({ data: [{ id: "gpt-5.4-nano", created: 1_774_742_400, owned_by: "openai" }] }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      throw new Error(`Unexpected fetch: ${url}`);
    });
    vi.stubGlobal("fetch", fetchSpy);
    vi.resetModules();

    const [{ buildSourceBundle }, { FileStore }] = await Promise.all([
      import("@/src/sources/fetch"),
      import("@/src/lib/storage/file-store"),
    ]);

    const tempDir = await mkdtemp(path.join(os.tmpdir(), "intel-source-bundle-"));
    try {
      const store = new FileStore(tempDir);
      await store.ensureSchema();

      const bundle = await buildSourceBundle("openai-baseline", store);

      expect(bundle.collectionMode).toBe("live");
      expect(bundle.fetchProvider).toBe("firecrawl");
      expect(bundle.parseMode).toBe("markdown");
      expect(bundle.payload.urls).toEqual([
        "https://developers.openai.com/api/docs/changelog",
        "https://openai.com/news/rss.xml",
        "https://api.openai.com/v1/models",
      ]);
      expect(bundle.payload.extracted_items.some((item) => item.source_url === "https://developers.openai.com/api/docs/changelog")).toBe(
        true,
      );
      expect(fetchSpy.mock.calls.some(([input]) => String(input).includes("api.firecrawl.dev"))).toBe(true);
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("collects community buzz from top Reddit listings with a larger limit", async () => {
    process.env.PIPELINE_USE_FIXTURES = "0";
    process.env.OPENAI_API_KEY = "test-key";
    const expectedRedditUrls = [
      "https://www.reddit.com/r/LocalLLaMA/top/.json?limit=50",
      "https://www.reddit.com/r/singularity/top/.json?limit=50",
      "https://www.reddit.com/r/artificial/top/.json?limit=50",
      "https://www.reddit.com/r/LLM/top/.json?limit=50",
    ];

    const fetchSpy = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (expectedRedditUrls.includes(url)) {
        return new Response(
          JSON.stringify({
            data: {
              children: [
                {
                  data: {
                    title: " Popular post ",
                    selftext: " discussion ",
                    permalink: "/r/LocalLLaMA/comments/abc123/popular_post/",
                    score: 456,
                    created_utc: 1_711_676_800,
                    subreddit: "LocalLLaMA",
                    url: "https://example.com/post",
                  },
                },
              ],
            },
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }
      if (url.startsWith("https://api.github.com/repos/")) {
        return new Response(
          JSON.stringify({
            stargazers_count: 100,
            forks_count: 10,
            open_issues_count: 5,
            subscribers_count: 3,
            html_url: url.replace("https://api.github.com/repos/", "https://github.com/"),
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }

      throw new Error(`Unexpected fetch: ${url}`);
    });

    vi.stubGlobal("fetch", fetchSpy);
    vi.resetModules();

    const [{ buildSourceBundle }, { FileStore }] = await Promise.all([
      import("@/src/sources/fetch"),
      import("@/src/lib/storage/file-store"),
    ]);

    const tempDir = await mkdtemp(path.join(os.tmpdir(), "intel-source-bundle-"));
    try {
      const store = new FileStore(tempDir);
      await store.ensureSchema();

      const bundle = await buildSourceBundle("community-buzz", store);

      expect(bundle.collectionMode).toBe("live");
      expect(bundle.fetchProvider).toBe("native");
      expect(bundle.parseMode).toBe("feed");
      expect(bundle.payload.urls).toEqual(expectedRedditUrls);
      expect(bundle.payload.extracted_items.some((item) => item.permalink)).toBe(true);
      expect(fetchSpy.mock.calls.filter(([input]) => expectedRedditUrls.includes(String(input)))).toHaveLength(4);
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });
});
