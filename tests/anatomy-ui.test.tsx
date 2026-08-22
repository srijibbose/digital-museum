import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { anatomy, getAnatomySystem } from "@/content/anatomy";
import { AnatomyCommandDeck } from "@/components/anatomy/AnatomyCommandDeck";
import { StructureGuide } from "@/components/anatomy/StructureGuide";
import { SystemIndex } from "@/components/anatomy/SystemIndex";
import type { AnatomyModelKey } from "@/lib/anatomy/anatomy-schema";

const allLayers = Object.fromEntries(
  anatomy.models.map((model) => [model.key, true]),
) as Record<AnatomyModelKey, boolean>;

describe("human anatomy controls and explanations", () => {
  it("presents systems as actual selections", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <SystemIndex
        systems={anatomy.systems}
        activeSystemId="cardiovascular"
        onSelect={onSelect}
      />,
    );

    await user.click(screen.getByRole("button", { name: /respiratory/i }));
    expect(onSelect).toHaveBeenCalledWith("respiratory");
  });

  it("reveals formal terms only in the advanced layer", () => {
    const system = getAnatomySystem("cardiovascular");
    const structure = system.structures.find((item) => item.id === "left-ventricle")!;
    const view = anatomy.views[0];
    const { rerender } = render(
      <StructureGuide
        system={system}
        structure={structure}
        view={view}
        expertMode={false}
      />,
    );
    expect(screen.queryByText("FMA:7101")).not.toBeInTheDocument();

    rerender(
      <StructureGuide
        system={system}
        structure={structure}
        view={view}
        expertMode
      />,
    );
    expect(screen.getByText("FMA:7101")).toBeInTheDocument();
    expect(screen.getByText("UBERON:0002084")).toBeInTheDocument();
    expect(screen.getByText("Advanced evidence")).toBeInTheDocument();
    expect(screen.getByText("Source objects · 1")).toBeInTheDocument();
  });

  it("wires every visible command to a meaningful callback", async () => {
    const user = userEvent.setup();
    const onViewChange = vi.fn();
    const onLayerToggle = vi.fn();
    const onCameraCommand = vi.fn();
    render(
      <AnatomyCommandDeck
        system={getAnatomySystem("cardiovascular")}
        viewId="context"
        layers={allLayers}
        onViewChange={onViewChange}
        onLayerToggle={onLayerToggle}
        onCameraCommand={onCameraCommand}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Isolate" }));
    await user.click(screen.getByRole("button", { name: "Zoom in" }));
    await user.click(screen.getByText("Layers"));
    await user.click(screen.getByLabelText("Vessels"));

    expect(onViewChange).toHaveBeenCalledWith("isolate");
    expect(onCameraCommand).toHaveBeenCalledWith("zoom-in");
    expect(onLayerToggle).toHaveBeenCalledWith("vasculature");
  });

  it("hides unsupported pathway controls instead of exposing decorative modes", () => {
    render(
      <AnatomyCommandDeck
        system={getAnatomySystem("immune")}
        viewId="context"
        layers={allLayers}
        onViewChange={vi.fn()}
        onLayerToggle={vi.fn()}
        onCameraCommand={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "Isolate tissue" })).toBeVisible();
    expect(screen.queryByRole("button", { name: "Immune architecture" })).not.toBeInTheDocument();
  });
});
