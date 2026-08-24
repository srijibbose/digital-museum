import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { researchRecordPath } from "@/content/research-records";
import { ResearchRecordPage } from "@/components/museum/ResearchRecordPage";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  listPublicResearchRecords,
  resolvePublicResearchRecord,
} from "@/lib/research/public-records";
import {
  createBreadcrumbGraph,
  createResearchRecordGraph,
} from "@/lib/seo/json-ld";
import { createResearchRecordMetadata } from "@/lib/seo/metadata";

type ResearchRecordRouteProps = {
  params: Promise<{ exhibit: string; record: string }>;
};

export function generateStaticParams() {
  return listPublicResearchRecords().map(({ record }) => ({
    exhibit: record.exhibitSlug,
    record: record.slug,
  }));
}

export async function generateMetadata({
  params,
}: ResearchRecordRouteProps): Promise<Metadata> {
  const { exhibit, record } = await params;
  const resolved = resolvePublicResearchRecord(exhibit, record);

  if (!resolved) notFound();
  return createResearchRecordMetadata(resolved.record);
}

export default async function ResearchRecordRoute({ params }: ResearchRecordRouteProps) {
  const { exhibit: exhibitSlug, record: recordSlug } = await params;
  const resolved = resolvePublicResearchRecord(exhibitSlug, recordSlug);

  if (!resolved) notFound();
  const { exhibit, record } = resolved;

  const relatedRecords = record.relatedIds.map((relatedId) => {
    const [relatedExhibit, relatedSlug] = relatedId.split(":");
    const related = resolvePublicResearchRecord(relatedExhibit!, relatedSlug!);
    if (!related) throw new Error(`Unresolved related research record: ${relatedId}`);
    return related.record;
  });
  const breadcrumbItems = [
    { name: "Home", pathname: "/" },
    { name: "Research", pathname: "/research" },
    { name: exhibit.title, pathname: exhibit.route },
    { name: record.title, pathname: researchRecordPath(record) },
  ] as const;

  return (
    <>
      <JsonLd data={createResearchRecordGraph(record)} />
      <JsonLd data={createBreadcrumbGraph(breadcrumbItems)} />
      <ResearchRecordPage
        record={record}
        exhibit={exhibit}
        relatedRecords={relatedRecords}
        breadcrumbItems={breadcrumbItems}
      />
    </>
  );
}
