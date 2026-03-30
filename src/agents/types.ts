import { z } from "zod";
import type { MonitorBatch, SourceDefinition, SourceSnapshot } from "@/src/lib/types";
import { MonitorBatchSchema, StrategyBriefSchema } from "@/src/lib/types";
import type { SourceBundle } from "@/src/sources/types";

export type MonitorAgentContext = {
  source: SourceDefinition;
  bundle: SourceBundle["payload"];
  snapshot: SourceSnapshot;
  previousSnapshot: SourceSnapshot | null;
  runDate: string;
};

export const ReportWriterOutputSchema = z.object({
  markdown: z.string(),
});

export type ReportWriterOutput = z.infer<typeof ReportWriterOutputSchema>;

export type ReportWriterContext = {
  runDate: string;
  monitorBatches: MonitorBatch[];
};

export const StrategyWriterOutputSchema = z.object({
  markdown: z.string(),
  brief: StrategyBriefSchema,
});

export type StrategyWriterOutput = z.infer<typeof StrategyWriterOutputSchema>;

export type StrategyWriterContext = {
  runDate: string;
  rawReportMarkdown: string;
};

export const MonitorOutputSchema = MonitorBatchSchema;
