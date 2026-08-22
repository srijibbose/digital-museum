"use client";

import { anatomy } from "@/content/anatomy";
import type { AnatomySystem, AnatomySystemId } from "@/lib/anatomy/anatomy-schema";
import styles from "./anatomy.module.css";

const modelPaths = new Map(anatomy.models.map((model) => [model.key, model.path]));
const prefetchedPaths = new Set<string>();

function prefetchSystem(system: AnatomySystem) {
  if (typeof document === "undefined") return;
  system.modelKeys.forEach((key) => {
    const path = modelPaths.get(key);
    if (!path || prefetchedPaths.has(path)) return;
    prefetchedPaths.add(path);
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.as = "fetch";
    link.href = path;
    link.crossOrigin = "anonymous";
    document.head.append(link);
  });
}

export function SystemIndex({
  systems,
  activeSystemId,
  onSelect,
}: {
  systems: AnatomySystem[];
  activeSystemId: AnatomySystemId;
  onSelect: (id: AnatomySystemId) => void;
}) {
  return (
    <aside className={styles.systemIndex} aria-label="Body systems">
      <p className={styles.railLabel}>Systems in this release</p>
      <ol>
        {systems.map((system) => (
          <li key={system.id}>
            <button
              type="button"
              data-active={system.id === activeSystemId || undefined}
              aria-current={system.id === activeSystemId ? "true" : undefined}
              onPointerEnter={() => prefetchSystem(system)}
              onFocus={() => prefetchSystem(system)}
              onClick={() => onSelect(system.id)}
            >
              <span>{system.index}</span>
              <strong>{system.shortLabel}</strong>
              <small>{system.territory}</small>
            </button>
          </li>
        ))}
      </ol>
      <div className={styles.releaseNote}>
        <span>Reference sources</span>
        <p>HRA + BodyParts3D</p>
        <small>Open reference anatomy, not a universal or patient-specific body.</small>
      </div>
    </aside>
  );
}
