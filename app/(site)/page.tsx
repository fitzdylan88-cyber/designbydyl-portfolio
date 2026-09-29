import Link from "next/link";
import { ViewTransition } from "react";
import { Employers } from "@/components/site/employers";
import { getAllEntries, type Entry } from "@/lib/content";
import { principles, site } from "@/lib/site";
import { Cover } from "@/components/cover";
import { DotField } from "@/components/motion/dot-field";
import { SplitReveal } from "@/components/motion/split-reveal";
import { href } from "@/lib/paths";
import { Arrow } from "@/components/icons";

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
        <span className="meta shrink-0">{entry.date.slice(0, 4)}</span>
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

  return (
    <>
      <section className="relative flex min-h-svh flex-col justify-end overflow-hidden pb-12 md:pb-16">
        <DotField />
        <div className="container-grid relative w-full">
          <SplitReveal
            as="h1"
            by="chars"
            immediate
            className="type-display col-span-12 text-mega leading-[0.85]"
          >
            Dylan Fitzpatrick
          </SplitReveal>
          <div className="col-span-12 mt-10 grid grid-cols-subgrid items-end gap-y-6 border-t border-rule pt-6">
            <ul className="col-span-12 flex flex-wrap gap-x-6 gap-y-1 text-small text-ink-2 md:col-span-5 lg:col-span-4">
              <li>{site.role}</li>
              <li>{site.location}</li>
              <li>{site.experience}</li>
            </ul>
            <p className="col-span-12 max-w-[34ch] text-lede leading-snug text-ink md:col-span-7 lg:col-span-5 lg:col-start-8">
              {site.intro}
            </p>
          </div>
        </div>
      </section>

      <section id="work" className="container-grid scroll-mt-24 pt-24 md:pt-32">
        <div className="col-span-12 mb-12 flex items-end justify-between border-b border-rule pb-6">
          <SplitReveal as="h2" by="words" className="type-display text-h2 leading-none">
            Selected work
          </SplitReveal>
          <Link href="/work" className="group label inline-flex items-center gap-1.5 hover:text-ink">
            All work <span className="meta">{entries.length}</span>
            <Arrow className="transition-transform duration-[var(--dur-2)] group-hover:translate-x-0.5" />
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
        <Link
          href="/work"
          className="group col-span-12 mt-16 inline-flex w-fit items-center gap-2 text-body font-medium text-ink"
        >
          See all {entries.length} projects
          <Arrow className="text-accent transition-transform duration-[var(--dur-2)] group-hover:translate-x-1" />
        </Link>
      </section>

      <section className="container-grid pt-32">
        <h2 className="type-display col-span-12 mb-10 border-b border-rule pb-6 text-h2 leading-none">
          Where I&rsquo;ve worked
        </h2>
        <Employers className="col-span-12" />
      </section>

      <section className="container-grid pt-32 md:pt-44">
        <SplitReveal as="h2" by="words" className="type-display col-span-12 mb-16 max-w-[16ch] text-h1 leading-[0.95] lg:col-span-8">
          How I work
        </SplitReveal>
        <ul className="col-span-12 grid gap-12 md:grid-cols-3 md:gap-[var(--gutter)]">
          {principles.map((p) => (
            <li key={p.title} className="border-t border-ink pt-5">
              <h3 className="text-h3 font-medium leading-tight tracking-tight">{p.title}</h3>
              <p className="mt-4 max-w-[38ch] text-ink-2">{p.body}</p>
            </li>
          ))}
        </ul>
        <Link
          href="/about"
          className="group col-span-12 mt-14 inline-flex w-fit items-center gap-2 text-body font-medium text-ink"
        >
          More about me
          <Arrow className="text-accent transition-transform duration-[var(--dur-2)] group-hover:translate-x-1" />
        </Link>
      </section>
    </>
  );
}
