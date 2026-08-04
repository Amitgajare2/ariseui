import type { Metadata } from "next";
import GooeyNavbar from "@/components/GooeyNavbar";
import { fetchStarCount } from "@/lib/github";
import HeroCta from "@/components/HeroCta";
import HomeDemos from "@/components/HomeDemos";
import Footer from "@/components/Footer";
import HeroWrapper from "@/components/HeroWrapper";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  const stars = await fetchStarCount();

  return (
    <>
      <Analytics />
      <GooeyNavbar stars={stars} />
      <section className="relative w-full bg-black p-1.5 md:p-2.5">
        <HeroWrapper>
          {/* main vertical gradient */}
          <div
            aria-hidden="true"
            className="absolute inset-0 z-0 rounded-[inherit] bg-[linear-gradient(180deg,#fff9df_0%,#ffdfa0_15%,#ff941f_35%,#b33708_55%,#3a0903_72%,#000000_92%)]"
          />
          {/* blurred vertical light rays */}
          <div
            aria-hidden="true"
            className="absolute -inset-x-[12%] -top-[8%] z-10 h-[78%] opacity-70 blur-[35px] rounded-[inherit] [background-image:repeating-linear-gradient(90deg,transparent_0%,transparent_5%,rgba(255,250,225,0.5)_7%,rgba(255,157,45,0.25)_10%,transparent_14%)] [mask-image:linear-gradient(to_bottom,black_0%,black_62%,transparent_100%)]"
          />
          {/* soft highlights and dark vignette */}
          <div
            aria-hidden="true"
            className="absolute inset-0 z-20 rounded-[inherit] bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.5)_0%,transparent_38%),radial-gradient(ellipse_at_50%_42%,transparent_20%,rgba(0,0,0,0.15)_52%,rgba(0,0,0,0.95)_100%)]"
          />
          {/* grain texture */}
          <div
            aria-hidden="true"
            className="noise absolute inset-0 z-30 rounded-[inherit] opacity-25 mix-blend-soft-light"
          />
          <div className="relative z-40 mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-4 pb-12 pt-24 text-center sm:gap-5 sm:px-6 sm:pb-16 sm:pt-28 md:gap-6 md:pt-32 lg:pt-36">
            <h1 className="max-w-4xl text-balance font-cal text-[#171717] text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Components Designed to Stand Out.
            </h1>
            <p className="max-w-xl font-sans text-sm font-normal tracking-wide text-black/60 sm:text-base md:text-lg">
              A curated collection of distinctive, animated UI components built
              for modern interfaces. Explore live previews and install any
              component instantly with the shadcn CLI.
            </p>
            <HeroCta />
            <HomeDemos />
          </div>
        </HeroWrapper>
      </section>

      <DemoSection />
      <Footer />
    </>
  );
}

const X_URL = "https://x.com/AmitGajare4";
const GITHUB_URL = "https://github.com/amitgajare2/ariseui";

function DemoSection() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-6 py-16 text-center md:py-20">
      <span className="flex items-center gap-2 rounded-full border border-border px-3.5 py-1.5 text-xs font-medium text-muted-foreground">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#fcd601] opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#fcd601]" />
        </span>
        Work in progress
      </span>
      <h2 className="max-w-2xl text-balance font-runde text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
        Arise UI is built in public
      </h2>
      <p className="max-w-xl text-balance font-medium text-muted-foreground sm:text-lg">
        The landing page is still evolving, with new components and improvements
        shipping regularly. Follow the journey on X and star the project on
        GitHub to stay updated.
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <a
          href={X_URL}
          target="_blank"
          rel="noreferrer"
          className="flex h-12 items-center gap-2.5 rounded-full bg-neutral-900 px-6 text-sm font-semibold text-white transition-colors duration-150 ease-out hover:bg-neutral-800"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />
          </svg>
          Follow the journey
        </a>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          className="flex h-12 items-center gap-2.5 rounded-full border border-border bg-card px-6 text-sm font-semibold transition-colors duration-150 ease-out hover:bg-muted"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fcd601"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
          </svg>
          Star on GitHub
        </a>
      </div>
    </section>
  );
}
