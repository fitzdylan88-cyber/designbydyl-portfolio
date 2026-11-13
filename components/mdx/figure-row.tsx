/**
 * Two or more figures side by side at a smaller size. Used in quick reads,
 * where images support the summary rather than lead it. Pairs sit almost
 * flush, with just enough of a gap to keep their captions apart. `phone` is for
 * tall phone screenshots: four to a row (two on small screens), with no
 * backing box so transparent device frames sit on the page.
 */
export function FigureRow({ children, phone, edit }: { children: React.ReactNode; phone?: boolean; edit?: string }) {
  return (
    <div
      data-figure-row
      data-sanity={edit}
      className={
        phone
          ? "my-10 grid grid-cols-2 items-start gap-x-[var(--gutter)] gap-y-6 sm:grid-cols-4 [&_button]:rounded-none! [&_button]:bg-transparent!"
          : "my-10 grid items-start gap-x-2 gap-y-6 sm:grid-cols-2"
      }
    >
      {children}
    </div>
  );
}
