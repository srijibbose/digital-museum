"use client";

import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Group, MathUtils } from "three";
import { EAGLE_MODEL } from "../model-manifest";
import type { SceneState } from "../types";

type EagleModelProps = {
  state: SceneState;
  inspectMode: boolean;
  onReady: () => void;
};

export function EagleModel({ state, inspectMode, onReady }: EagleModelProps) {
  const group = useRef<Group>(null);
  const gltf = useGLTF(EAGLE_MODEL.src);
  const model = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  const missingNode = EAGLE_MODEL.requiredNodes.find(
    (nodeName) => !model.getObjectByName(nodeName),
  );
  if (missingNode) {
    throw new Error(`Eagle GLB is missing required node: ${missingNode}`);
  }

  useEffect(() => onReady(), [onReady]);

  useFrame((_frame, delta) => {
    if (!group.current || inspectMode) return;
    const damping = 1 - Math.exp(-delta * 4.6);
    group.current.position.lerp(
      {
        x: state.landerPosition[0],
        y: state.landerPosition[1],
        z: state.landerPosition[2],
      },
      damping,
    );
    group.current.rotation.x = MathUtils.lerp(
      group.current.rotation.x,
      state.landerRotation[0],
      damping,
    );
    group.current.rotation.y = MathUtils.lerp(
      group.current.rotation.y,
      state.landerRotation[1],
      damping,
    );
    group.current.rotation.z = MathUtils.lerp(
      group.current.rotation.z,
      state.landerRotation[2],
      damping,
    );
  });

  return (
    <group
      ref={group}
      position={[...state.landerPosition]}
      rotation={[...state.landerRotation]}
      scale={0.9}
    >
      <primitive object={model} />
      {state.altitudeFeet > 0 && (
        <mesh position={[0, -1.65, 0]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.34, 1.5, 18, 1, true]} />
          <meshBasicMaterial
            color="#e99b38"
            opacity={0.16}
            transparent
          />
        </mesh>
      )}
    </group>
  );
}

useGLTF.preload(EAGLE_MODEL.src);
