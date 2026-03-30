import { describe, expect, it } from "vitest";
import { MockAgentRuntime } from "@/src/agents/mock-runtime";
import { MonitorBatchSchema } from "@/src/lib/types";
import { ReportWriterOutputSchema, StrategyWriterOutputSchema } from "@/src/agents/types";

describe("agent output contracts", () => {
  const runtime = new MockAgentRuntime();

  it("returns monitor outputs that satisfy the monitor schema", async () => {
    const batch = await runtime.runMonitorAgent("anthropic-monitor", {
      runDate: "2026-03-29",
      source: {
        id: "anthropic-news",
        competitor: "anthropic",
        label: "Anthropic official announcements",
        kind: "official_site",
        cadence: "daily",
        urls: ["https://www.anthropic.com/news"],
      },
      bundle: {
        summary: "Anthropic expands enterprise messaging.",
        urls: ["https://www.anthropic.com/news"],
        extracted_items: [{ heading: "Claude Enterprise workflow update", detail: "Expanded enterprise messaging." }],
      },
      snapshot: {
        source_id: "anthropic-news",
        source_label: "Anthropic official announcements",
        competitor: "anthropic",
        kind: "official_site",
        fetched_at: "2026-03-29T00:00:00.000Z",
        content_hash: "abc",
        normalized_text: "Anthropic expands enterprise messaging.",
        metadata: {},
      },
      previousSnapshot: null,
    });

    expect(MonitorBatchSchema.parse(batch).signals.length).toBeGreaterThan(0);
  });

  it("returns benchmark monitor outputs that satisfy the monitor schema", async () => {
    const batch = await runtime.runMonitorAgent("scale-swebench-pro-monitor", {
      runDate: "2026-03-29",
      source: {
        id: "scale-swebench-pro",
        competitor: "market",
        label: "Scale SWE-bench Pro public leaderboard",
        kind: "leaderboard",
        cadence: "daily",
        urls: ["https://labs.scale.com/leaderboard/swe_bench_pro_public"],
      },
      bundle: {
        summary: "Scale leaderboard rows.",
        urls: ["https://labs.scale.com/leaderboard/swe_bench_pro_public"],
        extracted_items: [{ benchmark: "Scale SWE-bench Pro", rank: 1, vendor: "OpenAI", model: "GPT-5.4", score: 74.2 }],
      },
      snapshot: {
        source_id: "scale-swebench-pro",
        source_label: "Scale SWE-bench Pro public leaderboard",
        competitor: "market",
        kind: "leaderboard",
        fetched_at: "2026-03-29T00:00:00.000Z",
        content_hash: "def",
        normalized_text: "Scale leaderboard rows.",
        metadata: {},
      },
      previousSnapshot: null,
    });

    expect(MonitorBatchSchema.parse(batch).benchmark_snapshots.length).toBeGreaterThan(0);
  });

  it("returns writer outputs with the expected schema", async () => {
    const report = await runtime.runReportWriter({
      runDate: "2026-03-29",
      monitorBatches: [],
    });

    const strategy = await runtime.runStrategyWriter({
      runDate: "2026-03-29",
      rawReportMarkdown: "# Raw report",
    });

    expect(ReportWriterOutputSchema.parse(report).markdown).toContain("# OpenAI Competitor Intelligence Report");
    expect(StrategyWriterOutputSchema.parse(strategy).brief.risk_score).toBeGreaterThan(0);
  });
});
