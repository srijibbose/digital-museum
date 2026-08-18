"use client";

import { useId, useMemo, useState, type ReactNode } from "react";
import type { BecomingHumanEpisode, EvidenceStatus } from "@/content/becoming-human-story";
import styles from "./story-instrument.module.css";

export interface StoryInstrumentProps {
  episode: BecomingHumanEpisode;
  className?: string;
}

interface Choice {
  id: string;
  label: string;
}

const evidenceLabels: Record<EvidenceStatus, string> = {
  direct: "DIRECT TRACE",
  "strong-inference": "STRONG INFERENCE",
  contested: "ACTIVE DEBATE",
  "interpretive-model": "INTERPRETIVE MODEL",
};

function joinClasses(...values: Array<string | undefined | false>) {
  return values.filter(Boolean).join(" ");
}

function ChoiceRail({
  label,
  items,
  value,
  onChange,
}: {
  label: string;
  items: readonly Choice[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div aria-label={label} className={styles.choiceRail} role="group">
      {items.map((item, index) => (
        <button
          aria-pressed={item.id === value}
          key={item.id}
          onClick={() => onChange(item.id)}
          type="button"
        >
          <span>{String(index + 1).padStart(2, "0")}</span>
          {item.label}
        </button>
      ))}
    </div>
  );
}

function InstrumentFrame({
  episode,
  instruction,
  status,
  children,
  className,
}: {
  episode: BecomingHumanEpisode;
  instruction: string;
  status: string;
  children: ReactNode;
  className?: string;
}) {
  const titleId = useId();
  return (
    <section
      aria-labelledby={titleId}
      className={joinClasses(styles.instrument, className)}
      data-story-instrument={episode.id}
    >
      <header className={styles.instrumentHeader}>
        <div className={styles.instrumentTopline}>
          <span>INTERPRETIVE INSTRUMENT</span>
          <span>NO SCORE · CHANGE YOUR VIEW</span>
        </div>
        <h3 id={titleId}>{instruction}</h3>
      </header>
      <div className={styles.instrumentBody}>{children}</div>
      <p aria-live="polite" className={styles.liveReadout}>{status}</p>
      <footer className={styles.evidenceBoundary}>
        <span>{evidenceLabels[episode.evidence.status]}</span>
        <p>{episode.evidence.uncertainty}</p>
      </footer>
    </section>
  );
}

function BranchInstrument({ episode }: { episode: BecomingHumanEpisode }) {
  const [view, setView] = useState("ladder");
  const status = view === "ladder"
    ? "The familiar march ranks bodies along one line. It hides living cousins, extinct branches, overlap and uncertainty."
    : "Every living species sits at a tip. Humans and chimpanzees share ancestral populations; neither descended from the other.";

  return (
    <InstrumentFrame
      episode={episode}
      instruction="Replace the ladder with the family tree"
      status={status}
    >
      <ChoiceRail
        items={[
          { id: "ladder", label: "THE MISLEADING LADDER" },
          { id: "branches", label: "THE BRANCHING MODEL" },
        ]}
        label="Choose an evolutionary model"
        onChange={setView}
        value={view}
      />
      <div className={styles.branchViewport}>
        <svg
          aria-hidden="true"
          className={styles.branchSvg}
          data-view={view}
          viewBox="0 0 760 300"
        >
          <g className={styles.ladderModel}>
            <path d="M78 240 L690 62" />
            {[0, 1, 2, 3, 4].map((index) => (
              <g key={index} transform={"translate(" + (112 + index * 130) + " " + (222 - index * 38) + ")"}>
                <path d="M0 18 C-9 3 -7 -18 3 -28 C13 -19 17 1 9 18 M4 18 L4 54 M4 31 L-16 48 M4 31 L25 43 M4 54 L-12 78 M4 54 L20 78" />
              </g>
            ))}
            <path className={styles.correctionStroke} d="M92 52 L680 254 M680 52 L92 254" />
            <text x="382" y="282">RANK IS NOT AN EVOLUTIONARY MECHANISM</text>
          </g>
          <g className={styles.treeModel}>
            <path className={styles.treeTrunk} d="M90 260 C146 235 157 205 204 194 C270 178 266 140 320 129 C382 116 389 79 445 70" />
            <path d="M203 194 C194 151 166 129 125 113" />
            <path d="M320 129 C301 90 267 70 229 48" />
            <path d="M445 70 C493 65 540 83 579 111" />
            <path d="M445 70 C505 49 571 40 646 48" />
            <path className={styles.extinctBranch} d="M268 158 C326 180 358 216 374 257" />
            <path className={styles.extinctBranch} d="M159 220 C223 239 257 255 281 275" />
            <circle cx="90" cy="260" r="7" />
            <circle cx="125" cy="113" r="7" />
            <circle cx="229" cy="48" r="7" />
            <circle cx="579" cy="111" r="7" />
            <circle cx="646" cy="48" r="7" />
            <text x="54" y="286">PAST POPULATIONS</text>
            <text x="90" y="92">GORILLAS</text>
            <text x="194" y="26">ORANGUTANS</text>
            <text x="546" y="137">BONOBOS</text>
            <text x="614" y="27">CHIMPANZEES</text>
            <text className={styles.humanTip} x="442" y="44">HUMANS</text>
            <text className={styles.fossilLabel} x="365" y="280">EXTINCT BRANCH</text>
          </g>
        </svg>
      </div>
      <p className={styles.modelNote}>Branch lengths are explanatory, not a timescale or a claim that the common ancestor is known.</p>
    </InstrumentFrame>
  );
}

const stonePhases = [
  {
    id: "read",
    label: "READ THE CORE",
    copy: "Natural ridges and older scars constrain where a controlled fracture can begin.",
  },
  {
    id: "prepare",
    label: "PREPARE",
    copy: "A stable platform, workable stone and a practiced angle make a repeatable action possible.",
  },
  {
    id: "strike",
    label: "STRIKE",
    copy: "Force travels through the stone. A flake detaches; useful geometry is made, not guaranteed.",
  },
  {
    id: "refit",
    label: "REFIT",
    copy: "Archaeologists reverse the sequence by matching scars and detached flakes. The lesson itself did not fossilize.",
  },
] as const;

function EdgeInstrument({ episode }: { episode: BecomingHumanEpisode }) {
  const [phase, setPhase] = useState("read");
  const activeIndex = stonePhases.findIndex((item) => item.id === phase);
  const active = stonePhases[Math.max(activeIndex, 0)];

  return (
    <InstrumentFrame
      episode={episode}
      instruction="Read a technique from a broken stone"
      status={active.copy}
    >
      <ChoiceRail
        items={stonePhases}
        label="Choose a stage in the reduction sequence"
        onChange={setPhase}
        value={phase}
      />
      <div className={styles.stoneViewport}>
        <svg aria-hidden="true" className={styles.stoneSvg} data-phase={phase} viewBox="0 0 760 300">
          <defs>
            <linearGradient id="stone-surface" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#b5a78d" />
              <stop offset=".52" stopColor="#746b5c" />
              <stop offset="1" stopColor="#3e3d37" />
            </linearGradient>
          </defs>
          <path className={styles.stoneShadow} d="M154 246 C265 222 506 222 625 250 C519 281 253 281 154 246Z" />
          <path className={styles.coreStone} d="M232 220 C185 171 203 95 278 63 C360 28 486 57 533 126 C559 165 536 225 474 248 C390 278 286 263 232 220Z" />
          <path className={styles.coreScar} d="M307 73 C329 126 323 181 278 229 M405 61 C382 115 393 174 465 239 M511 113 C452 131 406 163 383 252" />
          <path className={styles.platform} d="M309 70 C339 58 382 56 408 62" />
          <path className={styles.hammerArc} d="M360 12 C349 33 344 48 349 64" />
          <path className={styles.flake} d="M350 68 C378 83 408 114 423 150 C395 165 363 159 338 141 C330 112 336 87 350 68Z" />
          <path className={styles.refitLine} d="M350 68 C378 83 408 114 423 150" />
          <text x="72" y="50">PLATFORM</text>
          <path className={styles.callout} d="M152 54 L303 69" />
          <text x="568" y="82">FLAKE</text>
          <path className={styles.callout} d="M558 87 L434 129" />
          <text className={styles.phaseNumber} x="78" y="226">0{activeIndex + 1}</text>
        </svg>
      </div>
      <p className={styles.modelNote}>This authored sequence explains fracture logic. It is not a knapping tutorial or a simulation of every raw material.</p>
    </InstrumentFrame>
  );
}

const fireClaims = [
  {
    id: "find",
    label: "FIND",
    copy: "Burned material can establish that fire occurred. It may not separate wildfire from hominin use.",
  },
  {
    id: "keep",
    label: "KEEP",
    copy: "Repeated, spatially bounded burning can support controlled use, but context and site formation still matter.",
  },
  {
    id: "make",
    label: "MAKE",
    copy: "An ignition tool beside deliberately heated sediment supports fire production more narrowly than burned soil alone.",
  },
] as const;

function FireInstrument({ episode }: { episode: BecomingHumanEpisode }) {
  const [claim, setClaim] = useState("find");
  const index = fireClaims.findIndex((item) => item.id === claim);
  const active = fireClaims[Math.max(index, 0)];

  return (
    <InstrumentFrame
      episode={episode}
      instruction="Ask only what the burn can prove"
      status={active.copy}
    >
      <ChoiceRail
        items={fireClaims}
        label="Choose a claim about early fire"
        onChange={setClaim}
        value={claim}
      />
      <div className={styles.fireViewport} data-claim={claim}>
        <div aria-hidden="true" className={styles.fireStrata}>
          <span className={styles.stratumAsh}>ASH + HEATED SEDIMENT</span>
          <span className={styles.stratumHearth}>REPEATED HEARTH</span>
          <span className={styles.stratumIgnition}>IGNITION MATERIAL</span>
        </div>
        <div aria-hidden="true" className={styles.flame}>
          <i />
          <i />
          <i />
        </div>
        <div className={styles.claimScale}>
          {fireClaims.map((item, itemIndex) => (
            <span className={itemIndex <= index ? styles.claimReached : undefined} key={item.id}>
              {item.label}
            </span>
          ))}
        </div>
      </div>
      <p className={styles.modelNote}>The three histories can overlap at one site. They do not collapse into a single date when people “mastered” fire.</p>
    </InstrumentFrame>
  );
}

const routeMoments = [
  {
    id: "early",
    label: "120–90 KA",
    copy: "Early movements beyond Africa are preserved at scattered sites. Some populations may not have contributed substantially to later people.",
  },
  {
    id: "middle",
    label: "70–50 KA",
    copy: "Genomes, sites and changing climates support repeated dispersals through several corridors, not a single departure line.",
  },
  {
    id: "late",
    label: "50–45 KA",
    copy: "Evidence broadens across Eurasia and Sahul. Arrival dates remain ranges because coastlines shifted and sites are incomplete.",
  },
] as const;

function RoutesInstrument({ episode }: { episode: BecomingHumanEpisode }) {
  const [moment, setMoment] = useState("middle");
  const index = routeMoments.findIndex((item) => item.id === moment);
  const active = routeMoments[Math.max(index, 0)];

  return (
    <InstrumentFrame
      episode={episode}
      instruction="Trade the single arrow for uncertain corridors"
      status={active.copy}
    >
      <ChoiceRail
        items={routeMoments}
        label="Choose a dispersal evidence window"
        onChange={setMoment}
        value={moment}
      />
      <div className={styles.routesViewport}>
        <svg aria-hidden="true" className={styles.routesSvg} data-moment={moment} viewBox="0 0 800 330">
          <path className={styles.landMass} d="M82 63 C143 33 227 34 269 61 C301 80 313 116 342 126 C366 135 389 116 407 91 C429 59 463 43 521 39 C609 32 709 61 743 104 C761 129 740 157 698 166 C649 176 617 191 596 225 C570 269 525 282 486 258 C452 237 450 194 412 185 C374 177 351 207 334 244 C310 294 257 307 219 275 C186 247 203 207 177 188 C153 171 108 178 73 153 C43 132 48 84 82 63Z" />
          <path className={styles.africaMass} d="M295 125 C342 109 396 128 414 168 C432 207 405 273 365 309 C337 299 318 270 312 235 C305 203 272 174 274 151 C276 140 284 131 295 125Z" />
          <path className={styles.sahulMass} d="M682 242 C713 226 751 237 766 264 C746 291 704 304 674 283 C663 267 666 251 682 242Z" />
          <circle className={styles.originPulse} cx="358" cy="208" r="8" />
          <path className={joinClasses(styles.routeCorridor, styles.routeEarly)} d="M359 207 C371 175 393 146 427 126 C454 111 475 98 494 77" />
          <path className={joinClasses(styles.routeCorridor, styles.routeMiddle)} d="M359 207 C387 188 405 156 440 145 C492 130 522 112 566 91 C604 73 641 80 684 105" />
          <path className={joinClasses(styles.routeCorridor, styles.routeMiddle)} d="M359 207 C400 212 423 190 460 188 C510 184 556 196 602 220" />
          <path className={joinClasses(styles.routeCorridor, styles.routeLate)} d="M602 220 C631 234 650 251 681 263 C708 273 728 270 747 263" />
          <path className={joinClasses(styles.routeCorridor, styles.routeLate)} d="M563 91 C609 81 660 67 710 74" />
          <g className={styles.mapSites}>
            <circle cx="358" cy="208" r="4" />
            <circle cx="425" cy="127" r="4" />
            <circle cx="494" cy="77" r="4" />
            <circle cx="563" cy="92" r="4" />
            <circle cx="602" cy="220" r="4" />
            <circle cx="709" cy="74" r="4" />
            <circle cx="746" cy="263" r="4" />
          </g>
          <text x="323" y="229">AFRICA</text>
          <text x="493" y="56">EURASIA</text>
          <text x="685" y="319">SAHUL</text>
        </svg>
      </div>
      <p className={styles.modelNote}>Corridor width represents uncertainty, not population size. The map omits many movements within Africa and later returns.</p>
    </InstrumentFrame>
  );
}

const householdSeasons = [
  {
    id: "rains",
    label: "EARLY RAINS",
    river: 74,
    store: 22,
    copy: "Roofs, fields and paths need repair together. A fixed house concentrates labor as well as shelter.",
  },
  {
    id: "flood",
    label: "HIGH WATER",
    river: 88,
    store: 44,
    copy: "Water renews soil and connects travel, while crowding, waste and vectors can intensify disease risk.",
  },
  {
    id: "harvest",
    label: "HARVEST",
    river: 56,
    store: 92,
    copy: "Stored food buffers future scarcity, but guarding, counting and deciding access can deepen power differences.",
  },
  {
    id: "lean",
    label: "LEAN SEASON",
    river: 31,
    store: 48,
    copy: "The household depends on stores, exchange and care. Settlement trades some mobility for durable coordination.",
  },
] as const;

function HouseholdInstrument({ episode }: { episode: BecomingHumanEpisode }) {
  const [seasonId, setSeasonId] = useState("rains");
  const season = householdSeasons.find((item) => item.id === seasonId) ?? householdSeasons[0];

  return (
    <InstrumentFrame
      episode={episode}
      instruction="Follow one household through an uneven year"
      status={season.copy}
    >
      <ChoiceRail
        items={householdSeasons}
        label="Choose a season in the composite household"
        onChange={setSeasonId}
        value={seasonId}
      />
      <div className={styles.householdViewport}>
        <svg aria-hidden="true" className={styles.householdSvg} data-season={seasonId} viewBox="0 0 800 330">
          <defs>
            <pattern height="9" id="thatch" patternUnits="userSpaceOnUse" width="14">
              <path d="M0 9 L7 0 L14 9" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <path className={styles.householdGround} d="M0 248 C173 226 286 248 410 245 C566 242 674 210 800 218 L800 330 L0 330Z" />
          <path
            className={styles.householdRiver}
            d={"M0 " + (330 - season.river) + " C170 " + (299 - season.river / 3) + " 311 " + (322 - season.river) + " 489 " + (291 - season.river / 2) + " C603 " + (273 - season.river / 3) + " 702 " + (292 - season.river / 2) + " 800 " + (264 - season.river / 2) + " L800 330 L0 330Z"}
          />
          <path className={styles.houseRoof} d="M197 126 L335 65 L464 126 Z" />
          <path className={styles.houseFrame} d="M224 126 L224 247 M439 126 L439 247 M224 126 L439 126 M281 126 L281 247 M382 126 L382 247" />
          <path className={styles.storageJar} d="M313 159 C294 176 297 225 314 237 C331 246 350 237 353 216 C355 190 350 166 337 158Z" />
          <path
            className={styles.storageFill}
            d={"M306 " + (236 - season.store * 0.62) + " C319 " + (230 - season.store * 0.55) + " 340 " + (230 - season.store * 0.55) + " 352 " + (236 - season.store * 0.62) + " L350 231 C336 242 321 243 309 233Z"}
          />
          <g className={styles.householdPeople}>
            <path d="M515 203 C509 187 511 169 522 158 C534 166 537 187 529 203 L529 243 L515 243Z M519 207 L497 229 M526 207 L550 224" />
            <path d="M580 219 C576 207 578 194 587 187 C596 194 598 207 592 219 L592 246 L580 246Z M583 222 L568 237 M590 222 L608 236" />
          </g>
          <text x="203" y="50">SHELTER</text>
          <text x="291" y="278">STORE</text>
          <text x="557" y="279">CARE + LABOR</text>
        </svg>
        <div className={styles.householdMeters} aria-hidden="true">
          <span><i style={{ width: season.store + "%" }} />STORED FOOD</span>
          <span><i style={{ width: season.river + "%" }} />RIVER LEVEL</span>
        </div>
      </div>
      <p className={styles.modelNote}>This is an evidence-based composite, not one invented family or a universal path from mobile life to villages.</p>
    </InstrumentFrame>
  );
}

const encounterViews = [
  {
    id: "shore",
    label: "FROM THE SHORE",
    copy: "For Indigenous communities, unfamiliar sails approached already inhabited political worlds. The model cannot recover one shared response.",
  },
  {
    id: "ship",
    label: "FROM THE SHIP",
    copy: "European crews reached lands new to them, not unknown lands. Arrival opened sustained invasion, extraction and epidemic disruption.",
  },
  {
    id: "captivity",
    label: "THROUGH CAPTIVITY",
    copy: "Enslavement and forced movement joined Atlantic routes to expanding systems of coercion. “Exchange” cannot make that power equal.",
  },
  {
    id: "continuity",
    label: "THROUGH CONTINUITY",
    copy: "Indigenous nations and descendant communities remain. Survival, resistance and adaptation continue beyond the 1492 hinge.",
  },
] as const;

function EncounterInstrument({ episode }: { episode: BecomingHumanEpisode }) {
  const [perspective, setPerspective] = useState("shore");
  const active = encounterViews.find((item) => item.id === perspective) ?? encounterViews[0];

  return (
    <InstrumentFrame
      episode={episode}
      instruction="Turn one horizon through unequal positions"
      status={active.copy}
    >
      <ChoiceRail
        items={encounterViews}
        label="Choose a historical position"
        onChange={setPerspective}
        value={perspective}
      />
      <div className={styles.encounterViewport} data-perspective={perspective}>
        <svg aria-hidden="true" className={styles.encounterSvg} viewBox="0 0 800 330">
          <path className={styles.encounterSky} d="M0 0 H800 V212 C649 195 527 215 398 208 C254 201 126 177 0 204Z" />
          <path className={styles.encounterWater} d="M0 187 C155 173 273 215 415 204 C568 191 668 176 800 199 V330 H0Z" />
          <path className={styles.encounterShore} d="M0 234 C125 216 247 222 344 252 C263 276 137 295 0 289Z" />
          <g className={styles.encounterShip}>
            <path d="M520 206 C557 217 616 217 657 201 C647 232 620 245 578 241 C552 238 531 226 520 206Z" />
            <path d="M584 109 L584 210 M589 119 C628 134 644 158 643 185 L592 184Z M579 132 C555 145 544 165 547 187 L577 185Z" />
          </g>
          <g className={styles.encounterSettlement}>
            <path d="M92 224 L129 190 L164 224 M105 224 V261 M150 224 V260" />
            <path d="M186 235 L213 205 L241 235 M194 235 V267 M232 235 V267" />
            <path d="M59 255 C53 241 55 223 65 214 C75 224 77 241 70 255 V277 H59Z" />
          </g>
          <path className={styles.routeWake} d="M576 247 C489 267 416 273 330 259 C246 246 197 239 151 243" />
          <g className={styles.focusMarks}>
            <circle className={styles.focusShore} cx="145" cy="237" r="54" />
            <circle className={styles.focusShip} cx="588" cy="191" r="62" />
            <path className={styles.focusCaptivity} d="M542 279 C466 294 376 292 300 274" />
            <path className={styles.focusContinuity} d="M57 288 C111 266 176 269 237 290" />
          </g>
          <text className={styles.shoreLabel} x="77" y="316">INHABITED WORLDS</text>
          <text className={styles.shipLabel} x="566" y="74">ARRIVAL</text>
        </svg>
      </div>
      <p className={styles.modelNote}>This changes the analytic position, not the documented facts. It does not invent the thoughts of an unnamed person.</p>
    </InstrumentFrame>
  );
}

function EnergyInstrument({ episode }: { episode: BecomingHumanEpisode }) {
  const [load, setLoad] = useState(58);
  const [wholeSystem, setWholeSystem] = useState(false);
  const outputLabel = load < 36 ? "LOWER DEMAND" : load < 72 ? "RISING DEMAND" : "HIGH DEMAND";
  const status = wholeSystem
    ? "The piston now includes its boundary: fuel, mined material, finance, labor, land, maintenance and exhaust."
    : "The moving piston looks self-contained only while its inputs and burdens remain outside the frame.";

  return (
    <InstrumentFrame
      episode={episode}
      instruction="Widen the boundary around the machine"
      status={status}
    >
      <div className={styles.energyControls}>
        <label className={styles.rangeControl}>
          <span>MECHANICAL OUTPUT <output>{outputLabel}</output></span>
          <input
            aria-valuetext={outputLabel}
            max="100"
            min="18"
            onChange={(event) => setLoad(Number(event.target.value))}
            type="range"
            value={load}
          />
        </label>
        <button
          aria-pressed={wholeSystem}
          className={styles.boundaryButton}
          onClick={() => setWholeSystem((current) => !current)}
          type="button"
        >
          {wholeSystem ? "NARROW TO THE PISTON" : "REVEAL THE WHOLE SYSTEM"}
        </button>
      </div>
      <div className={styles.energyViewport} data-expanded={wholeSystem}>
        <svg aria-hidden="true" className={styles.energySvg} viewBox="0 0 800 330">
          <path className={styles.energyFlow} d="M70 171 C137 171 166 171 216 171" strokeWidth={7 + load * 0.07} />
          <path className={styles.energyFlow} d="M355 171 C412 171 447 171 500 171" strokeWidth={7 + load * 0.07} />
          <path className={styles.energyFlow} d="M634 171 C682 171 719 171 765 171" strokeWidth={7 + load * 0.07} />
          <path className={styles.energyCoal} d="M60 196 L95 116 L158 115 L190 196Z" />
          <path className={styles.energyBoiler} d="M214 100 H356 V233 H214Z M247 70 H323 V100 H247Z" />
          <path className={styles.energyPiston} d="M500 116 H635 V226 H500Z M521 144 H586 V198 H521Z M586 171 H686" />
          <circle className={styles.energyWheel} cx="703" cy="171" r={40 + load * 0.08} />
          <path className={styles.energyWheelSpokes} d="M703 124 V218 M656 171 H750 M670 138 L736 204 M736 138 L670 204" />
          <g className={styles.systemBoundary}>
            <path d="M126 109 C116 75 129 49 151 29" />
            <path d="M284 237 C276 270 251 292 214 306" />
            <path d="M545 106 C531 73 506 52 469 36" />
            <path d="M610 229 C638 259 663 281 699 305" />
            <text x="116" y="24">MINED FUEL</text>
            <text x="121" y="322">LABOR + CAPITAL</text>
            <text x="392" y="31">MATERIAL + LAND</text>
            <text x="641" y="322">EXHAUST + HEAT</text>
          </g>
          <text x="58" y="226">COAL</text>
          <text x="245" y="259">STEAM</text>
          <text x="527" y="253">MOTION</text>
          <text x="678" y="245">OUTPUT</text>
        </svg>
      </div>
      <p className={styles.modelNote}>Flow thickness is qualitative. This is a systems boundary exercise, not a historical energy calculation.</p>
    </InstrumentFrame>
  );
}

const networkHops = [
  { id: "device", label: "DEVICE", copy: "The message begins as signals in a physical device." },
  { id: "local", label: "LOCAL LINK", copy: "Radio spectrum or cable reaches local network equipment." },
  { id: "router", label: "ROUTER", copy: "Packets are forwarded; they do not carry one guaranteed route." },
  { id: "fiber", label: "LONG-HAUL FIBER", copy: "Light crosses buried or submarine cable maintained by people and institutions." },
  { id: "centre", label: "DATA CENTRE", copy: "Power, cooling, servers and operators make the abstract service material." },
  { id: "server", label: "SERVER", copy: "A response begins its own routed return. The Web rides on the Internet; they are not the same layer." },
] as const;

function NetworkInstrument({ episode }: { episode: BecomingHumanEpisode }) {
  const [hop, setHop] = useState(0);
  const active = networkHops[hop];
  const progress = (hop / (networkHops.length - 1)) * 100;

  return (
    <InstrumentFrame
      episode={episode}
      instruction="Follow one message through the ground"
      status={active.copy}
    >
      <ol aria-label="Representative network route" className={styles.networkSteps}>
        {networkHops.map((item, index) => (
          <li key={item.id}>
            <button
              aria-current={index === hop ? "step" : undefined}
              onClick={() => setHop(index)}
              type="button"
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {item.label}
            </button>
          </li>
        ))}
      </ol>
      <div className={styles.networkViewport}>
        <svg aria-hidden="true" className={styles.networkSvg} viewBox="0 0 800 280">
          <path className={styles.networkGround} d="M0 188 C139 161 257 212 391 184 C521 157 629 199 800 164 V280 H0Z" />
          <path className={styles.networkRouteGhost} d="M64 135 C151 98 198 193 282 164 C369 134 400 70 484 97 C573 126 611 202 716 141" pathLength="100" />
          <path
            className={styles.networkRouteLive}
            d="M64 135 C151 98 198 193 282 164 C369 134 400 70 484 97 C573 126 611 202 716 141"
            pathLength="100"
            style={{ strokeDasharray: progress + " 100" }}
          />
          {[
            [64, 135],
            [188, 153],
            [282, 164],
            [424, 92],
            [590, 150],
            [716, 141],
          ].map(([x, y], index) => (
            <g className={joinClasses(styles.networkNode, index === hop && styles.networkNodeActive, index < hop && styles.networkNodeDone)} key={networkHops[index].id}>
              <circle cx={x} cy={y} r="16" />
              <circle cx={x} cy={y} r="4" />
            </g>
          ))}
          <path className={styles.subseaMarks} d="M347 189 C390 204 446 206 493 190 M367 210 C410 222 446 223 474 213" />
          <text x="45" y="82">LOCAL</text>
          <text x="347" y="56">LONG HAUL</text>
          <text x="661" y="94">REMOTE</text>
        </svg>
        <div className={styles.networkActions}>
          <button
            disabled={hop === 0}
            onClick={() => setHop((current) => Math.max(0, current - 1))}
            type="button"
          >
            PREVIOUS LAYER
          </button>
          <button
            onClick={() => setHop((current) => current === networkHops.length - 1 ? 0 : current + 1)}
            type="button"
          >
            {hop === networkHops.length - 1 ? "TRACE AGAIN" : "NEXT PHYSICAL LAYER"}
          </button>
        </div>
      </div>
      <p className={styles.modelNote}>The route is representative. Real packets can split, reroute and cross infrastructure with different owners.</p>
    </InstrumentFrame>
  );
}

const phoneLayers = [
  { id: "interface", label: "TOUCH + INTERFACE", copy: "Capacitive touch and interface conventions predate any one product." },
  { id: "software", label: "SOFTWARE", copy: "Operating systems, applications and standards turn components into a platform." },
  { id: "chips", label: "CHIPS", copy: "Semiconductor research and fabrication compress immense technical systems into the hand." },
  { id: "battery", label: "BATTERY", copy: "Portable energy storage constrains weight, heat, lifespan and repair." },
  { id: "network", label: "NETWORKS", copy: "Cellular, Wi-Fi and Internet infrastructure make the pocket computer connected." },
  { id: "position", label: "POSITIONING", copy: "Satellite and terrestrial systems make location services possible." },
  { id: "material", label: "MINERALS + LABOR", copy: "Extraction, manufacturing, assembly and logistics remain inside the polished object." },
] as const;

function PhoneInstrument({ episode }: { episode: BecomingHumanEpisode }) {
  const [removed, setRemoved] = useState<Set<string>>(new Set());
  const removedLayers = phoneLayers.filter((layer) => removed.has(layer.id));
  const status = removedLayers.length === 0
    ? "The object looks singular. Remove any dependency to reveal the stack its launch depended on."
    : removedLayers.length === 1
      ? removedLayers[0].copy
      : removedLayers.length + " dependencies are absent. The icon remains, but the functioning system does not.";

  function toggleLayer(id: string) {
    setRemoved((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <InstrumentFrame
      episode={episode}
      instruction="Take the famous object apart"
      status={status}
    >
      <div className={styles.phoneLayout}>
        <div aria-label="Phone system dependencies" className={styles.phoneLayers} role="group">
          {phoneLayers.map((layer, index) => {
            const present = !removed.has(layer.id);
            return (
              <button
                aria-label={layer.label + " — " + (present ? "connected" : "removed")}
                aria-pressed={present}
                key={layer.id}
                onClick={() => toggleLayer(layer.id)}
                type="button"
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                {layer.label}
                <i aria-hidden="true">{present ? "CONNECTED" : "REMOVED"}</i>
              </button>
            );
          })}
        </div>
        <div className={styles.phoneViewport} data-operational={removed.size === 0}>
          <svg aria-hidden="true" className={styles.phoneSvg} viewBox="0 0 400 520">
            <path className={styles.phoneShell} d="M104 25 C77 25 61 47 61 75 V444 C61 477 79 496 110 496 H290 C321 496 339 477 339 444 V75 C339 47 323 25 296 25Z" />
            <path className={joinClasses(styles.phonePlane, removed.has("interface") && styles.phonePlaneMissing)} d="M91 75 H309 V424 H91Z" />
            <path className={joinClasses(styles.phoneCircuit, removed.has("software") && styles.phonePlaneMissing)} d="M116 118 H281 M116 151 H250 M116 184 H292" />
            <path className={joinClasses(styles.phoneChip, removed.has("chips") && styles.phonePlaneMissing)} d="M129 225 H271 V325 H129Z M151 247 H249 V303 H151Z" />
            <path className={joinClasses(styles.phoneBattery, removed.has("battery") && styles.phonePlaneMissing)} d="M120 349 H280 V399 H120Z" />
            <path className={joinClasses(styles.phoneSignal, removed.has("network") && styles.phonePlaneMissing)} d="M109 59 C151 16 249 16 291 59 M132 63 C167 36 233 36 268 63" />
            <path className={joinClasses(styles.phonePosition, removed.has("position") && styles.phonePlaneMissing)} d="M307 7 L322 41 L360 47 L331 73 L339 111 L307 91 L274 111 L283 73 L254 47 L292 41Z" />
            <path className={joinClasses(styles.phoneMaterial, removed.has("material") && styles.phonePlaneMissing)} d="M76 459 C117 441 151 466 199 454 C242 443 276 461 327 445" />
            <circle cx="200" cy="460" r="13" />
          </svg>
          {removed.size > 0 && <span className={styles.phoneOffline}>STACK INCOMPLETE</span>}
        </div>
      </div>
      <button
        className={styles.restoreButton}
        disabled={removed.size === 0}
        onClick={() => setRemoved(new Set())}
        type="button"
      >
        RESTORE THE FULL STACK
      </button>
      <p className={styles.modelNote}>The 2007 iPhone is a convergence point in a longer mobile-computing history—not the invention of every layer shown.</p>
    </InstrumentFrame>
  );
}

const fixedClassA = [18, 29];
const fixedClassB = [61, 76, 88];
const testExamples = [
  { x: 33, group: "a" },
  { x: 45, group: "b" },
  { x: 49, group: "a" },
  { x: 57, group: "b" },
  { x: 81, group: "b" },
] as const;

function ModelInstrument({ episode }: { episode: BecomingHumanEpisode }) {
  const [movingExample, setMovingExample] = useState(37);
  const classAMean = (fixedClassA.reduce((sum, value) => sum + value, 0) + movingExample) / 3;
  const classBMean = fixedClassB.reduce((sum, value) => sum + value, 0) / fixedClassB.length;
  const boundary = Math.round((classAMean + classBMean) / 2);
  const errors = testExamples.filter((example) => {
    const predicted = example.x < boundary ? "a" : "b";
    return predicted !== example.group;
  }).length;
  const status = "The learned boundary now sits at " + boundary + ". " + errors + " of five held-out examples fall on the wrong side.";
  const trainingPoints = useMemo(
    () => [
      ...fixedClassA.map((x, index) => ({ x, y: 84 + index * 30, group: "a", id: "a" + index })),
      { x: movingExample, y: 148, group: "a", id: "moving" },
      ...fixedClassB.map((x, index) => ({ x, y: 88 + index * 32, group: "b", id: "b" + index })),
    ],
    [movingExample],
  );

  return (
    <InstrumentFrame
      episode={episode}
      instruction="Change the examples; watch the rule move"
      status={status}
    >
      <label className={styles.rangeControl}>
        <span>MOVE ONE GROUP A EXAMPLE <output>FEATURE {movingExample}</output></span>
        <input
          aria-valuetext={"feature value " + movingExample}
          max="58"
          min="12"
          onChange={(event) => setMovingExample(Number(event.target.value))}
          type="range"
          value={movingExample}
        />
      </label>
      <div className={styles.modelViewport}>
        <svg aria-hidden="true" className={styles.modelSvg} viewBox="0 0 800 310">
          <rect className={styles.modelRegionA} height="230" width={boundary * 7} x="50" y="35" />
          <rect className={styles.modelRegionB} height="230" width={(100 - boundary) * 7} x={50 + boundary * 7} y="35" />
          <path className={styles.modelAxis} d="M50 265 H750" />
          <path className={styles.modelBoundary} d={"M" + (50 + boundary * 7) + " 31 V270"} />
          <text className={styles.modelBoundaryLabel} x={50 + boundary * 7 + 7} y="54">LEARNED BOUNDARY</text>
          {trainingPoints.map((point) => point.group === "a" ? (
            <circle
              className={joinClasses(styles.trainingPoint, point.id === "moving" && styles.movingPoint)}
              cx={50 + point.x * 7}
              cy={point.y}
              key={point.id}
              r="10"
            />
          ) : (
            <path
              className={styles.trainingPointB}
              d={"M" + (50 + point.x * 7) + " " + (point.y - 11) + " l11 20 h-22Z"}
              key={point.id}
            />
          ))}
          {testExamples.map((point, index) => {
            const wrong = (point.x < boundary ? "a" : "b") !== point.group;
            return (
              <g className={joinClasses(styles.testPoint, wrong && styles.testPointWrong)} key={point.x + "-" + point.group}>
                <circle cx={50 + point.x * 7} cy={237} r="6" />
                {wrong && <path d={"M" + (45 + point.x * 7) + " 232 l10 10 M" + (55 + point.x * 7) + " 232 l-10 10"} />}
                <text x={44 + point.x * 7} y={292}>{index + 1}</text>
              </g>
            );
          })}
          <text x="51" y="20">TRAINING EXAMPLES</text>
          <text x="610" y="292">HELD-OUT EXAMPLES</text>
        </svg>
        <div className={styles.modelLegend}>
          <span><i className={styles.legendCircle} />GROUP A</span>
          <span><i className={styles.legendTriangle} />GROUP B</span>
          <span><i className={styles.legendCross} />MISMATCH</span>
        </div>
      </div>
      <p className={styles.modelNote}>One numeric feature, two labels, deterministic arithmetic. This transparent teaching model is not a miniature generative AI system.</p>
    </InstrumentFrame>
  );
}

const evidenceLenses = [
  { id: "trace", label: "WHAT SURVIVES" },
  { id: "inference", label: "WHAT IT SUPPORTS" },
  { id: "limit", label: "WHERE IT STOPS" },
] as const;

function GenericEvidenceInstrument({ episode }: { episode: BecomingHumanEpisode }) {
  const [lens, setLens] = useState("trace");
  const status = lens === "trace"
    ? episode.evidence.object
    : lens === "inference"
      ? episode.capability
      : episode.evidence.uncertainty;

  return (
    <InstrumentFrame
      episode={episode}
      instruction={episode.interaction.config.prompt}
      status={status}
    >
      <ChoiceRail
        items={evidenceLenses}
        label="Choose an evidence lens"
        onChange={setLens}
        value={lens}
      />
      <div className={styles.genericViewport} data-lens={lens}>
        <svg aria-hidden="true" className={styles.genericSvg} viewBox="0 0 760 260">
          <path className={styles.genericTrace} d="M89 176 C151 98 237 68 337 111 C417 146 468 110 539 73 C597 43 657 66 695 123" />
          <path className={styles.genericInference} d="M89 176 C177 180 241 191 329 163 C423 133 490 133 566 157 C614 173 660 158 695 123" />
          <path className={styles.genericLimit} d="M89 176 C192 146 237 226 338 196 C427 169 507 215 578 183 C632 159 659 139 695 123" />
          <circle cx="89" cy="176" r="8" />
          <circle cx="695" cy="123" r="8" />
          <path className={styles.genericLens} d="M309 63 C359 20 437 33 469 87 C497 136 478 202 427 226 C377 250 315 225 291 174 C272 134 280 91 309 63Z" />
          <text x="55" y="215">OBJECT</text>
          <text x="636" y="102">CLAIM</text>
          <text className={styles.genericLensLabel} x="341" y="136">{lens.toUpperCase()}</text>
        </svg>
      </div>
      <p className={styles.optionTape}>{episode.interaction.config.options.join(" · ")}</p>
      <p className={styles.modelNote}>
        Sources: {episode.sources.slice(0, 2).map((source, index) => (
          <span key={source.url}>{index > 0 ? " · " : ""}<a href={source.url} rel="noreferrer" target="_blank">{source.label}</a></span>
        ))}
      </p>
    </InstrumentFrame>
  );
}

export function StoryInstrument({ episode, className }: StoryInstrumentProps) {
  const instrument = (() => {
    if (episode.id === "shared-branch") return <BranchInstrument episode={episode} />;
    if (episode.id === "repeatable-edge") return <EdgeInstrument episode={episode} />;
    if (episode.id === "three-histories-fire") return <FireInstrument episode={episode} />;
    if (episode.id === "many-routes" || episode.id === "many-departures") return <RoutesInstrument episode={episode} />;
    if (episode.id === "river-household") return <HouseholdInstrument episode={episode} />;
    if (episode.id === "shore-two-sides") return <EncounterInstrument episode={episode} />;
    if (episode.id === "fossil-energy") return <EnergyInstrument episode={episode} />;
    if (episode.id === "planetary-machine") return <NetworkInstrument episode={episode} />;
    if (episode.id === "computer-enters-hand") return <PhoneInstrument episode={episode} />;
    if (episode.id === "learned-patterns") return <ModelInstrument episode={episode} />;
    return <GenericEvidenceInstrument episode={episode} />;
  })();

  return <div className={joinClasses(styles.instrumentHost, className)}>{instrument}</div>;
}
