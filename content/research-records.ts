import { thirteenMinutesContent, thirteenMinutesSources } from "@/app/exhibits/thirteen-minutes/content";
import { anatomy } from "@/content/anatomy";
import { becomingHumanEpisodes } from "@/content/becoming-human-story";
import { jetEngine } from "@/content/jet-engine";
import { atlas } from "@/content/space/atlas";
import {
  assertResearchRecords,
  type ResearchRecord,
  type ResearchRecordSource,
} from "@/lib/seo/research-record-schema";

export type {
  ResearchRecord,
  ResearchRecordSection,
  ResearchRecordSource,
} from "@/lib/seo/research-record-schema";

const LAST_MODIFIED = "2026-08-24";
const EMPTY_RECORDS = Object.freeze([]) as readonly ResearchRecord[];

function unique<T>(values: readonly T[]) {
  return [...new Set(values)];
}

function uniqueSources(sources: readonly ResearchRecordSource[]) {
  const seen = new Set<string>();
  return sources.filter((source) => {
    if (seen.has(source.url)) return false;
    seen.add(source.url);
    return true;
  });
}

function relatedIds(exhibitSlug: string, slugs: readonly string[], index: number) {
  return [slugs[index - 1], slugs[index + 1]]
    .filter((slug): slug is string => slug !== undefined)
    .map((slug) => `${exhibitSlug}:${slug}`);
}

function evidenceLabel(statuses: readonly string[]) {
  return unique(statuses).join(" · ");
}

function atlasRecords(): ResearchRecord[] {
  const exhibitSlug = "atlas-of-worlds";
  const slugs = atlas.worlds.map(({ id }) => id);

  return atlas.worlds.map((world, index) => ({
    id: `${exhibitSlug}:${world.id}`,
    exhibitSlug,
    slug: world.id,
    kind: "world",
    title: `${world.name} — ${world.classification}`,
    eyebrow: `${atlas.title} · ${world.orderLabel}`,
    summary: world.overview,
    evidenceLabel: evidenceLabel([
      ...world.modes.map(({ evidence }) => evidence),
      ...world.hotspots.map(({ evidence }) => evidence),
    ]),
    evidenceDetail: [
      `Mode evidence — ${world.modes.map((mode) => `${mode.label}: ${mode.evidence}`).join("; ")}.`,
      `Named-feature evidence — ${world.hotspots.map((hotspot) => `${hotspot.label}: ${hotspot.evidence}`).join("; ")}.`,
      `Coordinate confidence — ${world.hotspots.map((hotspot) => `${hotspot.label}: ${hotspot.coordinateConfidence}`).join("; ")}.`,
    ].join(" "),
    sections: [
      {
        heading: "Physical context",
        body: [
          `Classification: ${world.classification}. Physical type: ${world.physical.type}.`,
          `Mean radius: ${world.physical.radiusKm.toLocaleString("en-US")} kilometres. Surface gravity: ${world.physical.gravity}.`,
          `Day length: ${world.physical.dayLength}. Mean temperature: ${world.physical.meanTemperature}. Distance context: ${world.physical.distance}.`,
        ].join(" "),
      },
      {
        heading: "Ways of seeing",
        body: world.modes
          .map((mode) => `${mode.label} [${mode.evidence}]: ${mode.description} ${mode.visibleChange}`)
          .join(" "),
      },
      ...world.hotspots.map((hotspot) => ({
        heading: hotspot.label,
        body: [
          hotspot.summary,
          hotspot.detail,
          `Evidence: ${hotspot.evidence}; coordinate confidence: ${hotspot.coordinateConfidence}.`,
          `Measurements: ${hotspot.measurements.map(({ label, value }) => `${label}: ${value}`).join("; ")}.`,
        ].join(" "),
      })),
    ],
    sources: uniqueSources(world.sources.map((source) => ({
      title: source.title,
      publisher: source.publisher,
      url: source.url,
    }))),
    relatedIds: relatedIds(exhibitSlug, slugs, index),
    lastModified: LAST_MODIFIED,
  }));
}

function anatomyRecords(): ResearchRecord[] {
  const exhibitSlug = "human-anatomy";
  const slugs = anatomy.systems.map(({ id }) => id);
  const modelsByKey = new Map(anatomy.models.map((model) => [model.key, model]));

  return anatomy.systems.map((system, index) => {
    const sourceIds = new Set<string>();
    for (const modelKey of system.modelKeys) {
      const model = modelsByKey.get(modelKey);
      if (!model) throw new Error(`Unknown anatomy model ${modelKey} for ${system.id}`);
      sourceIds.add(model.sourceId);
    }
    for (const structure of system.structures) {
      for (const sourceId of structure.sourceIds) sourceIds.add(sourceId);
    }

    return {
      id: `${exhibitSlug}:${system.id}`,
      exhibitSlug,
      slug: system.id,
      kind: "anatomy-system",
      title: system.label,
      eyebrow: `${anatomy.title} · System ${system.index}`,
      summary: system.overview,
      evidenceLabel: evidenceLabel(system.structures.map(({ evidence }) => evidence)),
      evidenceDetail: [
        `Structure evidence — ${system.structures.map((structure) => `${structure.label}: ${structure.evidence}`).join("; ")}.`,
        `View evidence — ${anatomy.views.filter((view) => system.availableViews.includes(view.id)).map((view) => `${view.label}: ${view.evidence}`).join("; ")}.`,
      ].join(" "),
      sections: [
        {
          heading: "System territory",
          body: [
            system.thesis,
            `Anatomical territory: ${system.territory}.`,
            `Available views: ${anatomy.views.filter((view) => system.availableViews.includes(view.id)).map((view) => `${view.label} — ${view.description} ${view.visibleChange}`).join(" ")}`,
          ].join(" "),
        },
        ...system.structures.map((structure) => ({
          heading: structure.label,
          body: [
            structure.summary,
            structure.detail,
            structure.relationship,
            `Evidence: ${structure.evidence}.`,
            Object.values(structure.formalTerms).some(Boolean)
              ? `Formal terms: ${Object.values(structure.formalTerms).filter(Boolean).join("; ")}.`
              : "",
          ].filter(Boolean).join(" "),
        })),
      ],
      sources: anatomy.sources
        .filter((source) => sourceIds.has(source.id))
        .map((source) => ({
          title: source.title,
          publisher: source.publisher,
          url: source.url,
        })),
      relatedIds: relatedIds(exhibitSlug, slugs, index),
      lastModified: LAST_MODIFIED,
    } satisfies ResearchRecord;
  });
}

function becomingHumanRecords(): ResearchRecord[] {
  const exhibitSlug = "becoming-human";
  const slugs = becomingHumanEpisodes.map(({ id }) => id);

  return becomingHumanEpisodes.map((episode, index) => ({
    id: `${exhibitSlug}:${episode.id}`,
    exhibitSlug,
    slug: episode.id,
    kind: "human-episode",
    title: episode.title,
    eyebrow: `Becoming Human · ${episode.dateLabel}`,
    summary: episode.hook,
    evidenceLabel: episode.evidence.status,
    evidenceDetail: [
      `Evidence object: ${episode.evidence.object}.`,
      `Evidence status: ${episode.evidence.status}.`,
      `Uncertainty: ${episode.evidence.uncertainty}`,
      episode.interaction.config.disclaimer
        ? `Interaction limit: ${episode.interaction.config.disclaimer}`
        : "",
    ].filter(Boolean).join(" "),
    sections: [
      {
        heading: "Episode account",
        body: episode.story,
      },
      {
        heading: "Capability and inquiry",
        body: [
          `Capability: ${episode.capability}`,
          `Inquiry: ${episode.interaction.config.prompt}`,
          `Inspection choices: ${episode.interaction.config.options.join("; ")}.`,
          episode.interaction.config.disclaimer
            ? `Limit: ${episode.interaction.config.disclaimer}`
            : "",
        ].filter(Boolean).join(" "),
      },
    ],
    sources: uniqueSources(episode.sources.map((source) => ({
      title: source.label,
      url: source.url,
    }))),
    relatedIds: relatedIds(exhibitSlug, slugs, index),
    lastModified: LAST_MODIFIED,
  }));
}

function jetEngineRecords(): ResearchRecord[] {
  const exhibitSlug = "jet-engine";
  const slugs = jetEngine.stations.map(({ id }) => `station-${id}`);
  const sourcesById = new Map(jetEngine.sources.map((source) => [source.id, source]));

  return jetEngine.stations.map((station, index) => {
    const sources = station.sourceIds.map((sourceId) => {
      const source = sourcesById.get(sourceId);
      if (!source) throw new Error(`Unknown jet-engine source ${sourceId} for station ${station.id}`);
      return {
        title: source.title,
        publisher: source.organization,
        url: source.url,
      };
    });
    const slug = slugs[index]!;

    return {
      id: `${exhibitSlug}:${slug}`,
      exhibitSlug,
      slug,
      kind: "flow-station",
      title: `${station.shortLabel} — Station ${station.number}`,
      eyebrow: `${jetEngine.title} · ${station.stream} stream`,
      summary: station.summary,
      evidenceLabel: station.evidence,
      evidenceDetail: [
        `Station evidence: ${station.evidence}.`,
        jetEngine.reconstructionNotice,
        jetEngine.modelNotice,
      ].join(" "),
      sections: [
        {
          heading: "Flow transformation",
          body: `${station.transformation} ${station.interpretation}`,
        },
        {
          heading: "How this station fits the engine",
          body: `${jetEngine.thesis} ${station.summary}`,
        },
      ],
      sources: uniqueSources(sources),
      relatedIds: relatedIds(exhibitSlug, slugs, index),
      lastModified: LAST_MODIFIED,
    } satisfies ResearchRecord;
  });
}

function thirteenMinutesRecords(): ResearchRecord[] {
  const exhibitSlug = "thirteen-minutes";
  const slugs = thirteenMinutesContent.beats.map(({ id }) => id);
  const sources = thirteenMinutesSources.map((source) => ({
    title: source.title,
    publisher: source.publisher,
    url: source.url,
  }));

  return thirteenMinutesContent.beats.map((beat, index) => ({
    id: `${exhibitSlug}:${beat.id}`,
    exhibitSlug,
    slug: beat.id,
    kind: "mission-beat",
    title: beat.label,
    eyebrow: `${thirteenMinutesContent.title} · Mission elapsed time ${beat.met}`,
    summary: beat.body,
    evidenceLabel: "mission record · inferred fuel estimate",
    evidenceDetail: thirteenMinutesContent.telemetryNote,
    sections: [
      {
        heading: "Descent record",
        body: [
          `Mission elapsed time: ${beat.met}. Altitude: ${beat.altitude}. Approximate fuel time: ${beat.fuel}.`,
          beat.body,
          beat.quote ? `Recorded words: “${beat.quote}”` : "",
        ].filter(Boolean).join(" "),
      },
    ],
    sources,
    relatedIds: relatedIds(exhibitSlug, slugs, index),
    lastModified: LAST_MODIFIED,
  }));
}

function deepFreeze<T>(value: T): T {
  if (value === null || typeof value !== "object" || Object.isFrozen(value)) return value;

  for (const child of Object.values(value as Record<string, unknown>)) deepFreeze(child);
  return Object.freeze(value);
}

const recordDrafts: ResearchRecord[] = [
  ...atlasRecords(),
  ...anatomyRecords(),
  ...becomingHumanRecords(),
  ...jetEngineRecords(),
  ...thirteenMinutesRecords(),
];

assertResearchRecords(recordDrafts);

const RESEARCH_RECORDS = deepFreeze(recordDrafts) as readonly ResearchRecord[];
const RECORDS_BY_ID = new Map(RESEARCH_RECORDS.map((record) => [record.id, record]));
const RECORDS_BY_EXHIBIT = new Map<string, readonly ResearchRecord[]>();

for (const record of RESEARCH_RECORDS) {
  if (RECORDS_BY_EXHIBIT.has(record.exhibitSlug)) continue;
  RECORDS_BY_EXHIBIT.set(
    record.exhibitSlug,
    deepFreeze(RESEARCH_RECORDS.filter((candidate) => candidate.exhibitSlug === record.exhibitSlug)),
  );
}

export function getResearchRecords() {
  return RESEARCH_RECORDS;
}

export function getResearchRecordsForExhibit(exhibitSlug: string) {
  return RECORDS_BY_EXHIBIT.get(exhibitSlug) ?? EMPTY_RECORDS;
}

export function getResearchRecord(exhibitSlug: string, recordSlug: string) {
  return RECORDS_BY_ID.get(`${exhibitSlug}:${recordSlug}`);
}

export function researchRecordPath(record: Pick<ResearchRecord, "exhibitSlug" | "slug">) {
  return `/research/${record.exhibitSlug}/${record.slug}`;
}
