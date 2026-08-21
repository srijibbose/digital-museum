"use client";

import { useEffect, useRef } from "react";
import type { PlanetaryWorld, WorldId } from "@/lib/space/atlas-schema";
import styles from "./atlas.module.css";

export function WorldIndex({
  worlds,
  selectedWorldId,
  reducedMotion,
  onSelectWorld,
}: {
  worlds: PlanetaryWorld[];
  selectedWorldId: WorldId;
  reducedMotion: boolean;
  onSelectWorld: (worldId: WorldId) => void;
}) {
  const listRef = useRef<HTMLDivElement | null>(null);
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    const activeIndex = worlds.findIndex((world) => world.id === selectedWorldId);
    const activeButton = buttons.current[activeIndex];
    const list = listRef.current;
    if (activeButton && list && typeof list.scrollTo === "function") {
      const centeredLeft =
        activeButton.offsetLeft - (list.clientWidth - activeButton.offsetWidth) / 2;
      list.scrollTo({
        left: Math.max(0, centeredLeft),
        behavior: reducedMotion ? "auto" : "smooth",
      });
    }
  }, [reducedMotion, selectedWorldId, worlds]);

  function moveFrom(index: number, delta: number) {
    const next = (index + delta + worlds.length) % worlds.length;
    onSelectWorld(worlds[next].id);
    window.setTimeout(() => buttons.current[next]?.focus(), 0);
  }

  return (
    <nav className={styles.worldIndex} aria-label="World Index">
      <p className={styles.sectionLabel}>World index</p>
      <div ref={listRef} className={styles.worldList}>
        {worlds.map((world, index) => {
          const active = world.id === selectedWorldId;
          return (
            <button
              key={world.id}
              ref={(element) => {
                buttons.current[index] = element;
              }}
              type="button"
              className={styles.worldButton}
              data-active={active || undefined}
              aria-current={active ? "true" : undefined}
              aria-label={`${world.name}, ${world.classification}`}
              onClick={() => onSelectWorld(world.id)}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                  event.preventDefault();
                  moveFrom(index, 1);
                }
                if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                  event.preventDefault();
                  moveFrom(index, -1);
                }
                if (event.key === "Home") {
                  event.preventDefault();
                  onSelectWorld(worlds[0].id);
                  window.setTimeout(() => buttons.current[0]?.focus(), 0);
                }
                if (event.key === "End") {
                  event.preventDefault();
                  const last = worlds.length - 1;
                  onSelectWorld(worlds[last].id);
                  window.setTimeout(() => buttons.current[last]?.focus(), 0);
                }
              }}
            >
              <span className={styles.worldThumb} aria-hidden="true">
                <img src={world.assets.fallback} alt="" />
              </span>
              <span className={styles.worldName}>{world.name}</span>
              <span className={styles.worldOrder}>{world.orderLabel}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
