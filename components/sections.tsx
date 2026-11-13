import { PortableText, stegaClean, type PortableTextComponents } from "next-sanity";
import type { Image, Section } from "@/lib/content";
import type { Edit } from "@/lib/edit";
import { BeforeAfter } from "@/components/mdx/before-after";
import { Callout } from "@/components/mdx/callout";
import { Figure } from "@/components/mdx/figure";
import { FigureRow } from "@/components/mdx/figure-row";
import { Metrics } from "@/components/mdx/metrics";
import { PromptBlock } from "@/components/mdx/prompt-block";
import { Tldr } from "@/components/mdx/tldr";

/*
 * Draws a case study's Sanity sections with the site's own components. Text
 * renders as bare headings, paragraphs and lists so they sit directly in the
 * [data-prose] grid (globals.css), the same as the old MDX did.
 */

/** `edit` gives each block its own click-to-edit link, from the block's key. */
type BlockEdit = ((key: string) => string) | undefined;

const text = (edit?: BlockEdit): PortableTextComponents => ({
  block: {
    normal: ({ children, value }) => (
      <p data-sanity={edit?.(value._key ?? "")} className="my-5 text-ink-2">
        {children}
      </p>
    ),
    h2: ({ children, value }) => (
      <h2 data-sanity={edit?.(value._key ?? "")} className="mt-20 mb-6 type-display text-h2 leading-[1.05] text-ink">
        {children}
      </h2>
    ),
    h3: ({ children, value }) => (
      <h3 data-sanity={edit?.(value._key ?? "")} className="mt-12 mb-4 text-h3 font-medium tracking-tight text-ink">
        {children}
      </h3>
    ),
    blockquote: ({ children, value }) => (
      <blockquote data-sanity={edit?.(value._key ?? "")} className="my-12 type-display text-h3 leading-tight text-ink">
        <p className="text-ink">{children}</p>
      </blockquote>
    ),
  },
  listItem: ({ children, value }) => <li data-sanity={edit?.(value._key ?? "")}>{children}</li>,
  list: {
    bullet: ({ children }) => <ul className="my-5 list-disc space-y-2 pl-5 text-ink-2 marker:text-ink-3">{children}</ul>,
    number: ({ children }) => <ol className="my-5 list-decimal space-y-2 pl-5 text-ink-2 marker:text-ink-3">{children}</ol>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ children, value }) => (
      <a
        href={stegaClean(value?.href)}
        className="text-ink underline decoration-rule decoration-1 underline-offset-4 transition-colors duration-[var(--dur-2)] hover:decoration-accent"
      >
        {children}
      </a>
    ),
  },
});

/** Text inside a callout or prompt output: paragraphs without the prose margins. */
const inner: PortableTextComponents = {
  ...text(),
  block: { normal: ({ children }) => <p>{children}</p> },
};

function figure(image: Image | undefined, wide?: boolean, edit?: string) {
  if (!image?.url) return null;
  return (
    <Figure
      src={image.url}
      alt={image.alt ?? ""}
      caption={image.caption}
      width={image.width}
      height={image.height}
      wide={wide}
      edit={edit}
    />
  );
}

function SectionView({ section, path, edit }: { section: Section; path: string; edit?: Edit }) {
  const field = (name: string) => edit?.(`${path}.${name}`);
  const blocks: BlockEdit = edit && ((key) => edit(`${path}.text[_key=="${key}"]`));

  switch (section._type) {
    case "textSection":
      return section.text ? <PortableText value={section.text as never} components={text(blocks)} /> : null;

    case "textImageSection": {
      const side = stegaClean(section.side) === "left" ? "left" : "right";
      return (
        <div data-text-image={side}>
          <div data-text-image-text>
            {section.text && <PortableText value={section.text as never} components={text(blocks)} />}
          </div>
          <div data-text-image-picture>{figure(section.image, false, field("image"))}</div>
        </div>
      );
    }

    case "imageSection":
      return figure(section.image, stegaClean(section.size) === "wide", field("image"));

    case "imageRowSection":
      return (
        <FigureRow phone={section.phones}>
          {section.images?.map((image, i) => (
            <Figure
              key={i}
              edit={field(`images[${i}]`)}
              src={image.url}
              alt={image.alt ?? ""}
              caption={image.caption}
              width={image.width}
              height={image.height}
            />
          ))}
        </FigureRow>
      );

    case "calloutSection":
      return (
        <Callout label={section.label} edit={field("text")}>
          {section.text && <PortableText value={section.text as never} components={inner} />}
        </Callout>
      );

    case "metricsSection":
      return section.items?.length ? <Metrics items={section.items} edit={field("items")} /> : null;

    case "beforeAfterSection":
      if (!section.before?.url || !section.after?.url) return null;
      return (
        <BeforeAfter
          before={section.before.url}
          after={section.after.url}
          alt={section.alt ?? ""}
          labels={[section.beforeLabel ?? "Before", section.afterLabel ?? "After"]}
          width={section.after.width}
          height={section.after.height}
          edit={edit?.(path)}
        />
      );

    case "promptSection":
      return (
        <PromptBlock tool={section.tool} prompt={section.prompt ?? ""} edit={field("prompt")}>
          {section.output?.length ? <PortableText value={section.output as never} components={inner} /> : undefined}
        </PromptBlock>
      );

    case "shortVersionSection":
      return (
        <Tldr>
          <Sections sections={section.sections ?? []} edit={edit} path={`${path}.sections`} />
        </Tldr>
      );

    // Notes are for the Studio only.
    case "noteSection":
    default:
      return null;
  }
}

/**
 * `edit` (Studio preview only) adds click-to-edit links. `path` is where these
 * sections live in the document: the page's sections, or the short version's.
 */
export function Sections({ sections, edit, path = "sections" }: { sections: Section[]; edit?: Edit; path?: string }) {
  return sections.map((section) => (
    <SectionView key={section._key} section={section} path={`${path}[_key=="${section._key}"]`} edit={edit} />
  ));
}
