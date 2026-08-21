import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  atlasAssetPaths,
  atlasFeatureMedia,
  atlasModelLedger,
  atlasModelPaths,
  atlasTextureLedger,
  type AtlasAssetKey,
  type AtlasModelKey,
} from "@/content/space/atlas-assets";
import { atlas } from "@/content/space/atlas";

function publicPath(assetPath: string) {
  return path.join(process.cwd(), "public", assetPath.replace(/^\//, ""));
}

function isWebP(filePath: string) {
  const header = readFileSync(filePath).subarray(0, 12);
  return (
    header.subarray(0, 4).toString("ascii") === "RIFF" &&
    header.subarray(8, 12).toString("ascii") === "WEBP"
  );
}

function isGlb(filePath: string) {
  const header = readFileSync(filePath).subarray(0, 4);
  return header.toString("ascii") === "glTF";
}

describe("Atlas planetary assets", () => {
  it("bundles every declared texture as a valid local WebP", () => {
    const declared = new Set<string>();
    for (const assets of Object.values(atlasAssetPaths)) {
      declared.add(assets.color);
      declared.add(assets.fallback);
      if (assets.bump) declared.add(assets.bump);
      Object.values(assets.layers ?? {}).forEach((asset) => declared.add(asset));
    }

    expect(declared.size).toBe(23);
    for (const assetPath of declared) {
      const filePath = publicPath(assetPath);
      expect(existsSync(filePath), assetPath).toBe(true);
      const minimumBytes = assetPath.includes("-rings.webp") ? 2_000 : 10_000;
      expect(statSync(filePath).size, assetPath).toBeGreaterThan(minimumBytes);
      expect(isWebP(filePath), assetPath).toBe(true);
    }
  });

  it("records provenance and processing for every delivered texture", () => {
    const records = Object.entries(atlasTextureLedger) as Array<
      [AtlasAssetKey, NonNullable<(typeof atlasTextureLedger)[AtlasAssetKey]>]
    >;

    expect(records).toHaveLength(23);
    for (const [key, asset] of records) {
      expect(asset.path, key).toBe(`/media/space/atlas/${key}.webp`);
      expect(asset.sourceUrl, key).toMatch(/^https:\/\//);
      expect(asset.credit.length, key).toBeGreaterThan(8);
      expect(asset.processing.length, key).toBeGreaterThan(12);
      expect(asset.nativeDimensions, key).toMatch(/^\d+x\d+$/);
      expect(asset.deliveredDimensions, key).toMatch(/^\d+x\d+$/);
      expect(["observed", "processed", "inferred", "illustrative"]).toContain(
        asset.evidence,
      );
    }
  });

  it("bundles the authoritative NASA 3D source models used by supported worlds", () => {
    const models = Object.entries(atlasModelPaths) as Array<
      [AtlasModelKey, string]
    >;

    expect(models).toHaveLength(8);
    for (const [key, assetPath] of models) {
      const filePath = publicPath(assetPath);
      expect(existsSync(filePath), key).toBe(true);
      expect(statSync(filePath).size, key).toBeGreaterThan(100_000);
      expect(isGlb(filePath), key).toBe(true);
      expect(atlasModelLedger[key].path, key).toBe(assetPath);
      expect(atlasModelLedger[key].sourceUrl, key).toMatch(/^https:\/\//);
      expect(atlasModelLedger[key].credit.length, key).toBeGreaterThan(8);
      expect(atlasModelLedger[key].processing.length, key).toBeGreaterThan(12);
    }
  });

  it("bundles sourced feature-specific Field Guide media", () => {
    expect(Object.keys(atlasFeatureMedia)).toHaveLength(10);

    for (const [key, media] of Object.entries(atlasFeatureMedia)) {
      const filePath = publicPath(media.path);
      expect(media.path, key).toMatch(/^\/media\/space\/atlas\/features\/.+\.webp$/);
      expect(existsSync(filePath), key).toBe(true);
      expect(statSync(filePath).size, key).toBeGreaterThan(50_000);
      expect(isWebP(filePath), key).toBe(true);
      expect(media.sourceUrl, key).toMatch(/^https:\/\//);
      expect(media.credit.length, key).toBeGreaterThanOrEqual(8);
      expect(media.caption.length, key).toBeGreaterThan(20);
      expect(media.alt.length, key).toBeGreaterThan(20);
    }

    const delivered = atlas.worlds.flatMap((world) =>
      world.hotspots.flatMap((hotspot) => hotspot.media ? [hotspot.media.path] : []),
    );
    expect(new Set(delivered)).toEqual(new Set(Object.values(atlasFeatureMedia).map((media) => media.path)));
  });
});
