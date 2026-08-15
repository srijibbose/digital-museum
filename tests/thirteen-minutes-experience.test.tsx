import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DescentExperience } from "@/app/exhibits/thirteen-minutes/components/DescentExperience";
import { SceneFallback } from "@/app/exhibits/thirteen-minutes/components/SceneFallback";
import { resolveExperienceCapability } from "@/app/exhibits/thirteen-minutes/experience-capability";
import type { ExhibitBeat } from "@/app/exhibits/thirteen-minutes/types";

const programAlarm: ExhibitBeat = {
  id: "program-alarm",
  label: "Program alarm",
  met: "102:38:26",
  altitude: "33,500 ft",
  fuel: "≈8:00",
  body: "The computer is overloaded.",
  quote: "Program alarm. It's a 1202.",
};

describe("Thirteen Minutes 3D capability and fallback", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("catches reduced-motion or reduced-data visitors being given a continuous WebGL scene", () => {
    expect(
      resolveExperienceCapability({
        hasWebGL: true,
        reducedMotion: true,
        saveData: false,
      }),
    ).toEqual({ mode: "static", reason: "reduced-motion" });

    expect(
      resolveExperienceCapability({
        hasWebGL: true,
        reducedMotion: false,
        saveData: true,
      }),
    ).toEqual({ mode: "static", reason: "reduced-data" });
  });

  it("catches a missing WebGL context being treated like a successful live scene", () => {
    expect(
      resolveExperienceCapability({
        hasWebGL: false,
        reducedMotion: false,
        saveData: false,
      }),
    ).toEqual({ mode: "static", reason: "no-webgl" });

    expect(
      resolveExperienceCapability({
        hasWebGL: true,
        reducedMotion: false,
        saveData: false,
      }),
    ).toEqual({ mode: "live", reason: "supported" });
  });

  it("catches loading and failure states that leave an empty canvas-shaped gap", () => {
    const { rerender } = render(<SceneFallback reason="loading" />);

    expect(
      screen.getByRole("img", { name: /Eagle descending above the lunar surface/i }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("scene-fallback")).toHaveAttribute(
      "data-reason",
      "loading",
    );

    rerender(<SceneFallback reason="model-error" />);
    expect(screen.getByTestId("scene-fallback")).toHaveAttribute(
      "data-reason",
      "model-error",
    );
    expect(screen.getByText(/interactive model unavailable/i)).toBeInTheDocument();
  });

  it("catches reduced-motion rendering that removes both the poster and scene context", () => {
    const getContext = vi.spyOn(HTMLCanvasElement.prototype, "getContext");
    render(
      <DescentExperience
        activeBeat={programAlarm}
        activeIndex={2}
        progress={0.4}
        reducedMotion
      />,
    );

    expect(screen.getByTestId("descent-experience")).toHaveAttribute(
      "data-experience-mode",
      "static",
    );
    expect(
      screen.getByRole("img", { name: /Eagle descending above the lunar surface/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Program alarm")).toBeInTheDocument();
    expect(screen.queryByTestId("lunar-scene")).not.toBeInTheDocument();
    expect(getContext).not.toHaveBeenCalled();
  });

  it("keeps WebGL and the model bundle off the critical path until the timeline is near", () => {
    const observe = vi.fn();
    const disconnect = vi.fn();
    class IntersectionObserverMock {
      root = null;
      rootMargin = "45% 0px";
      thresholds = [0];
      disconnect = disconnect;
      observe = observe;
      takeRecords = vi.fn(() => []);
      unobserve = vi.fn();
    }
    vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
    const getContext = vi.spyOn(HTMLCanvasElement.prototype, "getContext");

    render(
      <DescentExperience
        activeBeat={programAlarm}
        activeIndex={2}
        progress={0.4}
        reducedMotion={false}
      />,
    );

    expect(observe).toHaveBeenCalledOnce();
    expect(getContext).not.toHaveBeenCalled();
    expect(screen.getByTestId("scene-fallback")).toHaveAttribute(
      "data-reason",
      "loading",
    );
  });
});
