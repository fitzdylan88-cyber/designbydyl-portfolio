import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { collections, getAllEntries, getEntry, type Collection } from "@/lib/content";
import { Cover } from "@/components/cover";
import { SplitReveal } from "@/components/motion/split-reveal";
import { href } from "@/lib/paths";
import { Arrow } from "@/components/icons";

type Params = { collection: string; slug: string };

const collectionLabels: Record<Collection, string> = { work: "Case study", projects: "Project", play: "Play" };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return getAllEntries().map(({ collection, slug }) => ({ collection, slug }));
}

function resolve({ collection, slug }: Params) {
  if (!collections.includes(collection as Collection)) return undefined;
  return getEntry(collection as Collection, slug);
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const entry = resolve(await params);
  return entry ? { title: entry.title, description: entry.summary } : {};
}

export default async function EntryPage({ params }: { params: Promise<Params> }) {
  const entry = resolve(await params);
  if (!entry) notFound();

  const { default: Body } = await import(`@/content/${entry.collection}/${entry.slug}.mdx`);

  const all = getAllEntries();
  const position = all.findIndex((e) => e.collection === entry.collection && e.slug === entry.slug);
  const next = all.length > 1 ? all[(position + 1) % all.length] : undefined;

  const facts = [
    { label: "Role", value: entry.role },
    { label: "When", value: entry.duration ? `${entry.date} · ${entry.duration}` : entry.date },
    entry.team && { label: "Team", value: entry.team },
    entry.context && { label: "Context", value: entry.context },
    entry.tools.length > 0 && { label: "Tools", value: entry.tools.join(", ") },
    entry.ai.length > 0 && { label: "AI", value: entry.ai.join(", ") },
    entry.anonymised && { label: "Note", value: "Details anonymised" },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <article>
      <header className="container-grid pt-[16vh] pb-12">
        <nav aria-label="Breadcrumb" className="col-span-12 mb-10">
          <ol className="label flex flex-wrap items-center gap-2">
            <li>
              <Link
                href="/work"
                transitionTypes={["nav-back"]}
                className="group -my-2 inline-flex items-center gap-1.5 py-2 hover:text-ink pointer-coarse:-my-3 pointer-coarse:py-3"
              >
                <Arrow direction="left" className="transition-transform duration-[var(--dur-2)] group-hover:-translate-x-0.5" />
                All work
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>{collectionLabels[entry.collection]}</li>
            {entry.draft && <li className="meta rounded-full border border-rule px-2 py-0.5">Draft</li>}
          </ol>
        </nav>
        <SplitReveal
          as="h1"
          immediate
          className="type-display col-span-12 text-h1 leading-[0.95] text-balance lg:col-span-10"
        >
          {entry.title}
        </SplitReveal>
        <p className="col-span-12 mt-8 max-w-[40ch] text-lede leading-snug text-ink-2 md:col-span-8 lg:col-span-6">
          {entry.summary}
        </p>
      </header>

      <div className="container-grid mb-20">
        <div className="col-span-12">
          <ViewTransition name={`cover-${entry.collection}-${entry.slug}`} share="morph">
            <Cover entry={entry} index={position} size="lg" className="aspect-[16/10] w-full rounded-sm md:aspect-[21/9]" />
          </ViewTransition>
        </div>
      </div>

      <div className="container-grid">
        <dl className="col-span-12 grid grid-cols-2 gap-6 border-t border-rule pt-6 md:grid-cols-4 lg:sticky lg:top-24 lg:col-span-3 lg:grid-cols-1 lg:self-start">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt className="label mb-1">{fact.label}</dt>
              <dd className="text-small text-ink">{fact.value}</dd>
            </div>
          ))}
          {entry.liveUrl && (
            <div>
              <dt className="label mb-1">Live</dt>
              <dd className="text-small">
                <a href={entry.liveUrl} className="text-ink underline decoration-accent underline-offset-4">
                  {new URL(entry.liveUrl).hostname.replace(/^www\./, "")}
                </a>
              </dd>
            </div>
          )}
        </dl>

        <div className="col-span-12 mt-12 max-w-[68ch] lg:col-span-7 lg:col-start-5 lg:mt-0">
          <Body />
        </div>
      </div>

      {next && (
        <nav aria-label="Next" className="container-grid mt-40">
          <Link
            href={href(next)}
            transitionTypes={["nav-forward"]}
            data-cursor="Next"
            className="group col-span-12 grid grid-cols-subgrid items-end gap-y-8 border-t border-ink pt-6"
          >
            <div className="col-span-12 md:col-span-7">
              <p className="type-display text-h1 leading-[0.95] text-balance transition-transform duration-[var(--dur-3)] ease-[var(--ease-out)] group-hover:translate-x-3">
                <span className="sr-only">Next project: </span>
                {next.title}
              </p>
              <p aria-hidden className="mt-6 inline-flex items-center gap-2 text-body font-medium text-ink">
                Next project
                <Arrow className="text-accent transition-transform duration-[var(--dur-2)] group-hover:translate-x-1" />
              </p>
            </div>
            <div className="col-span-12 md:col-span-5">
              <ViewTransition name={`cover-${next.collection}-${next.slug}`} share="morph">
                <Cover entry={next} index={(position + 1) % all.length} className="aspect-[4/3] w-full rounded-sm" />
              </ViewTransition>
            </div>
          </Link>
        </nav>
      )}
    </article>
  );
}
