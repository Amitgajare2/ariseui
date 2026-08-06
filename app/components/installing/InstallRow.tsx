"use client";

import { useState } from "react";
import { REGISTRY_REPO, PACKAGE_MANAGERS, type PackageManager } from "@/lib/components";
import { LOGOS } from "@/components/logos";
import CopyButton from "@/components/CopyButton";
import Tooltip from "@/components/Tooltip";
import { cn } from "@/lib/utils";

const ACTIVE_COLOR: Record<PackageManager, string> = {
  npm: "#CB3837",
  pnpm: "#F9AD00",
  yarn: "#38BDF8",
  bun: "#FFFFFF",
};

const PM_EXECUTORS: Record<PackageManager, string> = {
  npm: "npx",
  pnpm: "pnpm dlx",
  yarn: "yarn dlx",
  bun: "bunx --bun",
};

type InstallRowProps = {
  name: string;
  description: string;
  registry: string;
};

export default function InstallRow({ name, description, registry }: InstallRowProps) {
  const [pm, setPm] = useState<PackageManager>("npm");
  const command = `${PM_EXECUTORS[pm]} shadcn add ${REGISTRY_REPO}/${registry}`;

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border/50 bg-muted/40 p-3">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-foreground/80">{name}</span>
        <span className="text-xs leading-relaxed text-foreground/70 dark:text-foreground/50">{description}</span>
      </div>

      <div className="flex items-center gap-1">
        {PACKAGE_MANAGERS.map((manager) => {
          const Logo = LOGOS[manager];
          const active = pm === manager;
          return (
            <button
              key={manager}
              type="button"
              onClick={() => setPm(manager)}
              style={active ? { color: ACTIVE_COLOR[manager] } : undefined}
              className={cn(
                "flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors",
                active ? "bg-background/60" : "text-foreground/60 dark:text-foreground/40 hover:text-foreground/70",
              )}
            >
              <Logo className="size-3" />
              {manager}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 rounded-lg bg-background/50 p-2 pl-3">
        <code className="flex-1 truncate font-mono text-xs text-foreground/70">
          {command}
        </code>
        <Tooltip label="Copy" align="end">
          <CopyButton value={command} title="" />
        </Tooltip>
      </div>
    </div>
  );
}
