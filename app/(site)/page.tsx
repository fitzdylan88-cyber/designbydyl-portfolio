import Link from "next/link";
import { Employers } from "@/components/site/employers";
import { getAllEntries } from "@/lib/content";
import { principles, site } from "@/lib/site";
import { DotField } from "@/components/motion/dot-field";
import { SplitReveal } from "@/components/motion/split-reveal";
import { Arrow } from "@/components/icons";
import { ProjectRail } from "@/components/project-rail";
import { DeviceCard } from "@/components/device-card";
import { ScrollHighlight } from "@/components/motion/scroll-highlight";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

export default function Home() {
  const entries = getAllEntries();
  const featured = [
    ...entries.filter((e) => e.featured),
    ...entries.filter((e) => !e.featured),
  ];

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
          <div className="col-span-12 mt-10 grid grid-cols-subgrid items-end gap-y-6">
            <dl className="col-span-12 grid grid-cols-3 gap-x-[var(--gutter)] md:col-span-5 lg:col-span-5">
              {[
                { label: "Role", value: site.role },
                { label: "Based in", value: site.location },
                { label: "Experience", value: site.experience },
              ].map((fact) => (
                <div key={fact.label}>
                  <dt className="kicker mb-1">{fact.label}</dt>
                  <dd className="text-body leading-snug text-ink">{fact.value}</dd>
                </div>
              ))}
            </dl>
            <ScrollHighlight className="col-span-12 max-w-[34ch] text-lede leading-snug text-ink md:col-span-7 lg:col-span-5 lg:col-start-8">
              {site.intro}
            </ScrollHighlight>
          </div>
        </div>
      </section>

      <section id="work" className="scroll-mt-24 pt-24 md:pt-32">
        <div className="container-grid">
          <div className="col-span-12 mb-12 flex items-end justify-between">
            <SplitReveal as="h2" by="words" className="type-display text-h2 leading-none">
              Selected work
            </SplitReveal>
            <Link href="/work" className="group label inline-flex items-center gap-1.5 hover:text-ink">
              All work
              <Arrow className="transition-transform duration-[var(--dur-2)] group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        <ProjectRail label="Selected work">
          {featured.map((entry, i) => (
            <DeviceCard key={`${entry.collection}/${entry.slug}`} entry={entry} index={i} />
          ))}
        </ProjectRail>

        <div className="container-grid">
          <Link
            href="/work"
            className="group col-span-12 -mt-11 inline-flex h-11 w-fit items-center gap-2 text-body font-medium text-ink"
          >
            See all {entries.length} projects
            <Arrow className="text-accent transition-transform duration-[var(--dur-2)] group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <section className="container-grid pt-32">
        <h2 className="type-display col-span-12 mb-10 text-h2 leading-none">
          Where I&rsquo;ve worked
        </h2>
        <div data-reveal className="col-span-12">
          <Employers />
        </div>
      </section>

      <section className="container-grid pt-32 md:pt-44">
        <SplitReveal as="h2" by="words" className="type-display col-span-12 mb-16 max-w-[16ch] text-h1 leading-[0.95] lg:col-span-8">
          How I work
        </SplitReveal>
        <ul data-reveal className="col-span-12 grid gap-12 md:grid-cols-3 md:gap-[var(--gutter)]">
          {principles.map((p) => (
            <li key={p.title} className="border-t border-ink pt-5">
              <h3 className="text-h3 font-semibold leading-tight tracking-tight">{p.title}</h3>
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
      <ScrollReveal />
    </>
  );
}
