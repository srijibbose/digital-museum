import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ExhibitRecord } from "@/content/exhibits";
import { ExhibitPoster } from "./posters/ExhibitPoster";

export function ExhibitCard({ exhibit, index }: { exhibit: ExhibitRecord; index: number }) {
  return (
    <Link
      aria-label={`Enter ${exhibit.title}`}
      className={`museum-exhibit-card museum-exhibit-card--${exhibit.poster}`}
      href={exhibit.href}
    >
      <article>
        <div className="museum-exhibit-card__visual">
          <div className="museum-exhibit-card__meta">
            <span>EXH. {exhibit.number}</span>
            <span>{exhibit.theme}</span>
          </div>
          <ExhibitPoster kind={exhibit.poster} />
          <div className="museum-exhibit-card__metrics">
            {exhibit.metrics.map((metric) => (
              <span key={metric.label}>
                <small>{metric.label}</small>
                <strong>{metric.value}</strong>
              </span>
            ))}
          </div>
        </div>
        <div className="museum-exhibit-card__copy">
          <div>
            <p className="museum-exhibit-card__wing">
              {exhibit.wing.title} <span>·</span> {exhibit.duration}
            </p>
            <p className="museum-exhibit-card__ordinal">0{index + 1}</p>
            <h3>{exhibit.title}</h3>
            <p className="museum-exhibit-card__tagline">{exhibit.tagline}</p>
            <p className="museum-exhibit-card__synopsis">{exhibit.synopsis}</p>
          </div>
          <span className="museum-exhibit-card__cta">
            Enter exhibit <ArrowUpRight size={18} aria-hidden="true" />
          </span>
        </div>
      </article>
    </Link>
  );
}
