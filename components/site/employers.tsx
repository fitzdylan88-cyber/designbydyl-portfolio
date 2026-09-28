import { employers } from "@/lib/site";

/*
 * Where I've worked. Every logo is drawn as a CSS mask over the current text
 * colour, so brand colours drop away and the strip follows the theme in
 * light and dark. Hovering one lifts it from ink-3 to ink.
 */

const HEIGHT = 44; // px, optical baseline for every mark

function DesignPlus() {
  // Design+ has no public vector logo, so this redraws the wordmark: thin caps plus a solid disc with a plus.
  return (
    <span className="flex items-center gap-1.5" style={{ height: HEIGHT * 0.6 }}>
      <span className="text-[1.65rem] leading-none font-light tracking-[0.02em]">DESIGN</span>
      <svg viewBox="0 0 24 24" className="h-[1.4rem] w-[1.4rem] -translate-y-1.5" aria-hidden>
        <circle cx="12" cy="12" r="12" fill="currentColor" />
        <path d="M12 6.5v11M6.5 12h11" stroke="var(--paper)" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export function Employers({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap items-center gap-x-14 gap-y-10 ${className}`}>
      {employers.map((e) => (
        <li
          key={e.name}
          className="text-ink-3 transition-colors duration-[var(--dur-2)] hover:text-ink"
          title={`${e.name}, ${e.period}`}
        >
          {e.logo ? (
            <span
              role="img"
              aria-label={e.name}
              className="block bg-current"
              style={{
                height: HEIGHT * e.scale,
                width: HEIGHT * e.scale * e.ratio,
                maskImage: `url(${e.logo})`,
                maskSize: "contain",
                maskRepeat: "no-repeat",
                maskPosition: "center",
              }}
            />
          ) : (
            <span role="img" aria-label={e.name}>
              <DesignPlus />
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
