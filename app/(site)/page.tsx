import Link from "next/link";
import { ViewTransition } from "react";
import { getAllEntries, type Entry } from "@/lib/content";
import { principles, site } from "@/lib/site";
import { Cover } from "@/components/cover";
import { DotField } from "@/components/motion/dot-field";
import { SplitReveal } from "@/components/motion/split-reveal";
import { WorkList } from "@/components/work-list";
import { href } from "@/lib/paths";

function pick(entry: Entry) {
  const { slug, collection, title, summary, date, role, tools, cover, accent, draft } = entry;
  return { slug, collection, title, summary, date, role, tools, cover, accent, draft };
}

function FeaturedCard({ entry, index, large }: { entry: Entry; index: number; large?: boolean }) {
  return (
    <Link href={href(entry)} transitionTypes={["nav-forward"]} data-cursor="View" className="group block">
      <ViewTransition name={`cover-${entry.collection}-${entry.slug}`} share="morph">
        <Cover
          entry={entry}
          index={index}
          size={large ? "lg" : "md"}
          className={`w-full rounded-sm ${large ? "aspect-[4/3] lg:aspect-[5/4]" : "aspect-[4/3]"}`}
        />
      </ViewTransition>
      <div className="mt-4 flex items-baseline justify-between gap-6">
        <h3 className="type-display text-h3 leading-tight">{entry.title}</h3>
        <span className="eyebrow shrink-0">{entry.date.slice(0, 4)}</span>
      </div>
      <p className="mt-2 max-w-[52ch] text-small text-ink-2">{entry.summary}</p>
    </Link>
  );
}

export default function Home() {
  const entries = getAllEntries();
  const featured = [
    ...entries.filter((e) => e.featured),
    ...entries.filter((e) => !e.featured),
  ].slice(0, 3);
  const rest = entries
    .filter((e) => !featured.includes(e))
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <section className="relative flex min-h-svh flex-col justify-end overflow-hidden pb-12 md:pb-16">
        <DotField />
        <div className="container-grid relative w-full">
          <p className="eyebrow col-span-12 mb-6 flex flex-wrap gap-x-4">
            <span>{site.role}</span>
            <span>{site.location}</span>
            <span>{site.experience}</span>
          </p>
          <SplitReveal
            as="h1"
            by="chars"
            immediate
            className="type-display col-span-12 text-mega leading-[0.85]"
          >
            Dylan Fitzpatrick
          </SplitReveal>
          <div className="col-span-12 mt-10 grid grid-cols-subgrid items-end gap-y-8">
            <p className="col-span-12 max-w-[34ch] text-lede leading-snug text-ink-2 md:col-span-7 lg:col-span-5 lg:col-start-8">
              {site.intro}
            </p>
            <a
              href="#work"
              className="eyebrow col-span-12 row-start-1 flex items-center gap-2 md:col-span-5 md:row-start-auto lg:col-span-4 lg:col-start-1 lg:row-start-1"
            >
              <span aria-hidden className="inline-block animate-bounce">↓</span> Selected work
            </a>
          </div>
        </div>
      </section>

      <section id="work" className="container-grid scroll-mt-24 pt-24 md:pt-32">
        <div className="col-span-12 mb-12 flex items-end justify-between border-b border-rule pb-6">
          <SplitReveal as="h2" by="words" className="type-display text-h2 leading-none">
            Selected work
          </SplitReveal>
          <Link href="/work" className="eyebrow hover:text-ink">
            All work ({entries.length}) →
          </Link>
        </div>

        {featured[0] && (
          <div className="col-span-12 lg:col-span-7">
            <FeaturedCard entry={featured[0]} index={0} large />
          </div>
        )}
        <div className="col-span-12 mt-16 grid gap-16 lg:col-span-5 lg:mt-0">
          {featured.slice(1).map((entry, i) => (
            <FeaturedCard key={entry.slug} entry={entry} index={i + 1} />
          ))}
        </div>
      </section>

      {rest.length > 0 && (
        <section className="container-grid pt-32">
          <h2 className="eyebrow col-span-12 mb-6">More projects and experiments</h2>
          <div className="col-span-12">
            <WorkList entries={rest.map(pick)} startIndex={featured.length} />
          </div>
        </section>
      )}

      <section className="container-grid pt-32 md:pt-44">
        <SplitReveal as="h2" by="words" className="type-display col-span-12 mb-16 max-w-[16ch] text-h1 leading-[0.95] lg:col-span-8">
          How I work
        </SplitReveal>
        <ol className="col-span-12 grid gap-12 md:grid-cols-3 md:gap-[var(--gutter)]">
          {principles.map((p, i) => (
            <li key={p.title} className="border-t border-ink pt-5">
              <span className="eyebrow">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-6 text-h3 font-medium leading-tight tracking-tight">{p.title}</h3>
              <p className="mt-4 max-w-[38ch] text-ink-2">{p.body}</p>
            </li>
          ))}
        </ol>
        <Link href="/about" className="eyebrow col-span-12 mt-14 hover:text-ink">
          More about me →
        </Link>
      </section>
    </>
  );
}
