"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export type Contribution = {
  date: string;
  count: number;
  level: ContributionLevel;
};

export type RepoContribution = {
  name: string;
  count: number;
  href?: string;
};

type ColorScheme = "green" | "blue" | "purple" | "orange" | "pink" | "dracula" | "halloween";

// Same palette set as the standalone github-calendar component, so both
// live comfortably side by side in the same product without clashing.
const COLOR_SCHEMES: Record<ColorScheme, [string, string, string, string, string]> = {
  green: ["#151b23", "#033a16", "#196c2e", "#2ea043", "#56d364"],
  blue: ["#151b23", "#0a3069", "#0969da", "#218bff", "#79c0ff"],
  purple: ["#151b23", "#3c1361", "#6639ba", "#8957e5", "#d2a8ff"],
  orange: ["#151b23", "#5a1e02", "#9a3412", "#e8590c", "#ffa657"],
  pink: ["#151b23", "#4a102a", "#9e1c5b", "#e5487d", "#ff9bc4"],
  dracula: ["#282a36", "#44475a", "#6272a4", "#bd93f9", "#ff79c6"],
  halloween: ["#1a1a1a", "#4a2c0a", "#8a4a0a", "#ff7518", "#ffb347"],
};

const CALENDAR_API = "https://github-contributions-api.jogruber.de/v4";
const EVENTS_API = "https://api.github.com/users";
const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const WEEKS_PER_MONTH = 365.25 / 12 / 7;

type ApiDay = { date: string; count: number; level: number };
type PushEvent = { type: string; repo?: { name: string }; payload?: { commits?: unknown[] } };

async function fetchCalendar(login: string): Promise<Contribution[] | null> {
  const res = await fetch(`${CALENDAR_API}/${login}?y=last`);
  if (!res.ok) return null;
  const days: ApiDay[] = (await res.json())?.contributions ?? [];
  if (!days.length) return null;
  const start = days.findIndex((d) => new Date(`${d.date}T00:00:00Z`).getUTCDay() === 0);
  return days.slice(Math.max(start, 0)).map((d) => ({
    date: d.date,
    count: d.count,
    level: Math.min(4, Math.max(0, d.level)) as ContributionLevel,
  }));
}

async function fetchRepos(login: string): Promise<RepoContribution[]> {
  const res = await fetch(`${EVENTS_API}/${login}/events/public?per_page=100`);
  if (!res.ok) return [];
  const events: PushEvent[] = await res.json();
  const counts = new Map<string, number>();
  for (const e of events) {
    if (e.type !== "PushEvent" || !e.repo) continue;
    const commits = e.payload?.commits?.length ?? 1;
    counts.set(e.repo.name, (counts.get(e.repo.name) ?? 0) + commits);
  }
  return [...counts.entries()]
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([fullName, count]) => ({
      name: fullName.split("/")[1] ?? fullName,
      count,
      href: `https://github.com/${fullName}`,
    }));
}

function useGithubData(login?: string) {
  const [state, setState] = React.useState<{
    contributions: Contribution[];
    repos: RepoContribution[];
    status: "loading" | "ready" | "error";
  }>({ contributions: [], repos: [], status: "loading" });

  React.useEffect(() => {
    if (!login) return;
    let active = true;
    setState((s) => ({ ...s, status: "loading" }));

    Promise.all([fetchCalendar(login), fetchRepos(login)])
      .then(([contributions, repos]) => {
        if (!active) return;
        if (!contributions) {
          setState({ contributions: [], repos: [], status: "error" });
          return;
        }
        setState({ contributions, repos, status: "ready" });
      })
      .catch(() => active && setState({ contributions: [], repos: [], status: "error" }));

    return () => {
      active = false;
    };
  }, [login]);

  return state;
}

function toWeeks(days: Contribution[]) {
  const weeks: Contribution[][] = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
  return weeks;
}

function monthLabels(weeks: Contribution[][]) {
  const labels: string[] = [];
  let last = -1;
  for (const week of weeks) {
    const first = week[0];
    if (!first) {
      labels.push("");
      continue;
    }
    const month = new Date(`${first.date}T00:00:00`).getMonth();
    labels.push(month !== last ? MONTH_NAMES[month] : "");
    last = month;
  }
  return labels;
}

export type GithubActivityCardProps = React.ComponentProps<"div"> & {
  username: string;
  colorScheme?: ColorScheme;
  cellSize?: number;
  months?: number;
  showMonthLabels?: boolean;
  showRepos?: boolean;
  defaultReposOpen?: boolean;
};

export default function GithubActivityCard({
  username,
  colorScheme = "green",
  cellSize = 11,
  months = 12,
  showMonthLabels = true,
  showRepos = true,
  defaultReposOpen = false,
  className,
  ...props
}: GithubActivityCardProps) {
  const { contributions, repos, status } = useGithubData(username);
  const [reposOpen, setReposOpen] = React.useState(defaultReposOpen);
  const palette = COLOR_SCHEMES[colorScheme];
  const gap = Math.max(2, Math.round(cellSize / 4));

  const weeks = React.useMemo(() => {
    const all = toWeeks(contributions);
    const cap = Math.max(1, Math.ceil(months * WEEKS_PER_MONTH));
    return all.slice(-cap);
  }, [contributions, months]);

  const labels = React.useMemo(() => monthLabels(weeks), [weeks]);
  const total = React.useMemo(() => contributions.reduce((s, d) => s + d.count, 0), [contributions]);
  const year = contributions.at(-1)?.date.slice(0, 4);

  if (status === "error") {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-2xl border border-white/10 bg-neutral-950 p-8 text-sm text-white/40",
          className
        )}
        {...props}
      >
        Couldn&apos;t load activity for &ldquo;{username}&rdquo;.
      </div>
    );
  }

  return (
    <div
      data-slot="github-activity-card"
      className={cn(
        "w-full rounded-2xl border border-white/10 bg-neutral-950 p-4 sm:w-fit sm:p-5",
        className
      )}
      {...props}
    >
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <div>
          <p className="text-sm font-medium text-white">
            {status === "loading" ? "Loading activity…" : `${total} contributions`}
          </p>
          <p className="text-xs text-white/40">
            @{username}
            {year ? ` · ${year}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-white/30">Less</span>
          {[0, 1, 2, 3, 4].map((lvl) => (
            <span
              key={lvl}
              className="size-2 rounded-[2px]"
              style={{ backgroundColor: palette[lvl] }}
            />
          ))}
          <span className="text-[10px] text-white/30">More</span>
        </div>
      </div>

      {status === "loading" ? (
        <div
          className="animate-pulse rounded-lg bg-white/5"
          style={{ width: weeks.length * (cellSize + gap), height: 7 * (cellSize + gap) }}
        />
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-0" style={{ width: "max-content" }}>
            {showMonthLabels && (
              <div className="mb-1 flex" style={{ gap }}>
                {labels.map((label, i) => (
                  <div key={i} className="text-[10px] text-white/35" style={{ width: cellSize }}>
                    {label}
                  </div>
                ))}
              </div>
            )}
            <div className="flex" style={{ gap }}>
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col" style={{ gap }}>
                  {Array.from({ length: 7 }, (_, di) => week[di]).map((day, di) => (
                    <div
                      key={di}
                      className="rounded-[3px] transition-transform duration-150 hover:scale-125"
                      style={{
                        width: cellSize,
                        height: cellSize,
                        backgroundColor: day ? palette[day.level] : "transparent",
                      }}
                      title={day ? `${day.count} contributions on ${day.date}` : undefined}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showRepos && repos.length > 0 && (
        <div className="mt-5 border-t border-white/10 pt-3">
          <button
            type="button"
            onClick={() => setReposOpen((v) => !v)}
            className="flex w-full items-center justify-between text-xs font-medium text-white/60 hover:text-white/90"
          >
            Most active repositories
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className={cn("size-3.5 transition-transform", reposOpen && "rotate-180")}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {reposOpen && (
            <ul className="mt-2 space-y-1">
              {repos.map((repo) => (
                <li key={repo.name}>
                  <a
                    href={repo.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-lg px-2 py-1.5 text-xs text-white/70 hover:bg-white/5"
                  >
                    <span className="truncate">{repo.name}</span>
                    <span className="tabular-nums text-white/40">{repo.count}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
