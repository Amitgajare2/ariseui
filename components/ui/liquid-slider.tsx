"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentProps,
} from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { cn } from "@/lib/utils";

// ─── constants ───────────────────────────────────────────────────────────────

const TRACK_SPRING = { stiffness: 380, damping: 32, mass: 1 } as const;
const BLOB_SPRING  = { stiffness: 180, damping: 18, mass: 1 } as const;
const THUMB_SPRING = { stiffness: 420, damping: 36, mass: 1 } as const;

const THUMB_R     = 11;   // px — thumb radius
const TRACK_H     = 6;    // px — track height
const BLOB_MAX_W  = 38;   // px — max blob width at rest after release
const BLOB_MAX_H  = 22;   // px — max blob height at rest after release
const STRETCH     = 0.35; // how much the blob width grows while dragging

// ─── types ───────────────────────────────────────────────────────────────────

export type LiquidSliderProps = Omit<
  ComponentProps<"div">,
  "onChange" | "defaultValue"
> & {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  color?: string;
  disabled?: boolean;
  onChange?: (value: number) => void;
  showValue?: boolean;
};

// ─── helpers ─────────────────────────────────────────────────────────────────

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

function snap(n: number, step: number, min: number, max: number) {
  const snapped = Math.round((n - min) / step) * step + min;
  return clamp(+snapped.toFixed(10), min, max);
}

// ─── component ───────────────────────────────────────────────────────────────

export function LiquidSlider({
  value,
  defaultValue = 50,
  min = 0,
  max = 100,
  step = 1,
  color = "#F75001",
  disabled = false,
  onChange,
  showValue = true,
  className,
  ...props
}: LiquidSliderProps) {
  const isControlled   = value !== undefined;
  const reduceMotion   = useReducedMotion();
  const trackRef       = useRef<HTMLDivElement>(null);
  const [internal, setInternal] = useState(() => snap(defaultValue, step, min, max));
  const current = isControlled ? clamp(value!, min, max) : internal;

  const pct = (current - min) / (max - min);

  // dragging state
  const [dragging, setDragging] = useState(false);
  const dragStartX    = useRef(0);
  const dragStartPct  = useRef(0);

  // ── motion values ──────────────────────────────────────────────────────────

  // animated fill percentage (0–1)
  const fillPct   = useMotionValue(pct);
  const fillPctSp = useSpring(fillPct, TRACK_SPRING);

  // thumb x position (px from left edge of track)
  const thumbX    = useMotionValue(0);          // set in layout effect
  const thumbXSp  = useSpring(thumbX, THUMB_SPRING);

  // blob dimensions
  const blobW     = useMotionValue(0);
  const blobH     = useMotionValue(0);
  const blobWSp   = useSpring(blobW, BLOB_SPRING);
  const blobHSp   = useSpring(blobH, BLOB_SPRING);

  // blob vertical offset — rises above track while dragging
  const blobY     = useMotionValue(0);
  const blobYSp   = useSpring(blobY, BLOB_SPRING);

  // value label opacity
  const labelOpacity = useMotionValue(0);
  const labelOpacitySp = useSpring(labelOpacity, { stiffness: 260, damping: 28 });

  // derived: fill width from left
  const fillWidth = useTransform(fillPctSp, (p) => {
    const el = trackRef.current;
    if (!el) return "0%";
    return `${p * 100}%`;
  });

  // ── sync motion values when value changes ──────────────────────────────────

  const syncThumb = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const trackW = el.offsetWidth;
    thumbX.set(pct * trackW);
    fillPct.set(pct);
  }, [pct, thumbX, fillPct]);

  useLayoutEffect(() => {
    syncThumb();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, min, max]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const ro = new ResizeObserver(syncThumb);
    ro.observe(el);
    return () => ro.disconnect();
  }, [syncThumb]);

  // ── drag enter / leave blob animation ─────────────────────────────────────

  const startBlob = useCallback(() => {
    if (reduceMotion || disabled) return;
    blobW.set(BLOB_MAX_W * (1 + STRETCH));
    blobH.set(BLOB_MAX_H * 0.7);
    blobY.set(-(THUMB_R + BLOB_MAX_H * 0.5 + 2));
    labelOpacity.set(1);
  }, [reduceMotion, disabled, blobW, blobH, blobY, labelOpacity]);

  const stretchBlob = useCallback((velocity: number) => {
    if (reduceMotion || disabled) return;
    const stretch = clamp(Math.abs(velocity) * STRETCH * 0.012, 0, STRETCH);
    blobW.set(BLOB_MAX_W * (1 + stretch));
    blobH.set(BLOB_MAX_H * (1 - stretch * 0.4));
  }, [reduceMotion, disabled, blobW, blobH]);

  const releaseBlob = useCallback(() => {
    if (reduceMotion || disabled) return;
    blobW.set(BLOB_MAX_W);
    blobH.set(BLOB_MAX_H);
    blobY.set(-(THUMB_R + BLOB_MAX_H * 0.5 + 2));
  }, [reduceMotion, disabled, blobW, blobH, blobY]);

  const hideBlob = useCallback(() => {
    blobW.set(0);
    blobH.set(0);
    blobY.set(0);
    labelOpacity.set(0);
  }, [blobW, blobH, blobY, labelOpacity]);

  // ── value computation from pointer position ────────────────────────────────

  const pctFromClientX = useCallback((clientX: number) => {
    const el = trackRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    return clamp((clientX - rect.left) / rect.width, 0, 1);
  }, []);

  const commitPct = useCallback((p: number) => {
    const raw = p * (max - min) + min;
    const snapped = snap(raw, step, min, max);
    if (!isControlled) setInternal(snapped);
    onChange?.(snapped);
    const newPct = (snapped - min) / (max - min);
    fillPct.set(newPct);
    const el = trackRef.current;
    if (el) thumbX.set(newPct * el.offsetWidth);
  }, [max, min, step, isControlled, onChange, fillPct, thumbX]);

  // ── pointer handlers ───────────────────────────────────────────────────────

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (disabled) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStartX.current   = e.clientX;
    dragStartPct.current = pctFromClientX(e.clientX);
    setDragging(true);
    startBlob();
    commitPct(pctFromClientX(e.clientX));
  }, [disabled, pctFromClientX, startBlob, commitPct]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging || disabled) return;
    const p = pctFromClientX(e.clientX);
    const velocity = e.movementX;
    stretchBlob(velocity);
    commitPct(p);
  }, [dragging, disabled, pctFromClientX, stretchBlob, commitPct]);

  const handlePointerUp = useCallback(() => {
    if (!dragging) return;
    setDragging(false);
    releaseBlob();
    setTimeout(hideBlob, 600);
  }, [dragging, releaseBlob, hideBlob]);

  // keyboard
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (disabled) return;
    const stepMap: Record<string, number> = {
      ArrowRight: step,
      ArrowUp: step,
      ArrowLeft: -step,
      ArrowDown: -step,
      PageUp: step * 10,
      PageDown: -step * 10,
      Home: min - current,
      End: max - current,
    };
    const delta = stepMap[e.key];
    if (delta === undefined) return;
    e.preventDefault();
    const next = snap(current + delta, step, min, max);
    if (!isControlled) setInternal(next);
    onChange?.(next);
    const newPct = (next - min) / (max - min);
    fillPct.set(newPct);
    const el = trackRef.current;
    if (el) thumbX.set(newPct * el.offsetWidth);
  }, [disabled, step, min, max, current, isControlled, onChange, fillPct, thumbX]);

  // ── label ──────────────────────────────────────────────────────────────────

  const displayValue = Number.isInteger(step)
    ? Math.round(current)
    : +current.toFixed(2);

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <div
      data-slot="liquid-slider"
      data-disabled={disabled || undefined}
      data-dragging={dragging || undefined}
      className={cn(
        "group relative flex w-full select-none items-center",
        disabled && "opacity-40 cursor-not-allowed",
        className,
      )}
      style={{ height: THUMB_R * 2 + 24 }}
      {...props}
    >
      {/* ── track ── */}
      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={cn(
          "relative flex w-full cursor-pointer items-center rounded-full",
          disabled && "cursor-not-allowed",
        )}
        style={{ height: TRACK_H }}
        role="presentation"
      >
        {/* unfilled track */}
        <div
          className="absolute inset-0 rounded-full bg-foreground/10"
          style={{ height: TRACK_H }}
        />

        {/* filled track */}
        <motion.div
          className="absolute left-0 top-0 rounded-full"
          style={{
            height: TRACK_H,
            width: fillWidth,
            backgroundColor: color,
          }}
        />

        {/* ── thumb ── */}
        <motion.div
          tabIndex={disabled ? -1 : 0}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={current}
          aria-disabled={disabled}
          onKeyDown={handleKeyDown}
          style={{
            x: thumbXSp,
            translateX: "-50%",
            width:  THUMB_R * 2,
            height: THUMB_R * 2,
            backgroundColor: color,
            top: "50%",
            translateY: "-50%",
          }}
          whileTap={reduceMotion ? undefined : { scale: 0.88 }}
          className={cn(
            "absolute left-0 rounded-full shadow-md outline-none",
            "ring-0 focus-visible:ring-2 focus-visible:ring-offset-2",
            "transition-shadow duration-150",
            !disabled && "cursor-grab active:cursor-grabbing",
          )}
        >
          {/* ── fluid blob ── */}
          {!reduceMotion && (
            <motion.div
              aria-hidden
              style={{
                width:  blobWSp,
                height: blobHSp,
                y:      blobYSp,
                x:      "-50%",
                left:   "50%",
                backgroundColor: color,
                borderRadius: "50%",
                filter: "blur(1px)",
              }}
              className="absolute pointer-events-none"
            />
          )}

          {/* ── goo connector between blob and thumb ── */}
          {!reduceMotion && (
            <motion.div
              aria-hidden
              style={{
                width: THUMB_R * 1.1,
                x: "-50%",
                left: "50%",
                bottom: THUMB_R * 0.8,
                backgroundColor: color,
                filter: "blur(3px)",
                opacity: useTransform(blobHSp, [0, 4], [0, 1]),
                height: useTransform(blobYSp, (y) =>
                  Math.max(0, Math.abs(y) - THUMB_R * 1.2),
                ),
              }}
              className="absolute pointer-events-none"
            />
          )}
        </motion.div>
      </div>

      {/* ── floating value label (inside blob) ── */}
      {showValue && !reduceMotion && (
        <motion.span
          aria-hidden
          style={{
            opacity: labelOpacitySp,
            x: useTransform(thumbXSp, (tx) => {
              const el = trackRef.current;
              if (!el) return tx - THUMB_R;
              return tx - THUMB_R;
            }),
            y: useTransform(blobYSp, (y) => y - 4),
            color: "#fff",
            translateX: "-50%",
            left: THUMB_R,
            fontSize: 10,
            fontWeight: 700,
            lineHeight: 1,
            pointerEvents: "none",
            userSelect: "none",
          }}
          className="absolute top-1/2 whitespace-nowrap tabular-nums"
        >
          {displayValue}
        </motion.span>
      )}
    </div>
  );
}

export default LiquidSlider;
