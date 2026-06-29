"use client";

import { useState } from "react";

interface DocTabsProps {
  /** raw HTmL string — rendered as live preview and shown as code */
  html: string;
}

export default function DocTabs({ html }: DocTabsProps) {
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-black/10 bg-[#fffaf5] px-4">
        <div className="flex">
          {(["preview", "code"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`border-b-2 px-4 py-3 text-sm font-medium capitalize transition-colors ${
                tab === t
                  ? "border-orange-500 text-slate-900"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        {tab === "code" && (
          <button
            onClick={copy}
            className="rounded-md bg-white px-3 py-1.5 text-xs text-slate-600 transition-colors hover:text-orange-600"
          >
            {copied ? "✓ Copied" : "Copy"}
          </button>
        )}
      </div>

      {tab === "preview" ? (
        <div
          className="flex min-h-45 items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.14),transparent_30%),#ffffff] p-8"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="overflow-x-auto bg-[#111827] p-5 text-sm leading-relaxed text-slate-200 font-mono max-h-105 overflow-y-auto">
          <code>{html}</code>
        </pre>
      )}
    </div>
  );
}
