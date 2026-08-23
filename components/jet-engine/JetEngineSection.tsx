"use client";

import type { CSSProperties } from "react";
import { jetEngine } from "@/content/jet-engine";
import type { JetCycleResult } from "@/lib/jet-engine/jet-engine-model";
import type { JetStationId, JetViewId } from "@/lib/jet-engine/jet-engine-schema";
import styles from "./jet-engine.module.css";

const compressorStages = [390, 414, 439, 465, 492, 519];
const turbineStages = [752, 785, 820, 856];
const caseFasteners = [348, 383, 418, 453, 488, 523, 558, 741, 781, 821, 861, 901];

function markerTop(id: JetStationId) {
  if (id === "f") return "15%";
  if (id === "8") return "78%";
  if (id === "0") return "67%";
  return "9%";
}

export function JetEngineSection({
  stationId,
  viewId,
  cycle,
  motionEnabled,
  onSelectStation,
}: {
  stationId: JetStationId;
  viewId: JetViewId;
  cycle: JetCycleResult;
  motionEnabled: boolean;
  onSelectStation: (id: JetStationId) => void;
}) {
  const selectedStation = jetEngine.stations.find((station) => station.id === stationId)!;
  const flowDuration = Math.max(2.2, 5.8 - cycle.profile.throttlePercent * 0.035);
  const stageStyle = {
    "--flow-duration": `${flowDuration}s`,
    "--rotor-duration": `${Math.max(1.8, flowDuration * 0.72)}s`,
  } as CSSProperties;

  return (
    <div
      className={styles.engineStage}
      data-view={viewId}
      data-motion={motionEnabled ? "running" : "paused"}
      style={stageStyle}
    >
      <svg
        className={styles.engineDrawing}
        viewBox="0 0 1200 520"
        role="img"
        aria-labelledby="engine-section-title engine-section-description"
      >
        <title id="engine-section-title">Sectional reconstruction of a high-bypass turbofan</title>
        <desc id="engine-section-description">
          Side section showing inlet, fan, bypass duct, compressors, combustor, turbines, concentric shafts,
          bypass nozzle, core nozzle, and NASA flow stations. The selected station is {selectedStation.label}.
        </desc>

        <defs>
          <linearGradient id="jet-shell" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--jet-metal-hi)" />
            <stop offset="0.55" stopColor="var(--jet-metal)" />
            <stop offset="1" stopColor="var(--jet-metal-lo)" />
          </linearGradient>
          <linearGradient id="jet-core-case" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--jet-core-case-hi)" />
            <stop offset="1" stopColor="var(--jet-core-case-lo)" />
          </linearGradient>
          <linearGradient id="jet-heat" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#8ca5ac" />
            <stop offset="0.39" stopColor="#a7a18a" />
            <stop offset="0.58" stopColor="#b76d4e" />
            <stop offset="0.73" stopColor="#8e4a3d" />
            <stop offset="1" stopColor="#8e7162" />
          </linearGradient>
          <pattern id="jet-hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
            <line x1="0" y1="0" x2="0" y2="9" stroke="var(--jet-hatch)" strokeWidth="2" />
          </pattern>
          <pattern id="jet-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--jet-grid)" strokeWidth="1" />
          </pattern>
          <clipPath id="jet-pressure-envelope">
            <path d="M44 154 C101 126 160 111 237 111 L979 111 L1132 184 L1132 336 L979 409 L237 409 C160 409 101 394 44 366 Z" />
          </clipPath>
          <marker id="jet-arrow-bypass" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,1 L7,4 L0,7" fill="none" stroke="var(--jet-bypass)" strokeWidth="1.4" />
          </marker>
          <marker id="jet-arrow-core" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,1 L7,4 L0,7" fill="none" stroke="var(--jet-core-flow)" strokeWidth="1.4" />
          </marker>
        </defs>

        <rect width="1200" height="520" fill="var(--jet-stage)" />
        <rect width="1200" height="520" fill="url(#jet-grid)" />
        <path className={styles.datum} d="M25 260 H1175" />
        <path className={styles.measureTick} d="M48 474 H1096 M48 466 V482 M1096 466 V482" />
        <text className={styles.measureText} x="572" y="495">FUNCTIONAL SECTION · NOT TO SCALE</text>

        <g className={styles.pressureField} clipPath="url(#jet-pressure-envelope)">
          {[
            { x: 30, width: 260, ratio: cycle.stations["2"].pressureRatio },
            { x: 290, width: 270, ratio: cycle.stations["3"].pressureRatio },
            { x: 560, width: 175, ratio: cycle.stations["4"].pressureRatio },
            { x: 735, width: 190, ratio: cycle.stations["5"].pressureRatio },
            { x: 925, width: 240, ratio: cycle.stations["8"].pressureRatio },
          ].map((zone) => (
            <rect
              key={zone.x}
              x={zone.x}
              y="88"
              width={zone.width}
              height="344"
              fill="var(--jet-pressure)"
              opacity={Math.min(0.76, 0.08 + Math.log10(Math.max(1, zone.ratio)) * 0.38)}
            />
          ))}
        </g>

        <g className={styles.thermalField} clipPath="url(#jet-pressure-envelope)">
          <rect x="30" y="88" width="1135" height="344" fill="url(#jet-heat)" opacity="0.65" />
        </g>

        <g className={styles.outerCase}>
          <path d="M44 154 C101 126 160 111 237 111 H937 C993 111 1042 130 1097 161 L1132 184 L1105 199 C1046 168 997 153 938 153 H270 C185 153 118 164 63 188 Z" fill="url(#jet-shell)" />
          <path d="M44 366 C101 394 160 409 237 409 H937 C993 409 1042 390 1097 359 L1132 336 L1105 321 C1046 352 997 367 938 367 H270 C185 367 118 356 63 332 Z" fill="url(#jet-shell)" />
          <path d="M44 154 C101 126 160 111 237 111 H937 C1001 111 1057 136 1132 184" />
          <path d="M44 366 C101 394 160 409 237 409 H937 C1001 409 1057 384 1132 336" />
          <path d="M44 154 C31 182 25 221 25 260 C25 299 31 338 44 366" />
          <path d="M63 188 C51 210 46 235 46 260 C46 285 51 310 63 332" />
        </g>

        <g className={styles.internalCase}>
          <path d="M292 201 C358 192 421 185 492 185 L558 199 L596 214 L686 213 L735 195 C797 182 856 183 923 199 L1044 223 L1093 238 L1093 260 H951 L899 247 H721 L674 245 H586 L548 235 H292 Z" fill="url(#jet-core-case)" />
          <path d="M292 319 C358 328 421 335 492 335 L558 321 L596 306 L686 307 L735 325 C797 338 856 337 923 321 L1044 297 L1093 282 L1093 260 H951 L899 273 H721 L674 275 H586 L548 285 H292 Z" fill="url(#jet-core-case)" />
          <path d="M292 201 C395 187 475 177 558 199 L596 214 H686 L735 195 C800 181 862 184 923 199 L1093 238" />
          <path d="M292 319 C395 333 475 343 558 321 L596 306 H686 L735 325 C800 339 862 336 923 321 L1093 282" />
        </g>

        <g className={styles.spinner}>
          <path d="M121 260 C158 221 198 209 238 213 L238 307 C198 311 158 299 121 260 Z" fill="url(#jet-shell)" />
          <path d="M121 260 H259" />
        </g>

        <g className={styles.fanAssembly}>
          <rect x="242" y="116" width="17" height="288" rx="8" fill="var(--jet-fan-dark)" />
          {[0, 1, 2, 3, 4, 5].map((index) => {
            const top = 130 + index * 21;
            return (
              <g key={index}>
                <path d={`M247 ${top} C270 ${top + 4} 286 ${top + 27} 293 ${top + 47} L265 ${top + 44} C261 ${top + 27} 254 ${top + 12} 247 ${top} Z`} />
                <path d={`M247 ${390 - index * 21} C270 ${386 - index * 21} 286 ${363 - index * 21} 293 ${343 - index * 21} L265 ${346 - index * 21} C261 ${363 - index * 21} 254 ${378 - index * 21} 247 ${390 - index * 21} Z`} />
              </g>
            );
          })}
          <circle cx="250" cy="260" r="31" fill="var(--jet-fan-hub)" />
          <circle className={styles.rotorRing} cx="250" cy="260" r="18" />
        </g>

        <g className={styles.compressorAssembly}>
          {compressorStages.map((x, index) => {
            const height = 69 - index * 5;
            return (
              <g key={x}>
                <path d={`M${x} 257 L${x + 11} ${260 - height} L${x + 20} 255 Z`} />
                <path d={`M${x} 263 L${x + 11} ${260 + height} L${x + 20} 265 Z`} />
                <path className={styles.stator} d={`M${x + 20} 255 L${x + 30} ${205 + index * 5} L${x + 36} 257 Z`} />
                <path className={styles.stator} d={`M${x + 20} 265 L${x + 30} ${315 - index * 5} L${x + 36} 263 Z`} />
              </g>
            );
          })}
        </g>

        <g className={styles.combustorAssembly}>
          <path d="M568 217 L601 228 H682 L720 208 L734 229 L690 256 H595 L557 240 Z" fill="url(#jet-hatch)" />
          <path d="M568 303 L601 292 H682 L720 312 L734 291 L690 264 H595 L557 280 Z" fill="url(#jet-hatch)" />
          <path d="M581 224 C625 237 663 237 708 218" />
          <path d="M581 296 C625 283 663 283 708 302" />
          {[600, 629, 658, 687].map((x) => <circle key={x} cx={x} cy="225" r="4" />)}
          {[600, 629, 658, 687].map((x) => <circle key={x} cx={x} cy="295" r="4" />)}
        </g>

        <g className={styles.turbineAssembly}>
          {turbineStages.map((x, index) => {
            const height = 54 + index * 8;
            return (
              <g key={x}>
                <path d={`M${x} 257 L${x + 12} ${260 - height} L${x + 22} 252 Z`} />
                <path d={`M${x} 263 L${x + 12} ${260 + height} L${x + 22} 268 Z`} />
                <path className={styles.stator} d={`M${x + 23} 252 L${x + 34} ${213 - index * 7} L${x + 40} 257 Z`} />
                <path className={styles.stator} d={`M${x + 23} 268 L${x + 34} ${307 + index * 7} L${x + 40} 263 Z`} />
              </g>
            );
          })}
        </g>

        <g className={styles.shaftAssembly}>
          <path className={styles.lowShaft} d="M233 252 H895" />
          <path className={styles.lowShaft} d="M233 268 H895" />
          <path className={styles.highShaft} d="M365 256 H815" />
          <path className={styles.highShaft} d="M365 264 H815" />
          <path d="M895 252 L951 260 L895 268 Z" fill="var(--jet-shaft-low)" />
        </g>

        <g className={styles.nozzleAssembly}>
          <path d="M923 199 L1044 223 L1136 221 L1104 238 H951 Z" fill="url(#jet-shell)" />
          <path d="M923 321 L1044 297 L1136 299 L1104 282 H951 Z" fill="url(#jet-shell)" />
          <path d="M951 247 L1093 238 L1150 260 H951 Z" fill="var(--jet-nozzle)" />
          <path d="M951 273 L1093 282 L1150 260 H951 Z" fill="var(--jet-nozzle)" />
        </g>

        <g className={styles.fasteners}>
          {caseFasteners.map((x) => <circle key={x} cx={x} cy="197" r="2.4" />)}
          {caseFasteners.map((x) => <circle key={x} cx={x} cy="323" r="2.4" />)}
        </g>

        <g className={styles.flowPaths}>
          <path className={styles.intakeFlow} d="M20 188 C91 184 151 179 218 180" markerEnd="url(#jet-arrow-bypass)" />
          <path className={styles.intakeFlow} d="M20 222 C104 221 160 218 218 219" markerEnd="url(#jet-arrow-bypass)" />
          <path className={styles.intakeFlow} d="M20 298 C104 299 160 302 218 301" markerEnd="url(#jet-arrow-bypass)" />
          <path className={styles.intakeFlow} d="M20 332 C91 336 151 341 218 340" markerEnd="url(#jet-arrow-bypass)" />
          <path className={styles.bypassFlow} d="M285 171 C487 143 733 144 946 166 C1019 173 1077 189 1158 207" markerEnd="url(#jet-arrow-bypass)" />
          <path className={styles.bypassFlow} d="M285 349 C487 377 733 376 946 354 C1019 347 1077 331 1158 313" markerEnd="url(#jet-arrow-bypass)" />
          <path className={styles.coreFlow} d="M286 232 C402 227 500 222 576 246 C655 271 718 230 792 229 C894 228 1004 246 1160 256" markerEnd="url(#jet-arrow-core)" />
          <path className={styles.coreFlow} d="M286 288 C402 293 500 298 576 274 C655 249 718 290 792 291 C894 292 1004 274 1160 264" markerEnd="url(#jet-arrow-core)" />
        </g>

        <g className={styles.partLabels} aria-hidden="true">
          <text x="72" y="448">INLET</text>
          <text x="230" y="448">FAN</text>
          <text x="405" y="448">COMPRESSOR</text>
          <text x="590" y="448">COMBUSTOR</text>
          <text x="770" y="448">TURBINE</text>
          <text x="1003" y="448">NOZZLES</text>
        </g>

        <g className={styles.selectedDatum}>
          <path d={`M${selectedStation.x} 56 V430`} />
          <circle cx={selectedStation.x} cy="260" r="7" />
          <text x={Math.min(selectedStation.x + 10, 1100)} y="78">STATION {selectedStation.number}</text>
        </g>
      </svg>

      <div className={styles.stationHotspots} aria-label="Engine drawing stations">
        {jetEngine.stations.map((station) => (
          <button
            type="button"
            key={station.id}
            aria-label={`Select station ${station.number}: ${station.label}`}
            aria-pressed={station.id === stationId}
            data-active={station.id === stationId || undefined}
            data-stream={station.stream}
            onClick={() => onSelectStation(station.id)}
            style={{
              "--station-x": `${(station.x / 1200) * 100}%`,
              "--station-y": markerTop(station.id),
            } as CSSProperties}
          >
            {station.number}
          </button>
        ))}
      </div>
    </div>
  );
}
