"use client";

import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { getSceneState } from "@/lib/living-atlas/scene-model";
import type { ChapterId, HotspotId } from "@/lib/living-atlas/schema";

type FigureProps = {
  chapterId: ChapterId;
  reducedMotion: boolean;
  onSelectHotspot: (id: HotspotId) => void;
};

type MaterialProps = {
  color: string;
  opacity: number;
  emissive?: string;
  emissiveIntensity?: number;
  roughness?: number;
};

function LivingMaterial({
  color,
  opacity,
  emissive = color,
  emissiveIntensity = 0.08,
  roughness = 0.48,
}: MaterialProps) {
  return (
    <meshPhysicalMaterial
      color={color}
      transparent
      opacity={opacity}
      roughness={roughness}
      metalness={0.02}
      clearcoat={0.12}
      emissive={emissive}
      emissiveIntensity={emissiveIntensity}
      depthWrite={opacity > 0.4}
    />
  );
}

function SkinShell({ opacity }: { opacity: number }) {
  const color = "#cfc4b9";
  return (
    <group name="skin-shell">
      <mesh position={[0, 2.95, 0]} scale={[0.55, 0.68, 0.52]} castShadow>
        <sphereGeometry args={[1, 32, 28]} />
        <LivingMaterial color={color} opacity={opacity} roughness={0.42} />
      </mesh>
      <mesh position={[0, 2.35, 0]} scale={[0.24, 0.32, 0.25]}>
        <cylinderGeometry args={[0.72, 0.88, 1.3, 24]} />
        <LivingMaterial color={color} opacity={opacity} />
      </mesh>
      <mesh position={[0, 1.25, 0]} scale={[1.05, 1.32, 0.62]} castShadow>
        <sphereGeometry args={[1, 42, 32]} />
        <LivingMaterial color={color} opacity={opacity} />
      </mesh>
      <mesh position={[0, 0.05, 0]} scale={[0.78, 0.55, 0.56]}>
        <sphereGeometry args={[1, 32, 24]} />
        <LivingMaterial color={color} opacity={opacity} />
      </mesh>

      {[-1, 1].map((side) => (
        <group key={`arm-${side}`}>
          <mesh
            position={[side * 1.06, 1.25, 0]}
            rotation={[0, 0, side * -0.1]}
            scale={[0.34, 0.92, 0.34]}
          >
            <capsuleGeometry args={[0.5, 1.2, 8, 18]} />
            <LivingMaterial color={color} opacity={opacity} />
          </mesh>
          <mesh
            position={[side * 1.16, -0.15, 0.02]}
            rotation={[0, 0, side * 0.05]}
            scale={[0.27, 0.86, 0.27]}
          >
            <capsuleGeometry args={[0.5, 1.35, 8, 18]} />
            <LivingMaterial color={color} opacity={opacity} />
          </mesh>
          <mesh position={[side * 1.2, -1.2, 0.02]} scale={[0.25, 0.4, 0.18]}>
            <sphereGeometry args={[1, 20, 16]} />
            <LivingMaterial color={color} opacity={opacity} />
          </mesh>
        </group>
      ))}

      {[-1, 1].map((side) => (
        <group key={`leg-${side}`}>
          <mesh position={[side * 0.43, -1.28, 0]} scale={[0.48, 1.14, 0.48]}>
            <capsuleGeometry args={[0.5, 1.15, 8, 20]} />
            <LivingMaterial color={color} opacity={opacity} />
          </mesh>
          <mesh position={[side * 0.45, -3.02, 0.02]} scale={[0.38, 1.08, 0.38]}>
            <capsuleGeometry args={[0.5, 1.35, 8, 20]} />
            <LivingMaterial color={color} opacity={opacity} />
          </mesh>
          <mesh position={[side * 0.45, -4.12, 0.18]} scale={[0.42, 0.22, 0.7]}>
            <sphereGeometry args={[1, 22, 16]} />
            <LivingMaterial color={color} opacity={opacity} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function NervousSystem({
  opacity,
  active,
  reducedMotion,
}: {
  opacity: number;
  active: boolean;
  reducedMotion: boolean;
}) {
  const signal = useRef<THREE.Mesh>(null);
  const path = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.18, -1.05, 0.28),
        new THREE.Vector3(-1.08, 0.1, 0.24),
        new THREE.Vector3(-0.82, 1.15, 0.22),
        new THREE.Vector3(-0.25, 1.65, 0.18),
        new THREE.Vector3(0, 2.18, 0.12),
        new THREE.Vector3(0, 2.92, 0.08),
      ]),
    [],
  );

  useFrame(({ clock }) => {
    if (!signal.current || !active || reducedMotion) return;
    const progress = (clock.elapsedTime * 0.24) % 1;
    signal.current.position.copy(path.getPoint(progress));
  });

  const nervePoints = useMemo(
    () => [
      [new THREE.Vector3(0, 2.35, 0.08), new THREE.Vector3(0, -3.55, 0.06)],
      [new THREE.Vector3(0, 1.75, 0.08), new THREE.Vector3(-1.16, -0.85, 0.12)],
      [new THREE.Vector3(0, 1.75, 0.08), new THREE.Vector3(1.16, -0.85, 0.12)],
      [new THREE.Vector3(0, 0.15, 0.06), new THREE.Vector3(-0.46, -3.7, 0.08)],
      [new THREE.Vector3(0, 0.15, 0.06), new THREE.Vector3(0.46, -3.7, 0.08)],
    ],
    [],
  );

  return (
    <group name="nervous-system">
      <mesh position={[0, 2.97, 0.06]} scale={[0.41, 0.39, 0.32]}>
        <sphereGeometry args={[1, 30, 22]} />
        <LivingMaterial
          color="#aa8cff"
          opacity={opacity}
          emissiveIntensity={active ? 1.35 : 0.18}
        />
      </mesh>
      {nervePoints.map((points, index) => (
        <Line
          key={index}
          points={points}
          color="#aa8cff"
          transparent
          opacity={opacity}
          lineWidth={active ? 1.7 : 0.8}
        />
      ))}
      <mesh ref={signal} visible={active} scale={0.065}>
        <sphereGeometry args={[1, 14, 10]} />
        <meshBasicMaterial color="#fff2ff" toneMapped={false} />
        <pointLight color="#aa8cff" intensity={1.6} distance={1.1} />
      </mesh>
    </group>
  );
}

function RespiratorySystem({
  opacity,
  active,
  reducedMotion,
}: {
  opacity: number;
  active: boolean;
  reducedMotion: boolean;
}) {
  const lungs = useRef<THREE.Group>(null);
  const diaphragm = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!lungs.current || !diaphragm.current || reducedMotion) return;
    const breath = active ? (Math.sin(clock.elapsedTime * 1.25) + 1) / 2 : 0.25;
    lungs.current.scale.setScalar(0.96 + breath * 0.09);
    diaphragm.current.position.y = 0.52 - breath * 0.12;
  });

  return (
    <group name="respiratory-system">
      <group ref={lungs} position={[0, 1.45, 0.03]}>
        {[-1, 1].map((side) => (
          <mesh
            key={side}
            position={[side * 0.38, 0, 0]}
            rotation={[0, 0, side * -0.08]}
            scale={[0.44, 0.74, 0.34]}
          >
            <sphereGeometry args={[1, 30, 24]} />
            <LivingMaterial
              color="#72c8d7"
              opacity={opacity}
              emissiveIntensity={active ? 0.65 : 0.1}
              roughness={0.28}
            />
          </mesh>
        ))}
      </group>
      <mesh ref={diaphragm} position={[0, 0.48, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.62, 0.035, 8, 36, Math.PI]} />
        <LivingMaterial color="#92d7df" opacity={opacity} emissiveIntensity={0.5} />
      </mesh>
      <Line
        points={[
          new THREE.Vector3(0, 2.28, 0.04),
          new THREE.Vector3(0, 1.75, 0.04),
          new THREE.Vector3(-0.34, 1.48, 0.04),
        ]}
        color="#72c8d7"
        transparent
        opacity={opacity}
        lineWidth={1.3}
      />
      <Line
        points={[
          new THREE.Vector3(0, 1.75, 0.04),
          new THREE.Vector3(0.34, 1.48, 0.04),
        ]}
        color="#72c8d7"
        transparent
        opacity={opacity}
        lineWidth={1.3}
      />
    </group>
  );
}

function CirculatorySystem({
  opacity,
  active,
  reducedMotion,
}: {
  opacity: number;
  active: boolean;
  reducedMotion: boolean;
}) {
  const heart = useRef<THREE.Mesh>(null);
  const flow = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (heart.current && !reducedMotion) {
      const beat = active ? Math.max(0, Math.sin(clock.elapsedTime * 5.1)) ** 7 : 0;
      heart.current.scale.setScalar(1 + beat * 0.18);
    }
    if (flow.current && active && !reducedMotion) {
      flow.current.rotation.y = clock.elapsedTime * 0.18;
    }
  });

  const vesselPaths = useMemo(
    () => [
      [new THREE.Vector3(0.08, 1.23, 0.22), new THREE.Vector3(0, 2.5, 0.14)],
      [new THREE.Vector3(0.08, 1.2, 0.22), new THREE.Vector3(-1.12, -0.95, 0.12)],
      [new THREE.Vector3(0.08, 1.2, 0.22), new THREE.Vector3(1.12, -0.95, 0.12)],
      [new THREE.Vector3(0.08, 1.2, 0.22), new THREE.Vector3(-0.42, -3.75, 0.1)],
      [new THREE.Vector3(0.08, 1.2, 0.22), new THREE.Vector3(0.42, -3.75, 0.1)],
    ],
    [],
  );

  return (
    <group name="circulatory-system">
      <mesh
        ref={heart}
        position={[0.12, 1.18, 0.35]}
        rotation={[0.18, 0.1, -0.35]}
        scale={[0.28, 0.36, 0.25]}
      >
        <sphereGeometry args={[1, 28, 22]} />
        <LivingMaterial
          color="#ef6a5b"
          opacity={opacity}
          emissiveIntensity={active ? 1.25 : 0.15}
          roughness={0.32}
        />
      </mesh>
      {vesselPaths.map((points, index) => (
        <Line
          key={index}
          points={points}
          color={index % 2 === 0 ? "#ef6a5b" : "#7f95ca"}
          transparent
          opacity={opacity * 0.82}
          lineWidth={active ? 1.45 : 0.75}
        />
      ))}
      <group ref={flow} visible={active}>
        {Array.from({ length: 12 }, (_, index) => {
          const angle = (index / 12) * Math.PI * 2;
          return (
            <mesh
              key={index}
              position={[Math.cos(angle) * 0.85, 1.15 + Math.sin(angle) * 0.4, 0.18]}
              scale={0.025 + (index % 3) * 0.008}
            >
              <sphereGeometry args={[1, 8, 6]} />
              <meshBasicMaterial color={index % 2 ? "#ef6a5b" : "#9fb7e5"} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

function DigestiveSystem({ opacity, active }: { opacity: number; active: boolean }) {
  return (
    <group name="digestive-system">
      <mesh position={[-0.28, 0.32, 0.18]} scale={[0.72, 0.25, 0.38]} rotation={[0, 0.1, -0.08]}>
        <sphereGeometry args={[1, 28, 18]} />
        <LivingMaterial
          color="#b77b43"
          opacity={opacity}
          emissiveIntensity={active ? 0.5 : 0.08}
        />
      </mesh>
      <mesh position={[0.28, 0.02, 0.2]} scale={[0.3, 0.5, 0.26]} rotation={[0, 0, 0.25]}>
        <sphereGeometry args={[1, 24, 18]} />
        <LivingMaterial
          color="#e5a84b"
          opacity={opacity}
          emissiveIntensity={active ? 0.72 : 0.08}
        />
      </mesh>
      <mesh position={[0, -0.52, 0.16]} rotation={[Math.PI / 2, 0, 0]} scale={[0.74, 0.82, 0.7]}>
        <torusKnotGeometry args={[0.38, 0.055, 72, 9, 2, 3]} />
        <LivingMaterial
          color="#d49a46"
          opacity={opacity}
          emissiveIntensity={active ? 0.52 : 0.05}
        />
      </mesh>
    </group>
  );
}

function Skeleton({ opacity }: { opacity: number }) {
  const bones = useMemo(
    () => [
      { position: [-0.46, -1.35, 0] as const, scale: [0.09, 1.15, 0.09] as const },
      { position: [0.46, -1.35, 0] as const, scale: [0.09, 1.15, 0.09] as const },
      { position: [-0.46, -3.05, 0] as const, scale: [0.075, 1.05, 0.075] as const },
      { position: [0.46, -3.05, 0] as const, scale: [0.075, 1.05, 0.075] as const },
      { position: [-1.06, 1.05, 0] as const, scale: [0.07, 1.15, 0.07] as const },
      { position: [1.06, 1.05, 0] as const, scale: [0.07, 1.15, 0.07] as const },
      { position: [-1.16, -0.45, 0] as const, scale: [0.06, 0.85, 0.06] as const },
      { position: [1.16, -0.45, 0] as const, scale: [0.06, 0.85, 0.06] as const },
    ],
    [],
  );

  return (
    <group name="skeleton">
      <mesh position={[0, 2.96, 0]} scale={[0.43, 0.5, 0.4]}>
        <sphereGeometry args={[1, 24, 20]} />
        <meshStandardMaterial color="#e7dfd0" wireframe transparent opacity={opacity} />
      </mesh>
      <mesh position={[0, 0.82, -0.05]} scale={[0.075, 1.42, 0.075]}>
        <cylinderGeometry args={[1, 1, 2, 10]} />
        <LivingMaterial color="#e7dfd0" opacity={opacity} emissiveIntensity={0.08} />
      </mesh>
      {Array.from({ length: 7 }, (_, index) => (
        <mesh
          key={index}
          position={[0, 1.82 - index * 0.2, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[1 - index * 0.055, 0.72, 1]}
        >
          <torusGeometry args={[0.66, 0.025, 6, 30, Math.PI * 2]} />
          <LivingMaterial color="#e7dfd0" opacity={opacity} emissiveIntensity={0.08} />
        </mesh>
      ))}
      {bones.map((bone, index) => (
        <mesh key={index} position={bone.position} scale={bone.scale}>
          <capsuleGeometry args={[0.5, 1.2, 6, 10]} />
          <LivingMaterial color="#e7dfd0" opacity={opacity} emissiveIntensity={0.08} />
        </mesh>
      ))}
    </group>
  );
}

function Muscles({ opacity, active }: { opacity: number; active: boolean }) {
  const bands = useMemo(
    () => [
      { position: [-0.46, -1.35, 0.08] as const, scale: [0.28, 1.08, 0.2] as const },
      { position: [0.46, -1.35, 0.08] as const, scale: [0.28, 1.08, 0.2] as const },
      { position: [-0.46, -3.02, 0.08] as const, scale: [0.23, 0.96, 0.16] as const },
      { position: [0.46, -3.02, 0.08] as const, scale: [0.23, 0.96, 0.16] as const },
      { position: [-1.05, 1.05, 0.08] as const, scale: [0.2, 0.86, 0.16] as const },
      { position: [1.05, 1.05, 0.08] as const, scale: [0.2, 0.86, 0.16] as const },
    ],
    [],
  );

  return (
    <group name="muscular-system">
      <mesh position={[0, 1.18, 0.08]} scale={[0.82, 0.95, 0.34]}>
        <sphereGeometry args={[1, 24, 20]} />
        <meshStandardMaterial
          color="#b86f69"
          transparent
          opacity={opacity * 0.58}
          wireframe
          emissive="#b86f69"
          emissiveIntensity={active ? 0.35 : 0.04}
        />
      </mesh>
      {bands.map((band, index) => (
        <mesh key={index} position={band.position} scale={band.scale}>
          <capsuleGeometry args={[0.5, 1.2, 6, 12]} />
          <LivingMaterial
            color="#b86f69"
            opacity={opacity * 0.68}
            emissiveIntensity={active ? 0.35 : 0.05}
          />
        </mesh>
      ))}
    </group>
  );
}

function HotspotTargets({ onSelect }: { onSelect: (id: HotspotId) => void }) {
  const targets: Array<{
    id: HotspotId;
    position: [number, number, number];
    scale: [number, number, number];
  }> = [
    { id: "brain", position: [0, 2.96, 0.15], scale: [0.55, 0.6, 0.5] },
    { id: "spinal-cord", position: [0, 1.15, 0.08], scale: [0.3, 1.5, 0.25] },
    { id: "lungs", position: [0, 1.48, 0.18], scale: [0.95, 0.85, 0.5] },
    { id: "heart", position: [0.12, 1.17, 0.42], scale: [0.36, 0.42, 0.36] },
    { id: "liver", position: [-0.3, 0.3, 0.24], scale: [0.78, 0.36, 0.46] },
    { id: "stomach", position: [0.3, -0.05, 0.28], scale: [0.42, 0.58, 0.38] },
    { id: "skeleton", position: [-0.46, -1.8, 0.12], scale: [0.42, 1.35, 0.4] },
    { id: "muscles", position: [0.46, -1.8, 0.2], scale: [0.42, 1.35, 0.4] },
    { id: "skin", position: [-1.2, -1.1, 0.16], scale: [0.36, 0.5, 0.36] },
  ];

  return (
    <group name="hotspot-targets">
      {targets.map((target) => (
        <mesh
          key={target.id}
          position={target.position}
          scale={target.scale}
          onClick={(event) => {
            event.stopPropagation();
            onSelect(target.id);
          }}
          onPointerEnter={() => {
            document.body.style.cursor = "pointer";
          }}
          onPointerLeave={() => {
            document.body.style.cursor = "default";
          }}
        >
          <sphereGeometry args={[1, 12, 8]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function TouchRipple({ active, reducedMotion }: { active: boolean; reducedMotion: boolean }) {
  const ripple = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ripple.current || !active || reducedMotion) return;
    const pulse = (clock.elapsedTime * 0.65) % 1;
    ripple.current.scale.setScalar(0.35 + pulse * 1.4);
    const material = ripple.current.material as THREE.MeshBasicMaterial;
    material.opacity = 0.75 * (1 - pulse);
  });

  return (
    <mesh ref={ripple} visible={active} position={[-1.2, -1.14, 0.35]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.18, 0.018, 8, 32]} />
      <meshBasicMaterial color="#f2cfb6" transparent opacity={0.7} toneMapped={false} />
    </mesh>
  );
}

export function AnatomyFigure({ chapterId, reducedMotion, onSelectHotspot }: FigureProps) {
  const root = useRef<THREE.Group>(null);
  const scene = getSceneState(chapterId);

  useFrame(({ clock }) => {
    if (!root.current || reducedMotion) return;
    root.current.position.y = Math.sin(clock.elapsedTime * 0.7) * 0.025;
  });

  return (
    <group ref={root} position={[0.35, 0.4, 0]} scale={0.79} rotation={[0, -0.08, 0]}>
      <SkinShell opacity={scene.skin} />
      <NervousSystem
        opacity={scene.nervous}
        active={chapterId === "signal" || chapterId === "whole"}
        reducedMotion={reducedMotion}
      />
      <RespiratorySystem
        opacity={scene.respiratory}
        active={chapterId === "breath" || chapterId === "whole"}
        reducedMotion={reducedMotion}
      />
      <CirculatorySystem
        opacity={scene.circulatory}
        active={chapterId === "pulse" || chapterId === "whole"}
        reducedMotion={reducedMotion}
      />
      <DigestiveSystem opacity={scene.digestive} active={chapterId === "fuel-motion" || chapterId === "whole"} />
      <Skeleton opacity={scene.skeletal} />
      <Muscles opacity={scene.muscular} active={chapterId === "fuel-motion" || chapterId === "whole"} />
      <TouchRipple active={chapterId === "surface"} reducedMotion={reducedMotion} />
      <HotspotTargets onSelect={onSelectHotspot} />
    </group>
  );
}
