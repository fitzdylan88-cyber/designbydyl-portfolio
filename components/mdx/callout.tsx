export function Callout({
  label = "Note",
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <aside className="my-10 border-l-2 border-accent pl-5">
      <p className="eyebrow mb-2">{label}</p>
      <div className="text-lede leading-snug text-ink [&>p]:m-0">{children}</div>
    </aside>
  );
}
