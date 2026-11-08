import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import type { Entry } from "@/lib/content";
import { href } from "@/lib/paths";
import { Cover } from "@/components/cover";

/*
 * Swimlane card: title and summary up top, the device below, cropped by the
 * card's bottom and right edges so only part of it shows. A `mockup` (a
 * device PNG on a transparent background) sits on the card's tint. Until one
 * exists, the cover image stands in as a screen peeking in from the corner,
 * and entries with neither fall back to the generative cover.
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
      className="group relative flex aspect-[4/5] flex-col overflow-hidden rounded-2xl md:rounded-3xl"
      style={{ background: tints[index % tints.length] }}
    >
      <div className="relative z-10 p-6 md:p-8">
        <h3 className="type-display max-w-[18ch] text-h3 leading-tight text-ink">{entry.title.split(":")[0]}</h3>
        <p className="mt-3 max-w-[40ch] text-small text-ink-2">{entry.summary}</p>
      </div>

      <ViewTransition name={`cover-${entry.collection}-${entry.slug}`} share="morph">
        {entry.mockup ? (
          <div className="absolute -right-[12%] -bottom-[14%] left-[14%] h-[66%] transition-transform duration-[var(--dur-3)] ease-[var(--ease-out)] group-hover:-translate-y-2">
            <Image
              src={entry.mockup}
              alt=""
              fill
              sizes="(min-width: 1024px) 30vw, (min-width: 768px) 50vw, 85vw"
              className="object-contain object-left-top"
            />
          </div>
        ) : (
          <div className="absolute top-[46%] -right-[8%] -bottom-[8%] left-[14%] overflow-hidden rounded-xl shadow-[0_24px_48px_-24px_rgb(8_72_135/0.45)] transition-transform duration-[var(--dur-3)] ease-[var(--ease-out)] group-hover:-translate-y-2">
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
    </Link>
  );
}
