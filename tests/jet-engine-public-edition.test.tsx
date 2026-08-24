import { render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import JetEnginePage from "@/app/exhibits/jet-engine/page";
import { JetEngineReadingEdition } from "@/components/jet-engine/JetEngineReadingEdition";
import { jetEngine } from "@/content/jet-engine";
import { getExhibitBySlug } from "@/content/exhibits";

const EXPECTED_SOURCES = {
  stations: {
    title: "Gas Turbine Schematic and Station Numbers",
    url: "https://www.grc.nasa.gov/www/k-12/airplane/turbdraw.html",
  },
  turbofan: {
    title: "Turbofan Thrust",
    url: "https://www.grc.nasa.gov/www/k-12/airplane/turbfan.html",
  },
  engineSim: {
    title: "EngineSim 1.7a — Engine Simulator",
    url: "https://www.grc.nasa.gov/WWW/k-12/BGP/ngnsim.html",
  },
  theory: {
    title: "Beginner's Guide to Propulsion: Engine Theory",
    url: "https://www.grc.nasa.gov/www/k-12/airplane/EngineTheory.pdf",
  },
  parts: {
    title: "Gas Turbine Parts",
    url: "https://www.grc.nasa.gov/WWW/K-12/BGP/enex.html",
  },
  faa: {
    title: "Airplane Flying Handbook, Chapter 16 — Turbofan Engine",
    url: "https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/airplane_handbook/17_afh_ch16.pdf",
  },
  ge90: {
    title: "Full Engine Three-Dimensional Flow Simulations of the GE90 Turbofan Engine",
    url: "https://ntrs.nasa.gov/citations/20000034013",
  },
  cfd: {
    title: "Time-Accurate Turbofan Simulation and Blade-Wake Visualization",
    url: "https://www.nas.nasa.gov/SC23/research/project4.html",
  },
} as const;

const EXPECTED_STATIONS = [
  {
    label: "Undisturbed atmosphere",
    sources: [EXPECTED_SOURCES.stations, EXPECTED_SOURCES.theory],
  },
  {
    label: "Inlet exit and fan face",
    sources: [EXPECTED_SOURCES.stations, EXPECTED_SOURCES.theory],
  },
  {
    label: "Fan stream exit",
    sources: [EXPECTED_SOURCES.turbofan, EXPECTED_SOURCES.faa, EXPECTED_SOURCES.cfd],
  },
  {
    label: "Compressor exit and burner entry",
    sources: [
      EXPECTED_SOURCES.stations,
      EXPECTED_SOURCES.engineSim,
      EXPECTED_SOURCES.theory,
      EXPECTED_SOURCES.ge90,
    ],
  },
  {
    label: "Burner exit and turbine inlet",
    sources: [EXPECTED_SOURCES.stations, EXPECTED_SOURCES.engineSim, EXPECTED_SOURCES.theory],
  },
  {
    label: "Turbine exit",
    sources: [EXPECTED_SOURCES.stations, EXPECTED_SOURCES.parts, EXPECTED_SOURCES.theory],
  },
  {
    label: "Core nozzle throat",
    sources: [EXPECTED_SOURCES.stations, EXPECTED_SOURCES.turbofan, EXPECTED_SOURCES.theory],
  },
] as const;

const EXPECTED_PROFILES = [
  {
    label: "Ground idle",
    values: ["Apron · stabilized idle", "0 m", "Mach 0.02", "1,050 K", "10:1", "1.16:1", "28%"],
  },
  {
    label: "Takeoff",
    values: ["Sea level · initial acceleration", "0 m", "Mach 0.25", "1,700 K", "34:1", "1.55:1", "100%"],
  },
  {
    label: "Climb",
    values: ["3,000 m · Mach 0.45", "3,000 m", "Mach 0.45", "1,580 K", "30:1", "1.48:1", "86%"],
  },
  {
    label: "Cruise",
    values: ["10,668 m · Mach 0.78", "10,668 m", "Mach 0.78", "1,450 K", "28:1", "1.42:1", "72%"],
  },
] as const;

beforeEach(() => {
  vi.stubGlobal("matchMedia", () => ({ matches: false }));
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Jet Engine public reading edition", () => {
  it("publishes the authored thesis, promise, and representation limits", () => {
    render(<JetEngineReadingEdition />);

    expect(screen.getByText(jetEngine.thesis)).toBeVisible();
    expect(screen.getByText(jetEngine.visitorPromise)).toBeVisible();
    expect(screen.getByText(jetEngine.reconstructionNotice)).toBeVisible();
    expect(screen.getByText(jetEngine.modelNotice)).toBeVisible();
  });

  it("publishes all seven stations and their exact source trails in authored order", () => {
    render(<JetEngineReadingEdition />);

    const stationRegion = screen.getByRole("region", { name: "Flow station reading sequence" });
    const stationHeadings = within(stationRegion).getAllByRole("heading", { level: 3 });
    expect(stationHeadings.map((heading) => heading.textContent)).toEqual(
      EXPECTED_STATIONS.map(({ label }) => label),
    );

    for (const [index, station] of jetEngine.stations.entries()) {
      const article = stationHeadings[index]!.closest("article") as HTMLElement;
      expect(article).toBeTruthy();
      expect(within(article).getByText(station.summary)).toBeVisible();
      expect(within(article).getByText(station.transformation)).toBeVisible();
      expect(within(article).getByText(station.interpretation)).toBeVisible();
      expect(article).toHaveTextContent(station.number);
      expect(article).toHaveTextContent(station.stream);
      expect(article).toHaveTextContent(station.evidence.replaceAll("-", " "));

      const sourceNavigation = within(article).getByRole("navigation", {
        name: `Sources for ${station.label}`,
      });
      const sourceLinks = within(sourceNavigation).getAllByRole("link");
      expect(sourceLinks.map((link) => link.textContent)).toEqual(
        EXPECTED_STATIONS[index]!.sources.map(({ title }) => title),
      );
      expect(sourceLinks.map((link) => link.getAttribute("href"))).toEqual(
        EXPECTED_STATIONS[index]!.sources.map(({ url }) => url),
      );
    }
  });

  it("publishes all four operating profiles, values, and assumptions in authored order", () => {
    render(<JetEngineReadingEdition />);

    const profileRegion = screen.getByRole("region", { name: "Operating profile comparison" });
    const profileHeadings = within(profileRegion).getAllByRole("heading", { level: 3 });
    expect(profileHeadings.map((heading) => heading.textContent)).toEqual(
      EXPECTED_PROFILES.map(({ label }) => label),
    );

    for (const [index, profile] of jetEngine.profiles.entries()) {
      const article = profileHeadings[index]!.closest("article") as HTMLElement;
      expect(within(article).getByText(profile.assumption)).toBeVisible();
      for (const value of EXPECTED_PROFILES[index]!.values) {
        expect(article).toHaveTextContent(value);
      }
    }
  });

  it("links every station to its canonical research record and offers local reading navigation", () => {
    render(<JetEngineReadingEdition />);

    const recordLinks = screen.getAllByRole("link", { name: /read station .* research record/i });
    expect(recordLinks.map((link) => link.getAttribute("href"))).toEqual([
      "/research/jet-engine/station-0",
      "/research/jet-engine/station-2",
      "/research/jet-engine/station-f",
      "/research/jet-engine/station-3",
      "/research/jet-engine/station-4",
      "/research/jet-engine/station-5",
      "/research/jet-engine/station-8",
    ]);

    for (const station of jetEngine.stations) {
      expect(
        screen.getByRole("navigation", { name: `Station ${station.number} reading navigation` }),
      ).toBeVisible();
    }
  });

  it.each(["public", "members"] as const)(
    "keeps the complete edition outside the %s instrument boundary",
    (mode) => {
      const exhibit = getExhibitBySlug("jet-engine")!;
      const originalAccess = exhibit.access;
      exhibit.access = mode === "public"
        ? { mode: "public" }
        : {
            mode: "members",
            gateLabel: "Members' flow laboratory",
            gateDescription: "Sign in to use the interactive engine instrument.",
          };

      try {
        const { container } = render(<JetEnginePage />);
        const edition = container.querySelector("#jet-engine-reading-edition") as HTMLElement;
        const memberContent = container.querySelector(".member-content") as HTMLElement;

        expect(edition).toBeVisible();
        expect(memberContent).not.toContainElement(edition);
        if (mode === "public") {
          expect(memberContent).toContainElement(
            screen.getByRole("region", { name: "Jet Engine interactive exhibit" }),
          );
        } else {
          expect(memberContent).toContainElement(
            screen.getByRole("link", { name: "Sign in to enter" }),
          );
          expect(within(edition).getAllByRole("article")).toHaveLength(11);
        }
      } finally {
        exhibit.access = originalAccess;
      }
    },
  );
});
