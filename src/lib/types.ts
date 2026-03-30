import { z } from "zod";

export const SourceKindSchema = z.enum([
  "official_site",
  "leaderboard",
  "reddit",
  "github_repo",
  "openai_baseline",
]);

export const CompetitorSchema = z.enum(["anthropic", "gemini", "perplexity", "openai", "market"]);
export const FetchProviderSchema = z.enum(["native", "firecrawl"]);
export const ParseModeSchema = z.enum(["html", "markdown", "table", "feed"]);

export const StrategicRelevanceSchema = z.enum(["low", "medium", "high"]);
export const RecordStatusSchema = z.enum(["new", "updated", "unchanged", "ignored"]);

export const SourceDefinitionSchema = z.object({
  id: z.string(),
  competitor: CompetitorSchema,
  label: z.string(),
  kind: SourceKindSchema,
  cadence: z.string(),
  urls: z.array(z.string().url()),
  notes: z.string().optional(),
  subreddits: z.array(z.string()).optional(),
  githubRepos: z.array(z.string()).optional(),
  monitoring_tier: z.enum(["primary", "secondary"]).optional(),
  preferred_fetch_provider: FetchProviderSchema.optional(),
  parse_mode: ParseModeSchema.optional(),
});

export const SourceSnapshotSchema = z.object({
  source_id: z.string(),
  source_label: z.string(),
  competitor: CompetitorSchema,
  kind: SourceKindSchema,
  fetched_at: z.string(),
  content_hash: z.string(),
  normalized_text: z.string(),
  metadata: z.record(z.string(), z.unknown()).default({}),
});

export const CollectedSignalSchema = z.object({
  id: z.string(),
  run_date: z.string(),
  competitor: CompetitorSchema,
  source_name: z.string(),
  source_url: z.string(),
  signal_type: z.string(),
  headline: z.string(),
  summary: z.string(),
  evidence: z.array(z.string()),
  published_at: z.string().nullable(),
  strategic_relevance: StrategicRelevanceSchema,
  confidence: z.number().min(0).max(1),
  status: RecordStatusSchema,
});

export const BenchmarkSnapshotSchema = z.object({
  benchmark_name: z.string(),
  model_name: z.string(),
  vendor: z.string(),
  score: z.number(),
  rank: z.number().int().nonnegative(),
  delta_vs_prior: z.number().nullable(),
  captured_at: z.string(),
  source_url: z.string(),
});

export const RepoMetricSchema = z.object({
  repo: z.string(),
  stars: z.number().int().nonnegative(),
  forks: z.number().int().nonnegative(),
  open_issues: z.number().int().nonnegative(),
  watchers: z.number().int().nonnegative(),
  captured_at: z.string(),
  source_url: z.string(),
});

export const MonitorBatchSchema = z.object({
  agent_name: z.string(),
  source_id: z.string(),
  source_label: z.string(),
  competitor: CompetitorSchema,
  is_material: z.boolean(),
  executive_summary: z.string(),
  signals: z.array(CollectedSignalSchema).default([]),
  benchmark_snapshots: z.array(BenchmarkSnapshotSchema).default([]),
  repo_metrics: z.array(RepoMetricSchema).default([]),
  notes: z.array(z.string()).default([]),
});

export const StrategyBriefSchema = z.object({
  run_date: z.string(),
  headline: z.string(),
  top_trends: z.array(z.string()),
  openai_strengths: z.array(z.string()),
  openai_exposures: z.array(z.string()),
  recommended_actions: z.array(z.string()),
  risk_score: z.number().int().min(1).max(100),
  confidence: z.number().min(0).max(1),
  supporting_evidence: z.array(z.string()),
});

export const RunRecordSchema = z.object({
  id: z.string(),
  run_date: z.string(),
  status: z.enum(["started", "completed", "partial", "failed"]),
  started_at: z.string(),
  completed_at: z.string().nullable(),
  summary: z.string().nullable(),
});

export const StoredReportSchema = z.object({
  run_date: z.string(),
  report_type: z.enum(["raw_intel", "strategy_brief", "eval_summary"]),
  storage_path: z.string(),
  content: z.string(),
});

export const EvalRegistryEntrySchema = z.object({
  key: z.string(),
  eval_id: z.string(),
  updated_at: z.string(),
});

export type SourceDefinition = z.infer<typeof SourceDefinitionSchema>;
export type SourceSnapshot = z.infer<typeof SourceSnapshotSchema>;
export type CollectedSignal = z.infer<typeof CollectedSignalSchema>;
export type BenchmarkSnapshot = z.infer<typeof BenchmarkSnapshotSchema>;
export type RepoMetric = z.infer<typeof RepoMetricSchema>;
export type MonitorBatch = z.infer<typeof MonitorBatchSchema>;
export type StrategyBrief = z.infer<typeof StrategyBriefSchema>;
export type RunRecord = z.infer<typeof RunRecordSchema>;
export type StoredReport = z.infer<typeof StoredReportSchema>;
export type EvalRegistryEntry = z.infer<typeof EvalRegistryEntrySchema>;
export type FetchProvider = z.infer<typeof FetchProviderSchema>;
export type ParseMode = z.infer<typeof ParseModeSchema>;
