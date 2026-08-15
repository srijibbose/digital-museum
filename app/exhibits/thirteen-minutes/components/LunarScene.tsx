"use client";

import { OrbitControls, Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { interpolateSceneState } from "../scene-state";
import styles from "../thirteen-minutes.module.css";
import { DescentCamera } from "./DescentCamera";
import { EagleModel } from "./EagleModel";
import { LunarTerrain } from "./LunarTerrain";
import { SceneLighting } from "./SceneLighting";
import { Trajectory } from "./Trajectory";

export type LunarSceneProps = {
  progress: number;
  inspectMode: boolean;
  compareMode: boolean;
  onReady: () => void;
};

export function LunarScene({
  progress,
  inspectMode,
  compareMode,
  onReady,
}: LunarSceneProps) {
  const state = interpolateSceneState(progress);

  return (
    <div className={styles.sceneCanvas} data-testid="lunar-scene">
      <Canvas
        camera={{
          far: 140,
          fov: state.camera.fov,
          near: 0.1,
          position: [...state.camera.position],
        }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        shadows="basic"
      >
        <color attach="background" args={["#030505"]} />
        <fog attach="fog" args={["#070a0b", 24, 82]} />
        <SceneLighting />
        <Stars count={260} depth={48} factor={1.6} fade radius={54} speed={0} />
        <Suspense fallback={null}>
          <LunarTerrain dust={state.dust} reveal={state.terrainReveal} />
          <Trajectory compareMode={compareMode} reveal={state.trajectoryReveal} />
          <EagleModel inspectMode={inspectMode} onReady={onReady} state={state} />
          <DescentCamera inspectMode={inspectMode} state={state} />
          {inspectMode && (
            <OrbitControls
              enableDamping
              enablePan={false}
              enableZoom={true}
              makeDefault
              maxDistance={30}
              maxPolarAngle={Math.PI * 0.58}
              minDistance={6}
              minPolarAngle={Math.PI * 0.22}
              target={[...state.camera.target]}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
