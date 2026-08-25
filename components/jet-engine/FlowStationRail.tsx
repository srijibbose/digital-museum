"use client";

import { memo } from "react";
import { jetEngine } from "@/content/jet-engine";
import type { JetCycleResult } from "@/lib/jet-engine/jet-engine-model";
import type { JetStationId } from "@/lib/jet-engine/jet-engine-schema";
import styles from "./jet-engine.module.css";

export const FlowStationRail = memo(function FlowStationRail({
  selectedId,
  cycle,
  onSelect,
}: {
  selectedId: JetStationId;
  cycle: JetCycleResult;
  onSelect: (id: JetStationId) => void;
}) {
  return (
    <aside className={styles.stationRail} aria-label="Flow stations">
      <div className={styles.railHeading}>
        <span>Flow stations</span>
        <small>NASA convention</small>
      </div>
      <ol>
        {jetEngine.stations.map((station) => (
          <li key={station.id}>
            <button
              type="button"
              aria-pressed={station.id === selectedId}
              data-active={station.id === selectedId || undefined}
              data-stream={station.stream}
              onClick={() => onSelect(station.id)}
            >
              <span className={styles.stationNumber}>{station.number}</span>
              <span className={styles.stationName}>{station.shortLabel}</span>
              <small>{Math.round(cycle.stations[station.id].temperatureK)} K</small>
            </button>
          </li>
        ))}
      </ol>
      <div className={styles.railLegend}>
        <span><i data-stream="bypass" />Bypass</span>
        <span><i data-stream="core" />Core</span>
      </div>
    </aside>
  );
});
