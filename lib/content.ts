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
export type Entry = Frontmatter & { slug: string; collection: Collection };

const root = path.join(process.cwd(), "content");
const showDrafts = process.env.NODE_ENV !== "production";

function readCollection(collection: Collection): Entry[] {
  const dir = path.join(root, collection);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx") && !file.startsWith("_"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const { data } = matter(fs.readFileSync(path.join(dir, file), "utf8"));
      const parsed = frontmatterSchema.safeParse(data);
      if (!parsed.success) {
        // Fail the build loudly rather than ship a half-filled case study.
        throw new Error(
          `Invalid frontmatter in content/${collection}/${file}:\n${z.prettifyError(parsed.error)}`,
        );
      }
      return { ...parsed.data, slug, collection };
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
