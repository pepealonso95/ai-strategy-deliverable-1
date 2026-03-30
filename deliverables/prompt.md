I want you to implement and follow the following assignment:
Competitor Intelligence or Product Management Agent
 

Option 1: Competitor Intelligence Agent
Goal of the Project
The goal of this project is to design and build a production-minded Competitor Intelligence Agent for one of the following companies:

OpenAI
Workday
Clay
Your agent must monitor competitor signals and transform raw public information into structured, decision-relevant intelligence.

By the end of this project, you should be able to:

Translate a real business need (competitive monitoring) into an agentic system
Define the scope and boundaries of a decision-support agent
Connect an agent to multiple external information sources
Structure outputs so that executives can act on them
Identify both the strengths and limitations of your system
Description
You will build a Competitor Intelligence Agent for your chosen company (OpenAI, Workday, or Clay).

Your agent must monitor and analyze competitors using publicly available signals such as:

Company websites (product updates, messaging changes)
Job boards (new hiring patterns, role shifts)
Press releases and blog posts
Social media announcements
Product documentation updates
Partner announcements
Define what the agent’s responsibility is - what should they actually do?
For example, do you want it to:

Filter signal from noise? Or just give you the data?
Identify what is strategically relevant?
Structure findings in a way that reduces cognitive load for decision-makers?
Produce a one-page report?
You should explicitly define your agent:

The scope of monitoring (which competitors, which sources)
The frequency or cadence of monitoring (real-time, weekly scan, event-triggered)
The intended internal audience
The type of decisions this intelligence supports
Your system should be realistic. If you propose daily scraping across 100 competitors without addressing cost, noise, and operational feasibility, that will be treated as a design flaw.

Projects will be graded by an AI grading agent and your course instructors. Your submission must be structured, explicit, and inspectable.

Deliverables
Your submission must be formatted in Markdown and include the following sections exactly as specified below.

1. Company and Strategic Context
In 2 sentences, specify:

Which company you selected (OpenAI, Workday, or Clay)
The company’s strategic position (industry, business model, key competitors)
The internal stakeholder this agent serves (e.g., Head of Product, Corporate Strategy, GTM Leader, Product Managers, Engineers, etc.)
2. Agent Prompt
Provide the full prompt used to define your agent, including:

Do not summarize the prompt. Provide it in full.

3. Technologies Used
List and describe:

LLM platform(s)
Automation or orchestration tools
Data storage or retrieval systems
Scraping or monitoring tools
Any APIs or third-party services used
For each technology, briefly justify why it was selected.

4. Inputs
Clearly define:

What raw inputs the agent receives
How frequently inputs are collected
Whether inputs are structured or unstructured
Any preprocessing steps
Examples of inputs include:

URLs
RSS feeds
Job board search results
Social media posts
Press release feeds
Be precise.

5. Outputs
Define:

The output schema (structured format preferred)
Intended frequency of reporting
Intended consumer of the output
Whether outputs include confidence scoring
Provide at least one real sample output from your agent.

6. Knowledge Sources Used
Specify:

Any persistent knowledge base
Historical competitor data
Stored company context
Industry benchmarks
Internal strategy assumptions encoded in the prompt
8. Tools the Agent Has Access To
List each tool and describe:

What it does
When it is used
How the agent decides to use it
Known failure modes of the tool, if any
If the agent has multiple tools for the same task, explain how tool selection occurs.

9. What the Agent Does Well
Critically evaluate:

Where the agent adds real strategic value
Where it reduces cognitive load
Where it outperforms manual monitoring
Where its structure improves clarity or speed
Be specific - avoid generic claims.

10. Where the Agent Fails
What went wrong with your agent as you were building it?
How did it fail to deliver a competitive analysis or competitive monitoring?
What did you have to fix?
Include at least one concrete failure example.

Submission Requirements
Submission must be in Markdown format
All sections must be present
Vague claims will be penalized by the grading agent
This project is not about building a perfect system.
It is about demonstrating that you understand how to design, constrain, and evaluate a strategic agentic system under real-world conditions.

I have only sent option 1 as i picked that and im pickign open ai as the company that i want to follow. I want you for sourcing information to pick from llm leaderboards and rankings like swe and others. I want you to look at pages that compile these rankings. If possible i want you to analyze trends like tweeter and github stars of said repos in the agent. For the implementation of this agent I want you to use agents sdk from open ai and use gpt 5.4 nano. This agent will be triggered using cron jobs in vercel daily at midnight. Track specifically for announcements of anthropic, gemini or perplexity in their own websites. Also track reddit for general "social buzz" of other new model announcements and speculations in certain subreddits. and of course track general llm leaderboard benchmark rankings to get a factual overview of the competition. Then last check open ais announcements and product lineup currently. All of this data relevant should be turned into a markdown file. Each source should be tackled by a separate agent. Then i want you to build another agent which is in charge of producing a summary of the markdown file thinking strategically which trends open ai should focus on, be worried about, how safe we are from something with a score of 1 to 100% based on open ai's current products, offerings and roadmap from available info collected by previous agents and turn this into another markdown file (which in the future will be an email sent to specific employees).

p2
I want you to also use the evals api for the testing plan and create a set of evals for each agent

p3
what about looking at benches like https://labs.scale.com/leaderboard/swe_bench_pro_public and https://llm-stats.com/benchmarks to check benchmakrs and see stats on others. then check gemini updates on https://gemini.google/release-notes/ and claude updates on https://code.claude.com/docs/en/changelog

p4
for openai's data use https://developers.openai.com/api/docs/changelog

p5
use the frontend design skill to fix the frontend