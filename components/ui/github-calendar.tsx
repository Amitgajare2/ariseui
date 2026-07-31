"use client";

import { ComponentProps, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export type ContributionDay = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

type ColorScheme =
  | "green"
  | "blue"
  | "purple"
  | "orange"
  | "pink"
  | "dracula"
  | "halloween";

const COLOR_SCHEMES: Record<ColorScheme, [string, string, string, string, string]> = {
  green: ["#151b23", "#033a16", "#196c2e", "#2ea043", "#56d364"],
  blue: ["#151b23", "#0a3069", "#0969da", "#218bff", "#79c0ff"],
  purple: ["#151b23", "#3c1361", "#6639ba", "#8957e5", "#d2a8ff"],
  orange: ["#151b23", "#5a1e02", "#9a3412", "#e8590c", "#ffa657"],
  pink: ["#151b23", "#4a102a", "#9e1c5b", "#e5487d", "#ff9bc4"],
  dracula: ["#282a36", "#44475a", "#6272a4", "#bd93f9", "#ff79c6"],
  halloween: ["#1a1a1a", "#4a2c0a", "#8a4a0a", "#ff7518", "#ffb347"],
};

const DAY_LABELS_SUN = ["", "Mon", "", "Wed", "", "Fri", ""];
const DAY_LABELS_MON = ["Mon", "", "Wed", "", "Fri", "", ""];

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const TIME_RANGE_DAYS: Record<"3-months" | "6-months" | "1-year", number> = {
  "3-months": 91,
  "6-months": 182,
  "1-year": 365,
};

export type GithubCalendarProps = Omit<ComponentProps<"div">, "children"> & {
  username: string;
  colorScheme?: ColorScheme;
  colors?: [string, string, string, string, string];
  cellSize?: number;
  cellGap?: number;
  cellShape?: "square" | "circle" | "rounded";
  showTooltip?: boolean;
  showMonthLabels?: boolean;
  showDayLabels?: boolean;
  weekStart?: "sun" | "mon";
  animate?: boolean;
  timeRange?: "3-months" | "6-months" | "1-year";
  onCellClick?: (day: ContributionDay) => void;
};

type Week = (ContributionDay | null)[];

function dayIndex(date: Date, weekStart: "sun" | "mon") {
  const day = date.getDay();
  return weekStart === "mon" ? (day + 6) % 7 : day;
}

function buildWeeks(days: ContributionDay[], weekStart: "sun" | "mon"): Week[] {
  if (days.length === 0) return [];

  const weeks: Week[] = [];
  let currentWeek: Week = [];

  const leadingEmpty = dayIndex(new Date(`${days[0].date}T00:00:00`), weekStart);
  for (let i = 0; i < leadingEmpty; i++) currentWeek.push(null);

  for (const day of days) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) currentWeek.push(null);
    weeks.push(currentWeek);
  }

  return weeks;
}

function buildMonthLabels(weeks: Week[]) {
  const labels: string[] = [];
  let lastMonth = -1;

  for (const week of weeks) {
    const firstDay = week.find((d) => d !== null);
    if (!firstDay) {
      labels.push("");
      continue;
    }
    const month = new Date(`${firstDay.date}T00:00:00`).getMonth();
    if (month !== lastMonth) {
      labels.push(MONTH_NAMES[month]);
      lastMonth = month;
    } else {
      labels.push("");
    }
  }

  return labels;
}

export default function GithubCalendar({
  username,
  colorScheme = "blue",
  colors,
  cellSize = 16,
  cellGap = 4,
  cellShape = "circle",
  showTooltip = true,
  showMonthLabels = true,
  showDayLabels = true,
  weekStart = "sun",
  animate = false,
  timeRange = "3-months",
  onCellClick,
  className,
  ...props
}: GithubCalendarProps) {
  const [data, setData] = useState<ContributionDay[] | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState<{ day: ContributionDay; x: number; y: number } | null>(null);

  const palette = colors ?? COLOR_SCHEMES[colorScheme];

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    setMounted(false);

    fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch contributions");
        return res.json();
      })
      .then((json: { contributions: ContributionDay[] }) => {
        setData(json.contributions ?? []);
        setStatus("ready");
        requestAnimationFrame(() => setMounted(true));
      })
      .catch((err) => {
        if (err.name !== "AbortError") setStatus("error");
      });

    return () => controller.abort();
  }, [username]);

  const filtered = useMemo(() => {
    if (!data) return [];
    const days = TIME_RANGE_DAYS[timeRange];
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return data.filter((d) => new Date(`${d.date}T00:00:00`) >= cutoff);
  }, [data, timeRange]);

  const weeks = useMemo(() => buildWeeks(filtered, weekStart), [filtered, weekStart]);
  const monthLabels = useMemo(() => buildMonthLabels(weeks), [weeks]);
  const dayLabels = weekStart === "mon" ? DAY_LABELS_MON : DAY_LABELS_SUN;

  const roundedClass =
    cellShape === "circle"
      ? "rounded-full"
      : cellShape === "rounded"
        ? "rounded-[4px]"
        : "rounded-none";

  if (status === "error") {
    return (
      <div
        data-slot="github-calendar"
        className={cn(
          "flex items-center justify-center rounded-xl border border-black/10 p-8 text-sm text-black/50 dark:border-white/10 dark:text-white/40",
          className
        )}
        {...props}
      >
        Couldn&apos;t load contributions for &ldquo;{username}&rdquo;.
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div
        data-slot="github-calendar"
        className={cn(
          "animate-pulse rounded-xl border border-black/10 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/[0.02]",
          className
        )}
        style={{ height: cellSize * 7 + cellGap * 6 + 40 }}
        {...props}
      />
    );
  }

  return (
    <div
      data-slot="github-calendar"
      className={cn(
        "relative w-full max-w-full overflow-hidden rounded-xl border border-black/10 p-4 dark:border-white/10",
        className
      )}
      {...props}
    >
      <div className="flex min-w-0 gap-2">
        {showDayLabels && (
          <div
            className="hidden sm:flex flex-col text-[10px] text-black/40 dark:text-white/40"
            style={{ gap: cellGap, marginTop: showMonthLabels ? 18 : 0 }}
          >
            {dayLabels.map((label, i) => (
              <div key={i} style={{ height: cellSize, lineHeight: `${cellSize}px` }}>
                {label}
              </div>
            ))}
          </div>
        )}

        <div className="flex min-w-0 flex-col overflow-x-auto">
          {showMonthLabels && (
            <div
              className="mb-1 flex text-[10px] text-black/40 dark:text-white/40 whitespace-nowrap"
              style={{ gap: cellGap }}
            >
              {monthLabels.map((label, i) => (
                <div key={i} style={{ width: cellSize }}>
                  {label}
                </div>
              ))}
            </div>
          )}

          <div className="flex" style={{ gap: cellGap }}>
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col" style={{ gap: cellGap }}>
                {week.map((day, di) => {
                  const globalIndex = wi * 7 + di;
                  if (!day) {
                    return (
                      <div key={di} style={{ width: cellSize, height: cellSize }} />
                    );
                  }
                  return (
                    <div
                      key={di}
                      data-slot="github-calendar-cell"
                      className={cn(
                        "cursor-pointer transition-transform duration-300 ease-out",
                        roundedClass,
                        day.level === 0 && "ring-1 ring-inset ring-black/10 dark:ring-white/10"
                      )}
                      style={{
                        width: cellSize,
                        height: cellSize,
                        backgroundColor: palette[day.level],
                        transform: animate ? (mounted ? "scale(1)" : "scale(0)") : undefined,
                        transitionDelay: animate ? `${globalIndex * 2}ms` : undefined,
                      }}
                      onClick={() => onCellClick?.(day)}
                      onMouseEnter={(e) => {
                        if (!showTooltip) return;
                        const rect = e.currentTarget.getBoundingClientRect();
                        const parentRect = e.currentTarget.closest('[data-slot="github-calendar"]')!.getBoundingClientRect();
                        setHovered({
                          day,
                          x: rect.left - parentRect.left + cellSize / 2,
                          y: rect.top - parentRect.top,
                        });
                      }}
                      onMouseLeave={() => setHovered(null)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {showTooltip && hovered && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md bg-neutral-900 px-2 py-1 text-[11px] text-white shadow-lg dark:bg-white dark:text-neutral-900"
          style={{ left: hovered.x, top: hovered.y - 8 }}
        >
          {hovered.day.count} contribution{hovered.day.count === 1 ? "" : "s"} on{" "}
          {new Date(`${hovered.day.date}T00:00:00`).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      )}
    </div>
  );
}
