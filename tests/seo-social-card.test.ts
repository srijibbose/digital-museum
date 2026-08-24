import { describe, expect, it } from "vitest";
import { resolveSocialCard } from "@/lib/seo/social-card";

describe("social-card allowlist", () => {
  it("resolves known exhibits and rejects reflected input", () => {
    expect(resolveSocialCard("exhibit", ["atlas-of-worlds"])?.title).toBe(
      "Atlas of Worlds",
    );
    expect(resolveSocialCard("exhibit", ["<script>"])).toBeNull();
    expect(resolveSocialCard("unknown", ["atlas-of-worlds"])).toBeNull();
  });

  it("rejects paths that do not name exactly one public exhibit", () => {
    expect(resolveSocialCard("exhibit", [])).toBeNull();
    expect(resolveSocialCard("exhibit", ["atlas-of-worlds", "details"])).toBeNull();
  });
});
