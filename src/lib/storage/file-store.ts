import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import type { ArtifactStore, DataStore } from "@/src/lib/storage/types";
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

type CollectionMap = {
  source_snapshots: SourceSnapshot[];
  signals: CollectedSignal[];
  benchmark_snapshots: BenchmarkSnapshot[];
  repo_metrics: RepoMetric[];
  runs: RunRecord[];
  reports: StoredReport[];
  monitor_batches: MonitorBatch[];
  strategy_briefs: StrategyBrief[];
  eval_registry: EvalRegistryEntry[];
};

const EMPTY_COLLECTIONS: CollectionMap = {
  source_snapshots: [],
  signals: [],
  benchmark_snapshots: [],
  repo_metrics: [],
  runs: [],
  reports: [],
  monitor_batches: [],
  strategy_briefs: [],
  eval_registry: [],
};

function resolveLocalStorePath() {
  if (process.env.VERCEL) {
    return path.join("/tmp", "openai-competitor-intelligence-agent", ".local-store");
  }

  return path.join(process.cwd(), ".local-store");
}

function resolveArtifactPath(relativePath: string) {
  if (process.env.VERCEL) {
    return path.join("/tmp", "openai-competitor-intelligence-agent", relativePath);
  }

  return path.join(process.cwd(), relativePath);
}

export class FileStore implements DataStore, ArtifactStore {
  constructor(private readonly basePath = resolveLocalStorePath()) {}

  async ensureSchema() {
    await mkdir(this.basePath, { recursive: true });
    for (const key of Object.keys(EMPTY_COLLECTIONS) as (keyof CollectionMap)[]) {
      const filePath = this.collectionPath(key);
      try {
        await readFile(filePath, "utf8");
      } catch {
        await writeFile(filePath, JSON.stringify(EMPTY_COLLECTIONS[key], null, 2), "utf8");
      }
    }
  }

  async getLatestSnapshot(sourceId: string) {
    const snapshots = await this.readCollection("source_snapshots");
    return (
      snapshots
        .filter((snapshot) => snapshot.source_id === sourceId)
        .sort((left, right) => right.fetched_at.localeCompare(left.fetched_at))[0] ?? null
    );
  }

  async saveSnapshot(snapshot: SourceSnapshot) {
    await this.appendUnique("source_snapshots", snapshot, (entry) => {
      return entry.source_id === snapshot.source_id && entry.content_hash === snapshot.content_hash;
    });
  }

  async saveSignals(signals: CollectedSignal[]) {
    await this.appendMany("signals", signals);
  }

  async saveBenchmarkSnapshots(rows: BenchmarkSnapshot[]) {
    await this.appendMany("benchmark_snapshots", rows);
  }

  async saveRepoMetrics(rows: RepoMetric[]) {
    await this.appendMany("repo_metrics", rows);
  }

  async saveRun(record: RunRecord) {
    await this.appendUnique("runs", record, (entry) => entry.id === record.id);
  }

  async updateRun(record: RunRecord) {
    const runs = await this.readCollection("runs");
    const updated = runs.map((run) => (run.id === record.id ? record : run));
    await this.writeCollection("runs", updated);
  }

  async saveReport(report: StoredReport) {
    await this.appendMany("reports", [report]);
  }

  async saveMonitorBatch(batch: MonitorBatch) {
    await this.appendMany("monitor_batches", [batch]);
  }

  async saveStrategyBrief(brief: StrategyBrief) {
    await this.appendMany("strategy_briefs", [brief]);
  }

  async getEvalRegistry() {
    const rows = await this.readCollection("eval_registry");
    return Object.fromEntries(rows.map((row) => [row.key, row]));
  }

  async saveEvalRegistryEntry(entry: EvalRegistryEntry) {
    const rows = await this.readCollection("eval_registry");
    const filtered = rows.filter((row) => row.key !== entry.key);
    filtered.push(entry);
    await this.writeCollection("eval_registry", filtered);
  }

  async writeMarkdown(relativePath: string, content: string) {
    const fullPath = resolveArtifactPath(relativePath);
    await mkdir(path.dirname(fullPath), { recursive: true });
    await writeFile(fullPath, content, "utf8");
    return fullPath;
  }

  private collectionPath(key: keyof CollectionMap) {
    return path.join(this.basePath, `${key}.json`);
  }

  private async readCollection<K extends keyof CollectionMap>(key: K): Promise<CollectionMap[K]> {
    try {
      const contents = await readFile(this.collectionPath(key), "utf8");
      return JSON.parse(contents) as CollectionMap[K];
    } catch {
      const fallback = EMPTY_COLLECTIONS[key];
      await this.writeCollection(key, fallback);
      return fallback;
    }
  }

  private async writeCollection<K extends keyof CollectionMap>(key: K, value: CollectionMap[K]) {
    await writeFile(this.collectionPath(key), JSON.stringify(value, null, 2), "utf8");
  }

  private async appendMany<K extends keyof CollectionMap>(key: K, rows: CollectionMap[K]) {
    if (!rows.length) {
      return;
    }

    const current = await this.readCollection(key);
    await this.writeCollection(key, [...current, ...rows] as CollectionMap[K]);
  }

  private async appendUnique<K extends keyof CollectionMap>(
    key: K,
    row: CollectionMap[K][number],
    predicate: (entry: CollectionMap[K][number]) => boolean,
  ) {
    const current = await this.readCollection(key);
    if (current.some(predicate as never)) {
      return;
    }

    await this.writeCollection(key, [...current, row] as CollectionMap[K]);
  }
}
