export type ComparisonScalePolicy = "true-scale" | "normalized";

/**
 * Produces stage radii, not raw astronomical radii. True-scale mode keeps
 * ordering while logarithmically bounding extreme Sun/planet comparisons.
 */
export function comparisonRadii(
  primaryRadiusKm: number,
  secondaryRadiusKm: number,
  policy: ComparisonScalePolicy,
): [number, number] {
  if (policy === "normalized" || primaryRadiusKm === secondaryRadiusKm) {
    return [1, 1];
  }

  const larger = Math.max(primaryRadiusKm, secondaryRadiusKm);
  const smaller = Math.min(primaryRadiusKm, secondaryRadiusKm);
  const displayedLarger = Math.min(2.8, 1 + Math.log10(larger / smaller) * 0.72);

  return primaryRadiusKm > secondaryRadiusKm
    ? [displayedLarger, 1]
    : [1, displayedLarger];
}

