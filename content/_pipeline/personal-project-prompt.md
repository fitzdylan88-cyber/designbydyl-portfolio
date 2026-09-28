# Personal project → portfolio brief

For things you built on your own time and accounts (vibe-coded apps, sites,
dashboards, experiments). You don't need to sanitise these, and personal
Claude can read the project directly.

## Option A: from this repo (easiest)

In a Claude Code session in the portfolio repo, say:

> Draft a brief for `~/Desktop/Projects/<folder>` using the case-study skill.

Claude reads the project's code, README and git history, then asks you what
it can't infer (why you built it, who uses it, what you learned).

## Option B: from a claude.ai conversation or project

Paste this at the end of the conversation where you built it:

---

Write a portfolio brief about what we built here, for my design portfolio.
Return only markdown, in the shape defined below. Leave a field as
`"TODO: <question for me>"` if you don't know it. Don't guess.

```markdown
---
title: "<outcome-led title, max ~8 words>"
summary: "<max 220 chars: why I built it → what it does → what happened>"
date: "<YYYY-MM>"
role: "Solo — design & build"
duration: "<e.g. 3 weekends>"
tools: [<e.g. Claude Code, Next.js, Supabase, Vercel>]
ai: [<how AI was used in building it and/or inside the product>]
liveUrl: "<https://… if live>"
metrics:
  - { value: "", label: "" }
---

## Why I built it
## What it does
## Design decisions
## How I built it with AI
## What I learned
## Visuals to capture
```

---

Then save the result as `content/inbox/<slug>.md`.
