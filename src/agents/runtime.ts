import { Agent, run, tool } from "@openai/agents";
import { z } from "zod";
import { getEnv } from "@/src/lib/env";
import { loadPrompt } from "@/src/lib/prompts";
import {
  CollectedSignalSchema,
  MonitorBatchSchema,
  RepoMetricSchema,
  StrategyBriefSchema,
} from "@/src/lib/types";
import type { MonitorBatch } from "@/src/lib/types";
import type {
  MonitorAgentContext,
  ReportWriterContext,
  ReportWriterOutput,
  StrategyWriterContext,
  StrategyWriterOutput,
} from "@/src/agents/types";
import { ReportWriterOutputSchema, StrategyWriterOutputSchema } from "@/src/agents/types";
import type { MonitorAgentName } from "@/src/pipeline/helpers";

function makeLoadSourceBundleTool() {
  return tool({
    name: "load_source_bundle",
    description: "Load the current normalized source bundle for this agent, including extracted items and evidence URLs.",
    parameters: z.object({}).strict(),
    strict: true,
    execute: async (_input, runContext) => {
      if (!runContext) {
        throw new Error("Run context is required for load_source_bundle.");
      }
      const context = runContext.context as MonitorAgentContext;
      return JSON.stringify(
        {
          run_date: context.runDate,
          source: context.source,
          bundle: context.bundle,
          snapshot: context.snapshot,
        },
        null,
        2,
      );
    },
  });
}

function makeLoadPreviousSnapshotTool() {
  return tool({
    name: "load_previous_snapshot",
    description: "Load the prior snapshot for this source so you can compare for changes.",
    parameters: z.object({}).strict(),
    strict: true,
    execute: async (_input, runContext) => {
      if (!runContext) {
        throw new Error("Run context is required for load_previous_snapshot.");
      }
      const context = runContext.context as MonitorAgentContext;
      return JSON.stringify(
        {
          previous_snapshot: context.previousSnapshot,
        },
        null,
        2,
      );
    },
  });
}

function makeLoadMonitorBatchesTool() {
  return tool({
    name: "load_monitor_batches",
    description: "Load all structured monitor outputs for the current run.",
    parameters: z.object({}).strict(),
    strict: true,
    execute: async (_input, runContext) => {
      if (!runContext) {
        throw new Error("Run context is required for load_monitor_batches.");
      }
      const context = runContext.context as ReportWriterContext;
      return JSON.stringify(
        {
          run_date: context.runDate,
          monitor_batches: context.monitorBatches,
        },
        null,
        2,
      );
    },
  });
}

function makeLoadRawReportTool() {
  return tool({
    name: "load_raw_report",
    description: "Load the raw markdown intelligence report for strategic interpretation.",
    parameters: z.object({}).strict(),
    strict: true,
    execute: async (_input, runContext) => {
      if (!runContext) {
        throw new Error("Run context is required for load_raw_report.");
      }
      const context = runContext.context as StrategyWriterContext;
      return context.rawReportMarkdown;
    },
  });
}

function buildMonitorAgent(name: MonitorAgentName, instructions: string) {
  const model = getEnv().OPENAI_MODEL;
  return new Agent<MonitorAgentContext, typeof MonitorBatchSchema>({
    name,
    model,
    instructions,
    tools: [makeLoadSourceBundleTool(), makeLoadPreviousSnapshotTool()],
    outputType: MonitorBatchSchema,
  });
}

export class OpenAIAgentRuntime {
  private monitorAgents = new Map<MonitorAgentName, Promise<Agent<MonitorAgentContext, typeof MonitorBatchSchema>>>();
  private reportWriter?: Promise<Agent<ReportWriterContext, typeof ReportWriterOutputSchema>>;
  private strategyWriter?: Promise<Agent<StrategyWriterContext, typeof StrategyWriterOutputSchema>>;

  async runMonitorAgent(name: MonitorAgentName, context: MonitorAgentContext): Promise<MonitorBatch> {
    const agent = await this.getMonitorAgent(name);
    const result = await run(agent, "Load the source bundle, compare against the previous snapshot, and produce the monitoring output.", {
      context,
      maxTurns: 6,
    });

    if (!result.finalOutput) {
      throw new Error(`No final output produced for ${name}`);
    }

    const output = MonitorBatchSchema.parse(result.finalOutput);

    if (name === "community-monitor") {
      output.signals = output.signals.map((signal) =>
        CollectedSignalSchema.parse({
          ...signal,
          confidence: Math.min(signal.confidence, 0.65),
        }),
      );
      output.repo_metrics = output.repo_metrics.map((metric) => RepoMetricSchema.parse(metric));
    }

    return output;
  }

  async runReportWriter(context: ReportWriterContext): Promise<ReportWriterOutput> {
    const agent = await this.getReportWriter();
    const result = await run(agent, "Load the structured monitor outputs and write the raw markdown intelligence report.", {
      context,
      maxTurns: 5,
    });

    if (!result.finalOutput) {
      throw new Error("No raw report output produced.");
    }

    return ReportWriterOutputSchema.parse(result.finalOutput);
  }

  async runStrategyWriter(context: StrategyWriterContext): Promise<StrategyWriterOutput> {
    const agent = await this.getStrategyWriter();
    const result = await run(agent, "Load the raw report and write the strategic summary for OpenAI Product Strategy.", {
      context,
      maxTurns: 5,
    });

    if (!result.finalOutput) {
      throw new Error("No strategy brief output produced.");
    }

    const parsed = StrategyWriterOutputSchema.parse(result.finalOutput);
    parsed.brief = StrategyBriefSchema.parse({
      ...parsed.brief,
      risk_score: clampRiskScore(parsed.brief.risk_score),
    });
    return parsed;
  }

  private async getMonitorAgent(name: MonitorAgentName) {
    if (!this.monitorAgents.has(name)) {
      const promptName = name;
      this.monitorAgents.set(
        name,
        loadPrompt(promptName).then((instructions) => buildMonitorAgent(name, instructions)),
      );
    }

    return this.monitorAgents.get(name)!;
  }

  private async getReportWriter() {
    if (!this.reportWriter) {
      this.reportWriter = loadPrompt("report-writer").then(
        (instructions) =>
          new Agent<ReportWriterContext, typeof ReportWriterOutputSchema>({
            name: "report-writer",
            model: getEnv().OPENAI_MODEL,
            instructions,
            tools: [makeLoadMonitorBatchesTool()],
            outputType: ReportWriterOutputSchema,
          }),
      );
    }

    return this.reportWriter;
  }

  private async getStrategyWriter() {
    if (!this.strategyWriter) {
      this.strategyWriter = loadPrompt("strategy-writer").then(
        (instructions) =>
          new Agent<StrategyWriterContext, typeof StrategyWriterOutputSchema>({
            name: "strategy-writer",
            model: getEnv().OPENAI_MODEL,
            instructions,
            tools: [makeLoadRawReportTool()],
            outputType: StrategyWriterOutputSchema,
          }),
      );
    }

    return this.strategyWriter;
  }
}

function clampRiskScore(score: number) {
  return Math.max(1, Math.min(100, Math.round(score)));
}
