"use client";

import { ComponentProps, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type SpotlightCardProps = ComponentProps<"div"> & {
  spotlightColor?: string;
  spotlightSize?: number;
  border?: boolean;
  background?: string;
};

export default function SpotlightCard({
  children,
  className,
  spotlightColor = "rgba(255, 255, 255, 0.1)",
  spotlightSize = 300,
  border = true,
  background,
  style,
  ...props
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <div
      ref={ref}
      data-slot="spotlight-card"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative overflow-hidden rounded-xl",
        border && "border border-black/10 dark:border-white/10",
        className
      )}
      style={{ background, ...style }}
      {...props}
    >
      <div
        data-slot="spotlight-card-glow"
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 ease-out"
        style={{
          opacity,
          background: `radial-gradient(${spotlightSize}px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`,
        }}
      />
      <div data-slot="spotlight-card-content" className="relative">
        {children}
      </div>
    </div>
  );
}
