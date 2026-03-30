import { load } from "cheerio";

export type ParsedHtmlDocument = {
  title: string | null;
  text: string;
  links: string[];
  tableRows: string[][];
};

export type ParsedMarkdownDocument = {
  title: string | null;
  text: string;
  tableRows: string[][];
};

export function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export function parseHtmlDocument(html: string): ParsedHtmlDocument {
  const $ = load(html);

  $("script, style, noscript").remove();

  const title = normalizeWhitespace($("title").first().text()) || null;
  const links = Array.from(new Set($("a[href]").map((_, node) => $(node).attr("href") ?? "").get().filter(Boolean)));
  const tableRows: string[][] = [];
  $("table tr").each((_, row) => {
    const cells = $(row)
      .find("th, td")
      .map((__, cell) => normalizeWhitespace($(cell).text()))
      .get()
      .filter(Boolean);

    if (cells.length > 0) {
      tableRows.push(cells);
    }
  });

  const blocks = $("h1, h2, h3, p, li, dt, dd, td, th")
    .map((_, node) => normalizeWhitespace($(node).text()))
    .get()
    .filter((entry) => entry.length > 0);

  return {
    title,
    text: Array.from(new Set(blocks)).join("\n"),
    links,
    tableRows,
  };
}

export function parseMarkdownDocument(markdown: string): ParsedMarkdownDocument {
  const lines = markdown
    .split("\n")
    .map((line) => normalizeWhitespace(line.replace(/[`*_>#-]/g, " ")))
    .filter(Boolean);

  const title = lines.find((line) => line.length > 0) ?? null;
  const tableRows = extractMarkdownTableRows(markdown);

  return {
    title,
    text: lines.join("\n"),
    tableRows,
  };
}

export function extractLines(text: string, limit = 40) {
  return text
    .split("\n")
    .map((line) => normalizeWhitespace(line))
    .filter(Boolean)
    .slice(0, limit);
}

export function extractLeaderboardRows(tableRows: string[][]) {
  return tableRows
    .filter((row) => row.length >= 3)
    .slice(0, 12)
    .map((row, index) => ({
      rank_hint: index + 1,
      columns: row,
    }));
}

export function extractMarkdownTableRows(markdown: string) {
  const rows: string[][] = [];
  for (const line of markdown.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("|") || !trimmed.endsWith("|")) {
      continue;
    }

    const cells = trimmed
      .split("|")
      .slice(1, -1)
      .map((cell) => normalizeWhitespace(cell))
      .filter(Boolean);

    if (cells.length === 0 || cells.every((cell) => /^:?-{2,}:?$/.test(cell))) {
      continue;
    }

    rows.push(cells);
  }

  return rows;
}
