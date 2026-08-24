import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { AnatomyExperience } from "@/components/anatomy/AnatomyExperience";
import { ExhibitAccessBoundary } from "@/components/museum/ExhibitAccessBoundary";
import accessStyles from "@/components/museum/exhibit-access.module.css";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { anatomy } from "@/content/anatomy";
import { getExhibitBySlug } from "@/content/exhibits";
import { assertPublicExhibitRouteAvailable } from "@/lib/auth/exhibit-access";
import { createBreadcrumbGraph, createExhibitGraph } from "@/lib/seo/json-ld";
import { createExhibitMetadata } from "@/lib/seo/metadata";
import styles from "@/components/anatomy/anatomy.module.css";

const exhibitDefinition = getExhibitBySlug("human-anatomy")!;
const breadcrumbItems = [
  { name: "Home", pathname: "/" },
  { name: "Exhibits", pathname: "/exhibits" },
  { name: exhibitDefinition.title, pathname: exhibitDefinition.route },
] as const;

export const metadata: Metadata = createExhibitMetadata(exhibitDefinition);

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: "#f1eee5",
};

export default function HumanAnatomyPage() {
  assertPublicExhibitRouteAvailable(exhibitDefinition);

  return (
    <main className={styles.page}>
      <JsonLd
        data={[
          createExhibitGraph(exhibitDefinition),
          createBreadcrumbGraph(breadcrumbItems),
        ]}
      />
      <Breadcrumbs items={breadcrumbItems} />
      {exhibitDefinition.access.mode === "members" ? (
        <header className={accessStyles.publicContext}>
          <p className={accessStyles.eyebrow}>The public scientific edition</p>
          <h1>{exhibitDefinition.title}</h1>
          <p className={accessStyles.publicTagline}>{exhibitDefinition.tagline}</p>
          <p>{exhibitDefinition.synopsis}</p>
          <p className={accessStyles.publicNote}>{exhibitDefinition.curatorNote}</p>
          <nav aria-label="Human Anatomy public edition">
            <a href="#anatomy-transcript">Read the text atlas</a>
            <a href="#anatomy-sources">Review anatomy sources</a>
            <Link href="/exhibits">Browse all exhibits</Link>
          </nav>
        </header>
      ) : null}
      <a className="skip-link" href="#anatomy-transcript">
        Skip interactive anatomy
      </a>
      <ExhibitAccessBoundary exhibit={exhibitDefinition}>
        <AnatomyExperience />
      </ExhibitAccessBoundary>

      <section
        className={styles.transcript}
        id="anatomy-transcript"
        aria-labelledby="anatomy-transcript-title"
      >
        <div className={styles.transcriptIntro}>
          <p className="kicker">Accessible scientific edition</p>
          <h2 id="anatomy-transcript-title">The body is a relationship, not a parts list.</h2>
          <p>{anatomy.curatorialThesis}</p>
          <p>
            This text atlas preserves the named structures and source qualifications when
            interactive 3D is unavailable or undesirable.
          </p>
        </div>

        <div className={styles.transcriptGrid}>
          {anatomy.systems.map((system) => (
            <article key={system.id}>
              <span>{system.index} · {system.territory}</span>
              <h3>{system.label}</h3>
              <p>{system.overview}</p>
              <ol>
                {system.structures.map((structure) => (
                  <li key={structure.id}>
                    <strong>{structure.label}</strong>
                    <p>{structure.summary}</p>
                    <small>{structure.evidence.replaceAll("-", " ")}</small>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>

        <div className={styles.sourcePanel} id="anatomy-sources">
          <div>
            <p className="kicker">Sources &amp; transformations</p>
            <h2>Reference anatomy, clearly bounded.</h2>
            <p>
              This edition uses healthy adult male HRA reference objects derived from the NLM
              Visible Human dataset, plus a generalized lymph-node exemplar and an Allen brain
              atlas. Materials, transparency, and animated emphasis are explanatory treatments;
              every change of scale or source frame is disclosed rather than passed off as one body.
            </p>
          </div>
          <ol>
            {anatomy.sources.map((source) => (
              <li key={source.id}>
                <a href={source.url} target="_blank" rel="noreferrer">
                  <span>{source.title}</span>
                  <small>{source.publisher}</small>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
