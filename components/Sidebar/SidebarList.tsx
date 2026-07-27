"use client";

import { usePathname } from "next/navigation";
import { BounceSidebar } from "@/components/ui/bounce-sidebar";
import { components } from "@/lib/components";

const items = components.map((c) => ({ label: c.name, href: c.href }));

const SidebarList = ({ onNavigate }: { onNavigate?: () => void }) => {
  const pathname = usePathname();
  const matchedIndex = components.findIndex((c) => pathname === c.href);
  // -1 when on a non-component page — dot stays hidden (no matching ref)
  const activeIndex = matchedIndex === -1 ? -1 : matchedIndex;

  return (
    <BounceSidebar
      items={items}
      value={activeIndex}
      onChange={() => onNavigate?.()}
    />
  );
};

export default SidebarList;
