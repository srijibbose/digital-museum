import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { becomingHumanAssets } from "@/content/becoming-human-assets";
import { becomingHumanChapters, becomingHumanMotifs, becomingHumanStack } from "@/content/becoming-human";

describe("Becoming Human content system", () => {
  it("ships a complete, ordered 24-chapter narrative", () => {
    expect(becomingHumanChapters).toHaveLength(24);
    expect(becomingHumanChapters.map((chapter) => chapter.index)).toEqual(
      Array.from({ length: 24 }, (_, index) => index),
    );
    expect(new Set(becomingHumanChapters.map((chapter) => chapter.id)).size).toBe(24);
    expect(becomingHumanChapters[0].id).toBe("you-are-here");
    expect(becomingHumanChapters.at(-1)?.id).toBe("tools-that-model-us");
  });

  it("keeps every scientific claim connected to evidence, uncertainty, and a source", () => {
    for (const chapter of becomingHumanChapters) {
      expect(chapter.evidence.claim.length).toBeGreaterThan(20);
      expect(chapter.evidence.observed.length).toBeGreaterThan(20);
      expect(chapter.evidence.inferred.length).toBeGreaterThan(20);
      expect(chapter.evidence.unknown.length).toBeGreaterThan(20);
      expect(chapter.evidence.sourceUrl).toMatch(/^https:\/\//);
      expect(chapter.sceneDescription.length).toBeGreaterThan(30);
    }
  });

  it("locks the branch-not-ladder and biology-versus-culture thesis into visitor copy", () => {
    const branchChapter = becomingHumanChapters.find((chapter) => chapter.id === "family-branches");
    const finale = becomingHumanChapters.find((chapter) => chapter.id === "tools-that-model-us");
    expect(branchChapter?.hero).toContain("LADDER");
    expect(branchChapter?.narrative.join(" ")).toContain("chimpanzees alive today");
    expect(finale?.narrative.join(" ")).toContain("not a biological species");
    expect(becomingHumanStack).toHaveLength(6);
    expect(becomingHumanMotifs).toContain("FOOTPRINT");
    expect(becomingHumanMotifs).toContain("TOKEN");
  });

  it("records every runtime asset and keeps prototype gates explicit", () => {
    const licenseLedger = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "content", "becoming-human-asset-licenses.json"), "utf8"),
    );

    expect(licenseLedger).toEqual(becomingHumanAssets);
    expect(becomingHumanAssets).toHaveLength(47);
    expect(becomingHumanAssets.filter((asset) => asset.prototypeOnly)).toHaveLength(21);
    expect(becomingHumanAssets.filter((asset) => asset.runtimePath.endsWith(".glb") && !asset.prototypeOnly)).toHaveLength(0);
    expect(becomingHumanAssets.filter((asset) => asset.runtimePath.includes("/evidence/"))).toHaveLength(12);
    expect(becomingHumanAssets.filter((asset) => !asset.prototypeOnly && asset.runtimePath.includes("/chronicle/"))).toHaveLength(13);
    expect(becomingHumanAssets.some((asset) => asset.sourcePath.endsWith("becoming-human-v2-object-stage.blend"))).toBe(true);
    for (const asset of becomingHumanAssets) {
      expect(asset.commercialUse).toBe(true);
      const runtimeFile = path.join(process.cwd(), "public", asset.runtimePath.replace(/^\//, ""));
      const sourceFile = path.join(process.cwd(), asset.sourcePath);
      expect(fs.existsSync(runtimeFile), asset.runtimePath).toBe(true);
      expect(fs.existsSync(sourceFile), asset.sourcePath).toBe(true);
      expect(fs.statSync(runtimeFile).size, asset.runtimePath).toBeGreaterThan(10_000);
    }
  });
});
