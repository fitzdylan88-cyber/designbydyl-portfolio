/**
 * Site-wide copy and links. Edit here, not in components.
 * TODO(Dylan): add a contact email and LinkedIn URL. Contact buttons only
 * render once one of them is set.
 */
export const site = {
  name: "Dylan Fitzpatrick",
  shortName: "Dyl",
  role: "Product designer",
  location: "Dublin, Ireland",
  timeZone: "Europe/Dublin",
  experience: "8+ years",
  intro:
    "Product designer building with AI. I design the product, then use Claude to build it, test it and ship it.",
  /** Shown above the footer headline. Keep null unless you want to say publicly that you're looking. */
  availability: null as string | null,
  email: null as string | null,
  linkedin: null as string | null,
  links: [{ label: "Tips", href: "https://tips.designbydyl.com" }],
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
  { name: "AIB", logo: "/logos/aib.png", ratio: 149 / 193, scale: 1, period: "2021–" },
  { name: "Design+", logo: null, ratio: 4.2, scale: 1, period: "2018–2020" },
  { name: "Bord na Móna", logo: "/logos/bord-na-mona.svg", ratio: 969.7 / 283.5, scale: 0.6, period: "2017–2018" },
] as const;

export const capabilities = [
  "Product strategy",
  "Interaction design",
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
    title: "Design the whole thing",
    body: "Problem framing, flows, the shipped pixel, and increasingly the code. I don't hand off a Figma file and hope.",
  },
  {
    title: "AI is a material",
    body: "Like any material it has a grain. I learn where models are strong, design around where they fail, and keep people in the loop where it counts.",
  },
  {
    title: "Ship to learn",
    body: "Most of what's here is live. Real users teach you more in a week than a month of mockups.",
  },
] as const;

export const nav = [
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
] as const;
