"use client";

import { useIsMobile } from "@/lib/use-media-query";
import OptionWheel from "@/components/ui/option-wheel";

export default function Demo() {
  const isMobile = useIsMobile();
  const wheelFontSize = isMobile ? 2.1 : 2.4;
  const wheelInset = isMobile ? 28 : 48;
  const wheelHeight = isMobile ? "h-[340px]" : "h-[420px] sm:h-[460px] md:h-[520px]";
  const containerHeight = isMobile ? "h-[520px]" : "h-[600px] sm:h-[640px] md:h-[680px]";

  return (
    <div className="mx-auto max-w-5xl pt-8 px-4 sm:pt-12">

      <div className={`relative ${containerHeight} w-full overflow-hidden rounded-2xl border bg-background flex flex-col items-center justify-center py-6 sm:py-8 md:py-10`}>
    
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.1),transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_70%)]" />
        
        <div className="relative z-10 w-full max-w-3xl px-4 py-4 sm:px-6 md:px-8">
          <OptionWheel
            items={[
              "Ambient",
              "House",
              "Techno",
              "Jazz",
              "Lo-Fi",
              "Synthwave",
              "Trance",
              "Funk",
              "Disco",
              "Hip-Hop",
              "Chillwave",
              "Drum & Bass",
            ]}
            side="left"
            fontSize={wheelFontSize}
            inset={wheelInset}
            activeColor="#3b82f6"
            onChange={(index, item) => console.log(`Selected ${item} at index ${index}`)}
            className={`${wheelHeight} w-full`}
          />
        </div>


      </div>
    </div>
  );
}