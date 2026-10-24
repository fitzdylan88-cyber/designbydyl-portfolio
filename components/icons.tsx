/**
 * Drawn arrow, 1.5 stroke, sized to the surrounding text. Used instead of
 * text glyphs so every arrow shares one weight and alignment.
 */
export function Arrow({
  direction = "right",
  className = "",
}: {
  direction?: "right" | "left" | "down" | "up-right";
  className?: string;
}) {
  const rotate = { right: 0, down: 90, left: 180, "up-right": -45 }[direction];
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden
      className={`inline-block size-[1em] shrink-0 ${className}`}
      style={{ rotate: `${rotate}deg` }}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
    </svg>
  );
}

/** Two outward corners: open something larger. */
export function Expand({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden
      className={`inline-block size-[1em] shrink-0 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.5 2.5h4v4M13.5 2.5 9 7M6.5 13.5h-4v-4M2.5 13.5 7 9" />
    </svg>
  );
}

export function Close({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden
      className={`inline-block size-[1em] shrink-0 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
    </svg>
  );
}
