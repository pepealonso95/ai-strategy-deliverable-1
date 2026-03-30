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
- **OpenAI baseline:** Live model list indicates an **active GPT 5.4 family** with **dated variants** plus **realtime/audio/TTS/image/search-preview** model packaging.

---

## Official competitor signals

### Anthropic (anthropic.com/news) — **Material**
**Signals (all treated as new; no prior snapshot):**
1. **Sonnet 4.6 + Opus 4.6 performance positioning** (confidence 0.74)
   - Evidence:
     - “Sonnet 4.6 delivers **frontier performance** across coding, agents, and professional work at scale.”
     - “Across **agentic coding, computer use, tool use, search, and finance**, Opus 4.6 … often by wide margin.”
   - Source: https://www.anthropic.com/news

2. **Claude remains ad-free** (confidence 0.70)
   - Evidence: “Claude will **remain ad-free**… advertising incentives are incompatible with a genuinely helpful assistant… plan to expand access without compromising user trust.”
   - Source: https://www.anthropic.com/news

3. **$100M investment into Claude Partner Network (Mar 12, 2026)** (confidence 0.68)
   - Evidence: “Anthropic invests **$100 million** into the Claude Partner Network”
   - Source: https://www.anthropic.com/news

4. **The Anthropic Institute (Mar 11, 2026)** (confidence 0.50)
   - Evidence captured only at headline/index level (“Introducing The Anthropic Institute”); detailed content not present in the snippet.
   - Source: https://www.anthropic.com/news

5. **Sydney as 4th Asia-Pacific office (Mar 10, 2026)** (confidence 0.62)
   - Evidence captured only at headline/index level.
   - Source: https://www.anthropic.com/news

6. **Mozilla partnership for Firefox security improvements (Mar 6, 2026)** (confidence 0.56)
   - Evidence captured only at headline/index level.
   - Source: https://www.anthropic.com/news

**Non-material / no extractable dated release-text:**
- **Claude Code changelog monitor:** marked **non-material** because only changelog index/version links were captured; **no dated change text** to verify.

---

### Gemini (gemini.google/release-notes/) — **Material**
**Signals (all treated as new; no prior snapshot):**
1. **Consumer switching/import tools: memories + full chat history** (confidence 0.78)
   - Evidence:
     - Rolling out “**switching tools**” in Settings for all consumer accounts to “**import… full chat history**.”
     - Renaming “**past chats**” → “**memories**… roll out… over the next few weeks.”
   - Source: https://gemini.google/release-notes/ (dated 2026-03-26)

2. **Gemini 3.1 Pro global rollout** with higher limits for AI Pro/Ultra (confidence 0.82)
   - Evidence:
     - “releasing **3.1 Pro**”
     - “**rolling out globally** to the Gemini app… with **higher limits** for… AI Pro and Ultra plans.”
     - Access via model dropdown “**Pro**.”
   - Source: https://gemini.google/release-notes/ (dated 2026-02-19)

3. **Gemini 3 Deep Think major upgrade** for AI Ultra subscribers (confidence 0.78)
   - Evidence: “major upgrade to **Gemini 3 Deep Think**… available to Google AI Ultra Subscribers… select ‘**Deep Think**’ in the prompt bar.”
   - Source: https://gemini.google/release-notes/ (dated 2026-02-12)

4. **Gemini in Chrome updates + auto-browse preview (US)** (confidence 0.74)
   - Evidence:
     - “major updates… new **side panel**… deeper Google apps integration”
     - “preview of **auto browse**… rolling out in **U.S.** to Google AI Pro and Ultra.”
     - Not available for Google Workspace business/education (support link in evidence).
   - Source: https://gemini.google/release-notes/ (dated 2026-01-28)

5. **Personal Intelligence app connectivity beta** (confidence 0.77)
   - Evidence:
     - “connect Gemini to your Google apps—including **Gmail, Photos, YouTube, and Search**”
     - “rolling out… to **Google AI Pro and AI Ultra** subscribers in the **U.S.**”
     - “not yet available to Google Workspace business/education.”
   - Source: https://gemini.google/release-notes/ (dated 2026-01-20) + support link(s)

**Non-material:**
- **Gemini blog monitor:** non-material (bundle contained only blog index/navigation text; no dated post contents extractable).

---

### Perplexity (docs.perplexity.ai changelog) — **Material**
**Signals (all treated as new; no prior snapshot):**
1. **Perplexity Crawlers: media-aware controls** (confidence 0.72)
   - Evidence: automatic detection for when visual content adds value; configurable media types; new **max_tokens** extraction control.
   - Source: https://docs.perplexity.ai/docs/resources/changelog

2. **last_updated_filter** (confidence 0.76)
   - Evidence: filter search by “**when content was last updated**,” not just publication date.
   - Source: https://docs.perplexity.ai/docs/resources/changelog

3. **Search API compatible with Vercel AI SDK** (confidence 0.70)
   - Evidence: “Search API is now compatible with the **Vercel AI SDK**…”
   - Source: https://docs.perplexity.ai/docs/resources/changelog

4. **Agentic search execution: multi-step + tools + streaming** (confidence 0.78)
   - Evidence: automatic multiple searches + URL content fetch; “real-time thought streaming”; routing via `search_type: "auto"`; built-in tools like `web_search` and `fetch_url_content` used automatically.
   - Source: https://docs.perplexity.ai/docs/resources/changelog

5. **MCP + IDE integration setup improvements** (confidence 0.65)
   - Evidence: cursor auto-config, VS Code MCP extension, Claude Desktop/Code JSON configuration.
   - Source: https://docs.perplexity.ai/docs/resources/changelog

6. **Document analysis & extraction across formats** (confidence 0.74)
   - Evidence: Q&A over docs + extracting key info; supports PDF/Word/text/Rich Text; large doc handling and multi-language.
   - Source: https://docs.perplexity.ai/docs/resources/changelog

7. **“Search-only” application mode** (confidence 0.80)
   - Evidence: direct access to search index without generating AI responses; framed as faster since no LLM processing.
   - Source: https://docs.perplexity.ai/docs/resources/changelog

**Non-material / lower confidence context:**
- Perplexity Research blog monitor: only listing-level mention of embedding model releases (no full dated details extractable beyond the headline).

---

## Leaderboard and benchmark overview (prioritizing coding-agent risk)

### Priority 1: **Scale SWE-bench Pro** (coding-agent risk) — *insufficient extract quality*
- **No prior snapshot** to compute movement.
- Extracted evidence includes only **narrative/partial rows**, not a fully parseable ranked table.
- Captured leaderboard-like rows:
  - **Claude Opus 4.5** (“claude opus 4 5 20251101”): **score 45.89**, **rank 1** (captured 2026-03-30) — *rank ambiguous due to parse artifact*.
  - **Claude 4.5 Sonnet**: **score 43.6**, **rank 1** (captured 2026-03-30) — *rank ambiguous due to parse artifact*.
- Source: https://labs.scale.com/leaderboard/swe_bench_pro_public

**Callout:** Rank reporting is marked **ambiguous** in the structured output; treat these as *directional* only.

---

### Priority 2: **LiveBench**
- **No material benchmark data extracted** (0 leaderboard rows/scores captured).
- **No prior snapshot**.

**Actionable conclusion:** No LiveBench movement/position claims possible from this run.

---

### Priority 3: **LMSYS Arena** (Text preference leaderboard)
- **No prior snapshot** to compute movement.
- Current extracted evidence (Text leaderboard):
  - **#1:** Anthropic **claude-opus-4-6-thinking** — **Score 1504**, **Votes 12,730** (confidence 0.72)
  - **#2:** Anthropic **claude-opus-4-6** — **Score 1500**, **Votes 13,553** (confidence 0.72)
  - **#3:** Gemini **gemini-3.1-pro-preview** — **Score 1493**, **Votes 15,809** (confidence 0.70)
  - **Top 5 mix:** Anthropic (#1–#2), Gemini (#3 and #5), Grok (#4) (confidence 0.66)
  - **Top 10 includes OpenAI/Grok:** **gpt-5.4-high (#6)** and **grok-4.20-beta-0309-reasoning (#7)** (confidence 0.64)
- Source: https://lmarena.ai/leaderboard

**Interpretation caveat:** Arena is **preference-based** (not direct coding-agent benchmark), but it’s a strong public perception proxy.

---

### Priority 4: **Artificial Analysis**
- **First snapshot** (no prior snapshot to compute movement).
- Visible leaderboard excerpt (“Intelligence”):
  - **Rank 1 tie at 57:** **Gemini 3.1 Pro Preview** and **GPT-5.4 (xhigh)** (confidence 0.72)
  - **Claude:** Opus 4.6 (max) **53** (rank 2), Sonnet 4.6 (max) **52** (rank 3) (confidence 0.70)
  - Next cluster: **GLM-5 = 50** (rank 4), **Grok 4.20 Beta 0309 = 48** (rank 5) (confidence 0.66)
- Source: https://artificialanalysis.ai/

**Important caveat:** Extraction notes mention **conflicting/unclear additional numeric rows** (e.g., duplicate Claude with different values; large/variable entries like “Nemotron 3 Super: 367”), so only the **explicit top excerpt** should be trusted without full dashboard context.

---

### LLM Stats (supporting context; not a primary coding-agent risk benchmark)
- Treated as **supporting context**: page is an **index/directory with featured benchmark cards**, not a single consolidated leaderboard.
- No prior snapshot.
- Featured card evidence captured:
  - **GPQA rank 1 score 94.3** includes **Gemini 3.1 Pro** and OpenAI GPT 5.2/5.4 variants in top positions.
  - **AIME 2025** shows **100.0** for **GPT 5.2 Pro**, **GPT 5.2**, and **Gemini 3 Pro**.
  - **MMLU Pro** featured card shows cross-vendor top entries (MiniMax/Qwen/Kimi/ERNIE), though one parsed string appears inconsistent.
- Source: https://llm-stats.com/benchmarks

---

## Community buzz

### Overall
- **No prior snapshot** to diff changes.
- Evidence is **directional**; Reddit posts are lower-confidence unless they include corroborating links to repos/papers.

### High-signal: TurboQuant vs RaBitQ dispute (confidence 0.42)
- Claim: RaBitQ author alleges TurboQuant’s public description/guarantees/efficiency comparison is **materially incomplete or inaccurate**, citing missing methodological links and experimental disclosure issues; OpenReview thread linked.
- Source: https://www.reddit.com/r/LocalLLaMA/comments/1s7nq6b/technical_clarification_on_turboquant_rabitq_for/

### Local inference acceleration / integration momentum
- **Apple Neural Engine (ANE) backend for llama.cpp** shared as emerging acceleration path; includes claimed performance language (confidence 0.55).
  - Source: https://www.reddit.com/r/LocalLLaMA/comments/1s835d5/new_apple_neural_engine_ane_backend_for_llamacpp/
- **TurboQuant on Android** reported as not ready (integration gap: missing GGML type registration; upstream PRs open) (confidence 0.50).
  - Source: https://www.reddit.com/r/LocalLLaMA/comments/1s8178n/i_tried_to_benchmark_turboquant_on_android/

### Tooling & safety-adjacent community projects
- **“Totem” open-source proxy** for detecting local model tampering/steering via signed baselines (confidence 0.60).
  - Source: https://www.reddit.com/r/LLM/comments/1s7k0y7/totem_opensource_proxy_that_detects_if_your_local/

### Dev workflow themes (MCP/context compression)
- **MCP Slim proxy** claims large context savings by retrieving only relevant tool schemas via semantic tool search (confidence 0.52).
  - Source: https://www.reddit.com/r/LocalLLaMA/comments/1s7op0d/mcp_slim_proxy_that_saves_96_of_your_context/

### Repo metrics (directional only)
- Captured GitHub snapshots (stars/forks/issues/watchers) for several ecosystem repos, e.g.:
  - `anthropics/anthropic-sdk-typescript` (stars 1779)
  - `anthropics/claude-cookbooks` (stars 36722)
  - `google-gemini/gemini-cli` (stars 99562)
- Source URLs are in the structured output; **no deltas** (no prior snapshot).

---

## OpenAI baseline

### What’s observable (no prior snapshot)
**Evidence from OpenAI Models API:**
1. **GPT 5.4 family active with dated variants**
   - Examples captured:
     - `gpt-5.4`, `gpt-5.4-pro`, including dated suffix variants such as `gpt-5.4-pro-2026-03-05`
     - `gpt-5.4-mini` and `gpt-5.4-nano` with dated suffix variants
     - `gpt-5.3-chat-latest`
   - Source: https://api.openai.com/v1/models

2. **Modality-specialized models visible**
   - Examples: realtime (`gpt-realtime-1.5`, `gpt-realtime-mini-2025-12-15`), audio (`gpt-audio-1.5`), TTS (`gpt-4o-mini-tts-*`), image alias (`chatgpt-image-latest`).
   - Source: https://api.openai.com/v1/models

3. **Search-preview model variants visible**
   - Examples: `gpt-4o-search-preview` and dated variants.
   - Source: https://api.openai.com/v1/models

**Evidence from OpenAI news RSS (operational/eco signals; not pricing/model changes):**
- Safety bug bounty, Model Spec approach, monitoring internal coding agents, Sora safety, acquisition of Astral.
- Source: https://openai.com/news/rss.xml (dated items including 2026-03-25 and 2026-03-19)

**Explicit limit:** The structured output indicates **no unit pricing/tokens extracted** for this run.

---

## Confidence and caveats
- **High-confidence sources (within this run):**
  - **Anthropic newsroom landing/snippet evidence** (headlines and quoted positioning for Sonnet 4.6 / Opus 4.6 and ad-free commitment).
  - **Gemini release notes** (multiple dated entries with explicit rollout details).
  - **Perplexity changelog** (explicit capability statements with controls/tools/parameters).
  - **LMSYS Arena** (explicit score/vote/rank values for top ranks captured).

- **Lower-confidence / extraction-risk sections:**
  - **Scale SWE-bench Pro:** extracted data lacks a clean public ranked-table parse; **rank ambiguous** (“rank=1” appears for multiple entries).
  - **Artificial Analysis:** dashboard extraction likely includes **multiple charts/metrics**; some duplicated/conflicting entries noted—only the visible top excerpt is treated as most defensible.
  - **LLM Stats:** supporting context only; it’s an index/featured-card view and may include parsing quirks (e.g., partially inconsistent MMLU Pro rendering).
  - **Community buzz:** Reddit claims are lower-confidence unless anchored by linked repos/papers; TurboQuant dispute has **method/disclosure allegations** and thus should be treated as contested.

- **No-diff rule impacts:** For many sections, **previous_snapshot was null**, so all signals are treated as **new observations** rather than “changes since last run.”

---

### Sections with **no material changes / no data** in this run
- **LiveBench:** no extracted leaderboard rows/scores.
- **Claude Code changelog monitor:** non-material due to missing dated release note text.
- **Gemini blog index monitor:** non-material because only index/navigation content captured.
