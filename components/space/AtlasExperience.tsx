"use client";

import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useStore } from "zustand";
import { atlas, getMode, getVisibleHotspots, getWorld } from "@/content/space/atlas";
import type { WorldId } from "@/lib/space/atlas-schema";
import { createAtlasStore } from "@/lib/space/atlas-store";
import { formatAtlasInteger } from "@/lib/space/number-format";
import { CommandDeck } from "./CommandDeck";
import { CompareTray } from "./CompareTray";
import { FeatureRail } from "./FeatureRail";
import { FieldGuide } from "./FieldGuide";
import { LightingControl } from "./LightingControl";
import { OrientationReadout } from "./OrientationReadout";
import { AtlasStage } from "./AtlasStage";
import { WorldIndex } from "./WorldIndex";
import styles from "./atlas.module.css";

export function AtlasExperience({ initialWorld }: { initialWorld: WorldId }) {
  const [store] = useState(() => createAtlasStore(initialWorld));
  const worldId = useStore(store, (state) => state.worldId);
  const activeModeId = useStore(store, (state) => state.activeModeId);
  const selectedHotspotId = useStore(store, (state) => state.selectedHotspotId);
  const visitedByWorld = useStore(store, (state) => state.visitedByWorld);
  const theme = useStore(store, (state) => state.theme);
  const reducedMotion = useStore(store, (state) => state.reducedMotion);
  const lightingMode = useStore(store, (state) => state.lightingMode);
  const lightAzimuth = useStore(store, (state) => state.lightAzimuth);
  const lightElevation = useStore(store, (state) => state.lightElevation);
  const motionEnabled = useStore(store, (state) => state.motionEnabled);
  const focusCommand = useStore(store, (state) => state.focusCommand);
  const orientation = useStore(store, (state) => state.orientation);
  const compareOpen = useStore(store, (state) => state.compareOpen);
  const compareWorldId = useStore(store, (state) => state.compareWorldId);
  const compareScalePolicy = useStore(store, (state) => state.compareScalePolicy);
  const cameraCommand = useStore(store, (state) => state.cameraCommand);

  const setWorld = useStore(store, (state) => state.setWorld);
  const setMode = useStore(store, (state) => state.setMode);
  const focusHotspot = useStore(store, (state) => state.focusHotspot);
  const clearFocus = useStore(store, (state) => state.clearFocus);
  const toggleTheme = useStore(store, (state) => state.toggleTheme);
  const setReducedMotion = useStore(store, (state) => state.setReducedMotion);
  const setLightingMode = useStore(store, (state) => state.setLightingMode);
  const setLight = useStore(store, (state) => state.setLight);
  const toggleMotion = useStore(store, (state) => state.toggleMotion);
  const setOrientation = useStore(store, (state) => state.setOrientation);
  const openCompare = useStore(store, (state) => state.openCompare);
  const closeCompare = useStore(store, (state) => state.closeCompare);
  const setCompareWorld = useStore(store, (state) => state.setCompareWorld);
  const setCompareScalePolicy = useStore(store, (state) => state.setCompareScalePolicy);
  const issueCameraCommand = useStore(store, (state) => state.issueCameraCommand);

  const world = getWorld(worldId);
  const activeMode = getMode(world, activeModeId);
  const visibleHotspots = getVisibleHotspots(world, activeModeId);
  const selectedHotspot =
    world.hotspots.find((hotspot) => hotspot.id === selectedHotspotId) ?? null;
  const visitedCount = visitedByWorld[world.id].length;
  const compareWorld = compareOpen ? getWorld(compareWorldId) : null;

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, [setReducedMotion]);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("world", worldId);
    window.history.replaceState(window.history.state, "", url);
  }, [worldId]);

  return (
    <section
      className={styles.instrument}
      data-testid="atlas-instrument"
      data-theme={theme}
      style={{ "--world-accent": world.accent } as React.CSSProperties}
      aria-label="Atlas of Worlds interactive exhibit"
    >
      <header className={styles.atlasHeader}>
        <div className={styles.atlasIdentity}>
          <Link className="museum-mark" href="/" aria-label="Loupe museum home">
            <span className="museum-mark__orb" aria-hidden="true" />
            <span>LOUPE</span>
          </Link>
          <i className={styles.identityDivider} aria-hidden="true" />
          <span className={styles.atlasTitle}>Atlas of Worlds</span>
        </div>
        <nav className={styles.primaryNav} aria-label="Exhibit sections">
          <a href="#atlas-stage" aria-current="page">Collection</a>
          <a href="#field-guide">Guided tours</a>
          <a href="#atlas-sources">Sources</a>
        </nav>
        <div className={styles.themeControl}>
          <span>Theme</span>
          <button
            type="button"
            aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
            aria-pressed={theme === "dark"}
            onClick={toggleTheme}
          >
            <Sun size={16} aria-hidden="true" />
            <Moon size={15} aria-hidden="true" />
            <i data-position={theme} aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className={styles.instrumentGrid}>
        <WorldIndex
          worlds={atlas.worlds}
          selectedWorldId={worldId}
          reducedMotion={reducedMotion}
          onSelectWorld={setWorld}
        />

        <main
          className={styles.stage}
          id="atlas-stage"
          data-testid="atlas-stage"
          data-camera-command={cameraCommand.type}
          data-camera-sequence={cameraCommand.sequence}
        >
          <div className={styles.stageMeta}>
            <span>{world.orderLabel}</span>
            <strong>{world.classification}</strong>
          </div>

          <OrientationReadout
            latitude={orientation.latitude}
            longitude={orientation.longitude}
          />

          <div className={styles.worldStage}>
            <div className={styles.worldHalo} aria-hidden="true" />
            <AtlasStage
              world={world}
              mode={activeMode}
              selectedHotspotId={selectedHotspotId}
              lightingMode={lightingMode}
              lightAzimuth={lightAzimuth}
              lightElevation={lightElevation}
              reducedMotion={reducedMotion}
              motionEnabled={motionEnabled}
              focusCommand={focusCommand}
              cameraCommand={cameraCommand}
              compareWorld={compareWorld}
              compareScalePolicy={compareScalePolicy}
              onSelectHotspot={focusHotspot}
              onOrientationChange={setOrientation}
              onManualOrbit={clearFocus}
            />
          </div>

          <FeatureRail
            hotspots={visibleHotspots}
            selectedHotspotId={selectedHotspotId}
            onSelect={focusHotspot}
            onClear={clearFocus}
          />

          <div className={styles.scaleBar} aria-label={`Scale reference for ${world.name}`}>
            <span>{formatAtlasInteger(Math.round(world.physical.radiusKm / 2))} km</span>
            <i aria-hidden="true" />
          </div>

          <LightingControl
            policy={activeMode.lighting}
            mode={lightingMode}
            azimuth={lightAzimuth}
            elevation={lightElevation}
            onModeChange={setLightingMode}
            onAngleChange={setLight}
          />

          {compareOpen ? (
            <CompareTray
              worlds={atlas.worlds}
              primaryWorld={world}
              compareWorldId={compareWorldId}
              scalePolicy={compareScalePolicy}
              onSelectWorld={setCompareWorld}
              onSetScalePolicy={setCompareScalePolicy}
              onClose={closeCompare}
            />
          ) : null}

          <CommandDeck
            world={world}
            activeModeId={activeModeId}
            compareOpen={compareOpen}
            motionEnabled={motionEnabled}
            reducedMotion={reducedMotion}
            onSelectMode={setMode}
            onCameraCommand={issueCameraCommand}
            onToggleCompare={compareOpen ? closeCompare : openCompare}
            onToggleMotion={toggleMotion}
          />

          <p className={styles.liveStatus} aria-live="polite">
            {world.name}. {activeMode.label} mode. {visibleHotspots.length} features visible.
          </p>
        </main>

        <div id="field-guide">
          <FieldGuide
            world={world}
            selectedHotspot={selectedHotspot}
            visitedCount={visitedCount}
          />
        </div>
      </div>
    </section>
  );
}
