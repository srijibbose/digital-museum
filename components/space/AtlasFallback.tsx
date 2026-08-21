"use client";

import type { PlanetaryWorld, WorldMode } from "@/lib/space/atlas-schema";
import styles from "./atlas.module.css";

export type AtlasFallbackReason = "webgl-unavailable" | "texture-error";

function fallbackTexture(world: PlanetaryWorld, mode: WorldMode) {
  if (mode.textureKey) return world.assets.layers[mode.textureKey] ?? world.assets.fallback;
  return world.assets.fallback;
}

export function AtlasFallback({
  world,
  mode,
  reason = "webgl-unavailable",
}: {
  world: PlanetaryWorld;
  mode: WorldMode;
  reason?: AtlasFallbackReason;
}) {
  return (
    <figure className={styles.atlasFallback}>
      <img
        src={fallbackTexture(world, mode)}
        alt={`${world.name} ${mode.label.toLowerCase()} scientific map`}
      />
      <figcaption>
        {reason === "texture-error"
          ? "The interactive texture could not be decoded. The sourced scientific map remains available."
          : "Interactive 3D is unavailable in this browser. The sourced scientific map remains available."}
      </figcaption>
    </figure>
  );
}
