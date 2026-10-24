# Brief & frontmatter schema

Every page in `content/{work,projects,play}/*.mdx` starts with this YAML.
It's validated by `lib/content.ts` (zod), so a bad field fails the build.
Briefs from either export prompt use the same keys, which means promoting
a brief is mostly writing the prose.

| Key          | Required | Notes                                                                    |
| ------------ | -------- | ------------------------------------------------------------------------ |
| `title`      | yes      | Outcome-led, ~8 words max                                                |
| `summary`    | yes      | ≤ 220 chars. Used on cards, meta description, OG image                   |
| `date`       | yes      | `YYYY-MM`                                                                |
| `role`       | yes      | What you owned                                                           |
| `duration`   |          | "6 weeks", "3 weekends"                                                  |
| `team`       |          | Shape of the team, no names                                              |
| `context`    |          | Anonymised company or product descriptor (work pieces)                   |
| `tools`      |          | Public tools only                                                        |
| `ai`         |          | AI techniques used                                                       |
| `metrics`    |          | `[{ value, label }]`, sanitised                                          |
| `cover`      |          | `/work/<slug>/cover.jpg` in `public/`                                    |
| `accent`     |          | Optional per-piece accent colour (CSS colour)                            |
| `liveUrl`    |          | Full URL                                                                 |
| `repoUrl`    |          | Full URL                                                                 |
| `featured`   |          | Show on the home page                                                    |
| `anonymised` |          | `true` for employer work. Shows an "anonymised" label                    |
| `draft`      |          | `true` hides it in production and shows it in dev                        |
| `order`      |          | Manual sort (lower first). Otherwise pieces sort newest first            |

## Collections

- **work/**: case studies. Deep narrative: problem → process → decisions → outcome.
- **projects/**: shipped side projects and vibe-coded apps. Shorter, with a live link.
- **play/**: experiments and passion projects. Can be a single interactive demo.

## MDX components available in any page

`<Callout label="…">`, `<Figure src alt caption wide />`,
`<Metrics items={[{ value, label }]} />`, `<PromptBlock tool prompt>output</PromptBlock>`,
`<BeforeAfter before after alt labels />`

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
