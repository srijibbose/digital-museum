"use client";

import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useStore } from "zustand";
import { atlas, getMode, getVisibleHotspots, getWorld } from "@/content/space/atlas";
import type { WorldId } from "@/lib/space/atlas-schema";
import { createAtlasStore } from "@/lib/space/atlas-store";
import { CommandDeck } from "./CommandDeck";
import { CompareTray } from "./CompareTray";
import { FieldGuide } from "./FieldGuide";
import { WorldIndex } from "./WorldIndex";
import styles from "./atlas.module.css";

function markerPosition(lat: number, lon: number) {
  return {
    left: `${50 + (lon / 180) * 31}%`,
    top: `${50 - (lat / 90) * 34}%`,
  };
}

export function AtlasExperience({ initialWorld }: { initialWorld: WorldId }) {
  const [store] = useState(() => createAtlasStore(initialWorld));
  const worldId = useStore(store, (state) => state.worldId);
  const activeModeId = useStore(store, (state) => state.activeModeId);
  const selectedHotspotId = useStore(store, (state) => state.selectedHotspotId);
  const visitedByWorld = useStore(store, (state) => state.visitedByWorld);
  const theme = useStore(store, (state) => state.theme);
  const lightAzimuth = useStore(store, (state) => state.lightAzimuth);
  const lightElevation = useStore(store, (state) => state.lightElevation);
  const compareOpen = useStore(store, (state) => state.compareOpen);
  const compareWorldId = useStore(store, (state) => state.compareWorldId);
  const compareScalePolicy = useStore(store, (state) => state.compareScalePolicy);
  const cameraCommand = useStore(store, (state) => state.cameraCommand);

  const setWorld = useStore(store, (state) => state.setWorld);
  const setMode = useStore(store, (state) => state.setMode);
  const selectHotspot = useStore(store, (state) => state.selectHotspot);
  const toggleTheme = useStore(store, (state) => state.toggleTheme);
  const setReducedMotion = useStore(store, (state) => state.setReducedMotion);
  const setLight = useStore(store, (state) => state.setLight);
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

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, [setReducedMotion]);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("world", worldId);
    window.history.replaceState(window.history.state, "", url);
  }, [worldId]);

  const stageTexture = useMemo(() => {
    if (activeMode.textureKey) {
      return world.assets.layers[activeMode.textureKey] ?? world.assets.color;
    }
    return world.assets.color;
  }, [activeMode.textureKey, world]);

  return (
    <section
      className={styles.instrument}
      data-testid="atlas-instrument"
      data-theme={theme}
      style={{ "--world-accent": world.accent } as React.CSSProperties}
      aria-label="Atlas of Worlds interactive exhibit"
    >
      <header className={styles.atlasHeader}>
        <Link className={styles.atlasTitle} href="/" aria-label="Return to the digital museum">
          Atlas of Worlds
        </Link>
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

          <div className={styles.compass} aria-label="Orientation north">
            <span>N</span>
            <i aria-hidden="true" />
          </div>

          <div className={styles.worldStage}>
            <div className={styles.worldHalo} aria-hidden="true" />
            <img
              className={styles.shellPreview}
              src={stageTexture}
              alt={`${world.name} ${activeMode.label.toLowerCase()} scientific globe`}
            />
            <div className={styles.markerLayer} aria-label={`${world.name} visible features`}>
              {visibleHotspots.map((hotspot, index) => (
                <button
                  type="button"
                  key={hotspot.id}
                  className={styles.featureMarker}
                  data-selected={hotspot.id === selectedHotspotId || undefined}
                  style={markerPosition(hotspot.lat, hotspot.lon)}
                  aria-label={`Explore ${hotspot.label}`}
                  onClick={() => selectHotspot(hotspot.id)}
                >
                  <span>{index + 1}</span>
                  <strong>{hotspot.label}</strong>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.scaleBar} aria-label={`Scale reference for ${world.name}`}>
            <span>{Math.round(world.physical.radiusKm / 2).toLocaleString()} km</span>
            <i aria-hidden="true" />
          </div>

          <div className={styles.lightControl}>
            <Sun size={17} aria-hidden="true" />
            <label>
              <span>Sunlight</span>
              <input
                type="range"
                min="0"
                max="359"
                value={lightAzimuth}
                aria-label="Sunlight azimuth"
                onChange={(event) => setLight(Number(event.target.value), lightElevation)}
              />
            </label>
            <label>
              <span>Elevation</span>
              <input
                type="range"
                min="-10"
                max="80"
                value={lightElevation}
                aria-label="Sunlight elevation"
                onChange={(event) => setLight(lightAzimuth, Number(event.target.value))}
              />
            </label>
          </div>

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
            onSelectMode={setMode}
            onCameraCommand={issueCameraCommand}
            onToggleCompare={compareOpen ? closeCompare : openCompare}
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
