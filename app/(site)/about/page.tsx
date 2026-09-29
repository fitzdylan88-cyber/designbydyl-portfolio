import type { Metadata } from "next";
import { capabilities, contact, experience, site, toolkit } from "@/lib/site";
import { SplitReveal } from "@/components/motion/split-reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { Employers } from "@/components/site/employers";
import { Arrow } from "@/components/icons";

export const metadata: Metadata = {
  title: "About",
  description: site.intro,
};

export default function AboutPage() {
  return (
    <div className="container-grid pt-[20vh]">
      <SplitReveal
        as="h1"
        by="lines"
        immediate
        className="type-display col-span-12 text-h1 leading-[0.95] text-balance lg:col-span-10"
      >
        I design products and increasingly build them too, with AI as a working material.
      </SplitReveal>

      {/* TODO(Dylan): make this bio yours. */}
      <div className="col-span-12 mt-20 space-y-6 text-lede leading-snug text-ink-2 md:col-span-8 lg:col-span-6 lg:col-start-7">
        <p>
          I&rsquo;m a product designer based in Dublin with {site.experience} of experience. I work across the
          whole arc of a product, from framing the problem to the pixel that ships.
        </p>
        <p>
          Lately that arc has stretched. With Claude as a collaborator, I prototype in real code, build
          internal tools and ship side projects that real people use. This site collects that work: case
          studies, the things I&rsquo;ve built, and the experiments in between.
        </p>
      </div>

      <section className="col-span-12 mt-32 grid grid-cols-subgrid gap-y-12">
        <h2 className="col-span-12 text-h3 font-medium leading-tight tracking-tight lg:col-span-3">Capabilities</h2>
        <ul className="col-span-12 grid grid-cols-1 border-t border-rule sm:grid-cols-2 lg:col-span-9">
          {capabilities.map((item) => (
            <li key={item} className="border-b border-rule py-4">
              <span className="text-h3 font-medium tracking-tight">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="col-span-12 mt-32 grid grid-cols-subgrid gap-y-12">
        <h2 className="col-span-12 text-h3 font-medium leading-tight tracking-tight lg:col-span-3">Where I&rsquo;ve worked</h2>
        <Employers className="col-span-12 lg:col-span-9" />
      </section>

      {experience.length > 0 && (
        <section className="col-span-12 mt-32 grid grid-cols-subgrid gap-y-12">
          <h2 className="col-span-12 text-h3 font-medium leading-tight tracking-tight lg:col-span-3">Experience</h2>
          <ol className="col-span-12 border-t border-rule lg:col-span-9">
            {experience.map((job) => (
              <li key={`${job.company}-${job.period}`} className="grid grid-cols-[8rem_1fr] gap-4 border-b border-rule py-5">
                <span className="meta pt-1.5">{job.period}</span>
                <span>
                  <span className="block text-h3 font-medium tracking-tight">{job.role}</span>
                  <span className="text-ink-2">{job.company}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className="col-span-12 mt-32 grid grid-cols-subgrid gap-y-12">
        <h2 className="col-span-12 text-h3 font-medium leading-tight tracking-tight lg:col-span-3">Toolkit</h2>
        <ul className="col-span-12 flex flex-wrap gap-2 lg:col-span-9">
          {toolkit.map((tool) => (
            <li key={tool} className="rounded-full border border-rule px-4 py-2 text-small">
              {tool}
            </li>
          ))}
        </ul>
      </section>

      {contact && (
      <div className="col-span-12 mt-32">
        <Magnetic>
          <a
            href={contact.href}
            className="inline-flex items-center gap-3 rounded-full bg-ink px-7 py-4 text-body font-medium text-paper"
          >
            Say hello <Arrow />
          </a>
        </Magnetic>
      </div>
      )}
    </div>
  );
}
