---
name: case-study
description: Turn a portfolio brief into a Sanity draft (written as MDX, then imported into the Studio), or draft a brief from a local project folder. Use when Dylan says "promote <slug>", "write up <project>", "draft a brief for <folder>", or drops a file in content/inbox.
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

## Job 2: promote `content/inbox/<slug>.md` → a draft in the Sanity Studio

Pages live in Sanity now. You write the page as MDX in the inbox, then the
importer turns it into an unpublished draft that Dylan arranges and publishes
in the Studio (`/studio`).

1. **Safety pass first** (work pieces). Re-read the brief for names,
   companies, URLs, exact business numbers and internal tool names. If
   anything looks identifying, stop and ask. Don't silently "fix" it.
   Carry the brief's sensitivity-check items into your questions.
2. **Pick the collection**: work (employer), projects (shipped side
   project) or play (experiment).
3. **Write the page** as `content/inbox/<slug>.mdx`, with the frontmatter from
   the brief schema:
   - Voice: first person, plain and specific. Short paragraphs. Confident,
     not salesy. No "leveraged", "seamless", "delve", "cutting-edge" or
     "revolutionize". Lead with the problem and the tension, not with me.
   - Structure (work): problem → constraints → approach → 2–4 key
     decisions with tradeoffs → how AI was used, with human judgment in
     the loop → outcome → reflection. Projects and play can be shorter.
   - Show, don't list. Use `<PromptBlock>` for AI technique,
     `<BeforeAfter>` for redesigns, `<Metrics>` for results and `<Callout>`
     for the one insight a hiring manager should remember.
   - Visuals: Dylan is allowed to use employer screenshots. Before
     publishing one, check it for customer data, colleague names, internal
     URLs and ticket IDs, and ask Dylan to blur them. Put images beside the
     MDX (e.g. `content/inbox/<slug>/screen.png`) and reference them by
     relative path. Where a visual is needed, leave
     `{/* VISUAL: <description> */}` (it becomes a Studio-only note) and add
     it to the list you hand back. Open questions go in `{/* TODO: … */}`.
4. **Check, then import**:
   - `npm run import -- content/inbox/<slug>.mdx --collection=<collection> --dry`
     checks the frontmatter and lists anything it couldn't convert.
   - Then run it without `--dry`. It uploads the images and creates the draft.
     It never touches published content, and refuses to overwrite an existing
     draft (`--replace` overrides that, and loses edits made in the Studio, so
     ask Dylan first).
   - Open the draft in the Studio's Presentation tab to check it renders.
5. **Hand back**: the Studio link the importer prints, a short list of open
   questions, visuals to make, and anything you softened for safety. Update
   the backlog status to `draft`. Delete the inbox files only when Dylan
   confirms.

Dylan arranges the sections, adds "Text and image" layouts and presses
Publish in the Studio. Later edits happen there too, not in MDX.
