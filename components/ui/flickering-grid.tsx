"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type FlickeringGridProps = Omit<
  React.ComponentPropsWithoutRef<"div">,
  "color" | "children"
> & {
  /** Side length of each square in CSS pixels. */
  squareSize?: number;
  /** Space between squares in CSS pixels. */
  gridGap?: number;
  /** Approximate chance per second that a square receives a new opacity. */
  flickerChance?: number;
  /** Any browser-resolvable CSS color, including CSS variables. */
  color?: string;
  /** Fixed canvas width. Uses the container width when omitted. */
  width?: number;
  /** Fixed canvas height. Uses the container height when omitted. */
  height?: number;
  /** Maximum opacity assigned to an individual square. */
  maxOpacity?: number;
  /** Frames rendered per second. Lower values use less CPU. */
  fps?: number;
  /** Maximum device-pixel ratio used by the canvas. */
  pixelRatio?: number;
  /** Pause animation when the user requests reduced motion. */
  respectReducedMotion?: boolean;
};

type GridState = {
  width: number;
  height: number;
  columns: number;
  rows: number;
  opacities: Float32Array;
  dpr: number;
};

const EMPTY_GRID: GridState = {
  width: 0,
  height: 0,
  columns: 0,
  rows: 0,
  opacities: new Float32Array(0),
  dpr: 1,
};

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

function resolveCssColor(color: string, element: HTMLElement) {
  const probe = document.createElement("span");
  probe.style.color = color;
  probe.style.display = "none";
  element.appendChild(probe);

  const resolvedColor = window.getComputedStyle(probe).color;
  probe.remove();

  return resolvedColor || color;
}

const FlickeringGrid = React.forwardRef<HTMLDivElement, FlickeringGridProps>(
  (
    {
      squareSize = 4,
      gridGap = 6,
      flickerChance = 0.3,
      color = "rgb(0 0 0)",
      width,
      height,
      maxOpacity = 0.3,
      fps = 30,
      pixelRatio = 2,
      respectReducedMotion = true,
      className,
      style,
      ...props
    },
    forwardedRef,
  ) => {
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const gridRef = React.useRef<GridState>(EMPTY_GRID);
    const isVisibleRef = React.useRef(true);
    const isDocumentVisibleRef = React.useRef(true);
    const animationFrameRef = React.useRef<number | null>(null);

    const setContainerRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        containerRef.current = node;

        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [forwardedRef],
    );

    const safeSquareSize = Math.max(1, squareSize);
    const safeGridGap = Math.max(0, gridGap);
    const safeFlickerChance = Math.max(0, flickerChance);
    const safeMaxOpacity = clamp(maxOpacity, 0, 1);
    const safeFps = clamp(fps, 1, 120);
    const safePixelRatio = Math.max(1, pixelRatio);

    React.useEffect(() => {
      const container = containerRef.current;
      const canvas = canvasRef.current;

      if (!container || !canvas) return;

      const context = canvas.getContext("2d", { alpha: true });
      if (!context) return;

      let disposed = false;
      let lastFrameTime = 0;
      let lastUpdateTime = 0;
      let reducedMotionQuery: MediaQueryList | null = null;
      let prefersReducedMotion = false;

      const frameInterval = 1000 / safeFps;
      const cellSize = safeSquareSize + safeGridGap;
      const resolvedColor = resolveCssColor(color, container);

      const draw = () => {
        const grid = gridRef.current;

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = resolvedColor;

        for (let column = 0; column < grid.columns; column += 1) {
          const x = column * cellSize;

          for (let row = 0; row < grid.rows; row += 1) {
            const opacity = grid.opacities[column * grid.rows + row];
            if (opacity <= 0) continue;

            context.globalAlpha = opacity;
            context.fillRect(x, row * cellSize, safeSquareSize, safeSquareSize);
          }
        }

        context.globalAlpha = 1;
      };

      const createGrid = () => {
        const nextWidth = Math.max(0, Math.round(width ?? container.clientWidth));
        const nextHeight = Math.max(
          0,
          Math.round(height ?? container.clientHeight),
        );
        const dpr = Math.min(window.devicePixelRatio || 1, safePixelRatio);
        const columns = Math.ceil(nextWidth / cellSize);
        const rows = Math.ceil(nextHeight / cellSize);
        const opacities = new Float32Array(columns * rows);

        for (let index = 0; index < opacities.length; index += 1) {
          opacities[index] = Math.random() * safeMaxOpacity;
        }

        canvas.width = Math.max(1, Math.round(nextWidth * dpr));
        canvas.height = Math.max(1, Math.round(nextHeight * dpr));
        canvas.style.width = `${nextWidth}px`;
        canvas.style.height = `${nextHeight}px`;

        context.setTransform(dpr, 0, 0, dpr, 0, 0);

        gridRef.current = {
          width: nextWidth,
          height: nextHeight,
          columns,
          rows,
          opacities,
          dpr,
        };

        draw();
      };

      const updateGrid = (deltaSeconds: number) => {
        const { opacities } = gridRef.current;
        const probability = clamp(safeFlickerChance * deltaSeconds, 0, 1);

        for (let index = 0; index < opacities.length; index += 1) {
          if (Math.random() < probability) {
            opacities[index] = Math.random() * safeMaxOpacity;
          }
        }
      };

      const shouldAnimate = () =>
        isVisibleRef.current &&
        isDocumentVisibleRef.current &&
        !(respectReducedMotion && prefersReducedMotion);

      const animate = (time: number) => {
        if (disposed) return;

        animationFrameRef.current = window.requestAnimationFrame(animate);

        if (!shouldAnimate()) {
          lastFrameTime = time;
          lastUpdateTime = time;
          return;
        }

        if (time - lastFrameTime < frameInterval) return;

        const deltaSeconds = Math.min(
          Math.max((time - (lastUpdateTime || time)) / 1000, 0),
          0.25,
        );

        lastFrameTime = time;
        lastUpdateTime = time;

        updateGrid(deltaSeconds);
        draw();
      };

      const resizeObserver = new ResizeObserver(createGrid);
      resizeObserver.observe(container);

      const intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          isVisibleRef.current = entry?.isIntersecting ?? true;
        },
        { threshold: 0 },
      );
      intersectionObserver.observe(container);

      const handleVisibilityChange = () => {
        isDocumentVisibleRef.current = document.visibilityState === "visible";
      };
      document.addEventListener("visibilitychange", handleVisibilityChange);

      if (respectReducedMotion) {
        reducedMotionQuery = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        );
        prefersReducedMotion = reducedMotionQuery.matches;

        const handleReducedMotionChange = (event: MediaQueryListEvent) => {
          prefersReducedMotion = event.matches;
          draw();
        };

        reducedMotionQuery.addEventListener(
          "change",
          handleReducedMotionChange,
        );

        createGrid();
        animationFrameRef.current = window.requestAnimationFrame(animate);

        return () => {
          disposed = true;
          resizeObserver.disconnect();
          intersectionObserver.disconnect();
          document.removeEventListener(
            "visibilitychange",
            handleVisibilityChange,
          );
          reducedMotionQuery?.removeEventListener(
            "change",
            handleReducedMotionChange,
          );

          if (animationFrameRef.current !== null) {
            window.cancelAnimationFrame(animationFrameRef.current);
          }
        };
      }

      createGrid();
      animationFrameRef.current = window.requestAnimationFrame(animate);

      return () => {
        disposed = true;
        resizeObserver.disconnect();
        intersectionObserver.disconnect();
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange,
        );

        if (animationFrameRef.current !== null) {
          window.cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, [
      color,
      height,
      respectReducedMotion,
      safeFlickerChance,
      safeFps,
      safeGridGap,
      safeMaxOpacity,
      safePixelRatio,
      safeSquareSize,
      width,
    ]);

    return (
      <div
        ref={setContainerRef}
        data-slot="flickering-grid"
        aria-hidden="true"
        className={cn("relative size-full overflow-hidden", className)}
        style={{
          ...style,
          width: width ?? style?.width,
          height: height ?? style?.height,
        }}
        {...props}
      >
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 block size-full"
        />
      </div>
    );
  },
);

FlickeringGrid.displayName = "FlickeringGrid";

export { FlickeringGrid };
export type { FlickeringGridProps };
