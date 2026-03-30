# Raw Competitor Intelligence Report — 2026-03-30

## Executive summary
- **Anthropic (Claude/Claude Code ecosystem)**: Official news highlights several **high-intent moves**: keeping **Claude ad-free** while expanding access, framing **Opus 4.6** as a top-performing “smartest model” across agentic work, and multiple enterprise/capability expansions (e.g., **$100M Claude Partner Network** investment and **Vercept acquisition** for computer use).
- **Gemini (Google)**: Release notes emphasize **product surface expansion** (memory/chat-history import, connected apps “Personal Intelligence” beta) and **model upgrades** (notably **Gemini 3.1 Pro global rollout** and **Gemini 3 Deep Think** upgrade for AI Ultra).
- **Perplexity (Comet/Search API + embeddings)**: Changelog signals **developer workflow improvements** for the Search API (token/cost controls, freshness filtering, SDK compatibility, auto routing, multi-step fetch execution), plus a **new embeddings-model release** noted in the Perplexity Research articles index.
- **Benchmark signals (agentic performance)**: In *supporting* agent-benchmark context (not SWE-agent risk): **Artificial Analysis AA-AgentPerf** shows **Gemini 3.1 Pro Preview** and **GPT-5.4 (xhigh)** tied at the top (score **57**) with **Claude Opus 4.6 (max)** at **53**.
- **Market leaderboards**: **LMSYS Arena (Text)** currently places **Claude Opus 4.6 variants** at the very top, followed closely by **Gemini**, then **Grok/GPT** in the top-10. No movement can be confirmed vs prior because this run lacked a prior snapshot.
- **OpenAI baseline (context)**: OpenAI Models API shows an active lineup centered on **GPT-5.x** plus **Codex** variants and **search/realtime/audio/image/TTS** endpoints; safety/security updates include a **Safety Bug Bounty** and Model Spec approach.

## Official competitor signals
### Anthropic — official announcements (material)
**Source:** Anthropic Newsroom (https://www.anthropic.com/news)
- **Claude remains ad-free while expanding access** (high strategic relevance; **confidence 0.68**)
  - Evidence: “**We’ve made a choice: Claude will remain ad-free.**” + “**advertising incentives are incompatible**…” + “**expand access without compromising user trust**.”
- **Opus 4.6 upgrade framed as industry-leading across agentic work** (high; **confidence 0.60**)
  - Evidence: “**We’re upgrading our smartest model.**” + “Across **agentic coding, computer use, tool use, search, and finance**…”
- **$100M investment into Claude Partner Network** (high; **confidence 0.55**; published **2026-03-12**)
  - Evidence: “**Anthropic invests $100 million into the Claude Partner Network**”
- **Introducing The Anthropic Institute** (medium; **confidence 0.45**; published **2026-03-11**)
- **Sydney becomes Anthropic’s 4th Asia-Pacific office** (medium; **confidence 0.50**; published **2026-03-10**)
- **Anthropic acquires Vercept to advance Claude computer-use capabilities** (high; **confidence 0.60**; published **2026-02-25**)

**Noteworthy absence / uncertainty:** No previous snapshot was provided, so these are treated as **new observations** rather than deltas.

### Gemini — release notes (material)
**Source:** Gemini release notes (https://gemini.google/release-notes/)
- **Import “memories” + full chat history via switching tools** (high; **confidence 0.78**; rollout starting **2026-03-26**)
  - Evidence: switching tools to import memories/chat history; notes include “**ZIP upload of chat history from other providers**” and “rename past chats → memories.”
- **Gemini 3.1 Pro global rollout in Gemini app** (high; **confidence 0.80**; rollout starting **2026-02-19**)
  - Evidence: “**Gemini 3.1 Pro** … rollout globally … higher limits for **AI Pro/Ultra**.”
- **Gemini 3 Deep Think major upgrade for AI Ultra subscribers** (medium; **confidence 0.74**; starting **2026-02-12**)
- **Gemini in Chrome refresh + side panel + auto-browse preview (U.S., AI Pro/Ultra)** (medium; **confidence 0.70**; starting **2026-01-28**)
  - Evidence: auto browse preview in U.S.; not available yet for Workspace business/education plans (per notes).
- **Personal Intelligence beta connecting to Google apps (U.S., AI Pro/Ultra)** (medium; **confidence 0.73**; starting **2026-01-20**)
  - Evidence: connections to Gmail/Photos/YouTube/Search; “off by default with user control”; not for Workspace business/education.

**Noteworthy absence / uncertainty:** No prior snapshot available → **no confirmed movement**.

### Perplexity — Comet/Search changelog + embeddings (material)
**Sources:**
- Perplexity Docs changelog: https://docs.perplexity.ai/docs/resources/changelog
- Perplexity Research articles index: https://research.perplexity.ai/articles

**Changelog (developer workflow & agentic execution):**
- **`max_tokens` for response size/cost control** (high; **confidence 0.74**)
  - Evidence: “**New max_tokens parameter**… finer control over response size and costs.”
- **`last_updated_filter` for freshness filtering** (high; **confidence 0.70**)
- **Search API compatible with Vercel AI SDK** (medium; **confidence 0.68**)
- **Multi-step web searches + URL content fetching for complex queries** (high; **confidence 0.66**)
- **Real-time thought streaming** (medium; **confidence 0.60**)
- **`search_type: "auto"` intelligent routing** (medium; **confidence 0.62**)
- **MCP/IDE setup improvements** (Cursor, VS Code MCP extension, Claude Desktop/Code JSON) (medium; **confidence 0.63**)
- **Expanded typed/streaming API experience (async iterators, types, env var handling)** (medium; **confidence 0.64**)

**Embeddings signal:**
- **Release of `pplx-embed-v1` and `pplx-embed-context-v1`** (high; **confidence 0.78**; noted as Feb 26, 2026)
  - Evidence: “Today we are releasing pplx-embed-v1 and pplx-embed-context-v1” and “built for real-world, web-scale retrieval.”

**Noteworthy absence / uncertainty:** No prior snapshot available → **new items only**.

## Leaderboard and benchmark overview
> Per instruction: **Prioritize Scale SWE-bench Pro for coding-agent risk** (but treat it carefully when evidence is missing), then **LiveBench**, **LMSYS Arena**, and **Artificial Analysis**; **LLM Stats** is supporting context unless it has explicit structured scores.

### 1) Scale SWE-bench Pro (coding-agent risk) — no usable structured rows
- **Status:** *No material change signal extracted.*
- **Reason:** Loaded bundle did **not include parseable current public leaderboard rows/scores** (previous snapshot not available).
- **Evidence note:** Extractor found narrative context + two isolated example lines (not clearly mapped to leaderboard table format), so **rank/score movement cannot be asserted**.

### 2) LiveBench — no leaderboard rows extracted
- **Status:** *No usable benchmark deltas.*
- **Reason:** Extracted leaderboard rows/scores count was **0**; previous snapshot was null.

### 3) LMSYS Arena (Text) — current top-10 preference ordering (no movement vs prior)
**Source:** https://lmarena.ai/leaderboard
- **Signal:** Claude leads the **Text** top-10; Gemini close behind; Grok/GPT appear in top-10.
- **Evidence (top-10 excerpt from current snapshot):**
  1. Anthropic **claude-opus-4-6-thinking** — Score **1504**
  2. Anthropic **claude-opus-4-6** — Score **1500**
  3. **gemini-3.1-pro-preview** — Score **1493**
  4. **grok-4.20-beta1** — Score **1491**
  5. **gemini-3-pro** — Score **1486**
  6. **gpt-5.4-high** — Score **1484**
  7. **grok-4.20-beta-0309-reasoning** — Score **1483**
  8. **gpt-5.2-chat-latest-20260210** — Score **1480**
  9. **gemini-3-flash** — Score **1474**
  10. Anthropic **claude-opus-4-5-20251101-thinking-32k** — Score **1474**
- **Confidence:** **0.62** (directional; no prior snapshot)

### 4) Artificial Analysis — AA-AgentPerf (agent workloads) — structured top scores available
**Source:** https://artificialanalysis.ai/
- **Top tie:** **Gemini 3.1 Pro Preview** and **GPT-5.4 (xhigh)** both at **57** (rank **1**) (confidence **0.74**)
- **Next tier shown:**
  - **Claude Opus 4.6 (max): 53** (rank 3)
  - **Claude Sonnet 4.6 (max): 52** (rank 4)
  - **GLM-5: 50** (rank 5)
  - **Grok 4.20 Beta 0309: 48** (rank 6)
- **Important caveat (data quality):** Extraction shows potential duplicates/inconsistencies for some lower-tier open-weight/accelerator lines, limiting interpretability beyond the clearest top-of-board numbers.

### 5) LLM Stats — supporting context only (index-like, not full structured scores)
- **Status:** Used only as supporting context; no structured leaderboard updates were extracted.
- **Evidence highlights:** Category counts (e.g., Coding 45, Tool Calling 19, Long Context 29, Image Understanding 104, etc.) and featured benchmark cards (GPQA/MMLU Pro/AIME 2025) showing recurring OpenAI/Google presence plus additional vendors in MMLU Pro.

## Community buzz
**Sources:** Reddit (LocalLLaMA) + GitHub repo metrics

### Reddit (directional / perception-sensitive)
- **TurboQuant vs RaBitQ technical dispute** (high relevance; **confidence 0.45**)
  - Evidence: claims methods/theory/empirical comparison incomplete; references OpenReview thread and timeline.
- **Claude Code “KV-cache invalidation”/telemetry prompt mutation claim** (medium; **confidence 0.35**)
  - Evidence: post alleges dynamic telemetry + git status injection causes prompt reprocessing instead of KV reuse; includes suggested env toggles; **not independently verified** in this bundle.
- **llama.cpp ~100k stars (momentum)** (medium; **confidence 0.65**)
- **Local semantic video search workflow (Qwen3-VL Embedding locally)** (medium; **confidence 0.55**)
- **Local agentic coding narrative (Qwen3.5-27B + OpenCode tool calling)** (high; **confidence 0.60**)
- **TurboQuant on Android (ARM) readiness/integration issue claim** (medium; **confidence 0.40**)

### GitHub momentum indicators (not proof of quality)
Captured repo metrics at **2026-03-30**:
- **anthropics/anthropic-sdk-typescript** — 1779 stars, 261 forks, 116 open issues, 165 watchers
- **anthropics/claude-cookbooks** — 36722 stars, 3988 forks, 88 open issues, 502 watchers
- **googleapis/js-genai** — 1532 stars, 233 forks, 238 open issues, 30 watchers
- **google-gemini/gemini-cli** — 99562 stars, 12740 forks, 3279 open issues, 526 watchers

## OpenAI baseline
### OpenAI API / product baseline (material)
**Sources:**
- OpenAI Models API: https://api.openai.com/v1/models
- OpenAI News RSS: https://openai.com/news/rss.xml

**Model lineup snapshot (anchored to Models API; no prior snapshot for delta):**
- **GPT-5.x family** with tiered derivatives (e.g., **gpt-5.4**, **gpt-5.4-pro**, plus **mini/nano** variants and dated aliases)
- **Codex developer models:** **gpt-5.3-codex**, **gpt-5.2-codex**
- **Search tooling:** **gpt-4o-search-preview** (plus older alias)
- **Real-time/audio/image/TTS endpoints** (examples captured): **gpt-realtime-1.5**, **gpt-audio-1.5**, **chatgpt-image-latest**, **gpt-4o-mini-tts***
- **Confidence:** **0.72** for lineup characterization

**Safety/program signals (RSS items):**
- **Model Spec approach** and safety monitoring updates (e.g., internal coding agents misalignment monitoring) (published **2026-03-25**) 
- **Safety Bug Bounty program** introduced/published (published **2026-03-25**)
- **Sora safety approach** emphasized (published **2026-03-23**)

**Noteworthy caveat:** For this run, **no prior snapshot** was provided, so these are marked as **new observations** rather than confirmed changes.

## Confidence and caveats
- **Benchmark confidence is constrained by missing/failed leaderboard extraction**:
  - Scale SWE-bench Pro and LiveBench did not yield structured rows/scores in the loaded bundle → **no coding-agent risk delta** can be computed.
  - LMSYS Arena and Artificial Analysis provide usable snapshot evidence, but **no prior snapshot** means **no movement** attribution.
- **Artificial Analysis extraction caveat**: inconsistent/duplicate numeric lines appear for some models → only clearly interpretable **top-of-board** values were used for structured snapshots.
- **Community buzz is directional**: Reddit posts include technical disputes and integration friction claims; they are **not independently verified** within this dataset.
- **Changelog/news diffs**: Where **previous_snapshot is null**, the report treats items as **new observations** (not deltas).

**Overall confidence (by section):**
- Official competitor signals: **Moderate–High** (based on direct evidence snippets from official sources)
- Market leaderboard/benchmarks: **Moderate** (snapshot evidence exists, but movement/deltas often can’t be computed)
- Community buzz: **Low–Moderate** (high signal density but lower verification)