import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const sourceFixture = vi.hoisted(() => ({
  title: "Shared Apollo source fixture",
  label: "Shared archive fixture",
  publisher: "Fixture archive",
  url: "https://example.com/shared-apollo-source",
  description: "A synthetic source description used only to prove the visible page consumes the shared ledger.",
}));

vi.mock("@/app/exhibits/thirteen-minutes/content", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/app/exhibits/thirteen-minutes/content")>();
  return {
    ...actual,
    thirteenMinutesSources: Object.freeze([Object.freeze(sourceFixture)]),
  };
});

vi.mock("@/app/exhibits/thirteen-minutes/components/TimelineExperience", () => ({
  TimelineExperience: () => null,
}));

import ThirteenMinutesPage from "@/app/exhibits/thirteen-minutes/page";

describe("Thirteen Minutes shared source ledger", () => {
  it("renders archival source titles and URLs from the exported content constant", () => {
    render(<>{ThirteenMinutesPage()}</>);

    expect(screen.getByText(sourceFixture.title)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: new RegExp(sourceFixture.title, "i") })).toHaveAttribute(
      "href",
      sourceFixture.url,
    );
    expect(screen.queryByText("Apollo 11 Air-to-Ground Mission Transcript")).not.toBeInTheDocument();
  });
});
