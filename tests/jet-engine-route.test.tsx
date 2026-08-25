import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import JetEngineError from "@/app/exhibits/jet-engine/error";
import JetEngineLoading from "@/app/exhibits/jet-engine/loading";
import { metadata } from "@/app/exhibits/jet-engine/page";

describe("jet-engine route states", () => {
  it("describes the sourced 3D laboratory in route metadata", () => {
    expect(metadata.title).toMatch(/Interactive 3D Jet Engine Laboratory/);
    expect(metadata.description).toMatch(/NASA flow stations/);
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
