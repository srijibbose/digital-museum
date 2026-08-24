import { afterEach, beforeEach, describe, expect, it } from "vitest";
import manifest from "@/app/manifest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";

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

  it("sitemaps exactly home, catalog, and discoverable canonical exhibits", () => {
    const entries = sitemap();

    expect(entries).toEqual([
      { url: "https://museum.example/" },
      { url: "https://museum.example/exhibits" },
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
    ]);
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
