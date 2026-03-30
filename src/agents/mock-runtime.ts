import type { CollectedSignal, MonitorBatch, RepoMetric, StrategyBrief } from "@/src/lib/types";
import { StrategyBriefSchema } from "@/src/lib/types";
import type {
  MonitorAgentContext,
  ReportWriterContext,
  ReportWriterOutput,
  StrategyWriterContext,
  StrategyWriterOutput,
} from "@/src/agents/types";
import type { MonitorAgentName } from "@/src/pipeline/helpers";

const BENCHMARK_MONITORS = new Set<MonitorAgentName>([
  "scale-swebench-pro-monitor",
  "livebench-monitor",
  "lmarena-monitor",
  "artificial-analysis-monitor",
  "llm-stats-monitor",
]);

export class MockAgentRuntime {
  async runMonitorAgent(name: MonitorAgentName, context: MonitorAgentContext): Promise<MonitorBatch> {
    const evidenceUrls = context.bundle.urls;
    const extracted = context.bundle.extracted_items;

    const benchmark_snapshots =
      BENCHMARK_MONITORS.has(name)
        ? extracted
            .filter((item) => "benchmark" in item)
            .map((item) => ({
              benchmark_name: String(item.benchmark),
              model_name: String(item.model),
              vendor: String(item.vendor),
              score: Number(item.score),
              rank: Number(item.rank),
              delta_vs_prior: null,
              captured_at: context.snapshot.fetched_at,
              source_url: evidenceUrls[0],
            }))
        : [];

    const repo_metrics: RepoMetric[] =
      name === "community-monitor"
        ? extracted
            .filter((item) => "repo" in item)
            .map((item) => ({
              repo: String(item.repo),
              stars: Number(item.stars ?? 0),
              forks: Number(item.forks ?? 0),
              open_issues: Number(item.open_issues ?? 0),
              watchers: Number(item.watchers ?? 0),
              captured_at: context.snapshot.fetched_at,
              source_url: evidenceUrls[0] ?? "https://github.com",
            }))
        : [];

    const inferCompetitor = (vendor: string): CollectedSignal["competitor"] => {
      if (vendor.toLowerCase().includes("openai")) {
        return "openai";
      }
      if (vendor.toLowerCase().includes("google") || vendor.toLowerCase().includes("gemini")) {
        return "gemini";
      }
      if (vendor.toLowerCase().includes("anthropic") || vendor.toLowerCase().includes("claude")) {
        return "anthropic";
      }
      if (vendor.toLowerCase().includes("perplexity")) {
        return "perplexity";
      }
      return "market";
    };

    const signals: CollectedSignal[] =
      BENCHMARK_MONITORS.has(name)
        ? benchmark_snapshots.slice(0, 3).map((row, index) => ({
            id: `${context.source.id}-${index}-${context.runDate}`,
            run_date: context.runDate,
            competitor: inferCompetitor(row.vendor),
            source_name: context.source.label,
            source_url: row.source_url,
            signal_type: "benchmark_shift",
            headline: `${row.benchmark_name}: ${row.vendor} ${row.model_name} at rank ${row.rank}`,
            summary: `${row.vendor} appears at rank ${row.rank} on ${row.benchmark_name} with a score of ${row.score}.`,
            evidence: [row.source_url],
            published_at: context.snapshot.fetched_at,
            strategic_relevance: row.rank <= 2 ? "high" : "medium",
            confidence: 0.72,
            status: "updated" as const,
          }))
        : extracted.slice(0, 2).map((item, index) => ({
            id: `${context.source.id}-${index}-${context.runDate}`,
            run_date: context.runDate,
            competitor: context.source.competitor,
            source_name: context.source.label,
            source_url: evidenceUrls[index] ?? evidenceUrls[0] ?? "https://example.com",
            signal_type:
              name === "community-monitor"
                ? "community_buzz"
                : BENCHMARK_MONITORS.has(name)
                  ? "benchmark_shift"
                  : "official_update",
            headline: String(item.heading ?? item.title ?? item.area ?? `Update ${index + 1}`),
            summary: String(item.detail ?? item.text ?? JSON.stringify(item)),
            evidence: evidenceUrls.length ? evidenceUrls : ["https://example.com"],
            published_at: context.snapshot.fetched_at,
            strategic_relevance: name === "community-monitor" ? "medium" : BENCHMARK_MONITORS.has(name) ? "medium" : "high",
            confidence: name === "community-monitor" ? 0.58 : BENCHMARK_MONITORS.has(name) ? 0.7 : 0.76,
            status: "updated" as const,
          }));

    return {
      agent_name: name,
      source_id: context.source.id,
      source_label: context.source.label,
      competitor: context.source.competitor,
      is_material: signals.length > 0,
      executive_summary: context.bundle.summary,
      signals,
      benchmark_snapshots,
      repo_metrics,
      notes: context.previousSnapshot
        ? [`Previous snapshot hash: ${context.previousSnapshot.content_hash.slice(0, 8)}`]
        : ["First observed snapshot for this source."],
    };
  }

  async runReportWriter(context: ReportWriterContext): Promise<ReportWriterOutput> {
    const sections = context.monitorBatches.map((batch) => {
      const signalLines =
        batch.signals.length === 0
          ? ["- No material changes detected."]
          : batch.signals.map(
              (signal) =>
                `- ${signal.headline} (${Math.round(signal.confidence * 100)}% confidence): ${signal.summary} Evidence: ${signal.evidence.join(", ")}`,
            );

      const noteLines = batch.notes.length === 0 ? [] : ["", ...batch.notes.map((note) => `- Note: ${note}`)];
      return [`## ${batch.source_label}`, "", batch.executive_summary, "", ...signalLines, ...noteLines].join("\n");
    });
    const sectionFor = (sourceId: string) => context.monitorBatches.find((batch) => batch.source_id === sourceId);
    const officialSourceIds = [
      "claude-code-changelog",
      "anthropic-news",
      "gemini-release-notes",
      "gemini-blog",
      "perplexity-comet",
      "perplexity-blog",
    ];
    const benchmarkSourceIds = ["scale-swebench-pro", "livebench", "lmarena", "artificial-analysis", "llm-stats"];
    const officialSections = context.monitorBatches
      .filter((batch) => officialSourceIds.includes(batch.source_id))
      .map((batch) => sections.find((section) => section.includes(`## ${batch.source_label}`))!)
      .join("\n\n");
    const leaderboardSection = benchmarkSourceIds
      .map((sourceId) => sectionFor(sourceId))
      .filter(Boolean)
      .map((batch) => sections.find((section) => section.includes(`## ${batch!.source_label}`))!)
      .join("\n\n");
    const communitySection =
      sections.find((section) => section.includes(`## ${sectionFor("community-buzz")?.source_label ?? ""}`)) ??
      "- No community movement detected.";
    const baselineSection =
      sections.find((section) => section.includes(`## ${sectionFor("openai-baseline")?.source_label ?? ""}`)) ??
      "- No baseline summary generated.";

    return {
      markdown: `# OpenAI Competitor Intelligence Report - ${context.runDate}

## Executive summary

- ${context.monitorBatches.filter((batch) => batch.is_material).length} monitored source bundles produced material findings.
- This report preserves official competitor updates, benchmark movement, community buzz, and OpenAI baseline context.

## Official competitor signals

${officialSections || "- No official competitor changes detected."}

## Leaderboard and benchmark overview

${leaderboardSection || "- No benchmark changes detected."}

## Community buzz

${communitySection}

## OpenAI baseline

${baselineSection}

## Confidence and caveats

- Reddit speculation is treated as lower-confidence than official announcements and benchmark tables.
- Leaderboard parsing is best-effort and may miss format changes on third-party sites.
`,
    };
  }

  async runStrategyWriter(context: StrategyWriterContext): Promise<StrategyWriterOutput> {
    const brief: StrategyBrief = StrategyBriefSchema.parse({
      run_date: context.runDate,
      headline: "OpenAI remains strong on broad product surface, but distribution and workflow UX pressure are increasing.",
      top_trends: [
        "Competitors continue packaging agentic workflows around official product surfaces.",
        "Benchmark leadership remains fragmented across coding, general reasoning, and public preference boards.",
        "Community attention is amplifying expectations for faster product iteration and developer tooling momentum.",
      ],
      openai_strengths: [
        "OpenAI retains a broad public lineup across API, ChatGPT, and multimodal offerings.",
        "Benchmark leadership remains competitive across important categories in the monitored bundle.",
      ],
      openai_exposures: [
        "Gemini can use Google distribution to normalize rapid feature rollout at scale.",
        "Perplexity is pushing browser-native execution narratives that may shape user expectations.",
      ],
      recommended_actions: [
        "Track browser and agent workflow UX expectations, not just model quality rankings.",
        "Watch benchmark categories where OpenAI leadership is narrow or unstable.",
        "Respond quickly when official competitor launches combine distribution with differentiated workflow utility.",
      ],
      risk_score: 47,
      confidence: 0.7,
      supporting_evidence: [
        "Official competitor announcement bundles",
        "Daily leaderboard bundle",
        "Community buzz bundle",
        "OpenAI public baseline bundle",
      ],
    });

    return {
      brief,
      markdown: `# OpenAI Strategy Brief - ${context.runDate}

## Headline

${brief.headline}

## What changed

- ${brief.top_trends.join("\n- ")}

## What OpenAI should focus on

- ${brief.recommended_actions.join("\n- ")}

## Defensive posture

- ${brief.openai_strengths.join("\n- ")}
- OpenAI exposures:
- ${brief.openai_exposures.join("\n- ")}

## Risk score and rationale

- Risk score: ${brief.risk_score}/100
- Confidence: ${Math.round(brief.confidence * 100)}%

## Supporting evidence

- ${brief.supporting_evidence.join("\n- ")}
`,
    };
  }
}
