"use client";

import { OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { atlasModelPaths, type AtlasModelKey } from "@/content/space/atlas-assets";
import { getVisibleHotspots } from "@/content/space/atlas";
import { latLonToVector3 } from "@/lib/space/geo";
import { comparisonRadii } from "@/lib/space/atlas-scale";
import type { PlanetaryWorld, WorldHotspot } from "@/lib/space/atlas-schema";
import type { AtlasCanvasRuntimeProps, RenderLayers } from "./AtlasStage";
import styles from "./atlas.module.css";

function modelPath(world: PlanetaryWorld) {
  if (world.id === "sun" || world.id === "moon") return null;
  return atlasModelPaths[world.id as AtlasModelKey];
}

function OfficialWorld({ world, stageRadius = 1 }: { world: PlanetaryWorld; stageRadius?: number }) {
  const path = modelPath(world);
  if (!path) return null;
  return <OfficialWorldAsset world={world} path={path} stageRadius={stageRadius} />;
}

function OfficialWorldAsset({
  world,
  path,
  stageRadius,
}: {
  world: PlanetaryWorld;
  path: string;
  stageRadius: number;
}) {
  const { scene } = useGLTF(path);
  const normalized = useMemo(() => {
    const object = scene.clone(true);
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const longest = Math.max(size.x, size.y, size.z) || 1;
    const scale = (stageRadius * 2) / longest;
    object.scale.setScalar(scale);
    object.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = false;
        child.receiveShadow = false;
      }
    });
    return object;
  }, [scene, stageRadius]);

  return (
    <group rotation={[0, 0, THREE.MathUtils.degToRad(world.renderer.axialTilt)]}>
      <primitive object={normalized} />
    </group>
  );
}

function InteriorWorld({ world, stageRadius }: { world: PlanetaryWorld; stageRadius: number }) {
  return (
    <group rotation={[0, -0.45, 0]}>
      <mesh>
        <sphereGeometry args={[stageRadius, 96, 64, 0, Math.PI * 1.5]} />
        <meshStandardMaterial
          color={world.accent}
          roughness={0.82}
          metalness={0}
          side={THREE.DoubleSide}
          transparent
          opacity={0.26}
        />
      </mesh>
      {world.interiorLayers.map((layer, index) => (
        <mesh key={layer.label} rotation={[0, Math.PI * 0.08 * index, 0]}>
          <sphereGeometry
            args={[
              Math.max(0.08, stageRadius * layer.radiusRatio * 0.94),
              64,
              40,
              Math.PI * 1.5,
              Math.PI * 0.5,
            ]}
          />
          <meshStandardMaterial
            color={layer.color}
            roughness={0.7}
            metalness={0.03}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

function MagneticField({ color, radius }: { color: string; radius: number }) {
  return (
    <group rotation={[0.3, 0.2, 0.55]}>
      {[1.28, 1.52, 1.8].map((scale, index) => (
        <mesh key={scale} rotation={[Math.PI / 2, index * 0.52, 0]}>
          <torusGeometry args={[radius * scale, 0.007, 8, 96]} />
          <meshBasicMaterial color={color} transparent opacity={0.34 - index * 0.07} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function WorldMarkers({
  hotspots,
  radius,
  selectedHotspotId,
  onSelectHotspot,
}: {
  hotspots: WorldHotspot[];
  radius: number;
  selectedHotspotId: string | null;
  onSelectHotspot: (id: string) => void;
}) {
  return (
    <>
      {hotspots.map((hotspot) => {
        const active = hotspot.id === selectedHotspotId;
        const position = latLonToVector3(hotspot.lat, hotspot.lon, radius * 1.018);
        return (
          <group key={hotspot.id} position={position}>
            <mesh
              scale={active ? 0.047 : 0.032}
              onClick={(event) => {
                event.stopPropagation();
                onSelectHotspot(hotspot.id);
              }}
              onPointerEnter={() => {
                document.body.style.cursor = "pointer";
              }}
              onPointerLeave={() => {
                document.body.style.cursor = "default";
              }}
            >
              <sphereGeometry args={[1, 18, 12]} />
              <meshBasicMaterial color="#f5e9d6" toneMapped={false} />
            </mesh>
            <mesh scale={active ? 0.1 : 0.072}>
              <ringGeometry args={[0.7, 1, 30]} />
              <meshBasicMaterial
                color={active ? "#d76736" : "#f5e9d6"}
                transparent
                opacity={active ? 0.92 : 0.48}
                side={THREE.DoubleSide}
                depthWrite={false}
                toneMapped={false}
              />
            </mesh>
          </group>
        );
      })}
    </>
  );
}

function ProceduralWorld({
  world,
  layers,
  stageRadius = 1,
  selectedHotspotId,
  modeId,
  onSelectHotspot,
  showMarkers = true,
}: {
  world: PlanetaryWorld;
  layers: RenderLayers;
  stageRadius?: number;
  selectedHotspotId: string | null;
  modeId: string;
  onSelectHotspot: (id: string) => void;
  showMarkers?: boolean;
}) {
  const urls = [
    layers.baseTexture,
    ...(layers.bumpTexture ? [layers.bumpTexture] : []),
    ...(layers.cloudTexture ? [layers.cloudTexture] : []),
    ...(layers.ringTexture ? [layers.ringTexture] : []),
  ];
  const loaded = useLoader(THREE.TextureLoader, urls) as THREE.Texture[];
  let cursor = 0;
  const colorTexture = loaded[cursor++];
  const bumpTexture = layers.bumpTexture ? loaded[cursor++] : undefined;
  const cloudTexture = layers.cloudTexture ? loaded[cursor++] : undefined;
  const ringTexture = layers.ringTexture ? loaded[cursor++] : undefined;
  const visibleHotspots = getVisibleHotspots(world, modeId);

  colorTexture.colorSpace = THREE.SRGBColorSpace;
  colorTexture.anisotropy = 8;
  if (cloudTexture) cloudTexture.colorSpace = THREE.SRGBColorSpace;
  if (ringTexture) ringTexture.colorSpace = THREE.SRGBColorSpace;

  if (layers.interior) return <InteriorWorld world={world} stageRadius={stageRadius} />;

  const isSun = world.renderer.kind === "sun";
  const isGas = world.renderer.kind === "gas" || world.renderer.kind === "rings";
  const flattening = "flattening" in world.renderer ? world.renderer.flattening : 0;

  return (
    <group
      rotation={[0, 0, THREE.MathUtils.degToRad(world.renderer.axialTilt)]}
      scale={[1, 1 - flattening, 1]}
    >
      <mesh>
        <sphereGeometry args={[stageRadius, 160, 112]} />
        {isSun ? (
          <meshStandardMaterial
            map={colorTexture}
            color="#fff5db"
            emissive="#ff9a34"
            emissiveMap={colorTexture}
            emissiveIntensity={"emissiveIntensity" in world.renderer ? world.renderer.emissiveIntensity : 1.6}
            roughness={0.78}
          />
        ) : (
          <meshStandardMaterial
            map={colorTexture}
            bumpMap={bumpTexture}
            bumpScale={"bumpScale" in world.renderer ? world.renderer.bumpScale : 0}
            roughness={isGas ? 0.82 : "roughness" in world.renderer ? world.renderer.roughness : 0.9}
            metalness={0}
            emissive={layers.night ? "#d8a256" : "#000000"}
            emissiveMap={layers.night ? colorTexture : undefined}
            emissiveIntensity={layers.night ? 0.82 : 0}
          />
        )}
      </mesh>

      {cloudTexture && (world.id === "earth" || layers.atmosphere) ? (
        <mesh scale={1.012}>
          <sphereGeometry args={[stageRadius, 128, 84]} />
          <meshStandardMaterial
            map={cloudTexture}
            alphaMap={cloudTexture}
            transparent
            opacity={world.renderer.kind === "earth" ? world.renderer.cloudOpacity : 0.48}
            roughness={0.9}
            depthWrite={false}
          />
        </mesh>
      ) : null}

      {world.renderer.atmosphereColor ? (
        <mesh scale={1.027}>
          <sphereGeometry args={[stageRadius, 96, 64]} />
          <meshBasicMaterial
            color={world.renderer.atmosphereColor}
            transparent
            opacity={layers.atmosphere ? 0.13 : 0.055}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ) : null}

      {layers.rings && ringTexture ? (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry
            args={[
              stageRadius * ("ringInner" in world.renderer ? world.renderer.ringInner : 1.28),
              stageRadius * ("ringOuter" in world.renderer ? world.renderer.ringOuter : 1.86),
              192,
            ]}
          />
          <meshStandardMaterial
            map={ringTexture}
            alphaMap={ringTexture}
            transparent
            opacity={0.9}
            side={THREE.DoubleSide}
            roughness={0.88}
            depthWrite={false}
          />
        </mesh>
      ) : null}

      {layers.magnetic ? <MagneticField color={world.accent} radius={stageRadius} /> : null}

      {showMarkers ? (
        <WorldMarkers
          hotspots={visibleHotspots}
          radius={stageRadius}
          selectedHotspotId={selectedHotspotId}
          onSelectHotspot={onSelectHotspot}
        />
      ) : null}
    </group>
  );
}

function SpinGroup({
  world,
  reducedMotion,
  paused,
  children,
}: {
  world: PlanetaryWorld;
  reducedMotion: boolean;
  paused: boolean;
  children: React.ReactNode;
}) {
  const group = useRef<THREE.Group>(null);
  const [pageVisible, setPageVisible] = useState(true);

  useEffect(() => {
    function onVisibility() {
      setPageVisible(document.visibilityState !== "hidden");
    }
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useFrame((_, delta) => {
    if (group.current && pageVisible && !reducedMotion && !paused) {
      group.current.rotation.y += (delta * Math.PI * 2) / world.renderer.rotationSeconds;
    }
  });

  return <group ref={group}>{children}</group>;
}

function CameraCommand({
  command,
  compareOpen,
}: {
  command: AtlasCanvasRuntimeProps["cameraCommand"];
  compareOpen: boolean;
}) {
  const camera = useThree((state) => state.camera);

  useEffect(() => {
    if (command.type === "idle") return;
    if (command.type === "reset") {
      camera.position.set(0, 0, compareOpen ? 4.4 : 3.15);
      camera.lookAt(0, 0, 0);
      return;
    }
    const distance = camera.position.length();
    const multiplier = command.type === "zoom-in" ? 0.8 : 1.2;
    const next = THREE.MathUtils.clamp(distance * multiplier, 1.55, 6.5);
    camera.position.setLength(next);
    camera.lookAt(0, 0, 0);
  }, [camera, command, compareOpen]);

  return null;
}

function baseLayers(world: PlanetaryWorld): RenderLayers {
  return {
    baseTexture: world.assets.color,
    bumpTexture: world.assets.bump,
    cloudTexture: world.assets.layers.clouds,
    ringTexture: world.assets.layers.rings,
    atmosphere: false,
    emissive: world.renderer.kind === "sun",
    interior: false,
    magnetic: false,
    night: false,
    rings: world.renderer.kind === "rings",
    showHotspots: false,
    useOfficialModel: false,
  };
}

function Scene(props: AtlasCanvasRuntimeProps) {
  const compareOpen = Boolean(props.compareWorld);
  const [primaryRadius, secondaryRadius] = props.compareWorld
    ? comparisonRadii(
        props.world.physical.radiusKm,
        props.compareWorld.physical.radiusKm,
        props.compareScalePolicy,
      )
    : [1, 1];
  const azimuth = THREE.MathUtils.degToRad(props.lightAzimuth);
  const elevation = THREE.MathUtils.degToRad(props.lightElevation);
  const lightPosition: [number, number, number] = [
    Math.sin(azimuth) * Math.cos(elevation) * 5,
    Math.sin(elevation) * 5,
    Math.cos(azimuth) * Math.cos(elevation) * 5,
  ];

  return (
    <>
      <ambientLight intensity={props.layers.night ? 0.08 : 0.3} color="#d9e3ea" />
      <directionalLight
        position={lightPosition}
        intensity={props.world.renderer.kind === "sun" ? 0.35 : 2.35}
        color="#fff1d6"
      />
      <pointLight position={[-4, -2, -3]} intensity={0.22} color={props.world.accent} />

      <group position={[compareOpen ? -1.24 : 0, 0, 0]} scale={compareOpen ? 0.69 : 1}>
        <SpinGroup
          world={props.world}
          reducedMotion={props.reducedMotion}
          paused={Boolean(props.selectedHotspotId) || compareOpen}
        >
          {props.layers.useOfficialModel && !compareOpen ? (
            <OfficialWorld world={props.world} stageRadius={primaryRadius} />
          ) : (
            <ProceduralWorld
              world={props.world}
              layers={props.layers}
              stageRadius={primaryRadius}
              selectedHotspotId={props.selectedHotspotId}
              modeId={props.mode.id}
              onSelectHotspot={props.onSelectHotspot}
              showMarkers={!compareOpen}
            />
          )}
        </SpinGroup>
      </group>

      {props.compareWorld ? (
        <group position={[1.24, 0, 0]} scale={0.69}>
          <SpinGroup world={props.compareWorld} reducedMotion={props.reducedMotion} paused>
            <ProceduralWorld
              world={props.compareWorld}
              layers={baseLayers(props.compareWorld)}
              stageRadius={secondaryRadius}
              selectedHotspotId={null}
              modeId={props.compareWorld.defaultModeId}
              onSelectHotspot={() => undefined}
              showMarkers={false}
            />
          </SpinGroup>
        </group>
      ) : null}

      <CameraCommand command={props.cameraCommand} compareOpen={compareOpen} />
      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping={!props.reducedMotion}
        dampingFactor={0.065}
        minDistance={1.55}
        maxDistance={6.5}
        autoRotate={false}
      />
    </>
  );
}

export default function AtlasCanvas(props: AtlasCanvasRuntimeProps) {
  return (
    <div className={styles.canvasLayer} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, props.compareWorld ? 4.4 : 3.15], fov: 39, near: 0.05, far: 80 }}
        dpr={[1, 1.7]}
        frameloop="always"
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: false,
        }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.08;
          gl.localClippingEnabled = true;
        }}
      >
        <Suspense fallback={null}>
          <Scene {...props} />
        </Suspense>
      </Canvas>
    </div>
  );
}
