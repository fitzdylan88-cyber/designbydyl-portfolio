import Image from "next/image";
import { lightboxTrigger } from "@/lib/lightbox";

type Props = {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  /** Break out of the text column. */
  wide?: boolean;
  /** Click-to-edit attribute for the Studio's preview. */
  edit?: string;
};

export function Figure({ src, alt, caption, width = 2400, height = 1500, wide, edit }: Props) {
  return (
    <figure data-sanity={edit} data-wide={wide || undefined} className={wide ? "my-16 -mx-[var(--margin)] md:mx-0" : "my-12"}>
      <button
        type="button"
        {...lightboxTrigger([{ src, alt, caption }])}
        className="block w-full cursor-zoom-in overflow-hidden bg-paper-2"
      >
        <Image src={src} alt={alt} width={width} height={height} className="h-auto w-full" />
      </button>
      {caption && <figcaption className="label mt-3 normal-case tracking-normal">{caption}</figcaption>}
    </figure>
  );
}
