"use client";

import { Html, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { getVisibleHotspots } from "@/content/space/atlas";
import { atlasModelPaths } from "@/content/space/atlas-assets";
import { comparisonRadii } from "@/lib/space/atlas-scale";
import { latLonToVector3 } from "@/lib/space/geo";
import { useOrientationReporter } from "@/lib/space/orientation-reporter";
import { applyRadialRingUvs, SATURN_RING_TILT_RADIANS } from "@/lib/space/ring-geometry";
import { SOLAR_DISC_U_SCALE, SOLAR_DISC_V_SCALE } from "@/lib/space/solar-projection";
import { surfaceMaterialKind } from "@/lib/space/surface-lighting";
import {
  officialSaturnGlobeRadius,
  officialSaturnScale,
  rotationAxisVisible,
  SATURN_MODEL_TILT_RADIANS,
  surfaceModelKind,
} from "@/lib/space/surface-model";
import type { PlanetaryWorld, WorldHotspot } from "@/lib/space/atlas-schema";
import { FEATURE_CALLOUT_DISTANCE_FACTOR, focusVectorQuaternion } from "@/lib/space/world-focus";
import type { AtlasCanvasRuntimeProps, RenderLayers } from "./AtlasStage";
import styles from "./atlas.module.css";

function InteriorWorld({ world, stageRadius }: { world: PlanetaryWorld; stageRadius: number }) {
  return (
    <group rotation={[0, -0.45, 0]}>
      <mesh>
        <sphereGeometry args={[stageRadius, 96, 64, 0, Math.PI * 1.5]} />
        <meshStandardMaterial color={world.accent} roughness={0.82} metalness={0} side={THREE.DoubleSide} transparent opacity={0.22} />
      </mesh>
      {world.interiorLayers.map((layer, index) => (
        <mesh key={layer.label} rotation={[0, Math.PI * 0.08 * index, 0]}>
          <sphereGeometry args={[Math.max(0.08, stageRadius * layer.radiusRatio * 0.94), 64, 40, Math.PI * 1.5, Math.PI * 0.5]} />
          <meshStandardMaterial color={layer.color} roughness={0.7} metalness={0.03} side={THREE.DoubleSide} />
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
          <torusGeometry args={[radius * scale, 0.006, 8, 128]} />
          <meshBasicMaterial color={color} transparent opacity={0.28 - index * 0.055} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function MissionSystem({ color, radius }: { color: string; radius: number }) {
  return (
    <group>
      {[0, 0.82].map((tilt, index) => (
        <group key={tilt} rotation={[Math.PI / 2 + tilt * 0.2, tilt, tilt * 0.38]}>
          <mesh>
            <torusGeometry args={[radius * (1.28 + index * 0.2), 0.006, 8, 128]} />
            <meshBasicMaterial color={color} transparent opacity={0.45} toneMapped={false} />
          </mesh>
          <mesh position={[radius * (1.28 + index * 0.2), 0, 0]}>
            <sphereGeometry args={[radius * 0.025, 16, 12]} />
            <meshBasicMaterial color="#fff3df" toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function RotationAxisGuide({ color, radius }: { color: string; radius: number }) {
  const axisLength = radius * 3.35;
  const poleOffset = axisLength / 2;

  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius * 1.075, radius * 0.006, 8, 160]} />
        <meshBasicMaterial color={color} transparent opacity={0.42} toneMapped={false} />
      </mesh>
      <mesh renderOrder={4}>
        <cylinderGeometry args={[radius * 0.011, radius * 0.011, axisLength, 12]} />
        <meshBasicMaterial color={color} transparent opacity={0.7} depthTest={false} toneMapped={false} />
      </mesh>
      {[-1, 1].map((direction) => (
        <group key={direction} position={[0, direction * poleOffset, 0]}>
          <mesh renderOrder={4}>
            <sphereGeometry args={[radius * 0.045, 18, 12]} />
            <meshBasicMaterial color={color} depthTest={false} toneMapped={false} />
          </mesh>
          <mesh renderOrder={4} position={[0, direction * radius * 0.07, 0]} rotation={[0, 0, direction < 0 ? Math.PI : 0]}>
            <coneGeometry args={[radius * 0.065, radius * 0.16, 20]} />
            <meshBasicMaterial color={color} depthTest={false} toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function SolarSurfaceMaterial({
  texture,
  tint = "#fff7e8",
  opacity = 1,
  additive = false,
}: {
  texture: THREE.Texture;
  tint?: string;
  opacity?: number;
  additive?: boolean;
}) {
  const uniforms = useMemo(() => ({
    surfaceMap: { value: texture },
    tint: { value: new THREE.Color(tint) },
    surfaceOpacity: { value: opacity },
  }), [opacity, texture, tint]);

  return (
    <shaderMaterial
      uniforms={uniforms}
      transparent={opacity < 1}
      blending={additive ? THREE.AdditiveBlending : THREE.NormalBlending}
      depthWrite={!additive}
      toneMapped={false}
      vertexShader={`
        varying vec3 vNormalObject;
        void main() {
          vNormalObject = normalize(normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `}
      fragmentShader={`
        uniform sampler2D surfaceMap;
        uniform vec3 tint;
        uniform float surfaceOpacity;
        varying vec3 vNormalObject;
        void main() {
          vec3 n = normalize(vNormalObject);
          vec2 solarUv = vec2(
            0.5 + n.x * ${SOLAR_DISC_U_SCALE.toFixed(3)},
            0.5 - n.y * ${SOLAR_DISC_V_SCALE.toFixed(3)}
          );
          vec3 observedSurface = pow(texture2D(surfaceMap, solarUv).rgb, vec3(0.56)) * 1.44;
          gl_FragColor = vec4(observedSurface * tint, surfaceOpacity);
        }
      `}
    />
  );
}

function SolarFlow({ texture, radius, enabled }: { texture: THREE.Texture; radius: number; enabled: boolean }) {
  const flow = useRef<THREE.Mesh>(null);
  const prominences = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!enabled) return;
    if (flow.current) flow.current.rotation.y += delta * 0.035;
    if (prominences.current) {
      prominences.current.rotation.y -= delta * 0.06;
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 0.9) * 0.035;
      prominences.current.scale.setScalar(pulse);
    }
  });

  return (
    <>
      <mesh ref={flow} scale={1.004}>
        <sphereGeometry args={[radius, 128, 84]} />
        <SolarSurfaceMaterial texture={texture} tint="#ffbb73" opacity={0.14} additive />
      </mesh>
      <mesh scale={1.055}>
        <sphereGeometry args={[radius, 96, 64]} />
        <meshBasicMaterial color="#ff6a25" transparent opacity={0.11} side={THREE.BackSide} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <group ref={prominences}>
        {[
          { position: [0.84, 0.42, 0.28], rotation: [0.2, 0.85, -0.38] },
          { position: [-0.7, -0.48, 0.46], rotation: [-0.34, -0.72, 0.72] },
        ].map((prominence, index) => (
          <mesh
            key={index}
            position={prominence.position.map((value) => value * radius) as [number, number, number]}
            rotation={prominence.rotation as [number, number, number]}
          >
            <torusGeometry args={[radius * 0.17, radius * 0.012, 10, 64, Math.PI * 1.45]} />
            <meshBasicMaterial color={index === 0 ? "#ff7a2d" : "#ffb15c"} transparent opacity={0.68} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
          </mesh>
        ))}
      </group>
    </>
  );
}

function AtmosphericFlow({ texture, radius, enabled }: { texture: THREE.Texture; radius: number; enabled: boolean }) {
  const flow = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (enabled && flow.current) flow.current.rotation.y += delta * 0.025;
  });
  return (
    <mesh ref={flow} scale={1.006}>
      <sphereGeometry args={[radius, 128, 84]} />
      <meshBasicMaterial map={texture} transparent opacity={0.085} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

function TemperatureSurface({ texture, radius }: { texture: THREE.Texture; radius: number }) {
  const uniforms = useMemo(() => ({
    surfaceMap: { value: texture },
    hotColor: { value: new THREE.Color("#ff9a3d") },
    coldColor: { value: new THREE.Color("#315f94") },
  }), [texture]);

  return (
    <mesh>
      <sphereGeometry args={[radius, 160, 112]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          varying vec3 vNormalObject;
          void main() {
            vUv = uv;
            vNormalObject = normalize(normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform sampler2D surfaceMap;
          uniform vec3 hotColor;
          uniform vec3 coldColor;
          varying vec2 vUv;
          varying vec3 vNormalObject;
          void main() {
            vec3 source = normalize(vec3(0.8, 0.18, 0.55));
            float exposure = smoothstep(-0.55, 0.72, dot(normalize(vNormalObject), source));
            vec3 thermal = mix(coldColor, hotColor, exposure);
            vec3 surface = texture2D(surfaceMap, vUv).rgb;
            gl_FragColor = vec4(mix(surface, thermal, 0.58), 1.0);
          }
        `}
      />
    </mesh>
  );
}

function WorldMarkers({ hotspots, radius, surfaceRadius = radius, selectedHotspotId, onSelectHotspot }: {
  hotspots: WorldHotspot[];
  radius: number;
  surfaceRadius?: number;
  selectedHotspotId: string | null;
  onSelectHotspot: (id: string) => void;
}) {
  return (
    <>
      {hotspots.map((hotspot, index) => {
        const active = hotspot.id === selectedHotspotId;
        const markerRadius = hotspot.renderRadius ? radius * hotspot.renderRadius : surfaceRadius;
        const position = latLonToVector3(
          hotspot.renderLat ?? hotspot.lat,
          hotspot.renderLon ?? hotspot.lon,
          markerRadius * 1.018,
        );
        const orientation = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), position.clone().normalize());
        return (
          <group key={hotspot.id} position={position} quaternion={orientation}>
            <mesh
              scale={active ? 0.047 : 0.032}
              onClick={(event) => { event.stopPropagation(); onSelectHotspot(hotspot.id); }}
              onPointerEnter={() => { document.body.style.cursor = "pointer"; }}
              onPointerLeave={() => { document.body.style.cursor = "default"; }}
            >
              <sphereGeometry args={[1, 18, 12]} />
              <meshBasicMaterial color="#fff5e6" depthTest={false} toneMapped={false} />
            </mesh>
            <mesh scale={active ? 0.105 : 0.072}>
              <ringGeometry args={[0.68, 1, 30]} />
              <meshBasicMaterial color={active ? "#d76736" : "#fff5e6"} transparent opacity={active ? 0.96 : 0.62} side={THREE.DoubleSide} depthWrite={false} depthTest={false} toneMapped={false} />
            </mesh>
            {active ? (
              <Html center distanceFactor={FEATURE_CALLOUT_DISTANCE_FACTOR} position={[0.13, 0.12, 0.04]} occlude zIndexRange={[40, 10]} style={{ pointerEvents: "none" }}>
                <div className={styles.canvasCallout}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{hotspot.label}</strong>
                </div>
              </Html>
            ) : null}
          </group>
        );
      })}
    </>
  );
}

function RingSystem({ world, texture, stageRadius }: { world: PlanetaryWorld; texture: THREE.Texture; stageRadius: number }) {
  const innerRadius = stageRadius * ("ringInner" in world.renderer ? world.renderer.ringInner : 1.28);
  const outerRadius = stageRadius * ("ringOuter" in world.renderer ? world.renderer.ringOuter : 1.86);
  const geometry = useMemo(
    () => applyRadialRingUvs(new THREE.RingGeometry(innerRadius, outerRadius, 256), innerRadius, outerRadius),
    [innerRadius, outerRadius],
  );
  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <mesh rotation={[SATURN_RING_TILT_RADIANS, 0, 0]}>
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial map={texture} alphaMap={texture} transparent opacity={0.94} alphaTest={0.025} side={THREE.DoubleSide} roughness={0.9} depthWrite={false} />
    </mesh>
  );
}

function OfficialSaturnModel({ stageRadius }: { stageRadius: number }) {
  const { scene } = useGLTF(atlasModelPaths.saturn);
  const model = useMemo(() => {
    const clone = scene.clone(true);

    clone.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      const sourceMaterials = Array.isArray(object.material) ? object.material : [object.material];
      const materials = sourceMaterials.map((sourceMaterial) => {
        const material = sourceMaterial.clone();
        material.side = material.transparent ? THREE.DoubleSide : THREE.FrontSide;
        if (material.transparent) {
          material.alphaTest = 0.02;
          material.depthWrite = false;
          material.opacity = 0.96;
        }
        if ("map" in material && material.map instanceof THREE.Texture) {
          material.map.colorSpace = THREE.SRGBColorSpace;
          material.map.anisotropy = 8;
        }
        material.needsUpdate = true;
        return material;
      });
      object.material = Array.isArray(object.material) ? materials : materials[0];
      object.frustumCulled = false;
    });

    return clone;
  }, [scene]);

  useEffect(() => () => {
    model.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach((material) => material.dispose());
    });
  }, [model]);

  return <primitive object={model} scale={officialSaturnScale(stageRadius)} />;
}

function ProceduralWorld({
  world,
  layers,
  stageRadius = 1,
  selectedHotspotId,
  modeId,
  motionEnabled,
  reducedMotion,
  lightingMode,
  onSelectHotspot,
  showMarkers = true,
}: {
  world: PlanetaryWorld;
  layers: RenderLayers;
  stageRadius?: number;
  selectedHotspotId: string | null;
  modeId: string;
  motionEnabled: boolean;
  reducedMotion: boolean;
  lightingMode: AtlasCanvasRuntimeProps["lightingMode"];
  onSelectHotspot: (id: string) => void;
  showMarkers?: boolean;
}) {
  const urls = [layers.baseTexture, ...(layers.bumpTexture ? [layers.bumpTexture] : []), ...(layers.cloudTexture ? [layers.cloudTexture] : []), ...(layers.ringTexture ? [layers.ringTexture] : [])];
  const loaded = useLoader(THREE.TextureLoader, urls) as THREE.Texture[];
  let cursor = 0;
  const colorTexture = loaded[cursor++];
  const bumpTexture = layers.bumpTexture ? loaded[cursor++] : undefined;
  const cloudTexture = layers.cloudTexture ? loaded[cursor++] : undefined;
  const ringTexture = layers.ringTexture ? loaded[cursor++] : undefined;
  const visibleHotspots = getVisibleHotspots(world, modeId);
  const activeMotion = motionEnabled && !reducedMotion;

  colorTexture.colorSpace = THREE.SRGBColorSpace;
  colorTexture.anisotropy = 8;
  if (cloudTexture) { cloudTexture.colorSpace = THREE.SRGBColorSpace; cloudTexture.anisotropy = 8; }
  if (ringTexture) { ringTexture.colorSpace = THREE.SRGBColorSpace; ringTexture.anisotropy = 8; }

  if (layers.interior) return <InteriorWorld world={world} stageRadius={stageRadius} />;

  const isSun = world.renderer.kind === "sun";
  const isSaturn = world.id === "saturn";
  const modelKind = surfaceModelKind(world.id, layers.interior);
  const isGas = world.renderer.kind === "gas" || world.renderer.kind === "rings";
  const flattening = "flattening" in world.renderer ? world.renderer.flattening : 0;
  const materialKind = surfaceMaterialKind(isSun, layers.selfLit, lightingMode);

  return (
    <group
      rotation={[0, 0, THREE.MathUtils.degToRad(world.renderer.axialTilt)]}
      scale={isSaturn ? [1, 1, 1] : [1, 1 - flattening, 1]}
    >
      <group rotation={isSaturn ? [SATURN_MODEL_TILT_RADIANS, 0, 0] : [0, 0, 0]}>
        {modelKind === "official-saturn" ? (
          <OfficialSaturnModel stageRadius={stageRadius} />
        ) : layers.effect === "temperature" ? (
          <TemperatureSurface texture={colorTexture} radius={stageRadius} />
        ) : (
          <mesh>
            <sphereGeometry args={[stageRadius, 160, 112]} />
            {materialKind === "solar" ? (
                <SolarSurfaceMaterial texture={colorTexture} />
            ) : materialKind === "survey" && !layers.reliefEnhanced ? (
              <meshBasicMaterial map={colorTexture} color="#ffffff" toneMapped={false} />
            ) : materialKind === "unlit" ? (
              <meshBasicMaterial map={colorTexture} color="#fff7e8" />
            ) : (
              <meshStandardMaterial
                map={colorTexture}
                bumpMap={bumpTexture}
                bumpScale={layers.bumpScale}
                displacementMap={layers.reliefEnhanced ? bumpTexture : undefined}
                displacementScale={stageRadius * layers.displacementScale}
                displacementBias={layers.reliefEnhanced ? -stageRadius * layers.displacementScale * 0.35 : 0}
                roughness={isGas ? 0.84 : "roughness" in world.renderer ? world.renderer.roughness : 0.9}
                metalness={0}
              />
            )}
          </mesh>
        )}

        {isSun && layers.motion === "solar" ? <SolarFlow texture={colorTexture} radius={stageRadius} enabled={activeMotion} /> : null}
        {layers.motion === "atmosphere" && !isSaturn ? <AtmosphericFlow texture={colorTexture} radius={stageRadius} enabled={activeMotion} /> : null}

        {cloudTexture && (layers.effect === "clouds" || layers.effect === "atmosphere") ? (
          <mesh scale={1.012}>
            <sphereGeometry args={[stageRadius, 128, 84]} />
            <meshStandardMaterial map={cloudTexture} alphaMap={cloudTexture} transparent opacity={world.renderer.kind === "earth" ? world.renderer.cloudOpacity : 0.4} roughness={0.9} depthWrite={false} />
          </mesh>
        ) : null}

        {world.renderer.atmosphereColor && !isSun ? (
          <mesh scale={1.027}>
            <sphereGeometry args={[stageRadius, 96, 64]} />
            <meshBasicMaterial color={world.renderer.atmosphereColor} transparent opacity={layers.atmosphere ? 0.14 : 0.055} side={THREE.BackSide} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
          </mesh>
        ) : null}

        {layers.rings && ringTexture && !isSaturn ? <RingSystem world={world} texture={ringTexture} stageRadius={stageRadius} /> : null}
        {layers.magnetic ? <MagneticField color={world.accent} radius={stageRadius} /> : null}
        {layers.effect === "missions" ? <MissionSystem color={world.accent} radius={stageRadius} /> : null}
        {rotationAxisVisible(layers.effect) ? <RotationAxisGuide color={world.accent} radius={stageRadius} /> : null}

        {showMarkers && layers.showHotspots ? (
          <WorldMarkers
            hotspots={visibleHotspots}
            radius={stageRadius}
            surfaceRadius={isSaturn ? officialSaturnGlobeRadius(stageRadius) : stageRadius}
            selectedHotspotId={selectedHotspotId}
            onSelectHotspot={onSelectHotspot}
          />
        ) : null}
      </group>
    </group>
  );
}

useGLTF.preload(atlasModelPaths.saturn);

function FocusSpinGroup({ world, focusCommand, reducedMotion, paused, children }: {
  world: PlanetaryWorld;
  focusCommand: AtlasCanvasRuntimeProps["focusCommand"];
  reducedMotion: boolean;
  paused: boolean;
  children: React.ReactNode;
}) {
  const group = useRef<THREE.Group>(null);
  const target = useRef(new THREE.Quaternion());
  const focusing = useRef(false);
  const [pageVisible, setPageVisible] = useState(true);

  useEffect(() => {
    function onVisibility() { setPageVisible(document.visibilityState !== "hidden"); }
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (!focusCommand.hotspotId) { focusing.current = false; return; }
    const hotspot = world.hotspots.find((item) => item.id === focusCommand.hotspotId);
    if (!hotspot) return;
    const targetPoint = latLonToVector3(
      hotspot.renderLat ?? hotspot.lat,
      hotspot.renderLon ?? hotspot.lon,
      1,
    );
    if (world.id === "saturn") {
      targetPoint.applyAxisAngle(new THREE.Vector3(1, 0, 0), SATURN_MODEL_TILT_RADIANS);
    }
    targetPoint.applyAxisAngle(
      new THREE.Vector3(0, 0, 1),
      THREE.MathUtils.degToRad(world.renderer.axialTilt),
    );
    target.current.copy(focusVectorQuaternion(0, 0, targetPoint));
    focusing.current = true;
    if (reducedMotion && group.current) group.current.quaternion.copy(target.current);
  }, [focusCommand, reducedMotion, world]);

  useFrame((_, delta) => {
    if (!group.current || !pageVisible) return;
    if (focusing.current && !reducedMotion) {
      group.current.quaternion.slerp(target.current, Math.min(1, delta * 4.8));
      if (group.current.quaternion.angleTo(target.current) < 0.002) { group.current.quaternion.copy(target.current); focusing.current = false; }
      return;
    }
    if (!reducedMotion && !paused) group.current.rotateY((delta * Math.PI * 2) / world.renderer.rotationSeconds);
  });

  return <group ref={group}>{children}</group>;
}

function CameraCommand({ command, compareOpen }: { command: AtlasCanvasRuntimeProps["cameraCommand"]; compareOpen: boolean }) {
  const camera = useThree((state) => state.camera);
  useEffect(() => {
    if (command.type === "idle") return;
    if (command.type === "reset") { camera.position.set(0, 0, compareOpen ? 4.4 : 3.15); camera.lookAt(0, 0, 0); return; }
    const distance = camera.position.length();
    const multiplier = command.type === "zoom-in" ? 0.8 : 1.2;
    camera.position.setLength(THREE.MathUtils.clamp(distance * multiplier, 1.55, 6.5));
    camera.lookAt(0, 0, 0);
  }, [camera, command, compareOpen]);
  return null;
}

function baseLayers(world: PlanetaryWorld): RenderLayers {
  return {
    effect: "surface",
    lightingPolicy: "natural-survey",
    motion: "none",
    baseTexture: world.assets.color,
    bumpTexture: world.assets.bump,
    bumpScale: "bumpScale" in world.renderer ? world.renderer.bumpScale : 0,
    displacementScale: 0,
    reliefEnhanced: false,
    cloudTexture: world.assets.layers.clouds,
    ringTexture: world.assets.layers.rings,
    atmosphere: false,
    emissive: world.renderer.kind === "sun",
    selfLit: world.renderer.kind === "sun",
    interior: false,
    magnetic: false,
    night: false,
    rings: world.renderer.kind === "rings",
    showHotspots: false,
  };
}

function InstrumentLights({ props, lightPosition }: { props: AtlasCanvasRuntimeProps; lightPosition: [number, number, number] }) {
  if (props.layers.selfLit) return null;
  if (props.layers.lightingPolicy === "hidden" || props.lightingMode === "survey") {
    return <><hemisphereLight intensity={1.55} color="#fff3df" groundColor="#77828b" /><directionalLight position={[0, 1.5, 5]} intensity={0.88} color="#fff8e8" /></>;
  }
  return <><ambientLight intensity={0.2} color="#d9e3ea" /><directionalLight position={lightPosition} intensity={2.25} color="#fff1d6" /></>;
}

function OrientationControls(props: AtlasCanvasRuntimeProps) {
  const camera = useThree((state) => state.camera);
  const scheduleOrientation = useOrientationReporter(() => {
    const direction = camera.position.clone().normalize();
    return {
      latitude: THREE.MathUtils.radToDeg(Math.asin(direction.y)),
      longitude: THREE.MathUtils.radToDeg(Math.atan2(direction.x, direction.z)),
    };
  }, props.onOrientationChange);
  return <OrbitControls makeDefault enablePan={false} enableDamping={!props.reducedMotion} dampingFactor={0.065} minDistance={1.55} maxDistance={6.5} autoRotate={false} onStart={props.onManualOrbit} onChange={scheduleOrientation} />;
}

function Scene(props: AtlasCanvasRuntimeProps) {
  const compareOpen = Boolean(props.compareWorld);
  const [primaryRadius, secondaryRadius] = props.compareWorld ? comparisonRadii(props.world.physical.radiusKm, props.compareWorld.physical.radiusKm, props.compareScalePolicy) : [1, 1];
  const azimuth = THREE.MathUtils.degToRad(props.lightAzimuth);
  const elevation = THREE.MathUtils.degToRad(props.lightElevation);
  const lightPosition: [number, number, number] = [Math.sin(azimuth) * Math.cos(elevation) * 5, Math.sin(elevation) * 5, Math.cos(azimuth) * Math.cos(elevation) * 5];

  return (
    <>
      <InstrumentLights props={props} lightPosition={lightPosition} />
      <pointLight position={[-4, -2, -3]} intensity={props.layers.selfLit ? 0 : 0.18} color={props.world.accent} />
      <group position={[compareOpen ? -1.24 : 0, 0, 0]} scale={compareOpen ? 0.69 : 1}>
        <FocusSpinGroup world={props.world} focusCommand={props.focusCommand} reducedMotion={props.reducedMotion} paused={!props.motionEnabled || Boolean(props.selectedHotspotId) || compareOpen}>
          <ProceduralWorld world={props.world} layers={props.layers} stageRadius={primaryRadius} selectedHotspotId={props.selectedHotspotId} modeId={props.mode.id} motionEnabled={props.motionEnabled} reducedMotion={props.reducedMotion} lightingMode={props.lightingMode} onSelectHotspot={props.onSelectHotspot} showMarkers={!compareOpen} />
        </FocusSpinGroup>
      </group>

      {props.compareWorld ? (
        <group position={[1.24, 0, 0]} scale={0.69}>
          <FocusSpinGroup world={props.compareWorld} focusCommand={{ hotspotId: null, sequence: 0 }} reducedMotion={props.reducedMotion} paused>
            <ProceduralWorld world={props.compareWorld} layers={baseLayers(props.compareWorld)} stageRadius={secondaryRadius} selectedHotspotId={null} modeId={props.compareWorld.defaultModeId} motionEnabled={false} reducedMotion={props.reducedMotion} lightingMode="survey" onSelectHotspot={() => undefined} showMarkers={false} />
          </FocusSpinGroup>
        </group>
      ) : null}

      <CameraCommand command={props.cameraCommand} compareOpen={compareOpen} />
      <OrientationControls {...props} />
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
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance", preserveDrawingBuffer: false }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.16;
          gl.localClippingEnabled = true;
        }}
      >
        <Suspense fallback={null}><Scene {...props} /></Suspense>
      </Canvas>
    </div>
  );
}
