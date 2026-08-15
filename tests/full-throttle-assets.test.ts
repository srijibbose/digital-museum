import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  TURBOFAN_MODEL_URL,
  TURBOFAN_POSTER_URL,
  TURBOFAN_REQUIRED_NODES,
} from "@/app/exhibits/full-throttle/model-manifest";

const expectedNodes = [
  "fan",
  "lp_compressor",
  "hp_compressor",
  "combustor",
  "hp_turbine",
  "lp_turbine",
  "nozzle",
] as const;

function readGlbNodeNames(path: string) {
  const bytes = readFileSync(path);
  expect(bytes.toString("utf8", 0, 4)).toBe("glTF");

  const jsonChunkLength = bytes.readUInt32LE(12);
  const jsonChunkType = bytes.readUInt32LE(16);
  expect(jsonChunkType).toBe(0x4e4f534a);

  const document = JSON.parse(bytes.toString("utf8", 20, 20 + jsonChunkLength)) as {
    nodes?: Array<{ name?: string }>;
  };
  return (document.nodes ?? []).flatMap((node) => (node.name ? [node.name] : []));
}

describe("Full Throttle 3D assets", () => {
  it("publishes a detailed GLB and poster within the transfer budgets", () => {
    const modelPath = join(process.cwd(), "public", TURBOFAN_MODEL_URL);
    const posterPath = join(process.cwd(), "public", TURBOFAN_POSTER_URL);

    expect(existsSync(modelPath)).toBe(true);
    expect(existsSync(posterPath)).toBe(true);
    expect(statSync(modelPath).size).toBeLessThan(1_800_000);
    expect(statSync(posterPath).size).toBeLessThan(250_000);
  });

  it("preserves every primary component as one named top-level group", () => {
    const modelPath = join(process.cwd(), "public", TURBOFAN_MODEL_URL);
    const names = readGlbNodeNames(modelPath);

    expect(TURBOFAN_REQUIRED_NODES).toEqual(expectedNodes);
    for (const name of expectedNodes) {
      expect(names.filter((candidate) => candidate === name)).toHaveLength(1);
    }
  });

  it("exports the two spool shafts and cutaway support structure", () => {
    const modelPath = join(process.cwd(), "public", TURBOFAN_MODEL_URL);
    const names = readGlbNodeNames(modelPath);

    expect(names).toEqual(
      expect.arrayContaining(["lp_shaft", "hp_shaft", "core_case", "bypass_duct"]),
    );
  });
});
