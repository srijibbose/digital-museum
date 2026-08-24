import { expect, test } from "@playwright/test";

const route = "/exhibits/jet-engine";

test("moves from a sourced 3D reconstruction to modelled airflow without remote assets", async ({ page }) => {
  // Chromium's headless software WebGL path is substantially slower than a
  // hardware-accelerated browser while the 235k-triangle scene is animating.
  test.setTimeout(240_000);
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" && !message.text().startsWith("Failed to load resource")) errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    const path = new URL(response.url()).pathname;
    if (response.status() >= 400 && !path.startsWith("/_vercel/")) errors.push(`${response.status()} ${response.url()}`);
  });

  await page.goto(route);
  await expect(page.getByRole("region", { name: "Jet Engine interactive exhibit" })).toBeVisible();
  await expect(page.getByRole("img", { name: /Interactive three-dimensional high-bypass turbofan/ })).toBeVisible();
  const stage = page.getByTestId("jet-engine-3d-stage");
  await expect(stage).toBeVisible();
  await expect(stage).toHaveAttribute("data-ready", "true", { timeout: 35_000 });
  await page.getByRole("button", { name: "Pause airflow animation" }).click({ force: true });
  await expect(page.getByRole("region", { name: "Jet Engine interactive exhibit" })).toHaveAttribute("data-motion", "paused");
  // Assert the resulting React state directly after each camera command.
  await page.getByRole("button", { name: "Set intake camera" }).click({ force: true });
  await expect(stage).toHaveAttribute("data-camera", "front");
  await page.getByRole("button", { name: "Reset 3D camera" }).click({ force: true });
  await expect(stage).toHaveAttribute("data-camera", "reset");
  await page.getByRole("complementary", { name: "Flow stations" }).getByRole("button", { name: /Turbine inlet/ }).click({ force: true });
  await expect(page.getByRole("heading", { level: 2, name: "Burner exit and turbine inlet" })).toBeVisible();
  await page.getByRole("button", { name: "Airflow", exact: true }).click({ force: true });
  await expect(page.getByRole("button", { name: "Airflow", exact: true, pressed: true })).toBeVisible();
  await page.getByRole("button", { name: /Takeoff/ }).click({ force: true });
  await expect(page.getByRole("button", { name: /Takeoff/, pressed: true })).toBeVisible();
  await page.getByRole("button", { name: "Toggle source notebook" }).click({ force: true });
  await expect(
    page
      .getByRole("complementary", { name: "Burner exit and turbine inlet" })
      .getByRole("link", { name: /Gas Turbine Schematic and Station Numbers/ }),
  ).toBeVisible();

  expect(errors).toEqual([]);
  const externalResources = await page.evaluate(() =>
    performance.getEntriesByType("resource").map((entry) => entry.name).filter(
      (url) => !url.startsWith(location.origin) && !url.startsWith("https://va.vercel-scripts.com/"),
    ),
  );
  expect(externalResources).toEqual([]);
});

test("keeps the full instrument usable at 390 by 844", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(route);
  await expect(page.getByRole("img", { name: /Interactive three-dimensional high-bypass turbofan/ })).toBeVisible();
  await page.getByRole("complementary", { name: "Flow stations" }).getByRole("button", { name: /Core nozzle/ }).click();
  await expect(page.getByRole("heading", { level: 2, name: "Core nozzle throat" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Thermal" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Cruise/ })).toBeVisible();

  const layout = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    stationRailScrollable: (() => {
      const rail = document.querySelector('[aria-label="Flow stations"] ol');
      return (rail?.scrollWidth ?? 0) > (rail?.clientWidth ?? 0);
    })(),
  }));
  expect(layout.overflow).toBeLessThanOrEqual(0);
  expect(layout.stationRailScrollable).toBe(true);
});

test("defaults to dark mode, pauses motion, and remembers an explicit light choice", async ({ page }) => {
  await page.goto(route);
  const exhibit = page.getByRole("region", { name: "Jet Engine interactive exhibit" });
  await expect(exhibit).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "Pause airflow animation" }).click();
  await expect(exhibit).toHaveAttribute("data-motion", "paused");
  await page.getByRole("button", { name: "Switch to light mode" }).click();
  await expect(exhibit).toHaveAttribute("data-theme", "light");
  await page.reload();
  await expect(exhibit).toHaveAttribute("data-theme", "light");
});

test("starts with motion paused when the visitor requests reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(route);
  await expect(page.getByRole("region", { name: "Jet Engine interactive exhibit" })).toHaveAttribute(
    "data-motion",
    "paused",
  );
  await expect(page.getByRole("button", { name: "Play airflow animation" })).toBeVisible();
});
