"use client";

import { Eye, Sun } from "lucide-react";
import type { LightingPolicy } from "@/lib/space/atlas-schema";
import type { LightingMode } from "@/lib/space/atlas-store";
import styles from "./atlas.module.css";

export function LightingControl({
  policy,
  mode,
  azimuth,
  elevation,
  onModeChange,
  onAngleChange,
}: {
  policy: LightingPolicy;
  mode: LightingMode;
  azimuth: number;
  elevation: number;
  onModeChange: (mode: LightingMode) => void;
  onAngleChange: (azimuth: number, elevation: number) => void;
}) {
  if (policy === "hidden") return null;

  if (policy === "natural-survey") {
    return (
      <div className={styles.lightingControl} aria-label="Lighting controls">
        <span className={styles.lightingLabel}>Light</span>
        <div className={styles.lightingSwitch}>
          <button
            type="button"
            aria-label="Natural light"
            aria-pressed={mode === "natural"}
            onClick={() => onModeChange("natural")}
          >
            <Sun size={13} aria-hidden="true" /> Natural
          </button>
          <button
            type="button"
            aria-label="Survey light"
            aria-pressed={mode === "survey"}
            onClick={() => onModeChange("survey")}
          >
            <Eye size={13} aria-hidden="true" /> Survey
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.lightingControl} aria-label="Lighting angle controls">
      <Sun size={17} aria-hidden="true" />
      <label>
        <span>Azimuth</span>
        <input
          type="range"
          min="0"
          max="359"
          value={azimuth}
          aria-label="Sunlight azimuth"
          onChange={(event) => onAngleChange(Number(event.target.value), elevation)}
        />
      </label>
      <label>
        <span>Elevation</span>
        <input
          type="range"
          min="-10"
          max="80"
          value={elevation}
          aria-label="Sunlight elevation"
          onChange={(event) => onAngleChange(azimuth, Number(event.target.value))}
        />
      </label>
    </div>
  );
}
