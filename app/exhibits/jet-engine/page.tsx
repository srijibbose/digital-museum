import type { Metadata } from "next";
import JetEngineExperience from "@/components/jet-engine/JetEngineExperience";
import { JsonLd } from "@/components/seo/JsonLd";
import { getExhibitBySlug } from "@/content/exhibits";
import { createBreadcrumbGraph, createExhibitGraph } from "@/lib/seo/json-ld";
import { createExhibitMetadata } from "@/lib/seo/metadata";

const exhibitDefinition = getExhibitBySlug("jet-engine")!;

export const metadata: Metadata = createExhibitMetadata(exhibitDefinition);

export default function JetEnginePage() {
  return (
    <>
      <JsonLd
        data={[
          createExhibitGraph(exhibitDefinition),
          createBreadcrumbGraph([
            { name: "Exhibits", pathname: "/exhibits" },
            { name: exhibitDefinition.title, pathname: exhibitDefinition.route },
          ]),
        ]}
      />
      <JetEngineExperience />
    </>
  );
}
