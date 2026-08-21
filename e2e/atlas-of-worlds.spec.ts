import { expect, test } from "@playwright/test";

const route = "/exhibits/atlas-of-worlds?world=moon";

test("completes the core planetary-instrument journey", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto(route);
  await expect(page.getByRole("navigation", { name: "World Index" })).toBeVisible();
  await expect(page.getByRole("complementary", { name: "Field Guide" })).toBeVisible();

  await page
    .getByRole("navigation", { name: "World Index" })
    .getByRole("button", { name: /^Earth,/ })
    .click();
  await expect(page).toHaveURL(/world=earth/);
  await page.getByRole("tab", { name: "Night lights" }).click();
  await page.getByRole("button", { name: "Explore Nile at night" }).click();
  await expect(page.getByRole("complementary", { name: "Field Guide" })).toContainText(
    "Nile at night",
  );

  await page.getByRole("button", { name: "Compare worlds" }).click();
  await page.getByRole("combobox", { name: "Compare with" }).selectOption("mars");
  await page.getByLabel("Relative size").check();
  await expect(page.getByTestId("compare-tray")).toContainText("Mars");

  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await expect(page.getByTestId("atlas-instrument")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "Zoom in" }).click();
  await expect(page.getByTestId("atlas-stage")).toHaveAttribute("data-camera-command", "zoom-in");
  await page.getByRole("button", { name: "Reset view" }).click();
  await expect(page.getByTestId("atlas-stage")).toHaveAttribute("data-camera-command", "reset");

  expect(errors).toEqual([]);
  const externalResources = await page.evaluate(() =>
    performance
      .getEntriesByType("resource")
      .map((entry) => entry.name)
      .filter((url) => !url.startsWith(location.origin)),
  );
  expect(externalResources).toEqual([]);
});

test("keeps the complete inspection path usable at 390 by 844", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(route);

  const worldIndex = page.getByRole("navigation", { name: "World Index" });
  await expect(worldIndex.getByRole("button", { name: /^Moon,/ })).toBeVisible();
  await expect(page.getByRole("button", { name: "Zoom in" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "Surface" })).toBeVisible();

  await page.getByRole("tab", { name: "Missions" }).click();
  await page.getByRole("button", { name: "Explore Apollo 11" }).click();
  await page
    .getByRole("complementary", { name: "Field Guide" })
    .scrollIntoViewIfNeeded();
  await expect(page.getByRole("complementary", { name: "Field Guide" })).toContainText(
    "Apollo 11",
  );

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});

test("preserves old Earth and Moon links as permanent world selections", async ({ request }) => {
  const earth = await request.get("/exhibits/earth", { maxRedirects: 0 });
  const moon = await request.get("/exhibits/moon", { maxRedirects: 0 });

  expect(earth.status()).toBe(308);
  expect(earth.headers().location).toBe("/exhibits/atlas-of-worlds?world=earth");
  expect(moon.status()).toBe(308);
  expect(moon.headers().location).toBe("/exhibits/atlas-of-worlds?world=moon");
});
