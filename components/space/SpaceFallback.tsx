"use client";

import type { CelestialBody, Hotspot } from "@/lib/space/schema";
import styles from "./space.module.css";

export function SpaceFallback({
  body,
  visibleHotspots,
  onSelect,
  categoryColor,
}: {
  body: CelestialBody;
  visibleHotspots: Hotspot[];
  onSelect: (id: string) => void;
  categoryColor: (category: string) => string;
}) {
  return (
    <div className={styles.fallback}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={body.colorTexture} alt={`Global photographic map of ${body.name}`} />
      <div className={styles.fallbackList}>
        <span>Explore {body.name}</span>
        {visibleHotspots.map((hotspot) => (
          <button key={hotspot.id} onClick={() => onSelect(hotspot.id)}>
            <i style={{ background: categoryColor(hotspot.category) }} aria-hidden="true" />
            {hotspot.label}
          </button>
        ))}
      </div>
    </div>
  );
}
