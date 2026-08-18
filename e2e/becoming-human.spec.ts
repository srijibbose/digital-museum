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
  await expect(page.getByRole("heading", { name: "The Shared Branch" })).toBeVisible();

  await page.getByRole("button", { name: "MAP" }).click();
  await expect(page.getByRole("dialog", { name: "Research atlas" })).toBeVisible();
  await page.getByRole("button", { name: /30 Fossil Energy Multiplies Work/ }).click();
  await expect(page.getByRole("heading", { name: "Fossil Energy Multiplies Work" })).toBeVisible();
  await expect(page.getByText(/Jack Delano \/ Library of Congress/)).toBeVisible();

  await page.getByRole("button", { name: "MAP" }).click();
  await page.getByRole("button", { name: /35 From Rules to Learned Patterns/ }).click();
  await page.getByRole("button", { name: /TRY THE IDEA/ }).click();
  await expect(page.getByRole("slider")).toBeVisible();
  await page.getByRole("button", { name: "Close panel" }).click();
  await page.getByRole("button", { name: "Next episode" }).click();
  await expect(page.getByRole("heading", { name: "What Changed Fastest?" })).toBeVisible();
  await expect(page.getByRole("button", { name: "ERASE MY LOCAL VISIT DATA" })).toBeVisible();
  expect(runtimeErrors).toEqual([]);
});

test("supports a portrait deep link without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/exhibits/becoming-human#episode-projectiles-and-hunt");

  await expect(page.getByRole("heading", { name: "The Hunt at a Distance" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Next episode" })).toBeVisible();
  const viewport = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(viewport.scrollWidth).toBeLessThanOrEqual(viewport.clientWidth);

  await page.getByRole("button", { name: "INSPECT THE RECORD" }).click();
  await expect(page.getByRole("dialog", { name: /Hunt at a Distance evidence/ })).toBeVisible();
  await expect(page.getByRole("img", { name: /Schöningen/ })).toBeVisible();
});
