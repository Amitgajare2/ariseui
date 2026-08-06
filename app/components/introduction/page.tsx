import type { Metadata } from "next";
import { REGISTRY_REPO, PANEL_INFO } from "@/lib/components";
import CopyButton from "@/components/CopyButton";
import Tooltip from "@/components/Tooltip";

export const metadata: Metadata = {
  title: "Introduction",
};

export default function IntroductionPage() {
  return (
    <div className="no-scrollbar h-full overflow-y-auto">
      <div className="mx-auto max-w-xl px-8 pb-24 pt-20">
        <div className="flex flex-col gap-12">

          <div className="flex flex-col gap-4">
            <SectionLabel>Introduction</SectionLabel>
            <p className="text-2xl font-semibold leading-relaxed font-sans text-foreground/90">
              A curated registry of animated React components, built with
              Tailwind CSS and Motion. Install source you own, refine it to
              match your product.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <SectionLabel>What is Arise UI?</SectionLabel>
            <p className="text-sm leading-relaxed text-foreground/80 dark:text-foreground/70">
              Arise UI follows the{" "}
              <a
                href="https://ui.shadcn.com/docs/registry"
                target="_blank"
                rel="noreferrer"
                className="text-foreground/90 underline underline-offset-4 transition-opacity hover:opacity-70"
              >
                shadcn registry
              </a>{" "}
              protocol. Each component installs as source in your repository,
              not as a package dependency. You retain full control over
              styling, structure, and behavior.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <SectionLabel>What&apos;s included</SectionLabel>
            <ul className="flex flex-col gap-2.5">
              {PANEL_INFO.whatIsIncluded.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-foreground/80 dark:text-foreground/70">
                  <span className="mt-0.5 shrink-0 text-foreground/50 dark:text-foreground/30">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <SectionLabel>How it works</SectionLabel>
            <p className="text-sm leading-relaxed text-foreground/80 dark:text-foreground/70">
              The shadcn CLI reads the registry, resolves dependencies, and
              writes component files into{" "}
              <InlineCode>components/ui/</InlineCode>. Required packages
              (such as <InlineCode>motion</InlineCode> or{" "}
              <InlineCode>prism-react-renderer</InlineCode>) are installed
              automatically. Nothing imports from Arise UI at runtime.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <SectionLabel>Quickstart</SectionLabel>
            <p className="text-sm leading-relaxed text-foreground/80 dark:text-foreground/70">
              Arise UI requires a React or Next.js project with shadcn
              configured. If you have not initialized shadcn yet, run:
            </p>
            <CodeLine command="npx shadcn@latest init" />
            <p className="text-sm leading-relaxed text-foreground/80 dark:text-foreground/70">
              Then add any component with a single command:
            </p>
            <CodeLine command={`npx shadcn add ${REGISTRY_REPO}/scroll-progress`} />
            <p className="text-sm leading-relaxed text-foreground/80 dark:text-foreground/70">
              Replace <InlineCode>scroll-progress</InlineCode> with any slug
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

          <div className="flex flex-col gap-3">
            <SectionLabel>Keep in mind</SectionLabel>
            <p className="text-sm leading-relaxed text-foreground/80 dark:text-foreground/70">
              {PANEL_INFO.keepInMind}
            </p>
          </div>

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
    <p className="text-xs font-medium uppercase tracking-normal text-foreground/60 dark:text-foreground/40">
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
    <div className="flex items-center justify-between rounded-lg bg-muted p-2 pl-3">
      <code className="flex-1 truncate font-mono text-xs text-foreground/80">{command}</code>
      <Tooltip label="Copy" align="end">
        <CopyButton value={command} title="" className="cursor-pointer" />
      </Tooltip>
    </div>
  );
}
