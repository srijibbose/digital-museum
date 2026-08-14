"use client";

import { Line } from "@react-three/drei";
import { useMemo } from "react";
import { ACTUAL_TRAJECTORY, PLANNED_TRAJECTORY } from "../terrain";

type TrajectoryProps = {
  reveal: number;
  compareMode: boolean;
};

function ellipsePoints(centerX: number, centerZ: number) {
  return Array.from({ length: 65 }, (_, index) => {
    const angle = (Math.PI * 2 * index) / 64;
    return [
      centerX + Math.cos(angle) * 3.2,
      -0.86,
      centerZ + Math.sin(angle) * 1.35,
    ] as const;
  });
}

export function Trajectory({ reveal, compareMode }: TrajectoryProps) {
  const landingEllipse = useMemo(() => ellipsePoints(11.5, -13), []);
  const plannedEllipse = useMemo(() => ellipsePoints(4.5, -7.5), []);
  const visibleActual = Math.max(2, Math.ceil(ACTUAL_TRAJECTORY.length * reveal));

  return (
    <group>
      <Line
        color="#f2b84b"
        lineWidth={1.65}
        opacity={0.68 + reveal * 0.3}
        points={ACTUAL_TRAJECTORY.slice(0, visibleActual).map((point) => [...point])}
        transparent
      />
      <Line
        color="#f2b84b"
        dashed
        dashScale={3}
        lineWidth={1.35}
        opacity={0.86}
        points={landingEllipse.map((point) => [...point])}
        transparent
      />
      {compareMode && (
        <>
          <Line
            color="#97a59a"
            dashed
            dashScale={2}
            lineWidth={1}
            opacity={0.72}
            points={PLANNED_TRAJECTORY.map((point) => [...point])}
            transparent
          />
          <Line
            color="#97a59a"
            dashed
            dashScale={3}
            lineWidth={1}
            opacity={0.6}
            points={plannedEllipse.map((point) => [...point])}
            transparent
          />
        </>
      )}
    </group>
  );
}
