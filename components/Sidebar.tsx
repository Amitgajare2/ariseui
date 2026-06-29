"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const nav = [
  {
    title: "Getting Started",
    items: [
      { label: "Introduction", href: "/docs/getting-started/introduction" },
      { label: "Installation", href: "/docs/getting-started/installation" },
    ],
  },
  {
    title: "UI Components",
    items: [
      { label: "Background", href: "/docs/components/background" },
      {
        label: "Marquee",
        href: "/docs/components/marquee-scroller",
      },
      { label: "Table", href: "/docs/components/table" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const inner = (
    <nav className="flex flex-col gap-6">
      {nav.map((section) => (
        <div key={section.title}>
          <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500">
            {section.title}
          </p>
          <ul className="flex flex-col gap-1">
            {section.items.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`block rounded-lg px-3 py-2 text-sm transition-all ${active
                        ? "bg-orange-500/10 font-semibold text-orange-600 ring-1 ring-orange-500/20"
                        : "text-slate-600 hover:bg-orange-50 hover:text-slate-900"
                      }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <>
      <button
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-orange-600 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-orange-600/20 md:hidden"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        {open ? "✕ Close" : "☰ Menu"}
      </button>

      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-72 overflow-y-auto border-r border-black/10 bg-white/95 p-6 pt-20 backdrop-blur">
            {inner}
          </aside>
        </div>
      )}

      <aside className="hidden w-64 shrink-0 border-r border-black/10 bg-white/70 px-4 pt-8 backdrop-blur md:block">
        {inner}
      </aside>
    </>
  );
}
