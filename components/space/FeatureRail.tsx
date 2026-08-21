"use client";

import { Crosshair, X } from "lucide-react";
import type { WorldHotspot } from "@/lib/space/atlas-schema";
import styles from "./atlas.module.css";

export function FeatureRail({
  hotspots,
  selectedHotspotId,
  onSelect,
  onClear,
}: {
  hotspots: WorldHotspot[];
  selectedHotspotId: string | null;
  onSelect: (hotspotId: string) => void;
  onClear: () => void;
}) {
  if (hotspots.length === 0) return null;

  return (
    <nav className={styles.featureRail} aria-label="Visible features">
      <div className={styles.featureRailHeading}>
        <span><Crosshair size={13} aria-hidden="true" /> Features</span>
        {selectedHotspotId ? (
          <button type="button" aria-label="Clear selected feature" onClick={onClear}>
            <X size={13} aria-hidden="true" />
          </button>
        ) : null}
      </div>
      <ol>
        {hotspots.map((hotspot, index) => (
          <li key={hotspot.id}>
            <button
              type="button"
              aria-label={hotspot.label}
              aria-pressed={hotspot.id === selectedHotspotId}
              onClick={() => onSelect(hotspot.id)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{hotspot.label}</strong>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
