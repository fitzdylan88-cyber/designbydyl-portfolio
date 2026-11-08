export function Callout({
  label,
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <aside className="my-12 rounded-md bg-paper-2 px-6 py-6 md:px-8 md:py-7">
      {label && <p className="kicker mb-3">{label}</p>}
      <div className="text-lede leading-snug text-ink [&>p]:m-0">{children}</div>
    </aside>
  );
}
