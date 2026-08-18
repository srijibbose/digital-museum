"use client";

import { useMemo, useState } from "react";
import type { BecomingHumanChapter, ChapterInteraction } from "@/content/becoming-human";
import styles from "./becoming-human.module.css";

const toolkits = {
  COAST: ["TIDES", "SHELL TOOLS", "SHARED MAPS"],
  COLD: ["INSULATION", "SHELTER", "FIRE"],
  ARID: ["WATER MEMORY", "MOBILITY", "EXCHANGE"],
} as const;

const lineageMoments = {
  "300 KA": ["Homo sapiens", "Neanderthals", "Denisovan lineage", "Homo erectus"],
  "100 KA": ["Homo sapiens", "Neanderthals", "Denisovan lineage", "Homo erectus"],
  "45 KA": ["Homo sapiens", "Neanderthals", "Denisovan lineage"],
} as const;

function InstrumentShell({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.instrument} aria-label={label}>
      <div className={styles.instrumentTopline}>
        <span>LEARNING INSTRUMENT</span>
        <span>NO SCORE · SKIP ANY TIME</span>
      </div>
      {children}
    </div>
  );
}

function ChoiceRow({
  items,
  value,
  onChange,
}: {
  items: readonly string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className={styles.choiceRow} role="group">
      {items.map((item) => (
        <button
          className={item === value ? styles.choiceActive : undefined}
          key={item}
          onClick={() => onChange(item)}
          type="button"
        >
          {item}
        </button>
      ))}
    </div>
  );
}

function DeepTimeInstrument() {
  const [scale, setScale] = useState<"LINEAR" | "LOGARITHMIC">("LINEAR");
  const stops = scale === "LINEAR"
    ? ["NOW", "12 KA", "300 KA", "3.3 MA", "66 MA"]
    : ["NOW", "100 Y", "10 KA", "1 MA", "66 MA"];
  return (
    <InstrumentShell label="Deep-time scale comparison">
      <ChoiceRow items={["LINEAR", "LOGARITHMIC"]} value={scale} onChange={(value) => setScale(value as typeof scale)} />
      <div className={styles.timeScale} data-scale={scale.toLowerCase()}>
        {stops.map((stop, index) => (
          <span key={stop} style={{ "--stop": index } as React.CSSProperties}>{stop}</span>
        ))}
      </div>
      <p>{scale === "LINEAR" ? "Almost everything familiar is squeezed against NOW." : "A logarithmic view makes orders of magnitude visible."}</p>
    </InstrumentShell>
  );
}

function GripInstrument() {
  const [branch, setBranch] = useState("MEDIUM");
  const copy = {
    NARROW: "Fingers wrap beyond the palm; precision and opposition dominate.",
    MEDIUM: "A balanced grasp shares load across digits and palm.",
    WIDE: "The grip opens; friction and body position matter more.",
  }[branch];
  return (
    <InstrumentShell label="Compare grip geometry">
      <ChoiceRow items={["NARROW", "MEDIUM", "WIDE"]} value={branch} onChange={setBranch} />
      <div className={styles.gripDiagram} data-size={branch.toLowerCase()} aria-hidden="true"><i /><i /><i /><i /></div>
      <p>{copy}</p>
    </InstrumentShell>
  );
}

function BranchInstrument() {
  const [broken, setBroken] = useState(false);
  return (
    <InstrumentShell label="Replace the march-of-progress model">
      <button className={styles.instrumentAction} onClick={() => setBroken(true)} type="button">
        {broken ? "LADDER DISMANTLED" : "BREAK THE LADDER"}
      </button>
      <div className={`${styles.branchDiagram} ${broken ? styles.branchDiagramBroken : ""}`} aria-hidden="true">
        {Array.from({ length: 7 }, (_, index) => <i key={index} />)}
      </div>
      <p>{broken ? "Shared ancestors branch into overlapping lineages. Living species sit at tips—not ranks." : "The familiar silhouette sequence compresses branches into a false hierarchy."}</p>
    </InstrumentShell>
  );
}

function AnatomyInstrument() {
  const [region, setRegion] = useState("PELVIS");
  const copy = {
    PELVIS: "A shorter, broader pelvis redirects weight over each supporting leg.",
    KNEE: "Femur angle helps bring the knee under the body during single-leg support.",
    FOOT: "Toe alignment and arch mechanics support repeated push-off.",
    SKULL: "The foramen magnum’s position relates to how the head balances on the spine.",
  }[region];
  return (
    <InstrumentShell label="Bipedal anatomy comparison">
      <ChoiceRow items={["PELVIS", "KNEE", "FOOT", "SKULL"]} value={region} onChange={setRegion} />
      <div className={styles.anatomyReadout}><span>{region}</span><i style={{ width: `${42 + region.length * 5}%` }} /></div>
      <p>{copy} The on-screen form is explanatory; fossil endpoints remain discrete evidence.</p>
    </InstrumentShell>
  );
}

function StoneInstrument() {
  const [angle, setAngle] = useState(55);
  const [result, setResult] = useState<string | null>(null);
  function strike() {
    setResult(angle >= 48 && angle <= 68
      ? "A controlled flake detaches. Platform, angle and material aligned."
      : "The stone fractured, but no useful flake formed. Breaking alone is not technique.");
  }
  return (
    <InstrumentShell label="Controlled stone fracture model">
      <label className={styles.rangeLabel}>HAMMER ANGLE <output>{angle}°</output>
        <input max="90" min="25" onChange={(event) => setAngle(Number(event.target.value))} type="range" value={angle} />
      </label>
      <button className={styles.instrumentAction} onClick={strike} type="button">STRIKE THE PLATFORM</button>
      <div className={styles.stoneDiagram} data-success={Boolean(result && angle >= 48 && angle <= 68)} aria-hidden="true"><i /><i /><i /></div>
      <p aria-live="polite">{result ?? "Choose an angle. The outcome is one of several authored, plausible fracture states."}</p>
    </InstrumentShell>
  );
}

function FireInstrument() {
  const [evidence, setEvidence] = useState("BURNED SOIL");
  const support = {
    "BURNED SOIL": "FIRE OCCURRED",
    "REPEATED HEARTH": "FIRE WAS CONTROLLED",
    "PYRITE + HEATED SEDIMENT": "FIRE WAS PROBABLY MADE",
  }[evidence];
  return (
    <InstrumentShell label="Classify fire evidence">
      <ChoiceRow items={["BURNED SOIL", "REPEATED HEARTH", "PYRITE + HEATED SEDIMENT"]} value={evidence} onChange={setEvidence} />
      <div className={styles.fireStates}><span>FIND</span><span>KEEP</span><span>MAKE</span></div>
      <p><strong>{support}.</strong> This evidence supports a narrower claim than the phrase “humans mastered fire.”</p>
    </InstrumentShell>
  );
}

function MigrationInstrument() {
  const [time, setTime] = useState(18);
  return (
    <InstrumentShell label="Early human dispersal timeline">
      <label className={styles.rangeLabel}>TIME <output>{(time / 10).toFixed(1)} MA</output>
        <input max="22" min="10" onChange={(event) => setTime(Number(event.target.value))} type="range" value={time} />
      </label>
      <div className={styles.migrationMap} aria-hidden="true"><i style={{ width: `${Math.max(12, (22 - time) * 6)}%` }} /><b /><b /></div>
      <p>{time >= 18 ? "Dated sites are sparse points; corridors remain wide and uncertain." : "Later evidence broadens across Eurasia. This is repeated dispersal, not one arrow."}</p>
    </InstrumentShell>
  );
}

function ContemporariesInstrument() {
  const [moment, setMoment] = useState<keyof typeof lineageMoments>("100 KA");
  return (
    <InstrumentShell label="Human lineage contemporaries">
      <ChoiceRow items={Object.keys(lineageMoments)} value={moment} onChange={(value) => setMoment(value as keyof typeof lineageMoments)} />
      <ul className={styles.lineageList}>{lineageMoments[moment].map((lineage) => <li key={lineage}>{lineage}</li>)}</ul>
      <p>Ranges are approximate and unevenly preserved. Coexistence does not imply equal population size or direct contact everywhere.</p>
    </InstrumentShell>
  );
}

function SpeciesInstrument() {
  const [threshold, setThreshold] = useState(52);
  return (
    <InstrumentShell label="Conceptual species-boundary model">
      <label className={styles.rangeLabel}>TRAIT THRESHOLD <output>{threshold}%</output>
        <input max="90" min="10" onChange={(event) => setThreshold(Number(event.target.value))} type="range" value={threshold} />
      </label>
      <div className={styles.speciesBands}><i style={{ left: `${threshold}%` }} /></div>
      <p>Move the rule and the label changes; gradual population history does not. This conceptual model is not a taxonomy formula.</p>
    </InstrumentShell>
  );
}

function CultureInstrument({ kind }: { kind: ChapterInteraction }) {
  const [value, setValue] = useState(kind === "adaptation" ? "COLD" : kind === "flows" ? "INFORMATION" : "REVEAL");
  if (kind === "reveal") {
    return (
      <InstrumentShell label="Reveal symbolic evidence">
        <button className={styles.instrumentAction} onClick={() => setValue(value === "REVEAL" ? "OBSERVED" : "REVEAL")} type="button">MOVE THE LIGHT</button>
        <div className={styles.revealSurface} data-revealed={value === "OBSERVED"} aria-hidden="true"><i /><i /><i /></div>
        <p>{value === "OBSERVED" ? "Observed: incised lines and pigment. Interpreted: a durable social mark. Exact meaning: unknown." : "Darkness is not a test. Activate the light to expose all evidence."}</p>
      </InstrumentShell>
    );
  }
  if (kind === "adaptation") {
    const environment = value as keyof typeof toolkits;
    return (
      <InstrumentShell label="Environmental adaptation toolkit">
        <ChoiceRow items={Object.keys(toolkits)} value={value} onChange={setValue} />
        <ul className={styles.lineageList}>{toolkits[environment].map((tool) => <li key={tool}>{tool}</li>)}</ul>
        <p>No single tool solves an environment. Combinations of material knowledge and teaching matter.</p>
      </InstrumentShell>
    );
  }
  if (kind === "flows") {
    return (
      <InstrumentShell label="City-network flows">
        <ChoiceRow items={["FOOD", "MATERIAL", "INFORMATION", "DISEASE"]} value={value} onChange={setValue} />
        <div className={styles.flowNetwork} data-flow={value.toLowerCase()} aria-hidden="true"><i /><i /><i /><i /></div>
        <p>The topology stays fixed. What travels changes the network’s benefit, risk and speed.</p>
      </InstrumentShell>
    );
  }
  return null;
}

function SettlementInstrument() {
  const [mobility, setMobility] = useState(42);
  const storage = 100 - mobility;
  return (
    <InstrumentShell label="Settlement dependency model">
      <label className={styles.rangeLabel}>MOBILITY ↔ STORAGE <output>{mobility} / {storage}</output>
        <input max="80" min="20" onChange={(event) => setMobility(Number(event.target.value))} type="range" value={mobility} />
      </label>
      <div className={styles.tradeoffBars}><i style={{ width: `${mobility}%` }} /><i style={{ width: `${storage}%` }} /></div>
      <p>{mobility > 55 ? "Movement spreads risk but limits durable stores." : "Storage buffers a season but creates maintenance, labor and local dependence."} This is a conceptual community—not a progress score.</p>
    </InstrumentShell>
  );
}

function MemoryInstrument() {
  const [mark, setMark] = useState("△ · III");
  const [hidden, setHidden] = useState(false);
  return (
    <InstrumentShell label="External memory experiment">
      <label className={styles.textLabel}>MAKE A LOCAL MARK
        <input maxLength={18} onChange={(event) => setMark(event.target.value)} value={mark} />
      </label>
      <button className={styles.instrumentAction} onClick={() => setHidden((current) => !current)} type="button">{hidden ? "READ THE RECORD" : "LET TIME PASS"}</button>
      <div className={styles.memoryMark}>{hidden ? "· · ·" : mark || "—"}</div>
      <p>{hidden ? "The carrier is gone, but a durable code could remain." : "A mark persists. Meaning requires a community that knows how to read it."} Nothing is uploaded.</p>
    </InstrumentShell>
  );
}

function SequentialInstrument({ kind }: { kind: "print" | "grid" | "network" }) {
  const labels = kind === "print" ? ["SET", "INK", "PRESS"] : kind === "grid" ? ["GENERATE", "DISTRIBUTE", "LOAD"] : ["LOCAL", "LONG HAUL", "SERVER"];
  const [step, setStep] = useState(0);
  return (
    <InstrumentShell label={`${kind} system sequence`}>
      <div className={styles.sequence}>
        {labels.map((label, index) => <button className={index < step ? styles.sequenceDone : undefined} disabled={index > step} key={label} onClick={() => setStep(Math.min(labels.length, index + 1))} type="button">{String(index + 1).padStart(2, "0")} {label}</button>)}
      </div>
      <p aria-live="polite">{step === labels.length ? (kind === "print" ? "The form remains set; the next copy costs less time." : kind === "grid" ? "The light appears only when every upstream layer is connected." : "The message crossed physical systems at every stage.") : "Complete each dependency in order."}</p>
    </InstrumentShell>
  );
}

function MeasurementInstrument() {
  const [runs, setRuns] = useState<number[]>([]);
  const nextValues = [2.04, 1.98, 2.01, 2.06];
  return (
    <InstrumentShell label="Repeat a measurement">
      <button className={styles.instrumentAction} onClick={() => setRuns((current) => [...current, nextValues[current.length % nextValues.length]].slice(-4))} type="button">RUN IT AGAIN</button>
      <div className={styles.measureRuns}>{runs.length ? runs.map((run, index) => <span key={`${run}-${index}`}>{run.toFixed(2)} s</span>) : <span>NO RUNS YET</span>}</div>
      <p>Repeated runs expose variation. Measurement is not the removal of uncertainty; it is a disciplined way to see it.</p>
    </InstrumentShell>
  );
}

function EnergyInstrument() {
  const [layer, setLayer] = useState("OUTPUT");
  return (
    <InstrumentShell label="Energy-system inputs and costs">
      <ChoiceRow items={["OUTPUT", "FUEL", "LABOR", "EMISSIONS"]} value={layer} onChange={setLayer} />
      <div className={styles.energyGauge}><i style={{ width: layer === "OUTPUT" ? "86%" : layer === "FUEL" ? "68%" : layer === "LABOR" ? "54%" : "77%" }} /></div>
      <p>{layer === "OUTPUT" ? "Concentrated energy multiplies work." : `${layer} remains inside the system boundary even when it is hidden from the finished product.`}</p>
    </InstrumentShell>
  );
}

function LogicInstrument() {
  const [a, setA] = useState(false);
  const [b, setB] = useState(true);
  const [gate, setGate] = useState("AND");
  const output = gate === "AND" ? a && b : gate === "OR" ? a || b : !a;
  return (
    <InstrumentShell label="Logic gate builder">
      <div className={styles.logicBuilder}>
        <button aria-pressed={a} onClick={() => setA(!a)} type="button">A {Number(a)}</button>
        <button aria-pressed={b} onClick={() => setB(!b)} type="button">B {Number(b)}</button>
        <select aria-label="Logic gate" onChange={(event) => setGate(event.target.value)} value={gate}><option>AND</option><option>OR</option><option>NOT</option></select>
        <output>OUT {Number(output)}</output>
      </div>
      <p>Large systems coordinate layers of simple operations with memory and control.</p>
    </InstrumentShell>
  );
}

function TinyModelInstrument() {
  const [examples, setExamples] = useState([18, 32, 71]);
  const boundary = Math.round(examples.reduce((total, point) => total + point, 0) / examples.length);
  return (
    <InstrumentShell label="Tiny teaching classifier">
      <div className={styles.modelPlot} style={{ "--boundary": `${boundary}%` } as React.CSSProperties}>
        {examples.map((point, index) => <button aria-label={`Training example at ${point}`} key={`${point}-${index}`} onClick={() => setExamples((current) => current.filter((_, item) => item !== index))} style={{ left: `${point}%`, top: `${22 + index * 24}%` }} type="button" />)}
      </div>
      <button className={styles.instrumentAction} onClick={() => setExamples((current) => [...current, (current.length * 23 + 14) % 86 + 7].slice(-6))} type="button">ADD AN EXAMPLE</button>
      <p>The boundary moves with the examples. This is a deterministic teaching model—not a miniature ChatGPT.</p>
    </InstrumentShell>
  );
}

function GenericInstrument({ chapter }: { chapter: BecomingHumanChapter }) {
  const [active, setActive] = useState(false);
  return (
    <InstrumentShell label={chapter.interactionLabel ?? "Evidence interaction"}>
      <button className={styles.instrumentAction} onClick={() => setActive((current) => !current)} type="button">{chapter.interactionLabel ?? "INSPECT THE SYSTEM"}</button>
      <div className={styles.genericSignal} data-active={active} aria-hidden="true"><i /><i /><i /></div>
      <p>{active ? chapter.evidence.inferred : "Activate the instrument to reveal the relation between an observed trace and its interpretation."}</p>
    </InstrumentShell>
  );
}

export function LearningInstrument({ chapter }: { chapter: BecomingHumanChapter }) {
  const kind = chapter.interaction;
  const component = useMemo(() => {
    if (kind === "deep-time") return <DeepTimeInstrument />;
    if (kind === "grip") return <GripInstrument />;
    if (kind === "branches") return <BranchInstrument />;
    if (kind === "anatomy") return <AnatomyInstrument />;
    if (kind === "stone") return <StoneInstrument />;
    if (kind === "fire") return <FireInstrument />;
    if (kind === "migration") return <MigrationInstrument />;
    if (kind === "contemporaries") return <ContemporariesInstrument />;
    if (kind === "species") return <SpeciesInstrument />;
    if (kind === "reveal" || kind === "adaptation" || kind === "flows") return <CultureInstrument kind={kind} />;
    if (kind === "settlement") return <SettlementInstrument />;
    if (kind === "memory") return <MemoryInstrument />;
    if (kind === "print" || kind === "grid" || kind === "network") return <SequentialInstrument kind={kind} />;
    if (kind === "measure") return <MeasurementInstrument />;
    if (kind === "energy") return <EnergyInstrument />;
    if (kind === "logic") return <LogicInstrument />;
    if (kind === "model") return <TinyModelInstrument />;
    return <GenericInstrument chapter={chapter} />;
  }, [chapter, kind]);
  return component;
}
