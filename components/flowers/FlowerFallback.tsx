"use client";

import { flowerExhibit, type FlowerChapter } from "@/content/flowers";
import styles from "./flowers.module.css";

export function FlowerFallback({
  chapter,
  reason = "webgl",
}: {
  chapter: FlowerChapter;
  reason?: "webgl" | "model";
}) {
  return (
    <figure className={styles.fallback} data-testid="flower-fallback">
      <img
        src="/media/flowers/phalaenopsis-scan-fallback.png"
        alt={`Deterministic render of the ${flowerExhibit.specimen.commonName} Smithsonian surface scan`}
        decoding="async"
      />
      <figcaption>
        <strong>{chapter.index} · {chapter.shortTitle}</strong>
        <span>{chapter.thesis}</span>
        <small>
          {reason === "model"
            ? "The local specimen model could not be decoded. The text edition and source qualification remain available below."
            : "Interactive 3D is unavailable in this browser. This static render preserves the sourced exterior specimen; the complete text edition remains available below."}
        </small>
      </figcaption>
    </figure>
  );
}
