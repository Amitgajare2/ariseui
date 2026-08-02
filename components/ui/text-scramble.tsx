"use client";

import * as React from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

const DEFAULT_CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}<>?/";

type TextScrambleTrigger = "mount" | "hover" | "in-view" | "manual";

export type TextScrambleProps = Omit<HTMLMotionProps<"span">, "children"> & {
  children: string;
  trigger?: TextScrambleTrigger;
  play?: boolean;
  once?: boolean;
  duration?: number;
  speed?: number;
  characters?: string;
  onScrambleComplete?: () => void;
};

const MotionSpan = motion.span;

const TextScramble = React.forwardRef<HTMLSpanElement, TextScrambleProps>(
  (
    {
      children,
      trigger = "mount",
      play = false,
      once,
      duration = 0.8,
      speed = 0.04,
      characters = DEFAULT_CHARACTERS,
      onScrambleComplete,
      className,
      onPointerEnter,
      onFocus,
      ...props
    },
    ref,
  ) => {
    const prefersReducedMotion = useReducedMotion();
    const [displayText, setDisplayText] = React.useState(children);
    const [isScrambling, setIsScrambling] = React.useState(false);
    const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
    const hasPlayedRef = React.useRef(false);
    const rootRef = React.useRef<HTMLSpanElement | null>(null);

    const playOnce = once ?? trigger === "in-view";

    const setRefs = React.useCallback(
      (node: HTMLSpanElement | null) => {
        rootRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    const scramble = React.useCallback(() => {
      if (isScrambling) return;
      if (playOnce && hasPlayedRef.current) return;

      if (prefersReducedMotion) {
        setDisplayText(children);
        onScrambleComplete?.();
        return;
      }

      hasPlayedRef.current = true;
      setIsScrambling(true);

      const steps = duration / speed;
      let step = 0;

      intervalRef.current = setInterval(() => {
        const progress = step / steps;
        let scrambled = "";

        for (let i = 0; i < children.length; i++) {
          if (children[i] === " ") {
            scrambled += " ";
            continue;
          }
          if (progress * children.length > i) {
            scrambled += children[i];
          } else {
            scrambled +=
              characters[Math.floor(Math.random() * characters.length)];
          }
        }

        setDisplayText(scrambled);
        step++;

        if (step > steps) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setDisplayText(children);
          setIsScrambling(false);
          onScrambleComplete?.();
        }
      }, speed * 1000);
    }, [children, characters, duration, speed, isScrambling, playOnce, prefersReducedMotion, onScrambleComplete]);

    React.useEffect(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      hasPlayedRef.current = false;
      setIsScrambling(false);
      setDisplayText(children);
    }, [children]);

    React.useEffect(() => {
      if (trigger === "mount") scramble();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trigger]);

    React.useEffect(() => {
      if (trigger !== "manual") return;
      if (play) scramble();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [play, trigger]);

    React.useEffect(() => {
      if (trigger !== "in-view") return;
      const element = rootRef.current;
      if (!element) return;

      if (!("IntersectionObserver" in window)) {
        scramble();
        return;
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            scramble();
            if (playOnce) observer.disconnect();
          }
        },
        { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
      );

      observer.observe(element);
      return () => observer.disconnect();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trigger, playOnce]);

    React.useEffect(
      () => () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      },
      [],
    );

    return (
      <MotionSpan
        ref={setRefs}
        data-slot="text-scramble"
        data-state={isScrambling ? "scrambling" : "idle"}
        className={cn(className)}
        aria-label={children}
        onPointerEnter={(event) => {
          onPointerEnter?.(event);
          if (!event.defaultPrevented && trigger === "hover") scramble();
        }}
        onFocus={(event) => {
          onFocus?.(event);
          if (!event.defaultPrevented && trigger === "hover") scramble();
        }}
        {...props}
      >
        {displayText}
      </MotionSpan>
    );
  },
);

TextScramble.displayName = "TextScramble";

export { TextScramble };
export default TextScramble;
