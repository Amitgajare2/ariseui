"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

import { cn } from "@/lib/utils";

type DockSpring = {
  mass?: number;
  stiffness?: number;
  damping?: number;
  restDelta?: number;
  restSpeed?: number;
};

type MagneticDockContextValue = {
  cursorX: MotionValue<number>;
  baseSize: number;
  magnification: number;
  distance: number;
  lift: number;
  spring: DockSpring;
  reducedMotion: boolean;
  pointerInsideRef: React.MutableRefObject<boolean>;
};

const MagneticDockContext = React.createContext<MagneticDockContextValue | null>(
  null,
);

function useMagneticDockContext() {
  const context = React.useContext(MagneticDockContext);

  if (!context) {
    throw new Error("MagneticDockItem must be used inside MagneticDock.");
  }

  return context;
}

export type MagneticDockProps = Omit<
  React.ComponentPropsWithoutRef<"nav">,
  "children"
> & {
  children: React.ReactNode;
  baseSize?: number;
  magnification?: number;
  distance?: number;
  lift?: number;
  gap?: number;
  spring?: DockSpring;
};

const MagneticDock = React.forwardRef<HTMLElement, MagneticDockProps>(
  (
    {
      children,
      baseSize = 50,
      magnification = 78,
      distance = 150,
      lift = 18,
      gap = 10,
      spring = { mass: 0.12, stiffness: 220, damping: 18 },
      className,
      style,
      onPointerMove,
      onPointerLeave,
      "aria-label": ariaLabel = "Application dock",
      ...props
    },
    forwardedRef,
  ) => {
    const cursorX = useMotionValue(Number.POSITIVE_INFINITY);
    const prefersReducedMotion = useReducedMotion();
    const pointerInsideRef = React.useRef(false);

    const safeBaseSize = Math.max(24, baseSize);
    const safeMagnification = Math.max(safeBaseSize, magnification);
    const safeDistance = Math.max(1, distance);
    const safeGap = Math.max(0, gap);

    const context = React.useMemo<MagneticDockContextValue>(
      () => ({
        cursorX,
        baseSize: safeBaseSize,
        magnification: safeMagnification,
        distance: safeDistance,
        lift: Math.max(0, lift),
        spring,
        reducedMotion: Boolean(prefersReducedMotion),
        pointerInsideRef,
      }),
      [
        cursorX,
        lift,
        prefersReducedMotion,
        safeBaseSize,
        safeDistance,
        safeMagnification,
        spring,
      ],
    );

    return (
      <MagneticDockContext.Provider value={context}>
        <nav
          ref={forwardedRef}
          data-slot="magnetic-dock"
          aria-label={ariaLabel}
          className={cn(
            "relative flex w-fit max-w-full items-end rounded-[1.4rem] border border-white/15 bg-black/65 p-2 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.75)] backdrop-blur-2xl",
            className,
          )}
          style={{ gap: safeGap, ...style }}
          onPointerMove={(event) => {
            pointerInsideRef.current = true;

            if (event.pointerType !== "touch") {
              cursorX.set(event.clientX);
            }

            onPointerMove?.(event);
          }}
          onPointerLeave={(event) => {
            pointerInsideRef.current = false;
            cursorX.set(Number.POSITIVE_INFINITY);
            onPointerLeave?.(event);
          }}
          {...props}
        >
          {children}
        </nav>
      </MagneticDockContext.Provider>
    );
  },
);

MagneticDock.displayName = "MagneticDock";

export type MagneticDockItemProps = Omit<
  React.ComponentPropsWithoutRef<"button">,
  "children"
> & {
  children: React.ReactNode;
  label: string;
  href?: string;
  active?: boolean;
  external?: boolean;
  tooltipSide?: "top" | "bottom";
};

const MagneticDockItem = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  MagneticDockItemProps
>(
  (
    {
      children,
      label,
      href,
      active = false,
      external = false,
      tooltipSide = "top",
      className,
      disabled,
      onFocus,
      onBlur,
      onClick,
      type = "button",
      ...props
    },
    forwardedRef,
  ) => {
    const {
      cursorX,
      baseSize,
      magnification,
      distance,
      lift,
      spring,
      reducedMotion,
      pointerInsideRef,
    } = useMagneticDockContext();

    const itemRef = React.useRef<HTMLDivElement | null>(null);
    const tooltipId = React.useId();

    const targetSize = useTransform(() => {
      if (reducedMotion) return baseSize;

      const item = itemRef.current;
      const pointer = cursorX.get();

      if (!item || !Number.isFinite(pointer)) return baseSize;

      const bounds = item.getBoundingClientRect();
      const center = bounds.left + bounds.width / 2;
      const delta = Math.abs(pointer - center);

      if (delta >= distance) return baseSize;

      const proximity = 1 - delta / distance;
      const eased = (1 - Math.cos(proximity * Math.PI)) / 2;

      return baseSize + (magnification - baseSize) * eased;
    });

    const size = useSpring(targetSize, spring);
    const y = useTransform(() => {
      if (reducedMotion || magnification === baseSize) return 0;

      const progress = Math.min(
        1,
        Math.max(0, (size.get() - baseSize) / (magnification - baseSize)),
      );

      return -lift * progress;
    });

    const setControlRef = React.useCallback(
      (node: HTMLButtonElement | HTMLAnchorElement | null) => {
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [forwardedRef],
    );

    const focusItem = React.useCallback(() => {
      const bounds = itemRef.current?.getBoundingClientRect();
      if (bounds) cursorX.set(bounds.left + bounds.width / 2);
    }, [cursorX]);

    const blurItem = React.useCallback(() => {
      if (!pointerInsideRef.current) {
        cursorX.set(Number.POSITIVE_INFINITY);
      }
    }, [cursorX, pointerInsideRef]);

    const sharedProps = {
      ref: setControlRef,
      "aria-label": label,
      "aria-current": active ? ("page" as const) : undefined,
      className: cn(
        "group/control relative flex h-full w-full items-center justify-center overflow-hidden rounded-[28%] border border-white/10 bg-gradient-to-b from-white/20 to-white/5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_8px_20px_-10px_rgba(0,0,0,0.9)] outline-none transition-[filter,background-color] hover:brightness-110 focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black/70 disabled:pointer-events-none disabled:opacity-45",
        disabled && "pointer-events-none opacity-45",
        className,
      ),
      onFocus: (event: React.FocusEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        focusItem();
        onFocus?.(event as React.FocusEvent<HTMLButtonElement>);
      },
      onBlur: (event: React.FocusEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        blurItem();
        onBlur?.(event as React.FocusEvent<HTMLButtonElement>);
      },
      onClick: (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        onClick?.(event as React.MouseEvent<HTMLButtonElement>);
      },
      children: (
        <>
          <span
            aria-hidden="true"
            className="flex h-[54%] w-[54%] items-center justify-center [&_svg]:h-full [&_svg]:w-full"
          >
            {children}
          </span>
        </>
      ),
    };

    return (
      <motion.div
        ref={itemRef}
        data-slot="magnetic-dock-item"
        className="group relative shrink-0"
        style={{ width: size, height: size, y }}
      >
        <span
          id={tooltipId}
          role="tooltip"
          className={cn(
            "pointer-events-none absolute left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-black/85 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-xl backdrop-blur-md transition duration-150 group-hover:opacity-100 group-focus-within:opacity-100",
            tooltipSide === "top"
              ? "bottom-[calc(100%+0.65rem)] translate-y-1 group-hover:translate-y-0 group-focus-within:translate-y-0"
              : "top-[calc(100%+0.65rem)] -translate-y-1 group-hover:translate-y-0 group-focus-within:translate-y-0",
          )}
        >
          {label}
        </span>

        {href ? (
          <a
            {...(props as React.ComponentPropsWithoutRef<"a">)}
            {...sharedProps}
            href={disabled ? undefined : href}
            aria-disabled={disabled || undefined}
            tabIndex={disabled ? -1 : props.tabIndex}
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer" : undefined}
          />
        ) : (
          <button
            {...props}
            {...sharedProps}
            type={type}
            disabled={disabled}
          />
        )}

        {active ? (
          <span
            aria-hidden="true"
            className="absolute -bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]"
          />
        ) : null}
      </motion.div>
    );
  },
);

MagneticDockItem.displayName = "MagneticDockItem";

export { MagneticDock, MagneticDockItem };
