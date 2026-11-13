import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import type { Entry } from "@/lib/content";
import { href } from "@/lib/paths";
import { Cover } from "@/components/cover";

/*
 * Swimlane card: title and summary up top, the device below, cropped by the
 * card's bottom and right edges so only part of it shows. The picture starts
 * where the text ends, so a long title never runs into it, and the summary is
 * capped at three lines so the picture keeps its room. A `mockup` (a
 * device PNG on a transparent background) sits on the card's tint. Until one
 * exists, the cover image stands in as a screen peeking in from the corner,
 * and entries with neither fall back to the generative cover. On hover the
 * whole card lifts 1% and its shadow deepens; the picture stays put.
 */

const tints = [
  "color-mix(in oklab, var(--sky) 20%, var(--paper))",
  "var(--paper-2)",
  "color-mix(in oklab, var(--accent) 14%, var(--paper))",
];

type CardEntry = Pick<Entry, "slug" | "collection" | "title" | "summary" | "cover" | "mockup" | "accent">;

export function DeviceCard({ entry, index }: { entry: CardEntry; index: number }) {
  return (
    <Link
      href={href(entry)}
      transitionTypes={["nav-forward"]}
      data-cursor="View"
      className="group relative flex aspect-[4/5] flex-col overflow-hidden rounded-[18px] shadow-[2px_4px_12px_rgb(8_72_135/0.08)] transition-[scale,box-shadow] duration-300 ease-[cubic-bezier(0,0,0.5,1)] hover:scale-[1.01] hover:shadow-[2px_4px_16px_rgb(8_72_135/0.16)] md:rounded-[28px]"
      style={{ background: tints[index % tints.length] }}
    >
      <div className="relative z-10 shrink-0 p-6 pb-5 md:p-7 md:pb-6">
        <h3 className="type-display max-w-[18ch] text-h3 leading-tight text-ink">{entry.title.split(":")[0]}</h3>
        <p className="mt-3 line-clamp-3 max-w-[40ch] text-small text-ink-2">{entry.summary}</p>
      </div>

      <div className="relative min-h-0 flex-1">
        <ViewTransition name={`cover-${entry.collection}-${entry.slug}`} share="morph">
          {entry.mockup ? (
            <div className="absolute top-0 -right-[12%] -bottom-[14%] left-[14%]">
              <Image
                src={entry.mockup}
                alt=""
                fill
                sizes="(min-width: 1024px) 30vw, (min-width: 768px) 50vw, 85vw"
                className="object-contain object-left-top"
              />
            </div>
          ) : (
            <div className="absolute top-0 -right-[8%] -bottom-[8%] left-[14%] overflow-hidden rounded-xl shadow-[0_24px_48px_-24px_rgb(8_72_135/0.45)]">
              {entry.cover ? (
                <Image
                  src={entry.cover}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 768px) 50vw, 85vw"
                  className="object-cover object-left-top"
                />
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
