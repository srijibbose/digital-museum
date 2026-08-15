import Image from "next/image";
import { EAGLE_MODEL } from "../model-manifest";
import styles from "../thirteen-minutes.module.css";

export type SceneFallbackReason =
  | "loading"
  | "model-error"
  | "no-webgl"
  | "reduced-motion"
  | "reduced-data";

export function SceneFallback({ reason }: { reason: SceneFallbackReason }) {
  const unavailable = reason === "model-error" || reason === "no-webgl";

  return (
    <div
      className={styles.sceneFallback}
      data-reason={reason}
      data-testid="scene-fallback"
    >
      <Image
        alt="Eagle descending above the lunar surface"
        className={styles.scenePoster}
        fill
        sizes="100vw"
        src={EAGLE_MODEL.poster}
      />
      <span className={styles.sceneFallbackLabel}>
        {unavailable ? "Interactive model unavailable · static descent view" : "Preparing descent"}
      </span>
    </div>
  );
}
