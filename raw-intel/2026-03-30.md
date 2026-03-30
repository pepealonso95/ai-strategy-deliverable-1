# OpenAI Competitor Intelligence Report - 2026-03-30

## Executive summary

- 12 monitored source bundles produced material findings.
- This report preserves official competitor updates, benchmark movement, community buzz, and OpenAI baseline context.

## Official competitor signals

## Claude Code changelog

Fixture mode enabled. Synthetic test data only. Claude Code changelog fixture bundle: dated releases, model support updates, and workflow quality improvements.

- Claude Code 2.1.86 (76% confidence): Added support for a newer Claude Sonnet release and improved CLI reliability. Evidence: https://code.claude.com/docs/en/changelog

- Note: First observed snapshot for this source.

## Anthropic official announcements

Fixture mode enabled. Synthetic test data only. Anthropic fixture bundle: enterprise-oriented launch framing, Claude release note hints, and safety messaging updates.

- Claude Enterprise workflow update (76% confidence): Anthropic expands enterprise agent workflow messaging and positions Claude for high-trust operations. Evidence: https://www.anthropic.com/news
- Safety framing (76% confidence): Anthropic emphasizes reliability and constitutional AI as launch differentiators. Evidence: https://www.anthropic.com/news

- Note: First observed snapshot for this source.

## Gemini release notes

Fixture mode enabled. Synthetic test data only. Gemini release-notes fixture bundle: dated rollout entries for app capabilities, regional availability, and model packaging changes.

- March 2026 release note (76% confidence): Gemini adds a new workflow capability and expands regional availability for paying users. Evidence: https://gemini.google/release-notes/

- Note: First observed snapshot for this source.

## Google Gemini blog

Fixture mode enabled. Synthetic test data only. Gemini fixture bundle: model release messaging, Google distribution leverage, and workspace/product integration claims.

- Gemini upgrade (76% confidence): Google highlights a new Gemini milestone and stronger product integration across Google surfaces. Evidence: https://blog.google/products/gemini/
- Distribution (76% confidence): Messaging stresses built-in adoption via consumer and workplace distribution. Evidence: https://blog.google/products/gemini/

- Note: First observed snapshot for this source.

## Perplexity Comet what's new

Fixture mode enabled. Synthetic test data only. Perplexity Comet fixture bundle: browser-native agent workflows and voice mode updates positioned as productivity gains.

- Voice mode (76% confidence): Voice mode becomes faster and more context aware within the browser workflow. Evidence: https://docs.perplexity.ai/docs/resources/changelog
- Computer tasks (76% confidence): Perplexity positions persistent computer workflows as a digital worker capability. Evidence: https://docs.perplexity.ai/docs/resources/changelog

- Note: First observed snapshot for this source.

## Perplexity blog

Fixture mode enabled. Synthetic test data only. Perplexity blog fixture bundle: enterprise productivity framing and product narrative around search plus agent execution.

- Research workflow messaging (76% confidence): Perplexity frames research, labs, and browser automation as one integrated productivity suite. Evidence: https://research.perplexity.ai/articles

- Note: First observed snapshot for this source.

## Leaderboard and benchmark overview

## Scale SWE-bench Pro public leaderboard

Fixture mode enabled. Synthetic test data only. Scale SWE-bench Pro fixture bundle: synthetic coding-benchmark rows for top vendor positions.

- Scale SWE-bench Pro: OpenAI GPT-5.4 at rank 1 (72% confidence): OpenAI appears at rank 1 on Scale SWE-bench Pro with a score of 74.2. Evidence: https://labs.scale.com/leaderboard/swe_bench_pro_public
- Scale SWE-bench Pro: Anthropic Claude Sonnet at rank 2 (72% confidence): Anthropic appears at rank 2 on Scale SWE-bench Pro with a score of 71.8. Evidence: https://labs.scale.com/leaderboard/swe_bench_pro_public

- Note: First observed snapshot for this source.

## LiveBench leaderboard

Fixture mode enabled. Synthetic test data only. LiveBench fixture bundle: broad benchmark movement across frontier vendors.

- LiveBench: Google Gemini at rank 1 (72% confidence): Google appears at rank 1 on LiveBench with a score of 84.4. Evidence: https://livebench.ai/

- Note: First observed snapshot for this source.

## LMSYS Arena leaderboard

Fixture mode enabled. Synthetic test data only. LMSYS Arena fixture bundle: public preference leaderboard movement.

- LMSYS Arena: OpenAI GPT-5.4 at rank 1 (72% confidence): OpenAI appears at rank 1 on LMSYS Arena with a score of 1432. Evidence: https://lmarena.ai/leaderboard

- Note: First observed snapshot for this source.

## Artificial Analysis benchmark dashboard

Fixture mode enabled. Synthetic test data only. Artificial Analysis fixture bundle: vendor/model benchmark dashboard comparisons.

- Artificial Analysis: Anthropic Claude at rank 2 (72% confidence): Anthropic appears at rank 2 on Artificial Analysis with a score of 72.4. Evidence: https://artificialanalysis.ai/

- Note: First observed snapshot for this source.

## LLM Stats benchmark index

Fixture mode enabled. Synthetic test data only. LLM Stats fixture bundle: benchmark index references and vendor/model mentions without over-claiming explicit score movement.

- No material changes detected.

- Note: First observed snapshot for this source.

## Community buzz

## Community buzz: Reddit and GitHub

Fixture mode enabled. Synthetic test data only. Community fixture bundle: Reddit speculation about upcoming model launches paired with GitHub repo momentum for Anthropic and Gemini SDKs.

- Speculation on next major proprietary model launch (58% confidence): {"subreddit":"LocalLLaMA","title":"Speculation on next major proprietary model launch","score":242} Evidence: https://www.reddit.com/r/LocalLLaMA/top/.json?limit=50, https://www.reddit.com/r/singularity/top/.json?limit=50, https://www.reddit.com/r/artificial/top/.json?limit=50, https://www.reddit.com/r/LLM/top/.json?limit=50
- Update 2 (58% confidence): {"repo":"google-gemini/gemini-cli","stars":5400,"forks":390} Evidence: https://www.reddit.com/r/LocalLLaMA/top/.json?limit=50, https://www.reddit.com/r/singularity/top/.json?limit=50, https://www.reddit.com/r/artificial/top/.json?limit=50, https://www.reddit.com/r/LLM/top/.json?limit=50

- Note: First observed snapshot for this source.

## OpenAI baseline

## OpenAI product and pricing baseline

Fixture mode enabled. Synthetic test data only. OpenAI fixture bundle: API docs changelog, news feed, and model lineup baseline used to score relative exposure.

- API changelog (76% confidence): GPT-5.4 feature and tool-surface updates in the API docs changelog form part of the baseline. Evidence: https://developers.openai.com/api/docs/changelog, https://openai.com/news/rss.xml, https://api.openai.com/v1/models
- API (76% confidence): GPT-5.4-nano, GPT-5 class reasoning, and developer-facing platform products form the baseline. Evidence: https://developers.openai.com/api/docs/changelog, https://openai.com/news/rss.xml, https://api.openai.com/v1/models

- Note: First observed snapshot for this source.

## Confidence and caveats

- Reddit speculation is treated as lower-confidence than official announcements and benchmark tables.
- Leaderboard parsing is best-effort and may miss format changes on third-party sites.

## Collection health and caveats

- Claude Code changelog: fixture mode is enabled, so this source used synthetic test data instead of a live fetch. Expected extraction path: firecrawl/markdown.
- Anthropic official announcements: fixture mode is enabled, so this source used synthetic test data instead of a live fetch. Expected extraction path: native/html.
- Gemini release notes: fixture mode is enabled, so this source used synthetic test data instead of a live fetch. Expected extraction path: firecrawl/markdown.
- Google Gemini blog: fixture mode is enabled, so this source used synthetic test data instead of a live fetch. Expected extraction path: native/html.
- Perplexity Comet what's new: fixture mode is enabled, so this source used synthetic test data instead of a live fetch. Expected extraction path: native/html.
- Perplexity blog: fixture mode is enabled, so this source used synthetic test data instead of a live fetch. Expected extraction path: native/html.
- Scale SWE-bench Pro public leaderboard: fixture mode is enabled, so this source used synthetic test data instead of a live fetch. Expected extraction path: firecrawl/table.
- LiveBench leaderboard: fixture mode is enabled, so this source used synthetic test data instead of a live fetch. Expected extraction path: native/table.
- LMSYS Arena leaderboard: fixture mode is enabled, so this source used synthetic test data instead of a live fetch. Expected extraction path: native/table.
- Artificial Analysis benchmark dashboard: fixture mode is enabled, so this source used synthetic test data instead of a live fetch. Expected extraction path: native/table.
- LLM Stats benchmark index: fixture mode is enabled, so this source used synthetic test data instead of a live fetch. Expected extraction path: firecrawl/markdown.
- OpenAI product and pricing baseline: fixture mode is enabled, so this source used synthetic test data instead of a live fetch. Expected extraction path: firecrawl/markdown.
- Community buzz: Reddit and GitHub: fixture mode is enabled, so this source used synthetic test data instead of a live fetch. Expected extraction path: native/feed.
