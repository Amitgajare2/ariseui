import type { Metadata } from "next";
import DocTabs from "@/components/DocTabs";
import { getSource } from "@/lib/getSource";
import { Syne } from "next/font/google";

const syne = Syne({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = { title: "Marquee Scroller — Arise UI" };

export default function MarqueeScrollerPage() {
  const htmlBasic   = getSource("components/demos/marquee/marquee-basic.html");
  const htmlReverse = getSource("components/demos/marquee/marquee-reverse.html");
  const htmlLogos   = getSource("components/demos/marquee/marquee-logos.html");

  return (
    <article className={syne.className}>
      <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-orange-400">
        UI Components
      </span>
      <h1 className="mb-3 text-4xl font-bold text-black">Marquee Scroller</h1>
      <p className="mb-8 text-sm text-slate-600">
        A smooth, infinitely looping horizontal scroller built with pure HTML and CSS.
        Supports left/right direction, configurable speed via CSS animation duration, and pause-on-hover.
      </p>

      <h2 className="mb-4 text-xl font-semibold text-black">Basic</h2>
      <DocTabs html={htmlBasic} />

      <h2 className="mt-10 mb-4 text-xl font-semibold text-black">SVG curve Marquee tag</h2>
      <DocTabs html={htmlReverse} />

      <h2 className="mt-10 mb-4 text-xl font-semibold text-black">Logo Strip</h2>
      <DocTabs html={htmlLogos} />

      <h2 className="mt-10 mb-4 text-xl font-semibold text-black">Usage</h2>
      <div className="overflow-x-auto rounded-lg border border-black/10">
        <table className="w-full text-sm text-left">
          <thead className="border-b border-black/10 bg-black/5">
            <tr>
              {["CSS class", "Effect"].map((h) => (
                <th key={h} className="px-4 py-3 font-semibold text-slate-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["marquee-track", "Scrolls left (default direction)"],
              ["marquee-right", "Scrolls right"],
              ["marquee-wrap:hover .marquee-track", "Pauses on hover"],
              ["animation-duration", "Change speed — lower = faster"],
            ].map(([cls, desc]) => (
              <tr key={cls} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3 font-mono text-xs text-orange-500">{cls}</td>
                <td className="px-4 py-3 text-slate-500">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
