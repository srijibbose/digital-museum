import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HumanAnatomyPage from "@/app/exhibits/human-anatomy/page";
import ThirteenMinutesPage from "@/app/exhibits/thirteen-minutes/page";
import { getExhibitBySlug } from "@/content/exhibits";

describe("member exhibit route shells", () => {
  it("keeps the Anatomy identity, public edition, sources, and navigation outside the gate", () => {
    const exhibit = getExhibitBySlug("human-anatomy")!;
    const originalAccess = exhibit.access;
    exhibit.access = {
      mode: "members",
      gateLabel: "Members' anatomy laboratory",
      gateDescription: "Sign in to use the interactive anatomy instrument.",
    };

    try {
      const { container } = render(<>{HumanAnatomyPage()}</>);
      const memberContent = container.querySelector(".member-content");
      const transcript = container.querySelector("#anatomy-transcript") as HTMLElement;
      const sources = container.querySelector("#anatomy-sources") as HTMLElement;
      const publicNavigation = screen.getByRole("navigation", {
        name: "Human Anatomy public edition",
      });
      const publicContext = publicNavigation.closest("header") as HTMLElement;

      expect(within(publicContext).getByRole("heading", { level: 1, name: "Human Anatomy" })).toBeVisible();
      expect(within(publicContext).getByText(exhibit.tagline)).toBeVisible();
      expect(within(publicContext).getByText(exhibit.synopsis)).toBeVisible();
      expect(within(publicContext).getByText(exhibit.curatorNote)).toBeVisible();
      expect(
        within(publicNavigation).getByRole("link", { name: "Read the text atlas" }),
      ).toHaveAttribute("href", "#anatomy-transcript");
      expect(
        within(publicNavigation).getByRole("link", { name: "Review anatomy sources" }),
      ).toHaveAttribute("href", "#anatomy-sources");
      expect(
        within(publicNavigation).getByRole("link", { name: "Browse all exhibits" }),
      ).toHaveAttribute("href", "/exhibits");
      expect(
        screen.queryByRole("region", { name: "Human Anatomy interactive exhibit" }),
      ).not.toBeInTheDocument();
      expect(transcript).toBeVisible();
      expect(sources).toBeVisible();
      expect(memberContent).not.toContainElement(publicContext);
      expect(memberContent).not.toContainElement(transcript);
      expect(memberContent).not.toContainElement(sources);
    } finally {
      exhibit.access = originalAccess;
    }
  });

  it("points the signed-out Thirteen Minutes skip link at the visible member boundary", () => {
    const exhibit = getExhibitBySlug("thirteen-minutes")!;
    const originalAccess = exhibit.access;
    exhibit.access = {
      mode: "members",
      gateLabel: "Members' descent instrument",
      gateDescription: "Sign in to use the interactive descent timeline.",
    };

    try {
      const { container } = render(<>{ThirteenMinutesPage()}</>);
      const skipLink = screen.getByRole("link", { name: "Skip to member access" });
      const memberContent = container.querySelector("#thirteen-minutes-member-content");

      expect(skipLink).toHaveAttribute("href", "#thirteen-minutes-member-content");
      expect(memberContent).toHaveClass("member-content");
      expect(memberContent).toContainElement(
        screen.getByRole("link", { name: /sign in to enter/i }),
      );
      expect(container.querySelector("#mission-timeline")).not.toBeInTheDocument();
    } finally {
      exhibit.access = originalAccess;
    }
  });
});
