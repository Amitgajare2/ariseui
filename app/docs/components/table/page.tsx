import type { Metadata } from "next";
import DocTabs from "@/components/DocTabs";
import { getSource } from "@/lib/getSource";
import { Syne } from "next/font/google";

const syne = Syne({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = { title: "Table — Arise UI" };

export default function TablePage() {
  const htmlBasic   = getSource("components/demos/table/table-basic.html");
  const htmlStriped = getSource("components/demos/table/table-striped.html");
  const htmlStatus  = getSource("components/demos/table/table-with-status.html");

  return (
    <article className={syne.className}>
      <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-orange-400">
        UI Components
      </span>
      <h1 className="mb-3 text-4xl font-bold text-black">Table</h1>
      <p className="mb-8 text-sm text-slate-600">
        A styled, responsive data table built with plain HTML and Tailwind CSS.
        Supports striped rows, hover states, and status badges — no JavaScript required.
      </p>

      <h2 className="mb-4 text-xl font-semibold text-black">Basic</h2>
      <DocTabs html={htmlBasic} />

      <h2 className="mt-10 mb-4 text-xl font-semibold text-black">Striped</h2>
      <DocTabs html={htmlStriped} />

      <h2 className="mt-10 mb-4 text-xl font-semibold text-black">With Status Badges</h2>
      <DocTabs html={htmlStatus} />

      <h2 className="mt-10 mb-4 text-xl font-semibold text-black">Classes reference</h2>
      <div className="overflow-x-auto rounded-lg border border-black/10">
        <table className="w-full text-sm text-left">
          <thead className="border-b border-black/10 bg-black/5">
            <tr>
              {["Element", "Classes", "Notes"].map((h) => (
                <th key={h} className="px-4 py-3 font-semibold text-slate-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["Wrapper", "overflow-x-auto rounded-lg border border-black/10", "Enables horizontal scroll on small screens"],
              ["<table>", "w-full text-sm text-left", "Full-width, left-aligned text"],
              ["<thead>", "border-b border-black/10 bg-black/5", "Subtle header background"],
              ["<th>", "px-4 py-3 font-semibold text-slate-600 whitespace-nowrap", "Prevents header wrapping"],
              ["<tr> (body)", "hover:bg-black/5 transition-colors", "Hover highlight"],
              ["<tr> striped", "bg-orange-50/40", "Even row tint for striped variant"],
              ["Status badge", "rounded-full px-2.5 py-0.5 text-xs font-medium", "Combine with color classes"],
            ].map(([el, cls, notes]) => (
              <tr key={el} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3 font-mono text-xs text-orange-500">{el}</td>
                <td className="px-4 py-3 font-mono text-xs text-slate-500">{cls}</td>
                <td className="px-4 py-3 text-slate-400">{notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
