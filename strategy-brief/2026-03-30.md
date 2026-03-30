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
