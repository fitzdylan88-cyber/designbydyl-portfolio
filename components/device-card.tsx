import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import type { Entry } from "@/lib/content";
import { href } from "@/lib/paths";
import { Cover } from "@/components/cover";

/*
 * Swimlane card: title and summary up top, the picture below. Each project
 * can theme its card (`card` in the frontmatter) so it looks like the work:
 * its own background, title and text colours, and one of three pictures.
 * "inset" frames the cover in from the left and runs it off the right and
 * bottom edges, "bleed" runs it the full card width, and "float" sets a
 * `mockup` (a device on a transparent background) straight on the card at
 * 70% of its width, top-right, running off the bottom edge.
 * Cards without a theme use the site tints. The text block takes at least
 * the top 46% so pictures line up across cards, and grows rather than
 * overlapping when a title runs long; the summary stops at three lines. On
 * hover the whole card lifts 1% and its shadow deepens; the picture stays put.
 */

const tints = [
  "color-mix(in oklab, var(--sky) 20%, var(--paper))",
  "var(--paper-2)",
  "color-mix(in oklab, var(--accent) 14%, var(--paper))",
];

const sizes = "(min-width: 1024px) 30vw, (min-width: 768px) 50vw, 85vw";

type CardEntry = Pick<Entry, "slug" | "collection" | "title" | "summary" | "cover" | "mockup" | "accent" | "card" | "edit">;

export function DeviceCard({ entry, index }: { entry: CardEntry; index: number }) {
  const theme = entry.card;
  const picture = theme?.picture ?? (entry.mockup ? "float" : "inset");

  return (
    <Link
      href={href(entry)}
      transitionTypes={["nav-forward"]}
      data-cursor="View"
      className="group relative flex aspect-[4/5] flex-col overflow-hidden rounded-[18px] shadow-[2px_4px_12px_rgb(8_72_135/0.08)] transition-[scale,box-shadow] duration-300 ease-[cubic-bezier(0,0,0.5,1)] hover:scale-[1.01] hover:shadow-[2px_4px_16px_rgb(8_72_135/0.16)] md:rounded-[28px]"
      style={{ background: theme?.bg ?? tints[index % tints.length] }}
    >
      <div className="relative z-10 min-h-[46%] shrink-0 p-6 pb-5 md:p-7 md:pb-6">
        <h3
          data-sanity={entry.edit?.title}
          className="type-display max-w-[18ch] text-h3 leading-tight text-ink"
          style={theme && { color: theme.title }}
        >
          {entry.title.split(":")[0]}
        </h3>
        <p
          data-sanity={entry.edit?.cardSummary}
          className="mt-3 line-clamp-3 max-w-[40ch] text-small text-ink-2"
          style={theme && { color: theme.text }}
        >
          {theme?.summary ?? entry.summary}
        </p>
      </div>

      <div className="relative min-h-0 flex-1" data-sanity={entry.edit?.card}>
        <ViewTransition name={`cover-${entry.collection}-${entry.slug}`} share="morph">
          {picture === "float" && entry.mockup ? (
            <div className="absolute top-0 right-0 w-[70%]">
              <Image src={entry.mockup} alt="" width={800} height={800} sizes={sizes} className="h-auto w-full" />
            </div>
          ) : (
            <div
              className={`absolute inset-y-0 right-0 overflow-hidden ${
                picture === "bleed" ? "left-0" : "left-[14%] rounded-tl-xl"
              }`}
            >
              {entry.cover ? (
                <Image src={entry.cover} alt="" fill sizes={sizes} className="object-cover object-left-top" />
              ) : (
                <Cover entry={entry} index={index} size="sm" className="h-full w-full" />
              )}
            </div>
          )}
        </ViewTransition>
      </div>
    </Link>
  );
}
