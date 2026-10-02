import { useEffect, useState } from "react";
import { ArrowUpRight, GitCommitHorizontal } from "lucide-react";
import { timeAgo } from "../lib/now";
import { useNowData } from "../lib/useNowData";

/** Re-render every minute so "pushed 3 minutes ago" stays honest. */
function useClock() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export function NowBuilding() {
  const state = useNowData();
  const now = useClock();

  if (state.status === "error") {
    return (
      <div className="now-plate">
        <p className="now-label">
          <span className="now-dot idle" aria-hidden="true" />
          Building right now
        </p>
        <p className="now-fallback">
          The live feed didn't load. My latest pushes are on{" "}
          <a href="https://github.com/JiawenZhu?tab=repositories" target="_blank" rel="noreferrer">
            GitHub
          </a>
          .
        </p>
      </div>
    );
  }

  if (state.status === "loading") {
    return (
      <div className="now-plate" aria-busy="true" aria-label="Loading what I'm building right now">
        <p className="now-label">
          <span className="now-dot" aria-hidden="true" />
          Building right now
        </p>
        <span className="now-skeleton wide" />
        <span className="now-skeleton" />
      </div>
    );
  }

  const { latest, recent } = state.data;

  return (
    <div className="now-plate" aria-live="polite">
      <p className="now-label">
        <span className="now-dot" aria-hidden="true" />
        Building right now
        <span className="now-when">pushed {timeAgo(latest.pushedAt, now)}</span>
      </p>

      <a className="now-name" href={latest.homepage || latest.url} target="_blank" rel="noreferrer">
        {latest.name}
        <ArrowUpRight size={22} aria-hidden="true" />
      </a>
      {latest.description && <p className="now-desc">{latest.description}</p>}

      <div className="now-meta">
        {latest.language && (
          <span className="now-lang">
            <span className="now-lang-dot" style={{ background: latest.languageColor || "var(--blue)" }} />
            {latest.language}
          </span>
        )}
        {latest.commit && (
          <a className="now-commit" href={latest.commit.url} target="_blank" rel="noreferrer">
            <GitCommitHorizontal size={16} aria-hidden="true" />
            <span>{latest.commit.message}</span>
          </a>
        )}
      </div>

      {recent.length > 0 && (
        <div className="now-recent">
          <span>Also lately</span>
          <ul>
            {recent.slice(0, 3).map((repo) => (
              <li key={repo.name}>
                <a href={repo.url} target="_blank" rel="noreferrer" title={repo.description}>
                  {repo.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
