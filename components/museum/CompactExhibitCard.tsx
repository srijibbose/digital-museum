import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import type { ExhibitDefinition } from "@/content/exhibits";
import { EXHIBIT_FORMAT_LABELS } from "@/content/exhibits";
import { ExhibitPoster } from "./posters/ExhibitPoster";
import styles from "./discovery.module.css";

export function CompactExhibitCard({
  exhibit,
}: {
  exhibit: ExhibitDefinition;
}) {
  return (
    <article className={`${styles.card} exhibit-card--${exhibit.slug}`}>
      <div className={`${styles.cardVisual} exhibit-card__visual`}>
        <ExhibitPoster exhibit={exhibit} />
        <span className={styles.cardNumber}>{exhibit.exhibitNumber}</span>
      </div>
      <div className={styles.cardBody}>
        <p className={styles.cardWing}>{exhibit.wing.title}</p>
        <h3>{exhibit.title}</h3>
        <p className={styles.cardTagline}>{exhibit.tagline}</p>
        <div className={styles.cardMeta}>
          <span>{EXHIBIT_FORMAT_LABELS[exhibit.formats[0]]}</span>
          <span><Clock3 size={14} aria-hidden="true" />{exhibit.readingTime}</span>
        </div>
        <Link
          href={exhibit.route}
          className={styles.cardLink}
          aria-label={`Explore ${exhibit.title}`}
        >
          <span>Explore exhibit</span>
          <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
