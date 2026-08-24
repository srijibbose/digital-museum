import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { AnatomyExperience } from "@/components/anatomy/AnatomyExperience";
import { JsonLd } from "@/components/seo/JsonLd";
import { anatomy } from "@/content/anatomy";
import { getExhibitBySlug, isExhibitEnabled } from "@/content/exhibits";
import { createBreadcrumbGraph, createExhibitGraph } from "@/lib/seo/json-ld";
import { createExhibitMetadata } from "@/lib/seo/metadata";
import styles from "@/components/anatomy/anatomy.module.css";

const exhibitDefinition = getExhibitBySlug("human-anatomy")!;

export const metadata: Metadata = createExhibitMetadata(exhibitDefinition);

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: "#f1eee5",
};

export default function HumanAnatomyPage() {
  if (!isExhibitEnabled("human-anatomy")) notFound();

  return (
    <main className={styles.page}>
      <JsonLd
        data={[
          createExhibitGraph(exhibitDefinition),
          createBreadcrumbGraph([
            { name: "Exhibits", pathname: "/exhibits" },
            { name: exhibitDefinition.title, pathname: exhibitDefinition.route },
          ]),
        ]}
      />
      <a className="skip-link" href="#anatomy-transcript">
        Skip interactive anatomy
      </a>
      <AnatomyExperience />

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
