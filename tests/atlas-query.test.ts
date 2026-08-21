import { describe, expect, it } from "vitest";
import { parseWorldQuery, worldQuery } from "@/lib/space/atlas-query";

describe("Atlas world query", () => {
  it("accepts a valid world and the first array value", () => {
    expect(parseWorldQuery("earth")).toBe("earth");
    expect(parseWorldQuery(["mars", "moon"])).toBe("mars");
  });

  it("falls back to Moon for absent or invalid values", () => {
    expect(parseWorldQuery(undefined)).toBe("moon");
    expect(parseWorldQuery("pluto")).toBe("moon");
    expect(parseWorldQuery([])).toBe("moon");
  });

  it("serializes a stable client-side query", () => {
    expect(worldQuery("neptune")).toBe("?world=neptune");
  });
});

