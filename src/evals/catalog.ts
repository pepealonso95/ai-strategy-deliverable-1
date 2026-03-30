import path from "node:path";
import { readFile } from "node:fs/promises";
import type OpenAI from "openai";
import type { EvalCreateParams } from "openai/resources/evals/evals";
import type { RunCreateParams, RunRetrieveResponse } from "openai/resources/evals/runs/runs";
import { parseJsonl } from "@/src/lib/jsonl";
import { getEnv } from "@/src/lib/env";
import { loadPrompt } from "@/src/lib/prompts";
import { createStores } from "@/src/lib/storage";
import type { MonitorBatch } from "@/src/lib/types";
import { sourceIdToAgentName } from "@/src/pipeline/helpers";

type BaseEvalSpec = {
  key: string;
  name: string;
  datasetPath: string;
  itemSchema: Record<string, unknown>;
  createParams: Omit<EvalCreateParams, "data_source_config" | "name">;
  buildRunDataSource: (items: unknown[]) => Promise<RunCreateParams["data_source"]>;
  precheck: (items: unknown[]) => Promise<string[]>;
};

type MonitorEvalItem = {
  run_date: string;
  source_id: string;
  source_label: string;
  competitor: string;
  bundle_summary: string;
  extracted_items: Array<Record<string, unknown>>;
  evidence_urls: string[];
  expected_materiality: boolean;
  expected_competitor: string;
  expected_signal_type: string;
};

type ReportEvalItem = {
  run_date: string;
  monitor_batches: MonitorBatch[];
  required_headings: string[];
};

type StrategyEvalItem = {
  run_date: string;
  raw_report_markdown: string;
  minimum_risk: number;
  maximum_risk: number;
  required_phrases: string[];
};

const sampleModel = getEnv().OPENAI_MODEL;

function modelGraderInstructions(gradingFocus: string) {
  return [
    {
      role: "system" as const,
      content:
        "You are grading an agent output. Score 1.0 only when the output fully satisfies the rubric, 0.7 when mostly correct, 0.4 when partially correct, and 0.0 when clearly incorrect.",
    },
    {
      role: "user" as const,
      content: `${gradingFocus}\n\nDataset item:\n{{item.dataset_item}}\n\nAgent output:\n{{sample.output_text}}`,
    },
  ];
}

function monitorEvalSpec(key: string, datasetPath: string, gradingFocus: string): BaseEvalSpec {
  return {
    key,
    name: key,
    datasetPath,
    itemSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        dataset_item: { type: "string" },
        expected_materiality: { type: "boolean" },
        expected_competitor: { type: "string" },
        expected_signal_type: { type: "string" },
      },
      required: ["dataset_item", "expected_materiality", "expected_competitor", "expected_signal_type"],
    },
    createParams: {
      testing_criteria: [
        {
          type: "score_model",
          name: `${key}-quality`,
          model: getEnv().OPENAI_EVAL_GRADER_MODEL,
          pass_threshold: 0.7,
          input: modelGraderInstructions(gradingFocus),
          range: [0, 1],
        },
      ],
    },
    async buildRunDataSource(items) {
      const instructions = await loadPrompt(sourceIdToAgentName((items as MonitorEvalItem[])[0]!.source_id));
      const content = (items as MonitorEvalItem[]).map((item) => ({
        item: {
          dataset_item: JSON.stringify(item),
          expected_materiality: item.expected_materiality,
          expected_competitor: item.expected_competitor,
          expected_signal_type: item.expected_signal_type,
          instructions,
          user_input: JSON.stringify(
            {
              run_date: item.run_date,
              source: {
                id: item.source_id,
                label: item.source_label,
                competitor: item.competitor,
                urls: item.evidence_urls,
              },
              bundle: {
                summary: item.bundle_summary,
                urls: item.evidence_urls,
                extracted_items: item.extracted_items,
              },
              previous_snapshot: null,
            },
            null,
            2,
          ),
        },
      }));

      return {
        type: "responses",
        source: {
          type: "file_content",
          content,
        },
        model: sampleModel,
        input_messages: {
          type: "template",
          template: [
            {
              role: "developer",
              content: "{{item.instructions}}",
            },
            {
              role: "user",
              content:
                "Analyze this source bundle and return the monitoring result as structured JSON.\n\n{{item.user_input}}",
            },
          ],
        },
      };
    },
    async precheck(items) {
      const warnings: string[] = [];
      for (const item of items as MonitorEvalItem[]) {
        if (!item.evidence_urls.length) {
          warnings.push(`${key}: ${item.source_id} is missing evidence URLs.`);
        }
      }
      return warnings;
    },
  };
}

export const EVAL_SPECS: BaseEvalSpec[] = [
  monitorEvalSpec(
    "anthropic-monitor-eval",
    "src/evals/datasets/anthropic-monitor.jsonl",
    "Check whether the monitor correctly identifies materiality, competitor identity, and strategically relevant official Anthropic changes without hallucinating unsupported claims.",
  ),
  monitorEvalSpec(
    "claude-code-changelog-monitor-eval",
    "src/evals/datasets/claude-code-changelog-monitor.jsonl",
    "Check whether the monitor correctly captures dated Claude Code release changes, model support updates, and developer-product implications without inventing roadmap claims.",
  ),
  monitorEvalSpec(
    "gemini-monitor-eval",
    "src/evals/datasets/gemini-monitor.jsonl",
    "Check whether the monitor correctly identifies concrete Gemini product or distribution changes and avoids vague Google branding language.",
  ),
  monitorEvalSpec(
    "gemini-release-notes-monitor-eval",
    "src/evals/datasets/gemini-release-notes-monitor.jsonl",
    "Check whether the monitor correctly extracts dated Gemini release-note entries, availability changes, and product rollout signals without exaggeration.",
  ),
  monitorEvalSpec(
    "perplexity-comet-monitor-eval",
    "src/evals/datasets/perplexity-comet-monitor.jsonl",
    "Check whether the monitor correctly captures Perplexity Comet browser workflow changes and does not exaggerate them.",
  ),
  monitorEvalSpec(
    "perplexity-blog-monitor-eval",
    "src/evals/datasets/perplexity-blog-monitor.jsonl",
    "Check whether the monitor correctly captures Perplexity blog product messaging or launch changes and does not exaggerate them.",
  ),
  monitorEvalSpec(
    "scale-swebench-pro-monitor-eval",
    "src/evals/datasets/scale-swebench-pro-monitor.jsonl",
    "Check whether the monitor extracts Scale SWE-bench Pro ranks and scores accurately and treats this as high-priority coding-benchmark evidence without inventing missing values.",
  ),
  monitorEvalSpec(
    "livebench-monitor-eval",
    "src/evals/datasets/livebench-monitor.jsonl",
    "Check whether the monitor extracts LiveBench ranking information accurately and stays factual when interpreting broad benchmark evidence.",
  ),
  monitorEvalSpec(
    "lmarena-monitor-eval",
    "src/evals/datasets/lmarena-monitor.jsonl",
    "Check whether the monitor handles LMSYS Arena ranking information carefully and does not fabricate preference metrics when the evidence is ambiguous.",
  ),
  monitorEvalSpec(
    "artificial-analysis-monitor-eval",
    "src/evals/datasets/artificial-analysis-monitor.jsonl",
    "Check whether the monitor extracts Artificial Analysis benchmark information accurately and treats it as supporting evidence rather than overclaiming.",
  ),
  monitorEvalSpec(
    "llm-stats-monitor-eval",
    "src/evals/datasets/llm-stats-monitor.jsonl",
    "Check whether the monitor safely handles index-like benchmark content, extracting supporting context while refusing to invent numeric benchmark movement.",
  ),
  monitorEvalSpec(
    "community-monitor-eval",
    "src/evals/datasets/community-monitor.jsonl",
    "Check whether the monitor separates speculation from confirmed evidence and appropriately down-weights rumor-heavy community chatter.",
  ),
  monitorEvalSpec(
    "openai-baseline-monitor-eval",
    "src/evals/datasets/openai-baseline-monitor.jsonl",
    "Check whether the monitor correctly summarizes the public OpenAI baseline without inventing private roadmap details.",
  ),
  {
    key: "report-writer-eval",
    name: "report-writer-eval",
    datasetPath: "src/evals/datasets/report-writer.jsonl",
    itemSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        dataset_item: { type: "string" },
      },
      required: ["dataset_item"],
    },
    createParams: {
      testing_criteria: [
        {
          type: "score_model",
          name: "report-writer-quality",
          model: getEnv().OPENAI_EVAL_GRADER_MODEL,
          pass_threshold: 0.7,
          input: modelGraderInstructions(
            "Grade whether the markdown report is complete, easy to scan, and preserves evidence and uncertainty from the structured monitor inputs.",
          ),
          range: [0, 1],
        },
      ],
    },
    async buildRunDataSource(items) {
      const instructions = await loadPrompt("report-writer");
      const content = (items as ReportEvalItem[]).map((item) => ({
        item: {
          dataset_item: JSON.stringify(item),
          instructions,
          user_input: JSON.stringify(
            {
              run_date: item.run_date,
              monitor_batches: item.monitor_batches,
            },
            null,
            2,
          ),
        },
      }));

      return {
        type: "responses",
        source: {
          type: "file_content",
          content,
        },
        model: sampleModel,
        input_messages: {
          type: "template",
          template: [
            {
              role: "developer",
              content: "{{item.instructions}}",
            },
            {
              role: "user",
              content: "Write the raw markdown intelligence report from these monitor batches.\n\n{{item.user_input}}",
            },
          ],
        },
      };
    },
    async precheck(items) {
      const warnings: string[] = [];
      for (const item of items as ReportEvalItem[]) {
        for (const heading of item.required_headings) {
          if (!heading.startsWith("##") && !heading.startsWith("#")) {
            warnings.push(`report-writer-eval: heading "${heading}" should be markdown formatted.`);
          }
        }
      }
      return warnings;
    },
  },
  {
    key: "strategy-writer-eval",
    name: "strategy-writer-eval",
    datasetPath: "src/evals/datasets/strategy-writer.jsonl",
    itemSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        dataset_item: { type: "string" },
      },
      required: ["dataset_item"],
    },
    createParams: {
      testing_criteria: [
        {
          type: "score_model",
          name: "strategy-writer-quality",
          model: getEnv().OPENAI_EVAL_GRADER_MODEL,
          pass_threshold: 0.7,
          input: modelGraderInstructions(
            "Grade whether the strategy memo separates fact from inference, provides practical recommendations, and assigns a justified risk score within the dataset bounds.",
          ),
          range: [0, 1],
        },
      ],
    },
    async buildRunDataSource(items) {
      const instructions = await loadPrompt("strategy-writer");
      const content = (items as StrategyEvalItem[]).map((item) => ({
        item: {
          dataset_item: JSON.stringify(item),
          instructions,
          user_input: JSON.stringify(
            {
              run_date: item.run_date,
              raw_report_markdown: item.raw_report_markdown,
              minimum_risk: item.minimum_risk,
              maximum_risk: item.maximum_risk,
            },
            null,
            2,
          ),
        },
      }));

      return {
        type: "responses",
        source: {
          type: "file_content",
          content,
        },
        model: sampleModel,
        input_messages: {
          type: "template",
          template: [
            {
              role: "developer",
              content: "{{item.instructions}}",
            },
            {
              role: "user",
              content: "Write the strategy brief from this raw report.\n\n{{item.user_input}}",
            },
          ],
        },
      };
    },
    async precheck(items) {
      const warnings: string[] = [];
      for (const item of items as StrategyEvalItem[]) {
        if (item.minimum_risk > item.maximum_risk) {
          warnings.push("strategy-writer-eval: minimum risk exceeds maximum risk.");
        }
      }
      return warnings;
    },
  },
  {
    key: "pipeline-e2e-eval",
    name: "pipeline-e2e-eval",
    datasetPath: "src/evals/datasets/pipeline-e2e.jsonl",
    itemSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        dataset_item: { type: "string" },
      },
      required: ["dataset_item"],
    },
    createParams: {
      testing_criteria: [
        {
          type: "score_model",
          name: "pipeline-e2e-quality",
          model: getEnv().OPENAI_EVAL_GRADER_MODEL,
          pass_threshold: 0.7,
          input: modelGraderInstructions(
            "Grade whether the paired raw report and strategy brief are internally consistent, preserve high-signal competitor changes, and avoid overreacting to rumor-only evidence.",
          ),
          range: [0, 1],
        },
      ],
    },
    async buildRunDataSource(items) {
      const instructions = await loadPrompt("strategy-writer");
      const content = (items as StrategyEvalItem[]).map((item) => ({
        item: {
          dataset_item: JSON.stringify(item),
          instructions,
          user_input: JSON.stringify(
            {
              run_date: item.run_date,
              raw_report_markdown: item.raw_report_markdown,
              minimum_risk: item.minimum_risk,
              maximum_risk: item.maximum_risk,
            },
            null,
            2,
          ),
        },
      }));

      return {
        type: "responses",
        source: {
          type: "file_content",
          content,
        },
        model: sampleModel,
        input_messages: {
          type: "template",
          template: [
            {
              role: "developer",
              content: "{{item.instructions}}",
            },
            {
              role: "user",
              content:
                "Treat this as an end-to-end strategic grading case and write the strategy brief from the supplied raw report.\n\n{{item.user_input}}",
            },
          ],
        },
      };
    },
    async precheck() {
      return [];
    },
  },
];

export async function loadEvalDataset<T>(datasetPath: string): Promise<T[]> {
  const fullPath = path.join(process.cwd(), datasetPath);
  const contents = await readFile(fullPath, "utf8");
  return parseJsonl<T>(contents);
}

export async function ensureEval(
  client: OpenAI,
  spec: BaseEvalSpec,
): Promise<{ evalId: string; warnings: string[] }> {
  const { dataStore } = createStores();
  await dataStore.ensureSchema();
  const registry = await dataStore.getEvalRegistry();
  const existing = registry[spec.key];

  const createOrUpdateParams: EvalCreateParams = {
    name: spec.name,
    data_source_config: {
      type: "custom",
      item_schema: spec.itemSchema,
      include_sample_schema: true,
    },
    ...spec.createParams,
  };

  let evalId: string;
  if (existing) {
    await client.evals.delete(existing.eval_id);
    const created = await client.evals.create(createOrUpdateParams);
    evalId = created.id;
  } else {
    const created = await client.evals.create(createOrUpdateParams);
    evalId = created.id;
  }

  await dataStore.saveEvalRegistryEntry({
    key: spec.key,
    eval_id: evalId,
    updated_at: new Date().toISOString(),
  });

  const dataset = await loadEvalDataset(spec.datasetPath);
  const warnings = await spec.precheck(dataset);
  return { evalId, warnings };
}

export async function runEvalSpec(
  client: OpenAI,
  spec: BaseEvalSpec,
  evalId: string,
): Promise<RunRetrieveResponse> {
  const dataset = await loadEvalDataset(spec.datasetPath);
  const dataSource = await spec.buildRunDataSource(dataset);
  const created = await client.evals.runs.create(evalId, {
    name: `${spec.key}-${new Date().toISOString()}`,
    data_source: dataSource,
  });

  let latest = await client.evals.runs.retrieve(created.id, { eval_id: evalId });
  const deadline = Date.now() + 60_000;

  while ((latest.status === "queued" || latest.status === "in_progress") && Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 2_000));
    latest = await client.evals.runs.retrieve(created.id, { eval_id: evalId });
  }

  return latest;
}
