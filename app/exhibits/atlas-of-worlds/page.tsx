import type { Metadata, Viewport } from "next";
import { AtlasExperience } from "@/components/space/AtlasExperience";
import { ExhibitAccessBoundary } from "@/components/museum/ExhibitAccessBoundary";
import { ExhibitDiscoveryFooter } from "@/components/museum/ExhibitDiscoveryFooter";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { atlas } from "@/content/space/atlas";
import { getExhibitBySlug } from "@/content/exhibits";
import { assertPublicExhibitRouteAvailable } from "@/lib/auth/exhibit-access";
import { createBreadcrumbGraph, createExhibitGraph } from "@/lib/seo/json-ld";
import { createExhibitMetadata } from "@/lib/seo/metadata";
import { listPublicResearchRecordsForExhibit } from "@/lib/research/public-records";
import { parseWorldQuery } from "@/lib/space/atlas-query";
import { MARS_DEEP_TIME_ANCHORS, formatMarsTime } from "@/lib/space/mars-deep-time";
import accessStyles from "@/components/museum/exhibit-access.module.css";

const exhibitDefinition = getExhibitBySlug("atlas-of-worlds")!;
const breadcrumbItems = [
  { name: "Home", pathname: "/" },
  { name: "Exhibits", pathname: "/exhibits" },
  { name: exhibitDefinition.title, pathname: exhibitDefinition.route },
] as const;

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
  assertPublicExhibitRouteAvailable(exhibitDefinition);
  const researchRecords = listPublicResearchRecordsForExhibit(
    exhibitDefinition.slug,
  );
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
          createExhibitGraph(exhibitDefinition, researchRecords),
          createBreadcrumbGraph(breadcrumbItems),
        ]}
      />
      <Breadcrumbs items={breadcrumbItems} />
      <header className={accessStyles.publicContext}>
        <p className={accessStyles.eyebrow}>The public scientific edition</p>
        <h1>{exhibitDefinition.title}</h1>
        <p className={accessStyles.publicTagline}>{exhibitDefinition.tagline}</p>
        <p>{exhibitDefinition.synopsis}</p>
        <p className={accessStyles.publicNote}>{exhibitDefinition.curatorNote}</p>
        <nav aria-label="Atlas public edition">
          <a href="#atlas-transcript">Read the scientific edition</a>
          <a href="#atlas-sources">Review sources</a>
        </nav>
      </header>
      <a className="skip-link" href="#atlas-transcript">
        Skip interactive instrument
      </a>
      <ExhibitAccessBoundary exhibit={exhibitDefinition}>
        <AtlasExperience initialWorld={initialWorld} />
      </ExhibitAccessBoundary>

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
      <ExhibitDiscoveryFooter
        exhibit={exhibitDefinition}
        records={researchRecords}
      />
    </main>
  );
}
