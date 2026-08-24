"use client";

import { type CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import type { DinosaurLifeModel, DinosaurSpecies } from "@/content/dinosaurs";
import { DinosaurCanvas } from "./DinosaurCanvas";
import type { DinosaurCameraCommand, ExhibitTheme } from "./dinosaur-viewer-types";
import { loadSketchfabScript, type SketchfabApi } from "./sketchfab-loader";
import styles from "./dinosaur-experience.module.css";

export type { DinosaurCameraCommand } from "./dinosaur-viewer-types";
export { preconnectSketchfab, preloadSketchfabViewer } from "./sketchfab-loader";

const hostedHotspotPositions: Partial<
  Record<DinosaurSpecies["id"], { x: number; y: number }[]>
> = {
  allosaurus: [
    { x: 52, y: 29 },
    { x: 50, y: 64 },
    { x: 16, y: 31 },
    { x: 84, y: 28 },
  ],
  archaeopteryx: [
    { x: 59, y: 34 },
    { x: 40, y: 72 },
    { x: 57, y: 43 },
    { x: 47, y: 40 },
  ],
};

function viewerBackground(theme: ExhibitTheme): [number, number, number] {
  return theme === "dark" ? [0.067, 0.082, 0.071] : [0.898, 0.89, 0.863];
}

export async function preloadLocalDinosaurViewer(modelPath: string) {
  const { preloadMuseumModel } = await import("./DinosaurCanvas");
  preloadMuseumModel(modelPath);
}

function applySketchfabCommand(api: SketchfabApi, command: DinosaurCameraCommand) {
  if (command.type === "reset") {
    api.recenterCamera();
    return;
  }
  api.getCameraLookAt(({ position, target }) => {
    const [px, py, pz] = position;
    const [tx, ty, tz] = target;
    const dx = px - tx;
    const dy = py - ty;
    const dz = pz - tz;
    if (command.type === "zoom-in" || command.type === "zoom-out") {
      const factor = command.type === "zoom-in" ? 0.78 : 1.28;
      api.setCameraLookAt(
        [tx + dx * factor, ty + dy * factor, tz + dz * factor],
        target,
        0.45,
      );
      return;
    }
    const angle = command.type === "rotate-left" ? -Math.PI / 5 : Math.PI / 5;
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    api.setCameraLookAt(
      [tx + dx * cos - dz * sin, ty + dy, tz + dx * sin + dz * cos],
      target,
      0.55,
    );
  });
}

function StaticSpecimen({
  species,
  lifeModel,
}: {
  species: DinosaurSpecies;
  lifeModel?: DinosaurLifeModel;
}) {
  const label = lifeModel
    ? `${species.commonName} life reconstruction static view`
    : `${species.commonName} museum specimen static view`;
  return (
    <div className={styles.staticSpecimen} role="img" aria-label={label}>
      <img src={lifeModel?.preview ?? species.specimen.preview} alt="" />
      <span>{lifeModel ? "Static reconstruction record" : "Static museum record"}</span>
    </div>
  );
}

function HostedSpecimenHotspots({
  species,
  selectedBoneIndex = 0,
  onBoneSelect,
}: {
  species: DinosaurSpecies;
  selectedBoneIndex?: number;
  onBoneSelect?: (index: number) => void;
}) {
  const points = hostedHotspotPositions[species.id];
  if (!points) return null;

  return (
    <div className={styles.hostedHotspots} aria-label={`${species.commonName} anatomical inspection markers`}>
      {points.map((point, index) => {
        const region = species.boneRegions[index];
        if (!region) return null;
        return (
          <button
            key={region.id}
            type="button"
            className={styles.specimenHotspot}
            data-active={index === selectedBoneIndex}
            aria-label={`Inspect ${region.label}`}
            title={region.label}
            style={{ "--hotspot-x": `${point.x}%`, "--hotspot-y": `${point.y}%` } as CSSProperties}
            onClick={() => onBoneSelect?.(index)}
          >
            <span>{index + 1}</span>
          </button>
        );
      })}
    </div>
  );
}

function SketchfabSpecimen({
  species,
  lifeModel,
  theme,
  command,
  reducedMotion,
  showHotspots,
  selectedBoneIndex,
  onBoneSelect,
  onReady,
}: {
  species: DinosaurSpecies;
  lifeModel?: DinosaurLifeModel;
  theme: ExhibitTheme;
  command: DinosaurCameraCommand;
  reducedMotion: boolean;
  showHotspots?: boolean;
  selectedBoneIndex?: number;
  onBoneSelect?: (index: number) => void;
  onReady?: () => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const iframe = useRef<HTMLIFrameElement>(null);
  const api = useRef<SketchfabApi | null>(null);
  const intersecting = useRef(true);
  const running = useRef(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const themeRef = useRef(theme);
  const modelUid = lifeModel?.sketchfabUid ?? species.specimen.sketchfabUid;

  const syncPlayback = useCallback(() => {
    const viewerApi = api.current;
    if (!viewerApi) return;
    const shouldRun = intersecting.current && document.visibilityState === "visible";
    if (shouldRun && !running.current) {
      viewerApi.start();
      running.current = true;
    } else if (!shouldRun && running.current) {
      viewerApi.stop?.();
      running.current = false;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    setReady(false);
    setFailed(false);
    api.current = null;
    running.current = false;
    loadSketchfabScript()
      .then(() => {
        if (cancelled || !iframe.current || !window.Sketchfab) return;
        const client = new window.Sketchfab("1.12.1", iframe.current);
        client.init(modelUid, {
          autostart: 1,
          preload: 0,
          transparent: 0,
          ui_controls: 0,
          ui_infos: 0,
          ui_stop: 0,
          ui_watermark: 1,
          ui_annotations: 1,
          ui_hint: 0,
          ui_inspector: 0,
          ui_settings: 0,
          ui_help: 0,
          ui_vr: 0,
          ui_fullscreen: 0,
          animation_autoplay: reducedMotion ? 0 : 1,
          dnt: 1,
          success(viewerApi) {
            api.current = viewerApi;
            viewerApi.start();
            running.current = true;
            syncPlayback();
            viewerApi.addEventListener("viewerready", () => {
              if (cancelled) return;
              viewerApi.setBackground?.({ color: viewerBackground(themeRef.current) });
              viewerApi.setTextureQuality?.("hd");
              setReady(true);
              onReady?.();
            });
          },
          error() {
            if (!cancelled) setFailed(true);
          },
        });
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
      api.current?.stop?.();
      api.current = null;
      running.current = false;
    };
  }, [modelUid, onReady, reducedMotion, syncPlayback]);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      intersecting.current = entry?.isIntersecting ?? true;
      syncPlayback();
    }, { rootMargin: "160px" });
    observer.observe(element);
    document.addEventListener("visibilitychange", syncPlayback);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
    };
  }, [syncPlayback]);

  useEffect(() => {
    themeRef.current = theme;
    api.current?.setBackground?.({ color: viewerBackground(theme) });
  }, [theme]);

  useEffect(() => {
    if (api.current && command.id > 0) applySketchfabCommand(api.current, command);
  }, [command]);

  return (
    <div ref={container} className={styles.remoteViewer} data-ready={ready} data-failed={failed}>
      <iframe
        ref={iframe}
        title={
          lifeModel
            ? `${species.commonName} interactive 3D life reconstruction`
            : `${species.commonName} institutional 3D specimen`
        }
        allow="autoplay; fullscreen; xr-spatial-tracking"
        allowFullScreen
      />
      {showHotspots && !lifeModel ? (
        <HostedSpecimenHotspots
          species={species}
          selectedBoneIndex={selectedBoneIndex}
          onBoneSelect={onBoneSelect}
        />
      ) : null}
      {failed ? (
        <>
          <StaticSpecimen species={species} lifeModel={lifeModel} />
          <p className={styles.viewerError}>
            {lifeModel
              ? "Interactive reconstruction unavailable. Showing its credited static record."
              : "Interactive scan unavailable. Showing its licensed museum record."}
          </p>
        </>
      ) : null}
    </div>
  );
}

export function DinosaurSpecimenViewer({
  species,
  reducedMotion,
  staticView,
  command,
  lifeModel,
  theme,
  showHotspots,
  selectedBoneIndex,
  onBoneSelect,
  onReady,
}: {
  species: DinosaurSpecies;
  reducedMotion: boolean;
  staticView: boolean;
  command: DinosaurCameraCommand;
  lifeModel?: DinosaurLifeModel;
  theme: ExhibitTheme;
  showHotspots?: boolean;
  selectedBoneIndex?: number;
  onBoneSelect?: (index: number) => void;
  onReady?: () => void;
}) {
  if (staticView) return <StaticSpecimen species={species} lifeModel={lifeModel} />;
  if (lifeModel || species.specimen.provider === "sketchfab") {
    return (
      <SketchfabSpecimen
        species={species}
        lifeModel={lifeModel}
        theme={theme}
        command={command}
        reducedMotion={reducedMotion}
        showHotspots={showHotspots}
        selectedBoneIndex={selectedBoneIndex}
        onBoneSelect={onBoneSelect}
        onReady={onReady}
      />
    );
  }
  return (
    <DinosaurCanvas
      species={species}
      reducedMotion={reducedMotion}
      command={command}
      showHotspots={showHotspots}
      selectedBoneIndex={selectedBoneIndex}
      onBoneSelect={onBoneSelect}
      onReady={onReady}
    />
  );
}

export default DinosaurSpecimenViewer;
