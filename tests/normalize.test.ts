import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { extractLeaderboardRows, parseHtmlDocument, parseMarkdownDocument } from "@/src/sources/normalize";

describe("parseHtmlDocument", () => {
  it("extracts title, text, and table rows from html", async () => {
    const html = await readFile(path.join(process.cwd(), "tests/fixtures/leaderboard.html"), "utf8");
    const parsed = parseHtmlDocument(html);

    expect(parsed.title).toBe("Leaderboard Fixture");
    expect(parsed.text).toContain("SWE-bench rankings");
    expect(parsed.tableRows).toHaveLength(3);

    const rows = extractLeaderboardRows(parsed.tableRows);
    expect(rows[0]?.columns).toEqual(["Rank", "Model", "Score"]);
    expect(rows[1]?.columns).toEqual(["1", "GPT-5.4", "72.1"]);
  });
});

describe("parseMarkdownDocument", () => {
  it("extracts dated release-note style text from markdown fixtures", async () => {
    const markdown = await readFile(path.join(process.cwd(), "tests/fixtures/gemini-release-notes.md"), "utf8");
    const parsed = parseMarkdownDocument(markdown);

    expect(parsed.title).toContain("Gemini release notes");
    expect(parsed.text).toContain("March 2026");
    expect(parsed.text).toContain("Gemini Live");
  });

  it("extracts benchmark table rows from markdown fixtures", async () => {
    const markdown = await readFile(path.join(process.cwd(), "tests/fixtures/scale-swebench-pro.md"), "utf8");
    const parsed = parseMarkdownDocument(markdown);
    const rows = extractLeaderboardRows(parsed.tableRows);

    expect(rows[0]?.columns).toEqual(["Rank", "Vendor", "Model", "Score"]);
    expect(rows[1]?.columns).toEqual(["1", "OpenAI", "GPT-5.4", "74.2"]);
  });
});
