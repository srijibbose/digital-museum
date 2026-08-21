"use client";

import { ArrowUpRight, Check, CircleDot, Crosshair } from "lucide-react";
import type {
  EvidenceStatus,
  PlanetaryWorld,
  WorldHotspot,
} from "@/lib/space/atlas-schema";
import { formatAtlasInteger } from "@/lib/space/number-format";
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
  const media = selectedHotspot?.media;

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
              <div><dt>Mean radius</dt><dd>{formatAtlasInteger(world.physical.radiusKm)} km</dd></div>
              <div><dt>Gravity</dt><dd>{world.physical.gravity}</dd></div>
              <div><dt>Day</dt><dd>{world.physical.dayLength}</dd></div>
              <div><dt>Mean temperature</dt><dd>{world.physical.meanTemperature}</dd></div>
              <div><dt>Position</dt><dd>{world.physical.distance}</dd></div>
            </dl>
          </>
        )}

        <section
          className={styles.observationCard}
          data-feature={media ? "true" : undefined}
          aria-label={`${world.name} observation plate`}
        >
          <div className={styles.miniPlate}>
            <img
              src={media?.path ?? world.assets.fallback}
              alt={media?.alt ?? `${world.name} scientific observation map`}
            />
            {!media ? (
              <Crosshair className={styles.plateReticle} size={74} strokeWidth={0.8} aria-hidden="true" />
            ) : null}
          </div>
          <div className={styles.observationMeta}>
            <span>{media ? "Feature observation" : "Observation plate"}</span>
            <strong>{media?.evidence ?? selectedHotspot?.category ?? world.classification}</strong>
          </div>
          {media ? (
            <p className={styles.mediaCaption}>{media.caption} <span>{media.credit}</span></p>
          ) : null}
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

        <a
          className={styles.sourceLink}
          id="atlas-sources"
          href={media?.sourceUrl ?? source.url}
          target="_blank"
          rel="noreferrer"
        >
          <span>
            <small>Source</small>
            {media?.credit ?? source.publisher}
          </span>
          <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </div>
    </aside>
  );
}
