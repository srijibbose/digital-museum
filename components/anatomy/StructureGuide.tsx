"use client";

import { ExternalLink } from "lucide-react";
import { anatomy } from "@/content/anatomy";
import type {
  AnatomyStructure,
  AnatomySystem,
  AnatomyView,
} from "@/lib/anatomy/anatomy-schema";
import styles from "./anatomy.module.css";

function evidenceLabel(view: AnatomyView) {
  if (view.evidence === "scientific-visualization") return "Scientific visualization";
  if (view.evidence === "observed-imaging") return "Observed imaging";
  return "Reference anatomy";
}

export function StructureGuide({
  system,
  structure,
  view,
  expertMode,
}: {
  system: AnatomySystem;
  structure: AnatomyStructure;
  view: AnatomyView;
  expertMode: boolean;
}) {
  const sources = anatomy.sources.filter((source) => structure.sourceIds.includes(source.id));
  const models = anatomy.models.filter((model) =>
    structure.selectors.some((selector) => selector.model === model.key),
  );

  return (
    <aside className={styles.guide} id="anatomy-guide" aria-labelledby="structure-title">
      <div className={styles.guideTopline}>
        <span>{system.territory}</span>
        <span>{evidenceLabel(view)}</span>
      </div>
      <p className={styles.guideCategory}>{structure.category}</p>
      <h2 id="structure-title">{structure.label}</h2>
      <p className={styles.guideSummary}>{structure.summary}</p>

      {expertMode ? (
        <section className={styles.formalTerms} aria-label="Advanced anatomical evidence">
          <h3>Advanced evidence</h3>
          <dl>
            <div><dt>Evidence</dt><dd>{structure.evidence.replaceAll("-", " ")}</dd></div>
            {structure.formalTerms.fma ? (
              <div><dt>FMA</dt><dd>{structure.formalTerms.fma}</dd></div>
            ) : null}
            {structure.formalTerms.uberon ? (
              <div><dt>UBERON</dt><dd>{structure.formalTerms.uberon}</dd></div>
            ) : null}
            {structure.formalTerms.laterality ? (
              <div><dt>Laterality</dt><dd>{structure.formalTerms.laterality}</dd></div>
            ) : null}
            <div><dt>Scope</dt><dd>Reference anatomy</dd></div>
          </dl>
          <details className={styles.modelProvenance}>
            <summary>Source objects · {models.length}</summary>
            {models.map((model) => (
              <article key={model.key}>
                <strong>{model.label}</strong>
                <p>{model.processing}</p>
                <small>{model.referenceBody}</small>
              </article>
            ))}
          </details>
        </section>
      ) : null}

      <section>
        <h3>What it does</h3>
        <p>{structure.detail}</p>
      </section>
      <section>
        <h3>Where it sits</h3>
        <p>{structure.relationship}</p>
      </section>

      <div className={styles.guideSources}>
        <h3>Source trail</h3>
        {sources.map((source) => (
          <a key={source.id} href={source.url} target="_blank" rel="noreferrer">
            <span>{source.title}</span>
            <ExternalLink size={13} aria-hidden="true" />
          </a>
        ))}
      </div>
    </aside>
  );
}
