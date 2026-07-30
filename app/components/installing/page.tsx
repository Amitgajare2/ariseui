import type { Metadata } from "next";
import { components, REGISTRY_REPO } from "@/lib/components";
import InstallRow from "./InstallRow";

export const metadata: Metadata = {
  title: "Installing",
};

export default function InstallingPage() {
  return (
    <div className="no-scrollbar h-full overflow-y-auto">
      <div className="mx-auto max-w-xl px-8 pb-24 pt-20">
        <div className="flex flex-col gap-12">

          <div className="flex flex-col gap-4">
            <SectionLabel>Installation</SectionLabel>
            <p className="text-2xl font-semibold leading-relaxed font-sans text-foreground/90">
              Add components to your project in one command. Source files
              land in your codebase with no package lock-in.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <SectionLabel>Step 1: Set up shadcn</SectionLabel>
            <p className="text-sm leading-relaxed text-foreground/70">
              Initialize shadcn in your project. Skip this step if shadcn is
              already configured.
            </p>
            <CodeLine command="npx shadcn@latest init" />
          </div>

          <div className="flex flex-col gap-3">
            <SectionLabel>Step 2: Add a component</SectionLabel>
            <p className="text-sm leading-relaxed text-foreground/70">
              Select a component from the sidebar and run its install command.
              The CLI copies the source into{" "}
              <InlineCode>components/ui/</InlineCode> and installs peer
              dependencies automatically.
            </p>
            <CodeLine command={`npx shadcn add ${REGISTRY_REPO}/<slug>`} />
          </div>

          <div className="flex flex-col gap-3">
            <SectionLabel>Package managers</SectionLabel>
            <p className="text-sm leading-relaxed text-foreground/70">
              The shadcn CLI supports npm, pnpm, yarn, and bun.
            </p>
            <div className="flex flex-col gap-2">
              {PM_VARIANTS.map(({ label, command }) => (
                <div key={label} className="flex flex-col gap-1.5">
                  <span className="text-xs text-foreground/40">{label}</span>
                  <CodeLine command={command} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <SectionLabel>All components</SectionLabel>
            <p className="text-sm leading-relaxed text-foreground/70">
              Every component in the registry. Use the copy button to grab the
              install command.
            </p>
            <div className="flex flex-col gap-3">
              {components
                .filter((c) => c.registry)
                .map((c) => (
                  <InstallRow
                    key={c.registry}
                    name={c.name}
                    description={c.description ?? ""}
                    registry={c.registry!}
                  />
                ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

const PM_VARIANTS = [
  { label: "npm", command: `npx shadcn add ${REGISTRY_REPO}/scroll-progress` },
  { label: "pnpm", command: `pnpm dlx shadcn add ${REGISTRY_REPO}/scroll-progress` },
  { label: "yarn", command: `yarn dlx shadcn add ${REGISTRY_REPO}/scroll-progress` },
  { label: "bun", command: `bunx --bun shadcn add ${REGISTRY_REPO}/scroll-progress` },
];

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
