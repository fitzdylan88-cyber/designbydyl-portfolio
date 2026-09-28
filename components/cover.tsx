import Image from "next/image";
import type { Entry } from "@/lib/content";

/*
 * Generative Swiss-poster cover. Each entry gets a stable composition from
 * its slug: a surface, a single geometric form and a construction grid. Used
 * until a real `cover` image exists, then it steps aside. Parent sets the
 * aspect ratio; hovering a `group` parent sets the form in motion.
 */

function hash(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const surfaces = [
  { bg: "var(--paper-2)", form: "var(--accent)", line: "var(--ink)", text: "var(--ink)" },
  { bg: "var(--ink)", form: "var(--accent)", line: "var(--paper)", text: "var(--paper)" },
  { bg: "var(--accent)", form: "var(--ink)", line: "var(--ink)", text: "var(--ink)" },
] as const;

type FormProps = { fill: string; seed: number };

// Each form animates on group-hover. Transforms use transform-box so they
// pivot around their own geometry.
const forms: ((p: FormProps) => React.ReactNode)[] = [
  // Disc, drifting.
  ({ fill, seed }) => (
    <circle
      cx={150 + (seed % 120)}
      cy={130 + (seed % 60)}
      r="96"
      fill={fill}
      className="origin-center transition-transform duration-[var(--dur-4)] ease-[var(--ease-out)] [transform-box:fill-box] group-hover:translate-x-6 group-hover:scale-110"
    />
  ),
  // Quarter circle anchored to a corner, rotating out.
  ({ fill }) => (
    <path
      d="M400 300 L400 90 A210 210 0 0 0 190 300 Z"
      fill={fill}
      className="origin-bottom-right transition-transform duration-[var(--dur-4)] ease-[var(--ease-out)] [transform-box:fill-box] group-hover:-rotate-12 group-hover:scale-105"
    />
  ),
  // Stacked bars, staggered on hover.
  ({ fill, seed }) => (
    <g>
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={40 + ((seed >>> i) % 40)}
          y={70 + i * 42}
          width={180 + ((seed >>> (i + 2)) % 140)}
          height="26"
          fill={fill}
          style={{ transitionDelay: `${i * 45}ms` }}
          className="origin-left transition-transform duration-[var(--dur-3)] ease-[var(--ease-out)] [transform-box:fill-box] group-hover:scale-x-125"
        />
      ))}
    </g>
  ),
  // Half disc on a baseline, rising.
  ({ fill, seed }) => (
    <path
      d={`M${60 + (seed % 80)} 230 A120 120 0 0 1 ${300 + (seed % 80)} 230 Z`}
      fill={fill}
      className="transition-transform duration-[var(--dur-4)] ease-[var(--ease-out)] group-hover:-translate-y-8"
    />
  ),
];

export function Cover({
  entry,
  index,
  size = "md",
  className = "",
}: {
  entry: Pick<Entry, "slug" | "title" | "collection" | "cover" | "accent">;
  index?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  if (entry.cover) {
    return (
      <div className={`relative overflow-hidden bg-paper-2 ${className}`}>
        <Image
          src={entry.cover}
          alt=""
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover transition-transform duration-[var(--dur-4)] ease-[var(--ease-out)] group-hover:scale-[1.03]"
        />
      </div>
    );
  }

  const seed = hash(entry.slug);
  const surface = surfaces[seed % surfaces.length];
  const Form = forms[(seed >>> 3) % forms.length];
  const fill = entry.accent ?? surface.form;
  const label = entry.title.split(":")[0];
  const pad = size === "sm" ? "p-3" : size === "lg" ? "p-6 md:p-8" : "p-4 md:p-5";

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: surface.bg, color: surface.text }}
      aria-hidden
    >
      <svg
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        <g stroke={surface.line} strokeOpacity="0.14" strokeWidth="0.75" vectorEffect="non-scaling-stroke">
          {Array.from({ length: 11 }, (_, i) => (
            <line key={`v${i}`} x1={(i + 1) * (400 / 12)} y1="0" x2={(i + 1) * (400 / 12)} y2="300" />
          ))}
          {Array.from({ length: 7 }, (_, i) => (
            <line key={`h${i}`} x1="0" y1={(i + 1) * (300 / 8)} x2="400" y2={(i + 1) * (300 / 8)} />
          ))}
        </g>
        <Form fill={fill} seed={seed} />
      </svg>

      <div className={`absolute inset-0 flex flex-col justify-between ${pad}`}>
        <div className="flex justify-between font-mono text-micro tracking-[0.08em] uppercase">
          <span>{index !== undefined ? String(index + 1).padStart(2, "0") : "—"}</span>
          <span>{entry.collection}</span>
        </div>
        {size !== "sm" && (
          <p
            className={`type-display max-w-[14ch] leading-[0.95] ${
              size === "lg" ? "text-h2" : "text-h3"
            }`}
          >
            {label}
          </p>
        )}
      </div>
    </div>
  );
}
