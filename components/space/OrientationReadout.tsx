"use client";

import { Compass } from "lucide-react";
import styles from "./atlas.module.css";

function coordinate(value: number, positive: string, negative: string) {
  const suffix = value >= 0 ? positive : negative;
  return `${Math.abs(Math.round(value))}°${suffix}`;
}

export function OrientationReadout({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  return (
    <div
      className={styles.orientationReadout}
      aria-label={`Orientation ${coordinate(latitude, "N", "S")}, ${coordinate(longitude, "E", "W")}`}
    >
      <span>N</span>
      <Compass
        size={50}
        strokeWidth={0.9}
        aria-hidden="true"
        style={{ transform: `rotate(${-longitude}deg)` }}
      />
      <small>{coordinate(latitude, "N", "S")} · {coordinate(longitude, "E", "W")}</small>
    </div>
  );
}
