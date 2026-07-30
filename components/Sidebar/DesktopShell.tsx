"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { isDocPage } from "@/lib/components";
import Sidebar from "./Sidebar";
import { DescriptionPanel } from "../Description/DescriptionPanel";
import ThemeToggle from "../ThemeToggle";
import Tooltip from "../Tooltip";

const NAV_SPACE = 308;
const INFO_SPACE = 576;

export default function DesktopShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const docPage = isDocPage(pathname);
  const [navOpen, setNavOpen] = useState(true);
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <div className="relative h-full">
      <Sidebar open={navOpen} setOpen={setNavOpen} />
      {docPage ? (
        <div className="pointer-events-none absolute right-0 top-0 z-40 h-full">
          <div className="pointer-events-auto absolute top-4 right-4 z-50 flex items-center gap-2 rounded-2xl border-apple bg-muted p-2 shadow-sm">
            <Tooltip label="Toggle theme" align="end">
              <ThemeToggle className="rounded-full p-1 bg-popover" />
            </Tooltip>
          </div>
        </div>
      ) : (
        <DescriptionPanel open={infoOpen} setOpen={setInfoOpen} />
      )}

      <motion.div
        initial={false}
        animate={{
          paddingLeft: navOpen ? NAV_SPACE : 0,
          paddingRight: infoOpen ? INFO_SPACE : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="h-full"
      >
        <div
          className="relative z-0 h-full rounded-[45px] bg-card p-4"
          style={{ cornerShape: "squircle" } as React.CSSProperties}
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
}
