import { describe, expect, it } from "vitest";
import { solarDiscUv } from "@/lib/space/solar-projection";

describe("Atlas solar-disc projection", () => {
  it("keeps the full visible hemisphere inside the observed central solar disc", () => {
    expect(solarDiscUv(0, 0)).toEqual({ u: 0.5, v: 0.5 });
    expect(solarDiscUv(-1, -1)).toEqual({ u: 0.358, v: 0.776 });
    expect(solarDiscUv(1, 1)).toEqual({ u: 0.642, v: 0.224 });
  });
});
