import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { stegaClean } from "next-sanity";
import { collections, getAllEntries, getEntry, isPreview, type Collection } from "@/lib/content";
import { editor } from "@/lib/edit";
import { Cover } from "@/components/cover";
import { SplitReveal } from "@/components/motion/split-reveal";
import { href } from "@/lib/paths";
import { Arrow } from "@/components/icons";
import { ReadingToggle } from "@/components/reading-mode";
import { ScrollHighlight } from "@/components/motion/scroll-highlight";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { Sections } from "@/components/sections";

type Params = { collection: string; slug: string };

const collectionLabels: Record<Collection, string> = { work: "Case study", projects: "Project", play: "Play" };

// New case studies published in Sanity render on first visit, no redeploy needed.
export const dynamicParams = true;

export async function generateStaticParams(): Promise<Params[]> {
  return (await getAllEntries({ build: true })).map(({ collection, slug }) => ({ collection, slug }));
}

async function resolve({ collection, slug }: Params) {
  if (!collections.includes(collection as Collection)) return undefined;
  return getEntry(collection as Collection, slug);
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const entry = await resolve(await params);
  return entry ? { title: stegaClean(entry.title), description: stegaClean(entry.summary) } : {};
}

export default async function EntryPage({ params }: { params: Promise<Params> }) {
  const entry = await resolve(await params);
  if (!entry) notFound();

  const all = await getAllEntries();
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
  ].filter(Boolean) as { label: string; value: string | string[] }[];

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
            {entry.draft && <li className="rounded-sm bg-paper-2 px-2 py-0.5 text-ink-2">Draft</li>}
          </ol>
        </nav>
        <SplitReveal
          as="h1"
          immediate
          edit={entry.edit?.title}
          className="type-display col-span-12 text-h1 leading-[0.95] text-balance lg:col-span-10"
        >
          {stegaClean(entry.title)}
        </SplitReveal>
        <ScrollHighlight
          edit={entry.edit?.summary}
          className="col-span-12 mt-8 max-w-[40ch] text-lede leading-snug text-ink md:col-span-8 lg:col-span-6"
        >
          {stegaClean(entry.summary)}
        </ScrollHighlight>
        <dl className="col-span-12 mt-12 grid grid-cols-2 gap-x-[var(--gutter)] gap-y-6 md:grid-cols-4">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt className="kicker mb-1">{fact.label}</dt>
              <dd className="text-small text-ink">
                {Array.isArray(fact.value) ? (
                  <ul className="space-y-0.5">
                    {fact.value.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  fact.value
                )}
              </dd>
            </div>
          ))}
          {entry.liveUrl && (
            <div>
              <dt className="kicker mb-1">Live</dt>
              <dd className="text-small">
                <a href={entry.liveUrl} className="text-ink underline decoration-accent underline-offset-4">
                  {new URL(entry.liveUrl).hostname.replace(/^www\./, "")}
                </a>
              </dd>
            </div>
          )}
        </dl>
        {entry.hasTldr && (
          <div className="col-span-12 mt-10">
            <ReadingToggle fullMinutes={entry.fullMinutes} tldrSeconds={entry.tldrSeconds} />
          </div>
        )}
      </header>

      <div data-hero className="container-grid mb-24">
        <div className="col-span-12">
          <ViewTransition name={`cover-${entry.collection}-${entry.slug}`} share="morph">
            <Cover entry={entry} index={position} size="lg" expandable edit={entry.edit?.cover} className="aspect-[4/3] w-full md:aspect-[2/1]" />
          </ViewTransition>
        </div>
      </div>

      <div className="container-grid">
        <div
          id="story"
          data-prose
          data-story={entry.hasTldr || undefined}
          className="col-span-12"
        >
          <Sections sections={entry.sections} edit={editor(entry._id, await isPreview())} />
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
                <Cover entry={next} index={(position + 1) % all.length} className="aspect-[4/3] w-full" />
              </ViewTransition>
            </div>
          </Link>
        </nav>
      )}
      <ScrollReveal />
    </article>
  );
}
