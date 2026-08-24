import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { FlowerExperience } from "@/components/flowers/FlowerExperience";
import styles from "@/components/flowers/flowers.module.css";
import { flowerExhibit } from "@/content/flowers";
import { isExhibitEnabled } from "@/content/exhibits";

export const metadata: Metadata = {
  title: "The Work of Flowers — Interactive Orchid Reproduction",
  description:
    "Follow a sourced Smithsonian orchid through visible form, reconstructed internal anatomy, 3D pollination, fertilisation, and fruit set in one evidence-labelled interactive sequence.",
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f3efe4",
};

export default function WorkOfFlowersPage() {
  if (!isExhibitEnabled("work-of-flowers")) notFound();

  return (
    <main className={styles.page}>
      <a className="skip-link" href="#flower-transcript">
        Skip interactive flower sequence
      </a>
      <FlowerExperience />

      <section
        className={styles.transcript}
        id="flower-transcript"
        aria-labelledby="flower-transcript-title"
      >
        <div className={styles.transcriptIntro}>
          <p className="kicker">Accessible scientific edition</p>
          <h2 id="flower-transcript-title">A flower is an event, not an ornament.</h2>
          <p>{flowerExhibit.curatorialThesis}</p>
          <p>
            This text edition preserves the complete biological sequence when interactive 3D,
            scrolling motion, or pointer input is unavailable. Evidence labels remain attached to
            every representation.
          </p>
        </div>

        <div className={styles.transcriptGrid}>
          {flowerExhibit.chapters.map((chapter) => (
            <article key={chapter.id}>
              <span>{chapter.index} · {chapter.evidenceLabel}</span>
              <h3>{chapter.title}</h3>
              <p>{chapter.thesis}</p>
              <ol>
                {chapter.observations.map((observation) => (
                  <li key={observation}>{observation}</li>
                ))}
              </ol>
              <dl>
                <div><dt>Scale</dt><dd>{chapter.scale}</dd></div>
                <div><dt>Clock</dt><dd>{chapter.clock}</dd></div>
              </dl>
              <small>{chapter.evidenceDetail}</small>
            </article>
          ))}
        </div>

        <div className={styles.sourcePanel} id="flower-sources">
          <div>
            <p className="kicker">Sources &amp; transformations</p>
            <h2>One scan. Four explicitly bounded reconstructions.</h2>
            <p>
              The exterior is Smithsonian surface geometry. Internal anatomy, carpenter-bee
              behaviour, pollen-tube growth, and fruit development are conventional real-time 3D
              reconstructions. None are AI-generated, and none are presented as observations of
              the scanned individual.
            </p>
          </div>
          <ol>
            {flowerExhibit.sources.map((source) => (
              <li key={source.id}>
                <a href={source.url} target="_blank" rel="noreferrer">
                  <span>{source.title}</span>
                  <small>{source.publisher} · {source.rights}</small>
                </a>
                <p>{source.use}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
