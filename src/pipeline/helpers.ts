import type { MonitorBatch } from "@/src/lib/types";
import type { SourceBundle } from "@/src/sources/types";

export const SOURCE_AGENT_MAP = {
  "anthropic-news": "anthropic-monitor",
  "claude-code-changelog": "claude-code-changelog-monitor",
  "gemini-blog": "gemini-monitor",
  "gemini-release-notes": "gemini-release-notes-monitor",
  "perplexity-comet": "perplexity-comet-monitor",
  "perplexity-blog": "perplexity-blog-monitor",
  "scale-swebench-pro": "scale-swebench-pro-monitor",
  livebench: "livebench-monitor",
  lmarena: "lmarena-monitor",
  "artificial-analysis": "artificial-analysis-monitor",
  "llm-stats": "llm-stats-monitor",
  "community-buzz": "community-monitor",
  "openai-baseline": "openai-baseline-monitor",
} as const;

export type MonitorAgentName = (typeof SOURCE_AGENT_MAP)[keyof typeof SOURCE_AGENT_MAP];

export function sourceIdToAgentName(sourceId: string): MonitorAgentName {
  const name = SOURCE_AGENT_MAP[sourceId as keyof typeof SOURCE_AGENT_MAP];
  if (!name) {
    throw new Error(`No agent mapping defined for ${sourceId}`);
  }

  return name;
}

export function buildNoChangeBatch(bundle: SourceBundle): MonitorBatch {
  return {
    agent_name: sourceIdToAgentName(bundle.source.id),
    source_id: bundle.source.id,
    source_label: bundle.source.label,
    competitor: bundle.source.competitor,
    is_material: false,
    executive_summary:
      bundle.collectionMode === "fixture"
        ? "Fixture mode is enabled for this source. No content delta was detected against the previous synthetic snapshot."
        : "No content delta was detected against the previous snapshot.",
    signals: [],
    benchmark_snapshots: [],
    repo_metrics: [],
    notes: [
      "Skipped model analysis because the normalized content hash did not change.",
      `Extraction provenance: ${bundle.fetchProvider}/${bundle.parseMode}.`,
      ...(bundle.fallbackReason ? [`Fallback note: ${bundle.fallbackReason}`] : []),
      ...(bundle.collectionMode === "fixture" ? ["This source is currently using synthetic fixture data."] : []),
    ],
  };
}

export function buildCollectionFailureBatch(bundle: SourceBundle): MonitorBatch {
  const fallbackReason = bundle.fallbackReason ?? "unknown live fetch failure";
  return {
    agent_name: sourceIdToAgentName(bundle.source.id),
    source_id: bundle.source.id,
    source_label: bundle.source.label,
    competitor: bundle.source.competitor,
    is_material: false,
    executive_summary: `Live collection failed for ${bundle.source.label}. This section contains no competitor findings for this run.`,
    signals: [],
    benchmark_snapshots: [],
    repo_metrics: [],
    notes: [
      `Live fetch failed: ${fallbackReason}`,
      `Attempted extraction provenance: ${bundle.fetchProvider}/${bundle.parseMode}.`,
      "No synthetic findings were emitted for this source in live mode.",
    ],
  };
}
