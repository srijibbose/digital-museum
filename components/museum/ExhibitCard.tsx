import Link from "next/link";
import { ArrowUpRight, Compass, Sparkles } from "lucide-react";
import type { ExhibitDefinition } from "@/content/exhibits";
import { ExhibitPoster } from "./posters/ExhibitPoster";

export function ExhibitCard({
  exhibit,
  index,
}: {
  exhibit: ExhibitDefinition;
  index: number;
}) {
  return (
    <article
      className={`exhibit-card exhibit-card--${exhibit.slug}`}
      data-exhibit-id={exhibit.id}
    >
      <div className="exhibit-card__visual">
        <div className="exhibit-card__meta-badges">
          <span className="exhibit-card__number">{exhibit.exhibitNumber}</span>
          <span className="exhibit-card__theme-badge">
            {exhibit.visualTheme.badgeText}
          </span>
        </div>

        <ExhibitPoster exhibit={exhibit} />

        {exhibit.visualTheme.metrics.length > 0 && (
          <div className="exhibit-card__metrics-ribbon" aria-label="Key exhibit statistics">
            {exhibit.visualTheme.metrics.map((m, i) => (
              <div key={i} className="metric-cell">
                <span className="metric-cell__label">{m.label}</span>
                <span className="metric-cell__value">{m.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="exhibit-card__copy">
        <div className="exhibit-card__wing-header">
          <span className="wing-pill">
            <Compass size={13} aria-hidden="true" />
            <span>{exhibit.wing.code} — {exhibit.wing.title}</span>
          </span>
          <span className="reading-time-pill">{exhibit.readingTime}</span>
        </div>

        <h3 className="exhibit-card__title">
          <Link href={exhibit.route} className="exhibit-card__title-link">
            {exhibit.title}
          </Link>
        </h3>

        <p className="exhibit-card__tagline">{exhibit.tagline}</p>
        <p className="exhibit-card__synopsis">{exhibit.synopsis}</p>

        {exhibit.curatorNote && (
          <div className="exhibit-card__curator-note">
            <Sparkles size={14} className="curator-icon" aria-hidden="true" />
            <span>{exhibit.curatorNote}</span>
          </div>
        )}

        <div className="exhibit-card__tags" aria-label="Tags">
          {exhibit.tags.map((tag) => (
            <span key={tag} className="tag-chip">
              {tag}
            </span>
          ))}
        </div>

        <div className="exhibit-card__footer">
          <Link
            href={exhibit.route}
            className="exhibit-card__cta"
            aria-label={`Enter the ${exhibit.title} exhibit`}
          >
            <span>Enter the exhibit</span>
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
