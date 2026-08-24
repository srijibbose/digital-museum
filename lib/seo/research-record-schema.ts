export type ResearchRecordSource = {
  readonly title: string;
  readonly publisher?: string;
  readonly url: string;
};

export type ResearchRecordSection = {
  readonly heading: string;
  readonly body: string;
};

export type ResearchRecord = {
  readonly id: string;
  readonly exhibitSlug: string;
  readonly slug: string;
  readonly kind: "world" | "anatomy-system" | "human-episode" | "flow-station" | "mission-beat";
  readonly title: string;
  readonly eyebrow: string;
  readonly summary: string;
  readonly evidenceLabel: string;
  readonly evidenceDetail: string;
  readonly sections: readonly ResearchRecordSection[];
  readonly sources: readonly ResearchRecordSource[];
  readonly image?: {
    readonly src: string;
    readonly alt: string;
    readonly credit?: string;
  };
  readonly relatedIds: readonly string[];
  readonly lastModified: string;
};

const SAFE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;
const SAFE_RECORD_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*:[a-z0-9]+(?:-[a-z0-9]+)*$/u;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/u;
const RESEARCH_RECORD_KINDS = new Set<ResearchRecord["kind"]>([
  "world",
  "anatomy-system",
  "human-episode",
  "flow-station",
  "mission-beat",
]);

function fail(record: Pick<ResearchRecord, "id">, field: string, detail: string): never {
  throw new Error(`Invalid research record ${record.id || "<missing id>"}: ${field} ${detail}`);
}

function assertSafeSlug(record: ResearchRecord, field: "exhibitSlug" | "slug") {
  if (!SAFE_SLUG.test(record[field])) {
    fail(record, field, "must be a lowercase, path-safe slug");
  }
}

function assertHttpsUrl(record: ResearchRecord, field: string, url: string) {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    fail(record, field, "must be a valid URL");
  }
  if (parsed.protocol !== "https:") {
    fail(record, field, "must use HTTPS");
  }
}

function canonicalPath(record: Pick<ResearchRecord, "exhibitSlug" | "slug">) {
  return `/research/${record.exhibitSlug}/${record.slug}`;
}

export function assertResearchRecord(
  record: ResearchRecord,
  existingRecords: readonly ResearchRecord[] = [],
): asserts record is ResearchRecord {
  assertSafeSlug(record, "exhibitSlug");
  assertSafeSlug(record, "slug");

  if (!SAFE_RECORD_ID.test(record.id) || record.id !== `${record.exhibitSlug}:${record.slug}`) {
    fail(record, "id", "must exactly combine exhibitSlug and slug");
  }
  if (!RESEARCH_RECORD_KINDS.has(record.kind)) fail(record, "kind", "is unsupported");
  if (record.title.trim().length <= 5) fail(record, "title", "is too short");
  if (record.eyebrow.trim().length < 6) fail(record, "eyebrow", "is too short");
  if (record.summary.trim().length <= 80) fail(record, "summary", "is too short");
  if (record.evidenceLabel.trim().length < 3) fail(record, "evidenceLabel", "is too short");
  if (record.evidenceDetail.trim().length <= 40) fail(record, "evidenceDetail", "is too short");

  if (record.sections.length === 0) fail(record, "sections", "must not be empty");
  record.sections.forEach((section, index) => {
    if (section.heading.trim().length < 3) fail(record, `sections[${index}].heading`, "is too short");
    if (section.body.trim().length < 40) fail(record, `sections[${index}].body`, "is too short");
  });
  if (!record.sections.some((section) => section.body.trim().length > 120)) {
    fail(record, "sections", "must include a developed body longer than 120 characters");
  }

  if (record.sources.length === 0) fail(record, "sources", "must not be empty");
  const sourceUrls = new Set<string>();
  record.sources.forEach((source, index) => {
    if (source.title.trim().length < 4) fail(record, `sources[${index}].title`, "is too short");
    if (source.publisher !== undefined && source.publisher.trim().length < 2) {
      fail(record, `sources[${index}].publisher`, "is too short");
    }
    assertHttpsUrl(record, `source URL at sources[${index}]`, source.url);
    if (sourceUrls.has(source.url)) fail(record, `sources[${index}].url`, "is duplicated");
    sourceUrls.add(source.url);
  });

  if (record.image) {
    let decodedImagePath = "";
    try {
      decodedImagePath = decodeURIComponent(record.image.src);
    } catch {
      fail(record, "image.src", "must be a valid encoded path");
    }
    const imageSegments = decodedImagePath.split("/");
    if (
      !decodedImagePath.startsWith("/")
      || decodedImagePath.startsWith("//")
      || decodedImagePath.includes("\\")
      || imageSegments.some((segment) => segment === "." || segment === "..")
    ) {
      fail(record, "image.src", "must be a safe root-relative public path");
    }
    if (record.image.alt.trim().length < 20) fail(record, "image.alt", "is too short");
    if (record.image.credit !== undefined && record.image.credit.trim().length < 2) {
      fail(record, "image.credit", "is too short");
    }
  }

  if (record.relatedIds.length === 0) fail(record, "relatedIds", "must not be empty");
  const relatedIds = new Set<string>();
  record.relatedIds.forEach((relatedId, index) => {
    if (!SAFE_RECORD_ID.test(relatedId)) fail(record, `relatedIds[${index}]`, "is unsafe");
    if (relatedId === record.id) fail(record, `relatedIds[${index}]`, "must not reference itself");
    if (relatedIds.has(relatedId)) fail(record, `relatedIds[${index}]`, "is duplicated");
    relatedIds.add(relatedId);
  });

  const lastModifiedTimestamp = Date.parse(`${record.lastModified}T00:00:00Z`);
  if (
    !ISO_DATE.test(record.lastModified)
    || Number.isNaN(lastModifiedTimestamp)
    || new Date(lastModifiedTimestamp).toISOString().slice(0, 10) !== record.lastModified
  ) {
    fail(record, "lastModified", "must be a valid ISO calendar date");
  }

  if (existingRecords.some((existing) => existing.id === record.id)) {
    fail(record, "duplicate id", `matches ${record.id}`);
  }
  if (existingRecords.some((existing) => canonicalPath(existing) === canonicalPath(record))) {
    fail(record, "duplicate path", `matches ${canonicalPath(record)}`);
  }
}

export function assertResearchRecords(records: readonly ResearchRecord[]): void {
  records.forEach((record, index) => assertResearchRecord(record, records.slice(0, index)));

  const recordsById = new Map(records.map((record) => [record.id, record]));
  for (const record of records) {
    for (const relatedId of record.relatedIds) {
      const related = recordsById.get(relatedId);
      if (!related) fail(record, "relatedIds", `contains unresolved id ${relatedId}`);
      if (related.exhibitSlug !== record.exhibitSlug) {
        fail(record, "relatedIds", `crosses exhibit ownership with ${relatedId}`);
      }
    }
  }
}
