import { useCallback, useEffect, useRef } from "react";

export type AtlasOrientation = {
  latitude: number;
  longitude: number;
};

export function useOrientationReporter(
  readOrientation: () => AtlasOrientation,
  onOrientationChange: (latitude: number, longitude: number) => void,
) {
  const frame = useRef<number | null>(null);
  const reader = useRef(readOrientation);
  const reporter = useRef(onOrientationChange);
  reader.current = readOrientation;
  reporter.current = onOrientationChange;

  const scheduleOrientation = useCallback(() => {
    if (frame.current !== null) return;
    frame.current = window.requestAnimationFrame(() => {
      frame.current = null;
      const orientation = reader.current();
      reporter.current(orientation.latitude, orientation.longitude);
    });
  }, []);

  useEffect(() => {
    scheduleOrientation();
    return () => {
      if (frame.current !== null) window.cancelAnimationFrame(frame.current);
    };
  }, [scheduleOrientation]);

  return scheduleOrientation;
}
