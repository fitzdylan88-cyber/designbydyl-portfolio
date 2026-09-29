"use client";

import { useId, useState } from "react";
import Image from "next/image";

/** Drag (or use arrow keys on the range input) to compare two states. */
export function BeforeAfter({
  before,
  after,
  alt,
  labels = ["Before", "After"],
  width = 2400,
  height = 1500,
}: {
  before: string;
  after: string;
  alt: string;
  labels?: [string, string];
  width?: number;
  height?: number;
}) {
  const [split, setSplit] = useState(50);
  const id = useId();

  return (
    <figure className="my-12">
      <div className="relative overflow-hidden rounded-sm bg-paper-2 select-none">
        <Image src={after} alt={`${alt} — ${labels[1]}`} width={width} height={height} className="h-auto w-full" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}>
          <Image src={before} alt={`${alt} — ${labels[0]}`} width={width} height={height} className="h-auto w-full" />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 w-px bg-accent"
          style={{ left: `${split}%` }}
        />
        <label htmlFor={id} className="sr-only">
          Comparison position
        </label>
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          value={split}
          onChange={(event) => setSplit(Number(event.target.value))}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
      <figcaption className="label mt-3 flex justify-between">
        <span>{labels[0]}</span>
        <span>{labels[1]}</span>
      </figcaption>
    </figure>
  );
}
