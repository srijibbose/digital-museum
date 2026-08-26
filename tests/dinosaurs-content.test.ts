import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { dinosaurAssetManifest } from "@/content/dinosaur-assets";
import {
  dinosaurModes,
  dinosaurLifeModels,
  dinosaurSpecies,
  dinosaurSources,
  getDinosaurSources,
  getDinosaurSpecies,
} from "@/content/dinosaurs";

describe("Dinosaurs evidence atlas", () => {
  it("offers eight distinct institutional specimen records across dinosaur lineages", () => {
    expect(dinosaurSpecies.map((species) => species.id)).toEqual([
      "tyrannosaurus",
      "triceratops",
      "diplodocus",
      "plateosaurus",
      "protoceratops",
      "psittacosaurus",
      "allosaurus",
      "archaeopteryx",
    ]);
    expect(new Set(dinosaurSpecies.map((species) => species.specimen.institution)).size).toBeGreaterThanOrEqual(5);
    expect(dinosaurSpecies.every((species) => species.specimen.catalogue.length > 5)).toBe(true);
    expect(dinosaurSpecies.every((species) => species.specimen.sourceUrl.startsWith("https://"))).toBe(true);
  });

  it("keeps each scientific view meaningful and explicitly qualified", () => {
    expect(dinosaurModes.map((mode) => mode.id)).toEqual([
      "skeleton",
      "life",
      "trace",
      "anatomy",
      "lineage",
    ]);
    for (const species of dinosaurSpecies) {
      expect(species.boneRegions.length).toBeGreaterThanOrEqual(4);
      expect(species.anatomy.map((system) => system.id)).toEqual([
        "respiration",
        "circulation",
        "digestion",
      ]);
      expect(species.lineage.path.length).toBeGreaterThanOrEqual(4);
      expect(species.trace.caution.length).toBeGreaterThan(20);
    }
  });

  it("assigns every species a credited interactive life reconstruction", () => {
    const sourceIds = new Set(dinosaurSources.map((source) => source.id));
    for (const species of dinosaurSpecies) {
      const model = dinosaurLifeModels[species.id];
      expect(model.speciesId).toBe(species.id);
      expect(model.sketchfabUid).toHaveLength(32);
      expect(model.sourceUrl).toContain(model.sketchfabUid);
      expect(model.creator.length).toBeGreaterThan(2);
      expect(model.note).toMatch(/reconstruct|interpret|not preserved|open/i);
      expect(sourceIds.has(model.sourceId)).toBe(true);
    }
  });

  it("does not fabricate a species-wide lifespan from individual age evidence", () => {
    expect(
      dinosaurSpecies.every((species) => /unknown|uncertain|varied/i.test(species.ageRecord)),
    ).toBe(true);
    expect(dinosaurSpecies.every((species) => species.ageNote.length > 45)).toBe(true);
  });

  it("resolves every source and visibly retains model licensing", () => {
    const sourceIds = new Set(dinosaurSources.map((source) => source.id));
    for (const species of dinosaurSpecies) {
      expect(species.sourceIds.every((id) => sourceIds.has(id))).toBe(true);
      expect(species.specimen.license.length).toBeGreaterThan(4);
      expect(species.specimen.licenseUrl.startsWith("https://")).toBe(true);
    }
    expect(getDinosaurSpecies("missing").id).toBe("tyrannosaurus");
    expect(getDinosaurSources(["field-sue-model", "missing"]).map((source) => source.id)).toEqual([
      "field-sue-model",
    ]);
  });

  it("ships valid local institutional GLBs and a complete asset ledger", () => {
    const root = process.cwd();
    const localModels = dinosaurAssetManifest.filter((asset) => asset.localPath.endsWith(".glb"));
    expect(localModels).toHaveLength(2);
    for (const asset of localModels) {
      const file = path.join(root, "public", asset.localPath.replace(/^\//, ""));
      const bytes = fs.readFileSync(file);
      expect(bytes.subarray(0, 4).toString("ascii")).toBe("glTF");
      expect(bytes.length).toBeGreaterThan(500_000);
      expect(asset.processing).toMatch(/byte-for-byte/);
    }
    const previewPaths = new Set(
      dinosaurAssetManifest
        .filter((asset) => asset.localPath.endsWith(".jpg"))
        .map((asset) => asset.localPath),
    );
    expect(dinosaurSpecies.every((species) => previewPaths.has(species.specimen.preview))).toBe(true);

    const lifeReconstruction = dinosaurAssetManifest.find(
      (asset) => asset.id === "tyrannosaurus-life-reconstruction",
    );
    expect(lifeReconstruction).toMatchObject({
      evidence: "life-reconstruction",
      license: "CC BY 4.0",
      localPath: "/media/dinosaurs/specimens/tyrannosaurus-life-3d.jpg",
    });
    expect(
      fs.statSync(path.join(root, "public", lifeReconstruction!.localPath.replace(/^\//, ""))).size,
    ).toBeGreaterThan(100_000);
  });

  it("uses direct hosted 3D records for the six non-local specimens", () => {
    const hosted = dinosaurSpecies.filter((species) => species.specimen.provider === "sketchfab");
    expect(hosted).toHaveLength(6);
    expect(hosted.every((species) => species.specimen.sketchfabUid.length === 32)).toBe(true);
    expect(getDinosaurSpecies("allosaurus").specimen.sketchfabUid).toBe(
      "2193dcd84b694f659719b4b99c91228b",
    );
    expect(getDinosaurSpecies("archaeopteryx").specimen.sketchfabUid).toBe(
      "eea4d66eaad34adb80969d9939835d05",
    );
  });
});
