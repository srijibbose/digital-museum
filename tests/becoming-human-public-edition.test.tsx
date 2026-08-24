import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import BecomingHumanPage from "@/app/exhibits/becoming-human/page";
import { BecomingHumanReadingEdition } from "@/components/becoming-human/BecomingHumanReadingEdition";
import {
  becomingHumanActs,
  becomingHumanEpisodes,
  becomingHumanFinale,
} from "@/content/becoming-human-story";
import { getExhibitBySlug } from "@/content/exhibits";

vi.mock("@/components/becoming-human/BecomingHumanV2Experience", () => ({
  BecomingHumanV2Experience: () => (
    <section aria-label="Becoming Human interactive exhibit">
      <h1>Becoming Human</h1>
    </section>
  ),
}));

const episodeSourceUrls = becomingHumanEpisodes.flatMap((episode) =>
  episode.sources.map((source) => source.url),
);
const allSourceUrls = [
  ...episodeSourceUrls,
  ...becomingHumanFinale.sources.map((source) => source.url),
];

describe("Becoming Human public research edition", () => {
  it("publishes every authored episode, source, uncertainty, and record link", () => {
    const { container } = render(<BecomingHumanReadingEdition />);
    const edition = screen.getByRole("region", {
      name: "Becoming Human public research edition",
    });
    const articles = within(edition).getAllByRole("article");

    expect(within(edition).getByRole("heading", { level: 1, name: "Becoming Human" })).toBeVisible();
    expect(articles).toHaveLength(35);
    expect(within(edition).getByText("The Human Lineage Begins")).toBeVisible();
    expect(within(edition).getByText(/what we still do not know/i)).toBeVisible();

    expect(articles.map((article) => article.getAttribute("data-episode-id"))).toEqual(
      becomingHumanEpisodes.map((episode) => episode.id),
    );

    for (const [index, episode] of becomingHumanEpisodes.entries()) {
      const article = articles[index]!;
      expect(within(article).getByText(episode.dateLabel)).toBeVisible();
      expect(within(article).getByText(episode.location)).toBeVisible();
      expect(within(article).getByText(episode.hook)).toBeVisible();
      expect(within(article).getByText(episode.capability)).toBeVisible();
      expect(within(article).getByText(episode.evidence.object)).toBeVisible();
      expect(within(article).getByText(episode.evidence.uncertainty)).toBeVisible();
      expect(within(article).getByRole("link", { name: /read research record/i }))
        .toHaveAttribute("href", `/research/becoming-human/${episode.id}`);

      if (episode.interaction.config.disclaimer) {
        expect(within(article).getByText(episode.interaction.config.disclaimer)).toBeVisible();
      }
    }

    const sourceLinks = Array.from(
      container.querySelectorAll<HTMLAnchorElement>(
        '[data-becoming-human-edition] a[data-source-link="true"]',
      ),
      (link) => link.getAttribute("href"),
    );
    expect(sourceLinks).toEqual(allSourceUrls);
  }, 15_000);

  it("preserves the authored act structure and finale as a coherent chronology", () => {
    render(<BecomingHumanReadingEdition />);
    const edition = screen.getByRole("region", {
      name: "Becoming Human public research edition",
    });
    const actSections = Array.from(
      edition.querySelectorAll<HTMLElement>("section[data-act-id]"),
    );

    expect(actSections).toHaveLength(8);
    expect(actSections.map((section) => section.dataset.actId)).toEqual(
      becomingHumanActs.map((act) => act.id),
    );

    for (const [index, act] of becomingHumanActs.entries()) {
      const section = actSections[index]!;
      expect(within(section).getByRole("heading", { name: act.title })).toBeVisible();
      expect(
        Array.from(section.querySelectorAll("article"), (article) => article.dataset.episodeId),
      ).toEqual(act.episodeIds);

      const navigation = within(section).getByRole("navigation", {
        name: `Act ${act.order} reading navigation`,
      });
      expect(within(navigation).getByRole("link", { name: /previous/i })).toBeVisible();
      expect(within(navigation).getByRole("link", { name: /edition index/i }))
        .toHaveAttribute("href", "#becoming-human-edition-index");
      expect(within(navigation).getByRole("link", { name: /next/i })).toBeVisible();
    }

    const finale = within(edition).getByRole("region", { name: becomingHumanFinale.title });
    expect(within(finale).getByText(becomingHumanFinale.hook)).toBeVisible();
    expect(within(finale).getByText(becomingHumanFinale.story)).toBeVisible();
    for (const layer of becomingHumanFinale.layers) {
      expect(within(finale).getByText(layer.label)).toBeVisible();
      expect(within(finale).getByText(layer.description)).toBeVisible();
    }
    expect(within(finale).getByRole("navigation", { name: "Coda reading navigation" }))
      .toBeVisible();
  });

  it("uses one exhibit h1 in current public mode", () => {
    const { container } = render(<>{BecomingHumanPage()}</>);

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1, name: "Becoming Human" })).toBeVisible();
    expect(screen.getAllByRole("article")).toHaveLength(35);
    expect(container.querySelectorAll("main")).toHaveLength(1);
    expect(container.querySelector("main")).toContainElement(
      screen.getByRole("region", { name: "Becoming Human interactive exhibit" }),
    );
    expect(container.querySelector("main")).toContainElement(
      screen.getByRole("region", { name: "Becoming Human public research edition" }),
    );
  });

  it("keeps the complete signed-out members edition and identity outside the gate", () => {
    const exhibit = getExhibitBySlug("becoming-human")!;
    const originalAccess = exhibit.access;
    exhibit.access = {
      mode: "members",
      gateLabel: "Members' Becoming Human atlas",
      gateDescription: "Sign in to enter the cinematic evidence atlas.",
    };

    try {
      const { container } = render(<>{BecomingHumanPage()}</>);
      const memberContent = container.querySelector(".member-content") as HTMLElement;
      const edition = screen.getByRole("region", {
        name: "Becoming Human public research edition",
      });
      const identity = screen.getByRole("region", { name: "Becoming Human exhibit identity" });

      expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
      expect(within(identity).getByRole("heading", { level: 1, name: exhibit.title })).toBeVisible();
      expect(within(identity).getByText(exhibit.tagline)).toBeVisible();
      expect(within(identity).getByText(exhibit.synopsis)).toBeVisible();
      expect(within(edition).getAllByRole("article")).toHaveLength(35);
      expect(within(edition).getAllByRole("link", { name: /read research record/i })).toHaveLength(35);
      expect(memberContent).toContainElement(
        screen.getByRole("link", { name: /sign in to enter/i }),
      );
      expect(memberContent).not.toContainElement(identity);
      expect(memberContent).not.toContainElement(edition);
      expect(container.querySelectorAll("main")).toHaveLength(1);
      expect(container.querySelector("main")).toContainElement(memberContent);
      expect(container.querySelector("main")).toContainElement(edition);
      expect(within(edition).getAllByRole("link").filter((link) =>
        link.getAttribute("data-source-link") === "true"
      )).toHaveLength(allSourceUrls.length);
    } finally {
      exhibit.access = originalAccess;
    }
  }, 15_000);
});
