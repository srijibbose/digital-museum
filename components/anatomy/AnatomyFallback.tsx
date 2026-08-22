"use client";

import type { AnatomySystem } from "@/lib/anatomy/anatomy-schema";
import styles from "./anatomy.module.css";

export function AnatomyFallback({
  system,
  reason = "webgl",
}: {
  system: AnatomySystem;
  reason?: "webgl" | "model";
}) {
  return (
    <figure className={styles.fallback}>
      <img src={system.fallback} alt={`Source-validation render of the ${system.label.toLowerCase()}`} />
      <figcaption>
        {reason === "model"
          ? "The interactive reference model could not be decoded. This deterministic render preserves the same HRA source geometry."
          : "Interactive 3D is unavailable in this browser. This deterministic render preserves the same HRA source geometry."}
      </figcaption>
    </figure>
  );
}
