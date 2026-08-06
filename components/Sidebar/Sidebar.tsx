"use client";

import { motion } from "motion/react";
import { Squircle } from "@squircle-js/react";
import SidebarContent from "./SidebarContent";
import { ClosedIcon, OpenIcon } from "./icons";

const PANEL_SHIFT = 340;

const Sidebar = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className="pointer-events-none absolute left-0 top-0 z-40 h-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close sidebar" : "Open sidebar"}
        className="pointer-events-auto absolute top-4 left-4 z-50 cursor-pointer rounded-lg bg-popover p-2"
      >
        {open ? <OpenIcon /> : <ClosedIcon />}
      </button>

      <Squircle asChild cornerRadius={23} cornerSmoothing={1}>
        <motion.div
          initial={false}
          animate={{ x: open ? 0 : -PANEL_SHIFT }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="no-scrollbar pointer-events-auto flex h-full w-75 flex-col overflow-y-auto bg-[#111] pb-8 pt-20"
        >
          <SidebarContent />
        </motion.div>
      </Squircle>
    </div>
  );
};

export default Sidebar;
