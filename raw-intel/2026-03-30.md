# Raw Competitor Intelligence Report — 2026-03-30

## Executive summary
- **Anthropic (anthropic-news)**: First captured signals—**Opus 4.6** positioned as the upgraded “smartest model” for agentic coding/tool/computer use; reiterated **Claude remains ad-free**; plus **$100M** into the Claude Partner Network, **The Anthropic Institute**, and **Sydney** as a new Asia-Pacific office.
- **Google Gemini (gemini-release-notes)**: Multiple new/rolling rollouts across consumer and Chrome experiences—**Personal Intelligence beta** (context from Google apps), **Gemini 3.1 Pro** global rollout, **upgraded Gemini 3 Deep Think** for Ultra, and **Chrome side-panel + auto-browse preview** (US, Pro/Ultra).
- **Perplexity (perplexity-comet + perplexity-blog)**: Changelog points to stronger **Search API controls** (e.g., `max_tokens`, `last_updated_filter`) and more **agentic web execution** (multi-step searches + URL fetching, real-time thought streaming). Research articles index flags release of **pplx-embed-v1** and **pplx-embed-context-v1** for web-scale retrieval.
- **Market benchmarks snapshot availability**: **No prior baselines** were available for most leaderboards; some sources provided **no row-level data** (notably Scale SWE-bench Pro, LiveBench). Where data exists (Arena + Artificial Analysis), it’s a **single-point capture**.
- **Community buzz**: Mostly LocalLLaMA/Reddit/GitHub activity—directional signals around **local agent tooling** and **TurboQuant/Claude Code integration friction**; single-user claims weighted as lower confidence.

---

## Official competitor signals

### Anthropic — Official announcements (first capture)
Source: https://www.anthropic.com/news
- **Opus 4.6 positioned as upgraded “smartest model”** (confidence **0.66**)  
  Evidence: “We’re upgrading our smartest model. Across agentic coding, computer use, tool use, search, and finance, **Opus 4.6**…”
- **Claude remains ad-free; advertising incentives vs trust** (confidence **0.62**)  
  Evidence: “**Claude will remain ad-free**…”
- **$100M investment into the Claude Partner Network** (published **2026-03-12**, confidence **0.72**)  
  Evidence: “Anthropic invests **$100 million** into the Claude Partner Network”
- **Introducing The Anthropic Institute** (published **2026-03-11**, confidence **0.60**)  
- **Sydney becomes Anthropic’s 4th APAC office** (published **2026-03-10**, confidence **0.60**)

### Claude Code Changelog Monitor
- **No material changelog content extracted** in this bundle (confidence not applicable; flagged as *not material*).  
  Notes indicate only changelog navigation/version links were present, so **no dated workflow/product changes** could be verified.

### Google Gemini — Release notes (new/rolling items)
Source: https://gemini.google/release-notes/
- **Personal Intelligence beta (connect to Google apps)**, US rollout for **Pro/Ultra** (confidence **0.69**)  
  Evidence: connects to Gmail/Photos/YouTube/Search; not yet for Workspace business/education.
- **Gemini 3.1 Pro global rollout** to Gemini app (confidence **0.78**)  
- **Upgraded Gemini 3 Deep Think** for Google AI Ultra subscribers (confidence **0.73**)  
- **Gemini in Chrome major side-panel + auto-browse preview in US for Pro/Ultra** (confidence **0.70**)  
  Evidence: auto-browse preview US; not available for Workspace business/education plans.

### Perplexity — Changelog / Search API & agentic execution
Source: https://docs.perplexity.ai/docs/resources/changelog
- **New `max_tokens` extraction cap** for search page token extraction (confidence **0.78**)  
  Evidence: “New max_tokens parameter: Control the maximum tokens extracted per page…”
- **New `last_updated_filter` for freshness by last updated** (confidence **0.78**)  
  Evidence: “last_updated_filter… Filter… by when content was last updated…”
- **Multi-step web execution + real-time thought streaming** (confidence **0.80**)  
  Evidence: automatic multi web-search + URL fetching; “Real-time thought streaming”; tools mentioned (e.g., `web_search`, `fetch_url_content`).
- **Crawler media upgrades**: auto-detect whether visual content adds value + smart media selection; configurable media types (confidence **0.72**)
- **Developer workflow integrations**: Vercel AI SDK compatibility; MCP/VS Code/Claude Desktop config setup improvements (confidence **0.70**)
- **Document analysis/extraction expanded**: multi-format ingestion + large document handling + multi-language analysis (confidence **0.66**)

### Perplexity — Research articles (embedding model release)
Source: https://research.perplexity.ai/articles
- **Release of `pplx-embed-v1` and `pplx-embed-context-v1`** for “real-world, web-scale retrieval” (confidence **0.78**)  
  Evidence: “Today we are releasing… built for real-world, web-scale retrieval.”

---

## Leaderboard and benchmark overview

### Scale SWE-bench Pro (coding-agent risk priority)
- **No defensible row-level monitoring possible** in this run.  
  Evidence from monitor: extracted content lacked a full leaderboard table; only ambiguous snippets were present.
- **Material change:** *Not reported* (insufficient data).

### LiveBench
- **No leaderboard rows/scores extracted** → no movement signals possible.  
- **Material change:** *Not reported*.

### LMSYS Arena (Text top-10 capture; single-point)
Source: https://lmarena.ai/leaderboard (Arena leaderboard, Text)
- **Top model (#1):** Anthropic `claude-opus-4-6-thinking` — **1504** (votes 12,730)
- **#2:** Anthropic `claude-opus-4-6` — **1500** (votes 13,553)
- **#3:** Gemini `gemini-3.1-pro-preview` — **1493**
- **#4:** xAI `grok-4.20-beta1` — **1491**
- **#5:** Gemini `gemini-3-pro` — **1486**
- **#6:** OpenAI `gpt-5.4-high` — **1484**
- **#7:** xAI `grok-4.20-beta-0309-reasoning` — **1483**
- **#8:** OpenAI `gpt-5.2-chat-latest-20260210` — **1480**
- **#9:** Gemini `gemini-3-flash` — **1474**
- **#10:** Anthropic `claude-opus-4-5-20251101-thinking-32k` — **1474**

**Material change:** *No delta analysis possible* (no prior snapshot provided).

### Artificial Analysis (Intelligence Index excerpt; single-point)
Source: https://artificialanalysis.ai/
- **Rank 1 tie:** Gemini `Gemini 3.1 Pro Preview` — **57**
- **Rank 1 tie:** OpenAI `GPT-5.4 (xhigh)` — **57**
- **Rank 3:** Anthropic `Claude Opus 4.6 (max)` — **53**
- **Rank 4:** Anthropic `Claude Sonnet 4.6 (max)` — **52**
- **Rank 5:** `GLM-5` — **50**
- **Rank 6:** xAI `Grok 4.20 Beta 0309` — **48**

Notes: monitor flags ambiguous repeated/other numeric blocks; only the clearly stated excerpt above is treated as reliable.

**Material change:** *No delta analysis possible* (no prior snapshot provided).

### LLM Stats benchmarks page (context, not structured scores)
Source: https://llm-stats.com/benchmarks
- Monitor reports this page as an **index/directory** with category counts and **featured benchmark tiles** (GPQA, MMLU Pro, AIME 2025) rather than a full structured leaderboard.
- Featured tiles show **cross-vendor visibility** (OpenAI + Google prominently; additional vendors on MMLU Pro), but **no explicit structured score movement** extracted.

---

## Community buzz

Primary sources: Reddit r/LocalLLaMA + GitHub release/momentum snapshots

### TurboQuant / RaBitQ / local implementation contention (lower confidence, single-community claims)
- **Technical clarification request:** RaBitQ first author alleges TurboQuant relationship description/theory/empirical disclosure may be incomplete or inaccurate; points to OpenReview thread (confidence **0.45**).
- **Android/llama.cpp integration friction:** user reports compilation but missing expected TurboQuant type registration in binary; expects upstream PRs later (confidence **0.35**).
- **Research critique draft:** rotation hypothesis discussion around reconstruction vs sparsity tradeoffs; includes repo/draft (confidence **0.30**).

### Developer adoption friction / operational issues
- **Claude Code KV-cache invalidation PSA (high relevance):** post claims Claude Code mutates prompts per request (telemetry + git status), breaking exact KV-cache matching; suggests env/config mitigations (confidence **0.40**).

### Tooling/prodivity narratives (moderate directional signals)
- **MCP “Slim proxy” (~96% context saving claim)** using local semantic search over tool schemas (confidence **0.55**).
- **Local agent workflow report:** user running Qwen3.5-27B as local primary model with OpenCode + MCP context improvements (confidence **0.50**).
- **llamafile v0.10.0 build system update** aligned to newer llama.cpp functionality (confidence **0.60**).

### GitHub momentum snapshot (directional only; not performance proof)
Captured repo stats include:
- anthropics/anthropic-sdk-typescript (stars 1779, forks 261)
- anthropics/claude-cookbooks (stars 36721, forks 3988)
- googleapis/js-genai (stars 1532, forks 233)
- google-gemini/gemini-cli (stars 99561, forks 12740)

---

## OpenAI baseline (product + pricing baseline)

Source bundles:
- OpenAI News RSS: https://openai.com/news/rss.xml
- Models API list: https://api.openai.com/v1/models

### OpenAI official signals captured (news)
- **Safety Bug Bounty program** (published **2026-03-25**, confidence **0.70**)
- **Public framework: “Inside our approach to the Model Spec”** (published **2026-03-25**, confidence **0.66**)
- **Teen safety policies for developers using `gpt-oss-safeguard`** (published **2026-03-24**, confidence **0.65**)
- **Creating with Sora Safely** (published **2026-03-23**, confidence **0.60**)
- **Disaster response workshop in Asia** (published **2026-03-29**, confidence **0.55**, lower strategic relevance)

### OpenAI API model lineup (Models API list)
Captured active model IDs include:
- **GPT-5.4 family variants** (e.g., `gpt-5.4`, `gpt-5.4-pro`, `gpt-5.4-mini`, `gpt-5.4-nano`, plus dated snapshots) — confidence **0.78**
- **Audio + realtime endpoints** (e.g., `gpt-audio-1.5`, `gpt-realtime-1.5`, mini variants, TTS mini) — confidence **0.74**
- **Coding/developer variants** (e.g., `gpt-5.3-codex`, `gpt-5.2-codex`) — confidence **0.65**
- **Search preview + image alias** (`gpt-4o-search-preview`, `chatgpt-image-latest`) — confidence **0.66**

**Material change:** *No diff vs prior snapshot possible* (previous snapshot not provided).

---

## Confidence and caveats
- **Baseline/delta limitations:** Many monitors report **no previous snapshot** (previous_snapshot=null). Where that’s the case, this report treats items as **new observations** and **does not assert movement**.
- **Benchmark data quality varies by source**:
  - **Scale SWE-bench Pro** and **LiveBench**: insufficient extraction for row-level conclusions.
  - **Arena** and **Artificial Analysis**: provided **single-point excerpts**; no deltas.
  - **LLM Stats**: treated as **contextual** (index/featured tiles), not as structured score truth.
- **Community buzz weighting:** Reddit/GitHub signals are **directional** and often **single-reporter**. Some items are operationally useful (e.g., KV-cache PSA) but should not be treated as definitive across the ecosystem.
- **Claude Code changelog:** the bundle appears to lack actual entry text (only navigation/version links), so **no product/workflow changes** were verified from that monitor in this run.
