import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { jetEngine } from "@/content/jet-engine";

describe("jet-engine curatorial content", () => {
  it("uses the published core station convention and a distinct fan exit", () => {
    expect(jetEngine.stations.map((station) => station.id)).toEqual(["0", "2", "f", "3", "4", "5", "8"]);
    expect(jetEngine.stations.find((station) => station.id === "f")?.stream).toBe("bypass");
    expect(jetEngine.stations.find((station) => station.id === "4")?.label).toMatch(/turbine inlet/i);
  });

  it("links every interpretation to an authoritative source", () => {
    const sourceIds = new Set(jetEngine.sources.map((source) => source.id));
    for (const station of jetEngine.stations) {
      expect(station.summary.length).toBeGreaterThan(70);
      expect(station.sourceIds.every((id) => sourceIds.has(id))).toBe(true);
    }
    for (const source of jetEngine.sources) {
      expect(new URL(source.url).hostname).toMatch(/(nasa\.gov|faa\.gov)$/);
      expect(source.use.length).toBeGreaterThan(30);
    }
  });

  it("labels every visual and numerical mode by evidence class", () => {
    expect(jetEngine.views.map((view) => view.evidence)).toEqual([
      "explanatory-reconstruction",
      "explanatory-reconstruction",
      "modelled-cycle",
      "modelled-cycle",
      "explanatory-reconstruction",
    ]);
    expect(jetEngine.reconstructionNotice).toMatch(/not a scan|not.*manufacturing/i);
    expect(jetEngine.modelNotice).toMatch(/not certified performance data/i);
  });

  it("keeps an attribution and processing ledger for the reconstruction and model", () => {
    const ledger = JSON.parse(
      readFileSync(join(process.cwd(), "content", "jet-engine-asset-licenses.json"), "utf8"),
    ) as Array<Record<string, string>>;
    expect(ledger.length).toBeGreaterThanOrEqual(3);
    for (const entry of ledger) {
      expect(entry.source).toMatch(/^https:\/\//);
      expect(entry.processing.length).toBeGreaterThan(120);
      expect(entry.classification).toMatch(/reconstruction|modelled cycle/i);
    }
    expect(ledger).toContainEqual(expect.objectContaining({
      path: "public/assets/jet-engine/turbofan-engine-optimized.glb",
      author: "blenderbirb",
      license: "CC BY 4.0",
    }));
  });

  it("ships the credited production GLB with embedded provenance and substantial geometry", () => {
    const glb = readFileSync(join(
      process.cwd(),
      "public",
      "assets",
      "jet-engine",
      "turbofan-engine-optimized.glb",
    ));
    expect(glb.subarray(0, 4).toString("ascii")).toBe("glTF");
    expect(glb.byteLength).toBeGreaterThan(10_000_000);

    const jsonChunkLength = glb.readUInt32LE(12);
    const document = JSON.parse(
      glb.subarray(20, 20 + jsonChunkLength).toString("utf8").replaceAll("\u0000", "").trim(),
    ) as {
      asset: { extras: { author: string; license: string; source: string } };
      accessors: Array<{ count: number }>;
      meshes: Array<{ primitives: Array<{ indices: number }> }>;
    };
    const triangleCount = document.meshes.reduce(
      (total, mesh) => total + mesh.primitives.reduce(
        (meshTotal, primitive) => meshTotal + document.accessors[primitive.indices]!.count / 3,
        0,
      ),
      0,
    );
    expect(document.asset.extras.author).toMatch(/blenderbirb/i);
    expect(document.asset.extras.license).toMatch(/CC-BY-4\.0/i);
    expect(document.asset.extras.source).toMatch(/^https:\/\/sketchfab\.com/);
    expect(triangleCount).toBeGreaterThan(200_000);
  });
});
