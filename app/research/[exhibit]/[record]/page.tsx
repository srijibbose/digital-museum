import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getExhibitBySlug } from "@/content/exhibits";
import {
  getResearchRecord,
  getResearchRecords,
  researchRecordPath,
} from "@/content/research-records";
import { ResearchRecordPage } from "@/components/museum/ResearchRecordPage";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  createBreadcrumbGraph,
  createResearchRecordGraph,
} from "@/lib/seo/json-ld";
import { createResearchRecordMetadata } from "@/lib/seo/metadata";

type ResearchRecordRouteProps = {
  params: Promise<{ exhibit: string; record: string }>;
};

export function generateStaticParams() {
  return getResearchRecords().map(({ exhibitSlug, slug }) => ({
    exhibit: exhibitSlug,
    record: slug,
  }));
}

export async function generateMetadata({
  params,
}: ResearchRecordRouteProps): Promise<Metadata> {
  const { exhibit, record } = await params;
  const researchRecord = getResearchRecord(exhibit, record);

  return researchRecord ? createResearchRecordMetadata(researchRecord) : {};
}

export default async function ResearchRecordRoute({ params }: ResearchRecordRouteProps) {
  const { exhibit: exhibitSlug, record: recordSlug } = await params;
  const record = getResearchRecord(exhibitSlug, recordSlug);
  const exhibit = getExhibitBySlug(exhibitSlug);

  if (!record || !exhibit || !exhibit.enabled || exhibit.access.mode === "private") {
    notFound();
  }

  const relatedRecords = record.relatedIds.map((relatedId) => {
    const [relatedExhibit, relatedSlug] = relatedId.split(":");
    const related = getResearchRecord(relatedExhibit!, relatedSlug!);
    if (!related) throw new Error(`Unresolved related research record: ${relatedId}`);
    return related;
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
