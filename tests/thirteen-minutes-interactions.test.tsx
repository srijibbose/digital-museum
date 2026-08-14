import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  experienceReducer,
  initialExperienceState,
} from "@/app/exhibits/thirteen-minutes/experience-reducer";
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
    id: "program-alarm",
    label: "Program alarm",
    met: "102:38:26",
    altitude: "33,500 ft",
    fuel: "≈8:00",
    body: "The computer is overloaded.",
    quote: "Program alarm. It's a 1202.",
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

describe("Thirteen Minutes understanding interactions", () => {
  beforeEach(() => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    );
    Element.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("catches transient inspect and compare state surviving a scene reset", () => {
    const inspecting = experienceReducer(initialExperienceState, {
      type: "TOGGLE_INSPECT",
    });
    const comparing = experienceReducer(inspecting, {
      type: "SET_COMPARE",
      value: true,
    });

    expect(inspecting.inspect).toBe(true);
    expect(comparing.compare).toBe(true);
    expect(
      experienceReducer(comparing, { type: "RESET_TRANSIENT" }),
    ).toEqual(initialExperienceState);
  });

  it("catches inspect and planned-versus-actual controls that do not affect the live scene", async () => {
    const user = userEvent.setup();
    render(<TimelineExperience beats={beats} />);

    await user.click(screen.getByRole("button", { name: /inspect Eagle/i }));
    expect(screen.getByRole("button", { name: /finish inspecting Eagle/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByTestId("descent-experience")).toHaveAttribute(
      "data-inspect-mode",
      "true",
    );

    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.getByTestId("descent-experience")).toHaveAttribute(
      "data-inspect-mode",
      "false",
    );

    await user.click(screen.getByRole("button", { name: /next: course check/i }));
    await user.click(
      screen.getByRole("button", { name: /compare planned and actual landing paths/i }),
    );
    expect(screen.getByTestId("descent-experience")).toHaveAttribute(
      "data-compare-mode",
      "true",
    );
  });

  it("catches the 1202 explanation becoming a decorative alarm with nothing to inspect", async () => {
    const user = userEvent.setup();
    render(<TimelineExperience beats={beats} />);

    await user.click(screen.getByRole("button", { name: /go to program alarm/i }));
    const computer = screen.getByRole("region", { name: /guidance computer load/i });
    expect(computer).toHaveAttribute("data-detail", "overview");
    expect(computer).toHaveTextContent("Essential jobs retained");

    await user.click(screen.getByRole("button", { name: /inspect dropped radar data/i }));
    expect(computer).toHaveAttribute("data-detail", "dropped");
    expect(computer).toHaveTextContent(/lower-priority radar input was abandoned/i);

    await user.click(screen.getByRole("button", { name: /inspect retained guidance jobs/i }));
    expect(computer).toHaveAttribute("data-detail", "kept");
    expect(computer).toHaveTextContent(/guidance and engine control restarted first/i);
  });
});
