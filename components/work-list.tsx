"use client";

import { useRef, useState, ViewTransition } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { Cover } from "@/components/cover";
import { spring } from "@/lib/motion";
import type { Entry } from "@/lib/content";
import { href } from "@/lib/paths";

export type ListEntry = Pick<
  Entry,
  "slug" | "collection" | "title" | "summary" | "date" | "role" | "tools" | "cover" | "accent" | "draft"
>;

const labels: Record<Entry["collection"], string> = {
  work: "Case study",
  projects: "Project",
  play: "Play",
};

/**
 * Index rows with a cursor-following preview. The preview is a window onto
 * a vertical reel of covers that slides to the hovered row; clicking morphs
 * that cover into the case-study hero (shared ViewTransition name).
 */
export function WorkList({ entries, startIndex = 0 }: { entries: ListEntry[]; startIndex?: number }) {
  const [active, setActive] = useState<number | null>(null);
  const [inside, setInside] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const px = useSpring(x, spring.follow);
  const py = useSpring(y, spring.follow);

  function onPointerMove(event: React.PointerEvent) {
    if (event.pointerType !== "mouse") return;
    x.set(event.clientX);
    y.set(event.clientY);
    if (!inside) {
      // Jump the spring to the pointer on entry so it doesn't fly in from 0,0.
      px.jump(event.clientX);
      py.jump(event.clientY);
      setInside(true);
    }
  }

  const visible = inside && active !== null;

  return (
    <div className="relative">
      <motion.ul
        ref={listRef}
        layout
        onPointerMove={onPointerMove}
        onPointerLeave={() => {
          setInside(false);
          setActive(null);
        }}
        className="border-t border-rule"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {entries.map((entry, i) => (
            <motion.li
              key={`${entry.collection}/${entry.slug}`}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={spring.settle}
              className="border-b border-rule"
            >
              <Link
                href={href(entry)}
                transitionTypes={["nav-forward"]}
                data-cursor="View"
                onPointerEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className={`group grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 py-6 transition-opacity duration-[var(--dur-3)] md:grid-cols-[4rem_1fr_10rem_5rem] md:py-8 ${
                  active !== null && active !== i ? "md:opacity-35" : ""
                }`}
              >
                <span className="eyebrow">{String(startIndex + i + 1).padStart(2, "0")}</span>
                <span className="min-w-0">
                  <span className="type-display block text-h3 leading-[1.05] transition-transform duration-[var(--dur-3)] ease-[var(--ease-out)] md:group-hover:translate-x-3">
                    {entry.title}
                  </span>
                  <span className="mt-2 block max-w-[60ch] text-small text-ink-2 md:hidden">{entry.summary}</span>
                </span>
                <span className="eyebrow col-start-2 mt-3 md:col-start-auto md:mt-0">
                  {labels[entry.collection]}
                  {entry.draft && " · draft"}
                </span>
                <span className="eyebrow hidden text-right md:block">{entry.date.slice(0, 4)}</span>
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      {/* Floating preview, pointer devices only. */}
      <motion.div
        aria-hidden
        style={{ x: px, y: py }}
        className="pointer-events-none fixed top-0 left-0 z-40 hidden md:block"
      >
        <motion.div
          initial={false}
          animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.6, rotate: visible ? 0 : -6 }}
          transition={spring.settle}
          className="-translate-x-1/2 -translate-y-[60%] overflow-hidden rounded-sm shadow-[0_30px_60px_-20px_rgb(0_0_0/0.35)]"
          style={{ width: "min(26vw, 380px)", aspectRatio: "4 / 3" }}
        >
          <motion.div
            animate={{ y: `${-(active ?? 0) * 100}%` }}
            transition={spring.settle}
            className="h-full"
          >
            {entries.map((entry, i) =>
              i === active && visible ? (
                <ViewTransition key={entry.slug} name={`cover-${entry.collection}-${entry.slug}`} share="morph">
                  <Cover entry={entry} index={startIndex + i} className="h-full w-full" />
                </ViewTransition>
              ) : (
                <Cover key={entry.slug} entry={entry} index={startIndex + i} className="h-full w-full" />
              ),
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
