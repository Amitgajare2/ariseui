import type { Metadata } from "next";
import { REGISTRY_REPO, PANEL_INFO } from "@/lib/components";

export const metadata: Metadata = {
  title: "Introduction",
};

export default function IntroductionPage() {
  return (
    <div className="no-scrollbar h-full overflow-y-auto">
      <div className="mx-auto max-w-xl px-8 pb-24 pt-20">
        <div className="flex flex-col gap-12">

          {/* header */}
          <div className="flex flex-col gap-4">
            <SectionLabel>Introduction</SectionLabel>
            <p className="text-2xl font-semibold leading-relaxed font-sans text-foreground/90">
              A shadcn registry of rare, animated components — built with
              Tailwind CSS and Motion. Free to use, yours to own.
            </p>
          </div>

          {/* what is arise ui */}
          <div className="flex flex-col gap-3">
            <SectionLabel>What is Arise UI?</SectionLabel>
            <p className="text-sm leading-relaxed text-foreground/70">
              Arise UI is built on the{" "}
              <a
                href="https://ui.shadcn.com/docs/registry"
                target="_blank"
                rel="noreferrer"
                className="text-foreground/90 underline underline-offset-4 transition-opacity hover:opacity-70"
              >
                shadcn registry
              </a>{" "}
              protocol. Every component installs directly into your project as a
              real file — not a package. You copy it in, you own it. Style it,
              gut it, or extend it however you want.
            </p>
          </div>

          {/* what's included */}
          <div className="flex flex-col gap-3">
            <SectionLabel>What&apos;s included</SectionLabel>
            <ul className="flex flex-col gap-2.5">
              {[
                "Spring-physics animations via Motion (Framer Motion)",
                "Full dark and light mode — follows your theme tokens",
                "Controlled and uncontrolled variants where it makes sense",
                "Honors prefers-reduced-motion across all components",
                "Tailwind CSS only — no extra stylesheets or CSS-in-JS",
                "TypeScript with full prop types exported",
              ].map((item) => (
                <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-foreground/70">
                  <span className="mt-0.5 shrink-0 text-foreground/30">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* how it works */}
          <div className="flex flex-col gap-3">
            <SectionLabel>How it works</SectionLabel>
            <p className="text-sm leading-relaxed text-foreground/70">
              The shadcn CLI reads the registry, resolves dependencies, and
              writes the component file straight into{" "}
              <InlineCode>components/ui/</InlineCode> in your project. Any npm
              packages the component needs (e.g.{" "}
              <InlineCode>motion</InlineCode>,{" "}
              <InlineCode>prism-react-renderer</InlineCode>) are installed
              automatically. Nothing is imported from Arise UI at runtime.
            </p>
          </div>

          {/* quickstart */}
          <div className="flex flex-col gap-3">
            <SectionLabel>Quickstart</SectionLabel>
            <p className="text-sm leading-relaxed text-foreground/70">
              You need a React or Next.js project with shadcn already set up. If
              you haven&apos;t done that yet, run:
            </p>
            <CodeLine command="npx shadcn@latest init" />
            <p className="text-sm leading-relaxed text-foreground/70">
              Then install any component in one command:
            </p>
            <CodeLine command={`npx shadcn add ${REGISTRY_REPO}/fluid-orb`} />
            <p className="text-sm leading-relaxed text-foreground/70">
              Replace <InlineCode>fluid-orb</InlineCode> with any component slug
              from the{" "}
              <a
                href="/components/installing"
                className="text-foreground/90 underline underline-offset-4 transition-opacity hover:opacity-70"
              >
                Installing
              </a>{" "}
              page.
            </p>
          </div>

          {/* keep in mind */}
          <div className="flex flex-col gap-3">
            <SectionLabel>Keep in mind</SectionLabel>
            <p className="text-sm leading-relaxed text-foreground/70">
              {PANEL_INFO.keepInMind}
            </p>
          </div>

          {/* license */}
          <div className="flex flex-col gap-3">
            <SectionLabel>License &amp; Usage</SectionLabel>
            <ul className="flex flex-col gap-2">
              {PANEL_INFO.license.map((line) => (
                <li key={line} className="flex gap-2 text-sm leading-relaxed text-foreground/70">
                  <span className="shrink-0 text-foreground/40">•</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-medium uppercase tracking-normal text-foreground/40">
      {children}
    </p>
  );
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground/80">
      {children}
    </code>
  );
}

function CodeLine({ command }: { command: string }) {
  return (
    <div className="flex items-center rounded-lg bg-muted px-3 py-2.5">
      <code className="font-mono text-xs text-foreground/80">{command}</code>
    </div>
  );
}
