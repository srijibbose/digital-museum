import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  SevenSegmentValue,
  segmentsForCharacter,
} from "@/app/exhibits/thirteen-minutes/components/SevenSegmentValue";

describe("seven-segment telemetry", () => {
  it("catches a digit map that lights the wrong segments", () => {
    expect(segmentsForCharacter("1")).toEqual(["b", "c"]);
    expect(segmentsForCharacter("8")).toEqual(["a", "b", "c", "d", "e", "f", "g"]);
    expect(segmentsForCharacter(":" )).toEqual(["colon"]);
  });

  it("catches a visual digit treatment that makes the original value inaccessible", () => {
    render(<SevenSegmentValue value="102:33:05" />);

    expect(screen.getByLabelText("102:33:05")).toBeInTheDocument();
    expect(screen.getByLabelText("102:33:05")).toHaveAttribute("data-segment-display");
  });
});
