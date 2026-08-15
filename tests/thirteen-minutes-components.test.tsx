import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BeatSection } from "@/app/exhibits/thirteen-minutes/components/BeatSection";
import { MissionHud } from "@/app/exhibits/thirteen-minutes/components/MissionHud";
import { ProgressRail } from "@/app/exhibits/thirteen-minutes/components/ProgressRail";
import type { ExhibitBeat } from "@/app/exhibits/thirteen-minutes/types";

const beat: ExhibitBeat = {
  id: "test-beat",
  label: "Test beat",
  met: "001:02:03",
  altitude: "42 ft",
  fuel: "≈1:00",
  body: "The system keeps its critical work running.",
  quote: "Keep going.",
};

describe("MissionHud", () => {
  it("catches a reusable HUD that drops a supplied telemetry value", () => {
    render(
      <MissionHud
        telemetry={beat}
        activeLabel={beat.label}
        beatNumber={1}
        beatCount={2}
        animate
      />,
    );

    const hud = screen.getByTestId("mission-hud");
    expect(hud).toHaveAccessibleName(/mission telemetry/i);
    expect(hud).toHaveAttribute("data-animate", "true");
    expect(screen.getByLabelText("001:02:03")).toHaveAttribute("data-segment-display");
    expect(screen.getByLabelText("42 ft")).toHaveAttribute("data-segment-display");
    expect(screen.getByLabelText("≈1:00")).toHaveAttribute("data-segment-display");
    expect(screen.getByText("Test beat")).toBeInTheDocument();
  });
});

describe("BeatSection", () => {
  it("catches a no-JS fallback that loses local telemetry or transcript copy", () => {
    render(<BeatSection beat={beat} ordinal={1} active setElement={() => undefined} />);

    const section = screen.getByTestId("beat-test-beat");
    expect(section).toHaveAttribute("data-active", "true");
    expect(screen.getByRole("heading", { name: "Test beat" })).toBeInTheDocument();
    expect(screen.getByText("The system keeps its critical work running.")).toBeInTheDocument();
    expect(screen.getByText("Keep going.").closest("blockquote")).not.toBeNull();
    expect(screen.getByLabelText(/test beat static telemetry/i)).toHaveTextContent("001:02:03");
  });
});

describe("ProgressRail", () => {
  it("catches a progress control that cannot select a supplied beat", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(
      <ProgressRail
        beats={[
          { id: "approach", label: "Approach" },
          { id: "alarm", label: "Program alarm" },
        ]}
        activeIndex={0}
        onSelect={onSelect}
      />,
    );

    expect(screen.getByText("Tap a chapter to jump")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /go to approach/i })).toHaveAttribute(
      "aria-current",
      "step",
    );
    await user.click(screen.getByRole("button", { name: /go to program alarm/i }));
    expect(onSelect).toHaveBeenCalledWith(1);
  });
});
