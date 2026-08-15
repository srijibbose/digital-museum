import type { Metadata, Viewport } from "next";
import Image from "next/image";
import Link from "next/link";
import { FullThrottleExperience } from "./components/FullThrottleExperience";
import { fullThrottleContent as exhibit } from "./content";
import styles from "./full-throttle.module.css";

export const metadata: Metadata = {
  title: `${exhibit.title} · Loupe Digital Museum`,
  description: exhibit.subtitle,
};

export const viewport: Viewport = {
  themeColor: "#070a0e",
};

export default function FullThrottlePage() {
  return (
    <main className={styles.page}>
      <a className="skip-link" href="#engine-lab">
        Skip to the interactive engine laboratory
      </a>

      {/* Hero Header */}
      <header aria-labelledby="full-throttle-title" className={styles.hero}>
        <div className={styles.topline}>
          <Link className={styles.mark} href="/" aria-label="Loupe museum home">
            <span className={styles.markLens} aria-hidden="true" />
            <span>Loupe</span>
          </Link>
          <div className={styles.heroMetaPills}>
            <span className={styles.badgeWing}>Systems &amp; Machines</span>
            <span className={styles.badgeNum}>Exhibit 003</span>
          </div>
        </div>

        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>{exhibit.hook.kicker}</p>
            <h1 id="full-throttle-title">
              Full <span>Throttle</span>
            </h1>
            <p className={styles.heroHook}>{exhibit.hook.text}</p>
            
            <div className={styles.heroCtaRow}>
              <a className={styles.openEngine} href="#engine-lab">
                <span>Enter 3D Laboratory</span>
                <span aria-hidden="true">↓</span>
              </a>
              <a className={styles.secondaryHeroLink} href="#engine-context">
                <span>Read the Physics</span>
                <span aria-hidden="true">→</span>
              </a>
            </div>

            <div className={styles.heroHighlights}>
              <div className={styles.highlightItem}>
                <strong>75,000+</strong>
                <span>Pounds of Thrust</span>
              </div>
              <div className={styles.highlightItem}>
                <strong>1,700°C</strong>
                <span>Core Flame Temp</span>
              </div>
              <div className={styles.highlightItem}>
                <strong>10.4 : 1</strong>
                <span>Bypass Air Ratio</span>
              </div>
            </div>
          </div>

          <div
            className={styles.windowScene}
            aria-label="High-bypass turbofan cutaway seen through aircraft inspection window"
          >
            <div className={styles.windowOuter}>
              <div className={styles.windowInner}>
                <Image
                  alt="Detailed cutaway model of a two-spool high-bypass turbofan engine"
                  className={styles.heroEngine}
                  fill
                  loading="eager"
                  priority
                  sizes="(max-width: 860px) 92vw, 54vw"
                  src="/images/full-throttle-poster.webp"
                />
                <div className={styles.windowGlint} aria-hidden="true" />
                <div className={styles.heroEngineLiveTag}>
                  <span className={styles.heroLiveDot} />
                  <span>3D GLB ASSET READY</span>
                </div>
              </div>
            </div>
            <div className={styles.wingEdge} aria-hidden="true" />
          </div>
        </div>

        <div className={styles.heroFooter} aria-label="Exhibit details">
          <span>{exhibit.estimatedMinutes} minute deep-dive</span>
          <span>Seven precision modules · Dual coaxial shafts</span>
          <span>Orbit · Dissect · Accelerate</span>
        </div>
      </header>

      {/* Physics & Context Section */}
      <section className={styles.context} id="engine-context" aria-labelledby="engine-context-title">
        <div className={styles.contextIndex} aria-hidden="true">
          01
        </div>
        <div className={styles.contextTitleBlock}>
          <p className={styles.sectionKicker}>Thermodynamic Principles</p>
          <h2 id="engine-context-title">{exhibit.context.title}</h2>
        </div>
        <div className={styles.contextBody}>
          <p>{exhibit.context.text}</p>
          <p className={styles.contextFactHighlight}>{exhibit.context.fact}</p>
        </div>
      </section>

      {/* Brayton Cycle Infographic Strip */}
      <section className={styles.braytonStrip} aria-label="Brayton thermodynamic cycle breakdown">
        <div className={styles.braytonCard}>
          <span className={styles.braytonStep}>STEP 1</span>
          <h3>Intake &amp; Bypass Split</h3>
          <p>Fan captures mass flow; 85% is accelerated around the engine casing for quiet, high-efficiency propulsive momentum.</p>
          <div className={styles.braytonMetric}>Mach 0.8 · Ambient 15°C</div>
        </div>
        <div className={styles.braytonCard}>
          <span className={styles.braytonStep}>STEP 2</span>
          <h3>Adiabatic Compression</h3>
          <p>8 progressive compressor disks squeeze the core stream to 45 atmospheres, heating air to 620°C purely from density.</p>
          <div className={styles.braytonMetric}>45.0 : 1 OPR · 650 PSI</div>
        </div>
        <div className={styles.braytonCard}>
          <span className={styles.braytonStep}>STEP 3</span>
          <h3>Isobaric Combustion</h3>
          <p>16 atomizing swirl nozzles feed Jet-A kerosene into compressed air, sustaining a continuous 1,700°C fire vortex.</p>
          <div className={styles.braytonMetric}>1,720°C Peak Flame</div>
        </div>
        <div className={styles.braytonCard}>
          <span className={styles.braytonStep}>STEP 4</span>
          <h3>Turbine Feedback Loop</h3>
          <p>Single-crystal cooled turbines extract 50,000 HP from the fire to drive the compressors and fan via dual concentric shafts.</p>
          <div className={styles.braytonMetric}>N1 &amp; N2 Coaxial Drive</div>
        </div>
      </section>

      {/* Main 3D Experience */}
      <FullThrottleExperience />

      {/* Takeaway Section */}
      <section className={styles.takeaway} aria-labelledby="engine-takeaway-title">
        <p className={styles.sectionKicker}>The Self-Sustaining Cycle</p>
        <h2 id="engine-takeaway-title">{exhibit.takeaway.title}</h2>
        <div className={styles.takeawayBody}>
          <div className={styles.equationCard}>
            <span className={styles.equationKicker}>MOMENTUM CONSERVATION</span>
            <p className={styles.takeawayEquation}>
              F = ṁ · (v<sub>exit</sub> &minus; v<sub>inlet</sub>)
            </p>
            <small>Thrust equals mass flow rate multiplied by net change in air velocity.</small>
          </div>
          <div className={styles.takeawayNarrative}>
            <p>{exhibit.takeaway.text}</p>
            <p className={styles.accuracyNote}>{exhibit.accuracyNote}</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.deeper}>
          <div>
            <p className={styles.sectionKicker}>Engineering Heritage</p>
            <h2>Seven parts. Two shafts.<br />One continuous exhale.</h2>
          </div>
          <a
            className={styles.deeperLink}
            href={exhibit.goDeeper.url}
            rel="noreferrer"
            target="_blank"
          >
            <span>{exhibit.goDeeper.label}</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>

        <details className={styles.sources}>
          <summary>Engineering references &amp; aerospace citations</summary>
          <ul>
            {exhibit.sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} rel="noreferrer" target="_blank">
                  {source.label}
                </a>
                <span>{source.supports}</span>
              </li>
            ))}
          </ul>
        </details>

        <div className={styles.closingLine}>
          <Link href="/exhibits/thirteen-minutes">← Previous: Thirteen Minutes</Link>
          <span>Loupe Digital Museum · Curated for the Quietly Curious</span>
        </div>
      </footer>
    </main>
  );
}
