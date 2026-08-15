import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import FullThrottlePage from "@/app/exhibits/full-throttle/page";

describe("Full Throttle exhibit page", () => {
  it("opens with a distinct, semantic invitation into the engine", () => {
    render(<FullThrottlePage />);

    expect(screen.getByRole("heading", { level: 1, name: "Full Throttle" })).toBeVisible();
    expect(screen.getByRole("link", { name: /open the engine/i })).toHaveAttribute(
      "href",
      "#engine-lab",
    );
    expect(screen.getByText(/most of the air never touches the flame/i)).toBeVisible();
  });

  it("keeps learning content and source attribution available outside WebGL", () => {
    render(<FullThrottlePage />);

    expect(screen.getByRole("heading", { name: /seven parts\. two shafts/i })).toBeVisible();
    expect(screen.getByRole("heading", { name: /the fire is only the middle/i })).toBeVisible();
    expect(screen.getByRole("link", { name: /NASA Glenn's turbofan guide/i })).toHaveAttribute(
      "href",
      expect.stringContaining("grc.nasa.gov"),
    );
    expect(screen.getAllByRole("listitem")).not.toHaveLength(0);
  });
});
