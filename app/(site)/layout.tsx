import { ViewTransition } from "react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="fixed top-3 left-3 z-[60] -translate-y-20 rounded-full bg-ink px-4 py-2 text-small text-paper focus:translate-y-0"
      >
        Skip to content
      </a>
      <Header />
      <ViewTransition
        enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "page" }}
        exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "page" }}
        default="none"
      >
        <main id="main">{children}</main>
      </ViewTransition>
      <Footer />
    </>
  );
}
