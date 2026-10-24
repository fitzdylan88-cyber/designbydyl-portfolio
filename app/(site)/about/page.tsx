import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { capabilities, contact, experience, site, toolkit } from "@/lib/site";
import { SplitReveal } from "@/components/motion/split-reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { Employers } from "@/components/site/employers";
import { Arrow } from "@/components/icons";

export const metadata: Metadata = {
  title: "About",
  description: site.intro,
};

function Inline({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="text-ink underline decoration-rule underline-offset-4 transition-colors duration-[var(--dur-2)] hover:decoration-accent"
    >
      {children}
    </Link>
  );
}

const bio: { label: string; body: ReactNode }[] = [
  {
    label: "Now",
    body: (
      <>
        Senior product designer at Flutter since 2023. I spent my first year and a half on the Paddy Power
        sports team, and I&rsquo;ve been in Customer Safety ever since, working across Paddy Power, Betfair
        and Sky Bet. I design the tools that help people stay in control of their gambling: deposit limits,
        nudges when play patterns change, and a clear view of their own activity. The hard part is making
        them feel useful rather than like a telling-off, so people actually use them.
      </>
    ),
  },
  {
    label: "Before",
    body: (
      <>
        Product designer at AIB from 2021 to 2023, across the public website, the mobile app and the design
        system. The <Inline href="/work/aib-service-finder">Service Finder</Inline> was one of my projects there.
      </>
    ),
  },
  {
    label: "Where I started",
    body: (
      <>
        I trained in industrial design, so I started on physical things: a pair of{" "}
        <Inline href="/work/dev-x">recording binoculars</Inline> and{" "}
        <Inline href="/work/mylo">Mylo</Inline>, a classroom projector that made the James Dyson Award top three
        in Ireland. Then I moved to screens.
      </>
    ),
  },
  {
    label: "On the side",
    body: (
      <>
        Product design is moving closer to the code, and I&rsquo;d rather be early than catch up. So I build my
        own ideas with Claude Code, like a <Inline href="/projects/sweepstake">World Cup sweepstake</Inline> my
        friends and colleagues played all tournament, and a <Inline href="/projects/card-vault">card price
        tracker</Inline> I built for a friend.
      </>
    ),
  },
  {
    label: "Off the clock",
    body: (
      <>
        Liverpool supporter, which is partly why football keeps turning up in my projects. I love all things
        tech, and I&rsquo;m usually reading up on whatever&rsquo;s new.
      </>
    ),
  },
];

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

      <dl className="col-span-12 mt-24 grid grid-cols-subgrid border-b border-rule">
        {bio.map((row) => (
          <div key={row.label} className="col-span-12 grid grid-cols-subgrid gap-y-3 border-t border-rule py-8">
            <dt className="meta col-span-12 pt-1.5 lg:col-span-3">{row.label}</dt>
            <dd className="col-span-12 max-w-[46ch] text-lede leading-snug text-ink-2 lg:col-span-9">{row.body}</dd>
          </div>
        ))}
      </dl>

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
