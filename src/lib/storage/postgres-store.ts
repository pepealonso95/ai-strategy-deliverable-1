import { put } from "@vercel/blob";
import { sql } from "@vercel/postgres";
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

const SCHEMA_SQL = [
  `create table if not exists source_snapshots (
    source_id text not null,
    source_label text not null,
    competitor text not null,
    kind text not null,
    fetched_at text not null,
    content_hash text not null,
    normalized_text text not null,
    metadata jsonb not null default '{}'::jsonb,
    primary key (source_id, content_hash)
  )`,
  `create table if not exists signals (
    id text primary key,
    run_date text not null,
    competitor text not null,
    source_name text not null,
    source_url text not null,
    signal_type text not null,
    headline text not null,
    summary text not null,
    evidence jsonb not null,
    published_at text,
    strategic_relevance text not null,
    confidence double precision not null,
    status text not null
  )`,
  `create table if not exists benchmark_snapshots (
    benchmark_name text not null,
    model_name text not null,
    vendor text not null,
    score double precision not null,
    rank integer not null,
    delta_vs_prior double precision,
    captured_at text not null,
    source_url text not null
  )`,
  `create table if not exists repo_metrics (
    repo text not null,
    stars integer not null,
    forks integer not null,
    open_issues integer not null,
    watchers integer not null,
    captured_at text not null,
    source_url text not null
  )`,
  `create table if not exists runs (
    id text primary key,
    run_date text not null,
    status text not null,
    started_at text not null,
    completed_at text,
    summary text
  )`,
  `create table if not exists reports (
    run_date text not null,
    report_type text not null,
    storage_path text not null,
    content text not null
  )`,
  `create table if not exists monitor_batches (
    source_id text not null,
    source_label text not null,
    competitor text not null,
    agent_name text not null,
    is_material boolean not null,
    executive_summary text not null,
    payload jsonb not null
  )`,
  `create table if not exists strategy_briefs (
    run_date text primary key,
    payload jsonb not null
  )`,
  `create table if not exists eval_registry (
    key text primary key,
    eval_id text not null,
    updated_at text not null
  )`,
];

export class PostgresStore implements DataStore, ArtifactStore {
  async ensureSchema() {
    for (const statement of SCHEMA_SQL) {
      await sql.query(statement);
    }
  }

  async getLatestSnapshot(sourceId: string) {
    const result = await sql<SourceSnapshot>`
      select *
      from source_snapshots
      where source_id = ${sourceId}
      order by fetched_at desc
      limit 1
    `;
    return result.rows[0] ?? null;
  }

  async saveSnapshot(snapshot: SourceSnapshot) {
    await sql`
      insert into source_snapshots (
        source_id, source_label, competitor, kind, fetched_at, content_hash, normalized_text, metadata
      ) values (
        ${snapshot.source_id},
        ${snapshot.source_label},
        ${snapshot.competitor},
        ${snapshot.kind},
        ${snapshot.fetched_at},
        ${snapshot.content_hash},
        ${snapshot.normalized_text},
        ${JSON.stringify(snapshot.metadata)}
      )
      on conflict do nothing
    `;
  }

  async saveSignals(signals: CollectedSignal[]) {
    for (const signal of signals) {
      await sql`
        insert into signals (
          id, run_date, competitor, source_name, source_url, signal_type, headline, summary,
          evidence, published_at, strategic_relevance, confidence, status
        ) values (
          ${signal.id},
          ${signal.run_date},
          ${signal.competitor},
          ${signal.source_name},
          ${signal.source_url},
          ${signal.signal_type},
          ${signal.headline},
          ${signal.summary},
          ${JSON.stringify(signal.evidence)},
          ${signal.published_at},
          ${signal.strategic_relevance},
          ${signal.confidence},
          ${signal.status}
        )
        on conflict (id) do nothing
      `;
    }
  }

  async saveBenchmarkSnapshots(rows: BenchmarkSnapshot[]) {
    for (const row of rows) {
      await sql`
        insert into benchmark_snapshots (
          benchmark_name, model_name, vendor, score, rank, delta_vs_prior, captured_at, source_url
        ) values (
          ${row.benchmark_name},
          ${row.model_name},
          ${row.vendor},
          ${row.score},
          ${row.rank},
          ${row.delta_vs_prior},
          ${row.captured_at},
          ${row.source_url}
        )
      `;
    }
  }

  async saveRepoMetrics(rows: RepoMetric[]) {
    for (const row of rows) {
      await sql`
        insert into repo_metrics (repo, stars, forks, open_issues, watchers, captured_at, source_url)
        values (${row.repo}, ${row.stars}, ${row.forks}, ${row.open_issues}, ${row.watchers}, ${row.captured_at}, ${row.source_url})
      `;
    }
  }

  async saveRun(record: RunRecord) {
    await sql`
      insert into runs (id, run_date, status, started_at, completed_at, summary)
      values (${record.id}, ${record.run_date}, ${record.status}, ${record.started_at}, ${record.completed_at}, ${record.summary})
      on conflict (id) do nothing
    `;
  }

  async updateRun(record: RunRecord) {
    await sql`
      update runs
      set status = ${record.status},
          completed_at = ${record.completed_at},
          summary = ${record.summary}
      where id = ${record.id}
    `;
  }

  async saveReport(report: StoredReport) {
    await sql`
      insert into reports (run_date, report_type, storage_path, content)
      values (${report.run_date}, ${report.report_type}, ${report.storage_path}, ${report.content})
    `;
  }

  async saveMonitorBatch(batch: MonitorBatch) {
    await sql`
      insert into monitor_batches (source_id, source_label, competitor, agent_name, is_material, executive_summary, payload)
      values (
        ${batch.source_id},
        ${batch.source_label},
        ${batch.competitor},
        ${batch.agent_name},
        ${batch.is_material},
        ${batch.executive_summary},
        ${JSON.stringify(batch)}
      )
    `;
  }

  async saveStrategyBrief(brief: StrategyBrief) {
    await sql`
      insert into strategy_briefs (run_date, payload)
      values (${brief.run_date}, ${JSON.stringify(brief)})
      on conflict (run_date)
      do update set payload = excluded.payload
    `;
  }

  async getEvalRegistry() {
    const result = await sql<EvalRegistryEntry>`select key, eval_id, updated_at from eval_registry`;
    return Object.fromEntries(result.rows.map((row) => [row.key, row]));
  }

  async saveEvalRegistryEntry(entry: EvalRegistryEntry) {
    await sql`
      insert into eval_registry (key, eval_id, updated_at)
      values (${entry.key}, ${entry.eval_id}, ${entry.updated_at})
      on conflict (key)
      do update set eval_id = excluded.eval_id, updated_at = excluded.updated_at
    `;
  }

  async writeMarkdown(relativePath: string, content: string) {
    const result = await put(relativePath, content, {
      access: "public",
      contentType: "text/markdown; charset=utf-8",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return result.url;
  }
}
