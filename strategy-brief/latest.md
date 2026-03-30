# Strategy Memo: Competitive Watch & Positioning (2026-03-30)

## Headline
Anthropic and Gemini are accelerating **high-intent “agent UX”** (computer-use capability expansion, memory/chat-history portability, connected-app personal intelligence) while Perplexity is improving **developer search agent ergonomics** (freshness + cost controls + multi-step fetching + embeddings). OpenAI’s immediate watch should be less on generic chat quality and more on **agentic workflows, tool/search controllability, and state/memory portability**—especially where benchmarks with coding-agent relevance are strengthening, even if the most decision-critical coding benchmark (Scale SWE-bench Pro) lacked structured deltas in this report.

## What changed
1. **Anthropic (official): agent/computer-use + enterprise ecosystem investment**
   - Claude remains **ad-free** while access expands (trust positioning).
   - **Opus 4.6 upgrade** is explicitly marketed as top-performing across **agentic/tool/computer use/search/finance**.
   - **$100M investment** into the **Claude Partner Network**.
   - **Vercept acquisition** to advance **Claude computer-use** capabilities.

2. **Gemini (release notes): memory + connected-app intelligence + model tier rollout**
   - Rollout of **memory import** and **full chat history import** via tool switching (ZIP import; past chats → memories).
   - **Gemini 3.1 Pro** global rollout in the Gemini app.
   - **Deep Think** upgrade for AI Ultra subscribers.
   - Product surface expansion: Chrome refresh/side panel/auto-browse preview (US), plus “Personal Intelligence” beta connecting to Google apps (off by default, user-controlled).

3. **Perplexity (changelog): developer-grade search agent controls + embeddings**
   - **`max_tokens`** for response size/cost control.
   - **`last_updated_filter`** for freshness filtering.
   - **SDK compatibility** (Vercel AI SDK).
   - **Multi-step web searches + URL content fetching** for complex queries.
   - **Real-time thought streaming**.
   - **`search_type: "auto"` routing**.
   - New embeddings: **`pplx-embed-v1`** and **`pplx-embed-context-v1`**.

4. **Bench/market signals (limited delta visibility)**
   - **Artificial Analysis (AA-AgentPerf)** shows a top tier where **Gemini 3.1 Pro Preview** and **GPT-5.4 (xhigh)** are tied for rank 1 (score 57); **Claude Opus 4.6 (max)** at 53.
   - **LMSYS Arena (Text)** snapshot has Claude Opus 4.6 variants at #1–2, Gemini close behind; but **no prior snapshot** means no movement can be asserted.
   - **Scale SWE-bench Pro** and **LiveBench**: the report could not extract usable structured rows/scores, so **no coding-agent risk delta** can be computed from this run.

## What OpenAI should focus on
1. **Agentic UX parity with “stateful” experiences**
   - Gemini’s memory/chat-history import and Anthropic’s computer-use expansion both increase perceived “stickiness” and autonomy.
   - Focus: make OpenAI’s agent frameworks and product surfaces (Assistants/Agents, tools, retrieval/memory) **portable, controllable, and auditable**.

2. **Tool/search controllability for developers (cost, freshness, routing, multi-step)**
   - Perplexity’s Search API improvements map directly to developer pain: cost predictability (`max_tokens`), recency (`last_updated_filter`), and orchestration (`auto` routing + multi-step fetch).
   - Focus: ensure OpenAI’s search/tooling stack offers similarly crisp developer levers (and strong observability) to compete in agent pipelines.

3. **Computer-use + enterprise ecosystem defensibility**
   - Anthropic’s Vercept acquisition and Partner Network investment point to ecosystem flywheels.
   - Focus: deepen OpenAI’s enterprise partner and integration paths for agent workflows (secure compute, supported deployment patterns, and standardized agent evaluation/telemetry).

4. **Benchmark strategy (given missing SWE-bench Pro deltas)**
   - Treat AA-AgentPerf as partial reassurance (top-tier tie), but **do not assume coding-agent safety/quality parity**.
   - Focus: prioritize internal/regression evals aligned to **Scale SWE-bench Pro** and agentic coding suites with tool-use to regain “decision-grade” confidence.

## Defensive posture
- **Defend state + tool orchestration as first-class product properties** (not just model quality): memory portability, audit trails, permissions, and deterministic cost controls.
- **Increase developer control-plane clarity**: provide explicit parameters and policy surfaces for freshness, budget, routing, and multi-step execution; add strong SDK ergonomics and streaming that support agent UX.
- **Counter ecosystem lock-in**: accelerate enterprise integrations and partner programs with measurable outcomes (time-to-first-agent, reliability SLAs, and security/compliance documentation).
- **Benchmark confirmation loop**: rerun/secure structured extraction for **Scale SWE-bench Pro** and **LiveBench** so that future risk scoring can be tied to actual coding-agent deltas.

## Risk score and rationale
- **Risk score: 62 / 100**
- **Confidence: 0.61**

**Rationale (fact vs inference):**
- **Facts supporting elevated risk:** competitors’ *official* release/changelog items show momentum in (a) stateful memory/chat history, (b) connected-app intelligence, (c) computer-use capability expansion, and (d) developer-grade search agent controls plus embeddings.
- **Why not higher (>70):** this run lacks structured evidence for the most decision-relevant coding benchmark (Scale SWE-bench Pro) and lacks confirmed movement on LMSYS (no prior snapshot). AA-AgentPerf top-of-board includes OpenAI (GPT-5.4 xhigh tied at rank 1), which partially offsets coding-agent concern.
- **Inference:** the risk assumes these product/agent improvements translate into near-term user and developer adoption shifts; that link is plausible but not directly quantified in the report.

## Supporting evidence
- **Anthropic (official news):**
  - Claude remains **ad-free** while expanding access.
  - **Opus 4.6** positioned as “upgrading our smartest model” across agentic/tool/computer/search workflows.
  - **$100M** investment into **Claude Partner Network**.
  - **Vercept acquisition** to advance **computer-use**.
- **Gemini (release notes):**
  - Memory/chat-history import via switching tools; ZIP chat history import; past chats → memories.
  - **Gemini 3.1 Pro** global rollout.
  - Connected-app **Personal Intelligence** beta.
- **Perplexity (changelog + docs):**
  - Search API adds **`max_tokens`**, **`last_updated_filter`**, **multi-step fetch execution**, **`search_type: "auto"` routing**, **Vercel AI SDK compatibility**.
  - Embeddings release: **`pplx-embed-v1`** and **`pplx-embed-context-v1`**.
- **Benchmarks/market (snapshot):**
  - **AA-AgentPerf:** GPT-5.4 (xhigh) tied rank 1 (score 57) with Gemini 3.1 Pro Preview; Claude Opus 4.6 (max) at 53.
  - **LMSYS Arena (Text):** Claude Opus 4.6 variants in top positions; no movement attribution available.
- **Data limitation:** Scale SWE-bench Pro and LiveBench did not yield structured coding-agent rows/scores in this report, preventing a true delta-based coding risk assessment.
