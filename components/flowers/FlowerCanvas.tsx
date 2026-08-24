"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  type ComponentRef,
  type MutableRefObject,
} from "react";
import * as THREE from "three";
import { flowerExhibit } from "@/content/flowers";
import { clampFlowerProgress, smoothstep } from "@/lib/flowers/flower-timeline";

export interface FlowerCanvasProps {
  progress: number;
  reducedMotion: boolean;
  resetToken: number;
  replayToken: number;
  renderingActive?: boolean;
  onReady?: () => void;
}

type AnimatedSceneProps = FlowerCanvasProps & {
  stateRef: MutableRefObject<FlowerCanvasProps>;
};

type AdjustableMaterial = THREE.Material & {
  clippingPlanes?: THREE.Plane[] | null;
  depthWrite: boolean;
  opacity: number;
  transparent: boolean;
};

function windowWeight(progress: number, start: number, end: number, feather = 0.035) {
  return smoothstep(start - feather, start + feather, progress)
    * (1 - smoothstep(end - feather, end + feather, progress));
}

function specimenOpacity(progress: number) {
  if (progress < 0.2) return 1;
  if (progress < 0.32) return THREE.MathUtils.lerp(1, 0.24, smoothstep(0.2, 0.32, progress));
  if (progress < 0.4) return 0.24;
  if (progress < 0.47) return THREE.MathUtils.lerp(0.24, 1, smoothstep(0.4, 0.47, progress));
  if (progress < 0.61) return 1;
  if (progress < 0.72) return THREE.MathUtils.lerp(1, 0.04, smoothstep(0.61, 0.72, progress));
  if (progress < 0.79) return 0.04;
  if (progress < 0.84) return THREE.MathUtils.lerp(0.04, 0.82, smoothstep(0.79, 0.84, progress));
  return THREE.MathUtils.lerp(0.82, 0.46, smoothstep(0.84, 1, progress));
}

function prepareSpecimen(source: THREE.Group) {
  const clone = source.clone(true);
  const materials: AdjustableMaterial[] = [];

  clone.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    object.frustumCulled = false;
    const originals = Array.isArray(object.material) ? object.material : [object.material];
    const copies = originals.map((original) => {
      const material = original.clone() as AdjustableMaterial;
      material.transparent = true;
      material.depthWrite = true;
      material.opacity = 1;
      materials.push(material);
      return material;
    });
    object.material = Array.isArray(object.material) ? copies : copies[0];
  });

  clone.updateMatrixWorld(true);
  const bounds = new THREE.Box3().setFromObject(clone);
  const center = bounds.getCenter(new THREE.Vector3());
  const size = bounds.getSize(new THREE.Vector3());
  clone.position.sub(center);

  const root = new THREE.Group();
  root.add(clone);
  root.scale.setScalar(2.42 / Math.max(size.x, size.y, size.z, 0.001));
  root.rotation.set(-0.08, -0.18, 0.018);

  return { root, materials };
}

function OrchidSpecimen({ stateRef, onReady }: AnimatedSceneProps) {
  const source = useGLTF(flowerExhibit.specimen.modelPath).scene;
  const specimen = useMemo(() => prepareSpecimen(source), [source]);
  const animationGroup = useRef<THREE.Group>(null);
  const clippingPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(1, 0, 0), 1.1), []);
  const clippingActive = useRef(false);

  useEffect(() => {
    onReady?.();
    return () => specimen.materials.forEach((material) => material.dispose());
  }, [onReady, specimen]);

  useFrame(({ clock }) => {
    const group = animationGroup.current;
    if (!group) return;
    const state = stateRef.current;
    const progress = clampFlowerProgress(state.progress);
    const inside = windowWeight(progress, 0.2, 0.4, 0.018);
    const fertilisationZoom = smoothstep(0.61, 0.72, progress)
      * (1 - smoothstep(0.76, 0.81, progress));
    const outcome = smoothstep(0.8, 0.99, progress);
    const opacity = specimenOpacity(progress);
    const shouldClip = inside > 0.015;

    clippingPlane.constant = THREE.MathUtils.lerp(
      1.25,
      -0.04,
      smoothstep(0.21, 0.37, progress),
    );

    if (clippingActive.current !== shouldClip) {
      clippingActive.current = shouldClip;
      specimen.materials.forEach((material) => {
        material.clippingPlanes = shouldClip ? [clippingPlane] : null;
        material.needsUpdate = true;
      });
    }

    specimen.materials.forEach((material) => {
      material.opacity = opacity;
      material.depthWrite = opacity > 0.82;
    });

    const targetScale = 1 + fertilisationZoom * 2.05;
    group.scale.lerp(new THREE.Vector3(targetScale, targetScale * (1 - outcome * 0.14), targetScale), 0.08);
    group.position.lerp(
      new THREE.Vector3(
        fertilisationZoom * -0.23,
        fertilisationZoom * -0.14 - outcome * 0.18,
        fertilisationZoom * 0.35,
      ),
      0.08,
    );
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, -outcome * 0.19, 0.07);
    group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, outcome * 0.12, 0.07);

    const idleOrbit = !state.reducedMotion && state.renderingActive !== false && progress < 0.2
      ? Math.sin(clock.elapsedTime * 0.34) * 0.055
      : 0;
    specimen.root.rotation.y = THREE.MathUtils.lerp(
      specimen.root.rotation.y,
      -0.18 + idleOrbit,
      0.075,
    );
  });

  return (
    <group ref={animationGroup}>
      <primitive object={specimen.root} />
    </group>
  );
}

function InternalAnatomy({ progress }: { progress: number }) {
  const weight = windowWeight(progress, 0.2, 0.405, 0.025);
  const opacity = Math.min(0.92, weight * 1.15);
  const ovules = useMemo(
    () => Array.from({ length: 24 }, (_, index) => {
      const row = Math.floor(index / 6);
      const column = index % 6;
      return [
        (column - 2.5) * 0.07,
        -0.76 + row * 0.13,
        ((index % 3) - 1) * 0.075,
      ] as [number, number, number];
    }),
    [],
  );

  return (
    <group visible={weight > 0.01} position={[0.12, -0.02, 0.28]} scale={0.92}>
      <mesh rotation={[0, Math.PI / 2, 0]} position={[0, 0.1, -0.02]}>
        <planeGeometry args={[2.15, 2.85]} />
        <meshBasicMaterial color="#9bc8a3" transparent opacity={weight * 0.075} side={THREE.DoubleSide} />
      </mesh>

      <mesh position={[0, -0.56, 0]} scale={[0.33, 0.92, 0.34]}>
        <capsuleGeometry args={[0.36, 0.86, 12, 24]} />
        <meshPhysicalMaterial color="#749f70" roughness={0.62} transparent opacity={opacity * 0.78} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.18, 0]} scale={[0.12, 0.72, 0.12]}>
        <cylinderGeometry args={[0.17, 0.24, 1.18, 20]} />
        <meshStandardMaterial color="#d5c9a6" roughness={0.7} transparent opacity={opacity} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.82, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.2, 0.055, 12, 28, Math.PI * 1.52]} />
        <meshStandardMaterial color="#b58d79" roughness={0.58} transparent opacity={opacity} depthWrite={false} />
      </mesh>
      <mesh position={[-0.13, 0.98, 0.06]} scale={[0.12, 0.21, 0.1]}>
        <sphereGeometry args={[1, 20, 14]} />
        <meshStandardMaterial color="#efc852" roughness={0.72} transparent opacity={opacity} depthWrite={false} />
      </mesh>
      <mesh position={[0.13, 0.98, 0.06]} scale={[0.12, 0.21, 0.1]}>
        <sphereGeometry args={[1, 20, 14]} />
        <meshStandardMaterial color="#efc852" roughness={0.72} transparent opacity={opacity} depthWrite={false} />
      </mesh>

      {ovules.map((position, index) => (
        <mesh key={index} position={position} scale={[0.035, 0.055, 0.035]}>
          <sphereGeometry args={[1, 12, 8]} />
          <meshStandardMaterial color="#f1d777" emissive="#6b5b20" emissiveIntensity={0.25} transparent opacity={opacity} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function Tube({
  start,
  end,
  radius,
  color,
  opacity = 1,
}: {
  start: THREE.Vector3Tuple;
  end: THREE.Vector3Tuple;
  radius: number;
  color: string;
  opacity?: number;
}) {
  const { midpoint, length, quaternion } = useMemo(() => {
    const from = new THREE.Vector3(...start);
    const to = new THREE.Vector3(...end);
    const direction = to.clone().sub(from);
    return {
      midpoint: from.clone().add(to).multiplyScalar(0.5),
      length: direction.length(),
      quaternion: new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        direction.normalize(),
      ),
    };
  }, [end, start]);

  return (
    <mesh position={midpoint} quaternion={quaternion}>
      <cylinderGeometry args={[radius, radius * 0.86, length, 8]} />
      <meshStandardMaterial
        color={color}
        roughness={0.9}
        transparent={opacity < 1}
        opacity={opacity}
      />
    </mesh>
  );
}

function BeeBristles() {
  const positions = useMemo(() => {
    const points: number[] = [];
    const sections = [
      { center: new THREE.Vector3(0, 0, 0), radii: new THREE.Vector3(0.5, 0.38, 0.4), count: 130 },
      { center: new THREE.Vector3(-0.62, 0, 0), radii: new THREE.Vector3(0.74, 0.33, 0.32), count: 120 },
    ];

    for (const section of sections) {
      for (let index = 0; index < section.count; index += 1) {
        const y = 1 - (index / Math.max(1, section.count - 1)) * 2;
        const radial = Math.sqrt(Math.max(0, 1 - y * y));
        const angle = index * 2.399963;
        const lift = 1.035 + (index % 7) * 0.006;
        points.push(
          section.center.x + Math.cos(angle) * radial * section.radii.x * lift,
          section.center.y + y * section.radii.y * lift,
          section.center.z + Math.sin(angle) * radial * section.radii.z * lift,
        );
      }
    }

    return new Float32Array(points);
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#8b6a45"
        size={0.012}
        sizeAttenuation
        transparent
        opacity={0.82}
        depthWrite={false}
      />
    </points>
  );
}

function CarpenterBee({ stateRef }: { stateRef: MutableRefObject<FlowerCanvasProps> }) {
  const bee = useRef<THREE.Group>(null);
  const leftWing = useRef<THREE.Mesh>(null);
  const rightWing = useRef<THREE.Mesh>(null);
  const pollinia = useRef<THREE.Group>(null);
  const flightPath = useMemo(
    () => new THREE.CatmullRomCurve3([
      new THREE.Vector3(-3.2, 1.35, 0.6),
      new THREE.Vector3(-2.2, 0.95, 0.28),
      new THREE.Vector3(-1.05, 0.42, 0.42),
      new THREE.Vector3(-0.22, 0.05, 0.46),
      new THREE.Vector3(0.16, -0.05, 0.32),
    ]),
    [],
  );
  const forward = useMemo(() => new THREE.Vector3(1, 0, 0), []);

  useFrame(({ clock }) => {
    const group = bee.current;
    if (!group) return;
    const state = stateRef.current;
    const local = THREE.MathUtils.clamp((state.progress - 0.395) / 0.19, 0, 1);
    group.visible = state.progress > 0.365 && state.progress < 0.625;
    if (!group.visible) return;

    const flight = smoothstep(0.03, 0.88, local);
    const position = flightPath.getPoint(flight);
    const tangent = flightPath.getTangent(Math.min(0.995, flight + 0.005));
    group.position.copy(position);
    group.quaternion.setFromUnitVectors(forward, tangent.normalize());
    const contactCompression = Math.sin(smoothstep(0.72, 1, local) * Math.PI) * 0.045;
    group.scale.setScalar(0.43 - contactCompression);

    const flap = state.reducedMotion ? 0.22 : Math.sin(clock.elapsedTime * 34) * 0.58;
    if (leftWing.current) leftWing.current.rotation.x = 0.28 + flap;
    if (rightWing.current) rightWing.current.rotation.x = -0.28 - flap;
    if (pollinia.current) pollinia.current.visible = local > 0.77;
  });

  return (
    <group ref={bee} visible={false}>
        <mesh scale={[0.48, 0.36, 0.38]}>
          <sphereGeometry args={[1, 28, 18]} />
          <meshPhysicalMaterial
            color="#1f211d"
            roughness={0.88}
            metalness={0.08}
            iridescence={0.28}
            iridescenceIOR={1.8}
          />
        </mesh>
        <mesh position={[-0.63, 0, 0]} scale={[0.72, 0.31, 0.3]}>
          <sphereGeometry args={[1, 28, 18]} />
          <meshPhysicalMaterial
            color="#101816"
            roughness={0.52}
            metalness={0.35}
            iridescence={0.72}
            iridescenceIOR={1.65}
          />
        </mesh>
        <mesh position={[0.43, 0.01, 0]} scale={[0.34, 0.31, 0.31]}>
          <sphereGeometry args={[1, 24, 16]} />
          <meshPhysicalMaterial color="#111816" roughness={0.62} metalness={0.16} />
        </mesh>
        <mesh position={[0.56, 0.08, 0.22]} scale={[0.13, 0.18, 0.08]}>
          <sphereGeometry args={[1, 18, 12]} />
          <meshPhysicalMaterial color="#283f42" metalness={0.42} roughness={0.22} />
        </mesh>
        <mesh position={[0.56, 0.08, -0.22]} scale={[0.13, 0.18, 0.08]}>
          <sphereGeometry args={[1, 18, 12]} />
          <meshPhysicalMaterial color="#283f42" metalness={0.42} roughness={0.22} />
        </mesh>

        <mesh ref={leftWing} position={[-0.28, 0.23, 0.22]} rotation={[0.14, 0.05, -0.42]} scale={[0.88, 0.28, 1]}>
          <circleGeometry args={[1, 38]} />
          <meshPhysicalMaterial color="#b9d6d1" transparent opacity={0.32} roughness={0.16} transmission={0.42} iridescence={0.55} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
        <mesh ref={rightWing} position={[-0.28, 0.23, -0.22]} rotation={[-0.14, -0.05, -0.42]} scale={[0.88, 0.28, 1]}>
          <circleGeometry args={[1, 38]} />
          <meshPhysicalMaterial color="#b9d6d1" transparent opacity={0.32} roughness={0.16} transmission={0.42} iridescence={0.55} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>

        <Tube start={[0.24, -0.2, 0.23]} end={[-0.05, -0.58, 0.48]} radius={0.025} color="#2a2118" />
        <Tube start={[0.24, -0.2, -0.23]} end={[-0.05, -0.58, -0.48]} radius={0.025} color="#2a2118" />
        <Tube start={[-0.22, -0.2, 0.24]} end={[-0.55, -0.55, 0.5]} radius={0.025} color="#2a2118" />
        <Tube start={[-0.22, -0.2, -0.24]} end={[-0.55, -0.55, -0.5]} radius={0.025} color="#2a2118" />
        <Tube start={[-0.56, -0.17, 0.2]} end={[-0.97, -0.52, 0.5]} radius={0.023} color="#241f19" />
        <Tube start={[-0.56, -0.17, -0.2]} end={[-0.97, -0.52, -0.5]} radius={0.023} color="#241f19" />
        <Tube start={[0.58, 0.12, 0.12]} end={[0.83, 0.26, 0.2]} radius={0.012} color="#211a15" />
        <Tube start={[0.58, 0.12, -0.12]} end={[0.83, 0.26, -0.2]} radius={0.012} color="#211a15" />
        <BeeBristles />

        <group ref={pollinia} visible={false} position={[0.7, -0.2, 0]}>
          <mesh position={[0, 0, 0.055]} scale={[0.055, 0.12, 0.045]}>
            <sphereGeometry args={[1, 16, 10]} />
            <meshStandardMaterial color="#f2d152" emissive="#6d5410" emissiveIntensity={0.25} />
          </mesh>
          <mesh position={[0, 0, -0.055]} scale={[0.055, 0.12, 0.045]}>
            <sphereGeometry args={[1, 16, 10]} />
            <meshStandardMaterial color="#f2d152" emissive="#6d5410" emissiveIntensity={0.25} />
          </mesh>
        </group>
    </group>
  );
}

function MicroscopicWorld({ stateRef }: { stateRef: MutableRefObject<FlowerCanvasProps> }) {
  const group = useRef<THREE.Group>(null);
  const pollen = useRef<THREE.Mesh>(null);
  const tube = useRef<THREE.TubeGeometry>(null);
  const curve = useMemo(
    () => new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.02, 1.38, 0),
      new THREE.Vector3(-0.18, 0.7, 0.05),
      new THREE.Vector3(0.16, 0.02, -0.04),
      new THREE.Vector3(-0.08, -0.72, 0.03),
      new THREE.Vector3(0.28, -1.22, 0),
    ]),
    [],
  );
  const ovules = useMemo(
    () => Array.from({ length: 18 }, (_, index) => {
      const angle = (index / 18) * Math.PI * 2;
      const radius = 0.55 + (index % 3) * 0.13;
      return [Math.cos(angle) * radius, -1.2 + Math.sin(angle * 2) * 0.22, Math.sin(angle) * radius] as THREE.Vector3Tuple;
    }),
    [],
  );

  useFrame(() => {
    const root = group.current;
    if (!root) return;
    const progress = stateRef.current.progress;
    const weight = windowWeight(progress, 0.605, 0.815, 0.035);
    const local = THREE.MathUtils.clamp((progress - 0.635) / 0.145, 0, 1);
    root.visible = weight > 0.01;
    const scale = 0.28 + smoothstep(0.62, 0.72, progress) * 0.94;
    root.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    root.rotation.y = stateRef.current.reducedMotion ? 0.08 : Math.sin(performance.now() * 0.00018) * 0.12;
    if (tube.current) tube.current.setDrawRange(0, Math.floor(tube.current.index!.count * smoothstep(0.1, 0.92, local)));
    if (pollen.current) pollen.current.position.copy(curve.getPoint(Math.min(0.995, smoothstep(0.08, 0.9, local))));
  });

  const weight = windowWeight(stateRef.current.progress, 0.605, 0.815, 0.035);
  return (
    <group ref={group} visible={false} position={[0, 0.04, 0.15]}>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.62, 0.86, 2.8, 36, 1, true]} />
        <meshPhysicalMaterial color="#658a69" transparent opacity={weight * 0.24} side={THREE.DoubleSide} depthWrite={false} roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.42, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.64, 0.08, 16, 48]} />
        <meshStandardMaterial color="#d5a98d" emissive="#63362c" emissiveIntensity={0.22} transparent opacity={Math.max(0.2, weight)} />
      </mesh>
      <mesh ref={pollen} position={curve.getPoint(0)} scale={[0.16, 0.12, 0.16]}>
        <dodecahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#e8c94f" emissive="#806719" emissiveIntensity={0.45} roughness={0.72} />
      </mesh>
      <mesh>
        <tubeGeometry ref={tube} args={[curve, 96, 0.036, 10, false]} />
        <meshStandardMaterial color="#f2da70" emissive="#8e7622" emissiveIntensity={0.55} roughness={0.65} />
      </mesh>
      {ovules.map((position, index) => (
        <mesh key={index} position={position} scale={[0.18, 0.29, 0.16]} rotation={[0, (index / ovules.length) * Math.PI * 2, 0]}>
          <sphereGeometry args={[1, 18, 12]} />
          <meshPhysicalMaterial
            color={index === 2 ? "#f0ce67" : "#c8d394"}
            emissive={index === 2 ? "#806520" : "#243b25"}
            emissiveIntensity={index === 2 ? 0.55 : 0.1}
            transparent
            opacity={Math.max(0.22, weight * 0.9)}
            roughness={0.62}
          />
        </mesh>
      ))}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -1.22, 0]}>
        <torusGeometry args={[1.02, 0.012, 8, 72]} />
        <meshBasicMaterial color="#a3c1a1" transparent opacity={weight * 0.34} />
      </mesh>
    </group>
  );
}

function FruitSet({ progress }: { progress: number }) {
  const outcome = smoothstep(0.81, 0.995, progress);
  const seeds = useMemo(
    () => Array.from({ length: 28 }, (_, index) => {
      const angle = index * 2.39996;
      const radius = 0.035 + (index % 4) * 0.02;
      return [Math.cos(angle) * radius, -0.78 + ((index % 7) - 3) * 0.14, Math.sin(angle) * radius] as THREE.Vector3Tuple;
    }),
    [],
  );
  const ridges = useMemo(
    () => Array.from({ length: 6 }, (_, index) => {
      const angle = (index / 6) * Math.PI * 2;
      return [Math.cos(angle) * 0.17, Math.sin(angle) * 0.17] as const;
    }),
    [],
  );

  return (
    <group visible={outcome > 0.01} position={[0.06, -0.03, 0.22]}>
      <mesh position={[0, -0.78, 0]} scale={[0.26 + outcome * 0.14, 0.58 + outcome * 0.62, 0.26 + outcome * 0.14]}>
        <capsuleGeometry args={[0.42, 0.9, 20, 36]} />
        <meshPhysicalMaterial color="#698f59" roughness={0.8} clearcoat={0.06} transparent opacity={0.28 + outcome * 0.68} depthWrite={outcome > 0.72} />
      </mesh>
      {ridges.map(([x, z], index) => (
        <group key={index}>
          <Tube start={[0, -1.68, 0]} end={[x, -0.78, z]} radius={0.012} color="#456d43" opacity={outcome * 0.72} />
          <Tube start={[x, -0.78, z]} end={[0, 0.12, 0]} radius={0.012} color="#456d43" opacity={outcome * 0.72} />
        </group>
      ))}
      {seeds.map((position, index) => (
        <mesh key={index} position={position} scale={0.008 + outcome * 0.008}>
          <sphereGeometry args={[1, 8, 6]} />
          <meshStandardMaterial color="#d9bd75" transparent opacity={outcome * 0.42} depthWrite={false} />
        </mesh>
      ))}
      <mesh position={[0, 0.14, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1 - outcome * 0.46, 1 - outcome * 0.46, 1]}>
        <torusGeometry args={[0.29, 0.025, 10, 32]} />
        <meshStandardMaterial color="#4f7448" roughness={0.88} transparent opacity={outcome * 0.72} />
      </mesh>
    </group>
  );
}

function CameraRig({ resetToken, reducedMotion }: { resetToken: number; reducedMotion: boolean }) {
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null);
  const { camera, invalidate, size } = useThree();
  const transition = useRef<{
    start: number;
    duration: number;
    from: THREE.Vector3;
    to: THREE.Vector3;
    fromTarget: THREE.Vector3;
    toTarget: THREE.Vector3;
  } | null>(null);

  useEffect(() => {
    const aspect = size.width / Math.max(1, size.height);
    const cameraDistance = aspect < 0.78 ? 7.35 : aspect < 1.18 ? 6.05 : 5.05;
    const to = new THREE.Vector3(0, 0.02, cameraDistance);
    const toTarget = new THREE.Vector3(0, -0.02, 0);
    if (reducedMotion) {
      camera.position.copy(to);
      controls.current?.target.copy(toTarget);
      controls.current?.update();
      invalidate();
      return;
    }
    transition.current = {
      start: performance.now(),
      duration: 650,
      from: camera.position.clone(),
      to,
      fromTarget: controls.current?.target.clone() ?? new THREE.Vector3(),
      toTarget,
    };
    invalidate();
  }, [camera, invalidate, reducedMotion, resetToken, size.height, size.width]);

  useFrame(() => {
    const active = transition.current;
    if (!active) return;
    const progress = THREE.MathUtils.clamp((performance.now() - active.start) / active.duration, 0, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    camera.position.lerpVectors(active.from, active.to, eased);
    controls.current?.target.lerpVectors(active.fromTarget, active.toTarget, eased);
    controls.current?.update();
    invalidate();
    if (progress >= 1) transition.current = null;
  });

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enablePan={false}
      enableZoom={false}
      enableDamping
      dampingFactor={0.075}
      minPolarAngle={Math.PI * 0.17}
      maxPolarAngle={Math.PI * 0.83}
      target={[0, -0.02, 0]}
    />
  );
}

function FlowerScene(props: AnimatedSceneProps) {
  const progress = clampFlowerProgress(props.progress);
  return (
    <>
      <ambientLight intensity={0.38} color="#b9c6b9" />
      <hemisphereLight args={["#e7e3cc", "#172019", 1.28]} />
      <directionalLight position={[-3.8, 5.2, 5]} intensity={3.2} color="#f1dcc1" />
      <directionalLight position={[4.1, 1.8, -2.4]} intensity={1.55} color="#9fc7ad" />
      <pointLight position={[0, -2.6, 2.1]} intensity={1.1} color="#caa478" />
      <Suspense fallback={null}>
        <OrchidSpecimen {...props} />
      </Suspense>
      <InternalAnatomy progress={progress} />
      <CarpenterBee stateRef={props.stateRef} />
      <MicroscopicWorld stateRef={props.stateRef} />
      <FruitSet progress={progress} />
      <CameraRig resetToken={props.resetToken} reducedMotion={props.reducedMotion} />
    </>
  );
}

export default function FlowerCanvas(props: FlowerCanvasProps) {
  const stateRef = useRef(props);
  stateRef.current = props;

  return (
    <Canvas
      frameloop={props.renderingActive === false ? "demand" : "always"}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.02, 5.05], fov: 31, near: 0.03, far: 45 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        preserveDrawingBuffer: false,
        stencil: true,
      }}
      onCreated={({ gl }) => {
        gl.localClippingEnabled = true;
      }}
      resize={{ scroll: false }}
    >
      <FlowerScene {...props} stateRef={stateRef} />
    </Canvas>
  );
}

useGLTF.preload(flowerExhibit.specimen.modelPath);
