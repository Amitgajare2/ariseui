"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { components } from "@/lib/components";
import { cn } from "@/lib/utils";

const GETTING_STARTED = [
  { label: "Home", href: "/" },
  { label: "Introduction", href: "/components/introduction" },
  { label: "Installing", href: "/components/installing" },
] as const;

type DashRowProps = {
  label: string;
  href: string;
  number?: string;
  isActive: boolean;
  isHeader?: boolean;
  onClick?: () => void;
};

function DashRow({
  label,
  href,
  number,
  isActive,
  isHeader,
  onClick,
}: DashRowProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      style={{
        backgroundImage: `linear-gradient(${isActive ? "#00aaff" : "currentColor"}, ${isActive ? "#00aaff" : "currentColor"})`,
        backgroundPosition: "left center",
        backgroundRepeat: "no-repeat",
        backgroundSize: `${isActive ? 56 : 32}px 1px`,
      }}
      className={cn(
        "group relative flex h-[27px] items-center text-base leading-none transition-colors duration-150",
        isActive ? "pl-[68px]" : "pl-11",
        isActive
          ? "text-[#00aaff]"
          : isHeader
            ? "text-foreground/85 dark:text-zinc-100"
            : "text-muted-foreground/75 hover:text-foreground dark:text-zinc-500 dark:hover:text-zinc-200",
      )}
    >
      <span className="truncate font-normal tracking-[-0.015em]">
        {number && (
          <span
            className={cn(
              "mr-1 tabular-nums transition-colors duration-150",
              isActive
                ? "text-[#00aaff]"
                : "text-muted-foreground/75 dark:text-zinc-500",
            )}
          >
            {number}
          </span>
        )}
        {label}
      </span>
    </Link>
  );
}

export default function SidebarContent({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav
      className="relative flex h-full flex-col"
      aria-label="Component navigation"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-sidebar via-sidebar/85 to-transparent dark:from-[#111] dark:via-[#111]/85"
      />

      <div className="no-scrollbar flex flex-col overflow-y-auto px-[10px] pb-24 pt-[7px]">
        <DashRow
          label="Getting Started"
          href="/components/introduction"
          isActive={false}
          isHeader
          onClick={onNavigate}
        />

        {GETTING_STARTED.map(({ label, href }) => (
          <DashRow
            key={href}
            label={label}
            href={href}
            isActive={pathname === href}
            onClick={onNavigate}
          />
        ))}

        <div className="my-2 ml-11 h-px bg-border dark:bg-zinc-800" />

        <DashRow
          label="All Components"
          href="/components"
          isActive={pathname === "/components"}
          isHeader
          onClick={onNavigate}
        />

        {components.map((c, i) => (
          <DashRow
            key={c.href}
            label={c.name}
            href={c.href}
            number={String(i + 1).padStart(2, "0")}
            isActive={pathname === c.href}
            onClick={onNavigate}
          />
        ))}
      </div>
    </nav>
  );
}
