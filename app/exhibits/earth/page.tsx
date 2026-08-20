import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EarthExperience } from "@/components/space/EarthExperience";
import { earth } from "@/content/space/earth";
import { isExhibitEnabled } from "@/content/exhibits";

export const metadata: Metadata = {
  title: "Earth",
  description:
    "NASA's Blue Marble and Black Marble composites on a globe you can turn — explore Earth's geography, oceans, and city lights by night.",
};

export default function EarthPage() {
  if (!isExhibitEnabled("earth")) {
    notFound();
  }

  return (
    <main className="space-page">
      <a className="skip-link" href="#earth-transcript">
        Skip interactive experience
      </a>
      <EarthExperience />
      <section className="atlas-transcript" id="earth-transcript" aria-labelledby="earth-transcript-title">
        <p className="kicker">Accessible edition</p>
        <h2 id="earth-transcript-title">Every catalogued site, in text</h2>
        <div className="transcript-grid">
          {earth.hotspots.map((hotspot) => (
            <article key={hotspot.id}>
              <span>{hotspot.category}</span>
              <h3>{hotspot.label}</h3>
              <p>{hotspot.detail}</p>
              <strong>
                {Math.abs(hotspot.lat).toFixed(2)}°{hotspot.lat >= 0 ? "N" : "S"},{" "}
                {Math.abs(hotspot.lon).toFixed(2)}°{hotspot.lon >= 0 ? "E" : "W"}
              </strong>
            </article>
          ))}
        </div>
        <div className="source-panel">
          <div>
            <p className="kicker">Sources &amp; context</p>
            <h2>Real imagery, honestly labeled.</h2>
            <p>
              Day and night imagery are NASA's Blue Marble and Black Marble composites. Landmark
              coordinates are well-established approximations for the featured region, not survey-grade
              boundaries.
            </p>
          </div>
          <ol>
            {earth.sources.map((source) => (
              <li key={source.id}>
                <a href={source.url} target="_blank" rel="noreferrer">
                  {source.title}
                  <span>{source.publisher}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
