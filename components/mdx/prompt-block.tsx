/**
 * Shows an AI interaction: the prompt (or skill/agent setup) and what came
 * back. The core visual device for AI case studies.
 */
export function PromptBlock({
  tool = "Claude",
  prompt,
  children,
  edit,
}: {
  tool?: string;
  prompt: string;
  children?: React.ReactNode;
  edit?: string;
}) {
  return (
    <figure data-sanity={edit} className="my-12 overflow-hidden rounded-sm bg-paper-2 font-mono text-small">
      <div className="px-4 pt-3">
        <span className="meta">Prompt to {tool}</span>
      </div>
      <pre className="whitespace-pre-wrap px-4 py-4 leading-relaxed text-ink">{prompt}</pre>
      {children && (
        <>
          <div className="px-4 pt-3">
            <span className="meta">Output</span>
          </div>
          <div className="px-4 py-4 font-sans text-body text-ink-2 [&>p]:m-0">{children}</div>
        </>
      )}
    </figure>
  );
}
