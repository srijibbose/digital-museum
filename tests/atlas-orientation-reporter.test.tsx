import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useOrientationReporter } from "@/lib/space/orientation-reporter";

describe("Atlas orientation reporter", () => {
  afterEach(() => vi.restoreAllMocks());

  it("reports once on mount and only schedules again after an orbit change", () => {
    const frames: FrameRequestCallback[] = [];
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      frames.push(callback);
      return frames.length;
    });
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => undefined);
    const onOrientationChange = vi.fn();
    const readOrientation = vi.fn(() => ({ latitude: 12, longitude: -34 }));

    const { result, rerender } = renderHook(() =>
      useOrientationReporter(readOrientation, onOrientationChange),
    );

    expect(frames).toHaveLength(1);
    act(() => frames.shift()?.(0));
    expect(onOrientationChange).toHaveBeenCalledTimes(1);

    rerender();
    expect(frames).toHaveLength(0);

    act(() => result.current());
    expect(frames).toHaveLength(1);
  });
});
