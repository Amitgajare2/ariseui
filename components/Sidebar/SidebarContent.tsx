"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { components } from "@/lib/components";
import { cn } from "@/lib/utils";
import { label } from "motion/react-client";

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
        "group flex items-center gap-4 py-[7px] transition-colors duration-150",
        isActive
          ? "text-[#38bdf8]"
          : isHeader
            ? "text-foreground"
            : "text-foreground/40 hover:text-foreground/70",
      )}
    >
      <span
        className={cn(
          "block h-px w-7 shrink-0 transition-colors duration-150",
          isActive
            ? "bg-[#38bdf8]"
            : isHeader
              ? "bg-foreground/70"
              : "bg-foreground/20 group-hover:bg-foreground/40",
        )}
      />
      <span className={cn("truncate text-sm leading-none", isHeader ? "font-bold" : "font-normal")}>
        {number && (
          <span className={cn("mr-2 tabular-nums", isActive ? "text-[#38bdf8]" : "opacity-50")}>
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
