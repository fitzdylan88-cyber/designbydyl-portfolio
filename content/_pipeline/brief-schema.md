# Brief & frontmatter schema

Published pages live in Sanity and are edited in the Studio at `/studio`.
New pieces start as an MDX file in `content/inbox/` that starts with this
YAML, then `npm run import` puts it into Sanity. The importer checks
these fields (zod), so a bad field fails there. Briefs from either export
prompt use the same keys, which means promoting a brief is mostly writing the
prose.

| Key          | Required | Notes                                                                    |
| ------------ | -------- | ------------------------------------------------------------------------ |
| `title`      | yes      | Outcome-led, ~8 words max                                                |
| `summary`    | yes      | ≤ 220 chars. Used on cards, meta description, OG image                   |
| `date`       | yes      | `YYYY-MM`                                                                |
| `role`       | yes      | What you owned                                                           |
| `duration`   |          | "6 weeks", "3 weekends"                                                  |
| `team`       |          | List of roles, yours first: `My role (Product designer)`, `Product manager`, `UX researcher`. No names |
| `context`    |          | Anonymised company or product descriptor (work pieces)                   |
| `tools`      |          | Public tools only                                                        |
| `tags`       |          | Up to 3 from `tagOptions` in `lib/content.ts`                            |
| `ai`         |          | AI techniques used                                                       |
| `metrics`    |          | `[{ value, label }]`, sanitised                                          |
| `cover`      |          | `/work/<slug>/cover.jpg` in `public/`, or a path relative to the MDX file |
| `mockup`     |          | Device on a transparent background, for the home card's floating picture |
| `card`       |          | Home card theme: `{ bg, title, text, picture: inset/bleed/float, summary }` |
| `accent`     |          | Optional per-piece accent colour (CSS colour)                            |
| `liveUrl`    |          | Full URL                                                                 |
| `repoUrl`    |          | Full URL                                                                 |
| `featured`   |          | Show on the home page                                                    |
| `anonymised` |          | `true` for employer work. Shows an "anonymised" label                    |
| `order`      |          | Manual sort (lower first). Otherwise pieces sort newest first            |

## Collections

- **work/**: case studies. Deep narrative: problem → process → decisions → outcome.
- **projects/**: shipped side projects and vibe-coded apps. Shorter, with a live link.
- **play/**: experiments and passion projects. Can be a single interactive demo.

`npm run import -- <file> --publish` puts a piece live straight away;
without `--publish` it arrives as an unpublished draft. Either way Dylan
tweaks it afterwards in the Studio. The importer never overwrites a page that
already exists, so Studio changes aren't lost.

## MDX components the importer understands

Each becomes a section in the Studio:

- `<Callout label="…">` → Callout
- `<Figure src alt caption wide />` → Image (contained, or wide)
- `<FigureRow phone>` of `<Figure>`s → Image pair or row
- `<Metrics items={[{ value, label }]} />` → Metrics
- `<PromptBlock tool prompt>output</PromptBlock>` → Prompt
- `<BeforeAfter before after alt labels />` → Before / after slider
- `<Tldr>` → Short version
- `{/* TODO … */}` and `{/* VISUAL … */}` → Note (shown in the Studio only)
- Headings, paragraphs, lists, quotes and links → Text

"Text and image" sections (text on one side, the picture on the other) are
added in the Studio.

## Quick read (`<Tldr>`)

Longer case studies (roughly 400+ words) open with a hand-written quick read,
for reviewers working through a pile of portfolios. Put it straight after the
frontmatter. Keep it visual, not just words: a `<Metrics>` row, two or three
bold-led bullets, the one key decision as a `<Callout>`, and two smaller
images in a `<FigureRow>`. Its presence adds the "Full story / Quick read"
toggle to the page, with reading times worked out from words and images.

```mdx
<Tldr>
<Metrics items={[{ value: "…", label: "…" }]} />

- **The problem:** …
- **What I did:** …

<Callout label="Key decision">…</Callout>

<FigureRow>
<Figure src="…" width={…} height={…} alt="…" caption="…" />
<Figure src="…" width={…} height={…} alt="…" caption="…" />
</FigureRow>
</Tldr>
```
