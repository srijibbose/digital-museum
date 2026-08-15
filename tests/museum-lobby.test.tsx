import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import MuseumLobby from "@/app/page";

describe("museum lobby", () => {
  it("renders only the two active exhibit destinations", () => {
    render(<MuseumLobby />);

    expect(screen.getByRole("link", { name: /enter thirteen minutes/i })).toHaveAttribute(
      "href",
      "/exhibits/thirteen-minutes",
    );
    expect(screen.getByRole("link", { name: /enter full throttle/i })).toHaveAttribute(
      "href",
      "/exhibits/full-throttle",
    );
    expect(screen.queryByRole("link", { name: /living atlas/i })).not.toBeInTheDocument();
  });

  it("describes the visible directory from registry data", () => {
    render(<MuseumLobby />);

    expect(screen.getByText(/2 active exhibitions/i)).toBeInTheDocument();
    expect(screen.getByText("Systems & Machines")).toBeInTheDocument();
  });

  it("catches a hero that leaves the exhibit directory as an ambiguous destination", () => {
    render(<MuseumLobby />);

    expect(
      screen.getByRole("link", { name: /explore the exhibitions/i }),
    ).toHaveAttribute("href", "#exhibits");
    expect(screen.getByText(/02 active exhibits/i)).toBeInTheDocument();
  });
});
