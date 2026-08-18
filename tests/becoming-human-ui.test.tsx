import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BecomingHumanV2Experience } from "@/components/becoming-human/BecomingHumanV2Experience";

describe("Becoming Human cinematic atlas", () => {
  it("moves from a visitor prediction into discrete evidence-led scenes", async () => {
    window.localStorage.clear();
    window.history.replaceState(null, "", "/exhibits/becoming-human");
    render(<BecomingHumanV2Experience />);

    expect(screen.getByRole("heading", { level: 1, name: "BECOMINGHUMAN" })).toBeInTheDocument();
    expect(screen.getByText(/What changed fastest/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /THE SYSTEMS BETWEEN US/i }));
    fireEvent.click(screen.getByRole("button", { name: /BEGIN QUIET/i }));

    expect(await screen.findByRole("heading", { level: 1, name: "The Human Lineage Begins" })).toBeInTheDocument();
    expect(screen.getByText(/A new evolutionary lineage began/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /SEE THE EVIDENCE/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Next episode" }));
    expect(await screen.findByRole("heading", { level: 1, name: "Possible Early Upright Walking" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 1, name: "The Human Lineage Begins" })).not.toBeInTheDocument();
  });

  it("exposes a research atlas and a no-score learning instrument", async () => {
    window.localStorage.clear();
    window.history.replaceState(null, "", "/exhibits/becoming-human");
    render(<BecomingHumanV2Experience />);
    fireEvent.click(screen.getByRole("button", { name: /BEGIN QUIET/i }));

    fireEvent.click(await screen.findByRole("button", { name: "MAP" }));
    const atlas = screen.getByRole("dialog", { name: "Research atlas" });
    expect(within(atlas).getByRole("heading", { name: /Eight stages/i })).toBeInTheDocument();
    expect(within(atlas).getByRole("button", { name: /35.*AI Learns from Human Data/i })).toBeInTheDocument();

    fireEvent.click(within(atlas).getByRole("button", { name: "Close panel" }));
    fireEvent.click(screen.getByRole("button", { name: /EXPLORE THIS STEP/i }));
    const instrument = await screen.findByRole("dialog", { name: /The Human Lineage Begins instrument/i });
    expect(within(instrument).getByText("NO SCORE · CHANGE YOUR VIEW")).toBeInTheDocument();
    expect(within(instrument).getByRole("heading", { name: /Replace the ladder/i })).toBeInTheDocument();
  });
});
