"use client";

import { OrbitControls, useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import { latLonToVector3 } from "@/lib/space/geo";
import type { CelestialBody, Hotspot } from "@/lib/space/schema";
import styles from "./space.module.css";

type SpaceCanvasProps = {
  body: CelestialBody;
  visibleHotspots: Hotspot[];
  selectedHotspotId: string | null;
  flyToId: string | null;
  isNightMode: boolean;
  isWaterMode: boolean;
  reducedMotion: boolean;
  categoryColor: (category: string) => string;
  onSelectHotspot: (id: string) => void;
  onFlightSettled: () => void;
};

function HotspotMarkers({
  body,
  visibleHotspots,
  selectedHotspotId,
  categoryColor,
  onSelectHotspot,
}: {
  body: CelestialBody;
  visibleHotspots: Hotspot[];
  selectedHotspotId: string | null;
  categoryColor: (category: string) => string;
  onSelectHotspot: (id: string) => void;
}) {
  return (
    <>
      {visibleHotspots.map((hotspot) => {
        const position = latLonToVector3(hotspot.lat, hotspot.lon, body.radius * 1.012);
        const isActive = hotspot.id === selectedHotspotId;
        const color = categoryColor(hotspot.category);
        return (
          <group key={hotspot.id} position={position}>
            <mesh
              scale={isActive ? 0.075 : 0.055}
              onClick={(event) => {
                event.stopPropagation();
                onSelectHotspot(hotspot.id);
              }}
              onPointerEnter={(event) => {
                event.stopPropagation();
                document.body.style.cursor = "pointer";
              }}
              onPointerLeave={() => {
                document.body.style.cursor = "default";
              }}
            >
              <sphereGeometry args={[1, 16, 12]} />
              <meshBasicMaterial color={color} toneMapped={false} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]} scale={isActive ? 0.13 : 0.09}>
              <ringGeometry args={[0.75, 1, 24]} />
              <meshBasicMaterial
                color={color}
                toneMapped={false}
                transparent
                opacity={isActive ? 0.9 : 0.45}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
          </group>
        );
      })}
    </>
  );
}

function BodyGroup({
  body,
  isNightMode,
  isWaterMode,
  reducedMotion,
  spinPaused,
  groupRef,
  children,
}: {
  body: CelestialBody;
  isNightMode: boolean;
  isWaterMode: boolean;
  reducedMotion: boolean;
  spinPaused: boolean;
  groupRef: React.RefObject<THREE.Group | null>;
  children?: React.ReactNode;
}) {
  const dayTexture = useTexture(body.colorTexture);
  const nightTexture = useTexture(body.nightTexture ?? body.colorTexture);
  const dayMaterial = useRef<THREE.MeshStandardMaterial>(null);
  const nightMaterial = useRef<THREE.MeshBasicMaterial>(null);
  const sunLight = useRef<THREE.DirectionalLight>(null);

  dayTexture.colorSpace = THREE.SRGBColorSpace;
  if (body.nightTexture) nightTexture.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, delta) => {
    if (!reducedMotion && !spinPaused && groupRef.current) {
      groupRef.current.rotation.y += (delta * Math.PI * 2) / body.rotationPeriodSec;
    }

    const nightTarget = isNightMode ? 1 : 0;
    if (nightMaterial.current) {
      nightMaterial.current.opacity = THREE.MathUtils.damp(
        nightMaterial.current.opacity,
        nightTarget,
        4,
        delta,
      );
    }
    if (dayMaterial.current) {
      const dimTarget = isNightMode || isWaterMode ? 0.16 : 1;
      const c = dayMaterial.current.color;
      c.r = THREE.MathUtils.damp(c.r, dimTarget, 4, delta);
      c.g = THREE.MathUtils.damp(c.g, dimTarget, 4, delta);
      c.b = THREE.MathUtils.damp(c.b, dimTarget, 4, delta);
    }
    if (sunLight.current) {
      const target = isWaterMode ? 0.25 : 1.6;
      sunLight.current.intensity = THREE.MathUtils.damp(sunLight.current.intensity, target, 4, delta);
    }
  });

  return (
    <group ref={groupRef}>
      <directionalLight ref={sunLight} position={[4, 2, 5]} intensity={1.6} color="#fff6e6" />
      <mesh
        onClick={(event) => event.stopPropagation()}
        onPointerMove={(event) => event.stopPropagation()}
      >
        <sphereGeometry args={[body.radius, 96, 64]} />
        <meshStandardMaterial ref={dayMaterial} map={dayTexture} roughness={0.95} metalness={0} />
      </mesh>
      {body.nightTexture ? (
        <mesh>
          <sphereGeometry args={[body.radius * 1.004, 96, 64]} />
          <meshBasicMaterial
            ref={nightMaterial}
            map={nightTexture}
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ) : null}
      {children}
    </group>
  );
}

function CameraDirector({
  hotspots,
  flyToId,
  reducedMotion,
  groupRef,
  onSettled,
}: {
  hotspots: Hotspot[];
  flyToId: string | null;
  reducedMotion: boolean;
  groupRef: React.RefObject<THREE.Group | null>;
  onSettled: () => void;
}) {
  const camera = useThree((state) => state.camera);
  const flying = useRef(false);
  const targetPos = useRef(new THREE.Vector3());
  const settleTimer = useRef(0);

  useEffect(() => {
    const hotspot = hotspots.find((item) => item.id === flyToId);
    if (!hotspot || !groupRef.current) {
      flying.current = false;
      return;
    }
    const local = latLonToVector3(hotspot.lat, hotspot.lon, 1);
    const worldDirection = local.clone().applyQuaternion(groupRef.current.quaternion).normalize();
    targetPos.current.copy(worldDirection.multiplyScalar(hotspot.cameraDistance));
    flying.current = true;
    settleTimer.current = 0;
    if (reducedMotion) {
      camera.position.copy(targetPos.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flyToId]);

  useFrame((_, delta) => {
    if (!flying.current) return;
    camera.position.lerp(targetPos.current, Math.min(1, delta * 3.2));
    camera.lookAt(0, 0, 0);
    settleTimer.current += delta;
    if (settleTimer.current > 1.1 || camera.position.distanceTo(targetPos.current) < 0.02) {
      flying.current = false;
      onSettled();
    }
  });

  return null;
}

function Scene(props: SpaceCanvasProps) {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <>
      <ambientLight intensity={0.35} color="#c9d4de" />
      <BodyGroup
        body={props.body}
        isNightMode={props.isNightMode}
        isWaterMode={props.isWaterMode}
        reducedMotion={props.reducedMotion}
        spinPaused={Boolean(props.selectedHotspotId) || Boolean(props.flyToId)}
        groupRef={groupRef}
      >
        <HotspotMarkers
          body={props.body}
          visibleHotspots={props.visibleHotspots}
          selectedHotspotId={props.selectedHotspotId}
          categoryColor={props.categoryColor}
          onSelectHotspot={props.onSelectHotspot}
        />
      </BodyGroup>
      <CameraDirector
        hotspots={props.body.hotspots}
        flyToId={props.flyToId}
        reducedMotion={props.reducedMotion}
        groupRef={groupRef}
        onSettled={props.onFlightSettled}
      />
      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping={!props.reducedMotion}
        dampingFactor={0.08}
        minDistance={props.body.radius * 1.25}
        maxDistance={props.body.radius * 3.6}
        onStart={props.onFlightSettled}
      />
    </>
  );
}

export function SpaceCanvas(props: SpaceCanvasProps) {
  return (
    <div className={styles.canvasRoot} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, props.body.radius * 2.4], fov: 42, near: 0.1, far: 100 }}
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

export default SpaceCanvas;
