import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear());
});

test("moves from the threshold to research mode and the finale", async ({ page }) => {
  const runtimeErrors: string[] = [];
  page.on("pageerror", (error) => runtimeErrors.push(error.message));

  await page.goto("/exhibits/becoming-human");
  await expect(page.getByRole("heading", { name: /becoming human/i })).toBeVisible();
  await page.getByRole("button", { name: "BEGIN QUIET" }).click();
  await expect(page.getByRole("heading", { name: "The Human Lineage Begins" })).toBeVisible();

  await page.getByRole("button", { name: "MAP" }).click();
  await expect(page.getByRole("dialog", { name: "Research atlas" })).toBeVisible();
  await page.getByRole("button", { name: /30 Fossil Fuels Multiply Human Power/ }).click();
  await expect(page.getByRole("heading", { name: "Fossil Fuels Multiply Human Power" })).toBeVisible();
  await expect(page.getByText(/Jack Delano \/ Library of Congress/)).toBeVisible();

  await page.getByRole("button", { name: "MAP" }).click();
  await page.getByRole("button", { name: /35 AI Learns from Human Data/ }).click();
  await page.getByRole("button", { name: /EXPLORE THIS STEP/ }).click();
  await expect(page.getByRole("slider")).toBeVisible();
  await page.getByRole("button", { name: "Close panel" }).click();
  await page.getByRole("button", { name: "Next episode" }).click();
  await expect(page.getByRole("heading", { name: "How Humans Reached the Present" })).toBeVisible();
  await expect(page.getByRole("button", { name: "ERASE MY LOCAL VISIT DATA" })).toBeVisible();
  expect(runtimeErrors).toEqual([]);
});

test("supports a portrait deep link without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/exhibits/becoming-human#episode-projectiles-and-hunt");

  await expect(page.getByRole("heading", { name: "Spears and Bows Change Hunting" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Next episode" })).toBeVisible();
  const viewport = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(viewport.scrollWidth).toBeLessThanOrEqual(viewport.clientWidth);

  await page.getByRole("button", { name: "SEE THE EVIDENCE" }).click();
  await expect(page.getByRole("dialog", { name: /Spears and Bows Change Hunting evidence/ })).toBeVisible();
  await expect(page.getByRole("img", { name: /Schöningen/ })).toBeVisible();
});

test("keeps dates legible and the deep-time atlas usable on portrait screens", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/exhibits/becoming-human#episode-trackmakers");

  await expect(page.getByText("WHEN")).toBeVisible();
  await expect(page.getByText("3.66 MILLION YEARS AGO").first()).toBeVisible();
  await page.getByRole("button", { name: "TIME" }).click();

  const atlas = page.getByRole("dialog", { name: "Research atlas" });
  await expect(atlas.getByText(/Earth is about 4.54 billion years old/i)).toBeVisible();
  const humanTimeline = atlas.getByLabel("Scrollable human evolution timeline");
  await expect(humanTimeline).toBeVisible();
  const timelineSize = await humanTimeline.evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
  }));
  expect(timelineSize.scrollWidth).toBeGreaterThan(timelineSize.clientWidth);

  await atlas.getByRole("button", { name: /28.*Printing Copies Knowledge at Scale/i }).click();
  await expect(page.getByRole("heading", { name: "Printing Copies Knowledge at Scale" })).toBeVisible();
});
