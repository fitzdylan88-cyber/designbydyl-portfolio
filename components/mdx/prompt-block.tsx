/**
 * Shows an AI interaction: the prompt (or skill/agent setup) and what came
 * back. The core visual device for AI case studies.
 */
export function PromptBlock({
  tool = "Claude",
  prompt,
  children,
}: {
  tool?: string;
  prompt: string;
  children?: React.ReactNode;
}) {
  return (
    <figure className="my-12 overflow-hidden rounded-md border border-rule bg-paper-2 font-mono text-small">
      <div className="flex items-center justify-between border-b border-rule px-4 py-2.5">
        <span className="eyebrow">Prompt</span>
        <span className="eyebrow">{tool}</span>
      </div>
      <pre className="whitespace-pre-wrap px-4 py-4 leading-relaxed text-ink">{prompt}</pre>
      {children && (
        <>
          <div className="border-y border-rule px-4 py-2.5">
            <span className="eyebrow">Output</span>
          </div>
          <div className="px-4 py-4 font-sans text-body text-ink-2 [&>p]:m-0">{children}</div>
        </>
      )}
    </figure>
  );
}
