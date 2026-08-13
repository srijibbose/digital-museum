"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { livingAtlasHotspots } from "@/content/living-atlas";
import type { AnatomyChapter, HotspotId } from "@/lib/living-atlas/schema";
import { useLivingAtlasStore } from "@/lib/living-atlas/store";

export function ExploreDrawer({ chapter }: { chapter: AnatomyChapter }) {
  const selectedHotspotId = useLivingAtlasStore((state) => state.selectedHotspotId);
  const selectHotspot = useLivingAtlasStore((state) => state.selectHotspot);
  const closeButton = useRef<HTMLButtonElement>(null);
  const invokingButton = useRef<HTMLButtonElement | null>(null);
  const relevantHotspots = livingAtlasHotspots.filter((hotspot) =>
    chapter.hotspotIds.includes(hotspot.id),
  );
  const selected = livingAtlasHotspots.find((hotspot) => hotspot.id === selectedHotspotId);

  useEffect(() => {
    if (selected) closeButton.current?.focus();
  }, [selected]);

  function openHotspot(id: HotspotId, button: HTMLButtonElement) {
    invokingButton.current = button;
    selectHotspot(id);
  }

  function close() {
    selectHotspot(null);
    window.setTimeout(() => invokingButton.current?.focus(), 0);
  }

  return (
    <>
      <div className="hotspot-list" aria-label="Explore visible anatomy">
        <span>Look closer</span>
        {relevantHotspots.map((hotspot) => (
          <button
            key={hotspot.id}
            onClick={(event) => openHotspot(hotspot.id, event.currentTarget)}
            aria-label={`Explore ${hotspot.label}`}
          >
            <i style={{ background: chapter.accent }} aria-hidden="true" />
            {hotspot.label}
          </button>
        ))}
      </div>

      {selected && (
        <div className="organ-dialog-backdrop" onMouseDown={close}>
          <section
            className="organ-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="organ-dialog-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              ref={closeButton}
              className="organ-dialog__close"
              aria-label="Close organ detail"
              onClick={close}
            >
              <X size={18} aria-hidden="true" />
            </button>
            <p>{selected.systemId} system</p>
            <h2 id="organ-dialog-title">{selected.label}</h2>
            <div>
              <span>Where</span>
              <p>{selected.location}</p>
            </div>
            <div>
              <span>What it does</span>
              <p>{selected.function}</p>
            </div>
            <p className="organ-dialog__description">{selected.accessibleDescription}</p>
          </section>
        </div>
      )}
    </>
  );
}
