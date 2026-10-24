/**
 * Site-wide copy and links. Edit here, not in components.
 * TODO(Dylan): add a contact email and LinkedIn URL. Contact buttons only
 * render once one of them is set.
 */
export const site = {
  name: "Dylan Fitzpatrick",
  shortName: "Dyl",
  role: "Senior product designer",
  location: "Dublin, Ireland",
  timeZone: "Europe/Dublin",
  experience: "8+ years",
  intro:
    "Senior product designer at Flutter, working on safer gambling tools for Paddy Power, Betfair and Sky Bet. In my own time I build things too, with Claude Code doing a lot of the typing.",
  /** Shown above the footer headline. Keep null unless you want to say publicly that you're looking. */
  availability: null as string | null,
  email: null as string | null,
  linkedin: null as string | null,
  /** Footer links out. Empty for now: no link to Design Growth or tips yet. */
  links: [] as { label: string; href: string }[],
} as const;

/** Primary contact route: email if set, otherwise LinkedIn, otherwise none. */
export const contact = site.email
  ? { label: site.email, href: `mailto:${site.email}` }
  : site.linkedin
    ? { label: "Message me on LinkedIn", href: site.linkedin }
    : null;

/** TODO(Dylan): add roles, newest first. The section stays hidden while this is empty. */
export const experience: { period: string; role: string; company: string }[] = [];

/**
 * Logo strip. `logo` is a transparent PNG or SVG in public/logos. It's used
 * as a mask, so only its shape matters and it always renders in theme ink.
 * `ratio` is width / height, used to size the mask box. `scale` evens out
 * optical size between stacked and horizontal marks.
 */
export const employers = [
  { name: "Flutter", logo: null, ratio: 4, scale: 1, period: "2023–" },
  { name: "AIB", logo: "/logos/aib.png", ratio: 149 / 193, scale: 1, period: "2021–2023" },
  { name: "Design+", logo: null, ratio: 4.2, scale: 1, period: "2018–2020" },
  { name: "Bord na Móna", logo: "/logos/bord-na-mona.svg", ratio: 969.7 / 283.5, scale: 0.6, period: "2017–2018" },
] as const;

export const capabilities = [
  "Product strategy",
  "Interaction design",
  "Behavioural design",
  "Design systems",
  "Prototyping in code",
  "AI product design",
  "Agentic workflows",
  "Prompt and eval design",
  "Front-end build",
] as const;

export const toolkit = ["Figma", "Claude", "Claude Code", "Next.js", "Tailwind", "Motion", "GSAP", "Vercel", "Supabase"] as const;

export const principles = [
  {
    title: "Follow it all the way",
    body: "I'd rather see a design through to production than hand over a Figma file and move on. More and more, that means writing the code myself.",
  },
  {
    title: "Know where AI falls over",
    body: "Models are brilliant at some jobs and confidently wrong at others. I try to find that line early, design around it, and keep a person in charge of anything that matters.",
  },
  {
    title: "Put it in front of people",
    body: "Most of what's here is live. My World Cup app took ten releases to get one navigation bar sitting right on iPhones. No mockup was ever going to tell me that.",
  },
] as const;

export const nav = [
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
] as const;
