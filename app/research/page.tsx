import type { Metadata } from "next";
import Link from "next/link";
import { researchRecordPath } from "@/content/research-records";
import { MuseumHeader } from "@/components/museum/MuseumHeader";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  createBreadcrumbGraph,
  createResearchLibraryGraph,
} from "@/lib/seo/json-ld";
import { createPageMetadata } from "@/lib/seo/metadata";
import {
  listPublicResearchRecords,
  type PublicResearchRecord,
} from "@/lib/research/public-records";
import styles from "./research.module.css";

const LIBRARY_DESCRIPTION =
  "Read the source-grounded records behind Loupe's exhibits, with evidence limits, authored interpretation, and direct links to authoritative sources.";
const breadcrumbItems = [
  { name: "Home", pathname: "/" },
  { name: "Research", pathname: "/research" },
] as const;

export const metadata: Metadata = createPageMetadata({
  title: "Research library",
  description: LIBRARY_DESCRIPTION,
  pathname: "/research",
  imagePath: "/social/museum/default",
  imageAlt: "Loupe Digital Museum research library",
});

export default function ResearchLibraryPage() {
  const publicRecords = listPublicResearchRecords();
  const groups = publicRecords.reduce<Array<{
    exhibit: PublicResearchRecord["exhibit"];
    records: PublicResearchRecord["record"][];
  }>>((result, entry) => {
    const current = result.at(-1);
    if (current?.exhibit.id === entry.exhibit.id) {
      current.records.push(entry.record);
    } else {
      result.push({ exhibit: entry.exhibit, records: [entry.record] });
    }
    return result;
  }, []);
  const visibleRecords = publicRecords.map(({ record }) => record);

  return (
    <main className={styles.libraryPage}>
      <JsonLd data={createResearchLibraryGraph(visibleRecords)} />
      <JsonLd data={createBreadcrumbGraph(breadcrumbItems)} />
      <MuseumHeader tone="paper" />

      <header className={styles.libraryHero}>
        <Breadcrumbs items={breadcrumbItems} />
        <p className={styles.eyebrow}>Loupe / Open research desk</p>
        <h1>Research library</h1>
        <p>{LIBRARY_DESCRIPTION}</p>
        <div className={styles.libraryMeasure} aria-label="Library holdings">
          <span><strong>{visibleRecords.length}</strong> records</span>
          <span><strong>{groups.length}</strong> exhibits</span>
          <span><strong>100%</strong> source-linked</span>
        </div>
      </header>

      <div className={styles.libraryGroups}>
        {groups.map(({ exhibit, records }, groupIndex) => (
          <section
            aria-labelledby={`research-group-${exhibit.slug}`}
            className={styles.libraryGroup}
            key={exhibit.id}
          >
            <header className={styles.groupHeader}>
              <div>
                <p className={styles.groupIndex}>Collection {String(groupIndex + 1).padStart(2, "0")}</p>
                <h2 id={`research-group-${exhibit.slug}`}>{exhibit.title}</h2>
              </div>
              <div>
                <p>{exhibit.synopsis}</p>
                <span>{records.length} {records.length === 1 ? "record" : "records"}</span>
              </div>
            </header>

            <ol className={styles.recordGrid}>
              {records.map((record, recordIndex) => (
                <li key={record.id}>
                  <Link href={researchRecordPath(record)}>
                    <span className={styles.recordIndex} aria-hidden="true">
                      {String(recordIndex + 1).padStart(2, "0")}
                    </span>
                    <span className={styles.recordCopy}>
                      <small>{record.eyebrow}</small>
                      <strong>{record.title}</strong>
                      <span>{record.summary}</span>
                    </span>
                    <span className={styles.recordArrow} aria-hidden="true">↗</span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>

      <footer className={styles.libraryFooter}>
        <Link href="/exhibits">Explore the exhibitions</Link>
        <span>Evidence, context, and provenance remain visible together.</span>
      </footer>
    </main>
  );
}
