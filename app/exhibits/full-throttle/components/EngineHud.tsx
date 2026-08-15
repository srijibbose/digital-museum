"use client";

import type { EngineState } from "../types";
import styles from "../full-throttle.module.css";

export function EngineHud({ engine }: { engine: EngineState }) {
  const { telemetry } = engine;

  // Calculate SVG gauge stroke offsets
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const n1Offset = circumference - (telemetry.n1RpmPercent / 110) * circumference;
  const n2Offset = circumference - (telemetry.n2RpmPercent / 110) * circumference;
  const egtOffset = circumference - ((telemetry.egtCelsius - 300) / 800) * circumference;

  return (
    <aside className={styles.telemetryCluster} aria-label="Engine live flight telemetry">
      <div className={styles.telemetryHeader}>
        <div className={styles.liveIndicator}>
          <span className={styles.livePulse} />
          <span>FADEC LIVE TELEMETRY</span>
        </div>
        <span className={styles.telemetrySub}>2-SPOOL COAXIAL ENGINE</span>
      </div>

      <div className={styles.gaugesRow}>
        {/* N1 Fan Spool Gauge */}
        <div className={styles.gaugeCard}>
          <div className={styles.gaugeSvgWrap}>
            <svg viewBox="0 0 70 70" className={styles.gaugeSvg}>
              <circle
                cx="35"
                cy="35"
                r={radius}
                className={styles.gaugeTrack}
              />
              <circle
                cx="35"
                cy="35"
                r={radius}
                className={styles.gaugeProgressN1}
                strokeDasharray={circumference}
                strokeDashoffset={Math.max(0, n1Offset)}
              />
            </svg>
            <div className={styles.gaugeValueInside}>
              <strong>{telemetry.n1RpmPercent}</strong>
              <span>%</span>
            </div>
          </div>
          <div className={styles.gaugeLabel}>
            <span>N1 SPOOL</span>
            <small>Fan &amp; LPC</small>
          </div>
        </div>

        {/* N2 Core Spool Gauge */}
        <div className={styles.gaugeCard}>
          <div className={styles.gaugeSvgWrap}>
            <svg viewBox="0 0 70 70" className={styles.gaugeSvg}>
              <circle
                cx="35"
                cy="35"
                r={radius}
                className={styles.gaugeTrack}
              />
              <circle
                cx="35"
                cy="35"
                r={radius}
                className={styles.gaugeProgressN2}
                strokeDasharray={circumference}
                strokeDashoffset={Math.max(0, n2Offset)}
              />
            </svg>
            <div className={styles.gaugeValueInside}>
              <strong>{telemetry.n2RpmPercent}</strong>
              <span>%</span>
            </div>
          </div>
          <div className={styles.gaugeLabel}>
            <span>N2 SPOOL</span>
            <small>HPC &amp; HPT</small>
          </div>
        </div>

        {/* EGT Thermal Gauge */}
        <div className={styles.gaugeCard}>
          <div className={styles.gaugeSvgWrap}>
            <svg viewBox="0 0 70 70" className={styles.gaugeSvg}>
              <circle
                cx="35"
                cy="35"
                r={radius}
                className={styles.gaugeTrack}
              />
              <circle
                cx="35"
                cy="35"
                r={radius}
                className={styles.gaugeProgressEgt}
                strokeDasharray={circumference}
                strokeDashoffset={Math.max(0, egtOffset)}
              />
            </svg>
            <div className={styles.gaugeValueInside}>
              <strong>{telemetry.egtCelsius}</strong>
              <span>°C</span>
            </div>
          </div>
          <div className={styles.gaugeLabel}>
            <span>EGT TEMP</span>
            <small>Exhaust Gas</small>
          </div>
        </div>
      </div>

      <div className={styles.telemetryMetricsGrid}>
        <div className={styles.metricItem}>
          <span className={styles.metricLabel}>NET THRUST</span>
          <strong className={styles.metricValue}>
            {telemetry.thrustKiloNewtons} <small>kN</small>
            <span className={styles.metricSub}>({telemetry.thrustLbf.toLocaleString()} lbf)</span>
          </strong>
        </div>

        <div className={styles.metricItem}>
          <span className={styles.metricLabel}>FUEL FLOW (FF)</span>
          <strong className={styles.metricValue}>
            {telemetry.fuelFlowKgH} <small>kg/h</small>
          </strong>
        </div>

        <div className={styles.metricItem}>
          <span className={styles.metricLabel}>PRESSURE RATIO</span>
          <strong className={styles.metricValue}>
            {telemetry.epr} <small>EPR</small>
          </strong>
        </div>

        <div className={styles.metricItem}>
          <span className={styles.metricLabel}>BYPASS RATIO</span>
          <strong className={styles.metricValue}>
            {telemetry.bypassRatio}
          </strong>
        </div>
      </div>
    </aside>
  );
}
