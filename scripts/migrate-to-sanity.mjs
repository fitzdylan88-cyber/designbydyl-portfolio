/**
 * One-off move of the MDX case studies into Sanity.
 *
 *   node --env-file=.env.local scripts/migrate-to-sanity.mjs --dry   # write JSON only
 *   node --env-file=.env.local scripts/migrate-to-sanity.mjs         # upload images, write docs
 *
 * Safe to re-run: documents use fixed ids (`<collection>-<slug>`) and are
 * replaced, and Sanity de-duplicates identical image uploads. Entries marked
 * `draft: true` go in as unpublished drafts.
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

const dry = process.argv.includes("--dry");
const outDir = process.argv.find((a) => a.startsWith("--out="))?.slice(6) ?? "sanity-migration";
const root = process.cwd();
const collections = ["work", "projects", "play"];

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

/** Upload a /public image once and return a Sanity image reference. */
async function image(src) {
  if (!src) return undefined;
  if (!src.startsWith("/")) throw new Error(`Image path must start with /: ${src}`);
  const file = path.join(root, "public", src);
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

async function toDocument(collection, file) {
  const slug = file.replace(/\.mdx$/, "");
  const { data: fm, content } = matter(fs.readFileSync(path.join(root, "content", collection, file), "utf8"));
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
    _id: fm.draft ? `drafts.${id}` : id,
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
for (const collection of collections) {
  const dir = path.join(root, "content", collection);
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".mdx") && !f.startsWith("_"))) {
    warnings.push(`— ${collection}/${file}`);
    docs.push(await toDocument(collection, file));
  }
}

const problems = warnings.filter((w) => !w.startsWith("—"));
if (problems.length) console.log(`\n${warnings.join("\n")}`);

if (dry) {
  fs.mkdirSync(outDir, { recursive: true });
  for (const d of docs) fs.writeFileSync(path.join(outDir, `${d._id}.json`), JSON.stringify(d, null, 2));
  console.log(`\nDry run: ${docs.length} documents and ${uploaded.size} images written to ${outDir}/`);
} else {
  const tx = client.transaction();
  for (const d of docs) tx.createOrReplace(d);
  await tx.commit();
  console.log(`\nUploaded ${uploaded.size} images and wrote ${docs.length} documents:`);
  for (const d of docs) console.log(`  ${d._id}`);
}
