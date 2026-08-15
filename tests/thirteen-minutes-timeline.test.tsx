import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TimelineExperience } from "@/app/exhibits/thirteen-minutes/components/TimelineExperience";
import type { ExhibitBeat } from "@/app/exhibits/thirteen-minutes/types";

const beats: ExhibitBeat[] = [
  {
    id: "approach",
    label: "Approach",
    met: "102:33:05",
    altitude: "49,971 ft",
    fuel: "≈13:20",
    body: "The engine ignites.",
    quote: null,
  },
  {
    id: "course-check",
    label: "Course check",
    met: "102:36:11",
    altitude: "≈42,000 ft",
    fuel: "≈10:15",
    body: "The position is long.",
    quote: "We're going to land long.",
  },
  {
    id: "touchdown",
    label: "Touchdown",
    met: "102:45:40",
    altitude: "0 ft",
    fuel: "≈0:45",
    body: "Engine off.",
    quote: "The Eagle has landed.",
  },
];

describe("TimelineExperience navigation", () => {
  beforeEach(() => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({
        matches: false,
        media: "(prefers-reduced-motion: reduce)",
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    );
    Element.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("catches previous and next controls that drift out of sync with the HUD and rail", async () => {
    const user = userEvent.setup();
    render(<TimelineExperience beats={beats} exhibitTitle="Thirteen Minutes" />);

    const timeline = screen.getByTestId("timeline");
    const hud = screen.getByTestId("mission-hud");
    expect(screen.getByText("Thirteen Minutes")).toBeInTheDocument();
    expect(timeline).toHaveAttribute("data-active-beat", "approach");
    expect(screen.getByTestId("descent-experience")).toHaveAttribute(
      "data-scene-beat",
      "approach",
    );
    expect(screen.getByTestId("descent-experience")).toHaveAttribute(
      "data-scene-progress",
      "0.000",
    );

    await user.click(screen.getByRole("button", { name: /next: course check/i }));
    expect(timeline).toHaveAttribute("data-active-beat", "course-check");
    expect(Element.prototype.scrollIntoView).toHaveBeenLastCalledWith({
      behavior: "auto",
      block: "start",
    });
    expect(within(hud).getByLabelText("102:36:11")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /go to course check/i })).toHaveAttribute(
      "aria-current",
      "step",
    );
    expect(screen.getByTestId("descent-experience")).toHaveAttribute(
      "data-scene-beat",
      "course-check",
    );
    expect(screen.getByTestId("descent-experience")).toHaveAttribute(
      "data-scene-progress",
      "0.200",
    );

    await user.click(screen.getByRole("button", { name: /previous: approach/i }));
    expect(timeline).toHaveAttribute("data-active-beat", "approach");
    expect(within(hud).getByLabelText("102:33:05")).toBeInTheDocument();
  });

  it("catches rail and keyboard navigation that do not use the same active state", async () => {
    const user = userEvent.setup();
    render(<TimelineExperience beats={beats} />);
    const timeline = screen.getByTestId("timeline");

    await user.click(screen.getByRole("button", { name: /go to touchdown/i }));
    expect(timeline).toHaveAttribute("data-active-beat", "touchdown");

    fireEvent.keyDown(window, { key: "Home" });
    expect(timeline).toHaveAttribute("data-active-beat", "approach");
    fireEvent.keyDown(window, { key: "End" });
    expect(timeline).toHaveAttribute("data-active-beat", "touchdown");
    fireEvent.keyDown(window, { key: "ArrowUp" });
    expect(timeline).toHaveAttribute("data-active-beat", "course-check");
  });

  it("prevents the global smooth-scroll rule from carrying a beat jump past its target", async () => {
    const user = userEvent.setup();
    const scrollBehaviors: string[] = [];
    Element.prototype.scrollIntoView = vi.fn(() => {
      scrollBehaviors.push(document.documentElement.style.scrollBehavior);
    });
    render(<TimelineExperience beats={beats} />);

    await user.click(screen.getByRole("button", { name: /go to course check/i }));

    expect(scrollBehaviors).toEqual(["auto"]);
    expect(document.documentElement.style.scrollBehavior).toBe("");
  });

  it("catches reduced motion that leaves a pinned animated HUD or hides local telemetry", () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({
        matches: true,
        media: "(prefers-reduced-motion: reduce)",
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    );

    render(<TimelineExperience beats={beats} />);

    expect(screen.getByTestId("timeline")).toHaveAttribute("data-reduced-motion", "true");
    expect(screen.getByTestId("mission-hud")).toHaveAttribute("data-animate", "false");
    expect(
      screen.queryByRole("button", { name: /inspect Eagle/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByLabelText(/touchdown static telemetry/i)).toHaveTextContent("102:45:40");
  });
});
