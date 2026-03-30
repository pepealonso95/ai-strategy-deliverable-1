import { randomUUID } from "node:crypto";
import { createAgentRuntime } from "@/src/agents";
import { createStores } from "@/src/lib/storage";
import type { MonitorBatch, RunRecord } from "@/src/lib/types";
import { SOURCE_REGISTRY } from "@/src/sources/registry";
import { buildSourceBundle } from "@/src/sources/fetch";
import { buildCollectionFailureBatch, buildNoChangeBatch, sourceIdToAgentName } from "@/src/pipeline/helpers";
import { buildSubmissionMarkdown } from "@/src/pipeline/submission";

export type SourceHealth = {
  sourceId: string;
  sourceLabel: string;
  collectionMode: "live" | "fixture" | "fallback";
  fetchProvider: "native" | "firecrawl";
  parseMode: "html" | "markdown" | "table" | "feed";
  fallbackReason: string | null;
  changed: boolean;
};

export type PipelineResult = {
  runId: string;
  runDate: string;
  rawReportPath: string;
  strategyReportPath: string;
  summary: string;
  status: "completed" | "partial";
  usedFixtureMode: boolean;
  sourceHealth: SourceHealth[];
};

export async function runDailyIntelligencePipeline(): Promise<PipelineResult> {
  const { dataStore, artifactStore } = createStores();
  const runtime = createAgentRuntime();
  const runDate = new Date().toISOString().slice(0, 10);
  const runId = randomUUID();

  await dataStore.ensureSchema();

  const startedRun: RunRecord = {
    id: runId,
    run_date: runDate,
    status: "started",
    started_at: new Date().toISOString(),
    completed_at: null,
    summary: null,
  };
  await dataStore.saveRun(startedRun);

  try {
    const bundles = await Promise.all(SOURCE_REGISTRY.map((source) => buildSourceBundle(source.id, dataStore)));
    for (const bundle of bundles) {
      await dataStore.saveSnapshot(bundle.snapshot);
    }

    const monitorBatches = await Promise.all(
      bundles.map(async (bundle) => {
        if (bundle.collectionMode === "fallback") {
          return buildCollectionFailureBatch(bundle);
        }

        if (!bundle.changed && bundle.previousSnapshot) {
          return buildNoChangeBatch(bundle);
        }

        return runtime.runMonitorAgent(sourceIdToAgentName(bundle.source.id), {
          source: bundle.source,
          bundle: bundle.payload,
          snapshot: bundle.snapshot,
          previousSnapshot: bundle.previousSnapshot,
          runDate,
        });
      }),
    );

    await persistMonitorOutputs(dataStore, monitorBatches);

    const rawReport = await runtime.runReportWriter({
      runDate,
      monitorBatches,
    });

    const strategy = await runtime.runStrategyWriter({
      runDate,
      rawReportMarkdown: appendCollectionHealth(rawReport.markdown, bundles),
    });

    const rawMarkdown = appendCollectionHealth(rawReport.markdown, bundles);
    const strategyMarkdown = appendCollectionHealth(strategy.markdown, bundles, "## Collection health");

    const rawReportPath = await artifactStore.writeMarkdown(`raw-intel/${runDate}.md`, rawMarkdown);
    const strategyReportPath = await artifactStore.writeMarkdown(`strategy-brief/${runDate}.md`, strategyMarkdown);
    await artifactStore.writeMarkdown("raw-intel/latest.md", rawMarkdown);
    await artifactStore.writeMarkdown("strategy-brief/latest.md", strategyMarkdown);

    await dataStore.saveReport({
      run_date: runDate,
      report_type: "raw_intel",
      storage_path: rawReportPath,
      content: rawMarkdown,
    });
    await dataStore.saveReport({
      run_date: runDate,
      report_type: "strategy_brief",
      storage_path: strategyReportPath,
      content: strategyMarkdown,
    });
    await dataStore.saveStrategyBrief(strategy.brief);

    const sourceHealth = bundles.map<SourceHealth>((bundle) => ({
      sourceId: bundle.source.id,
      sourceLabel: bundle.source.label,
      collectionMode: bundle.collectionMode,
      fetchProvider: bundle.fetchProvider,
      parseMode: bundle.parseMode,
      fallbackReason: bundle.fallbackReason,
      changed: bundle.changed,
    }));
    const degradedSources = sourceHealth.filter((source) => source.collectionMode !== "live");
    const usedFixtureMode = degradedSources.length > 0;
    const status: PipelineResult["status"] = sourceHealth.some((source) => source.collectionMode === "fallback")
      ? "partial"
      : "completed";

    const submission = await buildSubmissionMarkdown({
      runDate,
      rawReportMarkdown: rawMarkdown,
      strategyMarkdown: strategyMarkdown,
      monitorBatches,
      sourceHealth,
    });
    await artifactStore.writeMarkdown("deliverables/submission.md", submission);

    const materialFindings = monitorBatches.filter((batch) => batch.is_material).length;
    const summary =
      status === "partial"
        ? `Partial run: ${materialFindings} monitored bundles produced material findings. ${degradedSources.length} source bundle(s) failed live collection.`
        : usedFixtureMode
          ? `Fixture run: ${materialFindings} monitored bundles produced material findings using synthetic test data.`
          : `${materialFindings} monitored bundles produced material findings.`;
    await dataStore.updateRun({
      ...startedRun,
      status,
      completed_at: new Date().toISOString(),
      summary,
    });

    return {
      runId,
      runDate,
      rawReportPath,
      strategyReportPath,
      summary,
      status,
      usedFixtureMode,
      sourceHealth,
    };
  } catch (error) {
    await dataStore.updateRun({
      ...startedRun,
      status: "failed",
      completed_at: new Date().toISOString(),
      summary: error instanceof Error ? error.message : "Unknown pipeline failure",
    });
    throw error;
  }
}

async function persistMonitorOutputs(dataStore: ReturnType<typeof createStores>["dataStore"], monitorBatches: MonitorBatch[]) {
  for (const batch of monitorBatches) {
    await dataStore.saveMonitorBatch(batch);
    await dataStore.saveSignals(batch.signals);
    await dataStore.saveBenchmarkSnapshots(batch.benchmark_snapshots);
    await dataStore.saveRepoMetrics(batch.repo_metrics);
  }
}

function appendCollectionHealth(
  markdown: string,
  bundles: Awaited<ReturnType<typeof buildSourceBundle>>[],
  heading = "## Collection health and caveats",
) {
  const degradedSources = bundles.filter((bundle) => bundle.collectionMode !== "live");
  if (degradedSources.length === 0) {
    return markdown;
  }

  const lines = degradedSources.map((bundle) => {
    if (bundle.collectionMode === "fixture") {
      return `- ${bundle.source.label}: fixture mode is enabled, so this source used synthetic test data instead of a live fetch. Expected extraction path: ${bundle.fetchProvider}/${bundle.parseMode}.`;
    }

    return `- ${bundle.source.label}: live fetch failed (${bundle.fallbackReason ?? "unknown error"}). Attempted extraction path: ${bundle.fetchProvider}/${bundle.parseMode}. No synthetic competitor findings were substituted for this source.`;
  });

  return `${markdown.trim()}\n\n${heading}\n\n${lines.join("\n")}\n`;
}
