import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const stylesheet = readFileSync(
  resolve(process.cwd(), "app/research/research.module.css"),
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

describe("research route accessibility stylesheet contract", () => {
  it("uses surface-specific small-label colors that exceed 4.5:1 contrast", () => {
    const labelOnDark = cssToken("research-label-on-dark");
    const labelOnPaper = cssToken("research-label-on-paper");
    const labelOnRust = cssToken("research-label-on-rust");

    expect(labelOnDark).toBe("#e18462");
    expect(labelOnPaper).toBe("#7d2f1a");
    expect(labelOnRust).toBe("#fff1e9");
    expect(contrastRatio(labelOnDark, "#11110f")).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(labelOnPaper, "#ded5c4")).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(labelOnRust, "#a74425")).toBeGreaterThanOrEqual(4.5);

    expect(stylesheet).toMatch(
      /\.libraryGroups \.groupIndex,\s*\.sourcesPanel \.panelKicker\s*\{\s*color: var\(--research-label-on-dark\);\s*\}/su,
    );
    expect(stylesheet).toMatch(
      /\.evidencePanel \.panelKicker,\s*\.relatedPanel \.panelKicker\s*\{\s*color: var\(--research-label-on-paper\);\s*\}/su,
    );
    expect(stylesheet).toMatch(
      /\.exhibitCta \.panelKicker\s*\{\s*color: var\(--research-label-on-rust\);\s*\}/su,
    );
  });

  it("uses a muted deep-paper label color that exceeds 4.5:1 contrast", () => {
    const mutedOnPaperDeep = cssToken("research-muted-on-paper-deep");

    expect(mutedOnPaperDeep).toBe("#615b54");
    expect(contrastRatio(mutedOnPaperDeep, "#ded5c4"))
      .toBeGreaterThanOrEqual(4.5);
  });

  it("applies the accessible muted token to every tiny deep-paper label", () => {
    expect(stylesheet).toMatch(
      /\.libraryMeasure span\s*\{[^}]*color: var\(--research-muted-on-paper-deep\);[^}]*\}/su,
    );
    expect(stylesheet).toMatch(
      /\.relatedPanel a span\s*\{[^}]*color: var\(--research-muted-on-paper-deep\);[^}]*\}/su,
    );
  });

  it("gives the rust parent CTA a contrasting keyboard focus ring", () => {
    const focusOnRust = cssToken("research-focus-on-rust");

    expect(focusOnRust).toBe("#fff8f0");
    expect(contrastRatio(focusOnRust, "#a74425")).toBeGreaterThanOrEqual(4.5);
    expect(stylesheet).toMatch(
      /\.exhibitCta > a:focus-visible\s*\{[^}]*outline: 3px solid var\(--research-focus-on-rust\);[^}]*box-shadow: 0 0 0 7px rgba\(17, 17, 15, 0\.72\);[^}]*\}/su,
    );
  });

  it("defines the record article class used by the record component", () => {
    expect(stylesheet).toMatch(
      /\.recordArticle\s*\{\s*overflow-wrap: anywhere;\s*\}/su,
    );
  });
});
