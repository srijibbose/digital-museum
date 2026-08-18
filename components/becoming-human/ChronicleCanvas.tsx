"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import type { Group, Mesh, MeshStandardMaterial, Object3D } from "three";
import styles from "./becoming-human.module.css";

interface ChronicleCanvasProps {
  chapterIndex: number;
  chapterProgress: number;
  evidenceMode: boolean;
  reducedMotion: boolean;
  glow: string;
  light: string;
}

function Artifact({ chapterIndex, chapterProgress, evidenceMode, reducedMotion }: Omit<ChronicleCanvasProps, "glow" | "light">) {
  const { scene } = useGLTF("/models/becoming-human/chronicle-core.glb");
  const artifact = useMemo(() => scene.clone(true), [scene]);
  const group = useRef<Group>(null);
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    if (!group.current) return;
    const eraRotation = chapterIndex * 0.29 + chapterProgress * 0.18;
    group.current.rotation.set(
      -0.03 + Math.sin(chapterIndex * 0.7) * 0.08,
      reducedMotion ? chapterIndex * 0.12 : eraRotation,
      Math.cos(chapterIndex * 0.38) * 0.035,
    );
    group.current.position.set(
      chapterIndex % 3 === 0 ? 0.38 : chapterIndex % 3 === 1 ? -0.18 : 0.12,
      -1.05 + Math.sin(chapterProgress * Math.PI) * (reducedMotion ? 0 : 0.12),
      0,
    );
    group.current.scale.setScalar(0.9 + (chapterIndex > 17 ? 0.04 : 0));

    artifact.traverse((node: Object3D) => {
      const mesh = node as Mesh;
      if (!mesh.isMesh) return;
      const material = mesh.material as MeshStandardMaterial;
      if (material && "wireframe" in material) {
        material.wireframe = evidenceMode && !node.name.startsWith("Stratum") && !node.name.startsWith("Ember");
        material.needsUpdate = true;
      }
      if (node.name.startsWith("Network_")) node.visible = chapterIndex >= 3;
      if (node.name.startsWith("Memory_Mark")) node.visible = chapterIndex >= 12;
      if (node.name === "Ember") node.visible = chapterIndex >= 7;
    });
    invalidate();
  }, [artifact, chapterIndex, chapterProgress, evidenceMode, invalidate, reducedMotion]);

  return <primitive object={artifact} ref={group} />;
}

function CanvasFallback() {
  return (
    <div className={styles.canvasFallback} aria-hidden="true">
      <i /><i /><i />
    </div>
  );
}

export function ChronicleCanvas(props: ChronicleCanvasProps) {
  return (
    <div className={styles.canvasStage} aria-hidden="true">
      <CanvasFallback />
      <Canvas
        camera={{ fov: 36, near: 0.1, far: 60, position: [0, 0.55, 10.8] }}
        dpr={[1, 1.65]}
        frameloop="demand"
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance", stencil: false }}
      >
        <ambientLight intensity={0.7} color={props.light} />
        <directionalLight intensity={3.6} color={props.light} position={[-4, 4, 7]} />
        <pointLight intensity={18} color={props.glow} decay={2} distance={12} position={[2.8, -0.2, 3.4]} />
        <pointLight intensity={8} color="#5f9cca" decay={2} distance={10} position={[-3.8, 2.8, 1.5]} />
        <Suspense fallback={null}>
          <Artifact
            chapterIndex={props.chapterIndex}
            chapterProgress={props.chapterProgress}
            evidenceMode={props.evidenceMode}
            reducedMotion={props.reducedMotion}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
