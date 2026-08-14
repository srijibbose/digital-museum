import { expect, test } from "@playwright/test";

const route = "/exhibits/thirteen-minutes";

test("renders the complete exhibit without browser errors or external assets", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto(route);
  await page.waitForLoadState("networkidle");

  await expect(page.getByRole("heading", { name: "Thirteen Minutes" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Program alarm" })).toBeAttached();
  await expect(page.getByRole("heading", { name: "Keep what matters most." })).toBeAttached();
  await expect(page.getByText(/insert the real URL before publishing/i)).toBeVisible();
  expect(errors).toEqual([]);

  const unexpectedResources = await page.evaluate(() =>
    performance
      .getEntriesByType("resource")
      .map((entry) => entry as PerformanceResourceTiming)
      .filter((entry) => {
        const type = entry.initiatorType;
        return ["font", "img", "audio", "video"].includes(type) || !entry.name.startsWith(location.origin);
      })
      .map((entry) => entry.name),
  );
  expect(unexpectedResources).toEqual([]);
});

test("updates the HUD in both scroll directions and mirrors non-scroll navigation", async ({ page }) => {
  await page.goto(route);
  const timeline = page.getByTestId("timeline");

  await page.getByTestId("beat-touchdown").evaluate((element) =>
    element.scrollIntoView({ block: "center", behavior: "instant" }),
  );
  await expect(timeline).toHaveAttribute("data-active-beat", "touchdown");

  await page.getByTestId("beat-program-alarm").evaluate((element) =>
    element.scrollIntoView({ block: "center", behavior: "instant" }),
  );
  await expect(timeline).toHaveAttribute("data-active-beat", "program-alarm");

  await page.getByRole("button", { name: /go to manual control/i }).click();
  await expect(timeline).toHaveAttribute("data-active-beat", "manual-control");
  await expect(page.getByTestId("mission-hud").getByLabel("102:43:22")).toBeVisible();

  await page.getByRole("button", { name: /previous: the go call/i }).click();
  await expect(timeline).toHaveAttribute("data-active-beat", "go-call");
});

test("supports keyboard beat navigation", async ({ page }) => {
  await page.goto(route);
  const timeline = page.getByTestId("timeline");
  await page.locator("body").click({ position: { x: 8, y: 8 } });

  await page.keyboard.press("End");
  await expect(timeline).toHaveAttribute("data-active-beat", "touchdown");
  await page.keyboard.press("ArrowUp");
  await expect(timeline).toHaveAttribute("data-active-beat", "manual-control");
  await page.keyboard.press("Home");
  await expect(timeline).toHaveAttribute("data-active-beat", "approach");
});

test("is readable with reduced motion on a narrow touch viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(route);

  await expect(page.getByTestId("timeline")).toHaveAttribute("data-reduced-motion", "true");
  await expect(page.getByLabel("Touchdown static telemetry")).toBeVisible();
  await expect(page.getByTestId("mission-hud")).toBeHidden();
  const noOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
  );
  expect(noOverflow).toBe(true);
});

test("keeps the mobile progress strip clear of telemetry and the active heading", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(route);
  await page.getByTestId("beat-course-check").evaluate((element) =>
    element.scrollIntoView({ block: "center", behavior: "instant" }),
  );
  await expect(page.getByTestId("timeline")).toHaveAttribute("data-active-beat", "course-check");

  const hud = await page.getByTestId("mission-hud").boundingBox();
  const rail = await page.getByRole("navigation", { name: "Mission progress" }).boundingBox();
  const heading = await page.getByRole("heading", { name: "Course check" }).boundingBox();
  expect(hud).not.toBeNull();
  expect(rail).not.toBeNull();
  expect(heading).not.toBeNull();
  expect(rail!.y).toBeGreaterThanOrEqual(hud!.y + hud!.height - 1);
  expect(heading!.y).toBeGreaterThanOrEqual(rail!.y + rail!.height);
});

test("keeps every beat and its telemetry visible without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(route);

  await expect(page.getByRole("heading", { name: "Thirteen Minutes" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Touchdown" })).toBeVisible();
  await expect(page.getByLabel("Touchdown static telemetry")).toBeVisible();
  await expect(page.getByLabel("Touchdown static telemetry")).toContainText("102:45:40");
  await context.close();
});
