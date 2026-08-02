"use client"

import { LightBoard } from "@/components/ui/lightboard"

export default function LightBoardDemo() {
  return (
    <div className="flex min-h-130 flex-col items-center justify-center gap-6 overflow-hidden rounded-3xl border bg-[radial-gradient(ellipse_at_50%_0%,rgba(125,211,252,0.10),transparent_60%),linear-gradient(to_bottom,#0c0c0f,#050507)] px-6 py-16">
      <div className="w-full max-w-2xl text-center">
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.28em] text-white/35">
          Arise UI / Display
        </p>
        <h2 className="text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
          Light Board
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-white/45">
          A dot-matrix LED board that scrolls any text across a responsive grid of lights.
        </p>
      </div>

      <div className="w-full max-w-2xl space-y-3">
        <LightBoard
          text="ARISE UI — BUILD SOMETHING GREAT —"
          rows={9}
          gap={2}
          lightSize={5}
          updateInterval={120}
          colors={{
            background: "#0d1117",
            textDim: "#1e2a35",
            textBright: "#7dd3fc",
          }}
          className="rounded-xl"
        />

        <LightBoard
          text="HELLO WORLD — OPEN SOURCE COMPONENTS —"
          rows={9}
          gap={2}
          lightSize={5}
          updateInterval={140}
          colors={{
            background: "#0d0d0d",
            textDim: "#1f1f1f",
            textBright: "#f0f0f0",
          }}
          className="rounded-xl"
        />
      </div>
    </div>
  )
}
