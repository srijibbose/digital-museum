import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const stylesheet = readFileSync(
  resolve(process.cwd(), "components/becoming-human/becoming-human-v2.module.css"),
  "utf8",
);

function relativeLuminance(channel: number) {
  const normalized = channel / 255;
  return normalized <= 0.04045
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
}

describe("Becoming Human cinematic stylesheet accessibility", () => {
  it("keeps the tiny entry footer copy above 4.5:1 contrast", () => {
    const footerRule = stylesheet.match(/\.entryFooter\s*\{(?<rule>[^}]*)\}/u)?.groups?.rule;
    const alphaValue = footerRule?.match(
      /color:\s*rgba\(255,255,255,(?<alpha>\.[0-9]+)\)/u,
    )?.groups?.alpha;

    expect(alphaValue).toBeDefined();

    const alpha = Number(alphaValue);
    const compositedChannel = Math.round(255 * alpha + 5 * (1 - alpha));
    const contrast = (relativeLuminance(compositedChannel) + 0.05)
      / (relativeLuminance(5) + 0.05);

    expect(contrast).toBeGreaterThanOrEqual(4.5);
  });
});
