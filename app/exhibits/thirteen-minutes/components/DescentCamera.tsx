"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo } from "react";
import { MathUtils, PerspectiveCamera, Vector3 } from "three";
import type { SceneState } from "../types";

export function DescentCamera({
  state,
  inspectMode,
}: {
  state: SceneState;
  inspectMode: boolean;
}) {
  const camera = useThree((threeState) => threeState.camera) as PerspectiveCamera;
  const viewportWidth = useThree((threeState) => threeState.size.width);
  const target = useMemo(() => new Vector3(), []);
  const position = useMemo(() => new Vector3(), []);

  useFrame((_frame, delta) => {
    if (inspectMode) return;
    const damping = 1 - Math.exp(-delta * 4.4);
    position.set(...state.camera.position);
    target.set(...state.camera.target);
    const mobileFraming = viewportWidth < 720;
    if (mobileFraming) target.x -= 2.1;
    camera.position.lerp(position, damping);
    camera.fov = MathUtils.lerp(
      camera.fov,
      state.camera.fov + (mobileFraming ? 17 : 0),
      damping,
    );
    camera.lookAt(target);
    camera.updateProjectionMatrix();
  });

  return null;
}
