"use client";

import { useState } from "react";
import LiquidSlider from "@/components/ui/liquid-slider";
import { usePreviewControl } from "@/components/preview/PreviewControls";

const COLORS: Record<string, string> = {
  "#F75001": "#F75001",
  "#1A73F2": "#1A73F2",
  "#34C759": "#34C759",
  "#FF3B30": "#FF3B30",
};

export default function LiquidSliderDemo() {
  const [value, setValue] = useState(40);
  const [color] = usePreviewControl("color", "#F75001");

  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-10 px-12">
      <div className="w-full max-w-sm">
        <LiquidSlider
          value={value}
          onChange={setValue}
          color={color}
          min={0}
          max={100}
          step={1}
        />
      </div>

      <p className="font-mono text-sm tabular-nums text-foreground/40">
        {value}
      </p>
    </div>
  );
}
