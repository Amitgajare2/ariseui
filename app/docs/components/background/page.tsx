import type { Metadata } from "next";
import DocTabs from "@/components/DocTabs";
import { getSource } from "@/lib/getSource";
import { Syne } from "next/font/google";

const syne = Syne({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = { title: "Backgrounds — Arise UI" };

export default function MarqueeScrollerPage() {
  const gridBackground   = getSource("components/demos/background/grid.html");
  const dotBackground = getSource("components/demos/background/dot.html");
  const bonusMask  = getSource("components/demos/background/bonus-mask.html");

  return (
    <article className={syne.className}>
      <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-orange-400">
        UI Components
      </span>
      <h1 className="mb-3 text-4xl font-bold text-black">Background</h1>
      <p className="mb-8 text-sm text-slate-600">
        A grid and a dot background with CSS and Tailwind CSS. I like the idea of building it with CSS so that it can be easily customized and used in different projects.
      </p>

      <h2 className="mb-4 text-xl font-semibold text-black">Grid background</h2>
      <DocTabs html={gridBackground} />

      <h2 className="mt-10 mb-4 text-xl font-semibold text-black">Dot background</h2>
      <DocTabs html={dotBackground} />

      <h2 className="mt-10 mb-4 text-xl font-semibold text-black">Bonus: Mask</h2>
      <DocTabs html={bonusMask} />

      
    </article>
  );
}
