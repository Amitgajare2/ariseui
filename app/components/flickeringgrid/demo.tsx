import { FlickeringGrid } from "@/components/ui/flickering-grid";

export default function FlickeringGridDemo() {
  return (
    <div className="relative flex h-125 w-full items-center justify-center overflow-hidden rounded-2xl border bg-background">
      <FlickeringGrid
        className="absolute inset-0 z-0 [mask-image:radial-gradient(450px_circle_at_center,white,transparent)]"
        squareSize={4}
        gridGap={6}
        color="var(--foreground)"
        maxOpacity={0.35}
        flickerChance={0.8}
        fps={30}
      />

      <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
          Arise UI
        </p>
        <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
          A living grid for quiet visual depth.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-pretty text-muted-foreground sm:text-lg">
          Canvas-rendered, responsive, motion-aware, and lightweight enough for
          hero sections, cards, and empty states.
        </p>
      </div>
    </div>
  );
}

