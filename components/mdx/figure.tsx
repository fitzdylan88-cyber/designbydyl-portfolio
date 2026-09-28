import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  /** Break out of the text column. */
  wide?: boolean;
};

export function Figure({ src, alt, caption, width = 2400, height = 1500, wide }: Props) {
  return (
    <figure className={wide ? "my-16 -mx-[var(--margin)] md:mx-0" : "my-12"}>
      <div className="overflow-hidden rounded-sm bg-paper-2">
        <Image src={src} alt={alt} width={width} height={height} className="h-auto w-full" />
      </div>
      {caption && <figcaption className="eyebrow mt-3 normal-case tracking-normal">{caption}</figcaption>}
    </figure>
  );
}
