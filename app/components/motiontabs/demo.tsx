"use client";

import { MotionTabs, type MotionTabItem } from "@/components/ui/motion-tabs";

const items: MotionTabItem[] = [
  {
    value: "wins",
    label: "Wins",
    eyebrow: "01 / Client Stories",
    title: ["Client", "Wins"],
    description: "Highlighting the top client wins",
  },
  {
    value: "results",
    label: "Results",
    eyebrow: "02 / Proven Impact",
    title: ["Real", "Results"],
    description: "Performance that speaks for itself",
  },
  {
    value: "progress",
    label: "Progress",
    eyebrow: "03 / Moving Forward",
    title: ["Clear", "Progress"],
    description: "Turning momentum into growth",
  },
];

export default function Demo() {
  return (
    <div className="relative flex h-full min-h-[620px] items-center justify-center overflow-hidden rounded-[28px] bg-[#969696] px-4 py-12 sm:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.55),transparent_28%),radial-gradient(circle_at_82%_34%,rgba(255,255,255,0.25),transparent_25%),linear-gradient(135deg,#c7c7c7_0%,#8c8c8c_52%,#b9b9b9_100%)] grayscale" />
      <div className="absolute inset-0 bg-black/15" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.28)_100%)]" />
      <MotionTabs items={items} />
    </div>
  );
}
