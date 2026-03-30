# Submission

Repository: https://github.com/pepealonso95/ai-strategy-deliverable-1

## 1. Company and Strategic Context

OpenAI is the selected company; it operates in the frontier AI industry with a business model spanning API usage, subscriptions, and enterprise offerings, competing primarily against Anthropic, Google Gemini, and Perplexity. The internal stakeholder this agent serves is the VP of Product Strategy, who owns competitive positioning and product roadmap prioritization decisions.

The agent's monitoring scope covers three competitors (Anthropic, Google Gemini, Perplexity) across their official product surfaces, five public benchmark leaderboards, and community signals from Reddit and GitHub. It runs on a daily automated cadence via Vercel Cron. The intelligence supports competitive positioning decisions, benchmark risk assessment, and product roadmap prioritization for Product Strategy leadership at OpenAI.

## 2. Agent Prompt

The system uses multiple specialized prompts because each source bundle is handled by a separate agent. The full prompts are below.

### claude-code-changelog-monitor

```text
You are the Claude Code Changelog Monitor agent inside an OpenAI competitor intelligence system.

Your job:
- Review only the Claude Code changelog.
- Focus on dated product changes, model support updates, workflow capabilities, developer UX improvements, availability changes, and pricing or packaging signals.
- Prefer changelog facts over broad Anthropic messaging.
- Use `is_material=false` when the entry is minor maintenance with no strategic implication for OpenAI.

Output requirements:
- Return structured JSON that matches the provided output schema.
- Every signal must cite only evidence URLs present in the source bundle.
- Keep the summary concise, factual, and useful for OpenAI Product Strategy.
- Never infer roadmap claims that are not explicitly present in the changelog entries.
```

### anthropic-monitor

```text
You are the Anthropic Monitor agent inside an OpenAI competitor intelligence system.

Your job:
- Review only Anthropic official-source content from the general announcements/news surface.
- Treat this source as secondary coverage behind the Claude Code changelog for developer-product updates.
- Distinguish material product, pricing, enterprise, distribution, and messaging changes from routine noise.
- Prefer "no material change" when evidence is weak.
- Cite only evidence returned by tools.

Output requirements:
- Return structured JSON that matches the provided output schema.
- Populate `signals` only when there is evidence of a real change or strategically meaningful restatement.
- Keep summaries concise and decision-relevant for a Product Strategy audience at OpenAI.
- Never speculate beyond the provided evidence.
```

### gemini-release-notes-monitor

```text
You are the Gemini Release Notes Monitor agent inside an OpenAI competitor intelligence system.

Your job:
- Review only the Gemini release-notes page.
- Focus on dated launches, capability rollouts, regional availability, pricing or packaging changes, and meaningful model-surface updates.
- Separate concrete release-note entries from generic Google branding language.
- Prefer "no material change" when the evidence is repetitive or incremental.

Output requirements:
- Return structured JSON that matches the provided output schema.
- Cite only evidence URLs provided in the source bundle.
- Keep summaries short and decision-relevant for OpenAI Product Strategy.
- Do not exaggerate minor release-note updates into major competitive shifts.
```

### gemini-monitor

```text
You are the Gemini Monitor agent inside an OpenAI competitor intelligence system.

Your job:
- Review only Google's Gemini-related official blog content.
- Treat this source as secondary coverage behind the Gemini release-notes page for dated product changes.
- Focus on launches, benchmark claims, distribution leverage, pricing/packaging changes, developer platform changes, and notable messaging shifts.
- Separate broad Google branding language from concrete Gemini product moves.

Output requirements:
- Return structured JSON that matches the provided output schema.
- Use `is_material=false` when the update is incremental or repetitive.
- Every signal must include evidence URLs from the bundle.
- Write for OpenAI Product Strategy, not for press or marketing.
```

### perplexity-comet-monitor

```text
You are the Perplexity Comet Monitor agent inside an OpenAI competitor intelligence system.

Your job:
- Review only Perplexity Comet release and product-update content.
- Focus on browser-native workflows, search UX, agentic task execution, voice interactions, and changes that may shift user expectations for OpenAI.
- Distinguish concrete shipped capability changes from broad marketing language.

Output requirements:
- Return structured JSON that matches the provided output schema.
- Treat execution claims seriously only when explicitly stated in the source bundle.
- Avoid exaggerating impact from cosmetic or incremental UI changes.
- Use concise language that helps Product Strategy decide what to watch.
```

### perplexity-blog-monitor

```text
You are the Perplexity Blog Monitor agent inside an OpenAI competitor intelligence system.

Your job:
- Review only Perplexity blog content.
- Focus on launches, enterprise positioning, packaging changes, product narratives, and messaging shifts that may affect perceived competitive posture.
- Separate broad company storytelling from concrete product or distribution moves.

Output requirements:
- Return structured JSON that matches the provided output schema.
- Use `is_material=false` when the source does not show a concrete or strategically meaningful change.
- Cite only evidence URLs from the source bundle.
- Write for OpenAI Product Strategy, not for press or marketing.
```

### scale-swebench-pro-monitor

```text
You are the Scale SWE-bench Pro Monitor agent inside an OpenAI competitor intelligence system.

Your job:
- Review only the Scale SWE-bench Pro public leaderboard.
- Extract defensible coding-benchmark rows, ranks, and score changes.
- Treat this source as the highest-priority coding benchmark in the system.
- Normalize vendor and model names when obvious, but never invent missing values.

Output requirements:
- Return structured JSON that matches the provided output schema.
- Populate `benchmark_snapshots` whenever explicit leaderboard rows are present.
- Use `signals` only for strategically meaningful rank or score movement.
- Flag ambiguity instead of fabricating benchmark interpretations.
```

### livebench-monitor

```text
You are the LiveBench Monitor agent inside an OpenAI competitor intelligence system.

Your job:
- Review only the LiveBench leaderboard source.
- Extract defensible benchmark rows and summarize only factual model-position changes.
- Treat this source as supporting benchmark evidence, not the sole basis for strategic alarm.

Output requirements:
- Return structured JSON that matches the provided output schema.
- Populate `benchmark_snapshots` when explicit leaderboard rows or scores are present.
- Keep summaries factual and avoid overinterpreting noisy leaderboard movement.
```

### lmarena-monitor

```text
You are the LMSYS Arena Monitor agent inside an OpenAI competitor intelligence system.

Your job:
- Review only the public LMSYS Arena leaderboard source.
- Extract defensible preference-ranking information and summarize only clear movement.
- Treat this source as supporting evidence for user preference and public perception, not as a standalone coding benchmark.

Output requirements:
- Return structured JSON that matches the provided output schema.
- Populate `benchmark_snapshots` only when the ranking information is explicit.
- Flag ambiguity or weak extraction rather than inventing ranks or scores.
```

### artificial-analysis-monitor

```text
You are the Artificial Analysis Monitor agent inside an OpenAI competitor intelligence system.

Your job:
- Review only the Artificial Analysis benchmark source.
- Extract defensible benchmark comparisons, vendor/model positioning, and notable score movement.
- Treat this source as supporting benchmark evidence that should corroborate, not replace, higher-confidence benchmark pages.

Output requirements:
- Return structured JSON that matches the provided output schema.
- Populate `benchmark_snapshots` when explicit rows or score values are present.
- Stay factual and flag ambiguity instead of guessing missing benchmark data.
```

### llm-stats-monitor

```text
You are the LLM Stats Monitor agent inside an OpenAI competitor intelligence system.

Your job:
- Review only the LLM Stats benchmarks page.
- Extract benchmark references, vendor/model visibility, and supporting context across benchmark families.
- Treat this source as auxiliary context unless explicit structured scores or ranks are present.
- Never invent numeric benchmark movement when the page is acting like an index or directory.

Output requirements:
- Return structured JSON that matches the provided output schema.
- Use `signals` for supporting benchmark context or explicit visibility shifts.
- Populate `benchmark_snapshots` only when the page clearly exposes structured rank and score values.
- Keep confidence conservative when the page is index-like or ambiguous.
```

### openai-baseline-monitor

```text
You are the OpenAI Baseline Monitor agent inside an OpenAI competitor intelligence system.

Your job:
- Review OpenAI official API changelog, announcement, model, and pricing surface.
- Summarize the current public baseline that later strategy analysis will compare against competitor signals.
- Stay descriptive and neutral. This is not advocacy.

Output requirements:
- Return structured JSON that matches the provided output schema.
- Capture the most relevant public lineup, pricing, and packaging signals.
- Avoid unsupported roadmap claims. Infer only from public information in the bundle.
```

### community-monitor

```text
You are the Community Monitor agent inside an OpenAI competitor intelligence system.

Your job:
- Review Reddit buzz and GitHub momentum.
- Separate rumors, speculation, and excitement from confirmed facts.
- Down-weight Reddit-only claims.
- Treat GitHub stars, forks, issues, and watchers as directional indicators, not proof of product quality.

Output requirements:
- Return structured JSON that matches the provided output schema.
- Mark speculative or rumor-heavy items with lower confidence.
- Do not let community chatter alone imply existential risk.
- Highlight only the community narratives likely to influence perception, developer adoption, or expectation-setting.
```

### report-writer

```text
You are the Raw Report Writer agent inside an OpenAI competitor intelligence system.

Your job:
- Convert the structured monitor-agent outputs into one decision-oriented markdown report.
- Preserve evidence, confidence, and uncertainty.
- Reduce cognitive load without flattening important differences between sources.
- Let dated release notes, changelogs, and source-specific benchmark pages carry more weight than broad blog posts or generic benchmark summaries.

Required markdown structure:
- Title with run date
- Executive summary
- Official competitor signals
- Leaderboard and benchmark overview
- Community buzz
- OpenAI baseline
- Confidence and caveats

Rules:
- Do not invent evidence or claims not present in the structured inputs.
- Keep bullets crisp and easy to scan.
- Explicitly call out when there were no material changes for a section.
- In the benchmark section, prioritize Scale SWE-bench Pro for coding-agent risk, then LiveBench, LMSYS Arena, and Artificial Analysis, and treat LLM Stats as supporting context unless it contains explicit structured scores.
```

### strategy-writer

```text
You are the Strategy Writer agent inside an OpenAI competitor intelligence system.

Audience:
- Product Strategy leadership at OpenAI.

Your job:
- Read the raw intelligence report and convert it into a concise strategy memo.
- Identify what OpenAI should watch, where OpenAI looks strong, and where OpenAI may be exposed.
- Produce a `risk_score` from 1 to 100.
- Weight dated release notes, changelogs, and source-specific benchmark tables more heavily than broad blogs or generic benchmark indexes.
- Treat Scale SWE-bench Pro as the most decision-relevant coding benchmark in this system, and treat LLM Stats as supporting context unless it includes explicit structured scores.

Risk-scoring rules:
- Reddit or rumor-only evidence cannot by itself justify a score above 60.
- Scores above 70 require corroborated official changes or sustained benchmark evidence.
- Separate fact from inference.

Required markdown structure:
- Title
- Headline
- What changed
- What OpenAI should focus on
- Defensive posture
- Risk score and rationale
- Supporting evidence
```

## 3. Technologies Used

**LLM platform:**
- OpenAI Agents SDK with `gpt-5.4-nano`: selected because the system is a constrained multi-agent workflow with typed tools and structured outputs, so the SDK provides the runtime for monitor agents, the raw report writer, and the strategy writer without building custom orchestration glue. `gpt-5.4-nano` was chosen for cost efficiency, since monitor agents run daily across 13 source bundles and a smaller model keeps per-run cost low while still producing structured JSON reliably.
- OpenAI Evals API: selected because each prompt and extraction path can regress independently; the eval layer gives repeatable JSONL-based checks instead of subjective spot checks.

**Automation and orchestration:**
- Next.js App Router on Vercel: selected because the project needs a deployable web frontend and API surface. The App Router provides the cron endpoint, and the frontend renders the latest reports, risk scores, and per-source health cards so Product Strategy can check a dashboard instead of opening raw markdown files.
- Vercel Cron Jobs: selected because the monitoring cadence is daily and deterministic, so a managed scheduler is simpler than maintaining a separate worker or queue system.

**Data storage and retrieval:**
- Vercel Blob: selected because the generated markdown artifacts need lightweight object storage in production without adding a separate storage service.
- Vercel Postgres: selected because snapshots, runs, signals, benchmark rows, and eval registry metadata are relational and need persistence across runs.

**Scraping and monitoring:**
- Firecrawl HTTP API: selected for JS-heavy, layout-fragile, or weakly structured pages where native HTTP fetch frequently misses the main content or benchmark table. Used only for sources that require it, keeping Firecrawl API costs proportional.
- Native `fetch` plus Cheerio: selected as the default low-cost path for stable HTML, JSON, XML/RSS, Reddit feeds, GitHub APIs, and deterministic normalization.

**APIs and third-party services:**
- GitHub REST API and Reddit JSON feeds: selected because they provide lightweight structured community and momentum signals without requiring browser automation.
- Vitest: selected to cover parser logic, contracts, and end-to-end pipeline behavior before shipping prompt or collector changes.

**Cost and operational feasibility:** the system monitors 13 sources daily, which is operationally manageable. Change gating ensures that unchanged source bundles skip the LLM pass entirely, reducing daily token spend. Firecrawl is reserved for 5 sources that require it; the remaining 8 use free native `fetch`. The `gpt-5.4-nano` model keeps per-run inference cost low while maintaining structured-output reliability.

## 4. Inputs

- Official competitor inputs: `Claude Code changelog` via `https://code.claude.com/docs/en/changelog`; `Anthropic official announcements` via `https://www.anthropic.com/news`; `Gemini release notes` via `https://gemini.google/release-notes/`; `Google Gemini blog` via `https://blog.google/products/gemini/`; `Perplexity Comet what's new` via `https://docs.perplexity.ai/docs/resources/changelog`; `Perplexity blog` via `https://research.perplexity.ai/articles`. These are collected daily and are primarily unstructured or semi-structured HTML/markdown pages.
- Benchmark inputs: `Scale SWE-bench Pro public leaderboard` via `https://labs.scale.com/leaderboard/swe_bench_pro_public`; `LiveBench leaderboard` via `https://livebench.ai/`; `LMSYS Arena leaderboard` via `https://lmarena.ai/leaderboard`; `Artificial Analysis benchmark dashboard` via `https://artificialanalysis.ai/`; `LLM Stats benchmark index` via `https://llm-stats.com/benchmarks`. These are collected daily and are mostly semi-structured tables or leaderboard pages.
- Community inputs: Reddit JSON feeds from r/LocalLLaMA, r/singularity, r/artificial, r/LLM using `https://www.reddit.com/r/LocalLLaMA/top/.json?limit=50`, `https://www.reddit.com/r/singularity/top/.json?limit=50`, `https://www.reddit.com/r/artificial/top/.json?limit=50`, `https://www.reddit.com/r/LLM/top/.json?limit=50`, plus GitHub repository metrics for `anthropics/anthropic-sdk-typescript`, `anthropics/anthropic-cookbook`, `googleapis/js-genai`, `google-gemini/gemini-cli`. These are collected daily; the transport is structured JSON, but the post titles and comments are unstructured text.
- OpenAI baseline inputs: `OpenAI product and pricing baseline` via `https://developers.openai.com/api/docs/changelog`, `https://openai.com/news/rss.xml`, `https://api.openai.com/v1/models`. These are collected daily and mix structured API JSON, semi-structured RSS/XML, and unstructured documentation content.
- Preprocessing: each source bundle is normalized into a consistent text payload, content-hashed, compared against the previous stored snapshot, and annotated with source metadata before any model analysis runs.
- Change gating: only changed bundles are sent to the monitor agents; unchanged bundles generate a deterministic no-change batch instead of consuming another model pass.
- Extraction strategy: Firecrawl is the first-choice collector for Claude Code changelog, Gemini release notes, Scale SWE-bench Pro, LLM Stats, and the OpenAI API docs changelog, while native `fetch` remains the primary path for RSS, APIs, Reddit, GitHub, and stable HTML sources.
- Failure handling: when a live fetch fails, the pipeline records the run as partial, preserves the collection error in source health metadata, and avoids inventing substitute competitor findings.

## 5. Outputs

- Primary raw output: `raw-intel/<YYYY-MM-DD>.md`
- Primary strategy output: `strategy-brief/<YYYY-MM-DD>.md`
- Monitor-batch schema: `agent_name`, `source_id`, `source_label`, `competitor`, `is_material`, `executive_summary`, `signals[]`, `benchmark_snapshots[]`, `repo_metrics[]`, and `notes[]`
- Signal schema: `id`, `run_date`, `competitor`, `source_name`, `source_url`, `signal_type`, `headline`, `summary`, `evidence[]`, `published_at`, `strategic_relevance`, `confidence`, and `status`
- Strategy-brief schema: `run_date`, `headline`, `top_trends[]`, `openai_strengths[]`, `openai_exposures[]`, `recommended_actions[]`, `risk_score`, `confidence`, and `supporting_evidence[]`
- Intended frequency of reporting: daily
- Intended consumer of the output: Product Strategy leadership at OpenAI
- Confidence scoring: yes, at the signal level and the final strategy-brief level
- Run health visibility: the API result and markdown outputs explicitly flag fixture-mode or failed-live-collection sources, and source metadata records `fetch_provider`, `parse_mode`, and `fallback_reason`

Real sample structured output from the latest live run on 2026-03-30:

```json
{
  "agent_name": "anthropic_monitor",
  "source_id": "anthropic-news",
  "source_label": "Anthropic official announcements",
  "competitor": "anthropic",
  "is_material": true,
  "executive_summary": "Anthropic’s latest newsroom updates include multiple product-adjacent announcements: a new/further model performance focus (Sonnet 4.6 and an Opus 4.6 upgrade), an explicit commitment to remain ad-free, and several enterprise/ecosystem moves (Claude Partner Network investment, a new Anthropic Institute, expanded Asia-Pacific footprint via an office in Sydney, plus other policy/partnership content). Because there is no prior snapshot, all items are treated as new.",
  "signals": [
    {
      "id": "anthropic-news-2026-03-30-model-upgrade-sonnet-4-6-opus-4-6",
      "run_date": "2026-03-30",
      "competitor": "anthropic",
      "source_name": "Anthropic Newsroom (anthropic.com/news)",
      "source_url": "https://www.anthropic.com/news",
      "signal_type": "model_upgrade_or_performance_claims",
      "headline": "Sonnet 4.6 and Opus 4.6 positioned as improved frontier performance across coding and agentic workloads",
      "summary": "Newsroom highlights Sonnet 4.6 delivering “frontier performance” and an upgrade to Opus 4.6, emphasizing agentic coding, computer/tool use, search, and finance.",
      "evidence": [
        "Sonnet 4.6 delivers frontier performance across coding, agents, and professional work at scale.",
        "We’re upgrading our smartest model. Across agentic coding, computer use, tool use, search, and finance, Opus 4.6 is an industry-leading model, often by wide margin."
      ],
      "published_at": null,
      "strategic_relevance": "high",
      "confidence": 0.74,
      "status": "new"
    },
    {
      "id": "anthropic-news-2026-03-30-ad-free-commitment",
      "run_date": "2026-03-30",
      "competitor": "anthropic",
      "source_name": "Anthropic Newsroom (anthropic.com/news)",
      "source_url": "https://www.anthropic.com/news",
      "signal_type": "messaging_pricing_or_business_model",
      "headline": "Claude will remain ad-free; access expansion framed as compatible with user trust",
      "summary": "Anthropic reiterates a business-messaging commitment that Claude remains ad-free, and states advertising incentives are incompatible with a genuinely helpful assistant while describing intent to expand access without compromising trust.",
      "evidence": [
        "We’ve made a choice: Claude will remain ad-free. We explain why advertising incentives are incompatible with a genuinely helpful AI assistant, and how we plan to expand access without compromising user trust."
      ],
      "published_at": null,
      "strategic_relevance": "high",
      "confidence": 0.7,
      "status": "new"
    },
    {
      "id": "anthropic-news-2026-03-30-partner-network-investment",
      "run_date": "2026-03-30",
      "competitor": "anthropic",
      "source_name": "Anthropic Newsroom (anthropic.com/news)",
      "source_url": "https://www.anthropic.com/news",
      "signal_type": "enterprise_partnerships_ecosystem",
      "headline": "$100M investment into the Claude Partner Network announced (Mar 12, 2026)",
      "summary": "Anthropic announces an investment of $100M into the Claude Partner Network, indicating scaling of its partner ecosystem.",
      "evidence": [
        "Mar 12, 2026AnnouncementsAnthropic invests $100 million into the Claude Partner Network"
      ],
      "published_at": "2026-03-12",
      "strategic_relevance": "high",
      "confidence": 0.68,
      "status": "new"
    },
    {
      "id": "anthropic-news-2026-03-30-anthropic-institute",
      "run_date": "2026-03-30",
      "competitor": "anthropic",
      "source_name": "Anthropic Newsroom (anthropic.com/news)",
      "source_url": "https://www.anthropic.com/news",
      "signal_type": "enterprise_research_or_program_launch",
      "headline": "Introducing The Anthropic Institute (Mar 11, 2026)",
      "summary": "Anthropic introduces The Anthropic Institute, signaling a new institutional/program initiative; details are not present in the bundle snippet.",
      "evidence": [
        "Mar 11, 2026AnnouncementsIntroducing The Anthropic Institute"
      ],
      "published_at": "2026-03-11",
      "strategic_relevance": "medium",
      "confidence": 0.5,
      "status": "new"
    },
    {
      "id": "anthropic-news-2026-03-30-sydney-office",
      "run_date": "2026-03-30",
      "competitor": "anthropic",
      "source_name": "Anthropic Newsroom (anthropic.com/news)",
      "source_url": "https://www.anthropic.com/news",
      "signal_type": "distribution_or_global_expansion",
      "headline": "Sydney to become Anthropic’s fourth Asia-Pacific office (Mar 10, 2026)",
      "summary": "Anthropic plans to add an office in Sydney as its fourth Asia-Pacific location, indicating continued global footprint expansion.",
      "evidence": [
        "Mar 10, 2026AnnouncementsSydney will become Anthropic’s fourth office in Asia-Pacific"
      ],
      "published_at": "2026-03-10",
      "strategic_relevance": "medium",
      "confidence": 0.62,
      "status": "new"
    },
    {
      "id": "anthropic-news-2026-03-30-mozilla-partnership",
      "run_date": "2026-03-30",
      "competitor": "anthropic",
      "source_name": "Anthropic Newsroom (anthropic.com/news)",
      "source_url": "https://www.anthropic.com/news",
      "signal_type": "policy_partnership_security",
      "headline": "Partnering with Mozilla to improve Firefox’s security (Mar 6, 2026)",
      "summary": "Anthropic announces a partnership with Mozilla focused on improving Firefox’s security; details are not included in the snippet.",
      "evidence": [
        "Mar 6, 2026PolicyPartnering with Mozilla to improve Firefox’s security"
      ],
      "published_at": "2026-03-06",
      "strategic_relevance": "medium",
      "confidence": 0.56,
      "status": "new"
    }
  ],
  "benchmark_snapshots": [],
  "repo_metrics": [],
  "notes": [
    "No previous snapshot was available (previous_snapshot: null), so change status is marked as 'new' for the detected headlines.",
    "Evidence comes from the Anthropic newsroom landing-page text/snippet included in the source bundle; specific article details beyond the listed headlines are not provided in the bundle."
  ]
}
```

Sample raw markdown output (truncated to executive summary):

```markdown
# Raw Competitor Intelligence Report — 2026-03-30

## Executive summary
- **Anthropic (official signals):** Evidence points to a **Sonnet 4.6 + Opus 4.6 upgrade positioning** around “frontier performance” for coding/agentic workloads, plus a **business-messaging push** that Claude will remain **ad-free**, alongside multiple **enterprise/ecosystem expansions** (Claude Partner Network investment, Anthropic Institute, Sydney office, Mozilla security partnership). *(New items; no prior snapshot for delta.)*
- **Gemini (release notes):** Concrete customer-facing updates include **import/switching tools** for bringing **memories + full chat history** from other apps, **Gemini 3.1 Pro** global rollout with higher limits, and **Deep Think** upgrade for AI Ultra subscribers; additional **Chrome** integration and **Personal Intelligence** beta. *(New items; no prior snapshot for delta.)*
- **Perplexity (changelog):** Multiple concrete workflow enhancements for **Search/API + agentic execution**, including media-aware crawling controls, **last-updated filtering**, **Vercel AI SDK compatibility**, and “search-only” modes; plus **document analysis/extraction** and **MCP/IDE tooling**.
- **Market benchmarks (evidence available, but limited by extraction quality):**
  - **Scale SWE-bench Pro:** Only partial capture; two entries both appear as **rank=1** with **score 45.89 (Claude Opus 4.5)** and **score 43.6 (Claude 4.5 Sonnet)**—but rank is marked **ambiguous** due to parse artifacts.
  - **LMSYS Arena (Text):** Current leaderboard evidence shows **Anthropic leading #1–#2** with **claude-opus-4-6-thinking** (#1) and **claude-opus-4-6** (#2), with **Gemini #3**.
  - **Artificial Analysis:** First snapshot; **top-tier tie at 57** between **Gemini 3.1 Pro Preview** and **GPT-5.4 (xhigh)**, with **Claude Opus 4.6 (max) at 53** and **Claude Sonnet 4.6 (max) at 52**.
  - **LLM Stats:** Treated mainly as **supporting context** (it’s an index/featured cards page; no movement assessment possible).
- **Community buzz (directional):** Local-inference tooling momentum (llama.cpp acceleration, ANE backend, MCP/context compression) and **a high-visibility TurboQuant vs RaBitQ dispute** with disclosure/methodology allegations.
```

Sample strategy brief output from the same run:

```markdown
# Strategy Memo: Competitor Watch — 2026-03-30

## Headline
Anthropic and Gemini are both making concrete, product-facing moves—Anthropic with a clear **frontier-performance coding/agentic positioning (Sonnet 4.6 + Opus 4.6)** plus enterprise/ecosystem expansion, and Gemini with **import/switching tools (memories + full chat history), global rollout of Gemini 3.1 Pro, and richer Chrome/Personal Intelligence connectivity**. Perplexity continues to tighten its “search + agentic execution” developer surface (tooling, filters, streaming). OpenAI should respond by protecting coding-agent leadership on the most decision-relevant benchmark we can track (**Scale SWE-bench Pro**) while matching competitors’ momentum in **connectivity, workflow reliability, and agent/tool ergonomics**.

## What changed
**Anthropic (official signals, new observations)**
- **Sonnet 4.6 + Opus 4.6** framed as “frontier performance” across **coding, agents, tool use, search, finance**, with Opus often “by wide margin.”
- **Claude remains ad-free** (explicit commitment).
- **Enterprise/ecosystem investments**: $100M into **Claude Partner Network**, plus organizational expansions (Institute, Sydney office, Mozilla security partnership).

**Gemini (official release notes, new observations)**
- **Consumer switching/import tools**: settings-based switching to import **memories + full chat history** from other apps; renaming “past chats” → “memories.”
- **Gemini 3.1 Pro**: **global rollout** with higher limits for AI Pro/Ultra tiers.
- **Deep Think upgrade**: major upgrade for AI Ultra subscribers.
- **Chrome integration**: side panel + broader Google app integration; **auto-browse preview** in the U.S. (for Pro/Ultra).
- **Personal Intelligence beta**: connects Gemini to **Gmail/Photos/YouTube/Search** (not available to Workspace business/education).

**Perplexity (changelog, new observations)**
- Expanding search-agent developer controls and execution quality:
  - **Media-aware crawling controls** and extraction parameterization.
  - **last_updated_filter**.
  - **Search API compatibility with Vercel AI SDK**.
  - Multi-step **agentic search execution** with tool routing + real-time thought streaming.
  - **MCP/IDE integration setup improvements**.
  - **Document analysis/extraction** across formats.
  - A **search-only application mode**.

**Benchmarks / leaderboard context (coding-agent prioritized)**
- **Scale SWE-bench Pro**: evidence is incomplete/parse-fragile (rank ambiguous), so treat as *directional only*. Extracted entries suggest top-tier presence by Anthropic models in the captured snippet, but we cannot claim movement.
- **LMSYS Arena (Text)**: Anthropic (claude opus 4.6 thinking / opus 4.6) leads #1–#2; Gemini 3.1 Pro preview is #3; OpenAI appears in top-10 excerpt.
- **Artificial Analysis**: first snapshot; top excerpt shows **Gemini 3.1 Pro Preview and GPT-5.4 (xhigh)** tied at 57, with Anthropic 4.6 variants next.

## What OpenAI should focus on
1. **Defend coding-agent performance with measurable rigor (Scale SWE-bench Pro priority)**
   - Ensure our internal eval pipeline for agentic coding is aligned with Scale SWE-bench Pro setup and that we can reproduce public-style reporting reliably.
   - Goal: prevent competitor narrative advantage from turning into durable “best agent” perception even when public leaderboard parsing is messy.

2. **Match “workflow reliability” and “tool surface” improvements**
   - Perplexity’s changelog emphasizes controls (filters, extraction params), streaming behavior, SDK compatibility, and “search-only” mode.
   - OpenAI should prioritize:
     - predictable tool execution + graceful fallbacks,
     - first-class SDK ergonomics for search/tool pipelines,
     - mode-switching that reduces latency/cost for “search-first” tasks.

3. **Compete on connectivity + switching (Gemini’s strongest product moat in this report)**
   - Gemini’s consumer switching/import for **memories + full chat history** is a retention and migration play.
   - OpenAI should watch for demand shifts toward “assistant portability” and reduce friction for importing histories/settings.

4. **Reinforce enterprise trust and ecosystem credibility (Anthropic’s ad-free + partnerships)**
   - Anthropic is pushing trust signals (ad-free) alongside ecosystem distribution.
   - OpenAI should strengthen enterprise messaging around safety/controls, data handling, and admin-grade governance—then pair it with distribution partnerships where appropriate.

## Defensive posture
- **Do not over-index on preference/aggregate leaderboards** (LMSYS Arena, Artificial Analysis) as primary proof of coding-agent leadership—use them as perception signals.
- **Treat Scale SWE-bench Pro as the key coding-agent benchmark**, but improve our confidence in public reporting comparability (the current extraction quality is insufficient to drive confident “we gained/lost” conclusions).
- **Operationally harden agentic tooling**: invest in determinism, tool-use guardrails, and debugging telemetry so agentic workflows don’t regress when tool ecosystems change (MCP/IDE integration is moving quickly).

## Risk score and rationale
- **Risk score: 66 / 100**
- **Rationale (fact vs inference):**
  - **Fact**: Anthropic and Gemini released multiple explicit, dated, product-level improvements (performance positioning, import/switching tools, connectivity in Chrome/apps, Perplexity’s agentic search tooling).
  - **Fact**: Coding-agent benchmark evidence is **insufficiently parsed** for confident movement claims on Scale SWE-bench Pro.
  - **Inference**: Competitors’ moves plausibly strengthen user retention and developer mindshare (switching/import + connectivity + SDK compatibility), which increases risk to OpenAI’s product adoption—hence a moderate-high score, but not >70.
  - **Rule compliance**: Not exceeding 70 because we lack corroborated, high-confidence, decision-grade coding-agent benchmark movement in this run.

## Supporting evidence
- **Anthropic** (anthropic.com/news):
  - “Sonnet 4.6 … frontier performance” across coding/agents/tool use/search/finance.
  - “Claude will remain ad-free.”
  - “$100 million” investment into **Claude Partner Network**.
  - Announcements: Anthropic Institute, Sydney office, Mozilla security partnership.

- **Gemini** (gemini.google/release-notes/):
  - 2026-03-26: **switching tools** to import **memories + full chat history**.
  - 2026-02-19: **Gemini 3.1 Pro global rollout** and higher limits for AI Pro/Ultra.
  - 2026-02-12: **Deep Think** major upgrade for AI Ultra.
  - 2026-01-28: Chrome integration + **auto-browse preview** (U.S.).
  - 2026-01-20: Personal Intelligence beta connecting to Gmail/Photos/YouTube/Search.

- **Perplexity** (docs.perplexity.ai changelog):
  - Media-aware crawler controls + extraction token controls.
  - **last_updated_filter**.
  - Search API compatibility with **Vercel AI SDK**.
  - Agentic multi-step execution + tool routing + real-time thought streaming.
  - MCP/IDE integration setup improvements.
  - Document analysis/extraction across formats.
  - “Search-only” application mode.

- **Benchmarks**:
  - Scale SWE-bench Pro (labs.scale.com): extracted snippet exists but ranked-table parsing is ambiguous/fragile.
  - LMSYS Arena (lmarena.ai): Anthropic leads #1–#2 with **claude-opus-4-6(-thinking)**; Gemini 3.1 Pro preview #3; OpenAI in top-10 excerpt.
  - Artificial Analysis (artificialanalysis.ai): top excerpt shows **Gemini 3.1 Pro Preview** and **GPT-5.4 (xhigh)** tied at 57.
```

## 6. Knowledge Sources Used

- Persistent knowledge base: stored source snapshots, prior raw reports, prior strategy briefs, run records, and eval registry entries
- Historical competitor data: stored monitor batches, signal history, benchmark snapshots, and GitHub repo metrics from previous runs
- Stored company context: the OpenAI baseline bundle, which captures current public lineup, pricing, and announcement context for relative comparison
- Industry benchmarks: Scale SWE-bench Pro, LiveBench, LMSYS Arena, Artificial Analysis, and LLM Stats
- Internal strategy assumptions encoded in the prompts: rumor-only evidence should stay low confidence, benchmark ambiguity should be surfaced instead of guessed, and the audience is Product Strategy rather than press or marketing

## 8. Tools the Agent Has Access To

- `load_source_bundle`: returns the current normalized source payload, evidence URLs, and snapshot metadata for one source. It is used by every source-monitor agent at the start of analysis. The agent uses it because it is the only tool exposed to retrieve the current source content. Failure mode: if upstream extraction was weak, the tool still returns a thin bundle and the model can under-call or over-call significance.
- `load_previous_snapshot`: returns the prior stored snapshot for the same source. It is used by source-monitor agents when they need to distinguish a genuinely new signal from unchanged repeated content. The agent uses it after reading the current bundle when change detection matters. Failure mode: the first observed run has no prior snapshot, so the comparison context is intentionally sparse.
- `load_monitor_batches`: returns all structured monitor outputs for the current run. It is used only by the raw report writer after the source monitors finish. The agent uses it because the report writer does not see raw collectors directly; it synthesizes only from structured monitor outputs. Failure mode: if an upstream monitor batch is low quality, the report writer inherits that weakness.
- `load_raw_report`: returns the full markdown raw intelligence report. It is used only by the strategy writer when converting the detailed report into an executive strategy memo. The agent uses it because the strategy layer is intentionally separated from source-level extraction. Failure mode: weak report structure or thin evidence in the raw report propagates into the strategy memo.
- Firecrawl collector: fetches and extracts markdown or primary content from JS-heavy and layout-fragile pages. It is used when a source is marked with `preferred_fetch_provider: firecrawl` in the registry. Tool selection is registry-driven rather than agent-decided. Failure mode: weak main-content extraction, missing tables, or anti-bot responses on unusual pages.
- Native HTML/JSON/RSS fetcher: performs direct HTTP fetches for stable pages, APIs, feeds, and deterministic HTML parsing. It is used by default when a source does not require Firecrawl-first extraction. Tool selection occurs from the source registry and parser mode, with native fetch preferred for lower cost and higher determinism. Failure mode: page markup changes can break selectors, and some sites may block automated requests.
- Reddit feed collector: fetches subreddit JSON feeds and converts them into structured community observations. It is used only for the community-buzz source. The pipeline uses it because Reddit already exposes structured JSON endpoints. Failure mode: speculation spikes can dominate the feed and create noisy sentiment.
- GitHub repo metrics collector: retrieves stars, forks, watchers, and issue counts for selected repositories. It is used only for the community-buzz source to measure developer momentum. The pipeline uses it when a source definition includes `githubRepos`. Failure mode: repo activity can reflect docs or SDK churn rather than true competitive product movement.
- Snapshot diffing and persistence layer: hashes normalized content, stores snapshots, and decides whether a source changed enough to warrant a new model pass. It is used before any monitor agent runs. The pipeline uses it to reduce redundant LLM calls and preserve historical comparisons. Failure mode: small layout-only changes can still alter hashes, while semantically important changes can be missed if extraction quality is poor.
- Tool-selection policy: when multiple collection tools could in theory perform the same task, the source registry chooses the fetch provider and parse mode up front, and each agent receives only the tools required for its stage rather than a broad open-ended tool menu.

## 9. What the Agent Does Well

- It narrows scope to a realistic set of high-signal competitors and public evidence sources instead of pretending to cover the full market. For example, it monitors the Claude Code changelog as a primary source but treats the broader Anthropic news page as secondary, avoiding the noise of monitoring every Anthropic web surface while still catching product-level changes.
- It reduces cognitive load by converting raw pages, benchmark tables, Reddit threads, and repo metrics into structured monitor batches and then into two markdown artifacts tailored to Product Strategy. For example, a single Reddit speculation post, two GitHub repo snapshots, and five benchmark leaderboard rows are distilled into a scannable executive summary with per-signal confidence scores, so a VP does not have to visit 13 separate websites each morning.
- It outperforms manual monitoring on cadence and consistency because every source bundle is fetched, normalized, diffed, and analyzed the same way each day. When the Gemini release-notes page adds a new dated entry, the pipeline detects the content-hash change, runs the monitor agent only on the changed bundle, and surfaces the new entry as a structured signal, all before the workday starts.
- Its structure improves clarity by separating factual source monitoring from the second-pass strategic interpretation and risk scoring. The raw report preserves per-source evidence and confidence, while the strategy brief synthesizes across sources and assigns a 1-to-100 risk score with explicit rationale, so the reader can drill down from strategic headline to underlying evidence.
- The eval layer gives explicit visibility into prompt regressions and extraction quality rather than relying on qualitative judgment alone. Each of the 13 monitor agents, the report writer, and the strategy writer has a dedicated JSONL eval dataset and model-graded rubric, so a prompt change that degrades extraction quality is caught before it ships to production.
- The system includes a lightweight web frontend built with Next.js App Router that surfaces the latest raw intelligence report, strategy brief, risk score, and per-source collection health cards, so Product Strategy can check the dashboard without opening markdown files.

### Eval examples

Each agent has a JSONL eval dataset fed to the OpenAI Evals API. Three representative cases:

**Claude Code changelog monitor eval** — input bundle: `"Claude Code 2.1.86 adds support for Claude Sonnet 4.6 and improves slash-command reliability."` Expected: `is_material: true`, `competitor: "anthropic"`, `signal_type: "official_update"`. The model-graded rubric checks whether the monitor correctly captures dated release changes and model support updates without inventing roadmap claims. Failure: inventing an unsupported claim like "Claude Code now supports GPT models" would score 0.0.

**Scale SWE-bench Pro monitor eval** — input bundle: explicit leaderboard rows `[{rank:1, vendor:"OpenAI", model:"GPT-5.4", score:74.2}, {rank:2, vendor:"Anthropic", model:"Claude Sonnet", score:71.8}]` with no prior snapshot. Expected: `is_material: false` (because initial snapshot without movement is not strategically material), `competitor: "market"`, `signal_type: "benchmark_shift"`. The rubric checks whether the monitor extracts ranks and scores accurately and flags ambiguity instead of fabricating benchmark movement. Failure: asserting "OpenAI widened its lead" when no prior snapshot exists would score 0.0.

**Strategy writer eval** — input: a raw report summarizing enterprise messaging changes and mixed benchmark signals. Expected: risk score between 35 and 70, output must contain the phrases "Risk score", "What OpenAI should focus on", and "Supporting evidence". The rubric checks whether the memo separates fact from inference, provides practical recommendations, and assigns a justified risk score within the dataset bounds. Failure: a risk score of 85 driven entirely by Reddit speculation would score 0.0 because the scoring rules cap rumor-only evidence at 60.

## 10. Where the Agent Fails

- The system is brittle to third-party leaderboard markup changes because benchmark pages are not standardized. A concrete failure mode is that a changed leaderboard table layout can still fetch successfully but yield weak or incomplete row extraction.
- Community monitoring can overstate relevance if Reddit speculation spikes around an unconfirmed launch. To mitigate that, the strategy prompt and scoring rules explicitly cap rumor-only influence.
- Perplexity’s public web surface is less structured than a conventional changelog, so extracting clean launch deltas is harder than with a stable docs or release-note feed.
- The current production path depends on public web fetches and can fail or degrade when a source blocks automated requests, changes anti-bot behavior, or serves inconsistent markup.
- A concrete failure that was fixed during implementation: the earlier pipeline silently used fixture payloads when live fetches failed, which made reports look complete while containing synthetic findings. The fix was to mark such runs as partial, emit explicit collection-health warnings, and suppress fake fallback findings.

