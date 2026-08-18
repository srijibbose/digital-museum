"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import type { Group, Mesh, Object3D, OrthographicCamera } from "three";
import type { ChapterScene, WorldPack } from "@/content/becoming-human-scenes";
import styles from "./becoming-human.module.css";

function WorldModel({
  world,
  scene,
  progress,
  reducedMotion,
  onReady,
}: {
  world: WorldPack;
  scene: ChapterScene;
  progress: number;
  reducedMotion: boolean;
  onReady: () => void;
}) {
  const gltf = useGLTF(world.model);
  const model = useMemo(() => gltf.scene.clone(true), [gltf.scene]);
  const group = useRef<Group>(null);
  const camera = useThree((state) => state.camera) as OrthographicCamera;
  const viewportHeight = useThree((state) => state.size.height);
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    camera.position.set(14.8, 12.4, 18.8);
    camera.lookAt(0, 0.8, -0.6);
    camera.zoom = viewportHeight / 16.8;
    camera.updateProjectionMatrix();
    model.traverse((node: Object3D) => {
      const mesh = node as Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    });
    onReady();
    invalidate();
  }, [camera, invalidate, model, onReady, viewportHeight]);

  useEffect(() => {
    invalidate();
  }, [invalidate, progress, scene]);

  useFrame((state) => {
    if (!group.current) return;
    const t = reducedMotion ? 0.5 : progress;
    const breathe = reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.22) * 0.012;
    group.current.position.set(
      scene.camera[0] * -2.8 + (t - 0.5) * -0.42,
      scene.camera[1] * -1.8 + breathe,
      scene.camera[2],
    );
    group.current.rotation.y = (t - 0.5) * 0.028;
    group.current.scale.setScalar(scene.scale);
  });

  return <primitive object={model} ref={group} />;
}

export function WorldCanvas({
  world,
  scene,
  progress,
  reducedMotion,
  onReady,
}: {
  world: WorldPack;
  scene: ChapterScene;
  progress: number;
  reducedMotion: boolean;
  onReady: () => void;
}) {
  return (
    <div className={styles.worldCanvas} aria-hidden="true">
      <Canvas
        orthographic
        camera={{ far: 100, near: 0.1, position: [14.8, 12.4, 18.8], zoom: 78 }}
        dpr={[1, 1.45]}
        frameloop="demand"
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance", stencil: false }}
        shadows
      >
        <ambientLight color={world.light} intensity={1.28} />
        <hemisphereLight color={world.light} groundColor={world.background} intensity={1.7} />
        <directionalLight castShadow color={world.light} intensity={3.1} position={[-10, 16, 8]} shadow-mapSize-height={1024} shadow-mapSize-width={1024} />
        <Suspense fallback={null}>
          <WorldModel key={world.id} onReady={onReady} progress={progress} reducedMotion={reducedMotion} scene={scene} world={world} />
        </Suspense>
      </Canvas>
    </div>
  );
}
