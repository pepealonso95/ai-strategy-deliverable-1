import { rm } from "node:fs/promises";
import { runDailyIntelligencePipeline } from "@/src/pipeline/daily-intel";

async function main() {
  await rm(`${process.cwd()}/.local-store`, { recursive: true, force: true });
  const result = await runDailyIntelligencePipeline();
  console.log(JSON.stringify(result, null, 2));
}

void main();
