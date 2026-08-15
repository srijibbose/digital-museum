import { expect, test } from "@playwright/test";

const route = "/exhibits/full-throttle";

// Continuous WebGL frames make Playwright's trace screencast dominate the run;
// DOM assertions and failure screenshots provide the useful evidence here.
test.use({ trace: "off" });

test("publishes Apollo and Full Throttle from the registry while hiding Living Atlas", async ({ page }) => {
  await page.goto("/");

  const exhibitLinks = page.locator('a[href^="/exhibits/"]');
  await expect(exhibitLinks).toHaveCount(2);
  await expect(page.getByRole("link", { name: /Thirteen Minutes/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Full Throttle/ })).toBeVisible();
  await expect(page.getByText("Living Atlas")).toHaveCount(0);
});

test("loads the detailed engine and completes all three acts without browser errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto(route);
  await page.waitForLoadState("networkidle");

  await expect(page.getByRole("heading", { name: "Full Throttle" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Take it apart" })).toBeAttached();
  await expect(page.locator("canvas").or(page.getByAltText(/cutaway diagram/i))).toBeVisible();

  await page.getByRole("button", { name: "Combustor", exact: true }).click({ noWaitAfter: true });
  await expect(page.getByRole("article")).toContainText("continuous flame");
  await expect(page.getByText("1 of 7 explored")).toBeVisible();

  await page.getByRole("button", { name: /Make it breathe/ }).click({ noWaitAfter: true });
  await page.getByRole("button", { name: /The turbines/ }).click({ noWaitAfter: true });
  await expect(page.getByRole("article")).toContainText("Two shafts close the loop");

  await page.getByRole("button", { name: /Take the throttle/ }).click({ noWaitAfter: true });
  await page.getByRole("button", { name: "Takeoff", exact: true }).click({ noWaitAfter: true });
  await expect(page.getByLabel("Engine throttle")).toHaveValue("100");
  await expect(page.getByLabel("Relative engine response")).toContainText("100%");
  expect(errors).toEqual([]);

  // Dispose the continuously-rendering WebGL context before Playwright tears down
  // its traced page; Windows Chromium can otherwise stall while releasing the GPU.
  await page.goto("about:blank", { waitUntil: "commit" });
});

test("keeps the full experience usable at a narrow touch viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(route);

  await expect(page.getByRole("heading", { name: "Full Throttle" })).toBeVisible();
  await page.getByRole("link", { name: /Open the engine/ }).click();
  await expect(page.getByRole("button", { name: /Make it breathe/ })).toBeVisible();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
