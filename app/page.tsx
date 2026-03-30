import { existsSync } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SOURCE_REGISTRY } from "@/src/sources/registry";

type Artifact = {
  content: string | null;
  updatedAt: string | null;
};

type Section = {
  heading: string;
  lines: string[];
};

async function readArtifact(relativePath: string): Promise<Artifact> {
  const fullPath = path.join(process.cwd(), relativePath);
  if (!existsSync(fullPath)) {
    return { content: null, updatedAt: null };
  }

  const [content, metadata] = await Promise.all([readFile(fullPath, "utf8"), stat(fullPath)]);
  return {
    content,
    updatedAt: metadata.mtime.toISOString(),
  };
}

function stripInlineMarkdown(value: string) {
  return value
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .trim();
}

function parseSections(markdown: string | null) {
  if (!markdown) {
    return { title: null, sections: [] as Section[] };
  }

  const lines = markdown.split("\n");
  let title: string | null = null;
  const sections: Section[] = [];
  let current: Section | null = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      continue;
    }

    if (line.startsWith("# ")) {
      title = stripInlineMarkdown(line.slice(2));
      continue;
    }

    if (line.startsWith("## ")) {
      current = {
        heading: stripInlineMarkdown(line.slice(3)),
        lines: [],
      };
      sections.push(current);
      continue;
    }

    if (!current) {
      current = {
        heading: "Overview",
        lines: [],
      };
      sections.push(current);
    }

    current.lines.push(line);
  }

  return { title, sections };
}

function stripFirstTitle(markdown: string | null) {
  if (!markdown) {
    return null;
  }

  return markdown.replace(/^# .*\n+/u, "").trim();
}

function extractRiskScore(markdown: string | null) {
  if (!markdown) {
    return null;
  }

  const directMatch = markdown.match(/Risk score:\s*(\d+)/i);
  if (directMatch) {
    return Number(directMatch[1]);
  }

  const ratioMatch = markdown.match(/(\d+)\s*\/\s*100/);
  return ratioMatch ? Number(ratioMatch[1]) : null;
}

function extractSectionLines(sections: Section[], heading: string) {
  return sections.find((section) => section.heading.toLowerCase() === heading.toLowerCase())?.lines ?? [];
}

function formatTimestamp(value: string | null) {
  if (!value) {
    return "No run captured";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(value));
}

function renderLines(lines: string[]) {
  return lines.map((line, index) => {
    const cleaned = stripInlineMarkdown(line.replace(/^- /, "").replace(/^\d+\)\s*/, ""));
    const isList = /^- /.test(line) || /^\d+\)/.test(line);

    if (isList) {
      return (
        <li key={`${cleaned}-${index}`} className="section-item">
          {cleaned}
        </li>
      );
    }

    return (
      <p key={`${cleaned}-${index}`} className="section-copy">
        {cleaned}
      </p>
    );
  });
}

export default async function Home() {
  const [latestRaw, latestStrategy] = await Promise.all([
    readArtifact("raw-intel/latest.md"),
    readArtifact("strategy-brief/latest.md"),
  ]);

  const raw = parseSections(latestRaw.content);
  const strategy = parseSections(latestStrategy.content);
  const rawBody = stripFirstTitle(latestRaw.content);
  const strategyBody = stripFirstTitle(latestStrategy.content);
  const riskScore = extractRiskScore(latestStrategy.content);
  const summaryBullets = extractSectionLines(raw.sections, "Executive summary").slice(0, 4);
  const focusItems = extractSectionLines(strategy.sections, "What OpenAI should focus on").slice(0, 4);
  const fixtureWarning = latestRaw.content?.includes("Fixture mode enabled") ?? false;
  const sourceCount = SOURCE_REGISTRY.length;
  const primaryCount = SOURCE_REGISTRY.filter((source) => source.monitoring_tier === "primary").length;

  return (
    <main className="shell">
      <section className="masthead">
        <div className="masthead-copy">
          <p className="kicker">OpenAI Competitor Intelligence Control Room</p>
          <h1>Track frontier product shifts, benchmark pressure, and social noise without drowning in raw pages.</h1>
          <p className="intro">
            This interface fronts the daily Vercel cron pipeline, source-specific monitoring agents, and strategic brief
            synthesis for OpenAI product strategy.
          </p>
        </div>

        <div className="hero-panel">
          <div className="hero-stat">
            <span className="stat-label">Cadence</span>
            <strong>00:00 UTC</strong>
          </div>
          <div className="hero-stat">
            <span className="stat-label">Coverage</span>
            <strong>
              {sourceCount} monitored sources / {primaryCount} primary
            </strong>
          </div>
          <div className="hero-stat">
            <span className="stat-label">Latest strategy score</span>
            <strong>{riskScore ? `${riskScore}/100 risk` : "Awaiting brief"}</strong>
          </div>
          <div className="hero-stat">
            <span className="stat-label">Latest update</span>
            <strong>{formatTimestamp(latestStrategy.updatedAt ?? latestRaw.updatedAt)}</strong>
          </div>
        </div>
      </section>

      <section className={`status-banner ${fixtureWarning ? "warning" : "live"}`}>
        <div>
          <p className="status-label">{fixtureWarning ? "Fixture run detected" : "Live reporting surface"}</p>
          <p className="status-copy">
            {fixtureWarning
              ? "The current local latest artifacts were generated from synthetic data. Run a live sample or production cron to refresh them."
              : "The homepage is reading the latest generated artifacts and presenting them as a briefing surface rather than raw markdown dumps."}
          </p>
        </div>
        <div className="status-meta">
          <span>Raw: {formatTimestamp(latestRaw.updatedAt)}</span>
          <span>Strategy: {formatTimestamp(latestStrategy.updatedAt)}</span>
        </div>
      </section>

      <section className="board">
        <article className="panel panel-emphasis">
          <div className="panel-head">
            <p className="eyebrow">Mission</p>
            <h2>What the system is doing each day</h2>
          </div>
          <ul className="stack-list">
            <li>Collect official competitor signals from Anthropic, Gemini, and Perplexity.</li>
            <li>Compare benchmark posture across coding and broader model-evaluation surfaces.</li>
            <li>Track Reddit and GitHub momentum as lower-confidence market pressure.</li>
            <li>Reframe everything against OpenAI&apos;s own public changelog, news, and model surface.</li>
          </ul>
        </article>

        <article className="panel">
          <div className="panel-head">
            <p className="eyebrow">Signal Snapshot</p>
            <h2>Latest executive summary</h2>
          </div>
          {summaryBullets.length > 0 ? <ul className="stack-list">{renderLines(summaryBullets)}</ul> : <p>No report summary available yet.</p>}
        </article>

        <article className="panel">
          <div className="panel-head">
            <p className="eyebrow">Strategic Focus</p>
            <h2>Latest OpenAI focus areas</h2>
          </div>
          {focusItems.length > 0 ? <ul className="stack-list">{renderLines(focusItems)}</ul> : <p>No strategy focus items available yet.</p>}
        </article>
      </section>

      <section className="source-grid">
        {SOURCE_REGISTRY.map((source) => (
          <article key={source.id} className={`source-card ${source.monitoring_tier === "primary" ? "primary" : "secondary"}`}>
            <div className="source-topline">
              <span className="source-tier">{source.monitoring_tier ?? "secondary"}</span>
              <span className="source-kind">{source.kind.replace(/_/g, " ")}</span>
            </div>
            <h3>{source.label}</h3>
            <p>{source.notes}</p>
          </article>
        ))}
      </section>

      <section className="briefing-grid">
        <article className="report-panel">
          <div className="panel-head">
            <p className="eyebrow">Raw Intelligence</p>
            <h2>{raw.title ?? "No raw report generated yet"}</h2>
          </div>
          <div className="report-scroll">
            {rawBody ? (
              <article className="markdown-surface">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{rawBody}</ReactMarkdown>
              </article>
            ) : (
              <p className="empty-state">Run `pnpm run intel:sample` to generate the first raw report.</p>
            )}
          </div>
        </article>

        <article className="report-panel strategy-panel">
          <div className="panel-head">
            <p className="eyebrow">Strategy Memo</p>
            <h2>{strategy.title ?? "No strategy brief generated yet"}</h2>
          </div>
          <div className="risk-rail">
            <span className="risk-label">Risk posture</span>
            <div className="risk-meter">
              <div className="risk-fill" style={{ width: `${riskScore ?? 0}%` }} />
            </div>
            <strong>{riskScore ? `${riskScore}/100` : "No score yet"}</strong>
          </div>
          <div className="report-scroll">
            {strategyBody ? (
              <article className="markdown-surface">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{strategyBody}</ReactMarkdown>
              </article>
            ) : (
              <p className="empty-state">Run `pnpm run intel:sample` to generate the first strategy memo.</p>
            )}
          </div>
        </article>
      </section>
    </main>
  );
}
