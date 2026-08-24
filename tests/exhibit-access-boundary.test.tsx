import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ExhibitAccessBoundary } from "@/components/museum/ExhibitAccessBoundary";
import { getExhibitBySlug } from "@/content/exhibits";

const atlas = getExhibitBySlug("atlas-of-worlds")!;
const memberAtlas = {
  ...atlas,
  access: {
    mode: "members" as const,
    gateLabel: "Members' observatory",
    gateDescription: "Sign in to use the interactive planetary instrument.",
  },
};

describe("ExhibitAccessBoundary", () => {
  it("keeps member exhibit context public and gates only children", () => {
    render(
      <main>
        <h1>Atlas of Worlds</h1>
        <p>Ten sourced worlds.</p>
        <ExhibitAccessBoundary exhibit={memberAtlas} viewer={{ signedIn: false }}>
          <div>Interactive instrument</div>
        </ExhibitAccessBoundary>
      </main>,
    );

    expect(screen.getByRole("heading", { name: "Atlas of Worlds" })).toBeVisible();
    expect(screen.getByText("Ten sourced worlds.")).toBeVisible();
    expect(screen.queryByText("Interactive instrument")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Members' observatory" })).toBeVisible();
    expect(screen.getByText(memberAtlas.access.gateDescription)).toBeVisible();
    expect(screen.getByRole("link", { name: /sign in to enter/i })).toHaveAttribute(
      "href",
      "/sign-in?returnTo=%2Fexhibits%2Fatlas-of-worlds",
    );
    expect(document.querySelector(".member-content")).toBeTruthy();
  });

  it("defaults to a signed-out viewer for member exhibits", () => {
    render(
      <ExhibitAccessBoundary exhibit={memberAtlas}>
        <div>Interactive instrument</div>
      </ExhibitAccessBoundary>,
    );

    expect(screen.queryByText("Interactive instrument")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /sign in to enter/i })).toHaveAttribute(
      "href",
      "/sign-in?returnTo=%2Fexhibits%2Fatlas-of-worlds",
    );
  });

  it("renders interactive children for public exhibits and signed-in members", () => {
    const { rerender } = render(
      <ExhibitAccessBoundary exhibit={atlas}>
        <div>Public instrument</div>
      </ExhibitAccessBoundary>,
    );

    expect(screen.getByText("Public instrument")).toBeVisible();

    rerender(
      <ExhibitAccessBoundary exhibit={memberAtlas} viewer={{ signedIn: true }}>
        <div>Member instrument</div>
      </ExhibitAccessBoundary>,
    );

    expect(screen.getByText("Member instrument")).toBeVisible();
    expect(screen.queryByRole("link", { name: /sign in to enter/i })).not.toBeInTheDocument();
  });

  it("never renders children for private exhibits", () => {
    const privateAtlas = { ...atlas, access: { mode: "private" as const } };

    const { container } = render(
      <ExhibitAccessBoundary exhibit={privateAtlas} viewer={{ signedIn: true }}>
        <div>Private instrument</div>
      </ExhibitAccessBoundary>,
    );

    expect(screen.queryByText("Private instrument")).not.toBeInTheDocument();
    expect(container).toBeEmptyDOMElement();
  });
});
