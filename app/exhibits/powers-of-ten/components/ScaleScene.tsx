"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { AdaptiveDpr, Environment, PerspectiveCamera } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";
import { SCALE_STOPS } from "../content";
import { SceneAsset } from "./scene-assets";

function SceneContent({ progress, reducedMotion }: { progress: number; reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null);
  const position = progress * (SCALE_STOPS.length - 1);
  const index = Math.min(SCALE_STOPS.length - 1, Math.floor(position));
  const next = Math.min(SCALE_STOPS.length - 1, index + 1);
  const blend = position - index;
  useFrame((_, delta) => { if (!group.current) return; const target = reducedMotion ? 0 : Math.sin(progress * Math.PI * 3) * 0.06; group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, target, 3, delta); group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, reducedMotion ? 0 : -0.08, 3, delta); });
  return <group ref={group}><group scale={1 + blend * 0.04} position={[0, 0, blend * -0.4]}><SceneAsset scene={SCALE_STOPS[index].scene} /></group>{next !== index && <group scale={0.94 - blend * 0.1} position={[0, 0, -0.5]}><SceneAsset scene={SCALE_STOPS[next].scene} /></group>}</group>;
}

export function ScaleScene({ progress, reducedMotion }: { progress: number; reducedMotion: boolean }) {
  return <Canvas dpr={[1, 1.7]} gl={{ antialias: true, powerPreference: "high-performance" }} fallback={<div aria-label="3D scene unavailable" />}><color attach="background" args={["#06090b"]} /><fog attach="fog" args={["#06090b", 7, 18]} /><PerspectiveCamera makeDefault position={[0, 0.3, 8.5]} fov={42} /><ambientLight intensity={0.55} color="#a9c5ca" /><directionalLight position={[4, 5, 6]} intensity={3.4} color="#ffe2b5" /><pointLight position={[-5, 1, 3]} intensity={20} distance={15} color="#8eb9c7" /><Suspense fallback={null}><SceneContent progress={progress} reducedMotion={reducedMotion} /><Environment preset="night" /></Suspense><AdaptiveDpr pixelated /></Canvas>;
}
