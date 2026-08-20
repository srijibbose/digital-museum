import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MoonExperience } from "@/components/space/MoonExperience";
import { moon } from "@/content/space/moon";
import { isExhibitEnabled } from "@/content/exhibits";

export const metadata: Metadata = {
  title: "The Moon",
  description:
    "A globe built from real Lunar Reconnaissance Orbiter imagery — explore Apollo and Chandrayaan-3 landing sites, named craters, and the search for polar ice.",
};

export default function MoonPage() {
  if (!isExhibitEnabled("moon")) {
    notFound();
  }

  return (
    <main className="space-page">
      <a className="skip-link" href="#moon-transcript">
        Skip interactive experience
      </a>
      <MoonExperience />
      <section className="atlas-transcript" id="moon-transcript" aria-labelledby="moon-transcript-title">
        <p className="kicker">Accessible edition</p>
        <h2 id="moon-transcript-title">Every catalogued site, in text</h2>
        <div className="transcript-grid">
          {moon.hotspots.map((hotspot) => (
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
            <h2>Real coordinates, honestly labeled.</h2>
            <p>
              Mission landing sites are sourced from NASA and ISRO. Crater and basin coordinates are
              well-established approximations from USGS lunar mapping, not exact NASA PDS figures.
            </p>
          </div>
          <ol>
            {moon.sources.map((source) => (
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
