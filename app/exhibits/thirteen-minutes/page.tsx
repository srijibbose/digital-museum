import type { Metadata, Viewport } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isExhibitEnabled } from "@/content/exhibits";
import { thirteenMinutesContent as exhibit } from "./content";
import { AgcArtifactPlate } from "./components/AgcArtifactPlate";
import { TimelineExperience } from "./components/TimelineExperience";
import { ARCHIVAL_MEDIA } from "./media-manifest";
import styles from "./thirteen-minutes.module.css";

export const metadata: Metadata = {
  title: exhibit.title,
  description: exhibit.subtitle,
};

export const viewport: Viewport = {
  themeColor: "#070a0b",
};

export default function ThirteenMinutesPage() {
  if (!isExhibitEnabled("thirteen-minutes")) {
    notFound();
  }

  const eagleImage = ARCHIVAL_MEDIA[0];
  const missionControlImage = ARCHIVAL_MEDIA[1];

  return (
    <main className={styles.page}>
      <a className="skip-link" href="#mission-timeline">
        Skip to the descent timeline
      </a>

      <header aria-labelledby="exhibit-title" className={styles.hero}>
        <figure className={styles.heroArchive}>
          <Image
            alt={eagleImage.alt}
            className={styles.heroArchiveImage}
            fill
            loading="eager"
            sizes="100vw"
            src={eagleImage.src}
          />
          <figcaption>
            {eagleImage.credit} · {eagleImage.reference}
          </figcaption>
        </figure>
        <div className={styles.topline}>
          <Link className={styles.mark} href="/" aria-label="Loupe museum home">
            <span className={styles.markDot} aria-hidden="true" />
            <span>Loupe</span>
          </Link>
          <span>Systems &amp; Machines · Exhibit 002</span>
        </div>

        <div className={styles.heroBody}>
          <div className={styles.titleBlock}>
            <p className={styles.eyebrow}>Apollo 11 · Powered descent</p>
            <h1 className={styles.title} id="exhibit-title">
              Thirteen <span>Minutes</span>
            </h1>
          </div>
          <div className={styles.heroStatement}>
            <p>{exhibit.hook.text}</p>
            <p>{exhibit.subtitle}</p>
            <a className={styles.beginLink} href="#mission-context">
              Enter the descent <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>

        <div className={styles.heroFooter} aria-label="Exhibit details">
          <span>{exhibit.estimatedMinutes} minute reading time</span>
          <span>Six telemetry beats</span>
          <span>Scroll · Keys · Touch</span>
        </div>
      </header>

      <section aria-labelledby="mission-context" className={styles.context}>
        <div className={styles.contextAside}>
          <p>July 20, 1969<br />Sea of Tranquility<br />102 hours into mission</p>
          <figure className={styles.contextArchive}>
            <Image
              alt={missionControlImage.alt}
              height={664}
              sizes="(max-width: 900px) 100vw, 32vw"
              src={missionControlImage.src}
              width={985}
            />
            <figcaption>
              Mission Control during descent · {missionControlImage.credit} · {missionControlImage.reference}
            </figcaption>
          </figure>
        </div>
        <div className={styles.contextCopy}>
          <p className={styles.sectionKicker}>Before the clock starts</p>
          <h2 id="mission-context">One descent.<br />Six decisions.</h2>
          <p>{exhibit.context.text}</p>
        </div>
      </section>

      <TimelineExperience beats={exhibit.beats} exhibitTitle={exhibit.title} />

      <section aria-labelledby="takeaway-title" className={styles.takeaway}>
        <p className={styles.sectionKicker}>What survived the alarm</p>
        <h2 id="takeaway-title">Keep what <span>matters most.</span></h2>
        <div className={styles.takeawayBody}>
          <div className={styles.takeawayArtifactCol}>
            <p className={styles.takeawayKicker}>
              Overload ≠ failure<br />
              Priority became survival
            </p>
            <AgcArtifactPlate />
          </div>
          <div className={styles.takeawayCopyCol}>
            <p>{exhibit.takeaway.text}</p>
            <p className={styles.accuracyNote}>{exhibit.telemetryNote}</p>
          </div>
        </div>
      </section>

      <aside aria-labelledby="go-deeper-title" className={styles.goDeeper}>
        <div className={styles.goDeeperHeader}>
          <p className={styles.sectionKicker}>Archival Records</p>
          <h2 id="go-deeper-title">Read the real mission record</h2>
          <p>
            Primary sources, air-to-ground transcripts, and original Apollo 11 flight software archived by NASA and MIT.
          </p>
        </div>
        <div className={styles.goDeeperLinks}>
          <a
            className={styles.archivalLink}
            href="https://www.hq.nasa.gov/alsj/a11/a11.landing.html"
            rel="noopener noreferrer"
            target="_blank"
          >
            <div className={styles.archivalLinkMeta}>
              <span className={styles.archivalTag}>NASA History ALSJ</span>
              <strong>Apollo 11 Air-to-Ground Mission Transcript</strong>
              <p>Complete transcript from powered descent initiation to touchdown at Tranquility Base.</p>
            </div>
            <span className={styles.archivalArrow} aria-hidden="true">↗</span>
          </a>

          <a
            className={styles.archivalLink}
            href="https://github.com/chrislgarry/Apollo-11"
            rel="noopener noreferrer"
            target="_blank"
          >
            <div className={styles.archivalLinkMeta}>
              <span className={styles.archivalTag}>MIT Instrumentation Lab</span>
              <strong>Apollo 11 Guidance Computer (AGC) Source Code</strong>
              <p>Original Luminary 1A assembly source code including Hamilton&apos;s priority alarm routines.</p>
            </div>
            <span className={styles.archivalArrow} aria-hidden="true">↗</span>
          </a>

          <a
            className={styles.archivalLink}
            href="https://www.nasa.gov/history/alsj/a11/a11.hamilton.html"
            rel="noopener noreferrer"
            target="_blank"
          >
            <div className={styles.archivalLinkMeta}>
              <span className={styles.archivalTag}>Software Pioneers</span>
              <strong>Margaret Hamilton&apos;s Account of the 1202 Alarm</strong>
              <p>Firsthand retrospective on asynchronous software engineering and the landing alarms.</p>
            </div>
            <span className={styles.archivalArrow} aria-hidden="true">↗</span>
          </a>
        </div>
      </aside>

      <footer aria-labelledby="related-title" className={styles.related}>
        <div className={styles.footerTopline}>
          <span>Continue looking closer</span>
          <span>Systems &amp; Machines</span>
        </div>
        <h2 id="related-title">You might also like</h2>
        <div className={styles.relatedGrid}>
          {exhibit.relatedExhibits.map((related) => (
            <article className={styles.relatedCard} key={related.slug}>
              <p>{related.status}</p>
              <h3>{related.title}</h3>
            </article>
          ))}
        </div>
        <div className={styles.closingLine}>
          <span>Loupe · A museum for the quietly curious</span>
          <span>End of exhibit</span>
        </div>
      </footer>
    </main>
  );
}
