import type { Metadata } from "next";
import JetEngineExperience from "@/components/jet-engine/JetEngineExperience";
import { JetEngineReadingEdition } from "@/components/jet-engine/JetEngineReadingEdition";
import { ExhibitAccessBoundary } from "@/components/museum/ExhibitAccessBoundary";
import { ExhibitDiscoveryFooter } from "@/components/museum/ExhibitDiscoveryFooter";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { getExhibitBySlug } from "@/content/exhibits";
import { assertPublicExhibitRouteAvailable } from "@/lib/auth/exhibit-access";
import { createBreadcrumbGraph, createExhibitGraph } from "@/lib/seo/json-ld";
import { createExhibitMetadata } from "@/lib/seo/metadata";
import { listPublicResearchRecordsForExhibit } from "@/lib/research/public-records";
import styles from "@/components/jet-engine/jet-engine.module.css";

const exhibitDefinition = getExhibitBySlug("jet-engine")!;
const breadcrumbItems = [
  { name: "Home", pathname: "/" },
  { name: "Exhibits", pathname: "/exhibits" },
  { name: exhibitDefinition.title, pathname: exhibitDefinition.route },
] as const;

export const metadata: Metadata = createExhibitMetadata(exhibitDefinition);

export default function JetEnginePage() {
  assertPublicExhibitRouteAvailable(exhibitDefinition);
  const researchRecords = listPublicResearchRecordsForExhibit(
    exhibitDefinition.slug,
  );

  return (
    <main className={styles.page}>
      <JsonLd
        data={[
          createExhibitGraph(exhibitDefinition, researchRecords),
          createBreadcrumbGraph(breadcrumbItems),
        ]}
      />
      <Breadcrumbs items={breadcrumbItems} />
      <header className={styles.publicIdentity}>
        <p className={styles.identityEyebrow}>Systems &amp; Machines · {exhibitDefinition.exhibitNumber}</p>
        <h1>{exhibitDefinition.title}</h1>
        <p className={styles.identityTagline}>{exhibitDefinition.tagline}</p>
        <div className={styles.identityCopy}>
          <p>{exhibitDefinition.synopsis}</p>
          <p>{exhibitDefinition.curatorNote}</p>
        </div>
        <nav aria-label="Jet Engine public edition">
          <a href="#jet-engine-member-content">Enter the flow laboratory</a>
          <a href="#jet-engine-reading-edition">Read the public edition</a>
          <a href="#jet-engine-profiles">Compare operating profiles</a>
        </nav>
      </header>
      <ExhibitAccessBoundary exhibit={exhibitDefinition}>
        <JetEngineExperience />
      </ExhibitAccessBoundary>
      <JetEngineReadingEdition />
      <ExhibitDiscoveryFooter
        exhibit={exhibitDefinition}
        records={researchRecords}
      />
    </main>
  );
}
