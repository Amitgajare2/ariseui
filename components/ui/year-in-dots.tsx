"use client";

import { useCallback, useEffect, useState, type ComponentProps } from "react";
import { cn } from "@/lib/utils";

const COLUMNS = 22;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

type CalendarData = {
  year: number;
  totalDays: number;
  elapsedDays: number;
  daysLeft: number;
};

export type YearInDotsProps = Omit<ComponentProps<"button">, "children"> & {
  elapsedColor?: string;
  remainingColor?: string;
};

function getCalendarData(date = new Date()): CalendarData {
  const year = date.getFullYear();
  const startOfYear = Date.UTC(year, 0, 1);
  const startOfToday = Date.UTC(year, date.getMonth(), date.getDate());
  const startOfNextYear = Date.UTC(year + 1, 0, 1);
  const totalDays = Math.round(
    (startOfNextYear - startOfYear) / MILLISECONDS_PER_DAY,
  );
  const elapsedDays =
    Math.floor((startOfToday - startOfYear) / MILLISECONDS_PER_DAY) + 1;

  return {
    year,
    totalDays,
    elapsedDays,
    daysLeft: totalDays - elapsedDays,
  };
}

export default function YearInDots({
  elapsedColor = "#303033",
  remainingColor = "#f7f7f7",
  className,
  onClick,
  ...props
}: YearInDotsProps) {
  const [calendar, setCalendar] = useState<CalendarData | null>(null);
  const [replayKey, setReplayKey] = useState(0);

  const refreshCalendar = useCallback(() => setCalendar(getCalendarData()), []);

  useEffect(() => {
    refreshCalendar();

    const now = new Date();
    const nextMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      1,
    );
    const timeout = window.setTimeout(
      refreshCalendar,
      nextMidnight.getTime() - now.getTime(),
    );

    return () => window.clearTimeout(timeout);
  }, [refreshCalendar, calendar?.year, calendar?.elapsedDays]);

  const handleClick: ComponentProps<"button">["onClick"] = (event) => {
    setReplayKey((key) => key + 1);
    onClick?.(event);
  };

  const label = calendar
    ? `${calendar.year} year progress. ${calendar.elapsedDays} days reached and ${calendar.daysLeft} days left. Click to replay the animation.`
    : "Year progress calendar. Click to replay the animation.";

  return (
    <button
      type="button"
      data-slot="year-in-dots"
      aria-label={label}
      onClick={handleClick}
      className={cn(
        "year-in-dots-card group relative aspect-[634/660] w-[min(94vw,634px)] cursor-pointer overflow-hidden border-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(255,255,255,0.025),transparent_38%),linear-gradient(150deg,#070707_0%,#000_52%,#050505_100%)] font-mono shadow-[inset_0_1px_0_rgba(255,255,255,0.035),0_8px_20px_rgba(0,0,0,0.08)] outline-none transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [border-radius:clamp(36px,6.5vw,52px)] hover:-translate-y-[5px] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.045),0_20px_42px_rgba(0,0,0,0.14)] active:-translate-y-0.5 active:scale-[0.995] focus-visible:outline-3 focus-visible:outline-offset-8 focus-visible:outline-black/20 sm:w-[min(88vw,634px)]",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className="year-in-dots-shine pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_22%,rgba(255,255,255,0.018)_44%,transparent_65%)]"
      />

      <span
        key={replayKey}
        aria-hidden="true"
        className="absolute top-[19%] left-[11.5%] z-2 grid w-[77%] grid-cols-22 gap-1 sm:top-[19.5%] sm:left-[12%] sm:w-[76%] sm:gap-[clamp(4px,1.05vw,8px)]"
      >
        {calendar &&
          Array.from({ length: calendar.totalDays }, (_, index) => {
            const row = Math.floor(index / COLUMNS);
            const column = index % COLUMNS;
            const delay = 210 + row * 38 + column * 7;
            const elapsed = index < calendar.elapsedDays;
            const boundary = index === calendar.elapsedDays;

            return (
              <span
                key={index}
                className={cn(
                  "year-in-dots-dot aspect-square w-full rounded-full transition-[transform,background-color,box-shadow] duration-300 ease-[cubic-bezier(0.16,1.2,0.3,1)]",
                  elapsed
                    ? "shadow-[inset_0_1px_1px_rgba(255,255,255,0.025)] group-hover:brightness-110"
                    : "shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_0_3px_rgba(255,255,255,0.08)] group-hover:scale-[1.035]",
                  boundary && "year-in-dots-boundary",
                )}
                style={
                  {
                    "--year-dot-delay": `${delay}ms`,
                    backgroundColor: elapsed ? elapsedColor : remainingColor,
                  } as React.CSSProperties
                }
              />
            );
          })}
      </span>

      <span className="absolute right-[8%] bottom-[6%] left-[8%] z-3 flex items-center justify-between text-[clamp(14px,2.4vw,20px)] font-normal tracking-[-0.025em] text-white/90 sm:bottom-[5.7%]">
        <span className="year-in-dots-footer [animation-delay:850ms]">
          {calendar?.year ?? ""}
        </span>
        <span
          aria-live="polite"
          className="year-in-dots-footer [animation-delay:950ms]"
        >
          {calendar
            ? `${calendar.daysLeft} ${calendar.daysLeft === 1 ? "day" : "days"} left`
            : "Calculating..."}
        </span>
      </span>

      <style>{`
        @keyframes year-in-dots-card-enter {
          from { opacity: 0; transform: translateY(28px) scale(.97); filter: blur(8px); }
          to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        @keyframes year-in-dots-shine {
          0%, 30% { transform: translateX(-110%); }
          68%, 100% { transform: translateX(110%); }
        }
        @keyframes year-in-dots-dot-enter {
          0% { opacity: 0; transform: scale(.25) translateY(5px); }
          72% { opacity: 1; transform: scale(1.13) translateY(-1px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes year-in-dots-boundary-pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255,255,255,0), 0 0 3px rgba(255,255,255,.08); }
          50% { transform: scale(1.15); box-shadow: 0 0 0 4px rgba(255,255,255,.06), 0 0 10px rgba(255,255,255,.15); }
        }
        @keyframes year-in-dots-footer-enter {
          to { opacity: 1; transform: translateY(0); }
        }
        .year-in-dots-card { animation: year-in-dots-card-enter 900ms 100ms cubic-bezier(.22,1,.36,1) forwards; }
        .year-in-dots-shine { animation: year-in-dots-shine 7s 2s ease-in-out infinite; }
        .year-in-dots-dot { opacity: 0; transform: scale(.25) translateY(5px); animation: year-in-dots-dot-enter 520ms cubic-bezier(.16,1.2,.3,1) forwards; animation-delay: var(--year-dot-delay); }
        .year-in-dots-boundary { animation: year-in-dots-dot-enter 520ms cubic-bezier(.16,1.2,.3,1) forwards, year-in-dots-boundary-pulse 2.8s 1.8s ease-in-out infinite; animation-delay: var(--year-dot-delay), 1.8s; }
        .year-in-dots-footer { opacity: 0; transform: translateY(10px); animation: year-in-dots-footer-enter 650ms cubic-bezier(.22,1,.36,1) forwards; }
        @media (prefers-reduced-motion: reduce) {
          .year-in-dots-card, .year-in-dots-shine, .year-in-dots-dot, .year-in-dots-boundary, .year-in-dots-footer { animation: none; opacity: 1; transform: none; transition-duration: .01ms; }
        }
      `}</style>
    </button>
  );
}
