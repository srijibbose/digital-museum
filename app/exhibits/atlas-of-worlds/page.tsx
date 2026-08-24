import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { AtlasExperience } from "@/components/space/AtlasExperience";
import { JsonLd } from "@/components/seo/JsonLd";
import { atlas } from "@/content/space/atlas";
import { getExhibitBySlug, isExhibitEnabled } from "@/content/exhibits";
import { createBreadcrumbGraph, createExhibitGraph } from "@/lib/seo/json-ld";
import { createExhibitMetadata } from "@/lib/seo/metadata";
import { parseWorldQuery } from "@/lib/space/atlas-query";
import { MARS_DEEP_TIME_ANCHORS, formatMarsTime } from "@/lib/space/mars-deep-time";

const exhibitDefinition = getExhibitBySlug("atlas-of-worlds")!;

export const metadata: Metadata = createExhibitMetadata(exhibitDefinition);

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f0ede6" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0d0f" },
  ],
};

type AtlasPageProps = {
  searchParams: Promise<{ world?: string | string[] }>;
};

export default async function AtlasOfWorldsPage({ searchParams }: AtlasPageProps) {
  if (!isExhibitEnabled("atlas-of-worlds")) notFound();
  const query = await searchParams;
  const initialWorld = parseWorldQuery(query.world);
  const sources = Array.from(
    new Map(
      atlas.worlds
        .flatMap((world) => world.sources)
        .map((source) => [source.url, source] as const),
    ).values(),
  );

  return (
    <main className="space-page">
      <JsonLd
        data={[
          createExhibitGraph(exhibitDefinition),
          createBreadcrumbGraph([
            { name: "Exhibits", pathname: "/exhibits" },
            { name: exhibitDefinition.title, pathname: exhibitDefinition.route },
          ]),
        ]}
      />
      <a className="skip-link" href="#atlas-transcript">
        Skip interactive instrument
      </a>
      <AtlasExperience initialWorld={initialWorld} />

      <section
        className="atlas-transcript"
        id="atlas-transcript"
        aria-labelledby="atlas-transcript-title"
      >
        <p className="kicker">Accessible scientific edition</p>
        <h2 id="atlas-transcript-title">Ten worlds, every authored observation.</h2>
        <p>
          This text edition preserves every field-guide feature when WebGL, pointer input, or motion
          is unavailable. Evidence status distinguishes direct observation, processed imagery,
          scientific inference, and explanatory illustration.
        </p>

        <div className="transcript-grid">
          {atlas.worlds.map((world) => (
            <article key={world.id}>
              <span>{world.orderLabel} · {world.classification}</span>
              <h3>{world.name}</h3>
              <p>{world.overview}</p>
              <strong>{world.physical.radiusKm.toLocaleString()} km mean radius</strong>
              <ul>
                {world.hotspots.map((hotspot) => (
                  <li key={hotspot.id}>
                    <b>{hotspot.label}</b> — {hotspot.detail} ({hotspot.evidence})
                  </li>
                ))}
              </ul>
              {world.id === "mars" ? (
                <section aria-label="Mars deep-time states">
                  <h4>Mars deep-time states</h4>
                  <p>
                    Observed terrain is preserved beneath a constrained reconstruction of water,
                    ice, haze, and atmospheric density.
                  </p>
                  <ol>
                    {MARS_DEEP_TIME_ANCHORS.map((anchor) => (
                      <li key={anchor.id}>
                        <b>{anchor.title}</b> — {formatMarsTime(anchor.timeMya)}. {anchor.description}{" "}
                        Evidence: {anchor.evidenceSummary} Constrained reconstruction: {anchor.reconstructionSummary}{" "}
                        Confidence: {anchor.confidence}
                      </li>
                    ))}
                  </ol>
                </section>
              ) : null}
            </article>
          ))}
        </div>

        <div className="source-panel" id="atlas-sources">
          <div>
            <p className="kicker">Sources &amp; transformations</p>
            <h2>Observed first. Interpretation labeled.</h2>
            <p>
              Planetary textures and models are delivered locally from NASA, USGS, LRO, MOLA,
              SDO, Cassini, Voyager, Magellan, and Earth-observation products. Processed layers are
              labeled inside the instrument and retain a public source trail.
            </p>
          </div>
          <ol>
            {sources.map((source) => (
              <li key={source.url}>
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
