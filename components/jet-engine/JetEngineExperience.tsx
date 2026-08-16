"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { ArrowDown, ArrowUpRight, Gauge, Info, Pause, Play, RotateCcw, Wind } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import type { Group, Mesh } from "three";

const parts = [
  { id: "inlet", number: "01", name: "Inlet", short: "Shapes the air", description: "The nacelle and inlet lip condition the incoming stream before the fan face.", stat: "Mach 0.85" },
  { id: "fan", number: "02", name: "Fan", short: "Moves the mass", description: "A wide-chord fan accelerates a huge volume of air; most bypasses the hot core.", stat: "2.9 m diameter" },
  { id: "compressor", number: "03", name: "Compressor", short: "Builds pressure", description: "Alternating rotor and stator rows raise pressure through the core.", stat: "42:1 ratio" },
  { id: "combustor", number: "04", name: "Combustor", short: "Adds the energy", description: "Fuel mixes with compressed air inside the annular flame tube.", stat: "1,950 K" },
  { id: "turbine", number: "05", name: "Turbine", short: "Takes the work", description: "Expanding gas drives the shafts that power the compressor and fan.", stat: "10,000 rpm" },
  { id: "nozzle", number: "06", name: "Nozzle", short: "Makes velocity", description: "The mixer and nozzle turn pressure and heat into a coherent exhaust jet.", stat: "Mach 1.2" },
] as const;
type PartId = (typeof parts)[number]["id"];

function Rotor({ radius, length, blades, speed, color, y = 0, selected }: { radius: number; length: number; blades: number; speed: number; color: string; y?: number; selected: boolean }) {
  const group = useRef<Group>(null);
  useFrame((_, delta) => { if (group.current) group.current.rotation.y += delta * speed * 0.09; });
  return <group ref={group} position={[0, y, 0]} rotation={[0, 0, Math.PI / 2]}>
    <mesh><cylinderGeometry args={[0.1, 0.1, length, 24]} /><meshStandardMaterial color="#20282a" metalness={0.95} roughness={0.2} /></mesh>
    {Array.from({ length: blades }).map((_, i) => <mesh key={i} rotation={[0, 0, (i / blades) * Math.PI * 2]} position={[0, 0, 0]}>
      <boxGeometry args={[radius * 0.62, radius * 0.78, 0.045]} />
      <meshStandardMaterial color={selected ? "#f0c28f" : color} metalness={0.88} roughness={0.2} />
    </mesh>)}
    <mesh><torusGeometry args={[radius, 0.035, 10, 48]} /><meshStandardMaterial color="#a8ada5" metalness={0.9} roughness={0.18} /></mesh>
  </group>;
}

function StatorRows({ y, count, radius, color }: { y: number; count: number; radius: number; color: string }) {
  return <group position={[0, y, 0]} rotation={[0, 0, Math.PI / 2]}>{Array.from({ length: count }).map((_, i) => <mesh key={i} rotation={[0, 0, (i / count) * Math.PI * 2 + 0.12]} position={[0, 0, 0]}><boxGeometry args={[radius * 0.5, radius * 0.55, 0.025]} /><meshStandardMaterial color={color} metalness={0.75} roughness={0.3} /></mesh>)}</group>;
}

function TurbofanModel({ speed, airflow, fuel, selected, paused }: { speed: number; airflow: number; fuel: number; selected: PartId; paused: boolean }) {
  const hot = fuel / 100;
  const motion = paused ? 0 : speed / 100;
  const shaft = useRef<Group>(null);
  useFrame((_, delta) => { if (shaft.current) shaft.current.rotation.y += delta * motion * 1.9; });
  return <group rotation={[0, 0, Math.PI / 2]} scale={1.04}>
    <mesh><cylinderGeometry args={[1.42, 1.42, 5.9, 96, 1, true]} /><meshStandardMaterial color="#182022" metalness={0.86} roughness={0.23} transparent opacity={0.38} side={2} /></mesh>
    <mesh position={[0, -3.05, 0]}><torusGeometry args={[1.3, 0.16, 24, 96]} /><meshStandardMaterial color="#6c7472" metalness={0.95} roughness={0.19} /></mesh>
    <mesh position={[0, 3.04, 0]}><torusGeometry args={[1.12, 0.1, 20, 96]} /><meshStandardMaterial color="#d0d1c8" metalness={0.9} roughness={0.2} /></mesh>
    <group ref={shaft}>
      <Rotor radius={1.18} length={0.26} blades={24} speed={motion * 9} color="#c6c9bc" selected={selected === "fan"} y={-2.82} />
      <StatorRows y={-2.55} count={18} radius={0.92} color="#747e7a" />
      <Rotor radius={0.78} length={0.42} blades={16} speed={motion * 12} color="#9fa89e" selected={selected === "compressor"} y={-1.88} />
      <StatorRows y={-1.55} count={14} radius={0.72} color="#5c6662" />
      <Rotor radius={0.67} length={0.34} blades={14} speed={motion * 14} color="#aab0a4" selected={selected === "compressor"} y={-1.18} />
      <mesh position={[0, -0.4, 0]}><torusGeometry args={[0.72, 0.16, 20, 64]} /><meshStandardMaterial color="#d26b38" emissive="#a83e17" emissiveIntensity={selected === "combustor" ? 3.2 : hot * 1.7} metalness={0.46} roughness={0.25} /></mesh>
      <mesh position={[0, -0.42, 0]}><torusGeometry args={[0.45, 0.08, 16, 64]} /><meshStandardMaterial color="#ffb35d" emissive="#ff5c1a" emissiveIntensity={hot * 4} transparent opacity={0.85} /></mesh>
      <Rotor radius={0.6} length={0.3} blades={12} speed={motion * 16} color="#bd916f" selected={selected === "turbine"} y={0.42} />
      <Rotor radius={0.48} length={0.28} blades={10} speed={motion * 15} color="#8f7060" selected={selected === "turbine"} y={0.8} />
      <mesh position={[0, 1.74, 0]}><torusGeometry args={[0.68, 0.08, 16, 64]} /><meshStandardMaterial color="#727975" metalness={0.85} roughness={0.28} /></mesh>
      <mesh position={[0, 2.55, 0]}><coneGeometry args={[0.68, 1.45, 48, 1, true]} /><meshStandardMaterial color="#313939" metalness={0.86} roughness={0.24} side={2} /></mesh>
      <mesh position={[0, 3.05, 0]}><coneGeometry args={[0.62, 0.55, 48]} /><meshStandardMaterial color="#1c2424" metalness={0.9} roughness={0.2} /></mesh>
    </group>
    <group>
      {Array.from({ length: 9 }).map((_, i) => <mesh key={i} position={[0, -3.45 - i * 0.42, 0]} rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[1.18 - i * 0.055, 0.018, 8, 48]} /><meshBasicMaterial color="#82d5dc" transparent opacity={(0.48 - i * 0.035) * Math.min(1, airflow / 75)} /></mesh>)}
    </group>
  </group>;
}

function InspectionScene({ speed, airflow, fuel, selected, paused }: { speed: number; airflow: number; fuel: number; selected: PartId; paused: boolean }) {
  return <><PerspectiveCamera makeDefault position={[6.2, 3.2, 6.5]} fov={34} /><color attach="background" args={["#101516"]} /><ambientLight intensity={1.3} /><directionalLight position={[4, 5, 4]} intensity={4.6} color="#f1d7bd" /><directionalLight position={[-4, 2, -2]} intensity={3.4} color="#86cbd1" /><pointLight position={[0, -1, 2]} intensity={fuel * 0.08} color="#e86932" /><Environment preset="studio" /><TurbofanModel speed={speed} airflow={airflow} fuel={fuel} selected={selected} paused={paused} /><OrbitControls enablePan={false} minDistance={4.8} maxDistance={10} autoRotate={!paused} autoRotateSpeed={0.22} /></>;
}

export function JetEngineExperience() {
  const [activePart, setActivePart] = useState<PartId>("inlet");
  const [speed, setSpeed] = useState(68); const [airflow, setAirflow] = useState(74); const [fuel, setFuel] = useState(42); const [isPlaying, setIsPlaying] = useState(true); const [scene, setScene] = useState<"overview" | "playground">("overview");
  const selected = parts.find((part) => part.id === activePart) ?? parts[0]; const flowDots = useMemo(() => Array.from({ length: 18 }), []);
  const choose = (id: PartId) => setActivePart(id);
  return <main className="jet-exhibit"><header className="jet-header"><a href="/" className="jet-brand"><span className="jet-brand__orb" /> LOUPE <span>/ EXH. 003</span></a><div className="jet-header__right"><span className="jet-status"><i /> SYSTEM LIVE</span><button className="icon-button" onClick={() => setIsPlaying((value) => !value)} aria-label={isPlaying ? "Pause animations" : "Play animations"}>{isPlaying ? <Pause /> : <Play />}</button></div></header>
  <section className="jet-hero" aria-labelledby="jet-title"><div className="jet-hero__copy"><p className="jet-eyebrow">Systems & Machines / Interactive exhibit</p><h1 id="jet-title">The engine<br /><em>is a river.</em></h1><p className="jet-hero__lede">Follow air as it becomes pressure, heat, work, and finally flight. Wake the machine, then pull it apart.</p><button className="launch-button" onClick={() => document.getElementById("journey")?.scrollIntoView({ behavior: "smooth" })}>Enter the core <ArrowDown /></button></div><div className="engine-hero-graphic" aria-label="Animated jet engine cutaway illustration"><div className="engine-ring engine-ring--outer" /><div className="engine-ring engine-ring--inner" /><div className="engine-core"><div className="engine-flame" /></div><div className="hero-air hero-air--one" /><div className="hero-air hero-air--two" /><span className="hero-label hero-label--top">Turbofan / high bypass</span><span className="hero-label hero-label--bottom">Thrust is a conversation with air</span></div><div className="scroll-cue"><span>01</span><span className="scroll-cue__line" /><span>WAKE</span></div></section>
  <section className="jet-journey" id="journey"><div className="section-intro"><p className="jet-eyebrow">A guided disassembly</p><h2>Meet the six<br /><em>moments of thrust.</em></h2><p>Tap a station. Watch the air change character. The engine is a chain of carefully balanced transformations.</p></div><div className="part-stage"><div className="cutaway-panel"><div className="cutaway-topline"><span>LIVE CUTAWAY / 001</span><span>{Math.round(airflow)}% AIRFLOW</span></div><div className="cutaway-engine"><div className="cutaway-shell" /><div className="cutaway-shaft" /><div className="air-stream">{flowDots.map((_, i) => <i key={i} style={{ "--i": i } as React.CSSProperties} />)}</div>{parts.map((part) => <button key={part.id} className={`hotspot hotspot--${part.id} ${activePart === part.id ? "is-active" : ""}`} onClick={() => choose(part.id)} aria-label={`Explore ${part.name}`}><span>{part.number}</span><b>{part.name}</b></button>)}</div><div className="cutaway-controls"><button className="text-button" onClick={() => choose(parts[(parts.findIndex((part) => part.id === activePart) + 5) % 6].id)}><ArrowUpRight /> Previous</button><span>{parts.findIndex((part) => part.id === activePart) + 1} / 6</span><button className="text-button" onClick={() => choose(parts[(parts.findIndex((part) => part.id === activePart) + 1) % 6].id)}>Next <ArrowUpRight /></button></div></div><aside className="part-card"><div className="part-card__number">{selected.number}</div><p className="jet-eyebrow">{selected.short}</p><h3>{selected.name}</h3><p>{selected.description}</p><div className="part-stat"><span>SPECIMEN NOTE</span><strong>{selected.stat}</strong></div><button className="small-action" onClick={() => setScene("overview")}>Inspect in 3D <ArrowUpRight /></button></aside></div></section>
  <section className="jet-inspection"><div className="inspection-copy"><p className="jet-eyebrow">The object, opened</p><h2>Look inside<br /><em>the machine.</em></h2><p>Drag the engine. Let the rotors spin. Select a part to bring its work into focus.</p><div className="inspection-pills"><span><i className="pill-dot pill-dot--hot" /> Combustion</span><span><i className="pill-dot" /> Compression</span><span><i className="pill-dot pill-dot--air" /> Airflow</span></div></div><div className="canvas-frame"><div className="canvas-meta"><span>ROTATION / FREE INSPECTION</span><span><RotateCcw /> AUTO</span></div><Canvas dpr={[1, 1.7]} gl={{ antialias: true }}><InspectionScene speed={speed} airflow={airflow} fuel={fuel} selected={activePart} paused={!isPlaying} /></Canvas><div className="canvas-caption">A high-bypass turbofan, opened in six systems <span>Drag to orbit</span></div></div></section>
  <section className="jet-playground"><div className="playground-head"><div><p className="jet-eyebrow">Control room / live model</p><h2>Change the<br /><em>rules.</em></h2></div><div className="playground-readout"><Gauge /><span>EST. THRUST</span><strong>{(airflow * 1.36 + fuel * 0.82 + speed * 0.74).toFixed(0)} kN</strong></div></div><div className="playground-grid"><div className="control-panel"><div className="control-panel__top"><span>FLIGHT PROFILE</span><button className="reset-button" onClick={() => { setSpeed(68); setAirflow(74); setFuel(42); }}><RotateCcw /> Reset</button></div><label><span><Wind /> Airflow <b>{airflow}%</b></span><input aria-label="Airflow" type="range" min="0" max="100" value={airflow} onChange={(e) => setAirflow(Number(e.target.value))} /></label><label><span><Gauge /> Rotor speed <b>{speed}%</b></span><input aria-label="Rotor speed" type="range" min="0" max="100" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} /></label><label><span><span className="fuel-mark">◒</span> Fuel flow <b>{fuel}%</b></span><input aria-label="Fuel flow" type="range" min="0" max="100" value={fuel} onChange={(e) => setFuel(Number(e.target.value))} /></label><div className="profile-buttons"><button className={scene === "overview" ? "is-selected" : ""} onClick={() => setScene("overview")}>Cruise</button><button className={scene === "playground" ? "is-selected" : ""} onClick={() => setScene("playground")}>Takeoff</button></div></div><div className="flow-visual"><div className="flow-visual__labels"><span>INLET</span><span>CORE</span><span>EXHAUST</span></div><div className="flow-tunnel">{Array.from({ length: 22 }).map((_, i) => <i key={i} style={{ "--i": i, "--flow": airflow } as React.CSSProperties} />)}<div className="flow-flame" style={{ opacity: 0.2 + fuel / 100 * 0.8 }} /></div><div className="flow-note"><Info /> <span>More air bypasses the hot core in cruise. More fuel unlocks the fierce orange heart of takeoff.</span></div></div></div></section><footer className="jet-footer"><span>LOUPE / EXH. 003</span><span>THE ENGINE IS A RIVER</span><a href="/">Return to museum <ArrowUpRight /></a></footer></main>;
}
export default JetEngineExperience;

if (typeof window !== "undefined") { /* model is procedural and local: no remote asset dependency */ }
