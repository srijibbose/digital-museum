import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  page.on("console", (message) => {
    if (message.type() === "error") console.info("browser console:", message.text());
  });
  page.on("pageerror", (error) => console.info("browser page error:", error.message));
  page.on("requestfailed", (request) =>
    console.info("browser request failed:", request.url(), request.failure()?.errorText),
  );
  page.on("response", (response) => {
    if (response.status() >= 400) {
      console.info("browser response:", response.status(), response.url());
    }
  });
});

test("walks from the museum lobby through the complete Living Atlas", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await expect(page.getByRole("heading", { name: /look closer/i })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "The Living Atlas", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "Thirteen Minutes", exact: true }),
  ).toBeVisible();

  await page.goto("/exhibits/living-atlas");
  await expect(page.getByRole("heading", { name: "The Living Atlas" })).toBeVisible();
  await page.getByRole("button", { name: /begin the journey/i }).click();

  await expect(
    page.getByRole("heading", { name: /where does the outside world end/i }),
  ).toBeVisible();
  await expect(page.locator("canvas")).toHaveCount(1);
  await page.getByRole("button", { name: /next: signal/i }).click();
  await page.getByRole("button", { name: /explore brain/i }).click();
  await expect(page.getByRole("dialog", { name: /brain/i })).toBeVisible();
  await page.getByRole("button", { name: /close organ detail/i }).click();

  for (const nextLabel of [
    /next: breath/i,
    /next: pulse/i,
    /next: fuel & motion/i,
    /next: together/i,
    /complete the journey/i,
  ]) {
    await page.getByRole("button", { name: nextLabel }).click();
  }

  await expect(page.getByRole("heading", { name: /you are a conversation/i })).toBeVisible();
  await page.getByRole("button", { name: /restart journey/i }).click();
  await expect(page.getByText("01 / 06")).toBeVisible();
});

test("offers a complete canvas-free experience on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/exhibits/living-atlas");
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: /use simplified view/i }).click();

  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.getByRole("img", { name: /warm porcelain outer layer/i })).toBeVisible();
  await page.getByRole("button", { name: /reduce motion/i }).click();
  await expect(page.getByRole("button", { name: /enable full motion/i })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.getByRole("button", { name: /next: signal/i }).click();
  await expect(page.getByText("02 / 06")).toBeVisible();
});
