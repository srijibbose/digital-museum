import Link from "next/link";
import type { ExhibitDefinition } from "@/content/exhibits";
import {
  researchRecordPath,
  type ResearchRecord,
} from "@/content/research-records";
import { MuseumHeader } from "@/components/museum/MuseumHeader";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import type { BreadcrumbItem } from "@/lib/seo/json-ld";
import styles from "@/app/research/research.module.css";

type ResearchRecordPageProps = {
  record: ResearchRecord;
  exhibit: ExhibitDefinition;
  relatedRecords: readonly ResearchRecord[];
  breadcrumbItems: readonly BreadcrumbItem[];
};

const KIND_LABELS: Record<ResearchRecord["kind"], string> = {
  world: "World field record",
  "anatomy-system": "Anatomical system record",
  "human-episode": "Human history episode",
  "flow-station": "Engine flow-station record",
  "mission-beat": "Mission record",
};

function parentExhibitHref(record: ResearchRecord, exhibit: ExhibitDefinition) {
  return exhibit.slug === "atlas-of-worlds"
    ? `${exhibit.route}?world=${record.slug}`
    : exhibit.route;
}

export function ResearchRecordPage({
  record,
  exhibit,
  relatedRecords,
  breadcrumbItems,
}: ResearchRecordPageProps) {
  return (
    <main className={styles.researchPage}>
      <MuseumHeader tone="paper" />

      <article className={styles.recordArticle}>
        <header className={styles.recordHero}>
          <Breadcrumbs items={breadcrumbItems} />
          <p className={styles.eyebrow}>{record.eyebrow}</p>
          <h1>{record.title}</h1>
          <p className={styles.summary}>{record.summary}</p>

          <dl className={styles.recordFacts}>
            <div>
              <dt>Record type</dt>
              <dd>{KIND_LABELS[record.kind]}</dd>
            </div>
            <div>
              <dt>Parent exhibit</dt>
              <dd>{exhibit.title}</dd>
            </div>
            <div>
              <dt>Record reviewed</dt>
              <dd><time dateTime={record.lastModified}>{record.lastModified}</time></dd>
            </div>
          </dl>
        </header>

        <div className={styles.recordBody}>
          <div className={styles.authoredSections}>
            {record.sections.map((section, index) => (
              <section
                aria-labelledby={`record-section-${index}`}
                className={styles.authoredSection}
                key={`${section.heading}-${index}`}
              >
                <p className={styles.sectionNumber} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <div>
                  <h2 id={`record-section-${index}`}>{section.heading}</h2>
                  <p>{section.body}</p>
                </div>
              </section>
            ))}
          </div>

          <aside
            aria-labelledby="evidence-status-heading"
            className={styles.evidencePanel}
          >
            <p className={styles.panelKicker}>Representational note</p>
            <h2 id="evidence-status-heading">Evidence status</h2>
            <p className={styles.evidenceLabel}>{record.evidenceLabel}</p>
            <p className={styles.evidenceDetail}>{record.evidenceDetail}</p>
          </aside>
        </div>

        <section aria-labelledby="sources-heading" className={styles.sourcesPanel}>
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.panelKicker}>Source trail</p>
              <h2 id="sources-heading">Sources</h2>
            </div>
            <p>{record.sources.length} authoritative {record.sources.length === 1 ? "source" : "sources"}</p>
          </div>
          <ol className={styles.sourceList}>
            {record.sources.map((source, index) => (
              <li key={source.url}>
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <a href={source.url}>
                  <strong>{source.title}</strong>
                  {source.publisher ? <small>{source.publisher}</small> : null}
                </a>
                <span aria-hidden="true">↗</span>
              </li>
            ))}
          </ol>
        </section>

        <div className={styles.onwardGrid}>
          <nav aria-label="Related research records" className={styles.relatedPanel}>
            <p className={styles.panelKicker}>Continue in the library</p>
            <h2>Related records</h2>
            <ul>
              {relatedRecords.map((related) => (
                <li key={related.id}>
                  <Link href={researchRecordPath(related)}>
                    <span>{related.eyebrow}</span>
                    <strong>{related.title}</strong>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <aside aria-labelledby="parent-exhibit-heading" className={styles.exhibitCta}>
            <p className={styles.panelKicker}>Return to the instrument</p>
            <h2 id="parent-exhibit-heading">See the record in context</h2>
            <p>{exhibit.synopsis}</p>
            <Link href={parentExhibitHref(record, exhibit)}>
              Enter {exhibit.title}<span aria-hidden="true"> →</span>
            </Link>
          </aside>
        </div>

        <footer className={styles.recordFooter}>
          <Link href="/research">← All research records</Link>
          <span>{record.id}</span>
        </footer>
      </article>
    </main>
  );
}
