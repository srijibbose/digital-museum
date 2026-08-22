"use client";

import { Scale, X } from "lucide-react";
import type { PlanetaryWorld, WorldId } from "@/lib/space/atlas-schema";
import type { ComparisonScalePolicy } from "@/lib/space/atlas-scale";
import styles from "./atlas.module.css";

export function CompareTray({
  worlds,
  primaryWorld,
  compareWorldId,
  scalePolicy,
  onSelectWorld,
  onSetScalePolicy,
  onClose,
}: {
  worlds: PlanetaryWorld[];
  primaryWorld: PlanetaryWorld;
  compareWorldId: WorldId;
  scalePolicy: ComparisonScalePolicy;
  onSelectWorld: (worldId: WorldId) => void;
  onSetScalePolicy: (policy: ComparisonScalePolicy) => void;
  onClose: () => void;
}) {
  const compareWorld = worlds.find((world) => world.id === compareWorldId) ?? worlds[0];
  const primaryRadius = primaryWorld.physical.radiusKm;
  const compareRadius = compareWorld.physical.radiusKm;
  const largerWorld = primaryRadius >= compareRadius ? primaryWorld : compareWorld;
  const smallerWorld = primaryRadius >= compareRadius ? compareWorld : primaryWorld;
  const physicalRatio = Math.max(primaryRadius, compareRadius) / Math.min(primaryRadius, compareRadius);
  const scaleNote = scalePolicy === "normalized"
    ? "Equal display radius · not physical scale"
    : `${largerWorld.name} is ${physicalRatio.toFixed(1)}× ${smallerWorld.name}'s radius`;

  return (
    <section className={styles.compareTray} data-testid="compare-tray" aria-label="World comparison">
      <div className={styles.compareIdentity}>
        <Scale size={16} aria-hidden="true" />
        <span>{primaryWorld.name}</span>
        <small>versus</small>
        <strong>{compareWorld.name}</strong>
      </div>

      <label>
        <span>Compare with</span>
        <select
          aria-label="Compare with"
          value={compareWorldId}
          onChange={(event) => onSelectWorld(event.target.value as WorldId)}
        >
          {worlds
            .filter((world) => world.id !== primaryWorld.id)
            .map((world) => (
              <option key={world.id} value={world.id}>{world.name}</option>
            ))}
        </select>
      </label>

      <fieldset>
        <legend>Display scale</legend>
        <label>
          <input
            type="radio"
            name="atlas-scale"
            value="normalized"
            checked={scalePolicy === "normalized"}
            onChange={() => onSetScalePolicy("normalized")}
          />
          Normalized
        </label>
        <label>
          <input
            type="radio"
            name="atlas-scale"
            value="true-scale"
            checked={scalePolicy === "true-scale"}
            onChange={() => onSetScalePolicy("true-scale")}
          />
          Relative size
        </label>
      </fieldset>

      <p className={styles.compareScaleNote} aria-live="polite">{scaleNote}</p>

      <button type="button" className={styles.compareClose} aria-label="Close world comparison" onClick={onClose}>
        <X size={17} aria-hidden="true" />
      </button>
    </section>
  );
}
