"use client"

import {
  ComponentProps,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { cn } from "@/lib/utils"

/**
 * "0" = off / eraser
 * "1" | "2" | "3" = increasing draw intensity
 */
export type PatternCell = "0" | "1" | "2" | "3"

export type LightBoardFont = "default"

export interface LightBoardColors {
  background?: string
  textDim?: string
  textBright?: string
  drawLine?: string
}

export type LightBoardProps = Omit<ComponentProps<"div">, "color"> & {
  text?: string
  rows?: number
  gap?: number
  lightSize?: number
  font?: LightBoardFont
  updateInterval?: number
  disableDrawing?: boolean
  colors?: LightBoardColors
  controlledDrawState?: PatternCell
  onDrawStateChange?: (state: PatternCell) => void
  controlledHoverState?: boolean
  onHoverStateChange?: (state: boolean) => void
}

const DEFAULT_COLORS: Required<LightBoardColors> = {
  background: "#0a0a0a",
  textDim: "#2a2a2a",
  textBright: "#ffffff",
  drawLine: "#7dd3fc",
}

const DRAW_OPACITY: Record<PatternCell, number> = {
  "0": 0,
  "1": 0.45,
  "2": 0.72,
  "3": 1,
}

const CHAR_HEIGHT = 7

// 5x7 dot-matrix font. "#" = lit pixel, "." = unlit.
const FONT_5X7: Record<string, string[]> = {
  " ": [".....", ".....", ".....", ".....", ".....", ".....", "....."],
  A: [".###.", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],
  B: ["####.", "#...#", "#...#", "####.", "#...#", "#...#", "####."],
  C: [".####", "#....", "#....", "#....", "#....", "#....", ".####"],
  D: ["####.", "#...#", "#...#", "#...#", "#...#", "#...#", "####."],
  E: ["#####", "#....", "#....", "####.", "#....", "#....", "#####"],
  F: ["#####", "#....", "#....", "####.", "#....", "#....", "#...."],
  G: [".####", "#....", "#....", "#..##", "#...#", "#...#", ".####"],
  H: ["#...#", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],
  I: ["#####", "..#..", "..#..", "..#..", "..#..", "..#..", "#####"],
  J: ["..###", "...#.", "...#.", "...#.", "#..#.", "#..#.", ".##.."],
  K: ["#...#", "#..#.", "#.#..", "##...", "#.#..", "#..#.", "#...#"],
  L: ["#....", "#....", "#....", "#....", "#....", "#....", "#####"],
  M: ["#...#", "##.##", "#.#.#", "#...#", "#...#", "#...#", "#...#"],
  N: ["#...#", "##..#", "#.#.#", "#..##", "#...#", "#...#", "#...#"],
  O: [".###.", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."],
  P: ["####.", "#...#", "#...#", "####.", "#....", "#....", "#...."],
  Q: [".###.", "#...#", "#...#", "#...#", "#.#.#", "#..#.", ".##.#"],
  R: ["####.", "#...#", "#...#", "####.", "#.#..", "#..#.", "#...#"],
  S: [".####", "#....", "#....", ".###.", "....#", "....#", "####."],
  T: ["#####", "..#..", "..#..", "..#..", "..#..", "..#..", "..#.."],
  U: ["#...#", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."],
  V: ["#...#", "#...#", "#...#", "#...#", "#...#", ".#.#.", "..#.."],
  W: ["#...#", "#...#", "#...#", "#.#.#", "#.#.#", "##.##", "#...#"],
  X: ["#...#", "#...#", ".#.#.", "..#..", ".#.#.", "#...#", "#...#"],
  Y: ["#...#", "#...#", ".#.#.", "..#..", "..#..", "..#..", "..#.."],
  Z: ["#####", "....#", "...#.", "..#..", ".#...", "#....", "#####"],
  "0": [".###.", "#...#", "#..##", "#.#.#", "##..#", "#...#", ".###."],
  "1": ["..#..", ".##..", "..#..", "..#..", "..#..", "..#..", ".###."],
  "2": [".###.", "#...#", "....#", "...#.", "..#..", ".#...", "#####"],
  "3": ["####.", "....#", "....#", ".###.", "....#", "....#", "####."],
  "4": ["...#.", "..##.", ".#.#.", "#..#.", "#####", "...#.", "...#."],
  "5": ["#####", "#....", "####.", "....#", "....#", "#...#", ".###."],
  "6": ["..##.", ".#...", "#....", "####.", "#...#", "#...#", ".###."],
  "7": ["#####", "....#", "...#.", "..#..", ".#...", ".#...", ".#..."],
  "8": [".###.", "#...#", "#...#", ".###.", "#...#", "#...#", ".###."],
  "9": [".###.", "#...#", "#...#", ".####", "....#", "...#.", ".##.."],
  "!": ["..#..", "..#..", "..#..", "..#..", "..#..", ".....", "..#.."],
  "?": [".###.", "#...#", "....#", "...#.", "..#..", ".....", "..#.."],
  ".": [".....", ".....", ".....", ".....", ".....", ".....", "..#.."],
  ",": [".....", ".....", ".....", ".....", ".....", "..#..", ".#..."],
  "'": ["..#..", "..#..", ".....", ".....", ".....", ".....", "....."],
  "-": [".....", ".....", ".....", "#####", ".....", ".....", "....."],
}

function buildMessageColumns(text: string): boolean[][] {
  const chars = text.toUpperCase().split("")
  const columns: boolean[][] = []

  for (const char of chars) {
    const glyph = FONT_5X7[char] ?? FONT_5X7[" "]
    const width = glyph[0].length
    for (let c = 0; c < width; c++) {
      const col: boolean[] = []
      for (let r = 0; r < CHAR_HEIGHT; r++) {
        col.push(glyph[r][c] === "#")
      }
      columns.push(col)
    }
    // inter-character spacing
    columns.push(new Array(CHAR_HEIGHT).fill(false))
  }

  return columns
}

function makeGrid(rows: number, cols: number): PatternCell[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => "0" as PatternCell)
  )
}

function resizeGrid(
  grid: PatternCell[][],
  rows: number,
  cols: number
): PatternCell[][] {
  const next = makeGrid(rows, cols)
  for (let r = 0; r < Math.min(rows, grid.length); r++) {
    for (let c = 0; c < Math.min(cols, grid[r]?.length ?? 0); c++) {
      next[r][c] = grid[r][c]
    }
  }
  return next
}

export function LightBoard({
  text = "",
  rows = 10,
  gap = 2,
  lightSize = 5,
  font = "default",
  updateInterval = 150,
  disableDrawing = true,
  colors,
  controlledDrawState,
  onDrawStateChange,
  controlledHoverState,
  onHoverStateChange,
  className,
  ...props
}: LightBoardProps) {
  const mergedColors = { ...DEFAULT_COLORS, ...colors }
  const pitch = lightSize + gap

  const containerRef = useRef<HTMLDivElement>(null)
  const [cols, setCols] = useState(24)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const measure = () => {
      const width = el.clientWidth
      const next = Math.max(1, Math.floor((width + gap) / pitch))
      setCols(next)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [gap, pitch])

  const [internalHover, setInternalHover] = useState(false)
  const hoverActive = controlledHoverState ?? internalHover
  const setHoverActive = useCallback(
    (value: boolean) => {
      if (controlledHoverState === undefined) setInternalHover(value)
      onHoverStateChange?.(value)
    },
    [controlledHoverState, onHoverStateChange]
  )

  const drawPen: PatternCell = controlledDrawState ?? "1"

  const [drawGrid, setDrawGrid] = useState<PatternCell[][]>(() =>
    makeGrid(rows, cols)
  )
  useEffect(() => {
    setDrawGrid((prev) => resizeGrid(prev, rows, cols))
  }, [rows, cols])

  const messageColumns = useMemo(() => buildMessageColumns(text), [text])
  const loopLength = messageColumns.length + cols

  const [offset, setOffset] = useState(0)
  useEffect(() => {
    if (!text || hoverActive || loopLength === 0) return
    const id = setInterval(() => {
      setOffset((prev) => (prev + 1) % loopLength)
    }, updateInterval)
    return () => clearInterval(id)
  }, [text, hoverActive, updateInterval, loopLength])

  const textBand = Math.floor((rows - CHAR_HEIGHT) / 2)

  const isPointerDownRef = useRef(false)

  const paintCell = useCallback(
    (r: number, c: number) => {
      if (disableDrawing) return
      setDrawGrid((prev) => {
        if (prev[r]?.[c] === drawPen) return prev
        const next = prev.map((row) => row.slice())
        next[r][c] = drawPen
        return next
      })
    },
    [disableDrawing, drawPen]
  )

  const handlePointerDown = (r: number, c: number) => {
    if (disableDrawing) return
    isPointerDownRef.current = true
    paintCell(r, c)
  }

  const handlePointerEnter = (r: number, c: number) => {
    if (disableDrawing) return
    if (isPointerDownRef.current || hoverActive) {
      paintCell(r, c)
    }
  }

  useEffect(() => {
    const clear = () => {
      isPointerDownRef.current = false
    }
    window.addEventListener("pointerup", clear)
    window.addEventListener("pointercancel", clear)
    return () => {
      window.removeEventListener("pointerup", clear)
      window.removeEventListener("pointercancel", clear)
    }
  }, [])

  const cells = useMemo(() => {
    const grid: { bright: boolean; drawn: PatternCell }[][] = []
    for (let r = 0; r < rows; r++) {
      const row: { bright: boolean; drawn: PatternCell }[] = []
      const fontRow = r - textBand
      for (let c = 0; c < cols; c++) {
        let bright = false
        if (text && fontRow >= 0 && fontRow < CHAR_HEIGHT) {
          const msgIndex = (offset + c) % loopLength
          const col = messageColumns[msgIndex]
          bright = col ? col[fontRow] : false
        }
        row.push({ bright, drawn: drawGrid[r]?.[c] ?? "0" })
      }
      grid.push(row)
    }
    return grid
  }, [rows, cols, text, textBand, offset, loopLength, messageColumns, drawGrid])

  return (
    <div
      data-slot="lightboard"
      ref={containerRef}
      className={cn(
        "w-full select-none touch-none overflow-hidden rounded-md",
        className
      )}
      style={{ backgroundColor: mergedColors.background, padding: gap }}
      onPointerEnter={() => setHoverActive(true)}
      onPointerLeave={() => {
        setHoverActive(false)
        isPointerDownRef.current = false
      }}
      {...props}
    >
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${lightSize}px)`,
          gridAutoRows: `${lightSize}px`,
          gap,
        }}
      >
        {cells.map((row, r) =>
          row.map((cell, c) => {
            const drawLevel = DRAW_OPACITY[cell.drawn]
            const baseColor = cell.bright
              ? mergedColors.textBright
              : mergedColors.textDim

            return (
              <div
                key={`${r}-${c}`}
                onPointerDown={() => handlePointerDown(r, c)}
                onPointerEnter={() => handlePointerEnter(r, c)}
                className={cn(
                  "rounded-full transition-[opacity,background-color] duration-100",
                  !disableDrawing && "cursor-crosshair"
                )}
                style={{
                  backgroundColor: drawLevel > 0 ? mergedColors.drawLine : baseColor,
                  opacity: drawLevel > 0 ? drawLevel : 1,
                }}
              />
            )
          })
        )}
      </div>
    </div>
  )
}

export default LightBoard