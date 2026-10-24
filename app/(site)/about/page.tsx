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
        I design products, and these days I build a lot of them too.
      </SplitReveal>

      <div className="col-span-12 mt-20 space-y-6 text-lede leading-snug text-ink-2 md:col-span-8 lg:col-span-6 lg:col-start-7">
        <p>
          I&rsquo;m a product designer in Dublin. I trained in industrial design, so I started out on physical
          things, like a pair of binoculars and a classroom projector, before moving to screens. Since 2021
          I&rsquo;ve been at AIB, working across the public website, the mobile app and the design system.
        </p>
        <p>
          I can see product design moving closer to the code, and I&rsquo;d rather be early than catch up. So
          outside work I started building my own ideas with Claude Code. Some of them stuck: a World Cup
          sweepstake my friends and colleagues used for the whole tournament, and a card price tracker I
          built for a friend. You&rsquo;ll find them here next to the case studies, with a few older experiments.
        </p>
        <p>
          Outside design, I&rsquo;m a Liverpool supporter, which is partly why football keeps turning up in my
          projects. I love all things tech, and I&rsquo;m usually reading up on whatever&rsquo;s new.
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
