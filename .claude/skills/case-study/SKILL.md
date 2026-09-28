---
name: case-study
description: Turn a portfolio brief into a published MDX page, or draft a brief from a local project folder. Use when Dylan says "promote <slug>", "write up <project>", "draft a brief for <folder>", or drops a file in content/inbox.
---

# Case study skill

Two jobs. Read `content/_pipeline/brief-schema.md` first either way.

## Job 1: draft a brief from a local project (personal work only)

1. Read the project folder: README, PLAN/PRD docs, `package.json`, git log
   (`git log --oneline | head -50`), key UI files. Never do this for
   employer work. That only arrives as a sanitised brief.
2. Write `content/inbox/<slug>.md` in the Option B shape from
   `content/_pipeline/personal-project-prompt.md`.
3. Ask Dylan for anything you couldn't infer: why they built it, who uses it,
   results and lessons. Put your questions in the file as `TODO:` lines too.
4. Set that item's status to `brief` in `content/_pipeline/backlog.md`.

## Job 2: promote `content/inbox/<slug>.md` → `content/<collection>/<slug>.mdx`

1. **Safety pass first** (work pieces). Re-read the brief for names,
   companies, URLs, exact business numbers and internal tool names. If
   anything looks identifying, stop and ask. Don't silently "fix" it.
   Carry the brief's sensitivity-check items into your questions.
2. **Pick the collection**: work (employer), projects (shipped side
   project) or play (experiment).
3. **Write the page** with `draft: true` in the frontmatter:
   - Voice: first person, plain and specific. Short paragraphs. Confident,
     not salesy. No "leveraged", "seamless", "delve", "cutting-edge" or
     "revolutionize". Lead with the problem and the tension, not with me.
   - Structure (work): problem → constraints → approach → 2–4 key
     decisions with tradeoffs → how AI was used, with human judgment in
     the loop → outcome → reflection. Projects and play can be shorter.
   - Show, don't list. Use `<PromptBlock>` for AI technique,
     `<BeforeAfter>` for redesigns, `<Metrics>` for results and `<Callout>`
     for the one insight a hiring manager should remember.
   - Visuals: only images Dylan has recreated or owns. Never employer
     screenshots. Where a visual is needed, leave
     `{/* VISUAL: <description> */}` and add it to the list you hand back.
4. **Validate**: `npm run build` (zod checks frontmatter) and open
   `/<collection>/<slug>` in dev.
5. **Hand back**: a short list of open questions, visuals to make, and
   anything you softened for safety. Update the backlog status to `draft`.
   Delete the inbox file only when Dylan confirms.

Dylan flips `draft: false` when ready to publish.
