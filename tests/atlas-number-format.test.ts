import { describe, expect, it } from "vitest";
import { formatAtlasInteger } from "@/lib/space/number-format";

describe("Atlas number formatting", () => {
  it("uses a stable grouping style during server and client rendering", () => {
    expect(formatAtlasInteger(347850)).toBe("347,850");
  });
});
