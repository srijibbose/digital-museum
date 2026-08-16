"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { ArrowDown, ArrowUpRight, Gauge, Info, Pause, Play, RotateCcw, Wind } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import type { Group, Mesh } from "three";

const parts = [
  { id: "inlet", number: "01", name: "Inlet", short: "Shapes the air", description: "The bell-mouth inlet slows and straightens the air before it meets the first rotating stage.", stat: "Mach 0.85" },
  { id: "fan", number: "02", name: "Fan", short: "Moves the mass", description: "A large, low-pressure fan accelerates a huge volume of air. Most of it will flow around the hot core.", stat: "2.9 m diameter" },
  { id: "compressor", number: "03", name: "Compressor", short: "Builds pressure", description: "Rows of rotating and stationary blades squeeze the core air into a smaller, denser volume.", stat: "42:1 pressure ratio" },
  { id: "combustor", number: "04", name: "Combustor", short: "Adds the energy", description: "Fuel joins the compressed air in a controlled flame. The pressure stays nearly constant while temperature rises.", stat: "1,950 K" },
  { id: "turbine", number: "05", name: "Turbine", short: "Takes the work", description: "The expanding hot gas spins turbine stages, which drive the compressor through a single shaft.", stat: "10,000 rpm" },
  { id: "nozzle", number: "06", name: "Nozzle", short: "Turns heat into speed", description: "A narrowing nozzle turns the gas's pressure and heat into a fast, coherent exhaust jet.", stat: "Mach 1.2" },
] as const;

type PartId = (typeof parts)[number]["id"];

function Rotor({ speed, color = "#d5b49c" }: { speed: number; color?: string }) {
  const group = useRef<Group>(null);
  useFrame((_, delta) => { if (group.current) group.current.rotation.z += delta * speed * 0.0007; });
  return <group ref={group}>
    <mesh rotation={[0, Math.PI / 2, 0]}><cylinderGeometry args={[0.15, 0.15, 1.3, 32]} /><meshStandardMaterial color="#2b3031" metalness={0.85} roughness={0.3} /></mesh>
    {Array.from({ length: 12 }).map((_, i) => <mesh key={i} rotation={[0, 0, (i / 12) * Math.PI * 2]} position={[0, 0, 0]}><boxGeometry args={[0.13, 0.72, 0.035]} /><meshStandardMaterial color={color} metalness={0.7} roughness={0.22} /></mesh>)}
  </group>;
}

function InspectionScene({ speed, selected }: { speed: number; selected: PartId }) {
  const core = useRef<Mesh>(null);
  useFrame((_, delta) => { if (core.current) core.current.rotation.x += delta * speed * 0.00035; });
  const highlight = selected === "turbine" || selected === "compressor" ? "#e8c9ad" : "#788082";
  return <>
    <PerspectiveCamera makeDefault position={[5.1, 2.2, 5.2]} fov={37} />
    <ambientLight intensity={1.2} /><directionalLight position={[4, 5, 3]} intensity={4} color="#f3dfc5" /><pointLight position={[-3, 0, 2]} intensity={12} color="#d86f3d" />
    <group rotation={[0, 0, Math.PI / 2]}>
      <mesh><cylinderGeometry args={[1.2, 1.2, 4.7, 64, 1, true]} /><meshStandardMaterial color="#161a1b" metalness={0.8} roughness={0.26} transparent opacity={0.62} side={2} /></mesh>
      <mesh position={[0, 0, -2.05]}><cylinderGeometry args={[1.03, 1.03, 0.08, 64]} /><meshStandardMaterial color="#3c4444" metalness={0.9} roughness={0.2} /></mesh>
      <mesh ref={core} position={[0, 0, 0.5]}><cylinderGeometry args={[0.38, 0.26, 3.4, 32]} /><meshStandardMaterial color={highlight} metalness={0.72} roughness={0.28} /></mesh>
      <Rotor speed={speed} color={selected === "fan" ? "#e8c9ad" : "#9ea4a0"} />
      <mesh position={[0, 0, 1.12]}><torusGeometry args={[0.78, 0.06, 12, 64]} /><meshStandardMaterial color="#d86f3d" emissive="#8e351a" emissiveIntensity={selected === "combustor" ? 2.2 : 0.7} /></mesh>
    </group>
    <OrbitControls enablePan={false} minDistance={4} maxDistance={8} autoRotate autoRotateSpeed={0.35} />
  </>;
}

export function JetEngineExperience() {
  const [activePart, setActivePart] = useState<PartId>("inlet");
  const [speed, setSpeed] = useState(68);
  const [airflow, setAirflow] = useState(74);
  const [fuel, setFuel] = useState(42);
  const [isPlaying, setIsPlaying] = useState(true);
  const [scene, setScene] = useState<"overview" | "playground">("overview");
  const selected = parts.find((part) => part.id === activePart) ?? parts[0];
  const flowDots = useMemo(() => Array.from({ length: 18 }), []);

  return <main className="jet-exhibit">
    <header className="jet-header"><a href="/" className="jet-brand"><span className="jet-brand__orb" /> LOUPE <span>/ EXH. 003</span></a><div className="jet-header__right"><span className="jet-status"><i /> SYSTEM LIVE</span><button className="icon-button" onClick={() => setIsPlaying((value) => !value)} aria-label={isPlaying ? "Pause animations" : "Play animations"}>{isPlaying ? <Pause /> : <Play />}</button></div></header>

    <section className="jet-hero" aria-labelledby="jet-title">
      <div className="jet-hero__copy"><p className="jet-eyebrow">Systems & Machines / Interactive exhibit</p><h1 id="jet-title">The engine<br /><em>is a river.</em></h1><p className="jet-hero__lede">Follow air as it becomes pressure, heat, work, and finally flight. Wake the machine, then pull it apart.</p><button className="launch-button" onClick={() => document.getElementById("journey")?.scrollIntoView({ behavior: "smooth" })}>Enter the core <ArrowDown /></button></div>
      <div className="engine-hero-graphic" aria-label="Animated jet engine cutaway illustration"><div className="engine-ring engine-ring--outer" /><div className="engine-ring engine-ring--inner" /><div className="engine-core"><div className="engine-flame" /></div><div className="hero-air hero-air--one" /><div className="hero-air hero-air--two" /><span className="hero-label hero-label--top">Turbofan / high bypass</span><span className="hero-label hero-label--bottom">Thrust is a conversation with air</span></div>
      <div className="scroll-cue"><span>01</span><span className="scroll-cue__line" /><span>WAKE</span></div>
    </section>

    <section className="jet-journey" id="journey"><div className="section-intro"><p className="jet-eyebrow">A guided disassembly</p><h2>Meet the six<br /><em>moments of thrust.</em></h2><p>Tap a station. Watch the air change character. The engine is not one event — it is a chain of carefully balanced transformations.</p></div><div className="part-stage"><div className="cutaway-panel"><div className="cutaway-topline"><span>LIVE CUTAWAY / 001</span><span>{Math.round(airflow)}% AIRFLOW</span></div><div className="cutaway-engine"><div className="cutaway-shell" /><div className="cutaway-shaft" /><div className="air-stream">{flowDots.map((_, i) => <i key={i} style={{ "--i": i } as React.CSSProperties} />)}</div>{parts.map((part, index) => <button key={part.id} className={`hotspot hotspot--${part.id} ${activePart === part.id ? "is-active" : ""}`} onClick={() => setActivePart(part.id)} aria-label={`Explore ${part.name}`}><span>{part.number}</span><b>{part.name}</b></button>)}</div><div className="cutaway-controls"><button className="text-button" onClick={() => setActivePart(parts[(parts.findIndex((part) => part.id === activePart) + parts.length - 1) % parts.length].id)}><ArrowUpRight /> Previous</button><span>{parts.findIndex((part) => part.id === activePart) + 1} / 6</span><button className="text-button" onClick={() => setActivePart(parts[(parts.findIndex((part) => part.id === activePart) + 1) % parts.length].id)}>Next <ArrowUpRight /></button></div></div><aside className="part-card"><div className="part-card__number">{selected.number}</div><p className="jet-eyebrow">{selected.short}</p><h3>{selected.name}</h3><p>{selected.description}</p><div className="part-stat"><span>SPECIMEN NOTE</span><strong>{selected.stat}</strong></div><button className="small-action" onClick={() => setScene("overview")}>Inspect in 3D <ArrowUpRight /></button></aside></div></section>

    <section className="jet-inspection"><div className="inspection-copy"><p className="jet-eyebrow">The object, opened</p><h2>Look inside<br /><em>the machine.</em></h2><p>Drag the engine. Let the rotors spin. Select a part to bring its work into focus.</p><div className="inspection-pills"><span><i className="pill-dot pill-dot--hot" /> Combustion</span><span><i className="pill-dot" /> Compression</span><span><i className="pill-dot pill-dot--air" /> Airflow</span></div></div><div className="canvas-frame"><div className="canvas-meta"><span>ROTATION / FREE INSPECTION</span><span><RotateCcw /> AUTO</span></div><Canvas dpr={[1, 1.7]} gl={{ antialias: true }}><InspectionScene speed={isPlaying ? speed * 100 : 0} selected={activePart} /></Canvas><div className="canvas-caption">A turbofan in three acts <span>Drag to orbit</span></div></div></section>

    <section className="jet-playground"><div className="playground-head"><div><p className="jet-eyebrow">Control room / live model</p><h2>Change the<br /><em>rules.</em></h2></div><div className="playground-readout"><Gauge /><span>EST. THRUST</span><strong>{(airflow * 1.36 + fuel * 0.82 + speed * 0.74).toFixed(0)} kN</strong></div></div><div className="playground-grid"><div className="control-panel"><div className="control-panel__top"><span>FLIGHT PROFILE</span><button className="reset-button" onClick={() => { setSpeed(68); setAirflow(74); setFuel(42); }}><RotateCcw /> Reset</button></div><label><span><Wind /> Airflow <b>{airflow}%</b></span><input aria-label="Airflow" type="range" min="0" max="100" value={airflow} onChange={(event) => setAirflow(Number(event.target.value))} /></label><label><span><Gauge /> Rotor speed <b>{speed}%</b></span><input aria-label="Rotor speed" type="range" min="0" max="100" value={speed} onChange={(event) => setSpeed(Number(event.target.value))} /></label><label><span><span className="fuel-mark">◒</span> Fuel flow <b>{fuel}%</b></span><input aria-label="Fuel flow" type="range" min="0" max="100" value={fuel} onChange={(event) => setFuel(Number(event.target.value))} /></label><div className="profile-buttons"><button className={scene === "overview" ? "is-selected" : ""} onClick={() => setScene("overview")}>Cruise</button><button className={scene === "playground" ? "is-selected" : ""} onClick={() => setScene("playground")}>Takeoff</button></div></div><div className="flow-visual"><div className="flow-visual__labels"><span>INLET</span><span>CORE</span><span>EXHAUST</span></div><div className="flow-tunnel">{Array.from({ length: 22 }).map((_, i) => <i key={i} style={{ "--i": i, "--flow": airflow } as React.CSSProperties} />)}<div className="flow-flame" style={{ opacity: 0.2 + fuel / 100 * 0.8 }} /></div><div className="flow-note"><Info /> <span>More air bypasses the hot core in cruise. More fuel unlocks the fierce orange heart of takeoff.</span></div></div></div></section>
    <footer className="jet-footer"><span>LOUPE / EXH. 003</span><span>THE ENGINE IS A RIVER</span><a href="/">Return to museum <ArrowUpRight /></a></footer>
  </main>;
}

export default JetEngineExperience;
