"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import type { ChapterScene, WorldPack } from "@/content/becoming-human-scenes";
import styles from "./becoming-human.module.css";

const WorldCanvas = dynamic(() => import("./WorldCanvas").then((module) => module.WorldCanvas), { ssr: false });

const motes = Array.from({ length: 34 }, (_, index) => ({
  x: (index * 37 + 11) % 101,
  y: (index * 61 + 7) % 103,
  delay: -((index * 0.43) % 9),
  duration: 5.5 + (index % 8) * 0.72,
  size: 2 + (index % 4),
}));

export function EnvironmentalStage({
  world,
  scene,
  progress,
  evidenceMode,
  reducedMotion,
  webglAvailable,
}: {
  world: WorldPack;
  scene: ChapterScene;
  progress: number;
  evidenceMode: boolean;
  reducedMotion: boolean;
  webglAvailable: boolean;
}) {
  const [previousPlate, setPreviousPlate] = useState<{ world: WorldPack; style: CSSProperties }>();
  const [canvasReady, setCanvasReady] = useState(false);
  const currentPlateRef = useRef<{ world: WorldPack; style: CSSProperties } | undefined>(undefined);

  const onReady = useCallback(() => setCanvasReady(true), []);
  const plateStyle = useMemo(() => ({
    objectPosition: scene.focalPoint,
    transform: `scale(${scene.scale + (reducedMotion ? 0 : progress * 0.035)}) translate3d(${(0.5 - progress) * 0.7}%, ${(progress - 0.5) * 0.35}%, 0)`,
  }), [progress, reducedMotion, scene.focalPoint, scene.scale]);

  useEffect(() => {
    const previous = currentPlateRef.current;
    if (previous && previous.world.id !== world.id) {
      setPreviousPlate(previous);
      setCanvasReady(false);
      const timer = window.setTimeout(() => setPreviousPlate(undefined), 1300);
      currentPlateRef.current = { world, style: plateStyle };
      return () => window.clearTimeout(timer);
    }
    currentPlateRef.current = { world, style: plateStyle };
  }, [world]);

  useEffect(() => {
    currentPlateRef.current = { world, style: plateStyle };
  }, [plateStyle, world]);

  return (
    <div
      className={styles.environmentalStage}
      data-atmosphere={world.atmosphere}
      data-canvas-ready={canvasReady && webglAvailable && !reducedMotion}
      data-composition={scene.composition}
      data-evidence={evidenceMode}
      style={{
        "--world-bg": world.background,
        "--world-haze": world.haze,
        "--world-light": world.light,
        "--scene-accent": scene.accent,
      } as React.CSSProperties}
    >
      {previousPlate && (
        <div className={`${styles.worldPlate} ${styles.worldPlatePrevious}`} key={previousPlate.world.id}>
          <Image alt="" aria-hidden="true" fill priority sizes="100vw" src={previousPlate.world.plate} style={previousPlate.style} />
        </div>
      )}
      <div className={styles.worldPlate} key={world.id}>
        <Image alt="" aria-hidden="true" fill priority sizes="100vw" src={world.plate} style={plateStyle} />
      </div>

      {webglAvailable && !reducedMotion && (
        <WorldCanvas onReady={onReady} progress={progress} reducedMotion={reducedMotion} scene={scene} world={world} />
      )}

      <div className={styles.atmosphere} aria-hidden="true">
        {motes.map((mote, index) => (
          <i
            key={index}
            style={{
              "--mote-x": `${mote.x}%`,
              "--mote-y": `${mote.y}%`,
              "--mote-delay": `${mote.delay}s`,
              "--mote-duration": `${mote.duration}s`,
              "--mote-size": `${mote.size}px`,
            } as React.CSSProperties}
          />
        ))}
      </div>
      <div className={styles.depthVeil} aria-hidden="true" />

      {scene.evidenceMedia && (
        <figure className={styles.evidenceArtifact} data-treatment={scene.evidenceMedia.treatment}>
          <a href={scene.evidenceMedia.sourceUrl} rel="noreferrer" target="_blank">
            <span className={styles.evidenceArtifactImage}>
              <Image alt={scene.evidenceMedia.alt} fill sizes="(max-width: 760px) 46vw, 28vw" src={scene.evidenceMedia.src} />
            </span>
            <figcaption>
              <strong>{scene.evidenceMedia.label}</strong>
              <span>{scene.evidenceMedia.credit}</span>
              <small>{scene.evidenceMedia.license} ↗</small>
            </figcaption>
          </a>
        </figure>
      )}

      <p className={styles.sceneAlt}>{world.ariaDescription}</p>
      <div className={styles.worldTitle} aria-hidden="true"><span>{world.title}</span><i /></div>
    </div>
  );
}
