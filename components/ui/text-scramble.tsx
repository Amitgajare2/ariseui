"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const DEFAULT_CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}<>?/";

type TextScrambleTrigger = "mount" | "hover" | "in-view" | "manual";
type RevealDirection = "left" | "right" | "center";

export type TextScrambleProps = Omit<
  React.ComponentPropsWithoutRef<"span">,
  "children"
> & {
  children: string;
  trigger?: TextScrambleTrigger;
  play?: boolean;
  once?: boolean;
  duration?: number;
  delay?: number;
  speed?: number;
  characters?: string;
  revealDirection?: RevealDirection;
  onScrambleStart?: () => void;
  onScrambleComplete?: () => void;
};

type ScrambleConfig = {
  text: string;
  duration: number;
  delay: number;
  speed: number;
  characters: string;
  revealDirection: RevealDirection;
  once: boolean;
  reducedMotion: boolean | null;
  onStart?: () => void;
  onComplete?: () => void;
};

function getRevealOrder(text: string[], direction: RevealDirection) {
  const indices = text.flatMap((character, index) =>
    /\s/u.test(character) ? [] : [index],
  );

  if (direction === "right") return indices.reverse();

  if (direction === "center") {
    const center = (text.length - 1) / 2;

    return indices.sort(
      (a, b) => Math.abs(a - center) - Math.abs(b - center),
    );
  }

  return indices;
}

function getRandomCharacter(characters: string[]) {
  if (characters.length === 0) return "";

  return characters[Math.floor(Math.random() * characters.length)] ?? "";
}

const TextScramble = React.forwardRef<HTMLSpanElement, TextScrambleProps>(
  (
    {
      children,
      trigger = "mount",
      play = false,
      once,
      duration = 900,
      delay = 0,
      speed = 32,
      characters = DEFAULT_CHARACTERS,
      revealDirection = "left",
      onScrambleStart,
      onScrambleComplete,
      className,
      onPointerEnter,
      onFocus,
      ...props
    },
    forwardedRef,
  ) => {
    const prefersReducedMotion = useReducedMotion();
    const rootRef = React.useRef<HTMLSpanElement | null>(null);
    const valueRef = React.useRef<HTMLSpanElement | null>(null);
    const frameRef = React.useRef<number | null>(null);
    const delayRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const isRunningRef = React.useRef(false);
    const hasPlayedRef = React.useRef(false);
    const [isScrambling, setIsScrambling] = React.useState(false);

    const playOnce = once ?? trigger === "in-view";

    const configRef = React.useRef<ScrambleConfig>({
      text: children,
      duration,
      delay,
      speed,
      characters,
      revealDirection,
      once: playOnce,
      reducedMotion: prefersReducedMotion,
      onStart: onScrambleStart,
      onComplete: onScrambleComplete,
    });

    configRef.current = {
      text: children,
      duration,
      delay,
      speed,
      characters,
      revealDirection,
      once: playOnce,
      reducedMotion: prefersReducedMotion,
      onStart: onScrambleStart,
      onComplete: onScrambleComplete,
    };

    const setRefs = React.useCallback(
      (node: HTMLSpanElement | null) => {
        rootRef.current = node;

        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [forwardedRef],
    );

    const setVisibleText = React.useCallback((value: string) => {
      if (valueRef.current) valueRef.current.textContent = value;
    }, []);

    const cancelScramble = React.useCallback(
      (restoreText = false) => {
        if (frameRef.current !== null) {
          cancelAnimationFrame(frameRef.current);
          frameRef.current = null;
        }

        if (delayRef.current !== null) {
          clearTimeout(delayRef.current);
          delayRef.current = null;
        }

        isRunningRef.current = false;
        setIsScrambling(false);

        if (restoreText) setVisibleText(configRef.current.text);
      },
      [setVisibleText],
    );

    const startScramble = React.useCallback(() => {
      const config = configRef.current;

      if (isRunningRef.current) return;
      if (config.once && hasPlayedRef.current) return;

      const target = Array.from(config.text);
      const characterPool = Array.from(config.characters || DEFAULT_CHARACTERS);
      const revealOrder = getRevealOrder(target, config.revealDirection);
      const safeDuration = Math.max(0, config.duration);
      const safeDelay = Math.max(0, config.delay);
      const safeSpeed = Math.max(16, config.speed);

      isRunningRef.current = true;
      hasPlayedRef.current = true;

      const begin = () => {
        delayRef.current = null;
        config.onStart?.();

        if (
          config.reducedMotion ||
          target.length === 0 ||
          revealOrder.length === 0 ||
          safeDuration === 0
        ) {
          setVisibleText(config.text);
          isRunningRef.current = false;
          setIsScrambling(false);
          config.onComplete?.();
          return;
        }

        setIsScrambling(true);

        const startedAt = performance.now();
        let previousFrameAt = 0;

        const renderFrame = (now: number) => {
          const elapsed = now - startedAt;
          const progress = Math.min(elapsed / safeDuration, 1);

          if (now - previousFrameAt >= safeSpeed || progress === 1) {
            const revealCount = Math.floor(progress * revealOrder.length);
            const revealed = new Set(revealOrder.slice(0, revealCount));

            const frame = target
              .map((character, index) => {
                if (/\s/u.test(character) || revealed.has(index)) {
                  return character;
                }

                return getRandomCharacter(characterPool);
              })
              .join("");

            setVisibleText(progress === 1 ? config.text : frame);
            previousFrameAt = now;
          }

          if (progress < 1) {
            frameRef.current = requestAnimationFrame(renderFrame);
            return;
          }

          frameRef.current = null;
          isRunningRef.current = false;
          setIsScrambling(false);
          config.onComplete?.();
        };

        frameRef.current = requestAnimationFrame(renderFrame);
      };

      if (safeDelay > 0) {
        delayRef.current = setTimeout(begin, safeDelay);
      } else {
        begin();
      }
    }, [setVisibleText]);

    React.useEffect(() => {
      cancelScramble();
      hasPlayedRef.current = false;
      setVisibleText(children);
    }, [children, cancelScramble, setVisibleText]);

    React.useEffect(() => {
      if (trigger === "mount") startScramble();
    }, [children, trigger, startScramble]);

    React.useEffect(() => {
      if (trigger !== "manual") return;

      if (play) {
        startScramble();
      } else {
        cancelScramble(true);
      }
    }, [children, play, trigger, cancelScramble, startScramble]);

    React.useEffect(() => {
      if (trigger !== "in-view") return;

      const element = rootRef.current;
      if (!element) return;

      if (!("IntersectionObserver" in window)) {
        startScramble();
        return;
      }

      let wasVisible = false;

      const observer = new IntersectionObserver(
        ([entry]) => {
          const isVisible = entry?.isIntersecting ?? false;

          if (isVisible && !wasVisible) {
            startScramble();

            if (playOnce) observer.disconnect();
          }

          wasVisible = isVisible;
        },
        {
          threshold: 0.2,
          rootMargin: "0px 0px -10% 0px",
        },
      );

      observer.observe(element);

      return () => observer.disconnect();
    }, [children, playOnce, trigger, startScramble]);

    React.useEffect(
      () => () => {
        if (frameRef.current !== null) {
          cancelAnimationFrame(frameRef.current);
        }

        if (delayRef.current !== null) {
          clearTimeout(delayRef.current);
        }
      },
      [],
    );

    return (
      <span
        ref={setRefs}
        {...props}
        data-slot="text-scramble"
        data-state={isScrambling ? "scrambling" : "idle"}
        className={cn(
          "relative inline-block max-w-full whitespace-pre-wrap break-words align-middle",
          className,
        )}
        onPointerEnter={(event) => {
          onPointerEnter?.(event);

          if (!event.defaultPrevented && trigger === "hover") {
            startScramble();
          }
        }}
        onFocus={(event) => {
          onFocus?.(event);

          if (!event.defaultPrevented && trigger === "hover") {
            startScramble();
          }
        }}
      >
        <span aria-hidden="true" className="invisible">
          {children}
        </span>

        <span
          ref={valueRef}
          aria-hidden="true"
          data-slot="text-scramble-value"
          className="absolute inset-0"
        >
          {children}
        </span>

        <span className="sr-only">{children}</span>
      </span>
    );
  },
);

TextScramble.displayName = "TextScramble";

export { TextScramble };
export default TextScramble;
