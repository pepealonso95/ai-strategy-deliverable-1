import { loadPrompt } from "@/src/lib/prompts";
import type { MonitorBatch } from "@/src/lib/types";
import { SOURCE_REGISTRY } from "@/src/sources/registry";
import { sourceIdToAgentName } from "@/src/pipeline/helpers";
import type { SourceHealth } from "@/src/pipeline/daily-intel";

export async function buildSubmissionMarkdown(args: {
  runDate: string;
  rawReportMarkdown: string;
  strategyMarkdown: string;
  monitorBatches: MonitorBatch[];
  sourceHealth: SourceHealth[];
}) {
  const repoUrl = "https://github.com/pepealonso95/ai-strategy-deliverable-1";
  const getSource = (id: string) => SOURCE_REGISTRY.find((source) => source.id === id)!;
  const officialSources = [
    getSource("claude-code-changelog"),
    getSource("anthropic-news"),
    getSource("gemini-release-notes"),
    getSource("gemini-blog"),
    getSource("perplexity-comet"),
    getSource("perplexity-blog"),
  ];
  const benchmarkSources = [
    getSource("scale-swebench-pro"),
    getSource("livebench"),
    getSource("lmarena"),
    getSource("artificial-analysis"),
    getSource("llm-stats"),
  ];
  const openaiBaselineSource = getSource("openai-baseline");
  const communitySource = getSource("community-buzz");
  const promptNames = Array.from(
    new Set([...SOURCE_REGISTRY.map((source) => sourceIdToAgentName(source.id)), "report-writer", "strategy-writer"]),
  );

  const prompts = await Promise.all(
    promptNames.map(async (name) => ({
      name,
      contents: await loadPrompt(name),
    })),
  );

  const sampleBatch = args.monitorBatches.find((batch) => batch.signals.length > 0) ?? args.monitorBatches[0];
  const degradedSources = args.sourceHealth.filter((source) => source.collectionMode !== "live");
  const latestRunMode =
    degradedSources.length === 0
      ? "live"
      : degradedSources.some((source) => source.collectionMode === "fallback")
        ? "partial-live"
        : "fixture-or-degraded";
  const officialInputSummary = officialSources
    .map((source) => `\`${source.label}\` via ${source.urls.map((url) => `\`${url}\``).join(", ")}`)
    .join("; ");
  const benchmarkInputSummary = benchmarkSources
    .map((source) => `\`${source.label}\` via ${source.urls.map((url) => `\`${url}\``).join(", ")}`)
    .join("; ");
  const baselineInputSummary = `\`${openaiBaselineSource.label}\` via ${openaiBaselineSource.urls
    .map((url) => `\`${url}\``)
    .join(", ")}`;
  const communityRepoSummary = communitySource.githubRepos?.map((repo) => `\`${repo}\``).join(", ") ?? "none";
  const communitySubredditSummary = communitySource.subreddits?.map((subreddit) => `r/${subreddit}`).join(", ") ?? "none";
  const communityUrlSummary = communitySource.urls.map((url) => `\`${url}\``).join(", ");

  return `# Submission

Repository: ${repoUrl}

## 1. Company and Strategic Context

OpenAI is the selected company. It operates in the frontier AI industry with a business model spanning API usage, subscriptions, and enterprise offerings; the key competitors in scope are Anthropic, Google Gemini, and Perplexity, and the internal stakeholder is Product Strategy leadership.

## 2. Agent Prompt

The system uses multiple specialized prompts because each source bundle is handled by a separate agent. The full prompts are below.

${prompts
  .map(
    (prompt) => `### ${prompt.name}

\`\`\`text
${prompt.contents.trim()}
\`\`\``,
  )
  .join("\n\n")}

## 3. Technologies Used

- OpenAI Agents SDK with \`gpt-5.4-nano\`: selected because the system is a constrained multi-agent workflow with typed tools and structured outputs, so the SDK provides the runtime for monitor agents, the raw report writer, and the strategy writer without building custom orchestration glue.
- OpenAI Evals API: selected because each prompt and extraction path can regress independently; the eval layer gives repeatable JSONL-based checks instead of subjective spot checks.
- Next.js App Router on Vercel: selected because the project needs a simple deployable web and API surface, and App Router provides the cron endpoint with minimal infrastructure overhead.
- Vercel Cron Jobs: selected because the monitoring cadence is daily and deterministic, so a managed scheduler is simpler than maintaining a separate worker or queue system.
- Vercel Blob: selected because the generated markdown artifacts need lightweight object storage in production without adding a separate storage service.
- Vercel Postgres: selected because snapshots, runs, signals, benchmark rows, and eval registry metadata are relational and need persistence across runs.
- Firecrawl HTTP API: selected for JS-heavy, layout-fragile, or weakly structured pages where native HTTP fetch frequently misses the main content or benchmark table.
- Native \`fetch\` plus Cheerio: selected as the default low-cost path for stable HTML, JSON, XML/RSS, Reddit feeds, GitHub APIs, and deterministic normalization.
- GitHub REST API and Reddit JSON feeds: selected because they provide lightweight structured community and momentum signals without requiring browser automation.
- Vitest: selected to cover parser logic, contracts, and end-to-end pipeline behavior before shipping prompt or collector changes.

## 4. Inputs

- Official competitor inputs: ${officialInputSummary}. These are collected daily and are primarily unstructured or semi-structured HTML/markdown pages.
- Benchmark inputs: ${benchmarkInputSummary}. These are collected daily and are mostly semi-structured tables or leaderboard pages.
- Community inputs: Reddit JSON feeds from ${communitySubredditSummary} using ${communityUrlSummary}, plus GitHub repository metrics for ${communityRepoSummary}. These are collected daily; the transport is structured JSON, but the post titles and comments are unstructured text.
- OpenAI baseline inputs: ${baselineInputSummary}. These are collected daily and mix structured API JSON, semi-structured RSS/XML, and unstructured documentation content.
- Preprocessing: each source bundle is normalized into a consistent text payload, content-hashed, compared against the previous stored snapshot, and annotated with source metadata before any model analysis runs.
- Change gating: only changed bundles are sent to the monitor agents; unchanged bundles generate a deterministic no-change batch instead of consuming another model pass.
- Extraction strategy: Firecrawl is the first-choice collector for Claude Code changelog, Gemini release notes, Scale SWE-bench Pro, LLM Stats, and the OpenAI API docs changelog, while native \`fetch\` remains the primary path for RSS, APIs, Reddit, GitHub, and stable HTML sources.
- Failure handling: when a live fetch fails, the pipeline records the run as partial, preserves the collection error in source health metadata, and avoids inventing substitute competitor findings.

## 5. Outputs

- Primary raw output: \`raw-intel/<YYYY-MM-DD>.md\`
- Primary strategy output: \`strategy-brief/<YYYY-MM-DD>.md\`
- Monitor-batch schema: \`agent_name\`, \`source_id\`, \`source_label\`, \`competitor\`, \`is_material\`, \`executive_summary\`, \`signals[]\`, \`benchmark_snapshots[]\`, \`repo_metrics[]\`, and \`notes[]\`
- Signal schema: \`id\`, \`run_date\`, \`competitor\`, \`source_name\`, \`source_url\`, \`signal_type\`, \`headline\`, \`summary\`, \`evidence[]\`, \`published_at\`, \`strategic_relevance\`, \`confidence\`, and \`status\`
- Strategy-brief schema: \`run_date\`, \`headline\`, \`top_trends[]\`, \`openai_strengths[]\`, \`openai_exposures[]\`, \`recommended_actions[]\`, \`risk_score\`, \`confidence\`, and \`supporting_evidence[]\`
- Intended frequency of reporting: daily
- Intended consumer of the output: Product Strategy leadership at OpenAI
- Confidence scoring: yes, at the signal level and the final strategy-brief level
- Run health visibility: the API result and markdown outputs explicitly flag fixture-mode or failed-live-collection sources, and source metadata records \`fetch_provider\`, \`parse_mode\`, and \`fallback_reason\`

Real sample structured output from the latest ${latestRunMode} run on ${args.runDate}:

\`\`\`json
${JSON.stringify(sampleBatch, null, 2)}
\`\`\`

Sample raw markdown output:

\`\`\`markdown
${args.rawReportMarkdown.trim()}
\`\`\`

## 6. Knowledge Sources Used

- Persistent knowledge base: stored source snapshots, prior raw reports, prior strategy briefs, run records, and eval registry entries
- Historical competitor data: stored monitor batches, signal history, benchmark snapshots, and GitHub repo metrics from previous runs
- Stored company context: the OpenAI baseline bundle, which captures current public lineup, pricing, and announcement context for relative comparison
- Industry benchmarks: Scale SWE-bench Pro, LiveBench, LMSYS Arena, Artificial Analysis, and LLM Stats
- Internal strategy assumptions encoded in the prompts: rumor-only evidence should stay low confidence, benchmark ambiguity should be surfaced instead of guessed, and the audience is Product Strategy rather than press or marketing
- Current-run collection context: ${degradedSources.length === 0 ? "all monitored sources were collected live in the sampled run" : degradedSources.map((source) => `${source.sourceLabel} (${source.collectionMode}, ${source.fetchProvider}/${source.parseMode}${source.fallbackReason ? `: ${source.fallbackReason}` : ""})`).join("; ")}

## 8. Tools the Agent Has Access To

- \`load_source_bundle\`: returns the current normalized source payload, evidence URLs, and snapshot metadata for one source. It is used by every source-monitor agent at the start of analysis. The agent uses it because it is the only tool exposed to retrieve the current source content. Failure mode: if upstream extraction was weak, the tool still returns a thin bundle and the model can under-call or over-call significance.
- \`load_previous_snapshot\`: returns the prior stored snapshot for the same source. It is used by source-monitor agents when they need to distinguish a genuinely new signal from unchanged repeated content. The agent uses it after reading the current bundle when change detection matters. Failure mode: the first observed run has no prior snapshot, so the comparison context is intentionally sparse.
- \`load_monitor_batches\`: returns all structured monitor outputs for the current run. It is used only by the raw report writer after the source monitors finish. The agent uses it because the report writer does not see raw collectors directly; it synthesizes only from structured monitor outputs. Failure mode: if an upstream monitor batch is low quality, the report writer inherits that weakness.
- \`load_raw_report\`: returns the full markdown raw intelligence report. It is used only by the strategy writer when converting the detailed report into an executive strategy memo. The agent uses it because the strategy layer is intentionally separated from source-level extraction. Failure mode: weak report structure or thin evidence in the raw report propagates into the strategy memo.
- Firecrawl collector: fetches and extracts markdown or primary content from JS-heavy and layout-fragile pages. It is used when a source is marked with \`preferred_fetch_provider: firecrawl\` in the registry. Tool selection is registry-driven rather than agent-decided. Failure mode: weak main-content extraction, missing tables, or anti-bot responses on unusual pages.
- Native HTML/JSON/RSS fetcher: performs direct HTTP fetches for stable pages, APIs, feeds, and deterministic HTML parsing. It is used by default when a source does not require Firecrawl-first extraction. Tool selection occurs from the source registry and parser mode, with native fetch preferred for lower cost and higher determinism. Failure mode: page markup changes can break selectors, and some sites may block automated requests.
- Reddit feed collector: fetches subreddit JSON feeds and converts them into structured community observations. It is used only for the community-buzz source. The pipeline uses it because Reddit already exposes structured JSON endpoints. Failure mode: speculation spikes can dominate the feed and create noisy sentiment.
- GitHub repo metrics collector: retrieves stars, forks, watchers, and issue counts for selected repositories. It is used only for the community-buzz source to measure developer momentum. The pipeline uses it when a source definition includes \`githubRepos\`. Failure mode: repo activity can reflect docs or SDK churn rather than true competitive product movement.
- Snapshot diffing and persistence layer: hashes normalized content, stores snapshots, and decides whether a source changed enough to warrant a new model pass. It is used before any monitor agent runs. The pipeline uses it to reduce redundant LLM calls and preserve historical comparisons. Failure mode: small layout-only changes can still alter hashes, while semantically important changes can be missed if extraction quality is poor.
- Tool-selection policy: when multiple collection tools could in theory perform the same task, the source registry chooses the fetch provider and parse mode up front, and each agent receives only the tools required for its stage rather than a broad open-ended tool menu.

## 9. What the Agent Does Well

- It narrows scope to a realistic set of high-signal competitors and public evidence sources instead of pretending to cover the full market.
- It reduces cognitive load by converting raw pages, benchmark tables, Reddit threads, and repo metrics into structured monitor batches and then into two markdown artifacts tailored to Product Strategy.
- It outperforms manual monitoring on cadence and consistency because every source bundle is fetched, normalized, diffed, and analyzed the same way each day.
- Its structure improves clarity by separating factual source monitoring from the second-pass strategic interpretation and risk scoring.
- The eval layer gives explicit visibility into prompt regressions and extraction quality rather than relying on qualitative judgment alone.

## 10. Where the Agent Fails

- The system is brittle to third-party leaderboard markup changes because benchmark pages are not standardized. A concrete failure mode is that a changed leaderboard table layout can still fetch successfully but yield weak or incomplete row extraction.
- Community monitoring can overstate relevance if Reddit speculation spikes around an unconfirmed launch. To mitigate that, the strategy prompt and scoring rules explicitly cap rumor-only influence.
- Perplexity’s public web surface is less structured than a conventional changelog, so extracting clean launch deltas is harder than with a stable docs or release-note feed.
- The current production path depends on public web fetches and can fail or degrade when a source blocks automated requests, changes anti-bot behavior, or serves inconsistent markup.
- A concrete failure that was fixed during implementation: the earlier pipeline silently used fixture payloads when live fetches failed, which made reports look complete while containing synthetic findings. The fix was to mark such runs as partial, emit explicit collection-health warnings, and suppress fake fallback findings.

## Appendix: Strategy Brief Sample

\`\`\`markdown
${args.strategyMarkdown.trim()}
\`\`\`
`;
}
