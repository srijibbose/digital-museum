export type ComparisonScalePolicy = "true-scale" | "normalized";

/** Produces stage radii whose ratio exactly matches the physical radii. */
export function comparisonRadii(
  primaryRadiusKm: number,
  secondaryRadiusKm: number,
  policy: ComparisonScalePolicy,
): [number, number] {
  if (policy === "normalized" || primaryRadiusKm === secondaryRadiusKm) {
    return [1, 1];
  }

  const larger = Math.max(primaryRadiusKm, secondaryRadiusKm);

  return [primaryRadiusKm / larger, secondaryRadiusKm / larger];
}
