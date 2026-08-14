import { describe, expect, it } from "vitest";
import { thirteenMinutesContent } from "@/app/exhibits/thirteen-minutes/content";

describe("Thirteen Minutes content", () => {
  it("contains the complete exhibit in mission order", () => {
    expect(thirteenMinutesContent.beats.map((beat) => beat.id)).toEqual([
      "approach",
      "course-check",
      "program-alarm",
      "go-call",
      "manual-control",
      "touchdown",
    ]);
    expect(thirteenMinutesContent.relatedExhibits).toHaveLength(2);
  });

  it("uses historically checked event telemetry and flags inferred fuel values", () => {
    expect(thirteenMinutesContent.beats[0]).toMatchObject({
      met: "102:33:05",
      altitude: "49,971 ft",
    });
    expect(thirteenMinutesContent.beats[2]).toMatchObject({
      met: "102:38:26",
      altitude: "33,500 ft",
    });
    expect(thirteenMinutesContent.beats[4]).toMatchObject({
      met: "102:43:22",
      altitude: "410 ft",
    });
    expect(thirteenMinutesContent.beats.at(-1)).toMatchObject({
      met: "102:45:40",
      altitude: "0 ft",
      fuel: "≈0:45",
    });
    expect(thirteenMinutesContent.beats.every((beat) => beat.fuel.startsWith("≈"))).toBe(true);
  });

  it("keeps the NASA transcript target unresolved instead of fabricating a link", () => {
    expect(thirteenMinutesContent.goDeeper).not.toHaveProperty("url");
    expect(thirteenMinutesContent.goDeeper.note).toMatch(/insert the real URL/i);
  });
});
