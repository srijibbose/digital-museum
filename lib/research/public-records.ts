import {
  EXHIBIT_REGISTRY,
  getExhibitBySlug,
  type ExhibitDefinition,
} from "@/content/exhibits";
import {
  getResearchRecord,
  getResearchRecordsForExhibit,
  type ResearchRecord,
} from "@/content/research-records";
import { isPubliclyDiscoverable } from "@/lib/auth/exhibit-access";

export type PublicResearchRecord = {
  readonly exhibit: ExhibitDefinition;
  readonly record: ResearchRecord;
};

function resolvePublicExhibit(exhibitSlug: string) {
  const exhibit = getExhibitBySlug(exhibitSlug);
  return exhibit && isPubliclyDiscoverable(exhibit) ? exhibit : undefined;
}

export function resolvePublicResearchRecord(
  exhibitSlug: string,
  recordSlug: string,
): PublicResearchRecord | undefined {
  const exhibit = resolvePublicExhibit(exhibitSlug);
  const record = getResearchRecord(exhibitSlug, recordSlug);

  return exhibit && record ? { exhibit, record } : undefined;
}

export function listPublicResearchRecords(): PublicResearchRecord[] {
  return [...EXHIBIT_REGISTRY]
    .sort((left, right) => left.order - right.order)
    .flatMap((candidate) => {
      const exhibit = resolvePublicExhibit(candidate.slug);
      if (!exhibit) return [];

      return getResearchRecordsForExhibit(exhibit.slug).map((record) => ({
        exhibit,
        record,
      }));
    });
}

export function listPublicResearchRecordsForExhibit(
  exhibitSlug: string,
): ResearchRecord[] {
  const exhibit = resolvePublicExhibit(exhibitSlug);
  return exhibit ? [...getResearchRecordsForExhibit(exhibit.slug)] : [];
}
