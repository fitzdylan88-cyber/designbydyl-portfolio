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
