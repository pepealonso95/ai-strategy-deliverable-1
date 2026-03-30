import { getEnv, usingFixtureMode } from "@/src/lib/env";
import { sha256 } from "@/src/lib/hash";
import type { DataStore } from "@/src/lib/storage/types";
import type { FetchProvider, ParseMode, SourceDefinition, SourceSnapshot } from "@/src/lib/types";
import { fetchGitHubRepoMetric, parseRedditListing } from "@/src/sources/community";
import { scrapeWithFirecrawl } from "@/src/sources/firecrawl";
import {
  extractLeaderboardRows,
  extractLines,
  normalizeWhitespace,
  parseHtmlDocument,
  parseMarkdownDocument,
} from "@/src/sources/normalize";
import { getSourceById } from "@/src/sources/registry";
import type { SourceBundle } from "@/src/sources/types";
import { XMLParser } from "fast-xml-parser";

const FIXTURES: Record<string, SourceBundle["payload"]> = {
  "anthropic-news": {
    summary:
      "Anthropic fixture bundle: enterprise-oriented launch framing, Claude release note hints, and safety messaging updates.",
    urls: ["https://www.anthropic.com/news"],
    extracted_items: [
      {
        heading: "Claude Enterprise workflow update",
        detail: "Anthropic expands enterprise agent workflow messaging and positions Claude for high-trust operations.",
      },
      {
        heading: "Safety framing",
        detail: "Anthropic emphasizes reliability and constitutional AI as launch differentiators.",
      },
    ],
  },
  "claude-code-changelog": {
    summary:
      "Claude Code changelog fixture bundle: dated releases, model support updates, and workflow quality improvements.",
    urls: ["https://code.claude.com/docs/en/changelog"],
    extracted_items: [
      {
        heading: "Claude Code 2.1.86",
        detail: "Added support for a newer Claude Sonnet release and improved CLI reliability.",
      },
    ],
  },
  "gemini-blog": {
    summary:
      "Gemini fixture bundle: model release messaging, Google distribution leverage, and workspace/product integration claims.",
    urls: ["https://blog.google/products/gemini/"],
    extracted_items: [
      {
        heading: "Gemini upgrade",
        detail: "Google highlights a new Gemini milestone and stronger product integration across Google surfaces.",
      },
      {
        heading: "Distribution",
        detail: "Messaging stresses built-in adoption via consumer and workplace distribution.",
      },
    ],
  },
  "gemini-release-notes": {
    summary:
      "Gemini release-notes fixture bundle: dated rollout entries for app capabilities, regional availability, and model packaging changes.",
    urls: ["https://gemini.google/release-notes/"],
    extracted_items: [
      {
        heading: "March 2026 release note",
        detail: "Gemini adds a new workflow capability and expands regional availability for paying users.",
      },
    ],
  },
  "perplexity-comet": {
    summary:
      "Perplexity Comet fixture bundle: browser-native agent workflows and voice mode updates positioned as productivity gains.",
    urls: ["https://docs.perplexity.ai/docs/resources/changelog"],
    extracted_items: [
      {
        heading: "Voice mode",
        detail: "Voice mode becomes faster and more context aware within the browser workflow.",
      },
      {
        heading: "Computer tasks",
        detail: "Perplexity positions persistent computer workflows as a digital worker capability.",
      },
    ],
  },
  "perplexity-blog": {
    summary:
      "Perplexity blog fixture bundle: enterprise productivity framing and product narrative around search plus agent execution.",
    urls: ["https://research.perplexity.ai/articles"],
    extracted_items: [
      {
        heading: "Research workflow messaging",
        detail: "Perplexity frames research, labs, and browser automation as one integrated productivity suite.",
      },
    ],
  },
  "scale-swebench-pro": {
    summary:
      "Scale SWE-bench Pro fixture bundle: synthetic coding-benchmark rows for top vendor positions.",
    urls: ["https://labs.scale.com/leaderboard/swe_bench_pro_public"],
    extracted_items: [
      { benchmark: "Scale SWE-bench Pro", rank: 1, vendor: "OpenAI", model: "GPT-5.4", score: 74.2 },
      { benchmark: "Scale SWE-bench Pro", rank: 2, vendor: "Anthropic", model: "Claude Sonnet", score: 71.8 },
    ],
  },
  livebench: {
    summary: "LiveBench fixture bundle: broad benchmark movement across frontier vendors.",
    urls: ["https://livebench.ai/"],
    extracted_items: [{ benchmark: "LiveBench", rank: 1, vendor: "Google", model: "Gemini", score: 84.4 }],
  },
  lmarena: {
    summary: "LMSYS Arena fixture bundle: public preference leaderboard movement.",
    urls: ["https://lmarena.ai/leaderboard"],
    extracted_items: [{ benchmark: "LMSYS Arena", rank: 1, vendor: "OpenAI", model: "GPT-5.4", score: 1432 }],
  },
  "artificial-analysis": {
    summary: "Artificial Analysis fixture bundle: vendor/model benchmark dashboard comparisons.",
    urls: ["https://artificialanalysis.ai/"],
    extracted_items: [{ benchmark: "Artificial Analysis", rank: 2, vendor: "Anthropic", model: "Claude", score: 72.4 }],
  },
  "llm-stats": {
    summary:
      "LLM Stats fixture bundle: benchmark index references and vendor/model mentions without over-claiming explicit score movement.",
    urls: ["https://llm-stats.com/benchmarks"],
    extracted_items: [
      { heading: "Benchmark index", detail: "Cross-links to coding and reasoning benchmark families for major frontier vendors." },
    ],
  },
  "community-buzz": {
    summary:
      "Community fixture bundle: Reddit speculation about upcoming model launches paired with GitHub repo momentum for Anthropic and Gemini SDKs.",
    urls: [
      "https://www.reddit.com/r/LocalLLaMA/top/.json?limit=50",
      "https://www.reddit.com/r/singularity/top/.json?limit=50",
      "https://www.reddit.com/r/artificial/top/.json?limit=50",
      "https://www.reddit.com/r/LLM/top/.json?limit=50",
    ],
    extracted_items: [
      {
        subreddit: "LocalLLaMA",
        title: "Speculation on next major proprietary model launch",
        score: 242,
      },
      {
        repo: "google-gemini/gemini-cli",
        stars: 5400,
        forks: 390,
      },
    ],
  },
  "openai-baseline": {
    summary:
      "OpenAI fixture bundle: API docs changelog, news feed, and model lineup baseline used to score relative exposure.",
    urls: [
      "https://developers.openai.com/api/docs/changelog",
      "https://openai.com/news/rss.xml",
      "https://api.openai.com/v1/models",
    ],
    extracted_items: [
      {
        area: "API changelog",
        detail: "GPT-5.4 feature and tool-surface updates in the API docs changelog form part of the baseline.",
      },
      {
        area: "API",
        detail: "GPT-5.4-nano, GPT-5 class reasoning, and developer-facing platform products form the baseline.",
      },
      {
        area: "Consumer",
        detail: "ChatGPT positioning, pricing, and multimodal packaging set the public product surface.",
      },
    ],
  },
};

type LivePayloadResult = {
  payload: SourceBundle["payload"];
  fetchProvider: FetchProvider;
  parseMode: ParseMode;
  fallbackReason: string | null;
};

type ParsedContent = {
  title: string | null;
  text: string;
  tableRows: string[][];
};

async function fetchText(url: string) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "openai-competitor-intelligence-agent/1.0",
      Accept: "text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8",
    },
    next: {
      revalidate: 0,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  return response.text();
}

async function fetchOpenAIModels() {
  const env = getEnv();
  const response = await fetch("https://api.openai.com/v1/models", {
    headers: {
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    next: {
      revalidate: 0,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch https://api.openai.com/v1/models: ${response.status}`);
  }

  return (await response.json()) as {
    data?: Array<{ id: string; created?: number; owned_by?: string }>;
  };
}

function parseRssItems(xml: string) {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
  });
  const parsed = parser.parse(xml) as {
    rss?: {
      channel?: {
        title?: string;
        item?: Array<Record<string, unknown>> | Record<string, unknown>;
      };
    };
  };

  const channel = parsed.rss?.channel;
  const rawItems = Array.isArray(channel?.item) ? channel.item : channel?.item ? [channel.item] : [];

  return {
    title: typeof channel?.title === "string" ? channel.title : "RSS feed",
    items: rawItems.map((item) => ({
      title: typeof item.title === "string" ? item.title : "Untitled item",
      link: typeof item.link === "string" ? item.link : null,
      pubDate: typeof item.pubDate === "string" ? item.pubDate : null,
      description:
        typeof item.description === "string"
          ? normalizeWhitespace(item.description.replace(/<[^>]+>/g, " "))
          : null,
    })),
  };
}

function summarizeSection(title: string | null, text: string, url: string) {
  return [title ?? url, ...extractLines(text, 60)].join("\n");
}

function extractSourceItems(source: SourceDefinition, url: string, parsed: ParsedContent) {
  if (source.kind === "leaderboard" || source.parse_mode === "table") {
    const rows = extractLeaderboardRows(parsed.tableRows);
    if (rows.length > 0) {
      return rows.map((row) => ({
        source_url: url,
        ...row,
      }));
    }
  }

  return extractLines(parsed.text, 20).map((line) => ({
    source_url: url,
    text: line,
  }));
}

function hasUsableContent(payload: SourceBundle["payload"]) {
  return payload.extracted_items.length > 0 || payload.summary.trim().length > 0;
}

async function buildNativeHtmlPayload(source: SourceDefinition): Promise<LivePayloadResult> {
  const extractedItems: Array<Record<string, unknown>> = [];
  const normalizedSections: string[] = [];

  for (const url of source.urls) {
    const text = await fetchText(url);
    const parsedHtml = parseHtmlDocument(text);
    normalizedSections.push(summarizeSection(parsedHtml.title, parsedHtml.text, url));
    extractedItems.push(...extractSourceItems(source, url, parsedHtml));
  }

  return {
    payload: {
      summary: normalizedSections.join("\n\n"),
      urls: source.urls,
      extracted_items: extractedItems,
    },
    fetchProvider: "native",
    parseMode: source.parse_mode ?? (source.kind === "leaderboard" ? "table" : "html"),
    fallbackReason: null,
  };
}

async function buildFirecrawlPayload(source: SourceDefinition): Promise<LivePayloadResult> {
  const extractedItems: Array<Record<string, unknown>> = [];
  const normalizedSections: string[] = [];

  for (const url of source.urls) {
    const document = await scrapeWithFirecrawl(url);
    const parsed =
      source.parse_mode === "markdown" || (source.parse_mode === "table" && document.markdown)
        ? parseMarkdownDocument(document.markdown ?? "")
        : parseHtmlDocument(document.html ?? "");

    normalizedSections.push(summarizeSection(parsed.title, parsed.text, url));
    extractedItems.push(...extractSourceItems(source, url, parsed));
  }

  const payload = {
    summary: normalizedSections.join("\n\n"),
    urls: source.urls,
    extracted_items: extractedItems,
  };

  if (!hasUsableContent(payload)) {
    throw new Error(`Firecrawl returned no usable content for ${source.label}`);
  }

  return {
    payload,
    fetchProvider: "firecrawl",
    parseMode: source.parse_mode ?? "markdown",
    fallbackReason: null,
  };
}

async function buildOpenAIBaselinePayload(source: SourceDefinition): Promise<LivePayloadResult> {
  let changelogText = "";
  let fetchProvider: FetchProvider = "native";
  let fallbackReason: string | null = null;

  try {
    const document = await scrapeWithFirecrawl(source.urls[0]!);
    changelogText = parseMarkdownDocument(document.markdown ?? document.html ?? "").text;
    fetchProvider = "firecrawl";
  } catch (firecrawlError) {
    const firecrawlMessage = firecrawlError instanceof Error ? firecrawlError.message : "unknown Firecrawl failure";
    const nativeHtml = await fetchText(source.urls[0]!);
    changelogText = parseHtmlDocument(nativeHtml).text;
    fallbackReason = `Firecrawl extraction failed and native fetch succeeded instead: ${firecrawlMessage}`;
  }

  const [newsFeedXml, modelsResponse] = await Promise.all([fetchText(source.urls[1]!), fetchOpenAIModels()]);
  const parsedFeed = parseRssItems(newsFeedXml);
  const modelItems = (modelsResponse.data ?? [])
    .filter((model) => model.id)
    .sort((left, right) => (right.created ?? 0) - (left.created ?? 0))
    .slice(0, 20)
    .map((model) => ({
      source_url: source.urls[2],
      model_id: model.id,
      created_at: model.created ? new Date(model.created * 1000).toISOString() : null,
      owned_by: model.owned_by ?? null,
    }));

  const newsItems = parsedFeed.items.slice(0, 10).map((item) => ({
    source_url: source.urls[1],
    title: item.title,
    published_at: item.pubDate,
    detail: item.description,
    link: item.link,
  }));

  const changelogItems = extractLines(changelogText, 15).map((line) => ({
    source_url: source.urls[0],
    area: "API changelog",
    detail: line,
  }));

  return {
    payload: {
      summary: `Collected ${changelogItems.length} OpenAI API changelog lines, ${newsItems.length} OpenAI news RSS items, and ${modelItems.length} current model IDs from the official Models API.`,
      urls: [...source.urls],
      extracted_items: [...changelogItems, ...newsItems, ...modelItems],
    },
    fetchProvider,
    parseMode: "markdown",
    fallbackReason,
  };
}

async function buildCommunityPayload(source: SourceDefinition): Promise<LivePayloadResult> {
  const env = getEnv();
  const redditItems = [];
  for (const url of source.urls) {
    const text = await fetchText(url);
    redditItems.push(...parseRedditListing(JSON.parse(text)));
  }

  const githubItems = [];
  for (const repo of source.githubRepos ?? []) {
    githubItems.push(await fetchGitHubRepoMetric(repo, env.GITHUB_TOKEN));
  }

  return {
    payload: {
      summary: `Collected ${redditItems.length} Reddit posts and ${githubItems.length} GitHub repo snapshots.`,
      urls: [...source.urls],
      extracted_items: [...redditItems, ...githubItems],
    },
    fetchProvider: "native",
    parseMode: "feed",
    fallbackReason: null,
  };
}

async function buildLivePayload(sourceId: string): Promise<LivePayloadResult> {
  const source = getSourceById(sourceId);

  if (sourceId === "openai-baseline") {
    return buildOpenAIBaselinePayload(source);
  }

  if (source.kind === "reddit") {
    return buildCommunityPayload(source);
  }

  if (source.preferred_fetch_provider === "firecrawl") {
    try {
      return await buildFirecrawlPayload(source);
    } catch (firecrawlError) {
      const firecrawlMessage = firecrawlError instanceof Error ? firecrawlError.message : "unknown Firecrawl failure";
      try {
        const nativePayload = await buildNativeHtmlPayload(source);
        return {
          ...nativePayload,
          fallbackReason: `Firecrawl extraction failed and native fetch succeeded instead: ${firecrawlMessage}`,
        };
      } catch (nativeError) {
        const nativeMessage = nativeError instanceof Error ? nativeError.message : "unknown native fetch failure";
        throw new Error(`Firecrawl failed (${firecrawlMessage}); native fallback failed (${nativeMessage})`);
      }
    }
  }

  return buildNativeHtmlPayload(source);
}

export async function buildSourceBundle(sourceId: string, dataStore: DataStore): Promise<SourceBundle> {
  const source = getSourceById(sourceId);
  let payload = FIXTURES[sourceId];
  let collectionMode: SourceBundle["collectionMode"] = "fixture";
  let fetchProvider: SourceBundle["fetchProvider"] = source.preferred_fetch_provider ?? "native";
  let parseMode: SourceBundle["parseMode"] = source.parse_mode ?? (source.kind === "leaderboard" ? "table" : "html");
  let fallbackReason: string | null = null;

  if (!usingFixtureMode()) {
    try {
      const livePayload = await buildLivePayload(sourceId);
      payload = livePayload.payload;
      collectionMode = "live";
      fetchProvider = livePayload.fetchProvider;
      parseMode = livePayload.parseMode;
      fallbackReason = livePayload.fallbackReason;
    } catch (error) {
      fallbackReason = error instanceof Error ? error.message : "unknown live fetch failure";
      collectionMode = "fallback";
      payload = {
        summary: `Live fetch failed for ${source.label}: ${fallbackReason}. No synthetic competitor findings were substituted for this source.`,
        urls: [...source.urls],
        extracted_items: [],
      };
    }
  } else if (payload) {
    payload = {
      ...payload,
      summary: `Fixture mode enabled. Synthetic test data only. ${payload.summary}`,
    };
  }

  if (!payload) {
    throw new Error(`No fixture payload configured for ${sourceId}`);
  }

  const normalizedText = normalizeWhitespace(JSON.stringify(payload));
  const snapshot: SourceSnapshot = {
    source_id: source.id,
    source_label: source.label,
    competitor: source.competitor,
    kind: source.kind,
    fetched_at: new Date().toISOString(),
    content_hash: sha256(normalizedText),
    normalized_text: normalizedText,
    metadata: {
      urls: payload.urls,
      extracted_count: payload.extracted_items.length,
      summary_preview: payload.summary.slice(0, 240),
      fixture_mode: collectionMode === "fixture",
      collection_mode: collectionMode,
      fetch_provider: fetchProvider,
      parse_mode: parseMode,
      fallback_reason: fallbackReason,
    },
  };

  const previousSnapshot = await dataStore.getLatestSnapshot(source.id);
  return {
    source,
    snapshot,
    previousSnapshot,
    changed: previousSnapshot?.content_hash !== snapshot.content_hash,
    collectionMode,
    fetchProvider,
    parseMode,
    fallbackReason,
    payload,
  };
}
