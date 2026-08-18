import { describe, expect, it } from "vitest";

import {
  becomingHumanActs,
  becomingHumanClockTransition,
  becomingHumanEpisodes,
  becomingHumanFinale,
} from "@/content/becoming-human-story";

const wordCount = (value: string) => value.trim().split(/\s+/u).filter(Boolean).length;

const episodeCorpus = (id: string) => {
  const episode = becomingHumanEpisodes.find((candidate) => candidate.id === id);
  if (!episode) throw new Error("Missing episode " + id);

  return [
    episode.id,
    episode.title,
    episode.hook,
    episode.story,
    episode.capability,
    episode.evidence.object,
    episode.evidence.uncertainty,
    ...episode.mediaSearchTerms,
  ].join(" ").toLowerCase();
};

describe("Becoming Human story bible", () => {
  it("contains exactly 35 ordered episodes with stable, unique identities", () => {
    expect(becomingHumanEpisodes).toHaveLength(35);
    expect(becomingHumanEpisodes.map(({ order }) => order)).toEqual(
      Array.from({ length: 35 }, (_, index) => index + 1),
    );

    const ids = becomingHumanEpisodes.map(({ id }) => id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.at(0)).toBe("shared-branch");
    expect(ids.at(-1)).toBe("learned-patterns");
  });

  it("gives every episode substantial visitor copy, evidence nuance, sources, and an interaction", () => {
    for (const episode of becomingHumanEpisodes) {
      expect(wordCount(episode.story), episode.id + " story is too short").toBeGreaterThanOrEqual(80);
      expect(wordCount(episode.story), episode.id + " story is too long").toBeLessThanOrEqual(150);
      expect(episode.hook.length, episode.id + " hook").toBeGreaterThan(20);
      expect(episode.dateLabel.length, episode.id + " date").toBeGreaterThan(3);
      expect(episode.location.length, episode.id + " location").toBeGreaterThan(2);
      expect(episode.capability.length, episode.id + " capability").toBeGreaterThan(10);
      expect(episode.evidence.object.length, episode.id + " evidence object").toBeGreaterThan(10);
      expect(episode.evidence.uncertainty.length, episode.id + " uncertainty").toBeGreaterThan(20);
      expect(episode.sources.length, episode.id + " sources").toBeGreaterThanOrEqual(1);
      expect(episode.sources.every(({ url }) => url.startsWith("https://")), episode.id + " source URLs").toBe(true);
      expect(episode.interaction.config.prompt.length, episode.id + " interaction prompt").toBeGreaterThan(10);
      expect(episode.interaction.config.options.length, episode.id + " interaction options").toBeGreaterThanOrEqual(3);
      expect(episode.mediaSearchTerms.length, episode.id + " media terms").toBeGreaterThanOrEqual(3);
    }
  });

  it("groups every episode into eight sequential acts exactly once", () => {
    expect(becomingHumanActs).toHaveLength(8);
    expect(becomingHumanActs.map(({ order }) => order)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);

    const flattenedEpisodeIds = becomingHumanActs.flatMap(({ episodeIds }) => episodeIds);
    expect(flattenedEpisodeIds).toEqual(becomingHumanEpisodes.map(({ id }) => id));
    expect(new Set(flattenedEpisodeIds).size).toBe(35);

    for (const act of becomingHumanActs) {
      for (const episodeId of act.episodeIds) {
        expect(becomingHumanEpisodes.find(({ id }) => id === episodeId)?.actId).toBe(act.id);
      }
    }
  });

  it("makes the biology, gene-culture, culture, and technology clocks explicit", () => {
    expect(new Set(becomingHumanEpisodes.map(({ clock }) => clock))).toEqual(
      new Set(["biology", "gene-culture", "culture", "technology"]),
    );
    expect(becomingHumanClockTransition.afterEpisodeId).toBe("water-crossing");
    expect(becomingHumanClockTransition.label).toMatch(/biological evolution continues/i);
    expect(new Set(becomingHumanFinale.layers.map(({ clock }) => clock))).toEqual(
      new Set(["biology", "gene-culture", "culture", "technology"]),
    );
  });

  it("covers the required biological, cultural, and technological turning points", () => {
    const requiredCoverage: Array<[string, RegExp]> = [
      ["three-histories-fire", /finding fire|making fire|fire use/],
      ["projectiles-and-hunt", /hunting|hunt/],
      ["projectiles-and-hunt", /bow|projectile|spear/],
      ["river-household", /house|housing|settlement/],
      ["memory-leaves-brain", /writing|cuneiform|tablet/],
      ["shore-two-sides", /1492/],
      ["shore-two-sides", /indigenous peoples?.*(remain|surviv)|surviv.*indigenous/i],
      ["shore-two-sides", /invasion|enslavement|unequal power/],
      ["page-becomes-thousands", /printing|movable type|press/],
      ["fossil-energy", /industrial|coal|steam/],
      ["night-infrastructure", /electric|grid|generator/],
      ["planetary-machine", /world wide web|web proposed|web/],
      ["computer-enters-hand", /iphone.*2007|2007.*iphone/],
      ["learned-patterns", /artificial intelligence|machine learning|ai field/],
    ];

    for (const [episodeId, pattern] of requiredCoverage) {
      expect(episodeCorpus(episodeId), episodeId + " must cover " + pattern.source).toMatch(pattern);
    }
  });

  it("ends with responsibility rather than a progress ladder or a species claim", () => {
    expect(wordCount(becomingHumanFinale.story)).toBeGreaterThanOrEqual(80);
    expect(becomingHumanFinale.sources.length).toBeGreaterThan(1);
    expect(becomingHumanFinale.story).toMatch(/not a predetermined final stage/i);
    expect(becomingHumanFinale.story).toMatch(/responsibilit/i);
    expect(episodeCorpus("learned-patterns")).toMatch(/without becoming a biological species/i);
  });
});
