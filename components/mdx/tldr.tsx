import { ReadFullStory } from "@/components/reading-mode";

/**
 * The hand-written quick read. Lives at the top of a case study's MDX and is
 * only shown when the reader picks "Quick read" (see globals.css).
 */
export function Tldr({ children }: { children: React.ReactNode }) {
  return (
    <section data-tldr aria-label="Quick read" className="[&>*:first-child]:mt-0">
      {children}
      <ReadFullStory />
    </section>
  );
}
