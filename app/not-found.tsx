import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-grid min-h-[70svh] content-center pt-[20vh]">
      <p className="eyebrow col-span-12 mb-6">404</p>
      <h1 className="type-display col-span-12 text-h1 leading-[0.95]">This page doesn&rsquo;t exist.</h1>
      <Link href="/" transitionTypes={["nav-back"]} className="eyebrow col-span-12 mt-10 hover:text-ink">
        ← Back home
      </Link>
    </div>
  );
}
