"use client";

import type {
  DinosaurAnatomySystem,
  DinosaurLifeModel,
  DinosaurModeId,
  DinosaurSpecies,
} from "@/content/dinosaurs";
import styles from "./dinosaur-experience.module.css";

export function DinosaurEvidenceOverlay({
  mode,
  species,
  anatomy,
  lifeModel,
}: {
  mode: DinosaurModeId;
  species: DinosaurSpecies;
  anatomy: DinosaurAnatomySystem;
  lifeModel: DinosaurLifeModel;
}) {
  if (mode === "skeleton") {
    return (
      <div className={styles.recordBadge}>
        <span>Documented object</span>
        <strong>{species.specimen.recordType}</strong>
      </div>
    );
  }

  if (mode === "life") {
    return (
      <div className={styles.lifeModelBadge}>
        <span>Interpretive life model</span>
        <strong>{lifeModel.creator}</strong>
        <small>Bone-constrained proportions · reconstructed soft tissue</small>
      </div>
    );
  }

  if (mode === "trace") {
    return (
      <div className={styles.traceOverlay}>
        <span className={styles.overlayIndex}>Trace model · not assigned to this specimen</span>
        <svg viewBox="0 0 520 210" role="img" aria-label="Schematic dinosaur trackway with stride and pace measurements">
          <defs>
            <g id="theropod-print">
              <path d="M0 31 12 7 17 34 34 14 24 42 1 51-20 42-31 14-14 34-11 7Z" />
            </g>
          </defs>
          <path className={styles.traceAxis} d="M40 109H480" />
          <use href="#theropod-print" x="92" y="37" transform="rotate(-6 92 37)" />
          <use href="#theropod-print" x="205" y="120" transform="rotate(7 205 120)" />
          <use href="#theropod-print" x="322" y="34" transform="rotate(-5 322 34)" />
          <use href="#theropod-print" x="434" y="118" transform="rotate(6 434 118)" />
          <path className={styles.traceMeasure} d="M92 184H322m-230-8v16m230-16v16" />
          <text x="207" y="176" textAnchor="middle">stride length</text>
          <path className={styles.traceMeasure} d="m116 81 65 47" />
          <text x="153" y="96" textAnchor="middle">pace</text>
        </svg>
        <strong>{species.trace.title}</strong>
      </div>
    );
  }

  if (mode === "anatomy") {
    return (
      <div className={styles.anatomyOverlay} data-system={anatomy.id}>
        <span className={styles.overlayIndex}>Comparative organ schematic · not specimen geometry</span>
        <svg viewBox="0 0 560 280" role="img" aria-label={`${species.commonName} comparative internal anatomy diagram`}>
          <path
            className={styles.anatomyBody}
            d="M45 142c52-37 118-62 195-64 74-2 146 13 208 50l75-23-60 48c-15 38-57 63-120 74l-25 42-15-48-95-5-28 51-8-58-83-22-36 38 12-57c-26-5-44-13-53-26 2-7 12-14 29-20Z"
          />
          <g className={styles.lungs}>
            <ellipse cx="278" cy="130" rx="48" ry="32" />
            <ellipse cx="337" cy="132" rx="43" ry="30" />
            <circle cx="231" cy="121" r="16" />
            <circle cx="384" cy="124" r="15" />
          </g>
          <path className={styles.heart} d="M305 163c-23-21-50 10 0 47 50-37 23-68 0-47Z" />
          <path className={styles.gut} d="M249 204c18-24 96-20 119 2-21 26-101 31-119-2Zm21 0c16 12 57 13 76 0" />
          <path className={styles.anatomyLeader} d="m330 102 75-50h93" />
          <text x="500" y="48" textAnchor="end">lungs / air sacs</text>
          <path className={styles.anatomyLeader} d="m307 181 95 0h96" />
          <text x="500" y="176" textAnchor="end">heart</text>
          <path className={styles.anatomyLeader} d="m327 219 79 31h92" />
          <text x="500" y="246" textAnchor="end">digestive tract</text>
        </svg>
        <div>
          <strong>{anatomy.label}</strong>
          <p>{anatomy.note}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.lineageOverlay}>
      <span className={styles.overlayIndex}>Branching relationship · not a ladder of progress</span>
      <ol>
        {species.lineage.path.map((node, index) => (
          <li key={node}>
            <i aria-hidden="true" />
            <span>{node}</span>
            {index < species.lineage.path.length - 1 ? <b aria-hidden="true" /> : null}
          </li>
        ))}
      </ol>
      <p>{species.lineage.livingReference}</p>
    </div>
  );
}
