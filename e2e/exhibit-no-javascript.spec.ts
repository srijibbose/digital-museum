import { expect, test } from "@playwright/test";
import { getExhibitBySlug } from "../content/exhibits";

const visitors = [
  {
    name: "visitor",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140.0 Safari/537.36",
  },
  {
    name: "Googlebot",
    userAgent: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  },
  { name: "OAI search agent", userAgent: "OAI-SearchBot/1.0" },
  { name: "Claude search agent", userAgent: "Claude-SearchBot/1.0" },
  { name: "Perplexity search agent", userAgent: "PerplexityBot/1.0" },
] as const;

function publicExhibit(
  slug: "atlas-of-worlds" | "human-anatomy" | "jet-engine" | "becoming-human" | "thirteen-minutes",
  publicEdition: string,
  recordLinks: number,
  query = "",
) {
  const exhibit = getExhibitBySlug(slug);
  if (!exhibit) throw new Error(`Unknown public exhibit ${slug}`);
  const escapedTitle = exhibit.title.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
  return {
    heading: new RegExp(`^${escapedTitle}$`, "iu"),
    publicEdition,
    recordLinks,
    route: `${exhibit.route}${query}`,
  };
}

const exhibits = [
  publicExhibit("atlas-of-worlds", "#atlas-transcript", 0, "?world=mars"),
  publicExhibit("human-anatomy", "#anatomy-transcript", 0),
  publicExhibit("jet-engine", "#jet-engine-reading-edition", 7),
  publicExhibit("becoming-human", "#becoming-human-reading-edition", 35),
  publicExhibit("thirteen-minutes", "#mission-context", 0),
];

for (const visitor of visitors) {
  test.describe(visitor.name, () => {
    test.use({
      javaScriptEnabled: false,
      userAgent: visitor.userAgent,
      viewport: { width: 390, height: 844 },
    });

    test("receives every public exhibit without a client-side streaming swap", async ({ page }) => {
      for (const exhibit of exhibits) {
        const response = await page.goto(exhibit.route, { waitUntil: "domcontentloaded" });

        expect(response?.status(), exhibit.route).toBe(200);
        await expect(
          page.getByRole("heading", { level: 1, name: exhibit.heading, exact: true }).first(),
        ).toBeVisible();
        await expect(page.locator(exhibit.publicEdition)).toBeVisible();
        await expect(page.locator("main")).toHaveCount(1);
        await expect(page.locator('a[href^="/research/"]')).toHaveCount(exhibit.recordLinks);

        const layout = await page.evaluate(() => ({
          hiddenResolvedSegments: document.querySelectorAll('[hidden][id^="S:"]').length,
          pendingStreamingBoundaries: document.querySelectorAll('template[id^="B:"]').length,
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          loadingShells: document.querySelectorAll('[aria-busy="true"]').length,
        }));

        expect(layout, exhibit.route).toEqual({
          hiddenResolvedSegments: 0,
          pendingStreamingBoundaries: 0,
          overflow: 0,
          loadingShells: 0,
        });
      }
    });
  });
}
