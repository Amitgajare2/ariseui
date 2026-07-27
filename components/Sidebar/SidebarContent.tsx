"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { components } from "@/lib/components";
import { cn } from "@/lib/utils";

const GETTING_STARTED = [
  { label: "Home", href: "/" },
  { label: "Introduction", href: "/components/introduction" },
  { label: "Installing",   href: "/components/installing" },
] as const;

// ─── shared primitives ───────────────────────────────────────────────────────

function GroupHeader({
  label,
  open,
  isGroupActive,
  onToggle,
}: {
  label: string;
  open: boolean;
  isGroupActive: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "flex w-full items-center justify-between rounded-lg px-1 py-1.5 text-left transition-colors duration-200",
        isGroupActive ? "text-foreground" : "text-foreground/50 hover:text-foreground",
      )}
    >
      <span className="text-sm font-semibold">{label}</span>
      <motion.span
        initial={false}
        animate={{ rotate: open ? 0 : -90 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="text-foreground/40"
      >
        <ChevronDown className="h-3.5 w-3.5" />
      </motion.span>
    </button>
  );
}

function NavItem({
  label,
  href,
  isActive,
  hasDot,
  onClick,
}: {
  label: string;
  href: string;
  isActive: boolean;
  hasDot?: boolean;
  onClick?: () => void;
}) {
  return (
    <li className="relative flex items-center">
      {hasDot && (
        <span
          aria-hidden
          className="absolute left-0 h-1.5 w-1.5 rounded-full bg-[#fcd601]"
        />
      )}
      <Link
        href={href}
        onClick={onClick}
        className={cn(
          "w-full rounded-lg py-1 pl-4 pr-1 text-sm transition-colors duration-200",
          isActive ? "text-foreground" : "text-foreground/50 hover:text-foreground",
        )}
      >
        {label}
      </Link>
    </li>
  );
}

function CollapsibleGroup({
  label,
  defaultOpen = true,
  isGroupActive,
  children,
}: {
  label: string;
  defaultOpen?: boolean;
  isGroupActive: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="flex flex-col">
      <GroupHeader
        label={label}
        open={open}
        isGroupActive={isGroupActive}
        onToggle={() => setOpen((v) => !v)}
      />
      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-0.5 pb-1 pt-0.5">
              {children}
            </div>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── main export ─────────────────────────────────────────────────────────────

export default function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  const isGettingStartedActive = GETTING_STARTED.some((i) => i.href === pathname);
  const isComponentsActive = components.some((c) => c.href === pathname);

  return (
    <nav className="flex flex-col gap-4 px-2">
      <CollapsibleGroup label="Getting Started" isGroupActive={isGettingStartedActive}>
        {GETTING_STARTED.map(({ label, href }) => (
          <NavItem
            key={href}
            label={label}
            href={href}
            isActive={pathname === href}
            onClick={onNavigate}
          />
        ))}
      </CollapsibleGroup>

      <CollapsibleGroup label="Components" isGroupActive={isComponentsActive}>
        {components.map((c) => {
          const isActive = pathname === c.href;
          return (
            <NavItem
              key={c.href}
              label={c.name}
              href={c.href}
              isActive={isActive}
              hasDot={isActive}
              onClick={onNavigate}
            />
          );
        })}
      </CollapsibleGroup>
    </nav>
  );
}
