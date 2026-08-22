"use client";

import { OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, type ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  type MutableRefObject,
} from "react";
import * as THREE from "three";
import {
  anatomy,
  structureForMesh,
  structureMatchesMesh,
} from "@/content/anatomy";
import type { AnatomyModelKey } from "@/lib/anatomy/anatomy-schema";
import type { AnatomyCanvasProps } from "./AnatomyStage";

const MODEL_PATHS = Object.fromEntries(
  anatomy.models.map((model) => [model.key, model.path]),
) as Record<AnatomyModelKey, string>;

const THORACIC_VESSEL_TOKENS = [
  "aorta",
  "coronary",
  "cardiac",
  "pulmonary",
  "vena_cava",
  "brachiocephalic",
  "subclavian",
  "common_carotid",
];

type MaterialSet = ReturnType<typeof createMaterials>;
type RegisteredScene = { model: AnatomyModelKey; scene: THREE.Group };
type SceneProps = AnatomyCanvasProps & {
  materials: MaterialSet;
  stateRef: MutableRefObject<AnatomyCanvasProps>;
};

function createMaterial(
  color: string,
  options: {
    roughness?: number;
    opacity?: number;
    emissive?: string;
    emissiveIntensity?: number;
    clearcoat?: number;
  } = {},
) {
  const opacity = options.opacity ?? 1;
  const material = new THREE.MeshPhysicalMaterial({
    color,
    roughness: options.roughness ?? 0.66,
    metalness: 0,
    clearcoat: options.clearcoat ?? 0.06,
    clearcoatRoughness: 0.74,
    transparent: opacity < 1,
    opacity,
    depthWrite: opacity >= 0.5,
    side: THREE.DoubleSide,
    emissive: options.emissive ?? "#000000",
    emissiveIntensity: options.emissiveIntensity ?? 0,
  });
  material.name = `Loupe ${color}`;
  return material;
}

function pulseMaterial(color: string, emissive: string) {
  return createMaterial(color, {
    roughness: 0.56,
    emissive,
    emissiveIntensity: 0.1,
    clearcoat: 0.1,
  });
}

function createMaterials() {
  return {
    heart: createMaterial("#74231f", { roughness: 0.58 }),
    heartQuiet: createMaterial("#3d2625", { roughness: 0.7, opacity: 0.38 }),
    atrium: createMaterial("#8e342d", { roughness: 0.61 }),
    valve: createMaterial("#a98270", { roughness: 0.76 }),
    lung: createMaterial("#6c403c", { roughness: 0.76, opacity: 0.16 }),
    lungActive: createMaterial("#83504a", { roughness: 0.74, opacity: 0.29 }),
    airway: createMaterial("#b09a79", { roughness: 0.79 }),
    airwayPulse: pulseMaterial("#c6ad7c", "#725524"),
    artery: createMaterial("#962f28", { roughness: 0.56 }),
    vein: createMaterial("#28506d", { roughness: 0.59 }),
    vesselPulseArtery: pulseMaterial("#b13a30", "#771b14"),
    vesselPulseVein: pulseMaterial("#326482", "#173d5b"),
    liver: createMaterial("#6f2d28", { roughness: 0.62 }),
    pancreas: createMaterial("#b87962", { roughness: 0.72 }),
    smallBowel: createMaterial("#a86758", { roughness: 0.74 }),
    colon: createMaterial("#805048", { roughness: 0.76 }),
    liverPulse: pulseMaterial("#864039", "#55211c"),
    pancreasPulse: pulseMaterial("#c9876c", "#694031"),
    smallBowelPulse: pulseMaterial("#b97765", "#6b342c"),
    colonPulse: pulseMaterial("#976257", "#552d28"),
    kidney: createMaterial("#74312c", { roughness: 0.64 }),
    kidneyCortex: createMaterial("#883b34", { roughness: 0.65 }),
    kidneyMedulla: createMaterial("#9b5e51", { roughness: 0.72 }),
    collector: createMaterial("#c39a76", { roughness: 0.72 }),
    ureter: createMaterial("#b88c6d", { roughness: 0.75 }),
    bladder: createMaterial("#95614f", { roughness: 0.72, opacity: 0.9 }),
    kidneyPulse: pulseMaterial("#8f4138", "#5f241f"),
    collectorPulse: pulseMaterial("#d0aa82", "#745237"),
    ureterPulse: pulseMaterial("#c49b75", "#765137"),
    bladderPulse: pulseMaterial("#aa735d", "#63392d"),
    urethraPulse: pulseMaterial("#c29a76", "#765137"),
    cortex: createMaterial("#a7756f", { roughness: 0.81 }),
    cortexPulse: pulseMaterial("#b9837b", "#6f3935"),
    cerebellum: createMaterial("#8f5d5a", { roughness: 0.83 }),
    whiteMatter: createMaterial("#d0c1ae", { roughness: 0.83 }),
    whiteMatterPulse: pulseMaterial("#ddd0bd", "#7c6547"),
    deepNucleus: createMaterial("#8a6568", { roughness: 0.82 }),
    ventricle: createMaterial("#7d9aaa", { roughness: 0.54, opacity: 0.46 }),
    spinalCord: createMaterial("#c7ae99", { roughness: 0.82 }),
    spinalCordPulse: pulseMaterial("#d7c0a9", "#79583e"),
    sclera: createMaterial("#d9d2c4", { roughness: 0.72 }),
    cornea: createMaterial("#a7c5cf", { roughness: 0.15, opacity: 0.22, clearcoat: 0.28 }),
    corneaPulse: pulseMaterial("#bad5dc", "#426c7b"),
    iris: createMaterial("#526f69", { roughness: 0.63 }),
    pupil: createMaterial("#171b1d", { roughness: 0.86 }),
    lens: createMaterial("#d6cec0", { roughness: 0.2, opacity: 0.42, clearcoat: 0.24 }),
    lensPulse: pulseMaterial("#e0d8ca", "#8c7657"),
    retina: createMaterial("#873c3f", { roughness: 0.74 }),
    retinaPulse: pulseMaterial("#a14a4b", "#6c2729"),
    choroid: createMaterial("#51363d", { roughness: 0.72 }),
    macula: createMaterial("#b69555", { roughness: 0.68 }),
    vitreous: createMaterial("#a9c5ca", { roughness: 0.28, opacity: 0.08 }),
    conjunctiva: createMaterial("#c58f8b", { roughness: 0.78, opacity: 0.5 }),
    thymus: createMaterial("#a76a70", { roughness: 0.76 }),
    thymusPulse: pulseMaterial("#b9787e", "#6d3840"),
    spleen: createMaterial("#6e2633", { roughness: 0.66 }),
    spleenPulse: pulseMaterial("#873444", "#521826"),
    nodeCapsule: createMaterial("#a17f62", { roughness: 0.78, opacity: 0.5 }),
    nodeFollicle: createMaterial("#b89967", { roughness: 0.74 }),
    nodeParacortex: createMaterial("#8f6b72", { roughness: 0.76 }),
    nodeMedulla: createMaterial("#765159", { roughness: 0.78 }),
    nodeVessel: createMaterial("#9d4b43", { roughness: 0.63 }),
    nodePulse: pulseMaterial("#b08769", "#6d4a2d"),
    compactBone: createMaterial("#d2c4aa", { roughness: 0.86 }),
    spongyBone: createMaterial("#b89c7f", { roughness: 0.9 }),
    bonePulse: pulseMaterial("#ded0b4", "#776240"),
    cartilage: createMaterial("#78999a", { roughness: 0.72, opacity: 0.9 }),
    meniscus: createMaterial("#aa8c70", { roughness: 0.82 }),
    enthesis: createMaterial("#bd9256", { roughness: 0.77 }),
    jointSurface: createMaterial("#b5a58f", { roughness: 0.77 }),
    selected: createMaterial("#e6b85c", {
      roughness: 0.48,
      emissive: "#9a5f12",
      emissiveIntensity: 0.32,
      clearcoat: 0.1,
    }),
  };
}

function cloneScene(scene: THREE.Group, model: AnatomyModelKey) {
  const clone = scene.clone(true);
  clone.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    object.userData.anatomyModel = model;
    object.castShadow = false;
    object.receiveShadow = false;
  });
  return clone;
}

function isAirway(name: string) {
  if (name.includes("bronchopulmonary_segment")) return false;
  return [
    "bronch",
    "trache",
    "carina",
    "cartilage",
    "epiglott",
    "arytenoid",
    "cricoid",
    "thyroid",
  ].some((token) => name.includes(token));
}

function isVein(name: string) {
  return name.includes("vein") || name.includes("vena");
}

function kidneyMaterial(materials: MaterialSet, meshName: string) {
  if (meshName.includes("outer_cortex")) return materials.kidneyCortex;
  if (meshName.includes("pyramid") || meshName.includes("papilla") || meshName.includes("column")) {
    return materials.kidneyMedulla;
  }
  return materials.kidney;
}

function brainMaterial(materials: MaterialSet, meshName: string, pathway: boolean) {
  if (meshName.includes("ventricle") || meshName.includes("aqueduct") || meshName.includes("central_canal")) {
    return materials.ventricle;
  }
  if (meshName.includes("white_matter") || meshName.includes("corpus_callosum") || meshName.includes("commissure") || meshName.includes("tract") || meshName.includes("fornix") || meshName.includes("peduncle")) {
    return pathway ? materials.whiteMatterPulse : materials.whiteMatter;
  }
  if (meshName.includes("cerebell")) return materials.cerebellum;
  if (meshName.includes("thalam") || meshName.includes("caudate") || meshName.includes("putamen") || meshName.includes("pallid") || meshName.includes("amygdal") || meshName.includes("hippocamp") || meshName.includes("nucleus")) {
    return materials.deepNucleus;
  }
  return pathway ? materials.cortexPulse : materials.cortex;
}

function eyeMaterial(materials: MaterialSet, meshName: string, pathway: boolean) {
  if (meshName.includes("cornea")) return pathway ? materials.corneaPulse : materials.cornea;
  if (meshName.includes("lens")) return pathway ? materials.lensPulse : materials.lens;
  if (meshName.includes("retina") || meshName.includes("optic_disc")) {
    return pathway ? materials.retinaPulse : materials.retina;
  }
  if (meshName.includes("macula") || meshName.includes("fovea")) return materials.macula;
  if (meshName.includes("iris")) return materials.iris;
  if (meshName.includes("pupil")) return materials.pupil;
  if (meshName.includes("choroid")) return materials.choroid;
  if (meshName.includes("vitreous") || meshName.includes("aqueous")) return materials.vitreous;
  if (meshName.includes("conjunctiva")) return materials.conjunctiva;
  if (meshName.includes("sclera")) return materials.sclera;
  return materials.sclera;
}

function lymphNodeMaterial(materials: MaterialSet, meshName: string, pathway: boolean) {
  if (pathway) return materials.nodePulse;
  if (meshName.includes("capsule")) return materials.nodeCapsule;
  if (meshName.includes("follicle")) return materials.nodeFollicle;
  if (meshName.includes("paracortex")) return materials.nodeParacortex;
  if (meshName.includes("medulla")) return materials.nodeMedulla;
  return materials.nodeVessel;
}

function skeletalMaterial(materials: MaterialSet, meshName: string, pathway: boolean) {
  if (pathway && (meshName.includes("ilium") || meshName.includes("femur") || meshName.includes("tibia"))) {
    return materials.bonePulse;
  }
  if (meshName.includes("cartilage")) return materials.cartilage;
  if (meshName.includes("meniscus")) return materials.meniscus;
  if (meshName.includes("enthesis")) return materials.enthesis;
  if (meshName.includes("condyle") || meshName.includes("patellar_surface") || meshName.includes("fossa")) {
    return materials.jointSurface;
  }
  if (meshName.includes("spongy")) return materials.spongyBone;
  return materials.compactBone;
}

function materialForMesh(
  materials: MaterialSet,
  model: AnatomyModelKey,
  meshName: string,
  props: AnatomyCanvasProps,
) {
  if (structureMatchesMesh(props.selectedStructure, model, meshName)) {
    return materials.selected;
  }

  if (model === "heart") {
    if (props.system.id === "respiratory") return materials.heartQuiet;
    if (meshName.includes("valve")) return materials.valve;
    if (meshName.includes("atrium")) return materials.atrium;
    return materials.heart;
  }
  if (model === "lung") {
    if (isAirway(meshName)) {
      return props.view.id === "pathway" && props.system.id === "respiratory"
        ? materials.airwayPulse
        : materials.airway;
    }
    return props.system.id === "respiratory" ? materials.lungActive : materials.lung;
  }
  if (model === "vasculature") {
    if (props.view.id === "pathway" && props.system.id === "cardiovascular") {
      return isVein(meshName) ? materials.vesselPulseVein : materials.vesselPulseArtery;
    }
    return isVein(meshName) ? materials.vein : materials.artery;
  }
  if (model === "liver") return props.view.id === "pathway" ? materials.liverPulse : materials.liver;
  if (model === "pancreas") return props.view.id === "pathway" ? materials.pancreasPulse : materials.pancreas;
  if (model === "small-intestine") {
    return props.view.id === "pathway" ? materials.smallBowelPulse : materials.smallBowel;
  }
  if (model === "large-intestine") return props.view.id === "pathway" ? materials.colonPulse : materials.colon;
  if (model === "kidney-left" || model === "kidney-right") {
    return props.view.id === "pathway" ? materials.kidneyPulse : kidneyMaterial(materials, meshName);
  }
  if (model === "ureter-left" || model === "ureter-right") {
    if (props.view.id === "pathway") {
      return meshName.includes("ureter") ? materials.ureterPulse : materials.collectorPulse;
    }
    return meshName.includes("ureter") ? materials.ureter : materials.collector;
  }
  if (model === "urinary-bladder") {
    return props.view.id === "pathway" ? materials.bladderPulse : materials.bladder;
  }
  if (model === "urethra") {
    return props.view.id === "pathway" ? materials.urethraPulse : materials.ureter;
  }
  if (model === "brain") return brainMaterial(materials, meshName, props.view.id === "pathway");
  if (model === "spinal-cord") {
    return props.view.id === "pathway" ? materials.spinalCordPulse : materials.spinalCord;
  }
  if (model === "eye-left" || model === "eye-right") {
    return eyeMaterial(materials, meshName, props.view.id === "pathway");
  }
  if (model === "thymus") {
    return props.view.id === "pathway" ? materials.thymusPulse : materials.thymus;
  }
  if (model === "spleen") {
    return props.view.id === "pathway" ? materials.spleenPulse : materials.spleen;
  }
  if (model === "lymph-node") {
    return lymphNodeMaterial(materials, meshName, props.view.id === "pathway");
  }
  if (model === "skeleton-full") {
    return skeletalMaterial(materials, meshName, props.view.id === "pathway");
  }
  return materials.selected;
}

function sceneMeshVisible(model: AnatomyModelKey, meshName: string, props: AnatomyCanvasProps) {
  if (!props.layers[model]) return false;
  if (props.view.id === "isolate") {
    return structureMatchesMesh(props.selectedStructure, model, meshName);
  }
  if (model === "vasculature") {
    if (props.view.id === "pathway" && props.system.id === "respiratory") return true;
    return THORACIC_VESSEL_TOKENS.some((token) => meshName.includes(token));
  }
  if (model === "heart" && props.view.id === "pathway" && props.system.id === "respiratory") {
    return false;
  }
  if (model === "lung") {
    if (props.view.id === "pathway" && props.system.id === "cardiovascular") return false;
    return props.system.id === "respiratory" || meshName.includes("bronchopulmonary_segment");
  }
  return true;
}

function useRegisteredScenes(
  entries: RegisteredScene[],
  materials: MaterialSet,
  props: SceneProps,
) {
  const invalidate = useThree((state) => state.invalidate);
  const applyState = useCallback((state: AnatomyCanvasProps) => {
    entries.forEach(({ model, scene }) => {
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        const name = object.name.toLowerCase();
        object.visible = sceneMeshVisible(model, name, state);
        if (object.visible) object.material = materialForMesh(materials, model, name, state);
      });
    });
  }, [entries, materials]);

  const stateKey = [
    props.system.id,
    props.view.id,
    props.selectedStructure.id,
    props.renderingActive === false ? "paused" : "active",
    props.reducedMotion ? "reduced-motion" : "full-motion",
    ...props.system.modelKeys.map((model) => props.layers[model] ? "1" : "0"),
  ].join("|");

  useLayoutEffect(() => {
    applyState(props.stateRef.current);
    invalidate();
  }, [applyState, invalidate, props.stateRef, stateKey]);

  useFrame(({ clock }) => {
    const state = props.stateRef.current;
    const animate = state.renderingActive !== false
      && state.view.id === "pathway"
      && !state.reducedMotion;
    const time = clock.elapsedTime * 1.55;
    const intensity = (phase: number, floor = 0.08) => (
      animate ? floor + Math.max(0, Math.sin(time - phase)) * 0.74 : floor
    );
    materials.vesselPulseArtery.emissiveIntensity = intensity(0, 0.13);
    materials.vesselPulseVein.emissiveIntensity = intensity(Math.PI, 0.11);
    materials.airwayPulse.emissiveIntensity = intensity(0.8, 0.1);
    materials.liverPulse.emissiveIntensity = intensity(0, 0.08);
    materials.pancreasPulse.emissiveIntensity = intensity(0.65, 0.08);
    materials.smallBowelPulse.emissiveIntensity = intensity(1.5, 0.08);
    materials.colonPulse.emissiveIntensity = intensity(2.35, 0.08);
    materials.kidneyPulse.emissiveIntensity = intensity(0, 0.09);
    materials.collectorPulse.emissiveIntensity = intensity(0.65, 0.09);
    materials.ureterPulse.emissiveIntensity = intensity(1.35, 0.09);
    materials.bladderPulse.emissiveIntensity = intensity(2.1, 0.09);
    materials.urethraPulse.emissiveIntensity = intensity(2.75, 0.09);
    materials.cortexPulse.emissiveIntensity = intensity(0, 0.06);
    materials.whiteMatterPulse.emissiveIntensity = intensity(0.7, 0.08);
    materials.spinalCordPulse.emissiveIntensity = intensity(1.45, 0.08);
    materials.corneaPulse.emissiveIntensity = intensity(0, 0.08);
    materials.lensPulse.emissiveIntensity = intensity(0.72, 0.08);
    materials.retinaPulse.emissiveIntensity = intensity(1.45, 0.08);
    materials.thymusPulse.emissiveIntensity = intensity(0, 0.07);
    materials.spleenPulse.emissiveIntensity = intensity(0.8, 0.07);
    materials.nodePulse.emissiveIntensity = intensity(1.6, 0.07);
    materials.bonePulse.emissiveIntensity = intensity(0.4, 0.07);
  });
}

function RenderScheduler({ active }: { active: boolean }) {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    invalidate();
    if (!active) return;

    let frame = 0;
    const render = () => {
      invalidate();
      frame = window.requestAnimationFrame(render);
    };
    frame = window.requestAnimationFrame(render);
    return () => window.cancelAnimationFrame(frame);
  }, [active, invalidate]);

  return null;
}

function useReady(onReady: AnatomyCanvasProps["onReady"]) {
  useEffect(() => {
    onReady?.();
  }, [onReady]);
}

function meshClickHandler(props: SceneProps) {
  return (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    const model = event.object.userData.anatomyModel as AnatomyModelKey | undefined;
    if (!model) return;
    const state = props.stateRef.current;
    const structure = structureForMesh(state.system.id, model, event.object.name);
    if (structure) state.onSelectStructure(structure.id);
  };
}

function ThoracicAnatomy(props: SceneProps) {
  const heartSource = useGLTF(MODEL_PATHS.heart).scene;
  const lungSource = useGLTF(MODEL_PATHS.lung).scene;
  const vasculatureSource = useGLTF(MODEL_PATHS.vasculature).scene;
  const { materials } = props;
  const entries = useMemo<RegisteredScene[]>(() => [
    { model: "lung", scene: cloneScene(lungSource, "lung") },
    { model: "heart", scene: cloneScene(heartSource, "heart") },
    { model: "vasculature", scene: cloneScene(vasculatureSource, "vasculature") },
  ], [heartSource, lungSource, vasculatureSource]);
  useRegisteredScenes(entries, materials, props);
  useReady(props.onReady);
  return (
    <group scale={7.05} position={[0, -3.68, 0]} onClick={meshClickHandler(props)}>
      {entries.map(({ model, scene }) => <primitive key={model} object={scene} />)}
    </group>
  );
}

function DigestiveAnatomy(props: SceneProps) {
  const liverSource = useGLTF(MODEL_PATHS.liver).scene;
  const pancreasSource = useGLTF(MODEL_PATHS.pancreas).scene;
  const smallIntestineSource = useGLTF(MODEL_PATHS["small-intestine"]).scene;
  const largeIntestineSource = useGLTF(MODEL_PATHS["large-intestine"]).scene;
  const { materials } = props;
  const entries = useMemo<RegisteredScene[]>(() => [
    { model: "liver", scene: cloneScene(liverSource, "liver") },
    { model: "pancreas", scene: cloneScene(pancreasSource, "pancreas") },
    { model: "small-intestine", scene: cloneScene(smallIntestineSource, "small-intestine") },
    { model: "large-intestine", scene: cloneScene(largeIntestineSource, "large-intestine") },
  ], [largeIntestineSource, liverSource, pancreasSource, smallIntestineSource]);
  useRegisteredScenes(entries, materials, props);
  useReady(props.onReady);
  return (
    <group scale={6.8} position={[0, -1.82, 0]} onClick={meshClickHandler(props)}>
      {entries.map(({ model, scene }) => <primitive key={model} object={scene} />)}
    </group>
  );
}

function UrinaryAnatomy(props: SceneProps) {
  const kidneyLeftSource = useGLTF(MODEL_PATHS["kidney-left"]).scene;
  const kidneyRightSource = useGLTF(MODEL_PATHS["kidney-right"]).scene;
  const ureterLeftSource = useGLTF(MODEL_PATHS["ureter-left"]).scene;
  const ureterRightSource = useGLTF(MODEL_PATHS["ureter-right"]).scene;
  const bladderSource = useGLTF(MODEL_PATHS["urinary-bladder"]).scene;
  const urethraSource = useGLTF(MODEL_PATHS.urethra).scene;
  const { materials } = props;
  const entries = useMemo<RegisteredScene[]>(() => [
    { model: "kidney-left", scene: cloneScene(kidneyLeftSource, "kidney-left") },
    { model: "kidney-right", scene: cloneScene(kidneyRightSource, "kidney-right") },
    { model: "ureter-left", scene: cloneScene(ureterLeftSource, "ureter-left") },
    { model: "ureter-right", scene: cloneScene(ureterRightSource, "ureter-right") },
    { model: "urinary-bladder", scene: cloneScene(bladderSource, "urinary-bladder") },
    { model: "urethra", scene: cloneScene(urethraSource, "urethra") },
  ], [bladderSource, kidneyLeftSource, kidneyRightSource, ureterLeftSource, ureterRightSource, urethraSource]);
  useRegisteredScenes(entries, materials, props);
  useReady(props.onReady);
  return (
    <group scale={7.5} position={[0, -1.28, 0]} onClick={meshClickHandler(props)}>
      {entries.map(({ model, scene }) => <primitive key={model} object={scene} />)}
    </group>
  );
}

function NervousAnatomy(props: SceneProps) {
  const brainSource = useGLTF(MODEL_PATHS.brain).scene;
  const spinalSource = useGLTF(MODEL_PATHS["spinal-cord"]).scene;
  const { materials } = props;
  const entries = useMemo<RegisteredScene[]>(() => [
    { model: "brain", scene: cloneScene(brainSource, "brain") },
    { model: "spinal-cord", scene: cloneScene(spinalSource, "spinal-cord") },
  ], [brainSource, spinalSource]);
  useRegisteredScenes(entries, materials, props);
  useReady(props.onReady);
  return (
    <group scale={5.55} position={[0, -3.38, 0]} onClick={meshClickHandler(props)}>
      {entries.map(({ model, scene }) => <primitive key={model} object={scene} />)}
    </group>
  );
}

function SensoryAnatomy(props: SceneProps) {
  const leftSource = useGLTF(MODEL_PATHS["eye-left"]).scene;
  const rightSource = useGLTF(MODEL_PATHS["eye-right"]).scene;
  const { materials } = props;
  const entries = useMemo<RegisteredScene[]>(() => [
    { model: "eye-left", scene: cloneScene(leftSource, "eye-left") },
    { model: "eye-right", scene: cloneScene(rightSource, "eye-right") },
  ], [leftSource, rightSource]);
  useRegisteredScenes(entries, materials, props);
  useReady(props.onReady);
  return (
    <group scale={20} position={[0, -16.2, 0]} onClick={meshClickHandler(props)}>
      {entries.map(({ model, scene }) => <primitive key={model} object={scene} />)}
    </group>
  );
}

function ImmuneAnatomy(props: SceneProps) {
  const thymusSource = useGLTF(MODEL_PATHS.thymus).scene;
  const spleenSource = useGLTF(MODEL_PATHS.spleen).scene;
  const nodeSource = useGLTF(MODEL_PATHS["lymph-node"]).scene;
  const { materials } = props;
  const entries = useMemo<RegisteredScene[]>(() => [
    { model: "thymus", scene: cloneScene(thymusSource, "thymus") },
    { model: "spleen", scene: cloneScene(spleenSource, "spleen") },
    { model: "lymph-node", scene: cloneScene(nodeSource, "lymph-node") },
  ], [nodeSource, spleenSource, thymusSource]);
  useRegisteredScenes(entries, materials, props);
  useReady(props.onReady);
  const registeredGroup = useRef<THREE.Group>(null);
  const nodeGroup = useRef<THREE.Group>(null);
  const nodeEntry = entries[2];
  const nodeFrame = useMemo(() => {
    const bounds = new THREE.Box3().setFromObject(nodeEntry.scene);
    const center = bounds.getCenter(new THREE.Vector3());
    const size = bounds.getSize(new THREE.Vector3());
    return {
      center,
      scale: 2.55 / Math.max(size.x, size.y, size.z, 0.001),
    };
  }, [nodeEntry.scene]);
  const invalidate = useThree((state) => state.invalidate);
  const nodeMode = props.selectedStructure.selectors.some(
      (selector) => selector.model === "lymph-node",
    ) && props.selectedStructure.id !== "immune-organs";
  useLayoutEffect(() => {
    if (registeredGroup.current) registeredGroup.current.visible = !nodeMode;
    if (nodeGroup.current) nodeGroup.current.visible = nodeMode;
    invalidate();
  }, [invalidate, nodeMode]);

  return (
    <group onClick={meshClickHandler(props)}>
      <group ref={registeredGroup} scale={8.9} position={[0, -4.15, 0]}>
        {entries.slice(0, 2).map(({ model, scene }) => <primitive key={model} object={scene} />)}
      </group>
      <group ref={nodeGroup} visible={false} scale={nodeFrame.scale}>
        <group position={[-nodeFrame.center.x, -nodeFrame.center.y, -nodeFrame.center.z]}>
          <primitive object={nodeEntry.scene} />
        </group>
      </group>
    </group>
  );
}

function MusculoskeletalAnatomy(props: SceneProps) {
  const skeletonSource = useGLTF(MODEL_PATHS["skeleton-full"]).scene;
  const { materials } = props;
  const entries = useMemo<RegisteredScene[]>(() => [
    { model: "skeleton-full", scene: cloneScene(skeletonSource, "skeleton-full") },
  ], [skeletonSource]);
  useRegisteredScenes(entries, materials, props);
  useReady(props.onReady);
  const frame = useMemo(() => {
    const bounds = new THREE.Box3().setFromObject(entries[0].scene);
    const center = bounds.getCenter(new THREE.Vector3());
    const size = bounds.getSize(new THREE.Vector3());
    return {
      center,
      scale: 2.9 / Math.max(size.z, 0.001),
    };
  }, [entries]);
  return (
    <group rotation={[-Math.PI / 2, 0, 0]} scale={frame.scale} onClick={meshClickHandler(props)}>
      <group position={[-frame.center.x, -frame.center.y, -frame.center.z]}>
        <primitive object={entries[0].scene} />
      </group>
    </group>
  );
}

function RegisteredAnatomy(props: SceneProps) {
  if (props.system.id === "digestive") return <DigestiveAnatomy {...props} />;
  if (props.system.id === "urinary") return <UrinaryAnatomy {...props} />;
  if (props.system.id === "nervous") return <NervousAnatomy {...props} />;
  if (props.system.id === "sensory") return <SensoryAnatomy {...props} />;
  if (props.system.id === "immune") return <ImmuneAnatomy {...props} />;
  if (props.system.id === "musculoskeletal") return <MusculoskeletalAnatomy {...props} />;
  return <ThoracicAnatomy {...props} />;
}

function CameraController({
  command,
  systemId,
  viewId,
  selectedStructureId,
  reducedMotion,
}: {
  command: AnatomyCanvasProps["cameraCommand"];
  systemId: AnatomyCanvasProps["system"]["id"];
  viewId: AnatomyCanvasProps["view"]["id"];
  selectedStructureId: string;
  reducedMotion: boolean;
}) {
  const controls = useRef<React.ComponentRef<typeof OrbitControls>>(null);
  const pendingFrame = useRef<number | null>(null);
  const lastFrameState = useRef({ systemId, viewId });
  const { camera, scene, size, invalidate } = useThree();
  const transition = useRef<{
    startedAt: number;
    duration: number;
    fromPosition: THREE.Vector3;
    toPosition: THREE.Vector3;
    fromTarget: THREE.Vector3;
    toTarget: THREE.Vector3;
  } | null>(null);

  const queueFrame = useCallback(() => {
    if (pendingFrame.current !== null) return;
    pendingFrame.current = window.requestAnimationFrame(() => {
      pendingFrame.current = null;
      invalidate();
    });
  }, [invalidate]);

  useEffect(() => () => {
    if (pendingFrame.current !== null) window.cancelAnimationFrame(pendingFrame.current);
  }, []);

  const moveCamera = useCallback((position: THREE.Vector3, target: THREE.Vector3) => {
    if (reducedMotion) {
      camera.position.copy(position);
      controls.current?.target.copy(target);
      camera.updateProjectionMatrix();
      controls.current?.update();
      invalidate();
      return;
    }
    transition.current = {
      startedAt: performance.now(),
      duration: 520,
      fromPosition: camera.position.clone(),
      toPosition: position,
      fromTarget: controls.current?.target.clone() ?? new THREE.Vector3(),
      toTarget: target,
    };
    queueFrame();
  }, [camera, invalidate, queueFrame, reducedMotion]);

  useFrame(() => {
    const active = transition.current;
    if (!active) return;
    const progress = THREE.MathUtils.clamp((performance.now() - active.startedAt) / active.duration, 0, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    camera.position.lerpVectors(active.fromPosition, active.toPosition, eased);
    controls.current?.target.lerpVectors(active.fromTarget, active.toTarget, eased);
    camera.updateProjectionMatrix();
    controls.current?.update();
    if (progress >= 1) transition.current = null;
    else queueFrame();
  });

  useEffect(() => {
    const previous = lastFrameState.current;
    const shouldReset = previous.systemId !== systemId
      || (previous.viewId === "isolate" && viewId !== "isolate");
    const shouldFocus = viewId === "isolate";
    lastFrameState.current = { systemId, viewId };
    if (!shouldReset && !shouldFocus) return;

    const frame = window.requestAnimationFrame(() => {
      if (viewId !== "isolate") {
        moveCamera(new THREE.Vector3(0, 0.05, 5.2), new THREE.Vector3());
        return;
      }

      const bounds = new THREE.Box3();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh && object.visible) bounds.expandByObject(object);
      });
      if (bounds.isEmpty()) return;

      const center = bounds.getCenter(new THREE.Vector3());
      const extent = bounds.getSize(new THREE.Vector3());
      const verticalFov = camera instanceof THREE.PerspectiveCamera
        ? THREE.MathUtils.degToRad(camera.fov)
        : THREE.MathUtils.degToRad(34);
      const fitHeight = extent.y / (2 * Math.tan(verticalFov / 2));
      const fitWidth = extent.x / (2 * Math.tan(verticalFov / 2) * Math.max(size.width / size.height, 0.5));
      const distance = THREE.MathUtils.clamp(Math.max(fitHeight, fitWidth) * 1.42, 1.15, 6.8);
      const direction = camera.position.clone().sub(controls.current?.target ?? new THREE.Vector3()).normalize();

      moveCamera(center.clone().add(direction.multiplyScalar(distance)), center);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [camera, moveCamera, scene, selectedStructureId, size.height, size.width, systemId, viewId]);

  useEffect(() => {
    if (command.type === "idle") return;
    if (command.type === "reset") {
      moveCamera(new THREE.Vector3(0, 0.05, 5.2), new THREE.Vector3());
    } else {
      const factor = command.type === "zoom-in" ? 0.82 : 1.18;
      const target = controls.current?.target.clone() ?? new THREE.Vector3();
      const offset = camera.position.clone().sub(target);
      const distance = THREE.MathUtils.clamp(offset.length() * factor, 0.85, 7.4);
      const next = target.clone().add(offset.normalize().multiplyScalar(distance));
      moveCamera(next, target);
    }
  }, [camera, command, moveCamera]);
  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enablePan={false}
      enableDamping
      dampingFactor={0.075}
      minDistance={0.85}
      maxDistance={7.5}
      minPolarAngle={Math.PI * 0.18}
      maxPolarAngle={Math.PI * 0.82}
      target={[0, 0, 0]}
    />
  );
}

export default function AnatomyCanvas(props: AnatomyCanvasProps) {
  const materials = useMemo(() => createMaterials(), []);
  const stateRef = useRef(props);
  stateRef.current = props;

  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.8]}
      camera={{ position: [0, 0.05, 5.2], fov: 34, near: 0.05, far: 40 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        preserveDrawingBuffer: false,
        stencil: false,
      }}
      resize={{ scroll: false }}
    >
      <ambientLight intensity={0.24} color="#9fa6ac" />
      <hemisphereLight args={["#c8d1da", "#231a18", 0.64]} />
      <directionalLight position={[-3.5, 5.5, 5]} intensity={2.35} color="#efd4bf" />
      <directionalLight position={[4, 1.5, 3]} intensity={1.05} color="#abc2d8" />
      <pointLight position={[0, -2.5, -2]} intensity={1.15} color="#85413a" />
      <RenderScheduler
        active={props.renderingActive !== false
          && props.view.id === "pathway"
          && !props.reducedMotion}
      />
      <Suspense fallback={null}>
        <RegisteredAnatomy {...props} materials={materials} stateRef={stateRef} />
      </Suspense>
      <CameraController
        command={props.cameraCommand}
        systemId={props.system.id}
        viewId={props.view.id}
        selectedStructureId={props.selectedStructure.id}
        reducedMotion={props.reducedMotion}
      />
    </Canvas>
  );
}

useGLTF.preload(MODEL_PATHS.heart);
useGLTF.preload(MODEL_PATHS.lung);
useGLTF.preload(MODEL_PATHS.vasculature);
