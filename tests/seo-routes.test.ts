import { afterEach, beforeEach, describe, expect, it } from "vitest";
import manifest from "@/app/manifest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { getExhibitBySlug } from "@/content/exhibits";
import {
  getResearchRecordsForExhibit,
  researchRecordPath,
} from "@/content/research-records";

const originalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

describe("SEO metadata routes", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://museum.example";
  });

  afterEach(() => {
    if (originalSiteUrl === undefined) {
      delete process.env.NEXT_PUBLIC_SITE_URL;
    } else {
      process.env.NEXT_PUBLIC_SITE_URL = originalSiteUrl;
    }
  });

  it("publishes isolated public, search, and training crawler groups", () => {
    const output = robots();
    const rules = Array.isArray(output.rules) ? output.rules : [output.rules];
    const disallow = [
      "/api/",
      "/account/",
      "/dashboard/",
      "/private/",
      "/internal/",
      "/auth/callback/",
    ];

    expect(output.sitemap).toBe("https://museum.example/sitemap.xml");
    expect(output.host).toBe("https://museum.example");
    expect(rules).toEqual([
      { userAgent: "*", allow: "/", disallow },
      {
        userAgent: [
          "Googlebot",
          "Bingbot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "Claude-SearchBot",
          "Claude-User",
          "PerplexityBot",
          "Perplexity-User",
        ],
        allow: "/",
        disallow,
      },
      {
        userAgent: ["GPTBot", "ClaudeBot"],
        allow: "/",
        disallow,
      },
    ]);
    expect(JSON.stringify(rules)).not.toContain("/sign-in");
    expect(JSON.stringify(rules)).not.toContain("/_next/");
  });

  it("sitemaps the research library and exactly 66 authored record URLs with honest dates", () => {
    const entries = sitemap();
    const expectedResearchEntries = [
      "human-anatomy",
      "becoming-human",
      "jet-engine",
      "thirteen-minutes",
      "atlas-of-worlds",
    ].flatMap((exhibitSlug) =>
      getResearchRecordsForExhibit(exhibitSlug).map((record) => ({
        url: `https://museum.example${researchRecordPath(record)}`,
        lastModified: record.lastModified,
      })),
    );

    expect(entries).toEqual([
      { url: "https://museum.example/" },
      { url: "https://museum.example/exhibits" },
      { url: "https://museum.example/research" },
      {
        url: "https://museum.example/exhibits/human-anatomy",
        lastModified: "2026-08-23T00:00:00.000Z",
      },
      {
        url: "https://museum.example/exhibits/becoming-human",
        lastModified: "2026-08-18T00:00:00.000Z",
      },
      {
        url: "https://museum.example/exhibits/jet-engine",
        lastModified: "2026-08-23T00:00:00.000Z",
      },
      {
        url: "https://museum.example/exhibits/thirteen-minutes",
        lastModified: "2026-08-15T00:00:00.000Z",
      },
      {
        url: "https://museum.example/exhibits/atlas-of-worlds",
        lastModified: "2026-08-21T00:00:00.000Z",
      },
      ...expectedResearchEntries,
    ]);
    expect(
      entries.filter(({ url }) => url.includes("/research/") && url !== "https://museum.example/research"),
    ).toHaveLength(66);
    expect(entries.every(({ url }) => !/[?#]/u.test(url))).toBe(true);
  });

  it.each(["disabled", "private"] as const)(
    "removes a %s exhibit and all of its records from the sitemap",
    (state) => {
      const atlas = getExhibitBySlug("atlas-of-worlds")!;
      const originalEnabled = atlas.enabled;
      const originalAccess = atlas.access;

      try {
        if (state === "disabled") atlas.enabled = false;
        if (state === "private") atlas.access = { mode: "private" };

        const entries = sitemap();
        expect(entries).toHaveLength(63);
        expect(
          entries.some(({ url }) => url.includes("/exhibits/atlas-of-worlds")),
        ).toBe(false);
        expect(
          entries.some(({ url }) => url.includes("/research/atlas-of-worlds/")),
        ).toBe(false);
      } finally {
        atlas.enabled = originalEnabled;
        atlas.access = originalAccess;
      }
    },
  );

  it("retains member exhibit and record canonicals in the sitemap", () => {
    const atlas = getExhibitBySlug("atlas-of-worlds")!;
    const originalAccess = atlas.access;

    try {
      atlas.access = {
        mode: "members",
        gateLabel: "Members' observatory",
        gateDescription: "Sign in to use the interactive observatory.",
      };

      const entries = sitemap();
      expect(entries).toHaveLength(74);
      expect(entries).toContainEqual({
        url: "https://museum.example/exhibits/atlas-of-worlds",
        lastModified: "2026-08-21T00:00:00.000Z",
      });
      expect(entries).toContainEqual({
        url: "https://museum.example/research/atlas-of-worlds/mars",
        lastModified: "2026-08-24",
      });
    } finally {
      atlas.access = originalAccess;
    }
  });

  it("describes Loupe as an installable museum", () => {
    expect(manifest()).toMatchObject({
      name: "Loupe Digital Museum",
      short_name: "Loupe",
      start_url: "/",
      display: "standalone",
    });
  });
});
