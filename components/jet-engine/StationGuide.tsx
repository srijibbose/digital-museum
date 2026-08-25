"use client";

import { ExternalLink } from "lucide-react";
import { memo } from "react";
import { jetEngine } from "@/content/jet-engine";
import { formatJetStationState, JET_MODEL_ASSUMPTIONS, type JetCycleResult } from "@/lib/jet-engine/jet-engine-model";
import type { JetStation } from "@/lib/jet-engine/jet-engine-schema";
import styles from "./jet-engine.module.css";

function evidenceLabel(evidence: JetStation["evidence"]) {
  if (evidence === "reference-convention") return "Published convention";
  if (evidence === "modelled-cycle") return "Modelled result";
  return "Explanatory reconstruction";
}

export const StationGuide = memo(function StationGuide({
  station,
  cycle,
  sourceOpen,
  onSourceOpenChange,
}: {
  station: JetStation;
  cycle: JetCycleResult;
  sourceOpen: boolean;
  onSourceOpenChange: (open: boolean) => void;
}) {
  const state = formatJetStationState(cycle.stations[station.id]);
  const sources = jetEngine.sources.filter((source) => station.sourceIds.includes(source.id));

  return (
    <aside className={styles.guide} aria-labelledby="station-guide-title">
      <div className={styles.guideTopline}>
        <span>Station notebook</span>
        <span>{evidenceLabel(station.evidence)}</span>
      </div>
      <p className={styles.guideNumber}>{station.number}</p>
      <h2 id="station-guide-title">{station.label}</h2>
      <p className={styles.guideSummary}>{station.summary}</p>

      <dl className={styles.stationValues} aria-label={`Model values at station ${station.number}`}>
        <div><dt>{station.id === "0" ? "Static temperature" : "Total temperature"}</dt><dd>{state.temperature}</dd></div>
        <div><dt>Pressure</dt><dd>{state.pressure}</dd></div>
        <div><dt>Flow speed</dt><dd>{state.velocity}</dd></div>
      </dl>

      <section>
        <h3>What changes here</h3>
        <p>{station.transformation}</p>
      </section>
      <section>
        <h3>Why it matters</h3>
        <p>{station.interpretation}</p>
      </section>

      <details
        className={styles.sourceNotebook}
        open={sourceOpen}
        onToggle={(event) => onSourceOpenChange(event.currentTarget.open)}
      >
        <summary>Source trail · {sources.length}</summary>
        <div>
          {sources.map((source) => (
            <a key={source.id} href={source.url} target="_blank" rel="noreferrer">
              <span><strong>{source.organization}</strong>{source.title}</span>
              <ExternalLink size={13} aria-hidden="true" />
            </a>
          ))}
        </div>
      </details>

      <details className={styles.methodNote}>
        <summary>Model method &amp; limits</summary>
        <p>{jetEngine.modelNotice}</p>
        <dl>
          <div><dt>Bypass ratio</dt><dd>{JET_MODEL_ASSUMPTIONS.bypassRatio}:1</dd></div>
          <div>
            <dt>Gas model</dt>
            <dd>Ideal · γ {JET_MODEL_ASSUMPTIONS.coldGasGamma}/{JET_MODEL_ASSUMPTIONS.hotGasGamma}</dd>
          </div>
          <div><dt>Profile</dt><dd>{cycle.profile.label}</dd></div>
        </dl>
        <p>{cycle.profile.assumption}</p>
      </details>

      <p className={styles.reconstructionNote}>{jetEngine.reconstructionNotice}</p>
    </aside>
  );
});
