"use client";

import { useEffect, useRef } from "react";

const FADE = 0.25; // faded letters keep a quarter of their colour
const SOFT = 10; // about ten letters are mid-fade at once

/**
 * A lead paragraph that darkens letter by letter as it scrolls up: from when
 * it enters at the bottom until its centre reaches 40% of the screen. Screen
 * readers get the plain text; the letter spans are presentational. Takes a
 * plain string so the split stays simple.
 */
export function ScrollHighlight({ children, className }: { children: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const chars = [...el.querySelectorAll<HTMLElement>("[data-char]")];

    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const r = el.getBoundingClientRect();
      const start = vh;
      const end = vh * 0.4 - r.height / 2;
      const p = Math.min(Math.max((start - r.top) / (start - end), 0), 1);
      const lit = p * (chars.length + SOFT);
      chars.forEach((c, i) => {
        c.style.opacity = (FADE + (1 - FADE) * Math.min(Math.max((lit - i) / SOFT, 0), 1)).toFixed(3);
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      chars.forEach((c) => (c.style.opacity = ""));
    };
  }, []);

  const words = children.split(/(\s+)/);

  return (
    <p ref={ref} className={className}>
      <span className="sr-only">{children}</span>
      <span aria-hidden>
        {words.map((word, w) =>
          /^\s+$/.test(word) ? (
            word
          ) : (
            <span key={w} className="inline-block whitespace-nowrap">
              {[...word].map((ch, c) => (
                <span key={c} data-char>
                  {ch}
                </span>
              ))}
            </span>
          ),
        )}
      </span>
    </p>
  );
}
