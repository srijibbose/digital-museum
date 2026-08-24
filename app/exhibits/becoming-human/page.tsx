import type { Metadata, Viewport } from "next";
import {
  BecomingHumanPublicIdentity,
  BecomingHumanReadingEdition,
} from "@/components/becoming-human/BecomingHumanReadingEdition";
import { BecomingHumanV2Experience } from "@/components/becoming-human/BecomingHumanV2Experience";
import { ExhibitAccessBoundary } from "@/components/museum/ExhibitAccessBoundary";
import { ExhibitDiscoveryFooter } from "@/components/museum/ExhibitDiscoveryFooter";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { getExhibitBySlug } from "@/content/exhibits";
import { assertPublicExhibitRouteAvailable } from "@/lib/auth/exhibit-access";
import { createBreadcrumbGraph, createExhibitGraph } from "@/lib/seo/json-ld";
import { createExhibitMetadata } from "@/lib/seo/metadata";
import { listPublicResearchRecordsForExhibit } from "@/lib/research/public-records";

const exhibitDefinition = getExhibitBySlug("becoming-human")!;
const breadcrumbItems = [
  { name: "Home", pathname: "/" },
  { name: "Exhibits", pathname: "/exhibits" },
  { name: exhibitDefinition.title, pathname: exhibitDefinition.route },
] as const;

export const metadata: Metadata = createExhibitMetadata(exhibitDefinition);

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#030303",
};

export default function BecomingHumanPage() {
  assertPublicExhibitRouteAvailable(exhibitDefinition);
  const hasMemberPolicy = exhibitDefinition.access.mode === "members";
  const researchRecords = listPublicResearchRecordsForExhibit(
    exhibitDefinition.slug,
  );

  return (
    <>
      <JsonLd
        data={[
          createExhibitGraph(exhibitDefinition, researchRecords),
          createBreadcrumbGraph(breadcrumbItems),
        ]}
      />
      <Breadcrumbs items={breadcrumbItems} />
      <main>
        {hasMemberPolicy ? <BecomingHumanPublicIdentity /> : null}
        <ExhibitAccessBoundary exhibit={exhibitDefinition}>
          <BecomingHumanV2Experience />
        </ExhibitAccessBoundary>
        <BecomingHumanReadingEdition headingLevel={2} />
        <ExhibitDiscoveryFooter
          exhibit={exhibitDefinition}
          records={researchRecords}
        />
      </main>
    </>
  );
}
