"use client";

import { Children, useEffect, useRef, useState } from "react";
import { Arrow } from "@/components/icons";

/**
 * Horizontal swimlane: three cards per view on desktop, two on tablet, one
 * and a peek on phones. Native scroll with snap, so trackpads and touch work
 * as-is; the arrows step one card at a time. The track bleeds to the right
 * edge of the viewport while its first card lines up with the page grid.
 */
export function ProjectRail({ children, label }: { children: React.ReactNode; label: string }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    function update() {
      if (!track) return;
      const max = track.scrollWidth - track.clientWidth;
      setEdges({ start: track.scrollLeft <= 2, end: track.scrollLeft >= max - 2 });
    }
    update();
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      track.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  function step(direction: 1 | -1) {
    const track = trackRef.current;
    const card = track?.firstElementChild as HTMLElement | null;
    if (!track || !card) return;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: "smooth" });
  }

  const button =
    "grid size-11 place-items-center rounded-full border border-rule text-ink transition-[color,border-color,opacity] duration-[var(--dur-2)] hover:border-ink disabled:pointer-events-none disabled:opacity-30";

  return (
    <div className="relative">
      <ul
        ref={trackRef}
        aria-label={label}
        className="rail-inset flex snap-x snap-mandatory gap-[var(--gutter)] overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {Children.map(children, (child) => (
          <li className="rail-card shrink-0 snap-start">{child}</li>
        ))}
      </ul>

      <div className="rail-inset mt-8 flex justify-end gap-2">
        <button type="button" aria-label="Previous projects" disabled={edges.start} onClick={() => step(-1)} className={button}>
          <Arrow direction="left" />
        </button>
        <button type="button" aria-label="Next projects" disabled={edges.end} onClick={() => step(1)} className={button}>
          <Arrow />
        </button>
      </div>
    </div>
  );
}
