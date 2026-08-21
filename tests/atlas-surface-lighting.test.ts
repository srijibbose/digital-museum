import { describe, expect, it } from "vitest";
import { surfaceMaterialKind } from "@/lib/space/surface-lighting";

describe("Atlas surface lighting", () => {
  it("uses a fully legible reference material for Survey light", () => {
    expect(surfaceMaterialKind(false, false, "survey")).toBe("survey");
    expect(surfaceMaterialKind(false, false, "natural")).toBe("lit");
    expect(surfaceMaterialKind(true, true, "natural")).toBe("solar");
    expect(surfaceMaterialKind(false, true, "natural")).toBe("unlit");
  });
});
