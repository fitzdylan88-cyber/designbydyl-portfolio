"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { spring } from "@/lib/motion";

type Mode = { kind: "default" } | { kind: "link" } | { kind: "label"; text: string } | { kind: "hidden" };

const TEXT_INPUTS = "input:not([type=range]):not([type=checkbox]):not([type=radio]), textarea, select, [contenteditable]";

/**
 * Site cursor: an exact dot plus a ring on the `follow` spring. Context comes
 * from the element under the pointer:
 *  - `data-cursor="View"` → labelled disc
 *  - links and buttons → larger ring
 *  - text inputs → native cursor
 * Mouse only; disabled for touch and reduced motion.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<Mode>({ kind: "hidden" });
  const [pressed, setPressed] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, spring.follow);
  const ry = useSpring(y, spring.follow);

  useEffect(() => {
    const query = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
    const sync = () => setEnabled(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");

    function resolve(target: EventTarget | null): Mode {
      if (!(target instanceof Element)) return { kind: "default" };
      if (target.closest(TEXT_INPUTS)) return { kind: "hidden" };
      const labelled = target.closest<HTMLElement>("[data-cursor]");
      if (labelled) {
        const text = labelled.dataset.cursor ?? "";
        return text === "none" ? { kind: "hidden" } : { kind: "label", text };
      }
      if (target.closest("a, button, [role=button], [role=switch], [role=radio], label")) return { kind: "link" };
      return { kind: "default" };
    }

    function update(target: EventTarget | null) {
      setMode((prev) => {
        const next = resolve(target);
        return prev.kind === next.kind && (next.kind !== "label" || (prev.kind === "label" && prev.text === next.text))
          ? prev
          : next;
      });
    }

    function onMove(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
      x.set(event.clientX);
      y.set(event.clientY);
      update(event.target);
    }

    // Content moves under a still pointer while scrolling; re-check what's there.
    function onScroll() {
      if (x.get() < 0) return;
      update(document.elementFromPoint(x.get(), y.get()));
    }
    const onLeave = () => setMode({ kind: "hidden" });
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const ring =
    mode.kind === "label"
      ? { size: 88, bg: "var(--ink)", border: "var(--ink)", opacity: 1 }
      : mode.kind === "link"
        ? { size: 52, bg: "transparent", border: "var(--accent)", opacity: 1 }
        : mode.kind === "hidden"
          ? { size: 32, bg: "transparent", border: "var(--ink)", opacity: 0 }
          : { size: 32, bg: "transparent", border: "color-mix(in oklab, var(--ink) 35%, transparent)", opacity: 1 };

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      <motion.div
        style={{ x: rx, y: ry }}
        className="absolute top-0 left-0"
      >
        <motion.div
          animate={{
            width: ring.size,
            height: ring.size,
            backgroundColor: ring.bg,
            borderColor: ring.border,
            opacity: ring.opacity,
            scale: pressed ? 0.85 : 1,
          }}
          transition={spring.snappy}
          className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border"
        >
          <AnimatePresence mode="popLayout">
            {mode.kind === "label" && (
              <motion.span
                key={mode.text}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={spring.snappy}
                className="font-mono text-[11px] font-medium tracking-[0.1em] text-paper uppercase"
              >
                {mode.text}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      <motion.div
        style={{ x, y }}
        animate={{ opacity: mode.kind === "default" ? 1 : 0, scale: mode.kind === "default" ? 1 : 0 }}
        transition={spring.snappy}
        className="absolute top-0 left-0 -mt-1 -ml-1 size-2 rounded-full bg-accent"
      />
    </div>
  );
}
