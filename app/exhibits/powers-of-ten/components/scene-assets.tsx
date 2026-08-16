"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { Float, Sparkles } from "@react-three/drei";

function Stars({ count = 500, spread = 18 }: { count?: number; spread?: number }) {
  return <Sparkles count={count} scale={spread} size={1.4} speed={0.12} opacity={0.7} color="#d8edf1" />;
}

function Cell() {
  const organelles = useMemo(() => Array.from({ length: 18 }, (_, i) => ({ x: Math.sin(i * 2.2) * 1.4, y: Math.cos(i * 1.7) * 0.9, z: Math.sin(i) * 0.7 })), []);
  return <group>
    <mesh scale={[2.2, 1.55, 1.5]}><sphereGeometry args={[1, 48, 32]} /><meshPhysicalMaterial color="#9ac8b0" roughness={0.28} transmission={0.16} transparent opacity={0.82} /></mesh>
    <mesh scale={0.62}><sphereGeometry args={[1, 36, 24]} /><meshPhysicalMaterial color="#b989b3" roughness={0.32} emissive="#381d38" emissiveIntensity={0.35} /></mesh>
    {organelles.map((o, i) => <mesh key={i} position={[o.x, o.y, o.z]} scale={[0.18, 0.1, 0.12]} rotation={[i, i * 0.6, i * 0.2]}><sphereGeometry args={[1, 16, 10]} /><meshStandardMaterial color={i % 2 ? "#d78a68" : "#e2c77f"} roughness={0.42} /></mesh>)}
  </group>;
}

function Hand() {
  return <group rotation={[0.15, -0.4, 0]}>
    <mesh position={[0, -0.6, 0]} scale={[1.8, 0.75, 1.35]}><sphereGeometry args={[1, 40, 24]} /><meshStandardMaterial color="#b9775e" roughness={0.58} /></mesh>
    {[[-1.05, 0.35, 0.05], [-0.36, 0.85, 0], [0.35, 1, 0], [1.02, 0.7, 0], [1.48, 0.08, 0]].map((p, i) => <group key={i} position={p as [number, number, number]} rotation={[0, 0, i === 4 ? -0.75 : (i - 2) * 0.1]}><mesh scale={[0.34, 1.25 - i * 0.06, 0.3]}><capsuleGeometry args={[0.48, 1, 16, 8]} /><meshStandardMaterial color={i % 2 ? "#c58268" : "#b9765d"} roughness={0.52} /></mesh><mesh position={[0, 0.58, 0.09]} scale={[0.23, 0.12, 0.04]}><sphereGeometry args={[1, 20, 10]} /><meshPhysicalMaterial color="#e6c9b5" roughness={0.2} clearcoat={0.35} /></mesh></group>)}
  </group>;
}

function Room() {
  return <group position={[0, -1.2, 0]}><mesh rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[10, 8]} /><meshStandardMaterial color="#24333a" roughness={0.82} /></mesh><mesh position={[0, 2.2, -3.5]}><boxGeometry args={[10, 4.5, 0.2]} /><meshStandardMaterial color="#56646a" roughness={0.7} /></mesh><mesh position={[-2, 0.3, 0]} rotation={[0, 0.05, 0.12]}><boxGeometry args={[1.8, 0.9, 1.9]} /><meshStandardMaterial color="#a4775f" roughness={0.5} /></mesh><mesh position={[2.2, 0.1, -0.6]}><cylinderGeometry args={[0.9, 1.1, 0.2, 32]} /><meshStandardMaterial color="#877862" roughness={0.7} /></mesh><mesh position={[2.2, 1.5, -0.6]}><cylinderGeometry args={[0.05, 0.05, 2.5, 12]} /><meshStandardMaterial color="#d0b17a" metalness={0.4} /></mesh><pointLight position={[-2, 3, 1]} intensity={20} distance={8} color="#ffd7a0" /></group>;
}

function City() { const buildings = useMemo(() => Array.from({ length: 32 }, (_, i) => ({ x: (i % 8) * 0.9 - 3.2, z: Math.floor(i / 8) * 0.9 - 1.5, h: 0.5 + ((i * 13) % 10) / 10 })), []); return <group rotation={[0, 0.25, 0]}>{buildings.map((b, i) => <mesh key={i} position={[b.x, b.h / 2, b.z]}><boxGeometry args={[0.68, b.h, 0.68]} /><meshStandardMaterial color={i % 4 === 0 ? "#b8a68a" : "#536871"} roughness={0.75} /></mesh>)}<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]}><planeGeometry args={[8, 5]} /><meshStandardMaterial color="#171f23" /></mesh><Sparkles count={80} scale={[7, 0.1, 4]} size={2} color="#dfba75" /></group>; }

function Earth({ moon = false }: { moon?: boolean }) { return <group><mesh><sphereGeometry args={[1.6, 64, 40]} /><meshPhysicalMaterial color="#2a6f8a" roughness={0.45} clearcoat={0.4} /></mesh><mesh scale={1.05}><sphereGeometry args={[1.6, 64, 40]} /><meshPhysicalMaterial color="#c7e2da" transparent opacity={0.12} roughness={0.1} transmission={0.1} /></mesh><mesh scale={[1.62, 1.62, 1.62]} rotation={[0.2, 0.5, 0]}><sphereGeometry args={[1, 48, 32]} /><meshStandardMaterial color="#345f4e" roughness={0.9} transparent opacity={0.72} wireframe /></mesh>{moon && <><mesh position={[4.5, 0.4, 0]}><sphereGeometry args={[0.42, 32, 20]} /><meshStandardMaterial color="#aaa9a0" roughness={0.92} /></mesh><mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[3.1, 0.008, 8, 96]} /><meshBasicMaterial color="#9bb9bd" transparent opacity={0.6} /></mesh></>}</group>; }

function Solar() { return <group><mesh><sphereGeometry args={[1.25, 48, 32]} /><meshStandardMaterial color="#e8a24a" emissive="#d86a23" emissiveIntensity={2.2} /></mesh>{[2.1, 3.2, 4.4].map((r, i) => <group key={r} rotation={[0.2, i * 0.3, 0]}><mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[r, 0.008, 8, 96]} /><meshBasicMaterial color="#b3cbd0" transparent opacity={0.5} /></mesh><mesh position={[r, 0, 0]} scale={0.16 + i * 0.07}><sphereGeometry args={[1, 24, 16]} /><meshStandardMaterial color={i === 1 ? "#9a7659" : "#7ca4ad"} roughness={0.55} /></mesh></group>)}</group>; }

function Galaxy() { const dust = useMemo(() => Array.from({ length: 800 }, (_, i) => { const a = i * 2.399; const r = Math.sqrt(i / 800) * 4.6; return [Math.cos(a) * r, (Math.sin(i * 1.7) * 0.09) * (1 - r / 5), Math.sin(a) * r] as [number, number, number]; }), []); return <group rotation={[0.65, 0, -0.2]}><Sparkles count={700} scale={10} size={1.1} color="#9ab7d1" /><points><bufferGeometry><bufferAttribute attach="attributes-position" args={[new Float32Array(dust.flat()), 3]} /></bufferGeometry><pointsMaterial color="#d6b57e" size={0.055} transparent opacity={0.8} /></points><mesh><sphereGeometry args={[0.5, 32, 20]} /><meshBasicMaterial color="#f5d89d" /></mesh></group>; }

function Web() { const points = useMemo(() => Array.from({ length: 260 }, (_, i) => [Math.sin(i * 1.9) * 4, Math.cos(i * 1.31) * 2.6, Math.sin(i * 0.43) * 3.5] as [number, number, number]), []); return <group><Sparkles count={500} scale={12} size={1.2} color="#aecbd3" />{points.filter((_, i) => i % 9 === 0).map((p, i) => <mesh key={i} position={p} scale={0.04 + (i % 4) * 0.025}><sphereGeometry args={[1, 12, 8]} /><meshBasicMaterial color="#e9c27d" /></mesh>)}</group>; }

export function SceneAsset({ scene }: { scene: string }) {
  return <>{scene === "hand" && <Hand />}{scene === "cell" && <Cell />}{scene === "room" && <Room />}{scene === "city" && <City />}{scene === "earth" && <Earth />}{scene === "moon" && <Earth moon />}{scene === "solar" && <Solar />}{scene === "galaxy" && <Galaxy />}{scene === "web" && <Web />}{scene === "universe" && <Stars count={1200} spread={20} />}</>;
}
