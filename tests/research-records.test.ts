import { describe, expect, it } from "vitest";

import { thirteenMinutesContent, thirteenMinutesSources } from "@/app/exhibits/thirteen-minutes/content";
import { anatomy } from "@/content/anatomy";
import { becomingHumanEpisodes } from "@/content/becoming-human-story";
import { jetEngine } from "@/content/jet-engine";
import {
  getResearchRecord,
  getResearchRecords,
  getResearchRecordsForExhibit,
  researchRecordPath,
} from "@/content/research-records";
import { atlas } from "@/content/space/atlas";
import {
  assertResearchRecord,
  type ResearchRecord,
} from "@/lib/seo/research-record-schema";

const expectedRecordSlugs = {
  "atlas-of-worlds": [
    "sun",
    "mercury",
    "venus",
    "earth",
    "moon",
    "mars",
    "jupiter",
    "saturn",
    "uranus",
    "neptune",
  ],
  "human-anatomy": [
    "cardiovascular",
    "respiratory",
    "digestive",
    "urinary",
    "nervous",
    "sensory",
    "immune",
    "musculoskeletal",
  ],
  "becoming-human": becomingHumanEpisodes.map(({ id }) => id),
  "jet-engine": ["station-0", "station-2", "station-f", "station-3", "station-4", "station-5", "station-8"],
  "thirteen-minutes": ["approach", "course-check", "program-alarm", "go-call", "manual-control", "touchdown"],
} as const;

const validRecord: ResearchRecord = {
  id: "atlas-of-worlds:test-record",
  exhibitSlug: "atlas-of-worlds",
  slug: "test-record",
  kind: "world",
  title: "A valid research record",
  eyebrow: "Atlas of Worlds · World",
  summary:
    "This deliberately substantial summary describes a valid research record fixture without relying on the implementation under test.",
  evidenceLabel: "Observed evidence",
  evidenceDetail:
    "The fixture states exactly what its evidence label means and keeps the representational limit visible beside the content.",
  sections: [
    {
      heading: "Developed account",
      body:
        "This developed section is intentionally long enough to represent a useful visitor-facing explanation. It contains more than a label or a search phrase and therefore exercises the record depth boundary directly.",
    },
  ],
  sources: [
    {
      title: "An authoritative source record",
      publisher: "Source institution",
      url: "https://example.com/research-record",
    },
  ],
  relatedIds: ["atlas-of-worlds:related-record"],
  lastModified: "2026-08-24",
};

describe("normalized public research records", () => {
  it("derives substantive records for every current exhibit", () => {
    const records = getResearchRecords();
    const groups = new Set(records.map((record) => record.exhibitSlug));

    expect(groups).toEqual(new Set([
      "atlas-of-worlds",
      "human-anatomy",
      "becoming-human",
      "jet-engine",
      "thirteen-minutes",
    ]));
    expect(records).toHaveLength(66);
  });

  it("preserves every exhibit's authored record order", () => {
    for (const [exhibitSlug, slugs] of Object.entries(expectedRecordSlugs)) {
      expect(getResearchRecordsForExhibit(exhibitSlug).map((record) => record.slug)).toEqual(slugs);
    }
  });

  it("gives every record unique canonical content", () => {
    const records = getResearchRecords();

    expect(new Set(records.map((record) => record.id)).size).toBe(records.length);
    expect(new Set(records.map((record) => researchRecordPath(record))).size).toBe(records.length);
    for (const record of records) {
      expect(record.id).toBe(`${record.exhibitSlug}:${record.slug}`);
      expect(researchRecordPath(record)).toBe(`/research/${record.exhibitSlug}/${record.slug}`);
      expect(record.title.length).toBeGreaterThan(5);
      expect(record.summary.length).toBeGreaterThan(80);
      expect(record.sections.length).toBeGreaterThan(0);
      expect(record.sections.some((section) => section.body.length > 120)).toBe(true);
      expect(record.evidenceDetail.length).toBeGreaterThan(40);
      expect(record.sources.length).toBeGreaterThan(0);
      expect(record.sources.every(({ url }) => /^https:\/\//u.test(url))).toBe(true);
    }
  });

  it("resolves only exact exhibit and record ownership", () => {
    const mars = getResearchRecord("atlas-of-worlds", "mars");

    expect(mars).toMatchObject({
      id: "atlas-of-worlds:mars",
      exhibitSlug: "atlas-of-worlds",
      slug: "mars",
      kind: "world",
    });
    expect(getResearchRecord("human-anatomy", "mars")).toBeUndefined();
    expect(getResearchRecord("atlas-of-worlds", "not-authored")).toBeUndefined();
    expect(getResearchRecordsForExhibit("not-an-exhibit")).toEqual([]);
  });

  it("keeps related records resolvable, adjacent, and inside their parent exhibit", () => {
    const records = getResearchRecords();
    const byId = new Map(records.map((record) => [record.id, record]));

    for (const record of records) {
      expect(record.relatedIds.length).toBeGreaterThan(0);
      for (const relatedId of record.relatedIds) {
        const related = byId.get(relatedId);
        expect(related, `${record.id} -> ${relatedId}`).toBeDefined();
        expect(related?.exhibitSlug).toBe(record.exhibitSlug);
      }
    }

    expect(getResearchRecord("atlas-of-worlds", "mars")?.relatedIds).toEqual([
      "atlas-of-worlds:moon",
      "atlas-of-worlds:jupiter",
    ]);
  });

  it("derives Atlas records from each world's authored evidence and source ledger", () => {
    for (const world of atlas.worlds) {
      const record = getResearchRecord("atlas-of-worlds", world.id);

      expect(record?.summary).toBe(world.overview);
      expect(record?.sections.some(({ body }) => body.includes(world.physical.gravity))).toBe(true);
      for (const hotspot of world.hotspots) {
        expect(record?.sections.some(({ body }) => body.includes(hotspot.detail))).toBe(true);
        expect(record?.evidenceDetail).toContain(`${hotspot.label}: ${hotspot.evidence}`);
      }
      expect(record?.sources.map(({ url }) => url)).toEqual(world.sources.map(({ url }) => url));
    }
  });

  it("derives Anatomy records from systems, named structures, and applicable sources", () => {
    const sourcesById = new Map(anatomy.sources.map((source) => [source.id, source]));
    const modelsByKey = new Map(anatomy.models.map((model) => [model.key, model]));

    for (const system of anatomy.systems) {
      const record = getResearchRecord("human-anatomy", system.id);
      const applicableIds = new Set([
        ...system.modelKeys.map((key) => modelsByKey.get(key)?.sourceId),
        ...system.structures.flatMap(({ sourceIds }) => sourceIds),
      ]);
      const applicableUrls = anatomy.sources
        .filter(({ id }) => applicableIds.has(id))
        .map(({ url }) => url);

      expect(record?.summary).toBe(system.overview);
      expect(record?.sections.some(({ body }) => body.includes(system.territory))).toBe(true);
      for (const structure of system.structures) {
        expect(record?.sections.some(({ body }) => body.includes(structure.detail))).toBe(true);
        expect(record?.evidenceDetail).toContain(`${structure.label}: ${structure.evidence}`);
        expect(structure.sourceIds.every((id) => sourcesById.has(id))).toBe(true);
      }
      expect(record?.sources.map(({ url }) => url)).toEqual(applicableUrls);
    }
  });

  it("derives Becoming Human records without weakening uncertainty or interaction limits", () => {
    for (const episode of becomingHumanEpisodes) {
      const record = getResearchRecord("becoming-human", episode.id);

      expect(record?.summary).toBe(episode.hook);
      expect(record?.sections.some(({ body }) => body.includes(episode.story))).toBe(true);
      expect(record?.sections.some(({ body }) => body.includes(episode.capability))).toBe(true);
      expect(record?.evidenceLabel).toContain(episode.evidence.status);
      expect(record?.evidenceDetail).toContain(episode.evidence.object);
      expect(record?.evidenceDetail).toContain(episode.evidence.uncertainty);
      if (episode.interaction.config.disclaimer) {
        expect(record?.evidenceDetail).toContain(episode.interaction.config.disclaimer);
      }
      expect(record?.sources.map(({ url }) => url)).toEqual(episode.sources.map(({ url }) => url));
    }
  });

  it("resolves each Jet Engine station's declared source identifiers", () => {
    for (const station of jetEngine.stations) {
      const record = getResearchRecord("jet-engine", `station-${station.id}`);
      const expectedSources = station.sourceIds.map((sourceId) => {
        const source = jetEngine.sources.find(({ id }) => id === sourceId);
        if (!source) throw new Error(`Missing fixture source ${sourceId}`);
        return source.url;
      });

      expect(record?.summary).toBe(station.summary);
      expect(record?.sections.some(({ body }) => body.includes(station.transformation))).toBe(true);
      expect(record?.sections.some(({ body }) => body.includes(station.interpretation))).toBe(true);
      expect(record?.evidenceLabel).toContain(station.evidence);
      expect(record?.evidenceDetail).toContain(jetEngine.modelNotice);
      expect(record?.evidenceDetail).toContain(jetEngine.reconstructionNotice);
      expect(record?.sources.map(({ url }) => url)).toEqual(expectedSources);
    }
  });

  it("uses one exported Apollo primary-source ledger for every mission beat", () => {
    expect(thirteenMinutesSources.map(({ url }) => url)).toEqual([
      "https://www.hq.nasa.gov/alsj/a11/a11.landing.html",
      "https://github.com/chrislgarry/Apollo-11",
      "https://www.nasa.gov/history/alsj/a11/a11.hamilton.html",
    ]);

    for (const beat of thirteenMinutesContent.beats) {
      const record = getResearchRecord("thirteen-minutes", beat.id);

      expect(record?.summary).toBe(beat.body);
      expect(record?.sections.some(({ body }) => body.includes(beat.met))).toBe(true);
      expect(record?.sections.some(({ body }) => body.includes(beat.altitude))).toBe(true);
      expect(record?.sections.some(({ body }) => body.includes(beat.fuel))).toBe(true);
      if (beat.quote) expect(record?.sections.some(({ body }) => body.includes(beat.quote))).toBe(true);
      expect(record?.evidenceDetail).toContain(thirteenMinutesContent.telemetryNote);
      expect(record?.sources.map(({ url }) => url)).toEqual(thirteenMinutesSources.map(({ url }) => url));
    }
  });

  it("returns deeply frozen deterministic records", () => {
    const first = getResearchRecords();
    const second = getResearchRecords();
    const record = first[0]!;

    expect(second).toBe(first);
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(record)).toBe(true);
    expect(Object.isFrozen(record.sections)).toBe(true);
    expect(Object.isFrozen(record.sections[0])).toBe(true);
    expect(Object.isFrozen(record.sources)).toBe(true);
    expect(Object.isFrozen(record.sources[0])).toBe(true);
    expect(Object.isFrozen(record.relatedIds)).toBe(true);
  });
});

describe("research record validation", () => {
  it("rejects thin records", () => {
    expect(() => assertResearchRecord({ ...validRecord, summary: "Too short." })).toThrow(/summary/i);
  });

  it("rejects source-free records and unsafe source URLs", () => {
    expect(() => assertResearchRecord({ ...validRecord, sources: [] })).toThrow(/source/i);
    expect(() => assertResearchRecord({
      ...validRecord,
      sources: [{ ...validRecord.sources[0]!, url: "javascript:alert(1)" }],
    })).toThrow(/source.*url/i);
  });

  it("rejects unsafe canonical and image paths", () => {
    expect(() => assertResearchRecord({ ...validRecord, slug: "../escape" })).toThrow(/slug/i);
    expect(() => assertResearchRecord({
      ...validRecord,
      image: { src: "/../private.txt", alt: "An invalid traversal image path" },
    })).toThrow(/image\.src/i);
  });

  it("rejects duplicate identities", () => {
    expect(() => assertResearchRecord({ ...validRecord }, [validRecord])).toThrow(/duplicate.*id/i);
  });

  it("rejects impossible calendar dates", () => {
    expect(() => assertResearchRecord({
      ...validRecord,
      lastModified: "2026-02-31",
    })).toThrow(/lastModified/i);
  });
});
