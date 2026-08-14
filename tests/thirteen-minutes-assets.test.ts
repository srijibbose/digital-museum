import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { EAGLE_MODEL } from "@/app/exhibits/thirteen-minutes/model-manifest";
import { ARCHIVAL_MEDIA } from "@/app/exhibits/thirteen-minutes/media-manifest";

const publicFile = (url: string) =>
  path.join(process.cwd(), "public", url.replace(/^\//, ""));

describe("Thirteen Minutes 3D assets", () => {
  it("catches a model manifest that loses the independently addressable Eagle parts", () => {
    expect(EAGLE_MODEL.src).toBe("/models/eagle-low-poly.glb");
    expect(EAGLE_MODEL.poster).toBe("/images/eagle-descent-poster.webp");
    expect(EAGLE_MODEL.requiredNodes).toEqual([
      "AscentStage",
      "DescentStage",
      "LandingLegs",
      "EngineBell",
      "RadarDish",
      "Ladder",
    ]);
  });

  it("catches a missing, invalid, or oversized GLB before the route ships", async () => {
    const modelPath = publicFile(EAGLE_MODEL.src);
    const modelStat = await stat(modelPath);
    const header = await readFile(modelPath).then((buffer) =>
      buffer.subarray(0, 4).toString("ascii"),
    );

    expect(header).toBe("glTF");
    expect(modelStat.size).toBeGreaterThan(20_000);
    expect(modelStat.size).toBeLessThan(1_500_000);
  });

  it("catches a missing or empty first-paint poster", async () => {
    const posterStat = await stat(publicFile(EAGLE_MODEL.poster));

    expect(posterStat.size).toBeGreaterThan(40_000);
    expect(posterStat.size).toBeLessThan(500_000);
  });
});

describe("Thirteen Minutes archival media", () => {
  it("keeps the two official NASA stills local, credited, and lightweight", async () => {
    expect(ARCHIVAL_MEDIA).toHaveLength(2);

    for (const item of ARCHIVAL_MEDIA) {
      expect(item.credit).toBe("NASA");
      expect(item.sourceUrl).toMatch(/^https:\/\/(?:www\.|science\.)?nasa\.gov\//);
      expect(item.alt.length).toBeGreaterThan(24);

      const mediaStat = await stat(publicFile(item.src));
      expect(mediaStat.size).toBeGreaterThan(50_000);
      expect(mediaStat.size).toBeLessThan(600_000);
    }
  });
});
