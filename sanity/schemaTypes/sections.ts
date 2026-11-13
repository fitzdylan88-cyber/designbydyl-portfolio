import { defineArrayMember, defineField, defineType } from "sanity";

/*
 * The sections a case study is built from. Each one maps to a site component
 * (components/mdx), so whatever is arranged in the Studio keeps the site's
 * layout, spacing and phone behaviour.
 */

const altField = defineField({
  name: "alt",
  title: "Alt text",
  type: "string",
  description: "Describe what the image shows, for screen readers.",
  validation: (r) => r.required(),
});

/** An image with alt text and an optional caption. */
export const picture = defineType({
  name: "picture",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [altField, defineField({ name: "caption", title: "Caption", type: "string" })],
  preview: { select: { title: "caption", subtitle: "alt", media: "asset" } },
});

export const textSection = defineType({
  name: "textSection",
  title: "Text",
  type: "object",
  fields: [defineField({ name: "text", title: "Text", type: "richText" })],
  preview: {
    select: { blocks: "text" },
    prepare: ({ blocks }) => ({ title: firstLine(blocks) ?? "Text", subtitle: "Text" }),
  },
});

export const textImageSection = defineType({
  name: "textImageSection",
  title: "Text and image",
  type: "object",
  fields: [
    defineField({ name: "text", title: "Text", type: "richText" }),
    defineField({ name: "image", title: "Image", type: "picture", validation: (r) => r.required() }),
    defineField({
      name: "side",
      title: "Image side",
      type: "string",
      options: { list: [{ title: "Right", value: "right" }, { title: "Left", value: "left" }], layout: "radio", direction: "horizontal" },
      initialValue: "right",
    }),
  ],
  preview: {
    select: { blocks: "text", media: "image.asset", side: "side" },
    prepare: ({ blocks, media, side }) => ({
      title: firstLine(blocks) ?? "Text and image",
      subtitle: `Text and image · image ${side ?? "right"}`,
      media,
    }),
  },
});

export const imageSection = defineType({
  name: "imageSection",
  title: "Image",
  type: "object",
  fields: [
    defineField({ name: "image", title: "Image", type: "picture", validation: (r) => r.required() }),
    defineField({
      name: "size",
      title: "Size",
      type: "string",
      options: {
        list: [
          { title: "Contained (beside the text column)", value: "contained" },
          { title: "Wide", value: "wide" },
        ],
        layout: "radio",
      },
      initialValue: "contained",
    }),
  ],
  preview: {
    select: { caption: "image.caption", alt: "image.alt", media: "image.asset", size: "size" },
    prepare: ({ caption, alt, media, size }) => ({ title: caption || alt || "Image", subtitle: `Image · ${size ?? "contained"}`, media }),
  },
});

export const imageRowSection = defineType({
  name: "imageRowSection",
  title: "Image pair or row",
  type: "object",
  fields: [
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [defineArrayMember({ type: "picture" })],
      options: { layout: "grid" },
      validation: (r) => r.min(2),
    }),
    defineField({
      name: "phones",
      title: "Phone screenshots",
      type: "boolean",
      description: "Four to a row with no backing box, for tall phone screens.",
      initialValue: false,
    }),
  ],
  preview: {
    select: { images: "images", phones: "phones", media: "images.0.asset" },
    prepare: ({ images, phones, media }) => ({
      title: `${images?.length ?? 0} images`,
      subtitle: phones ? "Image row · phones" : "Image pair",
      media,
    }),
  },
});

export const calloutSection = defineType({
  name: "calloutSection",
  title: "Callout",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Label", type: "string", description: "Optional small heading." }),
    defineField({ name: "text", title: "Text", type: "simpleText" }),
  ],
  preview: {
    select: { blocks: "text", label: "label" },
    prepare: ({ blocks, label }) => ({ title: firstLine(blocks) ?? "Callout", subtitle: label ? `Callout · ${label}` : "Callout" }),
  },
});

export const metric = defineType({
  name: "metric",
  title: "Metric",
  type: "object",
  fields: [
    defineField({ name: "value", title: "Number", type: "string", description: "e.g. 300+ or Top 3", validation: (r) => r.required() }),
    defineField({ name: "label", title: "Label", type: "string", validation: (r) => r.required() }),
  ],
  preview: { select: { title: "value", subtitle: "label" } },
});

export const metricsSection = defineType({
  name: "metricsSection",
  title: "Metrics",
  type: "object",
  fields: [defineField({ name: "items", title: "Metrics", type: "array", of: [defineArrayMember({ type: "metric" })] })],
  preview: {
    select: { items: "items" },
    prepare: ({ items }) => ({
      title: (items ?? []).map((m: { value?: string }) => m.value).join(" · ") || "Metrics",
      subtitle: "Metrics",
    }),
  },
});

export const beforeAfterSection = defineType({
  name: "beforeAfterSection",
  title: "Before / after slider",
  type: "object",
  fields: [
    defineField({ name: "before", title: "Before", type: "image", validation: (r) => r.required() }),
    defineField({ name: "after", title: "After", type: "image", validation: (r) => r.required() }),
    altField,
    defineField({ name: "beforeLabel", title: "Before label", type: "string", initialValue: "Before" }),
    defineField({ name: "afterLabel", title: "After label", type: "string", initialValue: "After" }),
  ],
  preview: {
    select: { title: "alt", media: "after.asset" },
    prepare: ({ title, media }) => ({ title: title ?? "Before / after", subtitle: "Before / after slider", media }),
  },
});

export const promptSection = defineType({
  name: "promptSection",
  title: "Prompt",
  type: "object",
  fields: [
    defineField({ name: "tool", title: "Tool", type: "string", initialValue: "Claude" }),
    defineField({ name: "prompt", title: "Prompt", type: "text", rows: 8, validation: (r) => r.required() }),
    defineField({ name: "output", title: "Output", type: "simpleText" }),
  ],
  preview: {
    select: { tool: "tool", prompt: "prompt" },
    prepare: ({ tool, prompt }) => ({ title: prompt?.split("\n")[0] ?? "Prompt", subtitle: `Prompt to ${tool ?? "Claude"}` }),
  },
});

/** Sections that can go anywhere, including inside the short version. */
export const contentSections = [
  "textSection",
  "textImageSection",
  "imageSection",
  "imageRowSection",
  "calloutSection",
  "metricsSection",
  "beforeAfterSection",
  "promptSection",
] as const;

export const shortVersionSection = defineType({
  name: "shortVersionSection",
  title: "Short version (TL;DR)",
  type: "object",
  description: "The quick read shown when someone picks the short version.",
  fields: [
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      of: contentSections.map((type) => defineArrayMember({ type })),
    }),
  ],
  preview: {
    select: { sections: "sections" },
    prepare: ({ sections }) => ({ title: "Short version", subtitle: `${sections?.length ?? 0} sections` }),
  },
});

type Block = { _type?: string; children?: { text?: string }[] };

/** The first line of rich text, for list previews. */
function firstLine(blocks?: Block[]) {
  const text = blocks?.find((b) => b._type === "block")?.children?.map((c) => c.text).join("");
  return text ? (text.length > 80 ? `${text.slice(0, 80)}…` : text) : undefined;
}
