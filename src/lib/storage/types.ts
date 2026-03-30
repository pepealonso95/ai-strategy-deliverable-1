import type {
  BenchmarkSnapshot,
  CollectedSignal,
  EvalRegistryEntry,
  MonitorBatch,
  RepoMetric,
  RunRecord,
  SourceSnapshot,
  StoredReport,
  StrategyBrief,
} from "@/src/lib/types";

export interface DataStore {
  ensureSchema(): Promise<void>;
  getLatestSnapshot(sourceId: string): Promise<SourceSnapshot | null>;
  saveSnapshot(snapshot: SourceSnapshot): Promise<void>;
  saveSignals(signals: CollectedSignal[]): Promise<void>;
  saveBenchmarkSnapshots(rows: BenchmarkSnapshot[]): Promise<void>;
  saveRepoMetrics(rows: RepoMetric[]): Promise<void>;
  saveRun(record: RunRecord): Promise<void>;
  updateRun(record: RunRecord): Promise<void>;
  saveReport(report: StoredReport): Promise<void>;
  saveMonitorBatch(batch: MonitorBatch): Promise<void>;
  saveStrategyBrief(brief: StrategyBrief): Promise<void>;
  getEvalRegistry(): Promise<Record<string, EvalRegistryEntry>>;
  saveEvalRegistryEntry(entry: EvalRegistryEntry): Promise<void>;
}

export interface ArtifactStore {
  writeMarkdown(relativePath: string, content: string): Promise<string>;
}
