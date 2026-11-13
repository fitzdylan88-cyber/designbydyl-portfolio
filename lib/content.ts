import "server-only";
import { draftMode } from "next/headers";
import { stegaClean } from "next-sanity";
import { client } from "@/sanity/lib/client";
import { sanityFetch } from "@/sanity/lib/live";
import { tagOptions } from "@/lib/tags";
import { editor } from "@/lib/edit";

/**
 * Case studies, projects and play pieces, from Sanity. The shape matches the
 * old MDX frontmatter so the rest of the site didn't need to change.
 */
export const collections = ["work", "projects", "play"] as const;
export type Collection = (typeof collections)[number];
export { tagOptions };

export type Image = { url: string; width: number; height: number; alt?: string; caption?: string };

type Blocks = unknown[];
export type Section =
  | { _type: "textSection"; _key: string; text?: Blocks }
  | { _type: "textImageSection"; _key: string; text?: Blocks; image?: Image; side?: "left" | "right" }
  | { _type: "imageSection"; _key: string; image?: Image; size?: "contained" | "wide" }
  | { _type: "imageRowSection"; _key: string; images?: Image[]; phones?: boolean }
  | { _type: "calloutSection"; _key: string; label?: string; text?: Blocks }
  | { _type: "metricsSection"; _key: string; items?: { value: string; label: string }[] }
  | { _type: "beforeAfterSection"; _key: string; before?: Image; after?: Image; alt?: string; beforeLabel?: string; afterLabel?: string }
  | { _type: "promptSection"; _key: string; tool?: string; prompt?: string; output?: Blocks }
  | { _type: "noteSection"; _key: string }
  | { _type: "shortVersionSection"; _key: string; sections?: Section[] };

export type Entry = {
  _id: string;
  slug: string;
  collection: Collection;
  title: string;
  summary: string;
  date: string;
  role: string;
  duration?: string;
  /** One role, or one per line with yours first. */
  team?: string | string[];
  context?: string;
  tools: string[];
  tags: (typeof tagOptions)[number][];
  ai: string[];
  metrics: { label: string; value: string }[];
  cover?: string;
  /** Device mockup on a transparent background, for the home swimlane card. */
  mockup?: string;
  /** Home swimlane card theme (see components/device-card.tsx). */
  card?: { bg: string; title: string; text: string; picture: "inset" | "bleed" | "float"; summary?: string };
  accent?: string;
  liveUrl?: string;
  repoUrl?: string;
  featured: boolean;
  anonymised: boolean;
  /** Not published yet. Only shown in dev, preview deploys and the Studio preview. */
  draft: boolean;
  order?: number;
  sections: Section[];
  /** True when there's a short version (TL;DR) section. */
  hasTldr: boolean;
  fullMinutes: number;
  tldrSeconds: number;
  /** In the Studio's preview: click-to-edit attributes for fields that can't carry hidden markers. */
  edit?: { title: string; summary: string; cover: string; card: string; cardSummary: string };
};

/** Drafts show in dev and on Vercel preview deploys, never on the live site. */
export const showDrafts = process.env.NODE_ENV !== "production" || process.env.VERCEL_ENV === "preview";

// ── Query ───────────────────────────────────────────────────────────────

const img = `{ "url": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height, alt, caption }`;
const sectionFields = `..., image${img}, images[]${img}, before${img}, after${img}`;

const query = `*[_type == "caseStudy" && defined(slug.current)] | order(coalesce(order, 1e9) asc, date desc) {
  _id, "slug": slug.current, collection, title, summary, date, role, duration, team, context,
  tools, tags, ai, metrics[]{label, value}, accent, liveUrl, repoUrl, featured, anonymised, order,
  "cover": cover.asset->url,
  card{ "bg": coalesce(backgroundCss, background.hex), "title": titleColor.hex, "text": textColor.hex,
        picture, summary, "mockup": mockup.asset->url },
  sections[]{ ${sectionFields}, _type == "shortVersionSection" => { sections[]{ ${sectionFields} } } }
}`;

type Raw = Omit<Entry, "team" | "card" | "mockup" | "draft" | "hasTldr" | "fullMinutes" | "tldrSeconds" | "tools" | "tags" | "ai" | "metrics" | "sections"> & {
  team: string[] | null;
  tools: string[] | null;
  tags: Entry["tags"] | null;
  ai: string[] | null;
  metrics: Entry["metrics"] | null;
  sections: Section[] | null;
  card: (Partial<NonNullable<Entry["card"]>> & { mockup?: string }) | null;
};

// ── Reading time ────────────────────────────────────────────────────────

const WORDS_PER_MINUTE = 230;
/** Seconds per image, the usual allowance for looking at a figure. */
const SECONDS_PER_IMAGE = 12;

function words(value: unknown): number {
  if (typeof value === "string") return value.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu)?.length ?? 0;
  if (Array.isArray(value)) return value.reduce((n, v) => n + words(v), 0);
  if (value && typeof value === "object") {
    const o = value as Record<string, unknown>;
    return words(o._type === "span" ? o.text : Object.entries(o).filter(([k]) => ["text", "children", "prompt", "output", "items", "value", "label"].includes(k)).map(([, v]) => v));
  }
  return 0;
}

function seconds(sections: Section[]) {
  let total = 0;
  for (const s of sections) {
    if (s._type === "noteSection" || s._type === "shortVersionSection") continue;
    total += (words(s) / WORDS_PER_MINUTE) * 60;
    if (s._type === "imageSection" || s._type === "beforeAfterSection" || s._type === "textImageSection") total += SECONDS_PER_IMAGE;
    if (s._type === "imageRowSection") total += SECONDS_PER_IMAGE * (s.images?.length ?? 0);
  }
  return total;
}

// ── Shaping ─────────────────────────────────────────────────────────────

function toEntry(raw: Raw, published: Set<string>, preview: boolean): Entry {
  // Stega (click-to-edit markers) stays on displayed text only; ids, colours,
  // dates and options are cleaned so code can compare and parse them.
  const clean = stegaClean(raw);
  const sections = raw.sections ?? [];
  const tldr = sections.find((s) => s._type === "shortVersionSection");
  const card = clean.card;
  const edit = editor(clean._id, preview);
  return {
    ...clean,
    title: raw.title,
    summary: raw.summary,
    team: clean.team?.length === 1 ? clean.team[0] : clean.team ?? undefined,
    tools: clean.tools ?? [],
    tags: clean.tags ?? [],
    ai: clean.ai ?? [],
    metrics: raw.metrics ?? [],
    sections,
    mockup: card?.mockup ?? undefined,
    card:
      card?.bg && card.title && card.text
        ? { bg: card.bg, title: card.title, text: card.text, picture: card.picture ?? "inset", summary: raw.card?.summary ?? undefined }
        : undefined,
    draft: !published.has(clean._id),
    hasTldr: Boolean(tldr),
    fullMinutes: Math.max(1, Math.round(seconds(sections) / 60)),
    tldrSeconds: tldr ? Math.max(20, Math.round(seconds(tldr.sections ?? []) / 10) * 10) : 0,
    edit: edit && {
      title: edit("title"),
      summary: edit("summary"),
      cover: edit("cover"),
      card: edit("card"),
      cardSummary: edit(raw.card?.summary ? "card.summary" : "summary"),
    },
  };
}

/**
 * All entries, in site order. In the Studio's preview (draft mode) it reads
 * drafts with click-to-edit markers; dev and preview deploys also include
 * unpublished drafts; the live site reads published content only.
 * `build: true` is for generateStaticParams and the sitemap, which run outside a request.
 */
async function load({ build = false } = {}): Promise<Entry[]> {
  const preview = !build && (await draftMode()).isEnabled;
  const perspective = preview || showDrafts ? "drafts" : "published";

  const [raw, publishedIds] = build
    ? await Promise.all([
        client.withConfig({ token: process.env.SANITY_API_READ_TOKEN, useCdn: false }).fetch<Raw[]>(query, {}, { perspective, stega: false }),
        client.fetch<string[]>(`*[_type == "caseStudy"]._id`, {}, { perspective: "published", stega: false }),
      ])
    : await Promise.all([
        sanityFetch({ query, ...(preview ? {} : { perspective, stega: false }) }).then((r) => r.data as Raw[]),
        sanityFetch({ query: `*[_type == "caseStudy"]._id`, perspective: "published", stega: false }).then((r) => r.data as string[]),
      ]);

  const published = new Set(publishedIds);
  // Site order: Work, then Projects, then Play; within each, by `order`, then newest first.
  return raw
    .map((r) => toEntry(r, published, preview))
    .filter((e) => showDrafts || preview || !e.draft)
    .sort(
      (a, b) =>
        collections.indexOf(a.collection) - collections.indexOf(b.collection) ||
        (a.order ?? Infinity) - (b.order ?? Infinity) ||
        b.date.localeCompare(a.date),
    );
}

/** True in the Studio's preview, where pages get click-to-edit attributes. */
export async function isPreview() {
  return (await draftMode()).isEnabled;
}

export async function getAllEntries(options?: { build?: boolean }) {
  return load(options);
}

export async function getEntries(collection: Collection) {
  return (await load()).filter((e) => e.collection === collection);
}

export async function getEntry(collection: Collection, slug: string) {
  return (await load()).find((e) => e.collection === collection && e.slug === slug);
}
