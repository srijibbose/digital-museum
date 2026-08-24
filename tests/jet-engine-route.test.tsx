import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import JetEngineError from "@/app/exhibits/jet-engine/error";
import JetEngineLoading from "@/app/exhibits/jet-engine/loading";
import { metadata } from "@/app/exhibits/jet-engine/page";
import { getExhibitBySlug } from "@/content/exhibits";

describe("jet-engine route states", () => {
  it("describes the sourced 3D laboratory from the exhibit registry", () => {
    const exhibit = getExhibitBySlug("jet-engine")!;

    expect(metadata.title).toBe(exhibit.title);
    expect(metadata.description).toBe(exhibit.synopsis);
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
