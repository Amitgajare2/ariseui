import type { Metadata } from "next";
import { Syne } from "next/font/google";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Introduction — Arise UI",
};

export default function IntroductionPage() {
  return (
    <article className={`prose-custom ${syne.className}`}>
      <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-orange-400">
        Getting Started
      </span>
      <h1 className="mb-4 text-4xl font-bold text-black">Introduction</h1>
      <p className="mb-6 text-sm text-slate-600">
        Arise UI is a free, open-source HTML & Tailwind CSS component library.
        No frameworks, no npm installs — copy the component HTML directly into
        your project and style it however you like.
      </p>

      <div className="mb-8 rounded-xl border border-orange-500/20 bg-orange-500/5 p-5 text-sm text-slate-950">
        <strong className="text-orange-300">Philosophy:</strong> Components you
        own. Not a dependency you maintain. Copy, paste, customize — ship faster.
      </div>

      <h2 className="mb-3 text-2xl font-semibold text-black">How it works</h2>
      <ul className="mb-6 flex flex-col gap-3 text-sm">
        {[
          "Browse the component you need from the sidebar.",
          "Preview the live demo and inspect the code.",
          "Copy the HTML & Tailwind classes into your project.",
          "Customize with utility classes or your own CSS.",
        ].map((step, i) => (
          <li key={i} className="flex items-start gap-3 text-slate-600">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-600/20 text-xs font-bold text-orange-400">
              {i + 1}
            </span>
            {step}
          </li>
        ))}
      </ul>

      <h2 className="mb-3 text-2xl font-semibold text-black">Requirements</h2>
      <ul className="flex flex-col gap-2 text-slate-600 text-sm list-disc list-inside">
        <li>Any HTML file or template engine</li>
        <li>Tailwind CSS v4 (via CDN or CLI)</li>
        <li>No JavaScript framework required</li>
      </ul>
    </article>
  );
}
