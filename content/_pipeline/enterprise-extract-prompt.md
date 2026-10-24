# Enterprise case-study extractor

A one-shot prompt for work Claude Enterprise. Claude digs through
everything it can reach about a project and assembles a full, sanitised
case-study brief on its own. It doesn't interview you. Gaps come back as
`TODO:` lines instead of questions.

**Where to run it:** in the Claude Project (or chat) where the work
happened, so Claude has the most context. Swap `<PROJECT>` for a short
description of the work, e.g. "the agent triage tool".

**After:** read every line (you're the final safety check), then paste it
into `content/inbox/<slug>.md` in the portfolio repo (git-ignored) and ask
personal Claude to "promote <slug>".

---

Copy everything below the line into work Claude:

---

Build a complete case-study brief for my personal design portfolio about
**<PROJECT>**. Don't ask me questions. Do the research yourself.

## Step 1: Gather everything

Search everything you can reach for this project, and be thorough:

- this Project's knowledge files and instructions
- this conversation and any past chats you can search or remember
- connected tools (Drive, Docs, Slack, Figma, Jira, Confluence, GitHub,
  email, calendar and so on) if any are connected: PRDs, briefs, design
  files, research notes, decision threads, launch posts, retros and
  metrics dashboards

From all of it, extract: the problem and who it hurt, the timeline and
milestones, my specific role and contributions (as distinct from the
team's), constraints, options considered and why we chose what we did,
how AI and Claude were used, what shipped, the impact, feedback, and what
went wrong or changed along the way. Prefer evidence over inference. If
sources disagree, go with the most recent and note the conflict.

## Step 2: Sanitise (these rules beat detail)

1. **No identifying information.** Remove or generalise company, client,
   product, team and colleague names, and internal codenames. Use a
   descriptor instead, e.g. "a large Irish bank" or "an internal ops tool
   for ~200 agents". No URLs, file paths, repo names, ticket IDs, channel
   names, non-public tool names, customer data, personal data,
   credentials or anything under NDA.
2. **No confidential numbers.** Use relative or rounded figures, e.g.
   "roughly 40% faster" or "a few hundred daily users". If even that
   feels sensitive, write "measurable improvement in X" and flag it.
3. **No verbatim internal content.** Summarise the approach, not the
   artefact. Generic prompt *patterns* are fine. Paraphrase quotes and
   leave them unattributed.
4. **Public tools are fine to name**: Claude, Figma, Cursor, Notion, MCP,
   and so on.
5. When in doubt, leave it out and list it in the sensitivity check.

## Step 3: Write the brief

Return **only** this markdown document. The YAML must parse. Write in
first person as me, plain and specific, with no marketing language. Don't
invent anything. Where you couldn't find something, write
`TODO: <what's missing and where I might find it>`.

```markdown
---
title: "<outcome-led title, max ~8 words>"
summary: "<max 220 chars: problem → what I did → result>"
date: "<YYYY-MM it shipped or peaked>"
role: "<my role>"
duration: "<e.g. 6 weeks>"
team: "<e.g. Me + 2 engineers + PM, no names>"
context: "<anonymised company/product descriptor>"
tools: [<public tools>]
ai: [<AI techniques, e.g. "Claude Projects", "custom skills", "MCP connectors", "agentic workflow", "prompt rubric", "eval set">]
metrics:
  - { value: "<e.g. ~40%>", label: "<e.g. less time per ticket>" }
anonymised: true
---

## The problem
<What was broken or missing, for whom, what it cost and how we knew.
1–2 short paragraphs.>

## Constraints
<Time, tech, data access, compliance, politics. Bullets.>

## My role
<What I owned vs. what I contributed to.>

## Timeline
<Key milestones as dated bullets (month-level is fine).>

## Process
<3–6 steps. For each: what I did, what I learned, what changed.>

## Key decisions
<2–4 decisions. For each: the options, the choice, the tradeoff and why.>

## How I used AI
<Which Claude features or techniques, what they were responsible for,
where human judgment stayed in the loop, and what didn't work at first.
Include 1–2 generic prompt patterns I could show publicly.>

## Outcome
<What shipped, adoption and impact (sanitised), plus paraphrased
feedback.>

## What I'd do differently
<2–3 honest bullets, based on retros or problems you found.>

## Before / after
<The clearest before vs. after comparisons (flows, screens, steps, time).>

## Visuals to capture
<Specific screens, files or moments to screenshot, where to find them,
and what in each needs blurring (customer data, colleague names, internal
URLs). Plus diagrams worth drawing, e.g. "the agent pipeline".>

## Sources used
<Generic source types only, e.g. "PRD", "design file", "launch thread",
"retro doc". No names or links.>

## Sensitivity check
<Everything you removed, generalised or were unsure about. If nothing:
"Nothing flagged.">

## TODOs
<Every gap you couldn't fill from the sources, in one list.>
```
