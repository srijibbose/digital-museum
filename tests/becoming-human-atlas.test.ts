import { describe, expect, it } from "vitest";
import {
  earthAgeYears,
  earthMilestones,
  earthPosition,
  episodePlaces,
  humanShareOfEarthHistory,
  humanTimeWindows,
  mapPosition,
} from "@/content/becoming-human-atlas";
import { becomingHumanEpisodes } from "@/content/becoming-human-story";

describe("Becoming Human time and place atlas", () => {
  it("shows deep time on a true scale before expanding selectable human history", () => {
    expect(earthAgeYears).toBe(4_540_000_000);
    expect(earthMilestones[0].yearsAgo).toBe(earthAgeYears);
    expect(earthPosition(earthAgeYears)).toBe(0);
    expect(earthPosition(0)).toBe(100);
    expect(humanShareOfEarthHistory).toBeGreaterThan(0.17);
    expect(humanShareOfEarthHistory).toBeLessThan(0.18);
    expect(humanTimeWindows[0].startOrder).toBe(1);
    expect(humanTimeWindows.at(-1)?.endOrder).toBe(becomingHumanEpisodes.length);
  });

  it("maps every story episode to a valid world coordinate", () => {
    expect(episodePlaces).toHaveLength(becomingHumanEpisodes.length);
    expect(episodePlaces.map((place) => place.episodeId)).toEqual(
      becomingHumanEpisodes.map((episode) => episode.id),
    );
    for (const place of episodePlaces) {
      const position = mapPosition(place.longitude, place.latitude);
      expect(position.left).toBeGreaterThanOrEqual(0);
      expect(position.left).toBeLessThanOrEqual(100);
      expect(position.top).toBeGreaterThanOrEqual(0);
      expect(position.top).toBeLessThanOrEqual(100);
    }
  });
});
