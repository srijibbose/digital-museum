"use client";

import { ArrowUpRight, Check, CircleDot, Crosshair } from "lucide-react";
import type {
  EvidenceStatus,
  PlanetaryWorld,
  WorldHotspot,
} from "@/lib/space/atlas-schema";
import { formatAtlasInteger } from "@/lib/space/number-format";
import type { MarsDeepTimeState } from "@/lib/space/mars-deep-time";
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
  deepTimeState = null,
}: {
  world: PlanetaryWorld;
  selectedHotspot: WorldHotspot | null;
  visitedCount: number;
  deepTimeState?: MarsDeepTimeState | null;
}) {
  const showingDeepTime = Boolean(deepTimeState && !selectedHotspot);
  const showingPresentReference = showingDeepTime && deepTimeState?.timeMya === 0;
  const evidence = showingPresentReference
    ? "observed"
    : showingDeepTime
    ? "inferred"
    : selectedHotspot?.evidence ?? "observed";
  const source = selectedHotspot
    ? world.sources.find((item) => selectedHotspot.sourceIds.includes(item.id)) ?? world.sources[0]
    : deepTimeState
    ? world.sources.find((item) => deepTimeState.sourceIds.includes(item.id)) ?? world.sources[0]
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
          <span>{showingDeepTime ? `${deepTimeState?.dateLabel} · ${deepTimeState?.period}` : `${world.orderLabel} · ${world.classification}`}</span>
          <h2>{selectedHotspot?.label ?? deepTimeState?.title ?? world.name}</h2>
          <p className={styles.guideLead}>
            {selectedHotspot?.summary ?? deepTimeState?.description ?? world.shortDescription}
          </p>
        </div>

        <div className={styles.evidenceLine}>
          <span className={styles.evidenceBadge} data-evidence={evidence}>
            <CircleDot size={12} aria-hidden="true" /> {evidenceLabels[evidence]}
          </span>
          <span>
            {selectedHotspot
              ? `${selectedHotspot.coordinateConfidence} coordinate`
              : showingPresentReference
              ? "Present reference"
              : showingDeepTime
              ? "Constrained reconstruction"
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
        ) : showingDeepTime && deepTimeState ? (
          <>
            <p className={styles.guideDetail}>
              {showingPresentReference
                ? "The reconstruction overlays are removed at present day, leaving the delivered Viking surface, MOLA relief, observed polar caps, and a restrained atmospheric limb."
                : "Terrain remains anchored to the delivered Viking and MOLA products. Water, ice, haze, and atmospheric density are visual hypotheses constrained by the record below."}
            </p>
            <dl className={styles.measureTable}>
              <div><dt>Date</dt><dd>{deepTimeState.dateLabel}</dd></div>
              <div><dt>Observed basis</dt><dd>{deepTimeState.evidenceSummary}</dd></div>
              <div><dt>Reconstruction</dt><dd>{deepTimeState.reconstructionSummary}</dd></div>
              <div><dt>Confidence</dt><dd>{deepTimeState.confidence}</dd></div>
              <div><dt>Timeline state</dt><dd>{deepTimeState.interpolationLabel}</dd></div>
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

        {!showingDeepTime ? <section className={styles.structure} aria-labelledby="structure-title">
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
        </section> : null}

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
