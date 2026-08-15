"use client";

import { Html, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, type ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  AdditiveBlending,
  Color,
  DynamicDrawUsage,
  Group,
  InstancedMesh,
  MathUtils,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  Raycaster,
  SphereGeometry,
  Vector2,
  Vector3,
} from "three";
import { fullThrottleContent } from "../content";
import { TURBOFAN_PART_NODES } from "../model-manifest";
import type { EnginePartId, EngineState, ExperiencePhase } from "../types";

type EngineSceneProps = {
  engine: EngineState;
  phase: ExperiencePhase;
  reducedMotion: boolean;
  selectedPart: EnginePartId | null;
  onSelectPart: (partId: EnginePartId) => void;
};

const NODE_TO_PART = Object.fromEntries(
  Object.entries(TURBOFAN_PART_NODES).map(([partId, node]) => [node, partId]),
) as Record<string, EnginePartId>;

function findPart(object: Object3D | null): EnginePartId | null {
  let current = object;
  while (current) {
    if (NODE_TO_PART[current.name]) return NODE_TO_PART[current.name];
    current = current.parent;
  }
  return null;
}

// -------------------------------------------------------------
// 3D TURBOFAN MODEL
// -------------------------------------------------------------
function TurbofanModel({
  engine,
  phase,
  onSelectPart,
  reducedMotion,
}: EngineSceneProps) {
  const gltf = useGLTF("/models/turbofan-parts.glb");
  const model = useMemo(() => {
    const copy = gltf.scene.clone(true);
    copy.traverse((object) => {
      if (object instanceof Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
        object.material = Array.isArray(object.material)
          ? object.material.map((material) => material.clone())
          : object.material.clone();
      }
    });
    return copy;
  }, [gltf.scene]);

  const lowRotation = useRef(0);
  const highRotation = useRef(0);

  useFrame((_, delta) => {
    if (!reducedMotion) {
      lowRotation.current += delta * (0.6 + engine.lowSpool * 8.5);
      highRotation.current += delta * (1.2 + engine.highSpool * 14.2);
    }

    // Exploded View Separation along X axis
    Object.entries(TURBOFAN_PART_NODES).forEach(([partId, nodeName]) => {
      const node = model.getObjectByName(nodeName);
      if (!node) return;
      const target = engine.parts[partId as EnginePartId].offset;
      node.position.x = reducedMotion
        ? target
        : MathUtils.damp(node.position.x, target, 6.0, delta);
    });

    // Dual-Spool Independent Rotation
    ["fan", "lp_compressor", "lp_turbine"].forEach((name) => {
      const node = model.getObjectByName(name);
      if (node) node.rotation.x = reducedMotion ? 0 : lowRotation.current;
    });

    ["hp_compressor", "hp_turbine"].forEach((name) => {
      const node = model.getObjectByName(name);
      if (node) node.rotation.x = reducedMotion ? 0 : highRotation.current;
    });
  });

  // Emissive highlight and transparency on selection
  useEffect(() => {
    const highlight = new Color("#ff6b2b");
    const neutral = new Color("#000000");

    Object.entries(TURBOFAN_PART_NODES).forEach(([partId, nodeName]) => {
      const node = model.getObjectByName(nodeName);
      if (!node) return;
      const partState = engine.parts[partId as EnginePartId];

      node.traverse((child) => {
        if (!(child instanceof Mesh)) return;
        const materials = Array.isArray(child.material)
          ? child.material
          : [child.material];

        materials.forEach((mat) => {
          if (mat instanceof MeshStandardMaterial) {
            mat.transparent = partState.opacity < 0.99;
            mat.opacity = partState.opacity;
            if (partState.highlighted) {
              mat.emissive.copy(highlight);
              mat.emissiveIntensity = 0.45;
            } else {
              mat.emissive.copy(neutral);
              mat.emissiveIntensity = 0;
            }
          }
        });
      });
    });
  }, [engine.parts, model]);

  const handlePointer = (event: ThreeEvent<PointerEvent>) => {
    if (phase !== "parts") return;
    const part = findPart(event.object);
    if (part) {
      event.stopPropagation();
      onSelectPart(part);
    }
  };

  return <primitive object={model} onPointerDown={handlePointer} scale={0.78} />;
}

// -------------------------------------------------------------
// INTERACTIVE 3D HOTSPOT ANNOTATIONS
// -------------------------------------------------------------
function PartHotspots({
  phase,
  selectedPart,
  onSelectPart,
  engine,
}: {
  phase: ExperiencePhase;
  selectedPart: EnginePartId | null;
  onSelectPart: (partId: EnginePartId) => void;
  engine: EngineState;
}) {
  if (phase !== "parts") return null;

  return (
    <group>
      {fullThrottleContent.parts.map((part) => {
        const partState = engine.parts[part.id];
        const posX = (part.hotspotPosition[0] + partState.offset) * 0.78;
        const posY = part.hotspotPosition[1] * 0.78;
        const posZ = part.hotspotPosition[2] * 0.78;
        const isSelected = selectedPart === part.id;

        return (
          <group key={part.id} position={[posX, posY, posZ]}>
            <Html center distanceFactor={14} zIndexRange={[100, 0]}>
              <button
                className={`hotspotMarker ${isSelected ? "hotspotMarker--active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPart(part.id);
                }}
                title={`Inspect ${part.name}`}
                type="button"
              >
                <span className="hotspotPulse" />
                <span className="hotspotDot" />
                <span className="hotspotLabel">{part.shortName}</span>
              </button>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

// -------------------------------------------------------------
// DYNAMIC 3D VOLUMETRIC AIRFLOW & COMBUSTION SIMULATION
// -------------------------------------------------------------
type Particle = {
  stream: "intake" | "bypass" | "core" | "combustor" | "exhaust";
  progress: number;
  speed: number;
  radius: number;
  angle: number;
  swirlRate: number;
  turbulenceSeed: number;
  scale: number;
};

function VolumetricParticleFlow({
  engine,
  phase,
  reducedMotion,
}: {
  engine: EngineState;
  phase: ExperiencePhase;
  reducedMotion: boolean;
}) {
  const meshRef = useRef<InstancedMesh>(null);
  const pointerPos = useRef(new Vector2(0, 0));
  const count = 3600;

  const particles = useMemo(() => {
    const list: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const rand = Math.random();
      let stream: Particle["stream"];
      if (rand < 0.18) stream = "intake";
      else if (rand < 0.58) stream = "bypass";
      else if (rand < 0.78) stream = "core";
      else if (rand < 0.88) stream = "combustor";
      else stream = "exhaust";

      list.push({
        stream,
        progress: Math.random(),
        speed: 0.15 + Math.random() * 0.25,
        radius: 0.2 + Math.random() * 2.2,
        angle: Math.random() * Math.PI * 2,
        swirlRate: (Math.random() - 0.5) * 4.0,
        turbulenceSeed: Math.random() * 100,
        scale: 0.04 + Math.random() * 0.05,
      });
    }
    return list;
  }, [count]);

  const dummy = useMemo(() => new Object3D(), []);
  const matrix = useMemo(() => new Matrix4(), []);
  const color = useMemo(() => new Color(), []);

  // Colors for thermodynamic gradient
  const intakeCyan = useMemo(() => new Color("#00e5ff"), []);
  const bypassBlue = useMemo(() => new Color("#29b6f6"), []);
  const compressionAmber = useMemo(() => new Color("#ffb300"), []);
  const combustorOrange = useMemo(() => new Color("#ff3d00"), []);
  const combustorFlameYellow = useMemo(() => new Color("#ffea00"), []);
  const exhaustPlasma = useMemo(() => new Color("#ff6d00"), []);
  const exhaustCool = useMemo(() => new Color("#546e7a"), []);

  useFrame((state, delta) => {
    if (!meshRef.current || phase === "parts" || reducedMotion) return;

    const time = state.clock.elapsedTime;
    const throttleSpeed = 0.4 + engine.thrust * 1.8;
    const bypassSpeedMul = 0.5 + engine.bypassFlow * 2.2;
    const coreSpeedMul = 0.6 + engine.coreFlow * 2.5;

    for (let i = 0; i < count; i++) {
      const p = particles[i];

      // Update particle lifecycle progress
      let activeSpeed = p.speed * throttleSpeed;
      if (p.stream === "bypass") activeSpeed *= bypassSpeedMul;
      else if (p.stream === "core" || p.stream === "combustor") activeSpeed *= coreSpeedMul;
      else if (p.stream === "exhaust") activeSpeed *= 1.0 + engine.thrust * 2.6;

      p.progress = (p.progress + delta * activeSpeed * 0.35) % 1;
      const t = p.progress;

      let x = 0;
      let y = 0;
      let z = 0;
      let pScale = p.scale;
      let pColor = intakeCyan;

      if (p.stream === "intake") {
        // Funnel air into the fan inlet: x from -7.0 to -3.4
        x = MathUtils.lerp(-7.2, -3.4, t);
        const funnel = MathUtils.lerp(3.2, 1.8, t);
        const curAngle = p.angle + time * p.swirlRate * (0.5 + engine.lowSpool);
        y = Math.cos(curAngle) * p.radius * (funnel / 2.2);
        z = Math.sin(curAngle) * p.radius * (funnel / 2.2);
        pColor = intakeCyan;
        pScale = p.scale * (0.8 + t * 0.4);
      } else if (p.stream === "bypass") {
        // Bypass duct stream: x from -3.3 to +4.8
        x = MathUtils.lerp(-3.3, 4.8, t);
        const ductRadius = MathUtils.lerp(2.2, 1.5, t);
        const curAngle = p.angle + (x + 3.3) * 0.8 + time * 0.8;
        y = Math.cos(curAngle) * (ductRadius + (Math.sin(p.turbulenceSeed + time * 2) * 0.1));
        z = Math.sin(curAngle) * (ductRadius + (Math.cos(p.turbulenceSeed + time * 2) * 0.1));
        pColor = bypassBlue;
        pScale = p.scale * (0.9 + engine.bypassFlow * 0.5);
      } else if (p.stream === "core") {
        // Squeezing through compressors: x from -3.3 to 0.15
        x = MathUtils.lerp(-3.3, 0.15, t);
        const coreRadius = MathUtils.lerp(1.2, 0.55, t);
        const curAngle = p.angle + time * (1.5 + engine.highSpool * 4.0);
        y = Math.cos(curAngle) * (p.radius * 0.4 + coreRadius * 0.5);
        z = Math.sin(curAngle) * (p.radius * 0.4 + coreRadius * 0.5);
        // Heating gradient from cyan to amber
        pColor = color.lerpColors(intakeCyan, compressionAmber, Math.pow(t, 1.5));
        pScale = p.scale * (1.1 - t * 0.4);
      } else if (p.stream === "combustor") {
        // Swirling plasma combustion flame: x from 0.15 to 1.35
        x = MathUtils.lerp(0.15, 1.35, t);
        const flameRadius = 0.65 + Math.sin(t * Math.PI) * 0.22;
        const curAngle = p.angle + time * (4.0 + engine.heat * 12.0) + Math.sin(p.turbulenceSeed) * 0.8;
        y = Math.cos(curAngle) * flameRadius;
        z = Math.sin(curAngle) * flameRadius;
        // Vibrant flame burst
        pColor = color.lerpColors(combustorOrange, combustorFlameYellow, Math.sin(t * Math.PI + time * 6));
        pScale = p.scale * (1.4 + engine.heat * 1.2);
      } else {
        // High-velocity exhaust jet wake: x from 1.35 to 8.5
        x = MathUtils.lerp(1.35, 8.5, t);
        const expansion = MathUtils.lerp(0.5, 2.6, t);
        // Supersonic shock diamond periodic oscillation when high throttle
        const shockDiamond = engine.thrust > 0.6 ? Math.sin((x - 3.8) * 6.0) * 0.15 : 0;
        const curAngle = p.angle + (x - 1.35) * 0.6 + time * 1.5;
        y = Math.cos(curAngle) * (expansion + shockDiamond);
        z = Math.sin(curAngle) * (expansion + shockDiamond);
        // Color shifts from bright plasma to cooler trailing wake
        if (t < 0.35) {
          pColor = color.lerpColors(combustorFlameYellow, exhaustPlasma, t / 0.35);
        } else {
          pColor = color.lerpColors(exhaustPlasma, exhaustCool, (t - 0.35) / 0.65);
        }
        pScale = p.scale * (1.3 + engine.thrust * 1.6) * (1.0 - t * 0.4);
      }

      // Apply to instanced mesh matrix
      dummy.position.set(x * 0.78, y * 0.78, z * 0.78);
      dummy.scale.setScalar(pScale * 0.78);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      meshRef.current.setColorAt(i, pColor);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  if (phase === "parts") return null;

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, count]}
      frustumCulled={false}
    >
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial
        blending={AdditiveBlending}
        depthWrite={false}
        transparent
        opacity={0.85}
      />
    </instancedMesh>
  );
}

// -------------------------------------------------------------
// CINEMATIC CAMERA CHOREOGRAPHY
// -------------------------------------------------------------
function EngineCamera({
  progress,
  phase,
  selectedPart,
  reducedMotion,
}: {
  progress: number;
  phase: ExperiencePhase;
  selectedPart: EnginePartId | null;
  reducedMotion: boolean;
}) {
  const { camera } = useThree();
  const target = useRef(new Vector3(0, 0, 0));

  useFrame((_, delta) => {
    let focusX = 0;
    let focusY = 0;
    let focusZ = 0;
    let camDistance = 12.8;
    let camElevation = 4.2;
    let camSide = 1.2;

    if (phase === "airflow") {
      focusX = MathUtils.lerp(-3.3, 3.6, progress);
      camDistance = 10.4;
      camElevation = 3.6;
      camSide = focusX + 1.0;
    } else if (phase === "parts") {
      if (selectedPart) {
        const part = fullThrottleContent.parts.find((p) => p.id === selectedPart);
        if (part) {
          focusX = part.hotspotPosition[0] * 0.78;
          focusY = 0;
          camDistance = 8.5;
          camElevation = 2.4;
          camSide = focusX + 0.6;
        }
      }
    } else if (phase === "throttle") {
      focusX = 0.5;
      camDistance = 11.5;
      camElevation = 3.8;
      camSide = 2.4;
    }

    const nextPos = new Vector3(camSide, camElevation, camDistance);
    const nextTarget = new Vector3(focusX, focusY, focusZ);

    if (reducedMotion) {
      camera.position.copy(nextPos);
      target.current.copy(nextTarget);
    } else {
      camera.position.lerp(nextPos, Math.min(1, delta * 3.2));
      target.current.lerp(nextTarget, Math.min(1, delta * 3.6));
    }
    camera.lookAt(target.current);
  });

  return null;
}

// -------------------------------------------------------------
// SCENE LIGHTING & ENVIRONMENT
// -------------------------------------------------------------
function SceneContents(props: EngineSceneProps) {
  return (
    <>
      <color attach="background" args={["#070a0e"]} />
      
      {/* Studio Lighting */}
      <ambientLight intensity={1.2} />
      <directionalLight
        castShadow
        color="#f0f4f8"
        intensity={3.8}
        position={[6, 9, 10]}
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight
        color="#00e5ff"
        intensity={2.2}
        position={[-8, 3, 6]}
      />
      <directionalLight
        color="#ff6b2b"
        intensity={1.8}
        position={[8, -2, -6]}
      />

      {/* Dynamic Internal Combustor Light */}
      <pointLight
        color="#ff5500"
        distance={6.5}
        intensity={props.engine.heat * 32.0 + 2.0}
        position={[0.65 * 0.78, 0.2, 0]}
      />

      {/* Dynamic Exhaust Glow Light */}
      <pointLight
        color="#ff7700"
        distance={8.0}
        intensity={props.engine.thrust * 45.0}
        position={[4.2 * 0.78, 0, 0]}
      />

      <group rotation={[0, -0.02, 0]}>
        <TurbofanModel {...props} />
        <PartHotspots
          engine={props.engine}
          onSelectPart={props.onSelectPart}
          phase={props.phase}
          selectedPart={props.selectedPart}
        />
        <VolumetricParticleFlow
          engine={props.engine}
          phase={props.phase}
          reducedMotion={props.reducedMotion}
        />
      </group>

      {/* Dark Studio Floor Shadow Mirror */}
      <mesh position={[0, -2.85, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[12, 4.5, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color="#020406" depthWrite={false} opacity={0.65} transparent />
      </mesh>

      <EngineCamera
        phase={props.phase}
        progress={props.engine.cameraProgress}
        reducedMotion={props.reducedMotion}
        selectedPart={props.selectedPart}
      />

      <OrbitControls
        enableDamping
        enablePan={false}
        maxDistance={17}
        maxPolarAngle={Math.PI / 2 + 0.15}
        minDistance={5.5}
        minPolarAngle={0.4}
        target={[0, 0, 0]}
      />
    </>
  );
}

export default function EngineScene(props: EngineSceneProps) {
  return (
    <Canvas
      camera={{ fov: 36, near: 0.1, far: 100, position: [2.4, 3.8, 12.8] }}
      dpr={[1, 2]}
      frameloop={props.reducedMotion ? "demand" : "always"}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
    >
      <Suspense fallback={null}>
        <SceneContents {...props} />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload("/models/turbofan-parts.glb");
