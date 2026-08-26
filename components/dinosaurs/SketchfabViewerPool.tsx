"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import {
  getDinosaurLifeModel,
  getDinosaurSpecies,
  type DinosaurSpeciesId,
} from "@/content/dinosaurs";
import DinosaurSpecimenViewer from "./DinosaurSpecimenViewer";
import type { DinosaurCameraCommand, ExhibitTheme } from "./dinosaur-viewer-types";
import styles from "./dinosaur-experience.module.css";

const MAX_ALIVE = 3;
const IDLE_COMMAND: DinosaurCameraCommand = { id: 0, type: "reset" };

// Trace / anatomy / lineage tabs all overlay the same base specimen scan
// shown in "skeleton" — only "life" swaps to a genuinely different
// Sketchfab model — so the pool key collapses to just these two content
// states rather than one per UI tab.
export type ViewerContent = "specimen" | "life";

export function keyFor(speciesId: DinosaurSpeciesId, content: ViewerContent) {
  return `${speciesId}:${content}`;
}

function parseKey(key: string): { speciesId: DinosaurSpeciesId; content: ViewerContent } {
  const [speciesId, content] = key.split(":") as [DinosaurSpeciesId, ViewerContent];
  return { speciesId, content };
}

/**
 * Keeps up to MAX_ALIVE previously-viewed Sketchfab specimens mounted (just
 * hidden and paused) instead of destroying and re-creating their iframe +
 * client.init() on every switch. Revisiting one of those is then instant —
 * the model is already loaded — rather than re-running the whole Sketchfab
 * boot sequence from scratch.
 */
export function SketchfabViewerPool({
  activeKey,
  reducedMotion,
  command,
  theme,
  showHotspots,
  selectedBoneIndex,
  onBoneSelect,
  onActiveReady,
}: {
  // null when the currently displayed specimen is a local GLB, not a
  // Sketchfab one — the pool then shows nothing but keeps every previously
  // loaded layer alive underneath, so passing through a local species and
  // back doesn't evict the Sketchfab specimens the user already warmed.
  activeKey: string | null;
  reducedMotion: boolean;
  command: DinosaurCameraCommand;
  theme: ExhibitTheme;
  showHotspots?: boolean;
  selectedBoneIndex?: number;
  onBoneSelect?: (index: number) => void;
  onActiveReady: () => void;
}) {
  const [aliveKeys, setAliveKeys] = useState<string[]>(activeKey ? [activeKey] : []);
  const readyKeys = useRef(new Set<string>());
  const activeKeyRef = useRef(activeKey);
  const onActiveReadyRef = useRef(onActiveReady);
  activeKeyRef.current = activeKey;
  onActiveReadyRef.current = onActiveReady;

  useLayoutEffect(() => {
    if (!activeKey) return;
    setAliveKeys((previous) => {
      const withoutActive = previous.filter((key) => key !== activeKey);
      const next = [...withoutActive, activeKey];
      if (next.length <= MAX_ALIVE) return next;
      const evicted = next.slice(0, next.length - MAX_ALIVE);
      for (const key of evicted) readyKeys.current.delete(key);
      return next.slice(next.length - MAX_ALIVE);
    });
    // A key that already finished loading earlier this session is safe to
    // treat as instantly ready — the pooled instance never unmounted.
    if (readyKeys.current.has(activeKey)) onActiveReady();
  }, [activeKey, onActiveReady]);

  const handleKeyReady = useCallback((key: string) => {
    readyKeys.current.add(key);
    if (key === activeKeyRef.current) onActiveReadyRef.current();
  }, []);

  return (
    <>
      {aliveKeys.map((key) => (
        <PooledLayer
          key={key}
          layerKey={key}
          isActive={key === activeKey}
          reducedMotion={reducedMotion}
          command={command}
          theme={theme}
          showHotspots={showHotspots}
          selectedBoneIndex={selectedBoneIndex}
          onBoneSelect={onBoneSelect}
          onKeyReady={handleKeyReady}
        />
      ))}
    </>
  );
}

function PooledLayer({
  layerKey,
  isActive,
  reducedMotion,
  command,
  theme,
  showHotspots,
  selectedBoneIndex,
  onBoneSelect,
  onKeyReady,
}: {
  layerKey: string;
  isActive: boolean;
  reducedMotion: boolean;
  command: DinosaurCameraCommand;
  theme: ExhibitTheme;
  showHotspots?: boolean;
  selectedBoneIndex?: number;
  onBoneSelect?: (index: number) => void;
  onKeyReady: (key: string) => void;
}) {
  const { speciesId, content } = parseKey(layerKey);
  const species = getDinosaurSpecies(speciesId);
  const lifeModel = content === "life" ? getDinosaurLifeModel(speciesId) : undefined;
  const handleReady = useCallback(() => onKeyReady(layerKey), [layerKey, onKeyReady]);

  return (
    <div className={styles.pooledLayer} data-active={isActive}>
      <DinosaurSpecimenViewer
        species={species}
        lifeModel={lifeModel}
        reducedMotion={reducedMotion}
        staticView={false}
        command={isActive ? command : IDLE_COMMAND}
        theme={theme}
        showHotspots={isActive ? showHotspots : false}
        selectedBoneIndex={isActive ? selectedBoneIndex : 0}
        onBoneSelect={isActive ? onBoneSelect : undefined}
        onReady={handleReady}
      />
    </div>
  );
}

export default SketchfabViewerPool;
