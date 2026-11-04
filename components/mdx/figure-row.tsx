/**
 * Two or more figures side by side at a smaller size. Used in quick reads,
 * where images support the summary rather than lead it. `phone` is for
 * tall phone screenshots: four to a row (two on small screens), with no
 * backing box so transparent device frames sit on the page.
 */
export function FigureRow({ children, phone }: { children: React.ReactNode; phone?: boolean }) {
  return (
    <div
      data-figure-row
      className={
        phone
          ? "my-10 grid grid-cols-2 items-start gap-x-[var(--gutter)] gap-y-6 sm:grid-cols-4 [&_button]:rounded-none! [&_button]:bg-transparent!"
          : "my-10 grid items-start gap-x-[var(--gutter)] gap-y-6 sm:grid-cols-2"
      }
    >
      {children}
    </div>
  );
}
