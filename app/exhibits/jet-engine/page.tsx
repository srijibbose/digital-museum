import type { Metadata } from "next";
import JetEngineExperience from "@/components/jet-engine/JetEngineExperience";
import { ExhibitAccessBoundary } from "@/components/museum/ExhibitAccessBoundary";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { getExhibitBySlug } from "@/content/exhibits";
import { assertPublicExhibitRouteAvailable } from "@/lib/auth/exhibit-access";
import { createBreadcrumbGraph, createExhibitGraph } from "@/lib/seo/json-ld";
import { createExhibitMetadata } from "@/lib/seo/metadata";

const exhibitDefinition = getExhibitBySlug("jet-engine")!;
const breadcrumbItems = [
  { name: "Home", pathname: "/" },
  { name: "Exhibits", pathname: "/exhibits" },
  { name: exhibitDefinition.title, pathname: exhibitDefinition.route },
] as const;

export const metadata: Metadata = createExhibitMetadata(exhibitDefinition);

export default function JetEnginePage() {
  assertPublicExhibitRouteAvailable(exhibitDefinition);

  return (
    <>
      <JsonLd
        data={[
          createExhibitGraph(exhibitDefinition),
          createBreadcrumbGraph(breadcrumbItems),
        ]}
      />
      <Breadcrumbs items={breadcrumbItems} />
      <ExhibitAccessBoundary exhibit={exhibitDefinition}>
        <JetEngineExperience />
      </ExhibitAccessBoundary>
    </>
  );
}
