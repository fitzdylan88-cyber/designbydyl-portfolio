import { Magnetic } from "@/components/motion/magnetic";
import { SplitReveal } from "@/components/motion/split-reveal";
import { contact, site } from "@/lib/site";
import { Clock } from "./clock";
import { Arrow } from "@/components/icons";

export function Footer() {
  return (
    <footer className="mt-32 bg-ink text-paper">
      <div className="container-grid pt-24 pb-10 md:pt-32">
        {site.availability && (
          <p className="col-span-12 mb-8 text-small text-paper/70">
            {site.availability}
          </p>
        )}
        <SplitReveal
          as="h2"
          by="words"
          className="type-display col-span-12 text-mega leading-[0.9] text-balance"
        >
          Let&rsquo;s make something good.
        </SplitReveal>

        <div className="col-span-12 mt-14 flex flex-wrap items-center gap-6 md:mt-20">
          {contact && (
            <Magnetic>
              <a
                href={contact.href}
                className="inline-flex items-center gap-3 rounded-full bg-accent px-7 py-4 text-body font-medium text-accent-ink transition-transform duration-[var(--dur-2)] active:scale-95"
              >
                {contact.label}
                <Arrow />
              </a>
            </Magnetic>
          )}
          {site.links.length > 0 && (
            <ul className="flex gap-6 text-small">
              {site.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-paper/70 underline decoration-paper/20 underline-offset-4 transition-colors duration-[var(--dur-2)] hover:text-paper hover:decoration-accent"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="col-span-12 mt-24 flex flex-wrap justify-between gap-4 border-t border-paper/15 pt-6 text-small text-paper/60">
          <span>
            © {new Date().getFullYear()} {site.name}
          </span>
          <Clock timeZone={site.timeZone} label={site.location} />
          <span>Designed and built with Claude</span>
        </div>
      </div>
    </footer>
  );
}
