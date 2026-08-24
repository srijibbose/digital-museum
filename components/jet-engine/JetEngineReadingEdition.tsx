import Link from "next/link";
import { jetEngine } from "@/content/jet-engine";
import styles from "./jet-engine.module.css";

const numberFormat = new Intl.NumberFormat("en-US");

function evidenceLabel(value: string) {
  return value.replaceAll("-", " ");
}

export function JetEngineReadingEdition() {
  const sourcesById = new Map(jetEngine.sources.map((source) => [source.id, source]));

  return (
    <section
      className={styles.readingEdition}
      id="jet-engine-reading-edition"
      aria-labelledby="jet-engine-reading-title"
    >
      <header className={styles.readingIntroduction}>
        <p className={styles.readingEyebrow}>Public flow reading edition · seven stations</p>
        <h2 id="jet-engine-reading-title">Follow the river through the machine.</h2>
        <p className={styles.readingThesis}>{jetEngine.thesis}</p>
        <p className={styles.visitorPromise}>{jetEngine.visitorPromise}</p>
      </header>

      <div className={styles.noticeGrid} aria-label="Representation limits">
        <section>
          <p>01 · Geometry</p>
          <h3>Reconstruction boundary</h3>
          <p>{jetEngine.reconstructionNotice}</p>
        </section>
        <section>
          <p>02 · Readouts</p>
          <h3>Model boundary</h3>
          <p>{jetEngine.modelNotice}</p>
        </section>
      </div>

      <section
        className={styles.profileEdition}
        id="jet-engine-profiles"
        aria-label="Operating profile comparison"
      >
        <header className={styles.sectionIntroduction}>
          <p className={styles.readingEyebrow}>Four authored conditions</p>
          <h2>Compare the assumptions before the readouts.</h2>
          <p>
            Each operating profile changes the atmosphere, compression, fan loading, and heat
            added to the same idealized cycle. These are representative teaching conditions, not
            performance claims for a named engine.
          </p>
        </header>

        <div className={styles.profileGrid}>
          {jetEngine.profiles.map((profile, index) => (
            <article className={styles.profileCard} key={profile.id}>
              <p className={styles.profileIndex}>Profile {String(index + 1).padStart(2, "0")}</p>
              <h3>{profile.label}</h3>
              <p className={styles.profileContext}>{profile.context}</p>
              <dl>
                <div>
                  <dt>Altitude</dt>
                  <dd>{numberFormat.format(profile.altitudeM)} m</dd>
                </div>
                <div>
                  <dt>Flight condition</dt>
                  <dd>Mach {profile.mach}</dd>
                </div>
                <div>
                  <dt>Turbine-inlet temperature</dt>
                  <dd>{numberFormat.format(profile.turbineInletTemperatureK)} K</dd>
                </div>
                <div>
                  <dt>Overall pressure ratio</dt>
                  <dd>{profile.overallPressureRatio}:1</dd>
                </div>
                <div>
                  <dt>Fan pressure ratio</dt>
                  <dd>{profile.fanPressureRatio}:1</dd>
                </div>
                <div>
                  <dt>Throttle setting</dt>
                  <dd>{profile.throttlePercent}%</dd>
                </div>
              </dl>
              <p className={styles.profileAssumption}>
                <strong>Assumption</strong>
                {profile.assumption}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        className={styles.stationEdition}
        aria-label="Flow station reading sequence"
      >
        <header className={styles.sectionIntroduction}>
          <p className={styles.readingEyebrow}>NASA station convention · authored order</p>
          <h2>Seven changes, one coupled energy loop.</h2>
          <p>
            Read from undisturbed atmosphere to the bypass and core exits. Every station keeps its
            evidence status, transformation, interpretation, and source trail beside the account.
          </p>
        </header>

        <nav className={styles.stationIndex} id="jet-station-index" aria-label="Flow station index">
          <ol>
            {jetEngine.stations.map((station) => (
              <li key={station.id}>
                <a href={`#jet-station-${station.id}`}>
                  <span>{station.number}</span>
                  {station.shortLabel}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <ol className={styles.stationList}>
          {jetEngine.stations.map((station, index) => {
            const previousStation = jetEngine.stations[index - 1];
            const nextStation = jetEngine.stations[index + 1];
            const stationSources = station.sourceIds.map((sourceId) => {
              const source = sourcesById.get(sourceId);
              if (!source) {
                throw new Error(`Unknown jet-engine source ${sourceId} for station ${station.id}`);
              }
              return source;
            });

            return (
              <li key={station.id}>
                <article className={styles.stationArticle} id={`jet-station-${station.id}`}>
                  <header className={styles.stationHeader}>
                    <div className={styles.stationNumber} aria-label={`Station ${station.number}`}>
                      {station.number}
                    </div>
                    <div>
                      <p>
                        {station.stream} stream · {evidenceLabel(station.evidence)}
                      </p>
                      <h3>{station.label}</h3>
                      <p className={styles.stationSummary}>{station.summary}</p>
                    </div>
                  </header>

                  <div className={styles.stationAccount}>
                    <section>
                      <p>Transformation</p>
                      <h4>What changes here</h4>
                      <p>{station.transformation}</p>
                    </section>
                    <section>
                      <p>Interpretation</p>
                      <h4>Why it matters</h4>
                      <p>{station.interpretation}</p>
                    </section>
                  </div>

                  <div className={styles.stationSources}>
                    <div>
                      <p className={styles.readingEyebrow}>Evidence trail</p>
                      <h4>Sources for this station</h4>
                    </div>
                    <nav aria-label={`Sources for ${station.label}`}>
                      <ol>
                        {stationSources.map((source) => (
                          <li key={source.id}>
                            <a href={source.url} target="_blank" rel="noreferrer">
                              {source.title}
                            </a>
                            <span>{source.organization}</span>
                          </li>
                        ))}
                      </ol>
                    </nav>
                  </div>

                  <footer className={styles.stationFooter}>
                    <Link href={`/research/jet-engine/station-${station.id}`}>
                      Read station {station.number} research record
                    </Link>
                    <nav aria-label={`Station ${station.number} reading navigation`}>
                      {previousStation ? (
                        <a href={`#jet-station-${previousStation.id}`}>
                          Previous · {previousStation.shortLabel}
                        </a>
                      ) : null}
                      <a href="#jet-station-index">Station index</a>
                      {nextStation ? (
                        <a href={`#jet-station-${nextStation.id}`}>
                          Next · {nextStation.shortLabel}
                        </a>
                      ) : null}
                    </nav>
                  </footer>
                </article>
              </li>
            );
          })}
        </ol>
      </section>
    </section>
  );
}
