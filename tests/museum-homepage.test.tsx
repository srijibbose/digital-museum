import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import MuseumLobby from "@/app/page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe("museum homepage", () => {
  it("states what Loupe is and makes catalog search the primary journey", () => {
    render(<MuseumLobby />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "A digital museum for exploring how the world works.",
      }),
    ).toBeVisible();
    expect(
      screen.getByText(
        "Enter interactive, source-grounded exhibits on the human body, machines, space, and human history.",
      ),
    ).toBeVisible();
    expect(screen.getByRole("search", { name: "Search the museum" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Browse all exhibits" })).toHaveAttribute(
      "href",
      "/exhibits",
    );
    expect(screen.getByRole("button", { name: "Surprise me" })).toBeVisible();
  });

  it("provides four meaningful quick paths into the catalog", () => {
    render(<MuseumLobby />);

    expect(screen.getByRole("link", { name: "Under 15 minutes" })).toHaveAttribute(
      "href",
      "/exhibits?duration=short",
    );
    expect(screen.getByRole("link", { name: "Interactive 3D" })).toHaveAttribute(
      "href",
      "/exhibits?format=interactive-3d",
    );
    expect(screen.getByRole("link", { name: "Explore Space" })).toHaveAttribute(
      "href",
      "/exhibits?wing=space",
    );
    expect(screen.getByRole("link", { name: "Staff picks" })).toHaveAttribute(
      "href",
      "/exhibits?featured=true",
    );
  });

  it("keeps the homepage curated and exposes stable wing gateways", () => {
    render(<MuseumLobby />);

    const featured = screen.getByRole("region", { name: "Featured exhibits" });
    expect(within(featured).getAllByRole("article")).toHaveLength(5);

    const wings = screen.getByRole("region", { name: "Explore by wing" });
    expect(within(wings).getAllByRole("link")).toHaveLength(4);
    expect(within(wings).getByRole("link", { name: /The Body.*2 exhibits/i })).toHaveAttribute(
      "href",
      "/exhibits?wing=body",
    );
    expect(within(wings).getByRole("link", { name: /Space.*1 exhibit/i })).toHaveAttribute(
      "href",
      "/exhibits?wing=space",
    );
  });

  it("keeps desktop and mobile navigation meaningful", () => {
    render(<MuseumLobby />);

    const desktopNav = screen.getByRole("navigation", { name: "Museum navigation" });
    expect(within(desktopNav).getByRole("link", { name: "Browse all" })).toHaveAttribute(
      "href",
      "/exhibits",
    );
    expect(within(desktopNav).getByRole("link", { name: "Wings" })).toHaveAttribute(
      "href",
      "/#wings",
    );
    expect(within(desktopNav).getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "/#about",
    );
    expect(screen.getByText("Menu")).toBeInTheDocument();
    expect(screen.queryByText("Saved")).not.toBeInTheDocument();
    expect(screen.queryByText("Collections")).not.toBeInTheDocument();
  });
});
