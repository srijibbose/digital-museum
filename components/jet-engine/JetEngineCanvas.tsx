"use client";

import { ContactShadows, Environment, Html, Lightformer, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, type ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { JetEngineCanvasProps } from "./JetEngineStage";
import type { JetStationId, JetViewId } from "@/lib/jet-engine/jet-engine-schema";
import styles from "./jet-engine.module.css";

const MODEL_PATH = "/assets/jet-engine/turbofan-engine-optimized.glb";

const STATION_X: Record<JetStationId, number> = {
  "0": -2.72,
  "2": -1.58,
  f: 2.42,
  "3": -0.18,
  "4": 0.62,
  "5": 1.28,
  "8": 2.38,
};

const STATION_RADIUS: Record<JetStationId, number> = {
  "0": 0.9,
  "2": 0.84,
  f: 0.72,
  "3": 0.4,
  "4": 0.39,
  "5": 0.42,
  "8": 0.35,
};

function mulberry32(seed: number) {
  return () => {
    let value = seed += 0x6d2b79f5;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  };
}

function Model({ viewId, motionEnabled }: { viewId: JetViewId; motionEnabled: boolean }) {
  const source = useGLTF(MODEL_PATH).scene;
  const scene = useMemo(() => {
    const cloned = source.clone(true);
    cloned.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      object.castShadow = true;
      object.receiveShadow = true;
      object.material = Array.isArray(object.material)
        ? object.material.map((material) => material.clone())
        : object.material.clone();
    });
    return cloned;
  }, [source]);
  const rotors = useMemo(() => {
    const candidates: THREE.Mesh[] = [];
    scene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      object.geometry.computeBoundingBox();
      const bounds = object.geometry.boundingBox;
      if (!bounds) return;
      const size = bounds.getSize(new THREE.Vector3());
      const center = bounds.getCenter(new THREE.Vector3());
      if (size.x < 0.42 && Math.max(size.y, size.z) > 0.72 && center.x > -0.7) candidates.push(object);
    });
    return candidates;
  }, [scene]);

  useEffect(() => {
    const opacity = viewId === "section" ? 1 : viewId === "airflow" ? 0.72 : viewId === "shafts" ? 0.16 : 0.4;
    scene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      for (const material of materials) {
        material.transparent = opacity < 1;
        material.opacity = opacity;
        material.depthWrite = opacity > 0.7;
        if (material instanceof THREE.MeshStandardMaterial) {
          material.metalness = Math.max(material.metalness, 0.68);
          material.roughness = THREE.MathUtils.clamp(material.roughness, 0.3, 0.66);
          material.envMapIntensity = 0.72;
        }
        material.needsUpdate = true;
      }
    });
  }, [scene, viewId]);

  useFrame((_, delta) => {
    if (!motionEnabled) return;
    const rate = delta * 1.85;
    for (const rotor of rotors) rotor.rotation.x += rate;
  });

  return <primitive object={scene} scale={1.12} position={[0, 0, 0]} />;
}

const particleVertexShader = /* glsl */ `
  attribute float aPhase;
  attribute float aAngle;
  attribute float aRadius;
  attribute float aSpeed;
  varying vec3 vColor;
  varying float vAlpha;
  uniform float uTime;
  uniform float uMotion;
  uniform float uBranch;
  uniform float uView;
  uniform float uPower;
  uniform float uOpacity;
  uniform float uT0;
  uniform float uTf;
  uniform float uT3;
  uniform float uT4;
  uniform float uT5;
  uniform float uP2;
  uniform float uPf;
  uniform float uP3;
  uniform float uP4;
  uniform float uP5;

  vec3 thermalRamp(float value) {
    vec3 cold = vec3(0.20, 0.61, 0.82);
    vec3 warm = vec3(0.96, 0.66, 0.24);
    vec3 hot = vec3(1.00, 0.23, 0.08);
    return value < 0.55 ? mix(cold, warm, value / 0.55) : mix(warm, hot, (value - 0.55) / 0.45);
  }

  vec3 pressureRamp(float value) {
    vec3 low = vec3(0.26, 0.72, 0.88);
    vec3 mid = vec3(0.39, 0.48, 0.91);
    vec3 high = vec3(0.92, 0.34, 0.45);
    return value < 0.6 ? mix(low, mid, value / 0.6) : mix(mid, high, (value - 0.6) / 0.4);
  }

  float temperatureAt(float x) {
    if (x < -1.58) return uT0;
    if (uBranch > 0.5) return mix(uTf, uT0, smoothstep(1.65, 2.82, x));
    if (x < -0.18) return mix(uT0, uT3, smoothstep(-1.58, -0.18, x));
    if (x < 0.62) return mix(uT3, uT4, smoothstep(-0.18, 0.62, x));
    if (x < 1.28) return mix(uT4, uT5, smoothstep(0.62, 1.28, x));
    return uT5;
  }

  float pressureAt(float x) {
    if (x < -1.58) return 1.0;
    if (uBranch > 0.5) return mix(uPf, 1.0, smoothstep(1.45, 2.82, x));
    if (x < -0.18) return mix(uP2, uP3, smoothstep(-1.58, -0.18, x));
    if (x < 0.62) return mix(uP3, uP4, smoothstep(-0.18, 0.62, x));
    if (x < 1.28) return mix(uP4, uP5, smoothstep(0.62, 1.28, x));
    return mix(uP5, 1.0, smoothstep(1.28, 2.65, x));
  }

  void main() {
    float travel = mod(aPhase + uTime * aSpeed * uMotion * (0.43 + uPower * 0.52), 1.0);
    float x = mix(-2.95, 2.82, travel);
    float split = smoothstep(-1.72, -1.24, x);
    float sharedRadius = mix(0.12, 0.80, aRadius);
    float bypassRadius = mix(0.48, 0.74, aRadius);
    float coreRadius = mix(0.045, 0.29, aRadius);
    float radius = mix(sharedRadius, uBranch > 0.5 ? bypassRadius : coreRadius, split);
    float exhaustExpansion = smoothstep(1.9, 2.82, x);
    radius *= mix(1.0, uBranch > 0.5 ? 1.12 : 1.55, exhaustExpansion);
    float flutter = sin(x * 4.7 + aPhase * 31.0 + uTime * 0.7) * 0.018;
    float angle = aAngle + flutter + sin(x * 2.2 + aPhase * 17.0) * 0.014;
    vec3 transformed = vec3(x, cos(angle) * radius, sin(angle) * radius);

    float temp = temperatureAt(x);
    float pressure = pressureAt(x);
    float tempNorm = clamp((temp - 210.0) / 1500.0, 0.0, 1.0);
    float pressureNorm = clamp(log(max(1.0, pressure)) / log(36.0), 0.0, 1.0);
    vec3 airflowColor = uBranch > 0.5
      ? vec3(0.31, 0.76, 0.88)
      : mix(vec3(0.58, 0.84, 0.91), vec3(1.0, 0.45, 0.16), smoothstep(0.15, 0.9, x));
    vColor = uView < 1.5 ? airflowColor : (uView < 2.5 ? pressureRamp(pressureNorm) : thermalRamp(tempNorm));
    vAlpha = (0.055 + aRadius * 0.14) * (uBranch > 0.5 ? 0.74 : 0.88) * uOpacity;

    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = (1.4 + aRadius * 2.2) * (13.0 / max(1.0, -mvPosition.z));
  }
`;

const particleFragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec2 uv = gl_PointCoord * 2.0 - 1.0;
    uv.x *= 0.24;
    float d = dot(uv, uv);
    float core = exp(-d * 5.5);
    float halo = exp(-d * 1.7) * 0.35;
    float alpha = (core + halo) * vAlpha;
    if (alpha < 0.02) discard;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

function ParticleStream({
  branch,
  count,
  props,
}: {
  branch: "core" | "bypass";
  count: number;
  props: JetEngineCanvasProps;
}) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const attributes = useMemo(() => {
    const random = mulberry32(branch === "bypass" ? 8_241 : 3_117);
    const position = new Float32Array(count * 3);
    const phase = new Float32Array(count);
    const angle = new Float32Array(count);
    const radius = new Float32Array(count);
    const speed = new Float32Array(count);
    for (let index = 0; index < count; index += 1) {
      phase[index] = random();
      angle[index] = random() * Math.PI * 2;
      radius[index] = Math.pow(random(), 0.72);
      speed[index] = 0.72 + random() * 0.58;
    }
    return { position, phase, angle, radius, speed };
  }, [branch, count]);

  const viewNumber = props.viewId === "pressure" ? 2 : props.viewId === "thermal" ? 3 : 1;
  const opacity = props.viewId === "airflow" ? 0.75 : props.viewId === "pressure" || props.viewId === "thermal" ? 0.6 : 0;

  useFrame(({ clock }) => {
    if (!material.current) return;
    material.current.uniforms.uTime.value = clock.elapsedTime;
    material.current.uniforms.uMotion.value = props.motionEnabled ? 1 : 0;
    material.current.uniforms.uView.value = viewNumber;
  });

  if (opacity === 0) return null;
  const stations = props.cycle.stations;

  return (
    <points frustumCulled={false} renderOrder={4}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[attributes.position, 3]} />
        <bufferAttribute attach="attributes-aPhase" args={[attributes.phase, 1]} />
        <bufferAttribute attach="attributes-aAngle" args={[attributes.angle, 1]} />
        <bufferAttribute attach="attributes-aRadius" args={[attributes.radius, 1]} />
        <bufferAttribute attach="attributes-aSpeed" args={[attributes.speed, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uMotion: { value: props.motionEnabled ? 1 : 0 },
          uBranch: { value: branch === "bypass" ? 1 : 0 },
          uView: { value: viewNumber },
          uPower: { value: props.cycle.profile.throttlePercent / 100 },
          uOpacity: { value: opacity },
          uT0: { value: stations["0"].temperatureK },
          uTf: { value: stations.f.temperatureK },
          uT3: { value: stations["3"].temperatureK },
          uT4: { value: stations["4"].temperatureK },
          uT5: { value: stations["5"].temperatureK },
          uP2: { value: stations["2"].pressureRatio },
          uPf: { value: stations.f.pressureRatio },
          uP3: { value: stations["3"].pressureRatio },
          uP4: { value: stations["4"].pressureRatio },
          uP5: { value: stations["5"].pressureRatio },
        }}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
        toneMapped={false}
      />
    </points>
  );
}

function FlowEnvelope({ viewId, cycle }: Pick<JetEngineCanvasProps, "viewId" | "cycle">) {
  if (viewId === "section" || viewId === "shafts") return null;
  const isThermal = viewId === "thermal";
  const isPressure = viewId === "pressure";
  const colors = isThermal
    ? ["#3f9ac7", "#7f8cc5", "#f5a33d", "#fb3f16", "#cf5b2a"]
    : isPressure
      ? ["#4eb4d2", "#6a82d7", "#c94f76", "#e23d55", "#7d7bc6"]
      : ["#58bdd0", "#58bdd0", "#7ac7d5", "#e58143", "#ef6532"];
  const opacity = viewId === "airflow" ? 0.045 : 0.1;
  const segments: Array<[number, number, number, string]> = [
    [-2.95, -1.58, 0.84, colors[0]],
    [-1.58, -0.18, 0.7, colors[1]],
    [-0.18, 0.62, 0.33, colors[2]],
    [0.62, 1.28, 0.34, colors[3]],
    [1.28, 2.78, 0.38, colors[4]],
  ];

  return (
    <group renderOrder={2}>
      {segments.map(([start, end, radius, color], index) => (
        <mesh key={`${start}-${end}`} position={[(start + end) / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[radius, radius * (index === 4 ? 1.3 : 1), end - start, 64, 1, true]} />
          <meshPhysicalMaterial
            color={color}
            emissive={color}
            emissiveIntensity={isThermal ? 0.42 : 0.13}
            transparent
            opacity={opacity}
            roughness={0.25}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      <mesh position={[0.6, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.73, 0.73, 4.1, 64, 1, true]} />
        <meshBasicMaterial
          color={isPressure ? "#688dd6" : "#58bdd0"}
          transparent
          opacity={viewId === "airflow" ? 0.028 : 0.055}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0.6, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.47, 0.47, 4.1, 64, 1, true]} />
        <meshBasicMaterial
          color={isPressure ? "#688dd6" : "#58bdd0"}
          transparent
          opacity={viewId === "airflow" ? 0.04 : 0.07}
          side={THREE.FrontSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function ShaftSystem({ active, motionEnabled }: { active: boolean; motionEnabled: boolean }) {
  const lowSpool = useRef<THREE.Group>(null);
  const highSpool = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (!motionEnabled || !active) return;
    if (lowSpool.current) lowSpool.current.rotation.x += delta * 1.8;
    if (highSpool.current) highSpool.current.rotation.x -= delta * 3.2;
  });
  if (!active) return null;

  return (
    <group renderOrder={5}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.075, 0.075, 3.82, 32]} />
        <meshStandardMaterial color="#c78a52" emissive="#7b3f18" emissiveIntensity={0.35} metalness={0.94} roughness={0.22} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.035, 3.98, 24]} />
        <meshStandardMaterial color="#d7e1e5" emissive="#496a74" emissiveIntensity={0.28} metalness={0.96} roughness={0.18} />
      </mesh>
      <group ref={lowSpool}>
        {[-1.55, 1.48].map((x) => (
          <group key={x} position={[x, 0, 0]}>
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <torusGeometry args={[x < 0 ? 0.72 : 0.54, 0.022, 10, 72]} />
              <meshStandardMaterial color="#d09359" emissive="#8d4d21" emissiveIntensity={0.45} metalness={0.8} roughness={0.24} />
            </mesh>
            {Array.from({ length: 4 }).map((_, spoke) => (
              <mesh key={spoke} rotation={[spoke * Math.PI / 4, 0, 0]}>
                <boxGeometry args={[0.032, (x < 0 ? 0.72 : 0.54) * 1.7, 0.018]} />
                <meshStandardMaterial color="#d09359" emissive="#8d4d21" emissiveIntensity={0.32} metalness={0.8} roughness={0.25} />
              </mesh>
            ))}
          </group>
        ))}
      </group>
      <group ref={highSpool}>
        {[-0.38, -0.02, 0.98].map((x) => (
          <group key={x} position={[x, 0, 0]}>
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <torusGeometry args={[0.3, 0.015, 9, 56]} />
              <meshStandardMaterial color="#b8d2d8" emissive="#3d7480" emissiveIntensity={0.42} metalness={0.84} roughness={0.2} />
            </mesh>
            {Array.from({ length: 3 }).map((_, spoke) => (
              <mesh key={spoke} rotation={[spoke * Math.PI / 3, 0, 0]}>
                <boxGeometry args={[0.026, 0.5, 0.014]} />
                <meshStandardMaterial color="#b8d2d8" emissive="#3d7480" emissiveIntensity={0.3} metalness={0.84} roughness={0.2} />
              </mesh>
            ))}
          </group>
        ))}
      </group>
    </group>
  );
}

function StationMarkers({ stationId, onSelectStation }: Pick<JetEngineCanvasProps, "stationId" | "onSelectStation">) {
  const stationIds = Object.keys(STATION_X) as JetStationId[];
  return (
    <group>
      {stationIds.map((id) => {
        const selected = id === stationId;
        const radius = STATION_RADIUS[id];
        return (
          <group key={id} position={[STATION_X[id], 0, 0]}>
            <mesh
              rotation={[0, Math.PI / 2, 0]}
              onClick={(event: ThreeEvent<MouseEvent>) => {
                event.stopPropagation();
                onSelectStation(id);
              }}
              onPointerOver={(event) => {
                event.stopPropagation();
                document.body.style.cursor = "pointer";
              }}
              onPointerOut={() => { document.body.style.cursor = "auto"; }}
            >
              <torusGeometry args={[radius, selected ? 0.014 : 0.006, 8, 96]} />
              <meshBasicMaterial color={selected ? "#ef7b52" : "#98a9ad"} transparent opacity={selected ? 0.88 : 0.2} depthWrite={false} />
            </mesh>
            {selected ? (
              <Html position={[0, radius + 0.14, 0]} center zIndexRange={[5, 0]}>
                <button className={styles.stationTag3d} type="button" onClick={() => onSelectStation(id)}>
                  Station {id}
                </button>
              </Html>
            ) : null}
          </group>
        );
      })}
    </group>
  );
}

function CameraRig({ stationId, cameraCommand, motionEnabled }: Pick<JetEngineCanvasProps, "stationId" | "cameraCommand" | "motionEnabled">) {
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);
  const controls = useRef<React.ComponentRef<typeof OrbitControls>>(null);
  const goalPosition = useRef(new THREE.Vector3(0.15, 1.15, 6.1));
  const goalTarget = useRef(new THREE.Vector3(0.15, 0, 0));
  const animating = useRef(true);

  useEffect(() => {
    const x = STATION_X[stationId];
    const currentTarget = controls.current?.target ?? new THREE.Vector3();
    const offset = camera.position.clone().sub(currentTarget);
    goalTarget.current.set(x, 0, 0);
    goalPosition.current.copy(offset).add(goalTarget.current);
    animating.current = true;
  }, [camera, stationId]);

  useEffect(() => {
    const sideDistance = size.width / Math.max(1, size.height) > 1.65 ? 4.72 : 6.15;
    if (cameraCommand.type === "front") {
      goalPosition.current.set(-(sideDistance + 0.3), 0.45, 0.2);
      goalTarget.current.set(-0.1, 0, 0);
    } else if (cameraCommand.type === "side") {
      goalPosition.current.set(0.12, 0.55, sideDistance);
      goalTarget.current.set(0.12, 0, 0);
    } else {
      goalPosition.current.set(0.1, sideDistance > 5 ? 1.15 : 0.82, sideDistance);
      goalTarget.current.set(0.1, 0, 0);
    }
    animating.current = true;
  }, [cameraCommand, size.height, size.width]);

  useFrame((_, delta) => {
    if (!animating.current || !controls.current) return;
    const factor = motionEnabled ? 1 - Math.exp(-delta * 5.5) : 1;
    camera.position.lerp(goalPosition.current, factor);
    controls.current.target.lerp(goalTarget.current, factor);
    controls.current.update();
    if (camera.position.distanceTo(goalPosition.current) < 0.005 && controls.current.target.distanceTo(goalTarget.current) < 0.005) {
      animating.current = false;
    }
  });

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping={motionEnabled}
      dampingFactor={0.07}
      minDistance={2.45}
      maxDistance={11}
      minPolarAngle={0.12}
      maxPolarAngle={Math.PI - 0.12}
      onStart={() => { animating.current = false; }}
    />
  );
}

function Ready({ onReady }: { onReady?: () => void }) {
  useEffect(() => onReady?.(), [onReady]);
  return null;
}

function Scene(props: JetEngineCanvasProps) {
  const size = useThree((state) => state.size);
  const desktop = size.width >= 760;
  return (
    <>
      <ambientLight intensity={0.2} color="#b8c8cf" />
      <directionalLight castShadow position={[-3, 5, 5]} intensity={1.55} color="#fff4dc" shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[4, -2, -3]} intensity={0.68} color="#5fa6c7" />
      <pointLight position={[0.6, 0.2, 2.2]} intensity={0.9} color="#ef9562" distance={7} />

      <group rotation={[0.08, 0, -0.025]}>
        <Model viewId={props.viewId} motionEnabled={props.motionEnabled} />
        <FlowEnvelope viewId={props.viewId} cycle={props.cycle} />
        <ParticleStream branch="bypass" count={desktop ? 4_200 : 1_800} props={props} />
        <ParticleStream branch="core" count={desktop ? 2_400 : 900} props={props} />
        <ShaftSystem active={props.viewId === "shafts"} motionEnabled={props.motionEnabled} />
        <StationMarkers stationId={props.stationId} onSelectStation={props.onSelectStation} />
      </group>

      <ContactShadows position={[0, -1.12, 0]} opacity={0.34} scale={8} blur={2.7} far={3.2} resolution={512} color="#050708" />
      <Environment resolution={128}>
        <Lightformer form="rect" intensity={1.15} color="#fff0d8" position={[0, 4, 4]} scale={[7, 2, 1]} />
        <Lightformer form="rect" intensity={0.62} color="#7fb5c8" position={[0, -3, -4]} rotation={[0, Math.PI, 0]} scale={[6, 2, 1]} />
      </Environment>
      <CameraRig stationId={props.stationId} cameraCommand={props.cameraCommand} motionEnabled={props.motionEnabled} />
      <Ready onReady={props.onReady} />
    </>
  );
}

export default function JetEngineCanvas(props: JetEngineCanvasProps) {
  return (
    <div className={styles.canvasLayer} aria-hidden="true">
      <Canvas
        shadows
        camera={{ position: [0.1, 1.15, 6.15], fov: 38, near: 0.05, far: 80 }}
        dpr={[1, 1.65]}
        frameloop={props.motionEnabled ? "always" : "demand"}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance", preserveDrawingBuffer: false }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 0.76;
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

useGLTF.preload(MODEL_PATH);
