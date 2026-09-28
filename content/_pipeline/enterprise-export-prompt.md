# Enterprise → portfolio export prompt

**Where to run this:** inside your work Claude Enterprise account, in the
conversation or project where the work happened (so Claude has the context).
Run it once per project.

**Before you start:** check your employer's AI and data policy. This prompt
sanitises at the source, but *you* are the final check. Read every line
of the output before it leaves your work machine.

**After:** copy the output and paste it into
`content/inbox/<short-slug>.md` in the portfolio repo. Don't email it,
sync it or screenshot it across. The inbox folder is git-ignored, so
nothing goes public until it becomes a reviewed case study.

---

Copy everything below the line into Enterprise Claude:

---

I'm documenting my own professional growth for a personal design portfolio.
Using everything you know about the project we've worked on in this
conversation/project, write a **sanitised case-study brief** about MY role
and approach.

## Hard rules (follow all of them; they matter more than detail)

1. **No identifying information.** Remove or generalise:
   - company, client, product, team and colleague names, plus internal
     codenames. Use a descriptor instead, e.g. "a mid-size Irish fintech"
     or "an internal ops tool for ~200 agents".
   - URLs, file paths, repo names, ticket IDs, Slack channels, internal
     tool names that aren't public products.
   - customer data, personal data, credentials and anything under NDA.
2. **No confidential numbers.** Turn absolute business figures (revenue,
   user counts, costs, conversion rates) into relative or rounded ones,
   e.g. "cut handling time by roughly 40%" or "used by a few hundred
   agents daily". If even that feels sensitive, write "measurable
   improvement in X" and say so in the sensitivity check.
3. **No verbatim internal content.** Don't paste internal docs, code,
   strategy or proprietary prompts. Summarise the *approach*, not the
   artefact. Generic prompt *patterns* are fine, e.g. "a system prompt that
   gave the model a rubric and three graded examples".
4. **Public tools are fine to name**: Claude, Figma, Cursor, Notion, MCP,
   and so on.
5. When in doubt, leave it out and list it in the sensitivity check.

## Output format

Return **only** a single markdown document in exactly this shape. The YAML
block must parse.

```markdown
---
title: "<punchy outcome-led title, max ~8 words>"
summary: "<one or two sentences, max 220 chars: problem → what I did → result>"
date: "<YYYY-MM when it shipped or peaked>"
role: "<my role on this, e.g. Lead product designer>"
duration: "<e.g. 6 weeks>"
team: "<e.g. Me + 2 engineers + PM, no names>"
context: "<anonymised company/product descriptor>"
tools: [<public tools used>]
ai: [<AI techniques: e.g. "Claude Projects", "custom skills", "MCP connectors", "agentic workflow", "prompt rubric", "eval set">]
metrics:
  - { value: "<e.g. ~40%>", label: "<e.g. less time per ticket>" }
anonymised: true
---

## The problem
<What was broken or missing, for whom, and why it mattered. 1–2 short paragraphs.>

## Constraints
<Time, tech, politics, data access, compliance. Bullets.>

## My role
<Specifically what I owned vs. contributed to.>

## Process
<How it unfolded, in 3–6 steps. For each: what I did, what I learned, what changed.>

## Key decisions
<2–4 decisions. For each: the options, what I chose, the tradeoff, and why.>

## How I used AI
<Concretely: which Claude features or techniques, what they were responsible
for, where human judgment stayed in the loop, what didn't work at first and
how I fixed it. Include 1–2 generic prompt patterns I could show publicly.>

## Outcome
<What shipped, adoption and impact (sanitised), plus qualitative feedback
(paraphrased, unattributed).>

## What I'd do differently
<Honest reflection. 2–3 bullets.>

## Visuals to recreate
<Ideas for visuals I could rebuild from scratch as mock UI or diagrams
(NOT screenshots): e.g. "before/after of the triage flow", "diagram of the
agent pipeline", "the prompt → output loop".>

## Sensitivity check
<Bullet list of everything you removed, generalised or were unsure about,
so I can double-check. If nothing: "Nothing flagged.">
```

Ask me clarifying questions first if you don't know my role, the outcome
or the timeline. Don't guess.
