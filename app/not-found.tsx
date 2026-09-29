import Link from "next/link";
import { Arrow } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="container-grid min-h-[70svh] content-center pt-[20vh]">
      <h1 className="type-display col-span-12 text-h1 leading-[0.95]">This page doesn&rsquo;t exist.</h1>
      <Link href="/" transitionTypes={["nav-back"]} className="group col-span-12 mt-10 inline-flex w-fit items-center gap-2 text-body font-medium text-ink">
        <Arrow direction="left" className="text-accent transition-transform duration-[var(--dur-2)] group-hover:-translate-x-1" />
        Back home
      </Link>
    </div>
  );
}
