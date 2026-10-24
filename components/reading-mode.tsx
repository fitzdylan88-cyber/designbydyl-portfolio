"use client";

import { useId, useSyncExternalStore } from "react";
import { motion } from "motion/react";
import { useLenis } from "lenis/react";
import { spring } from "@/lib/motion";
import { Arrow } from "@/components/icons";
import { READING_STORAGE_KEY } from "@/lib/reading-mode";

/*
 * Full story / quick read. The mode lives on <html data-reading>, so CSS does
 * the switching (see globals.css) and the MDX body stays a server component.
 * The choice is remembered, so a reader who picks the quick read keeps it on
 * the next project.
 */

export type ReadingMode = "full" | "quick";

const listeners = new Set<() => void>();

function getMode(): ReadingMode {
  return document.documentElement.dataset.reading === "quick" ? "quick" : "full";
}

function setMode(mode: ReadingMode) {
  document.documentElement.dataset.reading = mode;
  try {
    localStorage.setItem(READING_STORAGE_KEY, mode);
  } catch {}
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function useReadingMode() {
  return useSyncExternalStore(subscribe, getMode, () => "full" as const);
}

function useScrollToBody() {
  const lenis = useLenis();
  return () => {
    const body = document.getElementById("story");
    if (!body || body.getBoundingClientRect().top > 0) return;
    if (lenis) lenis.scrollTo(body, { offset: -96 });
    else body.scrollIntoView({ block: "start" });
  };
}

function shortTime(seconds: number) {
  return seconds >= 60 ? `${Math.round(seconds / 60)} min` : `${seconds} sec`;
}

/** Non-breaking hyphen, so "30-second" never wraps mid-word. */
function longTime(seconds: number) {
  return seconds >= 60 ? `${Math.round(seconds / 60)}\u2011minute` : `${seconds}\u2011second`;
}

export function ReadingToggle({ fullMinutes, tldrSeconds }: { fullMinutes: number; tldrSeconds: number }) {
  const mode = useReadingMode();
  const noteId = useId();
  const options = [
    { value: "full", label: "Full story", time: `${fullMinutes} min` },
    { value: "quick", label: "Quick read", time: shortTime(tldrSeconds) },
  ] as const;

  return (
    <div className="flex flex-col items-start gap-3">
      <p id={noteId} className="text-small text-ink-2">
        Reviewing a lot of portfolios? Here&rsquo;s the {longTime(tldrSeconds)} version.
      </p>
      <div
        role="group"
        aria-labelledby={noteId}
        className="inline-flex rounded-full border border-rule p-1"
      >
        {options.map((option) => {
          const selected = mode === option.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => setMode(option.value)}
              className="relative rounded-full px-4 py-2 text-small transition-colors duration-[var(--dur-2)] pointer-coarse:py-2.5"
            >
              {selected && (
                <motion.span
                  layoutId="reading-pill"
                  transition={spring.snappy}
                  className="absolute inset-0 rounded-full bg-ink"
                />
              )}
              <span className={`relative font-medium ${selected ? "text-paper" : "text-ink"}`}>{option.label}</span>
              <span className={`relative ml-2 meta ${selected ? "text-paper/70" : ""}`}>{option.time}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Closes the quick read: a way into the full story for anyone it hooked. */
export function ReadFullStory() {
  const scrollToBody = useScrollToBody();
  return (
    <button
      type="button"
      onClick={() => {
        setMode("full");
        scrollToBody();
      }}
      className="group mt-10 inline-flex items-center gap-2 text-body font-medium text-ink"
    >
      Read the full story
      <Arrow className="text-accent transition-transform duration-[var(--dur-2)] group-hover:translate-x-1" />
    </button>
  );
}
