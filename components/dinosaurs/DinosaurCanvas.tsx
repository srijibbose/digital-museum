"use client";

import { Html, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import type { DinosaurSpecies } from "@/content/dinosaurs";
import type { DinosaurCameraCommand } from "./dinosaur-viewer-types";
import styles from "./dinosaur-experience.module.css";

type DinosaurCanvasProps = {
  species: DinosaurSpecies;
  reducedMotion: boolean;
  command: DinosaurCameraCommand;
  showHotspots?: boolean;
  selectedBoneIndex?: number;
  onBoneSelect?: (index: number) => void;
  onReady?: () => void;
};

const preparedScenes = new WeakSet<THREE.Object3D>();

const specimenHotspots: Partial<Record<DinosaurSpecies["id"], [number, number, number][]>> = {
  tyrannosaurus: [
    [-2.0, 0.34, 0.2],
    [-0.52, 0.2, 0.26],
    [0.24, -0.76, 0.24],
    [1.45, 0.24, 0.18],
  ],
  triceratops: [
    [1.98, 0.39, 0.24],
    [1.43, 0.64, 0.22],
    [2.15, 0.03, 0.25],
    [1.74, -0.06, 0.28],
  ],
};

function MuseumModel({ species, onReady }: Pick<DinosaurCanvasProps, "species" | "onReady">) {
  const { scene } = useGLTF(species.specimen.modelPath!);
  const model = useMemo(() => {
    if (!preparedScenes.has(scene)) {
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (!mesh.isMesh) return;
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        for (const material of materials) {
          if ("roughness" in material) (material as THREE.MeshStandardMaterial).roughness = 0.78;
          if ("metalness" in material) (material as THREE.MeshStandardMaterial).metalness = 0.02;
        }
      });
      preparedScenes.add(scene);
    }

    const clone = scene.clone(true);
    clone.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    });

    const bounds = new THREE.Box3().setFromObject(clone);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    const longest = Math.max(size.x, size.y, size.z) || 1;
    const scale = 4.9 / longest;
    clone.scale.setScalar(scale);
    clone.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
    if (species.id === "triceratops") clone.rotation.y = Math.PI / 2;
    return clone;
  }, [scene, species.id]);

  useEffect(() => onReady?.(), [onReady]);
  return <primitive object={model} />;
}

function QuietStage({ reducedMotion, active }: { reducedMotion: boolean; active: boolean }) {
  const light = useRef<THREE.DirectionalLight>(null);
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    invalidate();
    if (reducedMotion || !active) return;
    const timer = window.setInterval(invalidate, 1000 / 30);
    return () => window.clearInterval(timer);
  }, [active, invalidate, reducedMotion]);

  useFrame((state) => {
    if (reducedMotion || !light.current) return;
    light.current.position.x = 3.8 + Math.sin(state.clock.elapsedTime * 0.08) * 0.12;
  });
  return (
    <>
      <hemisphereLight args={["#f8f2e7", "#9a9387", 1.85]} />
      <directionalLight
        ref={light}
        position={[3.8, 5.4, 5.2]}
        intensity={3.1}
        color="#fff7e7"
        castShadow
      />
      <directionalLight position={[-4.5, 1.4, -2.8]} intensity={1.45} color="#b9c9c4" />
      <mesh position={[0, -1.48, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[4.2, 96]} />
        <shadowMaterial transparent opacity={0.15} />
      </mesh>
    </>
  );
}

function SpecimenHotspots({
  species,
  selectedBoneIndex,
  onBoneSelect,
}: Pick<DinosaurCanvasProps, "species" | "selectedBoneIndex" | "onBoneSelect">) {
  const points = specimenHotspots[species.id];
  if (!points) return null;

  return points.map((position, index) => {
    const region = species.boneRegions[index];
    if (!region) return null;
    return (
      <Html key={region.id} position={position} center distanceFactor={7.4} zIndexRange={[18, 0]}>
        <button
          type="button"
          className={styles.specimenHotspot}
          data-active={index === selectedBoneIndex}
          aria-label={`Inspect ${region.label}`}
          title={region.label}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            onBoneSelect?.(index);
          }}
        >
          <span>{index + 1}</span>
        </button>
      </Html>
    );
  });
}

export function DinosaurCanvas({
  species,
  reducedMotion,
  command,
  showHotspots,
  selectedBoneIndex = 0,
  onBoneSelect,
  onReady,
}: DinosaurCanvasProps) {
    const host = useRef<HTMLDivElement>(null);
    const controls = useRef<OrbitControlsImpl>(null);
    const camera = useRef<THREE.PerspectiveCamera | null>(null);
    const invalidate = useRef<(() => void) | null>(null);
    const [active, setActive] = useState(true);

    const reset = useCallback(() => {
      if (!camera.current || !controls.current) return;
      camera.current.position.set(0.25, 0.2, 7.1);
      controls.current.target.set(0, 0, 0);
      controls.current.update();
      invalidate.current?.();
    }, []);

    useEffect(() => {
      reset();
    }, [reset, species.id]);

    useEffect(() => {
      if (command.id === 0 || !camera.current || !controls.current) return;
      if (command.type === "reset") {
        reset();
        return;
      }
      const offset = camera.current.position.clone().sub(controls.current.target);
      if (command.type === "rotate-left" || command.type === "rotate-right") {
        const radians = command.type === "rotate-left" ? -Math.PI / 5 : Math.PI / 5;
        offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), radians);
      } else {
        const factor = command.type === "zoom-in" ? 0.78 : 1.28;
        offset.setLength(THREE.MathUtils.clamp(offset.length() * factor, 3.4, 12));
      }
      camera.current.position.copy(controls.current.target).add(offset);
      camera.current.lookAt(controls.current.target);
      controls.current.update();
      invalidate.current?.();
    }, [command, reset]);

    useEffect(() => {
      const element = host.current;
      if (!element) return;
      const syncVisibility = (intersecting = true) => {
        setActive(intersecting && document.visibilityState === "visible");
      };
      let intersecting = true;
      const observer = new IntersectionObserver(([entry]) => {
        intersecting = entry?.isIntersecting ?? true;
        syncVisibility(intersecting);
      }, { rootMargin: "120px" });
      observer.observe(element);
      const onVisibilityChange = () => syncVisibility(intersecting);
      document.addEventListener("visibilitychange", onVisibilityChange);
      return () => {
        observer.disconnect();
        document.removeEventListener("visibilitychange", onVisibilityChange);
      };
    }, []);

    return (
      <div ref={host} className={styles.localCanvasHost}>
      <Canvas
        shadows
        camera={{ position: [0.25, 0.2, 7.1], fov: 34, near: 0.1, far: 60 }}
        dpr={[1, 1.5]}
        frameloop="demand"
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        onCreated={({ camera: activeCamera, gl, invalidate: requestFrame }) => {
          camera.current = activeCamera as THREE.PerspectiveCamera;
          invalidate.current = requestFrame;
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1;
          gl.setClearColor("#000000", 0);
        }}
      >
        <QuietStage reducedMotion={reducedMotion} active={active} />
        <Suspense fallback={null}>
          <MuseumModel key={species.id} species={species} onReady={onReady} />
        </Suspense>
        {showHotspots ? (
          <SpecimenHotspots
            species={species}
            selectedBoneIndex={selectedBoneIndex}
            onBoneSelect={onBoneSelect}
          />
        ) : null}
        <OrbitControls
          ref={controls}
          enablePan={false}
          enableDamping={!reducedMotion}
          dampingFactor={0.065}
          minDistance={3.4}
          maxDistance={12}
          minPolarAngle={Math.PI * 0.18}
          maxPolarAngle={Math.PI * 0.82}
          target={[0, 0, 0]}
        />
      </Canvas>
      </div>
    );
}

export function preloadMuseumModel(path: string) {
  useGLTF.preload(path);
}

export default DinosaurCanvas;
