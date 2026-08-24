import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import JetEngineError from "@/app/exhibits/jet-engine/error";
import JetEngineLoading from "@/app/exhibits/jet-engine/loading";
import JetEnginePage, { metadata } from "@/app/exhibits/jet-engine/page";
import { getExhibitBySlug } from "@/content/exhibits";

describe("jet-engine route states", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("describes the sourced 3D laboratory from the exhibit registry", () => {
    const exhibit = getExhibitBySlug("jet-engine")!;

    expect(metadata.title).toBe(exhibit.title);
    expect(metadata.description).toBe(exhibit.synopsis);
  });

  it("places the interactive laboratory inside the access boundary", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: false }));

    const { container } = render(<JetEnginePage />);
    const memberContent = container.querySelector(".member-content");

    expect(memberContent).toContainElement(
      screen.getByRole("region", { name: "Jet Engine interactive exhibit" }),
    );
  });

  it("provides a labelled instant loading state", () => {
    render(<JetEngineLoading />);
    expect(screen.getByLabelText("Loading the interactive 3D jet engine laboratory")).toBeVisible();
  });

  it("provides a recoverable local error state", async () => {
    const user = userEvent.setup();
    const reset = vi.fn();
    render(<JetEngineError reset={reset} />);
    await user.click(screen.getByRole("button", { name: "Retry exhibit" }));
    expect(reset).toHaveBeenCalledOnce();
    expect(screen.getByRole("link", { name: "Return to museum" })).toHaveAttribute("href", "/");
  });
});
