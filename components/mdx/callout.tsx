export function Callout({
  label = "Note",
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <aside className="my-12 rounded-sm bg-paper-2 px-6 py-6 md:px-8 md:py-7">
      <p className="mb-3 text-small font-medium text-accent-deep">{label}</p>
      <div className="text-lede leading-snug text-ink [&>p]:m-0">{children}</div>
    </aside>
  );
}
