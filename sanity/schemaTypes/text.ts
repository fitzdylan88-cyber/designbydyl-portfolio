import { defineArrayMember, defineType } from "sanity";

/**
 * Rich text used inside sections. "Section heading" is the big label that
 * sits in the left columns on desktop; "Subheading" sits with the text.
 */
export const richText = defineType({
  name: "richText",
  title: "Text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Paragraph", value: "normal" },
        { title: "Section heading", value: "h2" },
        { title: "Subheading", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullets", value: "bullet" },
        { title: "Numbers", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
        ],
        annotations: [
          {
            name: "link",
            title: "Link",
            type: "object",
            fields: [{ name: "href", title: "URL", type: "string", validation: (r) => r.required() }],
          },
        ],
      },
    }),
  ],
});

/** Text without headings, for callouts and short blurbs. */
export const simpleText = defineType({
  name: "simpleText",
  title: "Text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [{ title: "Paragraph", value: "normal" }],
      lists: [{ title: "Bullets", value: "bullet" }],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
        ],
        annotations: [
          {
            name: "link",
            title: "Link",
            type: "object",
            fields: [{ name: "href", title: "URL", type: "string", validation: (r) => r.required() }],
          },
        ],
      },
    }),
  ],
});
