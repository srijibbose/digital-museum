import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { flowerExhibit } from "@/content/flowers";
import { FlowerFallback } from "@/components/flowers/FlowerFallback";

describe("flower exhibit fallback", () => {
  it("retains the sourced specimen and current chapter when WebGL is unavailable", () => {
    render(<FlowerFallback chapter={flowerExhibit.chapters[0]} />);

    expect(screen.getByRole("img", { name: /Smithsonian surface scan/i })).toHaveAttribute(
      "src",
      "/media/flowers/phalaenopsis-scan-fallback.png",
    );
    expect(screen.getByText("01 · Form")).toBeVisible();
    expect(screen.getByText(/Interactive 3D is unavailable/i)).toBeVisible();
  });

  it("distinguishes model failure from browser capability failure", () => {
    render(<FlowerFallback chapter={flowerExhibit.chapters[2]} reason="model" />);

    expect(screen.getByText("03 · Transfer")).toBeVisible();
    expect(screen.getByText(/model could not be decoded/i)).toBeVisible();
  });
});
