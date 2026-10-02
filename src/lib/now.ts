// Live "what I'm building" data, written every few hours by the Action in the
// JiawenZhu/JiawenZhu profile repo (scripts/refresh-profile.mjs). The profile
// README and this site read the same file, so they always agree.

export interface NowRepo {
  name: string;
  url: string;
  description: string;
  homepage: string | null;
  language: string | null;
  languageColor: string | null;
  pushedAt: string;
  stars: number;
  topics: string[];
}

export interface ContributionDay {
  date: string;
  count: number;
}

export interface NowData {
  user: string;
  latest: NowRepo & {
    commit: { message: string; sha: string; url: string; date: string } | null;
    activity: ContributionDay[];
  };
  recent: NowRepo[];
  contributions: {
    total: number;
    currentStreak: number;
    longestStreak: number;
    busiest: ContributionDay;
    weeks: ContributionDay[][];
  };
}

export const NOW_URL =
  import.meta.env.VITE_NOW_JSON_URL ||
  "https://raw.githubusercontent.com/JiawenZhu/JiawenZhu/main/now.json";

let request: Promise<NowData> | null = null;

/** One shared request for every component that needs the live data. */
export function fetchNow(): Promise<NowData> {
  // "no-cache" revalidates with the CDN on every visit (a cheap 304 when nothing
  // changed), so a browser never sits on an old project or a stale error.
  request ??= fetch(NOW_URL, { cache: "no-cache", headers: { Accept: "application/json" } }).then((response) => {
    if (!response.ok) throw new Error(`now.json request failed with status ${response.status}.`);
    return response.json() as Promise<NowData>;
  });
  request.catch(() => {
    request = null;
  });
  return request;
}

const relative = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

export function timeAgo(iso: string, now = Date.now()): string {
  const seconds = (new Date(iso).getTime() - now) / 1000;
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) return relative.format(Math.round(seconds / size), unit);
  }
  return "just now";
}
