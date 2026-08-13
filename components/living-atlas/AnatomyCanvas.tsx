"use client";

import { OrbitControls, Sparkles } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { AnatomyFigure } from "./AnatomyFigure";
import type { ChapterId, HotspotId } from "@/lib/living-atlas/schema";

type AnatomyCanvasProps = {
  chapterId: ChapterId;
  accent: string;
  reducedMotion: boolean;
  onSelectHotspot: (id: HotspotId) => void;
  onFailure: () => void;
};

const cameraPositions: Record<ChapterId, [number, number, number]> = {
  surface: [0.8, 0.4, 8.8],
  signal: [-0.7, 1.4, 7.2],
  breath: [0.55, 1.15, 6.6],
  pulse: [0.2, 1.05, 6.2],
  "fuel-motion": [0.75, -0.25, 7.4],
  whole: [0.6, 0.35, 8.7],
};

function CameraDirector({ chapterId, reducedMotion }: { chapterId: ChapterId; reducedMotion: boolean }) {
  const camera = useThree((state) => state.camera);
  const target = useMemo(() => new THREE.Vector3(...cameraPositions[chapterId]), [chapterId]);
  const focus = useMemo(
    () =>
      new THREE.Vector3(
        0.25,
        chapterId === "signal" ? 1.1 : chapterId === "fuel-motion" ? -0.4 : 0.35,
        0,
      ),
    [chapterId],
  );
  const progress = useRef(1);

  useEffect(() => {
    progress.current = reducedMotion ? 1 : 0;
    if (reducedMotion) {
      camera.position.copy(target);
      camera.lookAt(focus);
    }
  }, [camera, focus, reducedMotion, target]);

  useFrame((_, delta) => {
    if (progress.current >= 1) return;
    progress.current = Math.min(1, progress.current + delta * 0.72);
    const eased = 1 - Math.pow(1 - progress.current, 3);
    camera.position.lerp(target, eased * 0.08 + 0.03);
    camera.lookAt(focus);
  });

  return null;
}

function Scene({
  chapterId,
  accent,
  reducedMotion,
  onSelectHotspot,
}: Omit<AnatomyCanvasProps, "onFailure">) {
  return (
    <>
      <ambientLight intensity={0.55} color="#d8d4cc" />
      <directionalLight position={[-4, 6, 6]} intensity={2.5} color="#f2dfcd" />
      <directionalLight position={[4, 1, -4]} intensity={2.2} color={accent} />
      <pointLight position={[0, 0, 3]} intensity={0.8} color="#ffffff" />
      <Sparkles
        count={reducedMotion ? 18 : 68}
        scale={[7, 8, 4]}
        size={1.4}
        speed={reducedMotion ? 0 : 0.22}
        opacity={0.32}
        color={accent}
      />
      <AnatomyFigure
        chapterId={chapterId}
        reducedMotion={reducedMotion}
        onSelectHotspot={onSelectHotspot}
      />
      <CameraDirector chapterId={chapterId} reducedMotion={reducedMotion} />
      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping={!reducedMotion}
        dampingFactor={0.06}
        minDistance={5.1}
        maxDistance={10.5}
        minPolarAngle={Math.PI * 0.28}
        maxPolarAngle={Math.PI * 0.72}
        target={[0.25, 0.25, 0]}
      />
    </>
  );
}

export function AnatomyCanvas(props: AnatomyCanvasProps) {
  return (
    <div className="anatomy-canvas" aria-hidden="true">
      <Canvas
        camera={{ position: cameraPositions[props.chapterId], fov: 39, near: 0.1, far: 100 }}
        dpr={[1, 1.6]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
        }}
        fallback={null}
      >
        <Suspense fallback={null}>
          <Scene {...props} />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default AnatomyCanvas;
