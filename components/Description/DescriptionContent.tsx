"use client";

import { type ComponentItem, PANEL_INFO } from "@/lib/components";
import { cn } from "@/lib/utils";
import CopyButton from "../CopyButton";
import Tooltip from "../Tooltip";
import PanelCode from "./PanelCode";
import InstallCommand from "./InstallCommand";
import DependencyPill from "./DependencyPill";
import PropsTable from "./PropsTable";
import DocSection from "./DocSection";
import { MailIcon, XIcon } from "./icons";

type DescriptionContentProps = {
  item?: ComponentItem;
  showSourceHint?: boolean;
  className?: string;
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-medium uppercase tracking-normal text-foreground/40">
      {children}
    </p>
  );
}

export default function DescriptionContent({
  item,
  showSourceHint = true,
  className,
}: DescriptionContentProps) {
  return (
    <div className={cn("flex flex-col gap-12 text-left", className)}>

      {/* always-visible header */}
      <div className="flex flex-col gap-4">
        <SectionLabel>{item?.name ?? "Component"}</SectionLabel>
        <p className="font-sans text-2xl font-semibold leading-relaxed text-foreground/90">
          {item?.description ?? "This component is not available yet."}
        </p>
      </div>

      {item?.dependencies && item.dependencies.length > 0 && (
        <DocSection label="Dependencies" defaultOpen>
          <div className="flex flex-wrap gap-2">
            {item.dependencies.map((dep) => (
              <DependencyPill key={dep.name} name={dep.name} icon={dep.icon} />
            ))}
          </div>
        </DocSection>
      )}

      {item?.interaction && (
        <DocSection label="Interaction Type" defaultOpen>
          <p className="text-sm leading-relaxed text-foreground/70">
            {item.interaction}
          </p>
        </DocSection>
      )}

      {item?.props && item.props.length > 0 && (
        <DocSection label="Props" defaultOpen>
          <p className="-mt-1 mb-3 text-sm leading-relaxed text-foreground/70">
            Options you can pass to customize this component.
          </p>
          <PropsTable props={item.props} />
        </DocSection>
      )}

      {item?.registry && (
        <DocSection label="Installation" defaultOpen>
          <InstallCommand item={item} />
        </DocSection>
      )}

      {item?.usage && (
        <DocSection label="How to use">
          <PanelCode code={item.usage} className="rounded-lg p-4" />
        </DocSection>
      )}

      {item?.registry && showSourceHint && (
        <DocSection label="Source Code">
          <p className="text-sm leading-relaxed text-foreground/70">
            {PANEL_INFO.sourceHint}
          </p>
        </DocSection>
      )}

      <DocSection label="Keep in mind">
        <p className="text-sm leading-relaxed text-foreground/70">
          {PANEL_INFO.keepInMind}
        </p>
      </DocSection>

      {item?.credits && item.credits.length > 0 && (
        <DocSection label="Credits">
          <ul className="flex flex-col gap-2 text-sm leading-relaxed text-foreground/70">
            {item.credits.map((credit) => (
              <li key={credit} className="flex gap-2">
                <span className="text-foreground/40">•</span>
                <span>{credit}</span>
              </li>
            ))}
          </ul>
        </DocSection>
      )}

      <DocSection label="Contact">
        <div className="flex flex-col gap-3">
          <p className="text-sm leading-relaxed text-foreground/70">
            {PANEL_INFO.contactNote}
          </p>
          <div className="flex items-center gap-2">
            <Tooltip label={PANEL_INFO.contactEmail} align="start">
              <CopyButton
                value={PANEL_INFO.contactEmail}
                label={`Copy email (${PANEL_INFO.contactEmail})`}
                title=""
                idleIcon={<MailIcon />}
                iconClassName="size-5"
                className="size-8 hover:text-foreground"
              />
            </Tooltip>
            <Tooltip label="@amitgajare4">
              <a
                href="https://x.com/amitgajare4"
                target="_blank"
                rel="noreferrer"
                aria-label="X — @amitgajare4"
                className="inline-flex size-8 items-center justify-center text-foreground/60 transition-colors hover:text-foreground"
              >
                <XIcon className="size-5" />
              </a>
            </Tooltip>
          </div>
        </div>
      </DocSection>

      <DocSection label="License & Usage">
        <ul className="flex flex-col gap-2 text-sm leading-relaxed text-foreground/70">
          {PANEL_INFO.license.map((line) => (
            <li key={line} className="flex gap-2">
              <span className="text-foreground/40">•</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </DocSection>

    </div>
  );
}
