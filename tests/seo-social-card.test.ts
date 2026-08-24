import { describe, expect, it } from "vitest";
import * as socialRoute from "@/app/social/[kind]/[...slug]/route";
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

  it("uses the default Node runtime for the working dynamic image route", async () => {
    const response = await socialRoute.GET(
      new Request("https://museum.example/social/exhibit/atlas-of-worlds"),
      {
        params: Promise.resolve({
          kind: "exhibit",
          slug: ["atlas-of-worlds"],
        }),
      },
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("image/png");
    expect("runtime" in socialRoute).toBe(false);
  });
});
