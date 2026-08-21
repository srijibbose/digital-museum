const atlasIntegerFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

export function formatAtlasInteger(value: number) {
  return atlasIntegerFormatter.format(value);
}
