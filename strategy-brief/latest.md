# Strategy Memo: Competitive Watch (2026-03-30)

## Headline
Competitors are sharpening **agentic execution + tool/web workflows** (Perplexity search controls + real-time web execution; Google Chrome side-panel auto-browse; Anthropic’s agentic coding “smartest” upgrade) while benchmark visibility for the most decision-relevant agent coding metric (Scale SWE-bench Pro) remains unclear. OpenAI should prioritize **agent reliability, controllable tool/web behavior, and measurable agent-coding performance**—and harden messaging/guardrails around model behavior changes.

## What changed
- **Anthropic**
  - **Opus 4.6** positioned as an upgraded “smartest model” spanning **agentic coding, computer use, tool use, search, and finance**.
  - **Claude remains ad-free** (trust positioning).
  - **$100M** into Claude Partner Network / institute / Asia-Pacific expansion.
- **Google Gemini**
  - **Personal Intelligence beta** (consumer apps context).
  - **Gemini 3.1 Pro** global rollout and **Deep Think** upgrade for Ultra.
  - **Chrome side-panel + auto-browse preview (US)** for Pro/Ultra.
- **Perplexity**
  - **Search API controls**: new `max_tokens` extraction cap and `last_updated_filter`.
  - **More agentic web execution**: multi-step search + URL fetching and **real-time thought streaming**.
  - **Embedding**: release of `pplx-embed-v1` and `pplx-embed-context-v1` for web-scale retrieval.
- **Benchmarks / measurement**
  - **Scale SWE-bench Pro + LiveBench**: no defensible row-level monitoring available in this run.
  - **LMSYS Arena**: single-point top-10 capture shows **Anthropic and Gemini leading**, with **OpenAI models present (top ~10)**.
  - **Artificial Analysis**: single-point excerpt shows a **tie between Gemini and OpenAI** at the top (based on extracted excerpt quality).

## What OpenAI should focus on
1. **Agentic tool + web execution “control surface”**
   - Competitive pressure is moving toward **fine-grained controls** (freshness, extraction limits) and **predictable multi-step browsing/execution**.
   - Action: ensure OpenAI’s agent tooling exposes comparable primitives (where applicable) such as freshness constraints, extraction caps, and deterministic tool orchestration patterns.

2. **Reliability of coding agents on the most decision-relevant metric**
   - Since Scale SWE-bench Pro is not monitorable here, treat it as a **measurement risk** and invest in internal gating.
   - Action: run internal/regression suites targeting **coding-agent task success**, tool-use robustness, and failure-mode taxonomy (hallucinated edits, broken dependencies, brittle test loops).

3. **Browser/side-panel style distribution paths (distribution ≠ capability)**
   - Chrome side-panel auto-browse previews increase user access to agentic browsing.
   - Action: evaluate where OpenAI can offer similar “in-product” surfaces (partnered workflows, browser extensions, or platform embeddings) without sacrificing safety/compliance.

4. **Messaging + trust posture around model behavior changes**
   - Community signals highlight operational issues (e.g., prompt/KV-cache interactions) that can degrade developer confidence.
   - Action: tighten developer-facing documentation and provide “behavior invariants” or configuration guidance for agent caching and prompt/tool mutation.

## Defensive posture
- **Benchmark monitoring resilience**: fix/augment monitoring for **Scale SWE-bench Pro** and **LiveBench** (row-level capture, historical baselines, deltas). This is necessary to convert “we’re safe” into “we’re ahead” with evidence.
- **Agent safety + predictability**: strengthen guardrails for multi-step web execution (content freshness, extraction bounding, and tool-results validation).
- **Developer trust**: proactively address cache/prompt mutation transparency issues and provide mitigation recipes.
- **Do not over-index on single-point leaderboards** (Arena/Artificial Analysis excerpts have no delta context here). Use them as directional signals only.

## Risk score and rationale
**Risk score: 66 / 100**
- **Why not higher (>70):** this run lacks defensible movement evidence on **Scale SWE-bench Pro** and **LiveBench** (the most decision-relevant coding-agent benchmarks). Several leaderboard captures are **single-point** without deltas.
- **Why still elevated (~mid-60s):** multiple competitors have **explicit, official changes** that directly strengthen **agentic workflows** (Perplexity’s Search API controls + real-time multi-step execution; Gemini’s Chrome auto-browse; Anthropic’s Opus 4.6 agentic positioning). These are credible capability vectors that can translate into user outcomes even before benchmark deltas are observable.

**Confidence: 0.62** (facts are strongest for official release-note/changelog items; benchmark movement is weak/uncertain due to capture limitations.)

## Supporting evidence
- **Anthropic (official):** “We’re upgrading our smartest model… Across agentic coding, computer use, tool use, search, and finance, Opus 4.6…”; also “Claude will remain ad-free…”, and $100M investment into Claude ecosystem (published 2026-03-12).
- **Google (release notes):** Personal Intelligence beta; Gemini 3.1 Pro global rollout; Deep Think upgrade for Ultra; **Chrome side-panel + auto-browse preview (US)** for Pro/Ultra.
- **Perplexity (docs changelog):** new `max_tokens` and `last_updated_filter` parameters; multi-step web execution + “real-time thought streaming”; crawler media upgrade logic.
- **Perplexity (research release):** `pplx-embed-v1` and `pplx-embed-context-v1` for web-scale retrieval.
- **Benchmarks limitations:** Scale SWE-bench Pro and LiveBench could not be extracted at row-level; Arena/Artificial Analysis provided single-point excerpts without deltas.
