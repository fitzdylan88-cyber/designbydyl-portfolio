import type { MDXComponents } from "mdx/types";
import { BeforeAfter } from "@/components/mdx/before-after";
import { Callout } from "@/components/mdx/callout";
import { Figure } from "@/components/mdx/figure";
import { Metrics } from "@/components/mdx/metrics";
import { PromptBlock } from "@/components/mdx/prompt-block";

const components: MDXComponents = {
  h2: (props) => (
    <h2 className="mt-20 mb-6 type-display text-h2 leading-[1.05] text-ink" {...props} />
  ),
  h3: (props) => <h3 className="mt-12 mb-4 text-h3 font-medium tracking-tight text-ink" {...props} />,
  p: (props) => <p className="my-5 text-ink-2" {...props} />,
  ul: (props) => <ul className="my-5 list-disc space-y-2 pl-5 text-ink-2 marker:text-ink-3" {...props} />,
  ol: (props) => <ol className="my-5 list-decimal space-y-2 pl-5 text-ink-2 marker:text-ink-3" {...props} />,
  strong: (props) => <strong className="font-semibold text-ink" {...props} />,
  a: (props) => (
    <a
      className="text-ink underline decoration-rule decoration-1 underline-offset-4 transition-colors duration-[var(--dur-2)] hover:decoration-accent"
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote className="my-12 type-display text-h3 leading-tight text-ink [&>p]:text-ink" {...props} />
  ),
  hr: () => <hr className="my-16 border-rule" />,
  BeforeAfter,
  Callout,
  Figure,
  Metrics,
  PromptBlock,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
