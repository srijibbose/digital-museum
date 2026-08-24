import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const stylesheet = readFileSync(
  resolve(process.cwd(), "components/jet-engine/jet-engine.module.css"),
  "utf8",
);

function cssToken(name: string) {
  const match = stylesheet.match(new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, "iu"));
  if (!match?.[1]) throw new Error(`Missing CSS color token --${name}`);
  return match[1];
}

function relativeLuminance(hex: string) {
  const channels = hex.slice(1).match(/../gu)!.map((value) => {
    const channel = Number.parseInt(value, 16) / 255;
    return channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0]! + 0.7152 * channels[1]! + 0.0722 * channels[2]!;
}

function contrastRatio(foreground: string, background: string) {
  const values = [relativeLuminance(foreground), relativeLuminance(background)]
    .sort((left, right) => right - left);
  return (values[0]! + 0.05) / (values[1]! + 0.05);
}

describe("Jet Engine public reading-edition small-text contrast", () => {
  it.each([
    ["reading ink", "reading-ink", "#e9e5dc"],
    ["reading soft copy and navigation", "reading-soft", "#e9e5dc"],
    ["reading muted metadata", "reading-muted", "#e9e5dc"],
    ["reading accent labels and hover text", "reading-accent", "#e9e5dc"],
  ])("keeps %s at or above WCAG AA", (_label, token, background) => {
    expect(contrastRatio(cssToken(token), background)).toBeGreaterThanOrEqual(4.5);
  });

  it.each([
    ["public identity default text", "#e7e3da", "#151819"],
    ["public identity accent label", "#ca7659", "#151819"],
    ["public identity navigation hover", "#ef997a", "#151819"],
    ["record-link text", "#fff8ee", cssToken("reading-accent")],
  ])("keeps %s at or above WCAG AA", (_label, foreground, background) => {
    expect(contrastRatio(foreground, background)).toBeGreaterThanOrEqual(4.5);
  });

  it("binds every small reading-edition default and hover context to a tested token", () => {
    expect(stylesheet).toMatch(
      /\.readingEyebrow\s*\{[^}]*color: var\(--reading-accent\);[^}]*\}/su,
    );
    expect(stylesheet).toMatch(
      /\.profileContext\s*\{[^}]*color: var\(--reading-muted\);[^}]*\}/su,
    );
    expect(stylesheet).toMatch(
      /\.profileCard dt\s*\{[^}]*color: var\(--reading-muted\);[^}]*\}/su,
    );
    expect(stylesheet).toMatch(
      /\.stationSources span\s*\{[^}]*color: var\(--reading-muted\);[^}]*\}/su,
    );
    expect(stylesheet).toMatch(
      /\.stationFooter nav a\s*\{[^}]*color: var\(--reading-soft\);[^}]*\}/su,
    );
    expect(stylesheet).toMatch(
      /\.stationSources a\s*\{[^}]*color: var\(--reading-ink\);[^}]*\}/su,
    );
    expect(stylesheet).toMatch(
      /\.stationFooter nav a:hover,\s*\.stationSources a:hover\s*\{\s*color: var\(--reading-accent\);\s*\}/su,
    );
  });
});
