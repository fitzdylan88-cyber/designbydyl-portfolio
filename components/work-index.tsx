"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { spring } from "@/lib/motion";
import { WorkList, type ListEntry } from "@/components/work-list";

const filters = [
  { id: "all", label: "Everything", path: "/work" },
  { id: "work", label: "Case studies", path: "/work" },
  { id: "projects", label: "Projects", path: "/projects" },
  { id: "play", label: "Play", path: "/play" },
] as const;

type FilterId = (typeof filters)[number]["id"];

export function WorkIndex({ entries, initial }: { entries: ListEntry[]; initial: FilterId }) {
  const [filter, setFilter] = useState<FilterId>(initial);
  const shown = filter === "all" ? entries : entries.filter((e) => e.collection === filter);

  function choose(id: FilterId) {
    setFilter(id);
    // Keep the URL shareable without a navigation (and without a page transition).
    const path = filters.find((f) => f.id === id)?.path ?? "/work";
    window.history.replaceState(null, "", path);
  }

  return (
    <>
      <div role="radiogroup" aria-label="Filter" className="col-span-12 mb-10 flex flex-wrap gap-1">
        {filters.map((f) => {
          const count = f.id === "all" ? entries.length : entries.filter((e) => e.collection === f.id).length;
          if (count === 0 && f.id !== "all") return null;
          const selected = filter === f.id;
          return (
            <button
              key={f.id}
              role="radio"
              aria-checked={selected}
              onClick={() => choose(f.id)}
              className="relative rounded-full px-4 py-2 text-small pointer-coarse:py-3 text-ink-2 transition-colors duration-[var(--dur-2)] hover:text-ink aria-checked:text-paper"
            >
              {selected && (
                <motion.span layoutId="filter-pill" transition={spring.snappy} className="absolute inset-0 rounded-full bg-ink" />
              )}
              <span className="relative">
                {f.label}
                <sup className="ml-1 font-mono text-[0.65em] opacity-60">{count}</sup>
              </span>
            </button>
          );
        })}
      </div>
      <div className="col-span-12">
        {shown.length > 0 ? (
          <WorkList entries={shown} />
        ) : (
          <p className="border-t border-rule py-10 text-ink-3">Nothing here yet.</p>
        )}
      </div>
    </>
  );
}
