---
name: case-study
description: Turn a portfolio brief into a live page in Sanity (written as MDX, then imported and published; Dylan tweaks it in the Studio), or draft a brief from a local project folder. Use when Dylan says "promote <slug>", "write up <project>", "draft a brief for <folder>", or drops a file in content/inbox.
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

## Job 2: promote `content/inbox/<slug>.md` → a live page in Sanity

Pages live in Sanity. You write the page as MDX in the inbox, then the
importer publishes it to the site. Dylan then tweaks it in the Studio
(`/studio`) whenever they like. Dylan asked for this on 2026-11-13: push it
live for them, and they make changes after publishing.

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
     Notes never show on the site.
4. **Check**: `npm run import -- content/inbox/<slug>.mdx --collection=<collection> --dry`
   checks the frontmatter and lists anything it couldn't convert.
5. **Publish**: run it again with `--publish`. It uploads the images and puts
   the page live within seconds, no redeploy. Import as a draft instead
   (leave off `--publish`) and say why when:
   - the safety pass raised anything still unanswered,
   - a TODO says not to publish yet, or a claim on the page is unconfirmed
     (a number, a decision owner, a sign-off),
   - the piece is employer work that still needs the employer's sign-off
     (check the backlog notes),
   - or Dylan asked for a draft.
6. **Never overwrite Dylan's tweaks.** The importer refuses if the page
   already exists. Don't add `--replace` unless Dylan says to, because it
   discards everything changed in the Studio. To change a page that's
   already live, edit it in Sanity instead (or tell Dylan what to change).
7. **Hand back**: the site and Studio links the importer prints, a short
   list of open questions, visuals to make, and anything you softened for
   safety. Update the backlog status to `published` (or `draft`). Delete the
   inbox files only when Dylan confirms.

Dylan tweaks the live page in the Studio's Presentation tab: rewrite text,
swap pictures, reorder sections, add "Text and image" layouts and change the
home card. Changes go live when they press Publish.
