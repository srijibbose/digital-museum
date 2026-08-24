import Link from "next/link";
import {
  EXHIBIT_REGISTRY,
  type ExhibitDefinition,
} from "@/content/exhibits";
import {
  researchRecordPath,
  type ResearchRecord,
} from "@/content/research-records";
import { isPubliclyDiscoverable } from "@/lib/auth/exhibit-access";
import styles from "./discovery.module.css";

function sharedCount(left: readonly string[], right: readonly string[]) {
  const rightValues = new Set(right.map((value) => value.toLocaleLowerCase()));
  return left.reduce(
    (count, value) => count + Number(rightValues.has(value.toLocaleLowerCase())),
    0,
  );
}

export function selectRelatedExhibits(
  exhibit: ExhibitDefinition,
  candidates: readonly ExhibitDefinition[] = EXHIBIT_REGISTRY,
  limit = 3,
): ExhibitDefinition[] {
  return candidates
    .filter(
      (candidate) =>
        candidate.slug !== exhibit.slug && isPubliclyDiscoverable(candidate),
    )
    .map((candidate) => ({
      candidate,
      sharedWing: Number(candidate.wing.slug === exhibit.wing.slug),
      sharedFormats: sharedCount(candidate.formats, exhibit.formats),
      sharedTags: sharedCount(candidate.tags, exhibit.tags),
    }))
    .sort(
      (left, right) =>
        right.sharedWing - left.sharedWing ||
        right.sharedFormats - left.sharedFormats ||
        right.sharedTags - left.sharedTags ||
        left.candidate.order - right.candidate.order,
    )
    .slice(0, Math.max(0, limit))
    .map(({ candidate }) => candidate);
}

type ExhibitDiscoveryFooterProps = {
  exhibit: ExhibitDefinition;
  records: readonly ResearchRecord[];
};

export function ExhibitDiscoveryFooter({
  exhibit,
  records,
}: ExhibitDiscoveryFooterProps) {
  const exhibitRecords = records.filter(
    (record) => record.exhibitSlug === exhibit.slug,
  );
  const relatedExhibits = selectRelatedExhibits(exhibit);
  const titleId = `${exhibit.slug}-discovery-title`;

  return (
    <section
      aria-labelledby={titleId}
      className={styles.discoveryFooter}
      data-exhibit-discovery={exhibit.slug}
    >
      <div className={styles.discoveryHeading}>
        <p>Continue looking closer</p>
        <h2 id={titleId}>Follow the evidence beyond this exhibit.</h2>
        <span>
          {exhibitRecords.length} source-grounded research{" "}
          {exhibitRecords.length === 1 ? "record" : "records"}
        </span>
      </div>

      <nav
        aria-label={`${exhibit.title} discovery`}
        className={styles.discoveryNavigation}
      >
        <ul className={styles.discoveryIndexes}>
          <li>
            <Link href="/exhibits">All exhibits</Link>
          </li>
          <li>
            <Link href={`/exhibits?wing=${exhibit.wing.slug}`}>
              {exhibit.wing.title}
            </Link>
          </li>
          <li>
            <Link href="/research">Research library</Link>
          </li>
        </ul>

        <details
          className={styles.recordDisclosure}
          open={exhibitRecords.length <= 10}
        >
          <summary>
            <span>Research records</span>
            <strong>{exhibitRecords.length.toString().padStart(2, "0")}</strong>
          </summary>
          <ol className={styles.recordList}>
            {exhibitRecords.map((record, index) => (
              <li key={record.id}>
                <Link href={researchRecordPath(record)}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{record.title}</strong>
                  <small>{record.evidenceLabel}</small>
                </Link>
              </li>
            ))}
          </ol>
        </details>

        <section
          aria-labelledby={`${exhibit.slug}-related-exhibits-title`}
          className={styles.relatedExhibits}
        >
          <p>Related exhibits</p>
          <h3 id={`${exhibit.slug}-related-exhibits-title`}>
            Continue through Loupe
          </h3>
          <ul>
            {relatedExhibits.map((related) => (
              <li key={related.slug}>
                <Link href={related.route}>
                  <span>{related.wing.title}</span>
                  <strong>{related.title}</strong>
                  <small>{related.tagline}</small>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </nav>

      <div className={styles.discoveryClosing}>
        <span>Loupe · A museum for the quietly curious</span>
        <span>End of {exhibit.title}</span>
      </div>
    </section>
  );
}
