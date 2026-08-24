import { expect, test } from "@playwright/test";

test.use(process.env.CI ? {} : { channel: "chrome" });

test("keeps the featured rail compact and scrollable on a portrait homepage", async ({ page }) => {
  for (const width of [320, 390, 430]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");

    const featured = page.getByRole("region", { name: "Featured exhibits" });
    await expect(featured).toBeVisible();

    const layout = await featured.evaluate((section) => {
      const cards = [...section.querySelectorAll<HTMLElement>("article")];
      const rail = cards[0]?.parentElement as HTMLElement | undefined;
      const visualHeights = cards.map((card) =>
        card.querySelector<HTMLElement>(".exhibit-card__visual")?.getBoundingClientRect().height ?? 0,
      );
      const cardHeights = cards.map((card) => card.getBoundingClientRect().height);

      return {
        pageOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        railScrollable: (rail?.scrollWidth ?? 0) > (rail?.clientWidth ?? 0),
        visualHeights,
        cardHeights,
      };
    });

    expect(layout.visualHeights).toHaveLength(5);
    expect(layout.pageOverflow).toBeLessThanOrEqual(0);
    expect(layout.railScrollable).toBe(true);
    expect(Math.max(...layout.visualHeights)).toBeLessThanOrEqual(300);
    expect(Math.max(...layout.visualHeights) - Math.min(...layout.visualHeights)).toBeLessThanOrEqual(2);
    expect(Math.max(...layout.cardHeights)).toBeLessThanOrEqual(650);
  }
});

test("uses graphic icons instead of emoji-like glyphs for homepage quick paths", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const quickPaths = page.getByRole("navigation", { name: "Quick ways to explore" });
  await expect(quickPaths.locator("a svg")).toHaveCount(4);
  await expect(quickPaths.locator("a").evaluateAll((links) =>
    links.map((link) => getComputedStyle(link, "::after").content),
  )).resolves.toEqual(["none", "none", "none", "none"]);
});
