/**
 * Import an MDX case study into Sanity, as a draft or straight onto the site.
 *
 *   npm run import -- content/inbox/my-project.mdx --collection=work --dry
 *   npm run import -- content/inbox/my-project.mdx --collection=work            # draft
 *   npm run import -- content/inbox/my-project.mdx --collection=work --publish  # live
 *
 * The case-study skill writes new pieces as MDX in content/inbox (the same
 * frontmatter and components the site used before Sanity), then runs this.
 * Either way Dylan can keep tweaking it in the Studio afterwards.
 *
 * - Collection: `--collection=work|projects|play`, else the file's folder
 *   (content/work/…), else `collection:` in the frontmatter.
 * - Images: `/work/x.png` is read from public/; any other path is relative to
 *   the MDX file. Each is uploaded to Sanity once.
 * - `--publish` puts it live at once. Without it, it's an unpublished draft.
 * - Never overwrites: it refuses if that page (or draft) already exists, so
 *   Studio tweaks are never lost. `--replace` overrides this and discards them.
 * - `--dry` writes the document JSON to `--out=<dir>` (default
 *   content/inbox/.sanity-dry) instead of uploading.
 * - TODO and VISUAL comments in the MDX become Studio-only notes.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMdx from "remark-mdx";
import remarkGfm from "remark-gfm";
import { createClient } from "@sanity/client";
import { z } from "zod";

const args = process.argv.slice(2);
const flag = (name) => args.find((a) => a.startsWith(`--${name}=`))?.split("=")[1];
const dry = args.includes("--dry");
const replace = args.includes("--replace");
const publish = args.includes("--publish");
const outDir = flag("out") ?? "content/inbox/.sanity-dry";
const files = args.filter((a) => !a.startsWith("--"));
const root = process.cwd();
const collections = ["work", "projects", "play"];
const tagOptions = ["UI design", "UX research", "Accessibility", "Industrial design", "Design + build", "AI-assisted", "Measurable impact"];

if (!files.length) {
  console.error("Usage: npm run import -- <file.mdx> [--collection=work|projects|play] [--dry] [--publish] [--replace]");
  process.exit(1);
}

/** Frontmatter checks, so a half-filled brief fails here rather than in the Studio. */
const frontmatter = z.object({
  title: z.string().min(1),
  summary: z.string().min(1).max(220),
  date: z.string().regex(/^\d{4}-\d{2}$/, "date must be YYYY-MM"),
  role: z.string().min(1),
  duration: z.string().optional(),
  team: z.union([z.string(), z.array(z.string())]).optional(),
  context: z.string().optional(),
  tools: z.array(z.string()).optional(),
  tags: z.array(z.enum(tagOptions)).max(3).optional(),
  ai: z.array(z.string()).optional(),
  metrics: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
  cover: z.string().optional(),
  mockup: z.string().optional(),
  card: z
    .object({
      bg: z.string(),
      title: z.string(),
      text: z.string(),
      picture: z.enum(["inset", "bleed", "float"]).optional(),
      summary: z.string().optional(),
    })
    .optional(),
  accent: z.string().optional(),
  liveUrl: z.url().optional(),
  repoUrl: z.url().optional(),
  featured: z.boolean().optional(),
  anonymised: z.boolean().optional(),
  order: z.number().optional(),
  collection: z.enum(collections).optional(),
});

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2026-11-01",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const key = () => crypto.randomBytes(6).toString("hex");
const warnings = [];

// ── Images ──────────────────────────────────────────────────────────────

const uploaded = new Map();

/** The MDX file being imported, for resolving relative image paths. */
let current = "";

/** Upload an image once and return a Sanity image reference. */
async function image(src) {
  if (!src) return undefined;
  const file = src.startsWith("/") ? path.join(root, "public", src) : path.resolve(path.dirname(current), src);
  if (!fs.existsSync(file)) throw new Error(`Missing image ${file}`);
  if (!uploaded.has(src)) {
    if (dry) {
      uploaded.set(src, `image-DRY-${src}`);
    } else {
      const asset = await client.assets.upload("image", fs.createReadStream(file), { filename: path.basename(src) });
      uploaded.set(src, asset._id);
      process.stdout.write(".");
    }
  }
  return { _type: "image", asset: { _type: "reference", _ref: uploaded.get(src) } };
}

async function picture(src, alt, caption) {
  const img = await image(src);
  return { ...img, _type: "picture", alt, ...(caption ? { caption } : {}) };
}

// ── Colours ─────────────────────────────────────────────────────────────

/** A hex colour in the shape @sanity/color-input stores. */
function color(hex) {
  if (!hex) return undefined;
  let h = hex.replace("#", "");
  if (h.length === 3) h = [...h].map((c) => c + c).join("");
  if (!/^[0-9a-f]{6}$/i.test(h)) return undefined;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [rn, gn, bn] = [r, g, b].map((v) => v / 255);
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  let hue = 0;
  if (d) {
    if (max === rn) hue = ((gn - bn) / d) % 6;
    else if (max === gn) hue = (bn - rn) / d + 2;
    else hue = (rn - gn) / d + 4;
    hue = Math.round(hue * 60);
    if (hue < 0) hue += 360;
  }
  const l = (max + min) / 2;
  const sl = d ? d / (1 - Math.abs(2 * l - 1)) : 0;
  const sv = max ? d / max : 0;
  return {
    _type: "color",
    hex: `#${h.toLowerCase()}`,
    alpha: 1,
    rgb: { _type: "rgbaColor", r, g, b, a: 1 },
    hsl: { _type: "hslaColor", h: hue, s: sl, l, a: 1 },
    hsv: { _type: "hsvaColor", h: hue, s: sv, v: max, a: 1 },
  };
}

// ── JSX attributes ──────────────────────────────────────────────────────

/** Read a JSX attribute: strings as-is, `{…}` expressions evaluated (our own content). */
function attr(node, name) {
  const a = node.attributes.find((x) => x.name === name);
  if (!a) return undefined;
  if (a.value === null) return true; // bare boolean: <Figure wide />
  if (typeof a.value === "string") return a.value;
  return new Function(`return (${a.value.value});`)();
}

// ── Portable text ───────────────────────────────────────────────────────

/** Inline mdast → spans, collecting link annotations in markDefs. */
function spans(nodes, marks = [], markDefs = []) {
  const out = [];
  for (const n of nodes) {
    if (n.type === "text") out.push({ _type: "span", _key: key(), text: n.value, marks });
    else if (n.type === "inlineCode") out.push({ _type: "span", _key: key(), text: n.value, marks });
    else if (n.type === "break") out.push({ _type: "span", _key: key(), text: "\n", marks });
    else if (n.type === "strong") out.push(...spans(n.children, [...marks, "strong"], markDefs));
    else if (n.type === "emphasis") out.push(...spans(n.children, [...marks, "em"], markDefs));
    else if (n.type === "link") {
      const k = key();
      markDefs.push({ _type: "link", _key: k, href: n.url });
      out.push(...spans(n.children, [...marks, k], markDefs));
    } else if (n.type === "mdxTextExpression") {
      // {" "} and the like
      const v = new Function(`return (${n.value});`)();
      if (typeof v === "string") out.push({ _type: "span", _key: key(), text: v, marks });
    } else warnings.push(`Unhandled inline ${n.type}`);
  }
  return out;
}

function block(children, style = "normal", extra = {}) {
  const markDefs = [];
  const s = spans(children, [], markDefs);
  return { _type: "block", _key: key(), style, markDefs, children: s.length ? s : [{ _type: "span", _key: key(), text: "", marks: [] }], ...extra };
}

/** Block-level mdast → portable text blocks. */
function blocks(node, level = 1, listItem) {
  switch (node.type) {
    case "paragraph":
      return [block(node.children, "normal", listItem ? { listItem, level } : {})];
    case "heading":
      return [block(node.children, node.depth <= 2 ? "h2" : "h3")];
    case "blockquote":
      return node.children.flatMap((c) => (c.type === "paragraph" ? [block(c.children, "blockquote")] : blocks(c)));
    case "list": {
      const kind = node.ordered ? "number" : "bullet";
      return node.children.flatMap((item) =>
        item.children.flatMap((c) =>
          c.type === "list" ? blocks(c, level + 1) : c.type === "paragraph" ? [block(c.children, "normal", { listItem: kind, level })] : blocks(c, level, kind),
        ),
      );
    }
    case "thematicBreak":
      return [];
    default:
      warnings.push(`Unhandled block ${node.type}`);
      return [];
  }
}

// ── Sections ────────────────────────────────────────────────────────────

const isJsx = (n, name) => n.type === "mdxJsxFlowElement" && n.name === name;

async function figure(n) {
  return picture(attr(n, "src"), attr(n, "alt"), attr(n, "caption"));
}

/** Top-level mdast nodes → sections. Prose between components becomes one Text section. */
async function sections(nodes) {
  const out = [];
  let text = [];
  const flush = () => {
    if (text.length) out.push({ _type: "textSection", _key: key(), text });
    text = [];
  };

  for (const n of nodes) {
    if (n.type === "mdxFlowExpression") {
      // {/* TODO … */} and {/* VISUAL … */} notes → Studio-only notes.
      const note = n.value.trim().replace(/^\/\*\s*/, "").replace(/\s*\*\/$/, "");
      if (note) {
        flush();
        out.push({ _type: "noteSection", _key: key(), text: note });
      }
      continue;
    }
    if (n.type !== "mdxJsxFlowElement") {
      if (n.type === "yaml" || n.type === "mdxjsEsm") continue;
      text.push(...blocks(n));
      continue;
    }
    flush();
    if (isJsx(n, "Figure")) {
      out.push({ _type: "imageSection", _key: key(), image: await figure(n), size: attr(n, "wide") ? "wide" : "contained" });
    } else if (isJsx(n, "FigureRow")) {
      const images = [];
      for (const c of n.children.filter((c) => isJsx(c, "Figure"))) images.push({ ...(await figure(c)), _key: key() });
      out.push({ _type: "imageRowSection", _key: key(), images, phones: Boolean(attr(n, "phone")) });
    } else if (isJsx(n, "Callout")) {
      const label = attr(n, "label");
      out.push({ _type: "calloutSection", _key: key(), ...(label ? { label } : {}), text: n.children.flatMap((c) => blocks(c)) });
    } else if (isJsx(n, "Metrics")) {
      out.push({ _type: "metricsSection", _key: key(), items: attr(n, "items").map((m) => ({ _type: "metric", _key: key(), ...m })) });
    } else if (isJsx(n, "PromptBlock")) {
      const output = n.children.flatMap((c) => blocks(c));
      out.push({
        _type: "promptSection",
        _key: key(),
        tool: attr(n, "tool") ?? "Claude",
        prompt: attr(n, "prompt"),
        ...(output.length ? { output } : {}),
      });
    } else if (isJsx(n, "BeforeAfter")) {
      const labels = attr(n, "labels") ?? ["Before", "After"];
      out.push({
        _type: "beforeAfterSection",
        _key: key(),
        before: await image(attr(n, "before")),
        after: await image(attr(n, "after")),
        alt: attr(n, "alt"),
        beforeLabel: labels[0],
        afterLabel: labels[1],
      });
    } else if (isJsx(n, "Tldr")) {
      out.push({ _type: "shortVersionSection", _key: key(), sections: await sections(n.children) });
    } else {
      warnings.push(`Unhandled component <${n.name}>`);
    }
  }
  flush();
  return out;
}

// ── Documents ───────────────────────────────────────────────────────────

const parser = unified().use(remarkParse).use(remarkMdx).use(remarkGfm);

async function toDocument(file) {
  current = file;
  const slug = path.basename(file).replace(/\.mdx?$/, "");
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  const parsed = frontmatter.safeParse(data);
  if (!parsed.success) throw new Error(`Invalid frontmatter in ${file}:\n${z.prettifyError(parsed.error)}`);
  const fm = parsed.data;
  const folder = path.basename(path.dirname(path.resolve(file)));
  const collection = flag("collection") ?? (collections.includes(folder) ? folder : fm.collection);
  if (!collections.includes(collection)) throw new Error(`Say which collection ${file} goes in: --collection=work|projects|play`);
  const tree = parser.parse(content);

  const card = fm.card
    ? {
        ...(fm.card.bg?.startsWith("#") ? { background: color(fm.card.bg) } : { backgroundCss: fm.card.bg }),
        titleColor: color(fm.card.title),
        textColor: color(fm.card.text),
        picture: fm.card.picture ?? "inset",
        ...(fm.mockup ? { mockup: await image(fm.mockup) } : {}),
        ...(fm.card.summary ? { summary: fm.card.summary } : {}),
      }
    : fm.mockup
      ? { picture: "float", mockup: await image(fm.mockup) }
      : undefined;

  const id = `${collection}-${slug}`;
  const doc = {
    _id: publish ? id : `drafts.${id}`,
    _type: "caseStudy",
    collection,
    slug: { _type: "slug", current: slug },
    title: fm.title,
    summary: fm.summary,
    ...(fm.cover ? { cover: { ...(await image(fm.cover)), _type: "image" } } : {}),
    sections: await sections(tree.children),
    role: fm.role,
    date: fm.date,
    duration: fm.duration,
    team: fm.team === undefined ? undefined : [].concat(fm.team),
    context: fm.context,
    tags: fm.tags,
    tools: fm.tools,
    ai: fm.ai,
    metrics: fm.metrics?.map((m) => ({ _type: "metric", _key: key(), ...m })),
    liveUrl: fm.liveUrl,
    repoUrl: fm.repoUrl,
    card,
    order: fm.order,
    featured: fm.featured ?? false,
    anonymised: fm.anonymised ?? false,
    accent: fm.accent,
  };
  // Drop empty fields so the Studio shows them as unset.
  return JSON.parse(JSON.stringify(doc, (_k, v) => (Array.isArray(v) && v.length === 0 ? undefined : v)));
}

const docs = [];
for (const file of files) {
  warnings.push(`— ${file}`);
  docs.push(await toDocument(file));
}

const problems = warnings.filter((w) => !w.startsWith("—"));
if (problems.length) console.log(`\n${warnings.join("\n")}`);

if (dry) {
  fs.mkdirSync(outDir, { recursive: true });
  for (const d of docs) fs.writeFileSync(path.join(outDir, `${d._id}.json`), JSON.stringify(d, null, 2));
  console.log(`\nDry run: ${docs.length} documents and ${uploaded.size} images written to ${outDir}/`);
} else {
  const tx = client.transaction();
  for (const d of docs) {
    if (replace) tx.createOrReplace(d);
    else tx.create(d);
  }
  try {
    await tx.commit();
  } catch (error) {
    if (String(error).includes("already exists")) {
      console.error(
        `\nThat ${publish ? "page is already live" : "draft already exists"} in Sanity, so it was left alone.` +
          " Re-run with --replace to overwrite it, which discards any changes made in the Studio.",
      );
      process.exit(1);
    }
    throw error;
  }
  console.log(`\nUploaded ${uploaded.size} images.`);
  console.log(publish ? "Published (live now):" : "Created as unpublished drafts:");
  for (const d of docs) {
    const id = d._id.replace("drafts.", "");
    console.log(`  ${d.title}`);
    if (publish) console.log(`    Site:   https://www.designbydyl.com/${d.collection}/${d.slug.current}`);
    console.log(`    Studio: https://www.designbydyl.com/studio/presentation?preview=/${d.collection}/${d.slug.current}`);
    console.log(`    Local:  http://localhost:3000/studio/structure/${d.collection};${id}`);
  }
}
