import styles from "../thirteen-minutes.module.css";

export function AgcArtifactPlate() {
  return (
    <aside className={styles.artifactPlate} aria-label="Apollo Guidance Computer archival plate">
      <div className={styles.plateHeader}>
        <span className={styles.plateKicker}>Museum Specimen · Archive Plate</span>
        <span className={styles.plateId}>AGC-BLK2 · MIT-IL</span>
      </div>

      <div className={styles.plateBody}>
        <h3 className={styles.plateTitle}>Apollo Guidance Computer</h3>
        <p className={styles.plateSubtitle}>
          Block II Architecture · 1.024 MHz · Asynchronous Priority Executive
        </p>

        <div className={styles.plateTelemetrySample} aria-hidden="true">
          <div className={styles.sampleItem}>
            <span className={styles.sampleLabel}>Prog</span>
            <span className={styles.sampleValue}>64</span>
          </div>
          <div className={styles.sampleItem}>
            <span className={styles.sampleLabel}>Verb</span>
            <span className={styles.sampleValue}>35</span>
          </div>
          <div className={styles.sampleItem}>
            <span className={styles.sampleLabel}>Noun</span>
            <span className={styles.sampleValue}>68</span>
          </div>
          <div className={styles.sampleItem}>
            <span className={styles.sampleLabel}>Priority</span>
            <span className={styles.sampleValue}>30</span>
          </div>
        </div>

        <p className={styles.plateDescription}>
          Designed by Margaret Hamilton and the MIT Instrumentation Laboratory team. Rather than crashing during cycle overload, the executive dropped non-critical radar polling and completed 100% of landing thruster and engine equations.
        </p>

        <div className={styles.plateSpecsGrid}>
          <div>
            <dt>RAM</dt>
            <dd>2,048 words (Core)</dd>
          </div>
          <div>
            <dt>ROM</dt>
            <dd>36,864 words (Rope)</dd>
          </div>
          <div>
            <dt>Word Size</dt>
            <dd>16-bit (15 data + 1 parity)</dd>
          </div>
          <div>
            <dt>Executive</dt>
            <dd>Priority-driven async</dd>
          </div>
        </div>
      </div>

      <div className={styles.plateFooter}>
        <span>Raytheon / MIT Instrumentation Lab</span>
        <span>1969 Flight Software</span>
      </div>
    </aside>
  );
}
