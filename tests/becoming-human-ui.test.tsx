import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BecomingHumanV2Experience } from "@/components/becoming-human/BecomingHumanV2Experience";

function renderExperienceWithEditionTarget() {
  return render(
    <>
      <BecomingHumanV2Experience />
      <section id="becoming-human-reading-edition" tabIndex={-1}>
        <h2>Public research edition</h2>
      </section>
    </>,
  );
}

describe("Becoming Human cinematic atlas", () => {
  it("keeps the entry in document flow and sends keyboard visitors to the edition", async () => {
    window.localStorage.clear();
    window.history.replaceState(null, "", "/exhibits/becoming-human");
    document.documentElement.style.overflow = "";
    const scrollIntoView = vi.fn();
    const originalScrollIntoView = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = scrollIntoView;

    try {
      const { container } = renderExperienceWithEditionTarget();
      const entry = screen.getByRole("region", { name: "Becoming Human cinematic entry" });
      const edition = container.querySelector("#becoming-human-reading-edition") as HTMLElement;

      expect(document.documentElement.style.overflow).toBe("");
      expect(entry).toHaveAttribute("data-cinematic-state", "entry");
      expect(within(entry).getByRole("link", { name: "Read the complete research edition" }))
        .toHaveAttribute("href", "#becoming-human-reading-edition");

      fireEvent.click(
        within(entry).getByRole("link", { name: "Read the complete research edition" }),
      );

      await waitFor(() => expect(document.activeElement).toBe(edition));
      expect(scrollIntoView).toHaveBeenCalled();
      expect(window.location.hash).toBe("#becoming-human-reading-edition");
      expect(document.documentElement.style.overflow).toBe("");
    } finally {
      Element.prototype.scrollIntoView = originalScrollIntoView;
    }
  });

  it("locks overflow only during the cinematic and restores it when reading", async () => {
    window.localStorage.clear();
    window.history.replaceState(null, "", "/exhibits/becoming-human");
    document.documentElement.style.overflow = "";
    const scrollIntoView = vi.fn();
    const originalScrollIntoView = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = scrollIntoView;

    try {
      const { container } = renderExperienceWithEditionTarget();
      fireEvent.click(screen.getByRole("button", { name: /BEGIN QUIET/i }));

      expect(await screen.findByRole("region", { name: "Becoming Human cinematic exhibit" }))
        .toHaveAttribute("data-cinematic-state", "started");
      await waitFor(() => expect(document.documentElement.style.overflow).toBe("hidden"));

      fireEvent.click(
        screen.getByRole("link", { name: "Read the complete research edition" }),
      );

      const edition = container.querySelector("#becoming-human-reading-edition") as HTMLElement;
      await waitFor(() => expect(document.activeElement).toBe(edition));
      expect(document.documentElement.style.overflow).toBe("");
      expect(screen.getByRole("region", { name: "Becoming Human cinematic entry" })).toBeVisible();
      expect(window.location.hash).toBe("#becoming-human-reading-edition");
    } finally {
      Element.prototype.scrollIntoView = originalScrollIntoView;
    }
  });

  it("honors real reading and episode fragments after hydration", async () => {
    window.localStorage.clear();
    document.documentElement.style.overflow = "";
    window.history.replaceState(
      null,
      "",
      "/exhibits/becoming-human#becoming-human-reading-edition",
    );
    const { unmount } = renderExperienceWithEditionTarget();

    expect(screen.getByRole("region", { name: "Becoming Human cinematic entry" })).toBeVisible();
    expect(document.documentElement.style.overflow).toBe("");
    unmount();

    window.history.replaceState(
      null,
      "",
      "/exhibits/becoming-human#episode-trackmakers",
    );
    renderExperienceWithEditionTarget();

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "Footprints Prove Two-Legged Walking",
      }),
    ).toBeVisible();
    await waitFor(() => expect(document.documentElement.style.overflow).toBe("hidden"));
  });

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
  }, 15_000);

  it("exposes a research atlas and a no-score learning instrument", async () => {
    window.localStorage.clear();
    window.history.replaceState(null, "", "/exhibits/becoming-human");
    render(<BecomingHumanV2Experience />);
    fireEvent.click(screen.getByRole("button", { name: /BEGIN QUIET/i }));

    fireEvent.click(await screen.findByRole("button", { name: "TIME" }));
    const atlas = screen.getByRole("dialog", { name: "Research atlas" });
    expect(within(atlas).getByRole("heading", { name: /Humans arrived.*very recently/i })).toBeInTheDocument();
    expect(within(atlas).getByText(/4.54 billion years old/i)).toBeInTheDocument();
    fireEvent.click(within(atlas).getByRole("button", { name: "STORY" }));
    expect(within(atlas).getByRole("heading", { name: /Eight stages/i })).toBeInTheDocument();
    expect(within(atlas).getByRole("button", { name: /35.*AI Learns from Human Data/i })).toBeInTheDocument();

    fireEvent.click(within(atlas).getByRole("button", { name: "Close panel" }));
    fireEvent.click(screen.getByRole("button", { name: /EXPLORE THIS STEP/i }));
    const instrument = await screen.findByRole("dialog", { name: /The Human Lineage Begins instrument/i });
    expect(within(instrument).getByText("NO SCORE · CHANGE YOUR VIEW")).toBeInTheDocument();
    expect(within(instrument).getByRole("heading", { name: /Replace the ladder/i })).toBeInTheDocument();
  }, 15_000);

  it("opens a navigable geographic view of the story", async () => {
    window.localStorage.clear();
    window.history.replaceState(null, "", "/exhibits/becoming-human");
    render(<BecomingHumanV2Experience />);
    fireEvent.click(screen.getByRole("button", { name: /BEGIN QUIET/i }));

    fireEvent.click(await screen.findByRole("button", { name: "MAP" }));
    const atlas = screen.getByRole("dialog", { name: "Research atlas" });
    expect(within(atlas).getByRole("heading", { name: /The story moves.*across the planet/i })).toBeInTheDocument();
    expect(within(atlas).getByRole("button", { name: /04.*Footprints Prove Two-Legged Walking.*Laetoli/i })).toBeInTheDocument();
  }, 15_000);
});
