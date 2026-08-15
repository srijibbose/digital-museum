import { describe, expect, it } from "vitest";
import { centeredBeatIndex } from "@/app/exhibits/thirteen-minutes/scroll-state";

describe("Thirteen Minutes restored-scroll state", () => {
  it("initializes the beat whose section contains the viewport center", () => {
    expect(
      centeredBeatIndex(
        [
          { top: -1038, bottom: -127 },
          { top: -127, bottom: 785 },
          { top: 785, bottom: 1696 },
        ],
        844,
      ),
    ).toBe(1);
  });

  it("returns no beat when the viewport center is outside the walkthrough", () => {
    expect(centeredBeatIndex([{ top: 900, bottom: 1800 }], 844)).toBeNull();
  });
});
