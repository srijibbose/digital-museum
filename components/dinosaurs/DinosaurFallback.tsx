"use client";

import type { DinosaurModeId, DinosaurSpecies } from "@/content/dinosaurs";
import styles from "./dinosaur-experience.module.css";

export function DinosaurFallback({ mode, species }: { mode: DinosaurModeId; species: DinosaurSpecies }) {
  return (
    <div className={styles.staticSpecimen} data-mode={mode} role="img" aria-label={`${species.commonName} museum specimen static view`}>
      <img
        src={species.specimen.preview}
        alt=""
      />
      <span>Static museum record · {species.shortName}</span>
    </div>
  );
}
