import { describe, expect, it } from "vitest";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { flowerExhibit, getFlowerChapter } from "@/content/flowers";

describe("The Work of Flowers content record", () => {
  it("keeps the five-part biological sequence complete and ordered", () => {
    expect(flowerExhibit.chapters.map((chapter) => chapter.id)).toEqual([
      "form",
      "inside",
      "transfer",
      "fertilisation",
      "outcome",
    ]);
    expect(flowerExhibit.chapters.every((chapter) => chapter.observations.length >= 3)).toBe(
      true,
    );
  });

  it("distinguishes the observed specimen from every reconstruction", () => {
    expect(getFlowerChapter("form").evidence).toBe("observed-scan");
    expect(
      flowerExhibit.chapters
        .slice(1)
        .every((chapter) => chapter.evidence.includes("reconstruction")),
    ).toBe(true);
  });

  it("provides a usable source trail and local licensed model", () => {
    expect(flowerExhibit.specimen.modelPath).toBe(
      "/models/flowers/phalaenopsis-amabilis-smithsonian.glb",
    );
    expect(flowerExhibit.specimen.rights).toBe("CC0");
    expect(flowerExhibit.sources.map((source) => source.id)).toEqual(
      expect.arrayContaining([
        "smithsonian-model",
        "kew-taxon",
        "orchid-pollinia",
        "orchid-microct",
        "phalaenopsis-breeding",
      ]),
    );
    expect(flowerExhibit.sources.every((source) => source.url.startsWith("https://"))).toBe(
      true,
    );

    const model = join(process.cwd(), "public", flowerExhibit.specimen.modelPath);
    const fallback = join(
      process.cwd(),
      "public",
      "media",
      "flowers",
      "phalaenopsis-scan-fallback.png",
    );
    expect(existsSync(model)).toBe(true);
    expect(statSync(model).size).toBeGreaterThan(100_000);
    expect(existsSync(fallback)).toBe(true);
    expect(statSync(fallback).size).toBeGreaterThan(10_000);
  });
});
