import type { ReactElement } from "react";
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AtlasOfWorldsPage from "@/app/exhibits/atlas-of-worlds/page";
import BecomingHumanPage from "@/app/exhibits/becoming-human/page";
import HumanAnatomyPage from "@/app/exhibits/human-anatomy/page";
import JetEnginePage from "@/app/exhibits/jet-engine/page";
import ThirteenMinutesPage from "@/app/exhibits/thirteen-minutes/page";
import {
  ExhibitDiscoveryFooter,
  selectRelatedExhibits,
} from "@/components/museum/ExhibitDiscoveryFooter";
import {
  getExhibitBySlug,
  type ExhibitDefinition,
} from "@/content/exhibits";
import {
  listPublicResearchRecordsForExhibit,
} from "@/lib/research/public-records";

vi.mock("@/components/anatomy/AnatomyExperience", () => ({
  AnatomyExperience: () => <div />,
}));
vi.mock("@/components/becoming-human/BecomingHumanReadingEdition", () => ({
  BecomingHumanPublicIdentity: () => <header />,
  BecomingHumanReadingEdition: () => <section />,
}));
vi.mock("@/components/becoming-human/BecomingHumanV2Experience", () => ({
  BecomingHumanV2Experience: () => <div />,
}));
vi.mock("@/components/jet-engine/JetEngineExperience", () => ({
  default: () => <div />,
}));
vi.mock("@/components/jet-engine/JetEngineReadingEdition", () => ({
  JetEngineReadingEdition: () => <section />,
}));
vi.mock("@/components/space/AtlasExperience", () => ({
  AtlasExperience: () => <div />,
}));
vi.mock("@/app/exhibits/thirteen-minutes/components/TimelineExperience", () => ({
  TimelineExperience: () => <section id="mission-timeline" />,
}));

const expectedRecordSlugs = {
  "human-anatomy": [
    "cardiovascular",
    "respiratory",
    "digestive",
    "urinary",
    "nervous",
    "sensory",
    "immune",
    "musculoskeletal",
  ],
  "becoming-human": [
    "shared-branch",
    "skull-at-threshold",
    "woodland-walker",
    "trackmakers",
    "before-homo-broken-stone",
    "repeatable-edge",
    "bodies-built-for-ground",
    "five-skulls-dmanisi",
    "handaxe-idea",
    "three-histories-fire",
    "projectiles-and-hunt",
    "language-no-fossil",
    "lineage-no-birthday",
    "neanderthal-lives",
    "genome-before-face",
    "we-met-others",
    "marks-missing-meanings",
    "many-departures",
    "water-crossing",
    "holocene-possibilities",
    "farming-more-than-once",
    "river-household",
    "bodies-respond-culture",
    "dense-life",
    "memory-leaves-brain",
    "islands-connected",
    "shore-two-sides",
    "page-becomes-thousands",
    "extending-senses",
    "fossil-energy",
    "night-infrastructure",
    "instructions-machinery",
    "planetary-machine",
    "computer-enters-hand",
    "learned-patterns",
  ],
  "jet-engine": [
    "station-0",
    "station-2",
    "station-f",
    "station-3",
    "station-4",
    "station-5",
    "station-8",
  ],
  "thirteen-minutes": [
    "approach",
    "course-check",
    "program-alarm",
    "go-call",
    "manual-control",
    "touchdown",
  ],
  "atlas-of-worlds": [
    "sun",
    "mercury",
    "venus",
    "earth",
    "moon",
    "mars",
    "jupiter",
    "saturn",
    "uranus",
    "neptune",
  ],
} as const;

const expectedRelatedSlugs = {
  "human-anatomy": ["jet-engine", "thirteen-minutes", "atlas-of-worlds"],
  "becoming-human": ["human-anatomy", "jet-engine", "thirteen-minutes"],
  "jet-engine": ["thirteen-minutes", "human-anatomy", "atlas-of-worlds"],
  "thirteen-minutes": ["jet-engine", "human-anatomy", "atlas-of-worlds"],
  "atlas-of-worlds": ["human-anatomy", "jet-engine", "thirteen-minutes"],
} as const;

type ExhibitSlug = keyof typeof expectedRecordSlugs;

const routeCases: Array<{
  slug: ExhibitSlug;
  renderPage: () => ReactElement | Promise<ReactElement>;
}> = [
  {
    slug: "human-anatomy",
    renderPage: () => HumanAnatomyPage(),
  },
  {
    slug: "becoming-human",
    renderPage: () => BecomingHumanPage(),
  },
  {
    slug: "jet-engine",
    renderPage: () => JetEnginePage(),
  },
  {
    slug: "thirteen-minutes",
    renderPage: () => ThirteenMinutesPage(),
  },
  {
    slug: "atlas-of-worlds",
    renderPage: () => AtlasOfWorldsPage({ searchParams: Promise.resolve({}) }),
  },
];

beforeEach(() => {
  vi.stubGlobal("matchMedia", () => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function discoveryNavigation(exhibit: ExhibitDefinition) {
  return screen.getByRole("navigation", {
    name: `${exhibit.title} discovery`,
  });
}

describe("exhibit discovery footer", () => {
  it.each(Object.keys(expectedRecordSlugs) as ExhibitSlug[])(
    "links %s to its complete authored research sequence and museum indexes",
    (slug) => {
      const exhibit = getExhibitBySlug(slug)!;
      const records = listPublicResearchRecordsForExhibit(slug);

      render(<ExhibitDiscoveryFooter exhibit={exhibit} records={records} />);
      const navigation = discoveryNavigation(exhibit);
      const recordHrefs = Array.from(
        navigation.querySelectorAll<HTMLAnchorElement>(
          `a[href^="/research/${slug}/"]`,
        ),
        (link) => link.getAttribute("href"),
      );

      expect(recordHrefs).toEqual(
        expectedRecordSlugs[slug].map(
          (recordSlug) => `/research/${slug}/${recordSlug}`,
        ),
      );
      expect(within(navigation).getByRole("link", { name: "All exhibits" }))
        .toHaveAttribute("href", "/exhibits");
      expect(within(navigation).getByRole("link", { name: exhibit.wing.title }))
        .toHaveAttribute("href", `/exhibits?wing=${exhibit.wing.slug}`);
      expect(within(navigation).getByRole("link", { name: "Research library" }))
        .toHaveAttribute("href", "/research");
    },
  );

  it.each(Object.keys(expectedRelatedSlugs) as ExhibitSlug[])(
    "ranks eligible related exhibits deterministically for %s",
    (slug) => {
      const exhibit = getExhibitBySlug(slug)!;

      expect(selectRelatedExhibits(exhibit).map((related) => related.slug))
        .toEqual(expectedRelatedSlugs[slug]);
    },
  );

  it.each(["disabled", "private"] as const)(
    "removes %s exhibits and their records from discovery",
    (state) => {
      const atlas = getExhibitBySlug("atlas-of-worlds")!;
      const anatomy = getExhibitBySlug("human-anatomy")!;
      const originalEnabled = atlas.enabled;
      const originalAccess = atlas.access;

      try {
        if (state === "disabled") atlas.enabled = false;
        if (state === "private") atlas.access = { mode: "private" };

        expect(selectRelatedExhibits(anatomy).map((related) => related.slug))
          .not.toContain("atlas-of-worlds");
        expect(listPublicResearchRecordsForExhibit("atlas-of-worlds"))
          .toEqual([]);
      } finally {
        atlas.enabled = originalEnabled;
        atlas.access = originalAccess;
      }
    },
  );

  it("keeps member exhibits eligible for related discovery", () => {
    const atlas = getExhibitBySlug("atlas-of-worlds")!;
    const anatomy = getExhibitBySlug("human-anatomy")!;
    const originalAccess = atlas.access;

    try {
      atlas.access = {
        mode: "members",
        gateLabel: "Members' observatory",
        gateDescription: "Sign in to use the interactive observatory.",
      };

      expect(selectRelatedExhibits(anatomy).map((related) => related.slug))
        .toContain("atlas-of-worlds");
      expect(listPublicResearchRecordsForExhibit("atlas-of-worlds"))
        .toHaveLength(10);
    } finally {
      atlas.access = originalAccess;
    }
  });
});

describe("exhibit route discovery composition", () => {
  it.each(routeCases)(
    "renders the complete $slug discovery surface outside member content",
    async ({ slug, renderPage }) => {
      const exhibit = getExhibitBySlug(slug)!;
      const { container } = render(await renderPage());
      const navigation = discoveryNavigation(exhibit);

      expect(navigation.closest(".member-content")).toBeNull();
      expect(
        navigation.querySelectorAll(`a[href^="/research/${slug}/"]`),
      ).toHaveLength(expectedRecordSlugs[slug].length);
      expect(within(navigation).queryByRole("link", { name: exhibit.title }))
        .not.toBeInTheDocument();
      expect(container.querySelectorAll("main")).toHaveLength(1);
    },
  );

  it("preserves all 35 Becoming Human records and the public footer when membership gates the instrument", () => {
    const exhibit = getExhibitBySlug("becoming-human")!;
    const originalAccess = exhibit.access;

    try {
      exhibit.access = {
        mode: "members",
        gateLabel: "Members' cinematic atlas",
        gateDescription: "Sign in to enter the cinematic instrument.",
      };
      const { container } = render(BecomingHumanPage());
      const navigation = discoveryNavigation(exhibit);
      const memberContent = container.querySelector(".member-content") as HTMLElement;

      expect(memberContent).toContainElement(
        screen.getByRole("link", { name: "Sign in to enter" }),
      );
      expect(memberContent).not.toContainElement(navigation);
      expect(
        navigation.querySelectorAll(
          'a[href^="/research/becoming-human/"]',
        ),
      ).toHaveLength(35);
    } finally {
      exhibit.access = originalAccess;
    }
  }, 15_000);

  it("turns the Apollo closing recommendations into real exhibit links", () => {
    render(ThirteenMinutesPage());
    const navigation = discoveryNavigation(
      getExhibitBySlug("thirteen-minutes")!,
    );

    expect(within(navigation).getByRole("link", { name: /Atlas of Worlds/u }))
      .toHaveAttribute("href", "/exhibits/atlas-of-worlds");
  });
});
