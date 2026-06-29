import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Caveat } from "next/font/google";
import { Syne } from "next/font/google";
import { HiLightningBolt } from "react-icons/hi";
import { FaAccessibleIcon, FaGithub, FaXTwitter, FaInstagram } from "react-icons/fa6";
import { MdEditSquare } from "react-icons/md";

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function Home() {
  return (
    <div className="min-h-screen absolute inset-0 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] text-black">
      <Navbar />

      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-1 text-center overflow-hidden">
        {/* Glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <div className="h-[500px] w-[500px] rounded-full bg-orange-100/20 blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-500/30 bg-black px-4 py-1.5 text-xs font-medium text-white">
            Open Source · Free Forever
          </span>

          <h1 className={`${caveat.className} mb-6 text-5xl font-bold leading-tight tracking-tight text-black sm:text-6xl lg:text-7xl`}>
            Build faster with{" "}
            <span className="bg-gradient-to-r from-mauve-400 to-mauve-800 bg-clip-text text-transparent px-2.5">
              Arise UI
            </span>
          </h1>

          <p className={`${syne.className}mx-auto mb-10 max-w-xl text-lg text-slate-800 text-sm`}>
            A modern HTML & Tailwind CSS component library. No frameworks, no
            dependencies — just clean, accessible components you copy, paste, and own.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/docs/components/marquee-scroller"
              className="rounded-lg bg-orange-600 px-7 py-3 text-sm font-semibold text-white hover:bg-orange-500 transition-colors"
            >
              Browse Components
            </Link>
            <Link
              href="/docs/getting-started/introduction"
              className="rounded-lg border border-black/20 px-7 py-3 text-sm font-medium text-slate-400 hover:border-black/40 hover:text-black transition-colors"
            >
              Read the Docs →
            </Link>
          </div>
        </div>
 {/* clean bottom fade */}
 <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent via-black/40 to-black" />
      </section>

      {/* Features */}
      <section className="relative z-10 -mt-24 overflow-visible bg-black px-6 py-24 pt-40">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/10 via-white/5 to-transparent" />


        <div className="mx-auto max-w-5xl">
          <h2 className={`${syne.className} mb-12 text-center text-2xl font-bold text-white uppercase`}>
            Why Arise UI?
          </h2>
          <div className={`${syne.className} grid gap-6 sm:grid-cols-3`}>
            {[
              {
                icon: <HiLightningBolt />,
                title: "Copy & Paste",
                desc: "No npm install needed. Copy the component code directly into your project.",
              },
              {
                icon: <FaAccessibleIcon />,
                title: "Accessible",
                desc: "Built with WAI-ARIA guidelines. Every component works with keyboard and screen readers.",
              },
              {
                icon: <MdEditSquare />,
                title: "Customizable",
                desc: "Styled with Tailwind CSS. Tweak anything with utility classes or your own CSS.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-white/10 bg-gray/5 p-6 hover:border-white/40 transition-colors"
              >
                <div className="mb-4 text-3xl text-orange-50">{f.icon}</div>
                <h3 className="mb-2 font-semibold text-white">{f.title}</h3>
                <p className="text-sm text-slate-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-slate-400 border-t border-white/10">
        {/* Top grid */}
        <div className="mx-auto max-w-5xl px-6 py-14 grid gap-10 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <p className="mb-2 text-lg font-bold uppercase tracking-tight text-white">Arise UI</p>
            <p className="text-sm leading-relaxed">
              A free, open-source HTML &amp; Tailwind CSS component library. Copy, paste, and ship beautiful UIs fast.
            </p>
            {/* Social links */}
            <div className="mt-5 flex items-center gap-3">
              {[
                { href: "https://github.com/", label: "GitHub", icon: <FaGithub size={18} /> },
                { href: "https://twitter.com/", label: "Twitter / X", icon: <FaXTwitter size={18} /> },
                { href: "https://instagram.com/", label: "Instagram", icon: <FaInstagram size={18} /> },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-slate-400 transition-colors hover:border-orange-500 hover:text-orange-500"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Components */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white">Components</p>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Marquee Scroller", href: "/docs/components/marquee-scroller" },
                { label: "Background", href: "/docs/components/background" },
                { label: "Table", href: "/docs/components/table" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="transition-colors hover:text-orange-500">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Docs */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white">Docs</p>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Introduction", href: "/docs/getting-started/introduction" },
                { label: "Installation", href: "/docs/getting-started/installation" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="transition-colors hover:text-orange-500">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 px-6 py-5">
          <div className="mx-auto max-w-5xl flex flex-col items-center justify-between gap-3 sm:flex-row text-xs text-slate-500">
            <span>© {new Date().getFullYear()} Arise UI. All rights reserved.</span>
            <span>
              Built with{" "}
              <a href="https://tailwindcss.com" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">
                Tailwind CSS
              </a>{" "}
              &amp;{" "}
              <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">
                Next.js
              </a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
