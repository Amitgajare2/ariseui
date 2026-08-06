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

function DashRow({ label, href, number, isActive, isHeader, onClick }: DashRowProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group flex items-center gap-4 py-[7px] transition-all duration-500",
        isActive
          ? "text-[#fcd601]"
          : isHeader
            ? "text-foreground"
            : "text-foreground/70 dark:text-foreground/40 hover:text-[#fcd601]",
      )}
    >
      <span
        className={cn(
          "block shrink-0 transition-all duration-500",
          isActive
            ? "w-9 h-[2px] bg-[#fcd601]"
            : isHeader
              ? "h-px w-7 bg-foreground/80"
              : "h-px w-7 bg-foreground/40 dark:bg-foreground/20 group-hover:w-10 group-hover:h-[2px] group-hover:bg-[#fcd601]",
        )}
      />
      <span
        className={cn(
          "truncate text-sm leading-none transition-transform duration-500",
          isHeader ? "font-bold" : "font-normal",
          isActive && !isHeader && "font-semibold",
          !isActive && !isHeader && "group-hover:translate-x-0.5",
        )}
      >
        {number && (
          <span
            className={cn(
              "mr-2 tabular-nums transition-colors duration-500",
              isActive ? "text-[#fcd601]" : "opacity-75 dark:opacity-50 group-hover:opacity-100",
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

export default function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav
      className="relative flex h-full flex-col"
      aria-label="Site navigation"
    >
      {/* bottom fade */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent"
      />

      <div className="no-scrollbar flex flex-col overflow-y-auto px-4 pb-16 pt-2">
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

        <div className="my-2 ml-11 h-px bg-foreground/10" />

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
