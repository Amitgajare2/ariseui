"use client";

import {
  AppWindow,
  Folder,
  Mail,
  MessageCircle,
  Music2,
  Settings,
  SquareTerminal,
  Trash2,
} from "lucide-react";

import {
  MagneticDock,
  MagneticDockItem,
} from "@/components/ui/magnetic-dock";

const apps = [
  { label: "Apps", icon: AppWindow, active: true },
  { label: "Files", icon: Folder },
  { label: "Mail", icon: Mail },
  { label: "Messages", icon: MessageCircle },
  { label: "Music", icon: Music2 },
  { label: "Terminal", icon: SquareTerminal },
  { label: "Settings", icon: Settings },
];

export default function MagneticDockDemo() {
  return (
    <div className="relative flex min-h-130 items-end justify-center overflow-hidden rounded-3xl border bg-[radial-gradient(circle_at_50%_20%,rgba(252,214,1,0.18),transparent_28%),linear-gradient(to_bottom,#171717,#050505)] px-6 pb-12">
      <div className="absolute inset-x-0 top-0 p-8 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-white/45">
          Arise UI / Interaction
        </p>
        <h2 className="mt-4 text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl">
          Magnetic Dock
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/50">
          Icons expand through a smooth spring field as the cursor moves across
          the dock.
        </p>
      </div>

      <MagneticDock
        baseSize={52}
        magnification={82}
        distance={155}
        gap={9}
      >
        {apps.map(({ label, icon: Icon, active }) => (
          <MagneticDockItem key={label} label={label} active={active}>
            <Icon strokeWidth={1.7} />
          </MagneticDockItem>
        ))}

        <div aria-hidden="true" className="mx-0.5 h-10 w-px bg-white/15" />

        <MagneticDockItem label="Trash">
          <Trash2 strokeWidth={1.7} />
        </MagneticDockItem>
      </MagneticDock>
    </div>
  );
}
