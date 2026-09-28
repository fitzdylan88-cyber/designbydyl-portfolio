/**
 * Site-wide copy and links. Edit here, not in components.
 * TODO(Dylan): confirm email and social links before launch.
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
  availability: "Open to conversations about senior and lead roles",
  email: "hello@designbydyl.com",
  links: [
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
    { label: "Tips", href: "https://tips.designbydyl.com" },
  ],
} as const;

/** TODO(Dylan): add roles, newest first. The section stays hidden while this is empty. */
export const experience: { period: string; role: string; company: string }[] = [];

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
