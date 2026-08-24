import { describe, expect, it } from "vitest";
import * as socialRoute from "@/app/social/[kind]/[...slug]/route";
import { getExhibitBySlug } from "@/content/exhibits";
import { getResearchRecord } from "@/content/research-records";
import {
  museumSocialCard,
  resolveSocialCard,
  resolveSocialCardOrFallback,
} from "@/lib/seo/social-card";

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

  it("resolves only exact public research-record identifiers", () => {
    const mars = getResearchRecord("atlas-of-worlds", "mars")!;

    expect(resolveSocialCard("research", ["atlas-of-worlds", "mars"]))
      .toEqual({
        eyebrow: "RESEARCH RECORD · ATLAS OF WORLDS",
        title: mars.title,
        description: mars.summary,
        accentColor: "#bd552b",
      });
    expect(resolveSocialCard("research", ["atlas-of-worlds"])).toBeNull();
    expect(
      resolveSocialCard("research", ["atlas-of-worlds", "mars", "extra"]),
    ).toBeNull();
    expect(
      resolveSocialCard("research", ["atlas-of-worlds", "not-authored"]),
    ).toBeNull();
    expect(resolveSocialCard("research", ["<script>", "mars"]))
      .toBeNull();
  });

  it.each(["disabled", "private"] as const)(
    "rejects research cards when their parent exhibit is %s",
    (state) => {
      const atlas = getExhibitBySlug("atlas-of-worlds")!;
      const originalEnabled = atlas.enabled;
      const originalAccess = atlas.access;

      try {
        if (state === "disabled") atlas.enabled = false;
        if (state === "private") atlas.access = { mode: "private" };

        expect(resolveSocialCard("research", ["atlas-of-worlds", "mars"]))
          .toBeNull();
      } finally {
        atlas.enabled = originalEnabled;
        atlas.access = originalAccess;
      }
    },
  );

  it("renders the deterministic museum fallback for unsafe and extra record paths", async () => {
    expect(resolveSocialCardOrFallback("research", ["<script>", "mars"]))
      .toBe(museumSocialCard);
    expect(
      resolveSocialCardOrFallback("research", [
        "atlas-of-worlds",
        "mars",
        "extra",
      ]),
    ).toBe(museumSocialCard);

    const unsafe = await socialRoute.GET(
      new Request("https://museum.example/social/research/%3Cscript%3E/mars"),
      {
        params: Promise.resolve({
          kind: "research",
          slug: ["<script>", "mars"],
        }),
      },
    );
    expect(unsafe.status).toBe(200);
    expect(unsafe.headers.get("content-type")).toBe("image/png");
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
