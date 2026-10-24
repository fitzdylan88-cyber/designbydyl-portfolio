/**
 * Two or more figures side by side at a smaller size. Used in quick reads,
 * where images support the summary rather than lead it.
 */
export function FigureRow({ children }: { children: React.ReactNode }) {
  return (
    <div data-figure-row className="my-10 grid items-start gap-x-[var(--gutter)] gap-y-6 sm:grid-cols-2">
      {children}
    </div>
  );
}
