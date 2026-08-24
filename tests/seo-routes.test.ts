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

  it("advertises the absolute sitemap and excludes private surfaces", () => {
    const output = robots();
    const rules = Array.isArray(output.rules) ? output.rules[0] : output.rules;

    expect(output.sitemap).toBe("https://museum.example/sitemap.xml");
    expect(rules.disallow).toEqual(
      expect.arrayContaining(["/api/", "/api/private/", "/auth/", "/internal/"]),
    );
  });

  it("sitemaps only discoverable canonical exhibits", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain("https://museum.example/exhibits/atlas-of-worlds");
    expect(urls.some((url) => url.includes("?"))).toBe(false);
    expect(urls.some((url) => url.includes("sign-in"))).toBe(false);
    expect(urls.some((url) => url.includes("/api/"))).toBe(false);
    expect(entries).toContainEqual({
      url: "https://museum.example/exhibits/atlas-of-worlds",
      lastModified: "2026-08-21T00:00:00.000Z",
    });
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
