export type VerticalBounds = {
  top: number;
  bottom: number;
};

export function centeredBeatIndex(
  bounds: ReadonlyArray<VerticalBounds>,
  viewportHeight: number,
) {
  const center = viewportHeight / 2;
  const index = bounds.findIndex(
    ({ top, bottom }) => top <= center && bottom > center,
  );
  return index >= 0 ? index : null;
}
