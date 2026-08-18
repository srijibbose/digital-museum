import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { StoryInstrument } from "@/components/becoming-human/StoryInstrument";
import { becomingHumanEpisodes, type BecomingHumanEpisode } from "@/content/becoming-human-story";

function episode(id: string) {
  const found = becomingHumanEpisodes.find((candidate) => candidate.id === id);
  if (!found) throw new Error("Missing story episode " + id);
  return found;
}

afterEach(cleanup);

describe("StoryInstrument", () => {
  it("provides a bespoke instrument for every high-value story episode", () => {
    const ids = [
      "shared-branch",
      "repeatable-edge",
      "three-histories-fire",
      "many-departures",
      "river-household",
      "shore-two-sides",
      "fossil-energy",
      "planetary-machine",
      "computer-enters-hand",
      "learned-patterns",
    ];

    for (const id of ids) {
      const { unmount } = render(<StoryInstrument episode={episode(id)} />);
      expect(document.querySelector("[data-story-instrument=\"" + id + "\"]")).toBeInTheDocument();
      expect(screen.getByText("INTERPRETIVE INSTRUMENT")).toBeInTheDocument();
      unmount();
    }
  });

  it("supports both the requested many-routes key and the canonical story key", () => {
    const routeEpisode: BecomingHumanEpisode = {
      ...episode("many-departures"),
      id: "many-routes",
    };
    render(<StoryInstrument episode={routeEpisode} />);

    expect(screen.getByRole("heading", { name: /single arrow/i })).toBeInTheDocument();
    expect(document.querySelector("[data-story-instrument=\"many-routes\"]")).toBeInTheDocument();
  });

  it("lets visitors replace the progress ladder without scoring them", () => {
    render(<StoryInstrument episode={episode("shared-branch")} />);

    expect(screen.getByText(/familiar march ranks bodies/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /branching model/i }));
    expect(screen.getByText(/every living species sits at a tip/i)).toBeInTheDocument();
    expect(screen.getByText(/no score/i)).toBeInTheDocument();
  });

  it("reveals the smartphone system when a dependency is removed", () => {
    render(<StoryInstrument episode={episode("computer-enters-hand")} />);

    const networkButton = screen.getByRole("button", { name: /networks.*connected/i });
    expect(networkButton).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(networkButton);
    expect(networkButton).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByText("STACK INCOMPLETE")).toBeInTheDocument();
    expect(screen.getByText(/cellular, Wi-Fi and Internet infrastructure/i)).toBeInTheDocument();
  });

  it("uses an evidence-boundary interaction and sources for every other episode", () => {
    const genericEpisode = episode("skull-at-threshold");
    render(<StoryInstrument episode={genericEpisode} />);

    fireEvent.click(screen.getByRole("button", { name: /where it stops/i }));
    expect(screen.getAllByText(genericEpisode.evidence.uncertainty).length).toBeGreaterThanOrEqual(2);
    expect(screen.getByRole("link", { name: genericEpisode.sources[0].label })).toHaveAttribute(
      "href",
      genericEpisode.sources[0].url,
    );
  });
});
