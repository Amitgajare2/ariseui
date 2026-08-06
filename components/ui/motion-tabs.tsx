"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type HTMLMotionProps,
  type Variants,
} from "motion/react";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

export type MotionTabItem = {
  value: string;
  label: string;
  eyebrow: string;
  title: [string, string];
  description: string;
};

export type MotionTabsProps = Omit<HTMLMotionProps<"section">, "onChange"> & {
  items: MotionTabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  surfaceColor?: string;
};

const ease = [0.22, 1, 0.36, 1] as const;

const panelVariants: Variants = {
  enter: { opacity: 0, y: 35, filter: "blur(8px)" },
  center: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease, delay: 0.1 },
  },
  exit: {
    opacity: 0,
    y: -25,
    filter: "blur(6px)",
    transition: { duration: 0.35, ease },
  },
};

export function MotionTabs({
  items,
  value,
  defaultValue,
  onValueChange,
  surfaceColor = "#faf8f3",
  className,
  ...props
}: MotionTabsProps) {
  const id = useId();
  const shouldReduceMotion = useReducedMotion();
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const fallbackValue = defaultValue ?? items[0]?.value ?? "";
  const [internalValue, setInternalValue] = useState(fallbackValue);
  const activeValue = value ?? internalValue;
  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.value === activeValue),
  );
  const activeItem = items[activeIndex];

  const select = (nextValue: string) => {
    if (value === undefined) setInternalValue(nextValue);
    onValueChange?.(nextValue);
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (index + direction + items.length) % items.length;
    buttonRefs.current[nextIndex]?.focus();
    select(items[nextIndex].value);
  };

  if (!activeItem) return null;

  return (
    <motion.section
      data-slot="motion-tabs"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 60, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: shouldReduceMotion ? 0 : 1, ease, delay: 0.15 }}
      className={cn("relative w-full max-w-[940px]", className)}
      {...props}
    >
      <div
        className="relative z-20 flex w-[78%] items-end sm:w-[80%]"
        role="tablist"
        aria-label="Client information"
      >
        {items.map((item, index) => {
          const isActive = index === activeIndex;

          return (
            <motion.button
              key={item.value}
              ref={(node) => {
                buttonRefs.current[index] = node;
              }}
              type="button"
              role="tab"
              id={`${id}-${item.value}-tab`}
              aria-selected={isActive}
              aria-controls={`${id}-${item.value}-panel`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => select(item.value)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              initial={
                shouldReduceMotion ? false : { opacity: 0, y: 24, scaleY: 0.7 }
              }
              animate={{
                opacity: 1,
                y: isActive ? 1 : 12,
                scaleY: 1,
              }}
              whileHover={
                shouldReduceMotion ? undefined : { y: isActive ? 1 : 5 }
              }
              transition={{
                duration: shouldReduceMotion ? 0 : 0.45,
                ease,
                delay: shouldReduceMotion ? 0 : 0.2 + index * 0.1,
              }}
              className="relative h-16 min-w-0 flex-1 origin-bottom rounded-t-[30px] px-2 text-[13px] font-black uppercase tracking-[-0.03em] text-[#111] outline-none focus-visible:ring-2 focus-visible:ring-black/50 sm:h-[88px] sm:rounded-t-[44px] sm:text-lg"
              style={{
                backgroundColor: isActive
                  ? surfaceColor
                  : `color-mix(in srgb, ${surfaceColor} 82%, transparent)`,
              }}
            >
              {item.label}
              <motion.span
                aria-hidden
                initial={false}
                animate={{ scaleX: isActive ? 1 : 0 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease }}
                className="absolute inset-x-[14%] bottom-2.5 h-0.5 origin-center rounded-full bg-[#111] sm:bottom-[18px]"
              />
            </motion.button>
          );
        })}
      </div>

      <motion.div
        whileHover={shouldReduceMotion ? undefined : { y: -4 }}
        transition={{ duration: 0.7, ease }}
        className="relative z-10 -mt-px h-[470px] overflow-hidden rounded-[0_24px_24px_24px] shadow-[0_25px_65px_rgba(0,0,0,0.16)] sm:h-[660px] sm:rounded-[0_28px_28px_28px]"
        style={{ backgroundColor: surfaceColor }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.article
            key={activeItem.value}
            id={`${id}-${activeItem.value}-panel`}
            role="tabpanel"
            aria-labelledby={`${id}-${activeItem.value}-tab`}
            variants={shouldReduceMotion ? undefined : panelVariants}
            initial={shouldReduceMotion ? false : "enter"}
            animate="center"
            exit="exit"
            className="absolute inset-0 flex items-center justify-center p-7 text-center text-[#111] sm:p-[50px]"
          >
            <div>
              <motion.p
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  ease,
                  delay: shouldReduceMotion ? 0 : 0.1,
                }}
                className="mb-5 text-[11px] font-bold uppercase tracking-[0.3em] text-black/40 sm:text-xs"
              >
                {activeItem.eyebrow}
              </motion.p>

              <h2 className="text-[clamp(55px,10vw,108px)] font-black uppercase leading-[0.8] tracking-[-0.075em]">
                {activeItem.title.map((line, index) => (
                  <span key={line} className="block overflow-hidden">
                    <motion.span
                      className="block"
                      initial={shouldReduceMotion ? false : { y: "115%" }}
                      animate={{ y: 0 }}
                      transition={{
                        duration: shouldReduceMotion ? 0 : 0.75,
                        ease,
                        delay: shouldReduceMotion ? 0 : 0.15 + index * 0.09,
                      }}
                    >
                      {line}
                    </motion.span>
                  </span>
                ))}
              </h2>

              <motion.p
                initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  ease,
                  delay: shouldReduceMotion ? 0 : 0.4,
                }}
                className="mt-8 text-xs font-black uppercase tracking-[-0.045em] sm:mt-10 sm:text-xl"
              >
                {activeItem.description}
              </motion.p>
            </div>
          </motion.article>
        </AnimatePresence>

        <div
          className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 sm:bottom-7"
          aria-hidden
        >
          {items.map((item, index) => (
            <motion.span
              key={item.value}
              animate={{
                width: index === activeIndex ? 32 : 6,
                backgroundColor:
                  index === activeIndex ? "#000000" : "rgba(0,0,0,0.2)",
              }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease }}
              className="h-1.5 rounded-full"
            />
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
}
