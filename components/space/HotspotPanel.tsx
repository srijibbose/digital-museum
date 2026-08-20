"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import type { CelestialBody, Hotspot } from "@/lib/space/schema";
import styles from "./space.module.css";

export function HotspotPanel({
  body,
  visibleHotspots,
  selectedHotspotId,
  onSelect,
  categoryColor,
  categoryLabel,
}: {
  body: CelestialBody;
  visibleHotspots: Hotspot[];
  selectedHotspotId: string | null;
  onSelect: (id: string | null) => void;
  categoryColor: (category: string) => string;
  categoryLabel: (category: string) => string;
}) {
  const closeButton = useRef<HTMLButtonElement>(null);
  const invokingButton = useRef<HTMLButtonElement | null>(null);
  const selected = body.hotspots.find((hotspot) => hotspot.id === selectedHotspotId);

  useEffect(() => {
    if (selected) closeButton.current?.focus();
  }, [selected]);

  function open(id: string, button: HTMLButtonElement) {
    invokingButton.current = button;
    onSelect(id);
  }

  function close() {
    onSelect(null);
    window.setTimeout(() => invokingButton.current?.focus(), 0);
  }

  return (
    <>
      <div className={styles.hotspotList} aria-label={`Explore ${body.name}`}>
        <span>Look closer</span>
        {visibleHotspots.map((hotspot) => (
          <button
            key={hotspot.id}
            onClick={(event) => open(hotspot.id, event.currentTarget)}
            aria-label={`Explore ${hotspot.label}`}
            data-active={hotspot.id === selectedHotspotId || undefined}
          >
            <i style={{ background: categoryColor(hotspot.category) }} aria-hidden="true" />
            {hotspot.label}
          </button>
        ))}
      </div>

      {selected && (
        <div className={styles.dialogBackdrop} onMouseDown={close}>
          <section
            className={styles.dialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="hotspot-dialog-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button ref={closeButton} className={styles.dialogClose} aria-label="Close" onClick={close}>
              <X size={18} aria-hidden="true" />
            </button>
            <p className={styles.dialogEyebrow} style={{ color: categoryColor(selected.category) }}>
              {categoryLabel(selected.category)}
              {selected.coordinateConfidence === "approximate" ? (
                <span className={styles.dialogConfidence}> · approximate location</span>
              ) : null}
            </p>
            <h2 id="hotspot-dialog-title">{selected.label}</h2>
            <p className={styles.dialogSummary}>{selected.summary}</p>
            <p>{selected.detail}</p>
            <p className={styles.dialogAccessible}>{selected.accessibleDescription}</p>
            <p className={styles.dialogCoords}>
              {Math.abs(selected.lat).toFixed(2)}°{selected.lat >= 0 ? "N" : "S"},{" "}
              {Math.abs(selected.lon).toFixed(2)}°{selected.lon >= 0 ? "E" : "W"}
            </p>
          </section>
        </div>
      )}
    </>
  );
}
