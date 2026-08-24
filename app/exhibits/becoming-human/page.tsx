import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { BecomingHumanV2Experience } from "@/components/becoming-human/BecomingHumanV2Experience";
import { JsonLd } from "@/components/seo/JsonLd";
import { getExhibitBySlug, isExhibitEnabled } from "@/content/exhibits";
import { createBreadcrumbGraph, createExhibitGraph } from "@/lib/seo/json-ld";
import { createExhibitMetadata } from "@/lib/seo/metadata";

const exhibitDefinition = getExhibitBySlug("becoming-human")!;

export const metadata: Metadata = createExhibitMetadata(exhibitDefinition);

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#030303",
};

export default function BecomingHumanPage() {
  if (!isExhibitEnabled("becoming-human")) notFound();
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
      <BecomingHumanV2Experience />
    </>
  );
}
