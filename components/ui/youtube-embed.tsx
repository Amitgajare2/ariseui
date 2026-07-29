"use client";

import { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type YoutubeEmbedProps = Omit<
  ComponentProps<"div">,
  "children" | "rel"
> & {
  videoId: string;
  autoPlay?: boolean;
  mute?: boolean;
  controls?: boolean;
  loop?: boolean;
  modestBranding?: boolean;
  rel?: boolean;
  aspectRatio?: string;
  mask?: boolean;
  iframeClassName?: string;
};

export default function YoutubeEmbed({
  videoId,
  autoPlay = true,
  mute = true,
  controls = false,
  loop = true,
  modestBranding = true,
  rel = false,
  aspectRatio = "16 / 9",
  mask = true,
  className,
  iframeClassName,
  ...props
}: YoutubeEmbedProps) {
  const src = new URL(`https://www.youtube.com/embed/${videoId}`);

  src.searchParams.set("autoplay", autoPlay ? "1" : "0");
  src.searchParams.set("mute", mute ? "1" : "0");
  src.searchParams.set("controls", controls ? "1" : "0");
  src.searchParams.set("modestbranding", modestBranding ? "1" : "0");
  src.searchParams.set("rel", rel ? "1" : "0");

  if (loop) {
    src.searchParams.set("loop", "1");
    src.searchParams.set("playlist", videoId);
  }

  return (
    <div
      data-slot="youtube-embed"
      className={cn(
        "relative w-full overflow-hidden rounded-xl border border-black/10 dark:border-white/10",
        className
      )}
      style={{
        aspectRatio,
        ...(mask && {
          maskImage:
            "radial-gradient(ellipse 80% 50% at 80% 0%, #000 70%, transparent 110%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 80% at 50% 0%, #000 70%, transparent 110%)",
        }),
      }}
      {...props}
    >
      <iframe
        data-slot="youtube-embed-frame"
        src={src.toString()}
        title="YouTube video"
        className={cn(
          "absolute inset-0 h-full w-full pointer-events-none",
          iframeClassName
        )}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}