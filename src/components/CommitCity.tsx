import { useMemo, useRef, useState } from "react";
import { useInView } from "framer-motion";
import type { ContributionDay, NowData } from "../lib/now";
import { useNowData } from "../lib/useNowData";

const TILE = 22;
const HW = TILE / 2;
const HH = TILE / 4;
const MAX_HEIGHT = 92;

// Matches levelThresholds() in the profile repo's refresh script, so the city
// here and the one in the README are coloured the same way.
function levelThresholds(counts: number[]) {
  const active = counts.filter(Boolean).sort((a, b) => a - b);
  const q = (p: number) => active[Math.floor((active.length - 1) * p)] ?? 0;
  return [q(0.25), q(0.5), q(0.75)];
}

const LEVEL_FILL = ["var(--sky-pale)", "var(--green)", "var(--blue)", "var(--yellow)", "var(--red)"];

const formatDay = (date: string) =>
  new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

const pts = (arr: Array<[number, number]>) => arr.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

type Tower = {
  day: ContributionDay;
  week: number;
  level: number;
  order: number;
  top: string;
  left: string;
  right: string;
};

function buildCity(weeks: ContributionDay[][]): Tower[] {
  const counts = weeks.flat().map((d) => d.count);
  const max = Math.max(1, ...counts);
  const thresholds = levelThresholds(counts);

  return weeks
    .flatMap((week, x) =>
      week.map((day) => {
        const y = new Date(`${day.date}T12:00:00Z`).getUTCDay();
        const level = day.count ? 1 + thresholds.filter((t) => day.count > t).length : 0;
        const h = day.count ? 7 + Math.sqrt(day.count / max) * (MAX_HEIGHT - 8) : 3;
        const sx = (x - y) * HW;
        const sy = (x + y) * HH;
        return {
          day,
          week: x,
          level,
          order: x + y,
          top: pts([[sx, sy - h], [sx + HW, sy + HH - h], [sx, sy + 2 * HH - h], [sx - HW, sy + HH - h]]),
          left: pts([[sx - HW, sy + HH - h], [sx, sy + 2 * HH - h], [sx, sy + 2 * HH], [sx - HW, sy + HH]]),
          right: pts([[sx, sy + 2 * HH - h], [sx + HW, sy + HH - h], [sx + HW, sy + HH], [sx, sy + 2 * HH]]),
        };
      }),
    )
    .sort((a, b) => a.order - b.order);
}

export function CommitCity() {
  const state = useNowData();

  return (
    <section id="city" className="section container" aria-labelledby="city-heading">
      <div className="city-card">
        {state.status === "ready" ? (
          <CityContents data={state.data} />
        ) : (
          <div className="city-intro">
            <h2 id="city-heading">My commit city</h2>
            <p className="city-sub">
              {state.status === "loading"
                ? "Laying the blocks…"
                : "The city didn't load this time. My contribution graph lives on GitHub in the meantime."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function CityContents({ data }: { data: NowData }) {
  const { contributions } = data;
  const towers = useMemo(() => buildCity(contributions.weeks), [contributions.weeks]);
  const [hovered, setHovered] = useState<ContributionDay | null>(null);
  const cityRef = useRef<SVGSVGElement>(null);
  const built = useInView(cityRef, { once: true, margin: "-120px" });

  const viewBox = useMemo(() => {
    const coords = towers.flatMap((t) => `${t.top} ${t.left} ${t.right}`.split(" ").map((p) => p.split(",").map(Number)));
    const xs = coords.map(([x]) => x);
    const ys = coords.map(([, y]) => y);
    const [minX, minY] = [Math.min(...xs) - 4, Math.min(...ys) - 12];
    return `${minX} ${minY} ${Math.max(...xs) + 4 - minX} ${Math.max(...ys) + 4 - minY}`;
  }, [towers]);
  const shown = hovered ?? contributions.busiest;

  return (
    <>
      <div className="city-intro">
        <h2 id="city-heading">My commit city</h2>
        <p className="city-sub">
          Every block is one day of my GitHub activity over the past year. Taller blocks, busier days. Hover a block
          to see its day.
        </p>

        <dl className="city-stats">
          <div>
            <dt>contributions this year</dt>
            <dd>{contributions.total.toLocaleString("en-US")}</dd>
          </div>
          <div>
            <dt>current streak</dt>
            <dd>
              {contributions.currentStreak} {contributions.currentStreak === 1 ? "day" : "days"}
            </dd>
          </div>
          <div>
            <dt>longest streak</dt>
            <dd>{contributions.longestStreak} days</dd>
          </div>
        </dl>
      </div>

      <figure className="city-figure">
        <svg
          ref={cityRef}
          className={`city-svg${built ? " built" : ""}`}
          viewBox={viewBox}
          role="img"
          aria-label={`Isometric city of ${contributions.total} contributions, one block per day.`}
          onPointerLeave={() => setHovered(null)}
        >
          {towers.map((t) => (
            <g
              key={t.day.date}
              className={`city-block${hovered?.date === t.day.date ? " hovered" : ""}`}
              style={{ ["--d" as string]: `${t.week * 22}ms` }}
              onPointerEnter={() => setHovered(t.day)}
            >
              <polygon points={t.left} fill={LEVEL_FILL[t.level]} className="face-left" />
              <polygon points={t.right} fill={LEVEL_FILL[t.level]} className="face-right" />
              <polygon points={t.top} fill={LEVEL_FILL[t.level]} />
            </g>
          ))}
        </svg>
        <figcaption className="city-caption" aria-live="polite">
          <strong>{formatDay(shown.date)}</strong>
          <span>
            {shown.count} {shown.count === 1 ? "contribution" : "contributions"}
            {!hovered && shown.count > 0 ? ", my busiest day" : ""}
          </span>
        </figcaption>
      </figure>
    </>
  );
}
