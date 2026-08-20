"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, MoveDown, Waves } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { CelestialBody } from "@/lib/space/schema";
import type { SpaceExplorerState } from "@/lib/space/store";
import { HotspotPanel } from "./HotspotPanel";
import { SpaceFallback } from "./SpaceFallback";
import { SpaceModeBar } from "./SpaceModeBar";
import styles from "./space.module.css";

const SpaceCanvas = dynamic(() => import("./SpaceCanvas"), {
  ssr: false,
  loading: () => <div className={styles.canvasLoading}>Loading the globe…</div>,
});

export function SpaceExperience({
  body,
  useStore,
}: {
  body: CelestialBody;
  useStore: <T>(selector: (state: SpaceExplorerState) => T) => T;
}) {
  const experienceStarted = useStore((s) => s.experienceStarted);
  const activeModeId = useStore((s) => s.activeModeId);
  const selectedHotspotId = useStore((s) => s.selectedHotspotId);
  const flyToId = useStore((s) => s.flyToId);
  const visitedHotspotIds = useStore((s) => s.visitedHotspotIds);
  const reducedMotion = useStore((s) => s.reducedMotion);
  const simplifiedView = useStore((s) => s.simplifiedView);
  const startExperience = useStore((s) => s.startExperience);
  const setMode = useStore((s) => s.setMode);
  const selectHotspot = useStore((s) => s.selectHotspot);
  const clearFlyTo = useStore((s) => s.clearFlyTo);
  const setReducedMotion = useStore((s) => s.setReducedMotion);
  const setSimplifiedView = useStore((s) => s.setSimplifiedView);

  const [webglAvailable, setWebglAvailable] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(media.matches);
  }, [setReducedMotion]);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      setWebglAvailable(Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl")));
    } catch {
      setWebglAvailable(false);
    }
  }, []);

  const categoryColor = useMemo(
    () => (category: string) =>
      body.categories.find((c) => c.id === category)?.color ?? body.accent,
    [body],
  );
  const categoryLabel = useMemo(
    () => (category: string) => body.categories.find((c) => c.id === category)?.label ?? category,
    [body],
  );

  const activeMode = body.modes.find((m) => m.id === activeModeId) ?? body.modes[0];
  const visibleHotspots =
    activeMode.categories === "all"
      ? body.hotspots
      : body.hotspots.filter((h) => (activeMode.categories as string[]).includes(h.category));

  if (!experienceStarted) {
    return (
      <section className={styles.threshold} aria-labelledby="space-title">
        <div className={styles.thresholdTopline}>
          <Link className="museum-mark" href="/" aria-label="Loupe museum home">
            <span className="museum-mark__orb" aria-hidden="true" />
            <span>LOUPE</span>
          </Link>
          <span>{body.exhibitLabel}</span>
        </div>

        <div className={styles.thresholdVisual} aria-hidden="true">
          <div className={styles.thresholdOrb} style={{ ["--orb-accent" as string]: body.accent }} />
          <div className={styles.thresholdRing} />
          <div className={styles.thresholdRing} data-variant="two" />
        </div>

        <div className={styles.thresholdCopy}>
          <p className="kicker">A real place, not a rendering</p>
          <h1 id="space-title">{body.name}</h1>
          <p className={styles.thresholdPromise}>{body.promise}</p>
          <div className={styles.thresholdActions}>
            <button className="primary-button" onClick={() => startExperience()}>
              Begin exploring <ArrowRight size={18} aria-hidden="true" />
            </button>
            <button
              className="text-button"
              onClick={() => {
                setSimplifiedView(true);
                startExperience();
              }}
            >
              <Eye size={16} aria-hidden="true" /> Use simplified view
            </button>
          </div>
        </div>

        <div className={styles.thresholdMeta}>
          <span>Drag to rotate · scroll to zoom · click a marker</span>
          <span>{body.hotspots.length} catalogued sites</span>
          <MoveDown size={17} aria-hidden="true" />
        </div>
      </section>
    );
  }

  return (
    <section
      className={styles.experience}
      style={{ ["--space-accent" as string]: body.accent }}
      aria-label={`${body.name} interactive exhibit`}
    >
      <div className={styles.hud}>
        <Link className="museum-mark" href="/" aria-label="Return to Loupe museum">
          <span className="museum-mark__orb" aria-hidden="true" />
          <span>LOUPE</span>
        </Link>
        <div className={styles.hudTitle}>
          <h2>{body.name}</h2>
          <span>
            {visitedHotspotIds.length} / {body.hotspots.length} explored
          </span>
        </div>
        <div className={styles.hudControls} aria-label="Experience preferences">
          <button
            aria-label={reducedMotion ? "Enable full motion" : "Reduce motion"}
            aria-pressed={reducedMotion}
            onClick={() => setReducedMotion(!reducedMotion)}
            title={reducedMotion ? "Enable full motion" : "Reduce motion"}
          >
            <Waves size={16} aria-hidden="true" />
          </button>
          <button
            aria-label={simplifiedView ? "Switch to 3D globe" : "Switch to simplified view"}
            aria-pressed={simplifiedView}
            onClick={() => setSimplifiedView(!simplifiedView)}
            title={simplifiedView ? "Switch to 3D globe" : "Switch to simplified view"}
          >
            {simplifiedView ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <SpaceModeBar body={body} activeModeId={activeModeId} onSelectMode={setMode} />

      {!simplifiedView && webglAvailable ? (
        <SpaceCanvas
          body={body}
          visibleHotspots={visibleHotspots}
          selectedHotspotId={selectedHotspotId}
          flyToId={flyToId}
          isNightMode={activeModeId === "lights"}
          isWaterMode={activeModeId === "water"}
          reducedMotion={reducedMotion}
          categoryColor={categoryColor}
          onSelectHotspot={selectHotspot}
          onFlightSettled={clearFlyTo}
        />
      ) : (
        <SpaceFallback
          body={body}
          visibleHotspots={visibleHotspots}
          onSelect={selectHotspot}
          categoryColor={categoryColor}
        />
      )}

      <HotspotPanel
        body={body}
        visibleHotspots={visibleHotspots}
        selectedHotspotId={selectedHotspotId}
        onSelect={selectHotspot}
        categoryColor={categoryColor}
        categoryLabel={categoryLabel}
      />
    </section>
  );
}
