export function Metrics({ items }: { items: { value: string; label: string }[] }) {
  return (
    <dl className="my-14 grid grid-cols-2 gap-x-[var(--gutter)] gap-y-8 border-t border-rule pt-8 md:grid-cols-3">
      {items.map((item) => (
        <div key={item.label}>
          <dt className="sr-only">{item.label}</dt>
          <dd className="type-display text-h2 leading-none">{item.value}</dd>
          <dd className="mt-2 text-small text-ink-2">{item.label}</dd>
        </div>
      ))}
    </dl>
  );
}
