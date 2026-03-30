import { existsSync } from "node:fs";
import { rm } from "node:fs/promises";
import { beforeAll, describe, expect, it } from "vitest";
import { runDailyIntelligencePipeline } from "@/src/pipeline/daily-intel";

describe("daily intelligence pipeline", () => {
  beforeAll(() => {
    process.env.PIPELINE_USE_FIXTURES = "1";
  });

  it("runs end to end in fixture mode and writes markdown artifacts", async () => {
    await rm(`${process.cwd()}/.local-store`, { recursive: true, force: true });
    const result = await runDailyIntelligencePipeline();

    expect(result.usedFixtureMode).toBe(true);
    expect(result.status).toBe("completed");
    expect(result.summary).toContain("material findings");
    expect(result.summary).toContain("Fixture run");
    expect(result.sourceHealth.every((source) => source.collectionMode === "fixture")).toBe(true);
    expect(existsSync(`${process.cwd()}/deliverables/submission.md`)).toBe(true);
    expect(existsSync(`${process.cwd()}/raw-intel/latest.md`)).toBe(true);
    expect(existsSync(`${process.cwd()}/strategy-brief/latest.md`)).toBe(true);
  });
});
