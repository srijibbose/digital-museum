import { describe, expect, it } from "vitest";
import { fullThrottleContent } from "@/app/exhibits/full-throttle/content";

describe("Full Throttle content", () => {
  it("teaches the seven canonical engine parts in physical order", () => {
    expect(fullThrottleContent.parts.map((part) => part.id)).toEqual([
      "fan",
      "lp-compressor",
      "hp-compressor",
      "combustor",
      "hp-turbine",
      "lp-turbine",
      "nozzle",
    ]);
    expect(new Set(fullThrottleContent.parts.map((part) => part.name)).size).toBe(7);
    expect(fullThrottleContent.parts.every((part) => part.body.length > 80)).toBe(true);
  });

  it("defines five ordered airflow stages and a separate free-play payoff", () => {
    expect(fullThrottleContent.airflowStages.map((stage) => stage.id)).toEqual([
      "intake-fan",
      "compression",
      "combustion",
      "turbine",
      "exhaust-thrust",
    ]);
    expect(fullThrottleContent.airflowStages.map((stage) => stage.progress)).toEqual([
      0,
      0.25,
      0.5,
      0.75,
      1,
    ]);
    expect(fullThrottleContent.throttle.title).toBe("Take the throttle");
  });

  it("ships real authoritative sources without unresolved publishing copy", () => {
    expect(fullThrottleContent.goDeeper.url).toMatch(/^https:\/\/www\.grc\.nasa\.gov\//);
    expect(fullThrottleContent.sources.length).toBeGreaterThanOrEqual(4);

    const serialized = JSON.stringify(fullThrottleContent);
    expect(serialized).not.toMatch(/TBD|TODO|insert a real|placeholder/i);
    expect(fullThrottleContent.sources.every((source) => source.url.startsWith("https://"))).toBe(
      true,
    );
  });

  it("labels the model as representative and keeps live instruments relative", () => {
    expect(fullThrottleContent.accuracyNote).toMatch(/representative two-spool/i);
    expect(fullThrottleContent.hud.map((readout) => readout.unit)).toEqual(["%", "%", "%"]);
  });
});
