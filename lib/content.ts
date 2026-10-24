import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

/**
 * One schema for every piece of content. It mirrors
 * content/_pipeline/brief-schema.md so a brief maps onto frontmatter 1:1.
 */
export const collections = ["work", "projects", "play"] as const;
export type Collection = (typeof collections)[number];

export const frontmatterSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1).max(220),
  date: z.string().regex(/^\d{4}-\d{2}$/, "date must be YYYY-MM"),
  role: z.string().min(1),
  duration: z.string().optional(),
  team: z.string().optional(),
  /** Company descriptor used instead of a name, e.g. "Irish fintech, ~300 people". */
  context: z.string().optional(),
  tools: z.array(z.string()).default([]),
  /** AI techniques used: prompting, skills, agents, MCP, workflows… */
  ai: z.array(z.string()).default([]),
  metrics: z
    .array(z.object({ label: z.string(), value: z.string() }))
    .default([]),
  cover: z.string().optional(),
  accent: z.string().optional(),
  liveUrl: z.url().optional(),
  repoUrl: z.url().optional(),
  featured: z.boolean().default(false),
  /** Work done for an employer and published anonymised. */
  anonymised: z.boolean().default(false),
  draft: z.boolean().default(false),
  order: z.number().optional(),
});

export type Frontmatter = z.infer<typeof frontmatterSchema>;
export type Reading = {
  /** True when the MDX has a hand-written <Tldr> short version. */
  hasTldr: boolean;
  fullMinutes: number;
  tldrSeconds: number;
};
export type Entry = Frontmatter & Reading & { slug: string; collection: Collection };

const WORDS_PER_MINUTE = 230;
/** Seconds per image, the usual allowance for looking at a figure. */
const SECONDS_PER_IMAGE = 12;

/** Reading time in seconds: prose words plus a look at each image. JSX tags and props don't count. */
function readingSeconds(mdx: string) {
  const prose = mdx.replace(/<[A-Z][\s\S]*?>/g, " ").replace(/<\/[A-Z]\w*>/g, " ");
  const words = prose.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu)?.length ?? 0;
  const images = mdx.match(/<(Figure|BeforeAfter)\b/g)?.length ?? 0;
  return (words / WORDS_PER_MINUTE) * 60 + images * SECONDS_PER_IMAGE;
}

function reading(mdx: string): Reading {
  const tldr = mdx.match(/<Tldr>([\s\S]*?)<\/Tldr>/);
  return {
    hasTldr: Boolean(tldr),
    fullMinutes: Math.max(1, Math.round(readingSeconds(tldr ? mdx.replace(tldr[0], "") : mdx) / 60)),
    tldrSeconds: tldr ? Math.max(20, Math.round(readingSeconds(tldr[1]) / 10) * 10) : 0,
  };
}

const root = path.join(process.cwd(), "content");
/** Drafts show in dev and on Vercel preview deploys, never on the live site. */
export const showDrafts = process.env.NODE_ENV !== "production" || process.env.VERCEL_ENV === "preview";

function readCollection(collection: Collection): Entry[] {
  const dir = path.join(root, collection);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx") && !file.startsWith("_"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const { data, content } = matter(fs.readFileSync(path.join(dir, file), "utf8"));
      const parsed = frontmatterSchema.safeParse(data);
      if (!parsed.success) {
        // Fail the build loudly rather than ship a half-filled case study.
        throw new Error(
          `Invalid frontmatter in content/${collection}/${file}:\n${z.prettifyError(parsed.error)}`,
        );
      }
      return { ...parsed.data, ...reading(content), slug, collection };
    })
    .filter((entry) => showDrafts || !entry.draft)
    .sort(
      (a, b) =>
        (a.order ?? Infinity) - (b.order ?? Infinity) ||
        b.date.localeCompare(a.date),
    );
}

export function getEntries(collection: Collection): Entry[] {
  return readCollection(collection);
}

export function getAllEntries(): Entry[] {
  return collections.flatMap(readCollection);
}

export function getEntry(collection: Collection, slug: string) {
  return readCollection(collection).find((entry) => entry.slug === slug);
}
