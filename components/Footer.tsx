import Link from "next/link";

const GITHUB_URL = "https://github.com/amitgajare2/ariseui";
const X_URL = "https://x.com/AmitGajare4";

const SOCIALS = [
  { label: "GitHub", href: GITHUB_URL },
  { label: "X / Twitter", href: X_URL },
];

const EXPLORE = [
  { label: "Components", href: "/components" },
  // { label: "Sponsors", href: "/#sponsors" },
];

const ArrowIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    className="h-3 w-3 text-[#fcd601] transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
    aria-hidden="true"
  >
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="relative w-full p-2.5 pt-20">
      <div
        className="relative w-full overflow-visible rounded-t-[45px] bg-neutral-950 px-6 pb-10 pt-20 sm:pt-28 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] sm:px-12"
        style={{ cornerShape: "squircle" } as React.CSSProperties}
      >
        {/* logo pops out over the top edge of the card */}
        <img
          src="/logos/AriseUI.svg"
          alt="Arise UI logo"
          className="absolute left-1/2 top-0 h-20 w-20 -translate-x-1/2 -translate-y-1/2 sm:h-28 sm:w-28 md:h-36 md:w-36"
        />

        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-start gap-6 md:grid-cols-[1fr_auto_1fr] md:items-start">
          <div className="order-2 flex flex-row flex-wrap gap-3 md:flex-col md:order-1 md:pt-4 md:items-start text-left">
            <span className="mb-1 font-runde text-lg font-bold tracking-tight text-white">
              Socials
            </span>
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex w-fit items-center gap-2 text-sm font-medium text-white/60 transition-colors duration-150 ease-out hover:text-white sm:text-base"
              >
                {social.label}
                <ArrowIcon />
              </a>
            ))}
          </div>

          <div className="order-1 flex flex-col items-center gap-4 text-center md:order-2 md:pt-2">
            <h2 className="font-runde text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Arise UI
            </h2>
            <p className="max-w-xl text-balance font-medium text-white/60 text-sm sm:text-lg">
              A curated collection of rare, ready-to-use components and animations built for your next project.
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/components"
                className="flex h-10 sm:h-12 items-center rounded-full bg-[#fcd601] px-4 sm:px-6 text-sm font-semibold text-black shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)] transition-colors duration-150 ease-out hover:bg-[#e0ac00]"
              >
                Browse components
              </Link>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className="flex h-10 sm:h-12 items-center rounded-full bg-white/8 px-4 sm:px-6 text-sm font-semibold text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.14),inset_0_-1px_2px_0_rgba(0,0,0,0.3)] backdrop-blur-2xl transition-colors duration-150 ease-out hover:bg-white/12"
              >
                Star on GitHub
              </a>
            </div>
          </div>

          {/* <div className="order-3 flex flex-row flex-wrap gap-3 justify-center md:flex-col md:items-end md:pt-4 text-right">
            <span className="mb-1 font-runde text-lg font-bold tracking-tight text-white">
              Explore
            </span>
            {EXPLORE.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="w-fit text-sm font-medium text-white/60 transition-colors duration-150 ease-out hover:text-white sm:text-base"
              >
                {link.label}
              </Link>
            ))}
          </div> */}
        </div>
        <div className="mx-auto mt-12 flex w-full max-w-6xl flex-wrap items-center justify-center md:justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <a
              href="/sitemap.xml"
              className="text-xs font-medium text-white/50 transition-colors duration-150 ease-out hover:text-white"
            >
              Sitemap
            </a>
            <span aria-hidden="true" className="text-xs text-white/25">
              &middot;
            </span>
            <a
              href="/robots.txt"
              className="text-xs font-medium text-white/50 transition-colors duration-150 ease-out hover:text-white"
            >
              robots.txt
            </a>
          </div>

          <div className="flex items-center">
            <span className="text-xs font-medium text-white/50">
              &copy; 2026 - {new Date().getFullYear()} Arise UI
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
