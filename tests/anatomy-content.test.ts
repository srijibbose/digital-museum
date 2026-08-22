import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  anatomy,
  getAnatomyStructure,
  getAnatomySystem,
  structureForMesh,
  structureMatchesMesh,
} from "@/content/anatomy";

function glbMeshNames(modelPath: string) {
  const localPath = join(process.cwd(), "public", modelPath.replace(/^\//, ""));
  const binary = readFileSync(localPath);
  const jsonLength = binary.readUInt32LE(12);
  const document = JSON.parse(
    binary.subarray(20, 20 + jsonLength).toString("utf8").replace(/\0/g, ""),
  ) as { meshes?: Array<{ name?: string }> };
  return (document.meshes ?? []).map((mesh) => mesh.name ?? "");
}

describe("human anatomy scientific content", () => {
  it("ships a coherent first release with registered source models", () => {
    expect(anatomy.systems.map((system) => system.id)).toEqual([
      "cardiovascular",
      "respiratory",
      "digestive",
      "urinary",
      "nervous",
      "sensory",
      "immune",
      "musculoskeletal",
    ]);
    expect(anatomy.models.map((model) => model.key)).toEqual([
      "heart",
      "lung",
      "vasculature",
      "liver",
      "pancreas",
      "small-intestine",
      "large-intestine",
      "kidney-left",
      "kidney-right",
      "ureter-left",
      "ureter-right",
      "urinary-bladder",
      "urethra",
      "brain",
      "spinal-cord",
      "eye-left",
      "eye-right",
      "spleen",
      "thymus",
      "lymph-node",
      "skeleton-full",
    ]);

    for (const model of anatomy.models) {
      const localPath = join(process.cwd(), "public", model.path.replace(/^\//, ""));
      expect(existsSync(localPath), `${model.path} should be delivered locally`).toBe(true);
      expect(statSync(localPath).size).toBeGreaterThan(50_000);
      expect(model.processing).toMatch(/source|preserved|addressable|registration|converted/i);
    }
  });

  it("maps exact HRA mesh names to visitor-facing structures", () => {
    expect(
      structureForMesh(
        "cardiovascular",
        "heart",
        "VH_M_heart_left_ventricle",
      )?.id,
    ).toBe("left-ventricle");
    expect(
      structureForMesh(
        "cardiovascular",
        "vasculature",
        "VH_M_left_coronary_artery",
      )?.id,
    ).toBe("coronary-vessels");
    expect(
      structureForMesh("respiratory", "lung", "VH_M_carina")?.id,
    ).toBe("carina");
    expect(
      structureForMesh(
        "respiratory",
        "lung",
        "VH_M_right_main_bronchus",
      )?.id,
    ).toBe("main-bronchi");
    expect(
      structureForMesh("digestive", "liver", "VH_M_porta_hepatis")?.id,
    ).toBe("porta-hepatis");
    expect(
      structureForMesh("digestive", "large-intestine", "VH_M_vermiform_appendix")?.id,
    ).toBe("appendix");
    expect(
      structureForMesh("urinary", "kidney-left", "VH_M_outer_cortex_of_kidney_L")?.id,
    ).toBe("renal-cortex");
    expect(
      structureForMesh("urinary", "urinary-bladder", "VH_M_trigone_of_urinary_bladder")?.id,
    ).toBe("bladder-trigone");
    expect(
      structureForMesh("nervous", "brain", "Allen_body_of_hippocampus_R")?.id,
    ).toBe("temporal-memory-regions");
    expect(
      structureForMesh("sensory", "eye-left", "VH_M_fovea_L")?.id,
    ).toBe("macula-and-fovea");
    expect(
      structureForMesh("immune", "lymph-node", "Yao_paracortex")?.id,
    ).toBe("lymph-node-paracortex");
    expect(
      structureForMesh("musculoskeletal", "skeleton-full", "left_femur")?.id,
    ).toBe("lower-limbs");
    expect(
      structureForMesh("musculoskeletal", "skeleton-full", "seventh_thoracic_vertebra")?.id,
    ).toBe("vertebral-column");
  });

  it("keeps every structure selector connected to at least one delivered source mesh", () => {
    const namesByModel = new Map(
      anatomy.models.map((model) => [model.key, glbMeshNames(model.path)]),
    );

    for (const system of anatomy.systems) {
      for (const structure of system.structures) {
        const matches = structure.selectors.some((selector) =>
          (namesByModel.get(selector.model) ?? []).some((name) =>
            structureMatchesMesh(structure, selector.model, name),
          ),
        );
        expect(matches, `${system.id}/${structure.id} should address a delivered mesh`).toBe(true);
      }
    }
  });

  it("keeps each explanation source-linked and formally qualified", () => {
    const sourceIds = new Set(anatomy.sources.map((source) => source.id));
    for (const system of anatomy.systems) {
      expect(getAnatomySystem(system.id).overview.length).toBeGreaterThan(80);
      for (const structure of system.structures) {
        expect(structure.detail.length).toBeGreaterThan(80);
        expect(structure.relationship.length).toBeGreaterThan(40);
        expect(structure.sourceIds.every((id) => sourceIds.has(id))).toBe(true);
      }
    }
    expect(getAnatomyStructure("cardiovascular", "left-ventricle")?.formalTerms.fma).toBe(
      "FMA:7101",
    );
  });

  it("keeps a public attribution ledger for every delivered model and fallback", () => {
    const ledgerPath = join(process.cwd(), "content", "anatomy-asset-licenses.json");
    const ledger = JSON.parse(readFileSync(ledgerPath, "utf8")) as Array<{
      path: string;
      license: string;
      source: string;
      processing: string;
    }>;
    const entries = new Map(ledger.map((entry) => [entry.path, entry]));
    const deliveredPaths = new Set([
      ...anatomy.models.map((model) => model.path),
      ...anatomy.systems.map((system) => system.fallback),
    ]);

    for (const path of deliveredPaths) {
      const entry = entries.get(path);
      expect(entry, `${path} should have an attribution record`).toBeDefined();
      expect(["CC BY 4.0", "CC BY-SA 2.1 Japan"]).toContain(entry?.license);
      expect(entry?.source).toMatch(/^https:\/\//);
      expect(entry?.processing.length).toBeGreaterThan(40);
    }
  });
});
