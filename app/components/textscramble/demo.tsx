"use client";

import { TextScramble } from "@/components/ui/text-scramble";

export default function TextScrambleDemo() {
  return (
    <div className="flex min-h-105 items-center justify-center rounded-3xl border bg-background px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <div className="w-full max-w-4xl text-center">
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground sm:mb-5 sm:text-xs">
          Arise UI / Text effect
        </p>

        <h1 className="mx-auto max-w-3xl text-balance text-4xl font-semibold leading-[0.95] tracking-[-0.045em] sm:text-5xl md:text-6xl lg:text-8xl">
          <TextScramble
            trigger="in-view"
            duration={1.1}
            speed={0.028}
          >
            Built to stand out.
          </TextScramble>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-pretty text-sm text-muted-foreground sm:mt-6 sm:text-base lg:text-lg">
          Random characters resolve into the final heading without shifting the layout.
        </p>
      </div>
    </div>
  );
}
