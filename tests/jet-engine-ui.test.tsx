import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { getJetStation } from "@/content/jet-engine";
import { FlowStationRail } from "@/components/jet-engine/FlowStationRail";
import { JetCommandDeck } from "@/components/jet-engine/JetCommandDeck";
import { StationGuide } from "@/components/jet-engine/StationGuide";
import { calculateJetCycle } from "@/lib/jet-engine/jet-engine-model";

const cruise = calculateJetCycle("cruise");

describe("jet-engine controls and notebook", () => {
  it("treats every flow station as a real selection", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<FlowStationRail selectedId="2" cycle={cruise} onSelect={onSelect} />);
    await user.click(screen.getByRole("button", { name: /Turbine exit/i }));
    expect(onSelect).toHaveBeenCalledWith("5");
  });

  it("wires all scientific views and operating profiles to callbacks", async () => {
    const user = userEvent.setup();
    const onProfileChange = vi.fn();
    const onViewChange = vi.fn();
    render(
      <JetCommandDeck
        profileId="cruise"
        viewId="section"
        cycle={cruise}
        onProfileChange={onProfileChange}
        onViewChange={onViewChange}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Thermal" }));
    await user.click(screen.getByRole("button", { name: /Takeoff/ }));
    expect(onViewChange).toHaveBeenCalledWith("thermal");
    expect(onProfileChange).toHaveBeenCalledWith("takeoff");
    expect(screen.getByText(/N·s\/kg inlet air/)).toBeVisible();
  });

  it("keeps evidence, sources, interpretation, and model limits beside the selected station", () => {
    render(
      <StationGuide
        station={getJetStation("4")}
        cycle={cruise}
        sourceOpen
        onSourceOpenChange={vi.fn()}
      />,
    );
    expect(screen.getByText("Modelled result")).toBeVisible();
    expect(screen.getByRole("heading", { name: "What changes here" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Why it matters" })).toBeVisible();
    expect(screen.getByText(/Gas Turbine Schematic and Station Numbers/)).toBeVisible();
    expect(screen.getByText(/Model method & limits/)).toBeVisible();
  });
});
