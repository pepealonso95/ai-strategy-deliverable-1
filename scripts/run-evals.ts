import { getOpenAIClient } from "@/src/lib/openai";
import { createStores } from "@/src/lib/storage";
import { EVAL_SPECS, ensureEval, runEvalSpec } from "@/src/evals/catalog";

async function main() {
  const client = getOpenAIClient();
  const { dataStore, artifactStore } = createStores();
  await dataStore.ensureSchema();

  const lines: string[] = [`# Eval Summary`, ``, `Generated at ${new Date().toISOString()}`, ``];

  for (const spec of EVAL_SPECS) {
    const { evalId, warnings } = await ensureEval(client, spec);
    const result = await runEvalSpec(client, spec, evalId);

    lines.push(`## ${spec.key}`);
    lines.push(`- Eval ID: ${evalId}`);
    lines.push(`- Run ID: ${result.id}`);
    lines.push(`- Status: ${result.status}`);
    lines.push(`- Report URL: ${result.report_url}`);
    lines.push(`- Result counts: ${JSON.stringify(result.result_counts)}`);
    if (warnings.length) {
      lines.push(`- Local precheck warnings: ${warnings.join(" | ")}`);
    }
    lines.push("");
  }

  const markdown = lines.join("\n");
  await artifactStore.writeMarkdown("deliverables/eval-summary.md", markdown);
  await dataStore.saveReport({
    run_date: new Date().toISOString().slice(0, 10),
    report_type: "eval_summary",
    storage_path: "deliverables/eval-summary.md",
    content: markdown,
  });

  console.log(markdown);
}

void main();
