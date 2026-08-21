import type { LightingMode } from "@/lib/space/atlas-store";

export type SurfaceMaterialKind = "solar" | "survey" | "unlit" | "lit";

export function surfaceMaterialKind(
  isSun: boolean,
  selfLit: boolean,
  lightingMode: LightingMode,
): SurfaceMaterialKind {
  if (isSun) return "solar";
  if (selfLit) return "unlit";
  return lightingMode === "survey" ? "survey" : "lit";
}
