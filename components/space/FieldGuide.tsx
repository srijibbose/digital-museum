"use client";

import { ArrowUpRight, Check, CircleDot } from "lucide-react";
import type {
  EvidenceStatus,
  PlanetaryWorld,
  WorldHotspot,
} from "@/lib/space/atlas-schema";
import styles from "./atlas.module.css";

const evidenceLabels: Record<EvidenceStatus, string> = {
  observed: "Observed",
  processed: "Processed",
  inferred: "Inferred",
  illustrative: "Illustrative",
};

function Coordinate({ hotspot }: { hotspot: WorldHotspot }) {
  return (
    <span>
      {Math.abs(hotspot.lat).toFixed(2)}°{hotspot.lat >= 0 ? "N" : "S"},{" "}
      {Math.abs(hotspot.lon).toFixed(2)}°{hotspot.lon >= 0 ? "E" : "W"}
    </span>
  );
}

export function FieldGuide({
  world,
  selectedHotspot,
  visitedCount,
}: {
  world: PlanetaryWorld;
  selectedHotspot: WorldHotspot | null;
  visitedCount: number;
}) {
  const evidence = selectedHotspot?.evidence ?? "observed";
  const source = selectedHotspot
    ? world.sources.find((item) => selectedHotspot.sourceIds.includes(item.id)) ?? world.sources[0]
    : world.sources[0];

  return (
    <aside className={styles.fieldGuide} aria-label="Field Guide">
      <header className={styles.guideHeader}>
        <p className={styles.sectionLabel}>Field guide</p>
        <span className={styles.visitCount}>
          {visitedCount} / {world.hotspots.length} visited
        </span>
      </header>

      <div className={styles.guideScroll}>
        <div className={styles.guideIdentity}>
          <span>{world.orderLabel} · {world.classification}</span>
          <h2>{selectedHotspot?.label ?? world.name}</h2>
          <p className={styles.guideLead}>
            {selectedHotspot?.summary ?? world.shortDescription}
          </p>
        </div>

        <div className={styles.evidenceLine}>
          <span className={styles.evidenceBadge} data-evidence={evidence}>
            <CircleDot size={12} aria-hidden="true" /> {evidenceLabels[evidence]}
          </span>
          <span>
            {selectedHotspot
              ? `${selectedHotspot.coordinateConfidence} coordinate`
              : "Scientific overview"}
          </span>
        </div>

        {selectedHotspot ? (
          <>
            <p className={styles.guideDetail}>{selectedHotspot.detail}</p>
            <dl className={styles.measureTable}>
              <div>
                <dt>Coordinates</dt>
                <dd><Coordinate hotspot={selectedHotspot} /></dd>
              </div>
              <div>
                <dt>Category</dt>
                <dd>{selectedHotspot.category}</dd>
              </div>
              {selectedHotspot.measurements.map((measurement) => (
                <div key={measurement.label}>
                  <dt>{measurement.label}</dt>
                  <dd>{measurement.value}</dd>
                </div>
              ))}
            </dl>
          </>
        ) : (
          <>
            <p className={styles.guideDetail}>{world.overview}</p>
            <dl className={styles.measureTable}>
              <div><dt>Mean radius</dt><dd>{world.physical.radiusKm.toLocaleString()} km</dd></div>
              <div><dt>Gravity</dt><dd>{world.physical.gravity}</dd></div>
              <div><dt>Day</dt><dd>{world.physical.dayLength}</dd></div>
              <div><dt>Mean temperature</dt><dd>{world.physical.meanTemperature}</dd></div>
              <div><dt>Position</dt><dd>{world.physical.distance}</dd></div>
            </dl>
          </>
        )}

        <section className={styles.observationCard} aria-label={`${world.name} observation plate`}>
          <div className={styles.miniPlate}>
            <img src={world.assets.fallback} alt={`${world.name} scientific observation map`} />
            <span className={styles.plateReticle} aria-hidden="true" />
          </div>
          <div className={styles.observationMeta}>
            <span>Observation plate</span>
            <strong>{selectedHotspot?.category ?? world.classification}</strong>
          </div>
        </section>

        <section className={styles.structure} aria-labelledby="structure-title">
          <p className={styles.sectionLabel} id="structure-title">Interior structure</p>
          <ol>
            {world.interiorLayers.map((layer) => (
              <li key={layer.label}>
                <span style={{ background: layer.color }} aria-hidden="true" />
                <div>
                  <strong>{layer.label}</strong>
                  <small>{layer.state}</small>
                </div>
                <Check size={13} aria-hidden="true" />
              </li>
            ))}
          </ol>
        </section>

        <a className={styles.sourceLink} href={source.url} target="_blank" rel="noreferrer">
          <span>
            <small>Source</small>
            {source.publisher}
          </span>
          <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </div>
    </aside>
  );
}
