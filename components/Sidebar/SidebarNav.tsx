"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Introduction", href: "/components/introduction" },
  { label: "Installing", href: "/components/installing" },
] as const;

export default function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 pl-6">
      {NAV_ITEMS.map(({ label, href }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={label}
            href={href}
            onClick={onNavigate}
            className={cn(
              "rounded-lg p-1 text-sm transition-colors duration-200",
              isActive ? "text-foreground" : "text-foreground/50 hover:text-foreground",
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
