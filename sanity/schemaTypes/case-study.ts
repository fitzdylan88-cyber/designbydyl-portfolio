import { defineArrayMember, defineField, defineType } from "sanity";
import { tagOptions } from "../../lib/tags";
import { contentSections } from "./sections";

/**
 * A case study, project or play piece. The fields mirror the MDX frontmatter
 * in lib/content.ts, so both can feed the site during the move.
 */
export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case study",
  type: "document",
  groups: [
    { name: "page", title: "Page", default: true },
    { name: "details", title: "Details" },
    { name: "card", title: "Home card" },
    { name: "publishing", title: "Publishing" },
  ],
  fields: [
    defineField({ name: "title", title: "Title", type: "string", group: "page", validation: (r) => r.required() }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      group: "page",
      validation: (r) => r.required().max(220),
    }),
    defineField({ name: "cover", title: "Cover image", type: "image", options: { hotspot: true }, group: "page" }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      group: "page",
      description: "Add sections with the button below. Drag the handles to reorder.",
      of: [...contentSections, "shortVersionSection"].map((type) => defineArrayMember({ type })),
    }),

    defineField({ name: "role", title: "Role", type: "string", group: "details", validation: (r) => r.required() }),
    defineField({
      name: "date",
      title: "Date",
      type: "string",
      group: "details",
      description: "Year and month, e.g. 2025-06.",
      validation: (r) =>
        r
          .required()
          .regex(/^\d{4}-\d{2}$/, { name: "YYYY-MM" }),
    }),
    defineField({ name: "duration", title: "Duration", type: "string", group: "details" }),
    defineField({
      name: "team",
      title: "Team",
      type: "array",
      group: "details",
      description: "One role per line, yours first. No names.",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "context",
      title: "Company",
      type: "string",
      group: "details",
      description: "A descriptor instead of a name, e.g. Irish fintech, ~300 people.",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      group: "details",
      of: [defineArrayMember({ type: "string" })],
      options: { list: tagOptions.map((t) => ({ title: t, value: t })) },
      validation: (r) => r.max(3),
    }),
    defineField({ name: "tools", title: "Tools", type: "array", group: "details", of: [defineArrayMember({ type: "string" })], options: { layout: "tags" } }),
    defineField({ name: "ai", title: "AI techniques", type: "array", group: "details", of: [defineArrayMember({ type: "string" })], options: { layout: "tags" } }),
    defineField({ name: "metrics", title: "Headline metrics", type: "array", group: "details", of: [defineArrayMember({ type: "metric" })] }),
    defineField({ name: "liveUrl", title: "Live link", type: "url", group: "details" }),
    defineField({ name: "repoUrl", title: "Code link", type: "url", group: "details" }),

    defineField({
      name: "card",
      title: "Home card",
      type: "object",
      group: "card",
      description: "How this project's card looks in the home swimlane. Leave empty to use the site colours.",
      fields: [
        defineField({ name: "background", title: "Background colour", type: "color", options: { disableAlpha: true } }),
        defineField({
          name: "backgroundCss",
          title: "Background (advanced)",
          type: "string",
          description: "Any CSS background, e.g. a gradient. Overrides the colour above.",
        }),
        defineField({ name: "titleColor", title: "Title colour", type: "color", options: { disableAlpha: true } }),
        defineField({ name: "textColor", title: "Text colour", type: "color", options: { disableAlpha: true } }),
        defineField({
          name: "picture",
          title: "Picture",
          type: "string",
          options: {
            list: [
              { title: "Inset: cover framed in from the left", value: "inset" },
              { title: "Full width: cover across the whole card", value: "bleed" },
              { title: "Floating: the device image, no frame", value: "float" },
            ],
            layout: "radio",
          },
          initialValue: "inset",
        }),
        defineField({
          name: "mockup",
          title: "Device image",
          type: "image",
          description: "A device on a transparent background, for the Floating picture.",
          hidden: ({ parent }) => parent?.picture !== "float",
        }),
        defineField({ name: "summary", title: "Card summary", type: "text", rows: 2, description: "A shorter blurb for the card only." }),
      ],
    }),

    defineField({
      name: "collection",
      title: "Section of the site",
      type: "string",
      group: "publishing",
      options: {
        list: [
          { title: "Work", value: "work" },
          { title: "Projects", value: "projects" },
          { title: "Play", value: "play" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "work",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Web address",
      type: "slug",
      group: "publishing",
      options: { source: "title", maxLength: 60 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "order", title: "Order", type: "number", group: "publishing", description: "Lower numbers come first." }),
    defineField({ name: "featured", title: "Featured", type: "boolean", group: "publishing", initialValue: false }),
    defineField({
      name: "anonymised",
      title: "Anonymised employer work",
      type: "boolean",
      group: "publishing",
      initialValue: false,
    }),
    defineField({ name: "accent", title: "Accent colour", type: "string", group: "publishing" }),
  ],
  orderings: [
    { title: "Order", name: "order", by: [{ field: "order", direction: "asc" }, { field: "date", direction: "desc" }] },
  ],
  preview: {
    select: { title: "title", collection: "collection", date: "date", media: "cover.asset" },
    prepare: ({ title, collection, date, media }) => ({
      title: title?.split(":")[0],
      subtitle: [collection, date].filter(Boolean).join(" · "),
      media,
    }),
  },
});
